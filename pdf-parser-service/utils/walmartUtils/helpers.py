import re
import unicodedata
import pymupdf
from utils.walmartUtils.categories import CATEGORIES

TEXT_TO_IGNORE=["table of contents", "glossary", "cont...", "contact information", "appendix"]
pattern = re.compile("|".join(map(re.escape, TEXT_TO_IGNORE)), re.IGNORECASE)

def clean_pdf_data(text: str) -> str:
    text = unicodedata.normalize('NFKC', text)
    text = re.sub(r"\b\d+\s*//\s*\d+\b", "", text)
    text = text.replace("\n", " ").replace("\r", " ")
    text = re.sub(r"(.)\1+", r"\1", text)
    text = re.sub(r"([a-z])([A-Z])", r"\1 \2", text)
    text = re.sub(r"©\d{4}.*", "", text)

    boilerplate_patterns = [
        r"Supply Chain Standards.*",
        r"Walmart Retail Link.*",
        r"Table of Contents.*",
        r"Contact Information.*",
    ]
    for pattern in boilerplate_patterns:
        text = re.sub(pattern, "", text, flags=re.IGNORECASE)

    text = re.sub(r"\s+", " ", text).strip()

    return text

def extract_heading(pdf_path):
    headings = []
    headingText = []
    headingExists = set()
    pageExists = set()
    doc = pymupdf.open(pdf_path)
    with pymupdf.open(pdf_path) as doc:
        for page_num, page in enumerate(doc):
            blocks = page.get_text("dict")["blocks"]
            for block in blocks:
                if block["type"]!=0:
                    continue
                for line in block.get("lines", []):
                        full_text = " ".join(span.get("text","") for span in line.get("spans",[])).strip() 
                        norm = clean_pdf_data(full_text)
                        if any(ignore in norm for ignore in TEXT_TO_IGNORE):
                            continue
                        if pattern.search(full_text):
                            continue

                        max_span = max(line["spans"], key=lambda s: s["size"])
                        size = max_span["size"]
                        font = max_span["font"].lower()
                        
                        if (
                            len(full_text) > 3 and
                            size >= 30 and
                            ("bold" in font or full_text.isupper())                        
                            ):
                                if(full_text in headingExists or page_num+1 in pageExists):
                                    continue
                                headingExists.add(full_text)
                                pageExists.add(page_num+1)
                                headings.append({
                                            page_num+1:full_text
                                })
                                headingText.append(full_text)
                                
    return headingText

def normalize_headings(heading: str)->str:
     heading = heading.lower()
     heading = re.sub(r"cont[.…]*", "", heading)
     heading = re.sub(r"\s+", " ", heading)
     return heading.strip()

def assign_category(heading: str)->str:
    cleaned_head = normalize_headings(heading)
    for category, keywords in CATEGORIES.items():
         for keyword in keywords:
              if keyword in cleaned_head:
                   return category
    return "Uncategorized"

def consolidate_heading(headings: list[str])->dict:
     result = {}
     for heading in headings:
        if "cont" in heading.lower():
            continue
        category = assign_category(heading)
        result.setdefault(category, []).append(heading)
     return result