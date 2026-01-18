from fastapi import FastAPI, UploadFile, File
from services.walmartServices.pdf_parser import extract_pages
import tempfile
import os
from dotenv import load_dotenv
from pathlib import Path


ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=ENV_PATH)

HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", 8001))

app = FastAPI(title="PDF Topic Categorizer")

@app.post("/categorize-pdf")
async def categorize_pdf(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        pdf_path = tmp.name
    extracted_daata = extract_pages(pdf_path)
    os.unlink(pdf_path)

    # page_topics = []

    # for page in pages:
    #     result = classify_page(page["text"])
    #     page_topics.append({
    #         "page": page["page"],
    #         "category": result["category"]
    #     })

    # category_index = build_category_index(page_topics)

    return {
        "total_pages": "",
        "categories": ""
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT)
