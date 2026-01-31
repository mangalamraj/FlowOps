import json
import os
from openai import AsyncOpenAI
from typing import List, Dict

_client = None

def get_openai_client():
    global _client
    if _client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY is not set")
        _client = AsyncOpenAI(api_key=api_key)
    return _client

async def call_llm(prompt: str) -> dict:
    client = get_openai_client()
    response = await client.responses.create(
        model="gpt-4.1-mini",
        input=prompt,
        temperature=0,
        response_format={"type": "json_object"},
    )
    return json.loads(response.choices[0].message.content)


def batch_by_page(selectedcontent: List[Dict]) -> List[Dict]:
    batched = {}

    for item in selectedcontent:
        page = item["page"]
        text = item["text"]

        if page in batched:
            batched[page] += " " + text
        else:
            batched[page] = text

    return [{"page": page, "text": text} for page, text in batched.items()]

async def extract_rules_from_batch(batch: Dict) -> Dict:
    prompt = f"""
You are a compliance rule extraction engine.

Instructions:
1. Extract ALL enforceable rules.
2. A rule must express a requirement, obligation, or prohibition.
3. Rewrite rules as short atomic statements.
4. Preserve conditions (if / when / unless).
5. Do NOT summarize or invent rules.

Return JSON ONLY:
{{
  "rules": string[]
}}

Text:
{batch["text"]}
"""
    result = await call_llm(prompt)

    return {
        "page": batch["page"],
        "rules": result.get("rules", [])
    }


def dedupe_rules(extracted_batches: List[Dict]) -> List[Dict]:
    seen = set()
    final_rules = []

    for batch in extracted_batches:
        for rule in batch["rules"]:
            key = rule.lower().strip()
            if key not in seen:
                seen.add(key)
                final_rules.append({
                    "rule": rule,
                    "page": batch["page"]
                })

    return final_rules


async def filter_rules_by_sku(rules: List[Dict], sku: str) -> List[Dict]:
    rule_texts = [r["rule"] for r in rules]

    prompt = f"""
You are a retail compliance relevance filter.

SKU (product name): {sku}

Instructions:
1. Keep rules applicable to this product type.
2. Remove rules clearly unrelated.
3. When unsure, KEEP the rule.
4. Do NOT rewrite rules.

Rules:
{json.dumps(rule_texts, indent=2)}

Return JSON ONLY:
{{
  "applicable_rules": string[]
}}
"""
    result = await call_llm(prompt)

    applicable = set(result.get("applicable_rules", []))

    return [r for r in rules if r["rule"] in applicable]

async def classify_rules(rules: List[Dict]) -> Dict:
    rule_texts = [r["rule"] for r in rules]

    prompt = f"""
Classify the following compliance rules.

Definitions:
- entity = the physical object the rule applies to (GTIN, barcode, GS1-128, ITF-14, carton, label)

Categories:

1. rules
   - NON-dimension rules
   - GTIN structure, numbering, packaging hierarchy, barcode type, quality

2. dimensionrules
   - ONLY rules that contain measurable or positional constraints
   - Convert them into structured objects with this exact schema:

{{
  "entity": GTIN | barcode | GS1-128 | ITF-14 | carton | label, 
  "constraint": "min_distance | min_size | max_size | center_if",
  "reference": "edge | bottom | center | length | height | width",
  "value": number | null,
  "unit": "inch" | null,
  "condition": string | null
}}

Rules:
{json.dumps(rule_texts, indent=2)}

Rules for dimension extraction:
1. Extract ONLY numeric / measurable constraints.
2. If a rule contains multiple measurements, split into MULTIPLE objects.
3. Convert fractions (¾ → 0.75).
4. Use "inch" unless explicitly stated otherwise.
5. Preserve conditional logic in "condition".
6. Ignore non-dimension rules completely.
7. Do NOT invent values.

Return JSON ONLY:
{{
  "rules": string[],
  "dimensionrules": [
    {{
      "entity": string,
      "constraint": string,
      "reference": string,
      "value": number | null,
      "unit": string | null,
      "condition": string | null
    }}
  ]
}}
"""
    result = await call_llm(prompt)

    return {
        "rules": result.get("rules", []),
        "dimensionrules": result.get("dimensionrules", [])
    }

def validate_dimensions(dimensions: List[Dict]) -> List[Dict]:
    return [
        d for d in dimensions
        if d.get("value") is not None
        and d.get("constraint") in {"min_distance", "min_size", "max_size", "center_if"}
    ]
