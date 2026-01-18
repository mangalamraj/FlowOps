from utils.walmartUtils.helpers import extract_heading, consolidate_heading

TEXT_TO_IGNORE=["table of contents", "Glossary", "cont...", "contact information", "appendix"]

def extract_pages(pdf_path: str):    
    headings = extract_heading(pdf_path)
    consolidated_data = consolidate_heading(headings)

    print(consolidated_data)


