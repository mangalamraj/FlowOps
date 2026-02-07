from utils.walmartUtils.helpers import extract_heading, consolidate_heading
from services.walmartServices.page_content import get_content
from db.index import getpdf_details, addpdf_details
import pymupdf

from db.index import insert_org, getpdf_headings

async def extract_pages(pdf_path: str):
    doc = pymupdf.open(pdf_path)
    try:
        headings = extract_heading(doc)
        heading_text = headings.get("heading_text", [])
        consolidated_data = consolidate_heading(heading_text)
        data = await getpdf_headings("Walmart")
        if data is None:
            await insert_org("Walmart", headings)
        else:
            print("Data Exists")
        fullData = get_content(pdf_path)
        getcontentfromdb = await getpdf_details("Walmart")
        if getcontentfromdb is None:
            await addpdf_details("Walmart", fullData)
        return consolidated_data
    finally:
        doc.close() 