"""
LeafScan YOLOv8 Classification Model Training Script
=====================================================
Trains a YOLOv8 classification model on the PlantVillage dataset.

Dataset path: D:/Plant_leave_diseases_dataset_with_augmentation
Output model: backend/models/model.yolov8

Usage:
    cd d:/LeafScan/backend
    venv\\Scripts\\python.exe train_model.py

Requirements:
    pip install ultralytics torch torchvision pillow
"""

import os
import sys
import shutil
import random
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("leafscan.trainer")

# ─── Configuration ─────────────────────────────────────────────────────────────
DATASET_SOURCE = Path("D:/Plant_leave_diseases_dataset_with_augmentation")
DATASET_PREPARED = Path("D:/LeafScan/backend/dataset")
MODEL_OUTPUT_DIR = Path("D:/LeafScan/backend/models")
MODEL_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

TRAIN_SPLIT = 0.80   # 80% training
VAL_SPLIT   = 0.20   # 20% validation
MAX_IMAGES_PER_CLASS = 500   # Cap per class to speed up training (set None for all)

# YOLOv8 training config
EPOCHS     = 30
IMG_SIZE   = 224
BATCH_SIZE = 32
BASE_MODEL = "yolov8n-cls.pt"   # nano = fastest; use yolov8s-cls.pt for better accuracy


def prepare_dataset():
    """Split dataset into train/val folders for YOLOv8."""
    if not DATASET_SOURCE.exists():
        logger.error(f"Dataset not found at: {DATASET_SOURCE}")
        logger.error("Please ensure the dataset is at D:/Plant_leave_diseases_dataset_with_augmentation")
        sys.exit(1)

    logger.info(f"Preparing dataset from: {DATASET_SOURCE}")

    # Clean and recreate dataset dirs
    if DATASET_PREPARED.exists():
        shutil.rmtree(DATASET_PREPARED)

    train_dir = DATASET_PREPARED / "train"
    val_dir   = DATASET_PREPARED / "val"
    train_dir.mkdir(parents=True)
    val_dir.mkdir(parents=True)

    class_dirs = [d for d in DATASET_SOURCE.iterdir() if d.is_dir()]
    logger.info(f"Found {len(class_dirs)} classes")

    total_train = 0
    total_val   = 0

    for class_dir in sorted(class_dirs):
        class_name = class_dir.name
        images = list(class_dir.glob("*.jpg")) + \
                 list(class_dir.glob("*.jpeg")) + \
                 list(class_dir.glob("*.png")) + \
                 list(class_dir.glob("*.JPG")) + \
                 list(class_dir.glob("*.PNG"))

        if not images:
            logger.warning(f"No images found in {class_name}, skipping.")
            continue

        # Cap images per class
        if MAX_IMAGES_PER_CLASS and len(images) > MAX_IMAGES_PER_CLASS:
            images = random.sample(images, MAX_IMAGES_PER_CLASS)

        random.shuffle(images)
        split_idx = int(len(images) * TRAIN_SPLIT)
        train_imgs = images[:split_idx]
        val_imgs   = images[split_idx:]

        # Create class subdirs
        (train_dir / class_name).mkdir(parents=True, exist_ok=True)
        (val_dir   / class_name).mkdir(parents=True, exist_ok=True)

        # Copy images
        for img in train_imgs:
            shutil.copy2(img, train_dir / class_name / img.name)
        for img in val_imgs:
            shutil.copy2(img, val_dir / class_name / img.name)

        total_train += len(train_imgs)
        total_val   += len(val_imgs)
        logger.info(f"  {class_name}: {len(train_imgs)} train, {len(val_imgs)} val")

    logger.info(f"\nDataset prepared: {total_train} train, {total_val} val images")
    logger.info(f"Saved to: {DATASET_PREPARED}")
    return str(DATASET_PREPARED)


