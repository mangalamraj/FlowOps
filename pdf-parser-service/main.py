import asyncio
import tempfile
import os
from dotenv import load_dotenv
from pathlib import Path
import json
from fastapi import FastAPI, UploadFile, File, Body
from services.walmartServices.pdf_parser import extract_pages
from services.walmartServices.llm_rules import batch_by_page, extract_rules_from_batch, dedupe_rules, filter_rules_by_sku, classify_rules, validate_dimensions
from utils.walmartUtils.extractorObject import EXTRACTOBJECT
from db.index import connect_db, close_db, getorg_details, getpdf_details, getsku_rules, addsku_rules



ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=ENV_PATH)

HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", 8001))

app = FastAPI(title="PDF Topic Categorizer")

@app.on_event("startup")
async def startup():
    await connect_db()

@app.on_event("shutdown")
async def shutdown():
    await close_db()

@app.post("/categorize-pdf")
async def categorize_pdf(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        pdf_path = tmp.name
    extracted_data = await extract_pages(pdf_path)
    os.unlink(pdf_path)

    return {
        "total_pages": "",
        "categories": ""
    }

@app.post("/get-rules")
async def get_rules(data:dict = Body(...)):
    tags = data['labelData']['tags']
    sku = data['labelData']['sku']
    orderid = data["labelData"]['orderid']
    pagenumbers = []
    headings = []
    for key in tags:
        if key in EXTRACTOBJECT:
            for heading in EXTRACTOBJECT[key]['headings']:
                headings.append(heading)

    db_headings = await getorg_details("Walmart")

    if db_headings is None:
        return {"message": "Headings does not exists"}
    headings_pageno = json.loads(db_headings["headings"])["headings"]
    for item in headings_pageno:
        if  item['text'] in headings:
            pagenumbers.append(item['page'])

    pdfcontent = await getpdf_details("Walmart")
    existingRules = await getsku_rules(orderid)
    if(getsku_rules!=None):
        return {
            "rules": existingRules['rules'],
            "dimensionrules": existingRules['dimensionrules']
        }
    if(pdfcontent is None):
        return {"status": "failed", "message": "PDF content not found in the db"}
    
    selectedcontent = []
    for number in pagenumbers:
        for data in pdfcontent:
            if data["page"] ==  number:
                selectedcontent.append(data)
    
    batches = batch_by_page(selectedcontent)
    

    extracted_batches = await asyncio.gather(
        *[extract_rules_from_batch(b) for b in batches]
    )

    all_rules = dedupe_rules(extracted_batches)

    if not all_rules:
        return {"status": "ok", "data": {"rules": [], "labelrules": []}}
    

    applicable_rules = await filter_rules_by_sku(all_rules, sku)

    classified = await classify_rules(applicable_rules)
    dimensions = validate_dimensions(classified['dimensionrules'])
    rows = await addsku_rules(orderid, classified, dimensions)
    

    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT)
