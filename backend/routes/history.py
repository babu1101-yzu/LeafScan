from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_active_user
import models, schemas
from typing import List

router = APIRouter(prefix="/api/history", tags=["History"])


@router.get("", response_model=List[schemas.HistoryOut])
def get_history(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    return db.query(models.SearchHistory).filter(
        models.SearchHistory.user_id == current_user.id
    ).order_by(models.SearchHistory.created_at.desc()).offset(skip).limit(limit).all()


@router.delete("/{history_id}")
def delete_history_item(
    history_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    item = db.query(models.SearchHistory).filter(
        models.SearchHistory.id == history_id,
        models.SearchHistory.user_id == current_user.id,
    ).first()
    if not item:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="History item not found")
    db.delete(item)
    db.commit()
    return {"message": "Deleted"}


@router.delete("/")
def clear_all_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    db.query(models.SearchHistory).filter(
        models.SearchHistory.user_id == current_user.id
    ).delete()
    db.commit()
    return {"message": "History cleared"}
