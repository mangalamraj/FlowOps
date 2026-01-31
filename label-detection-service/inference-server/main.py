from fastapi import FastAPI, UploadFile, File, HTTPException
import numpy as np
import cv2
from ultralytics import YOLO

app = FastAPI(title = "Lable Detection Service")

model = YOLO('model/best.pt')

CONFIDENCE_THRESHOLD = 0.6

@app.post("/detect-label")
async def detect_label(file: UploadFile = File(...)):
    image_bytes = await file.read()
    np_img = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image")
    
    h, w, _ = img.shape
    result = model(img, conf=CONFIDENCE_THRESHOLD)

    boxes=result[0].boxes

    if boxes is None or len(boxes) == 0:
        return{
            "lable_present": False
        }
    
    box = boxes[0]
    x1, y1, x2, y2 = map(int, box.xyxy[0])

    return{
        "label_present": True,
        "confidence": float(box.conf[0]),
        "distance": {
            "left_pct": x1 / w,
            "right_pct": (w - x2) / w,
            "top_pct": y1 / h,
            "bottom_pct": (h - y2) / h
        }
    }