def train():
    """Train YOLOv8 classification model."""
    try:
        from ultralytics import YOLO
    except ImportError:
        logger.error("ultralytics not installed. Run: pip install ultralytics")
        sys.exit(1)

    # Prepare dataset
    dataset_path = prepare_dataset()

    logger.info("\n" + "="*60)
    logger.info("Starting YOLOv8 Classification Training")
    logger.info("="*60)
    logger.info(f"Base model  : {BASE_MODEL}")
    logger.info(f"Dataset     : {dataset_path}")
    logger.info(f"Epochs      : {EPOCHS}")
    logger.info(f"Image size  : {IMG_SIZE}")
    logger.info(f"Batch size  : {BATCH_SIZE}")
    logger.info("="*60 + "\n")

    # Load base model
    model = YOLO(BASE_MODEL)

    # Train
    results = model.train(
        data=dataset_path,
        epochs=EPOCHS,
        imgsz=IMG_SIZE,
        batch=BATCH_SIZE,
        project=str(MODEL_OUTPUT_DIR / "runs"),
        name="leafscan_cls",
        patience=10,          # Early stopping
        save=True,
        plots=True,
        verbose=True,
        device="0" if _gpu_available() else "cpu",
    )

    # Copy best model to standard location — named model.yolov8
    best_model_src = MODEL_OUTPUT_DIR / "runs" / "leafscan_cls" / "weights" / "best.pt"
    best_model_dst = MODEL_OUTPUT_DIR / "model.yolov8"

    if best_model_src.exists():
        shutil.copy2(best_model_src, best_model_dst)
        logger.info(f"\n✅ Training complete! Model saved as: {best_model_dst}")
        logger.info("File: model.yolov8 (YOLOv8 classification weights)")
        logger.info("Restart the LeafScan backend to use the trained model.")
    else:
        logger.warning(f"Best model not found at expected path: {best_model_src}")
        logger.info("Check the runs directory for the trained model.")

    return results


def _gpu_available() -> bool:
    """Check if CUDA GPU is available."""
    try:
        import torch
        available = torch.cuda.is_available()
        if available:
            logger.info(f"GPU detected: {torch.cuda.get_device_name(0)}")
        else:
            logger.info("No GPU detected. Training on CPU (slower).")
        return available
    except ImportError:
        return False


def validate_model():
    """Validate the trained model on the validation set."""
    model_path = MODEL_OUTPUT_DIR / "model.yolov8"
    if not model_path.exists():
        logger.error(f"No trained model found at {model_path}. Run training first.")
        return

    try:
        from ultralytics import YOLO
        model = YOLO(str(model_path))
        val_path = DATASET_PREPARED / "val"
        if val_path.exists():
            metrics = model.val(data=str(DATASET_PREPARED))
            logger.info(f"Validation metrics: {metrics}")
        else:
            logger.warning("Validation dataset not found. Run prepare_dataset() first.")
    except Exception as e:
        logger.error(f"Validation failed: {e}")


def test_single_image(image_path: str):
    """Test prediction on a single image."""
    model_path = MODEL_OUTPUT_DIR / "model.yolov8"
    if not model_path.exists():
        logger.error("No trained model found. Run training first.")
        return

    try:
        from ultralytics import YOLO
        from PIL import Image

        model = YOLO(str(model_path))
        img = Image.open(image_path).convert("RGB")
        results = model(img, verbose=False)
        result = results[0]

        probs = result.probs
        top5_idx = probs.top5
        top5_conf = probs.top5conf.tolist()

        logger.info(f"\nTop 5 predictions for: {image_path}")
        for idx, conf in zip(top5_idx, top5_conf):
            class_name = result.names[idx] if result.names else f"class_{idx}"
            logger.info(f"  {class_name}: {conf*100:.2f}%")

    except Exception as e:
        logger.error(f"Test prediction failed: {e}")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="LeafScan Model Training")
    parser.add_argument("--mode", choices=["train", "validate", "test"],
                        default="train", help="Operation mode")
    parser.add_argument("--image", type=str, help="Image path for test mode")
    parser.add_argument("--epochs", type=int, default=EPOCHS, help="Training epochs")
    parser.add_argument("--batch", type=int, default=BATCH_SIZE, help="Batch size")
    parser.add_argument("--imgsz", type=int, default=IMG_SIZE, help="Image size")
    parser.add_argument("--max-images", type=int, default=MAX_IMAGES_PER_CLASS,
                        help="Max images per class (None = all)")

    args = parser.parse_args()

    # Override config from args
    EPOCHS = args.epochs
    BATCH_SIZE = args.batch
    IMG_SIZE = args.imgsz
    MAX_IMAGES_PER_CLASS = args.max_images

    if args.mode == "train":
        train()
    elif args.mode == "validate":
        validate_model()
    elif args.mode == "test":
        if not args.image:
            logger.error("--image required for test mode")
            sys.exit(1)
        test_single_image(args.image)
