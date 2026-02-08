import asyncio
import tempfile
import os
from dotenv import load_dotenv
from pathlib import Path
import json
from fastapi import FastAPI, UploadFile, File, Body
from services.walmartServices.pdf_parser import extract_pages
from services.walmartServices.llm_rules import  process_rules_background
from utils.walmartUtils.extractorObject import EXTRACTOBJECT
from db.index import connect_db, close_db, getsku_rules, changeorder_status, checkorder_status
from fastapi import BackgroundTasks



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
async def get_rules(
    data: dict = Body(...),
    background_tasks: BackgroundTasks = None
):

    tags = data['labelData']['tags']
    sku = data['labelData']['sku']
    orderid = data["labelData"]['orderid']
    print("PROCESS STARTED FOR RULE EXTRACTION:", orderid)


    existingRules = await getsku_rules(orderid)
    if existingRules:
        return{
            "rules": existingRules["rules"],
            "dimensionrules": existingRules["dimensionrules"]
        }
    orderstatus = await checkorder_status(orderid=orderid)
    if orderstatus=="rules pending":
        return {"status": "rules pending"}
    if orderstatus in ("not verified", "failed"):
        background_tasks.add_task(
            process_rules_background,
            tags,
            sku,
            orderid
        )


    return{
        "status":"rules pending",
        "orderid": orderid
    }
        

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT)
