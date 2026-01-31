from ultralytics import YOLO

model = YOLO("yolov8s.pt")

model.train(
    data= "datasets/data.yaml",
    epochs=40,
    imgsz= 960,
    batch= 4,
    device= "cpu",
    workers=4
)