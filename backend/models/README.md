# LeafScan Model Directory

## Model File: `model.yolov8`

This directory stores the trained YOLOv8 classification model for plant disease detection.

### File Naming Convention
| File | Description |
|------|-------------|
| `model.yolov8` | Trained YOLOv8 classification weights (PyTorch format) |

### How to Train
```bash
cd d:/LeafScan/backend
venv\Scripts\python.exe train_model.py --mode train
```

### Requirements
- Dataset at: `D:/Plant_leave_diseases_dataset_with_augmentation`
- Python packages: `ultralytics`, `torch`, `torchvision`, `pillow`

### Model Details
- **Architecture**: YOLOv8 Classification (yolov8n-cls base)
- **Classes**: 39 plant disease classes
- **Input size**: 224×224 RGB
- **Dataset**: PlantVillage (with augmentation)
- **Crops covered**: Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato

### Status
- `model.yolov8` not yet trained — system runs in **mock prediction mode**
- Mock mode returns realistic random predictions for demo/testing
- Train the model using the script above to enable real AI predictions
