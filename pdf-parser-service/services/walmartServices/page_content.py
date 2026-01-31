import pymupdf
from utils.walmartUtils.helpers import clean_pdf_data
import re
import hashlib
IGNORE_PREFIXES = [
    "example", "note", "illustration", "figure"
]

def normalize(text):
    text = text.lower()
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[^\w\s]", "", text)
    return text.strip()

def is_llm_worthy(text):
    if len(text) < 50:
        return False
    if text.count(" ") < 8:
        return False
    return True


def generate_rule_id(text: str) -> str:
    norm = normalize(text)
    h = hashlib.md5(norm.encode("utf-8")).hexdigest()[:10]
    return f"rule_{h}"

def dedupe_candidates(candidates):
    seen = set()
    unique = []

    for c in candidates:
        if c["id"] in seen:
            continue
        seen.add(c["id"])
        unique.append(c)

    return unique

def is_example_or_note(text):
    t = text.lower().strip()
    return any(t.startswith(p) for p in IGNORE_PREFIXES)

def extract_blocks(page, clip):
    blocks = page.get_text("blocks", clip=clip)
    results = []

    for block in blocks:
        x0, y0, x1, y1, text, *_ = block
        text = clean_pdf_data(text.strip())

        if not text or len(text) < 30:
            continue

        results.append({
            "bbox": (x0, y0, x1, y1),
            "text": text
        })

    return results

def get_content(pdf_path: str):
    doc = pymupdf.open(pdf_path)
    candidates = []
    with pymupdf.open(pdf_path) as doc:
        for i, page in enumerate(doc):
            rect = page.rect
            height = rect.height

            clip = pymupdf.Rect(
                rect.x0,
                rect.y0,
                rect.x1,
                rect.y1 + height * 0.88
            )

            blocks = extract_blocks(page, clip)

            for block in blocks:
                text = block["text"]

                if is_example_or_note(text):
                    continue
                
                if not is_llm_worthy(text):
                    continue

                rule_id = generate_rule_id(text)

                candidates.append({
                    "id": rule_id,
                    "page": i+1,
                    "text": text
                })
            
    return dedupe_candidates(candidates)
