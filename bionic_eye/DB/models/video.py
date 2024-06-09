import uuid
from typing import List
from sqlalchemy import String, Integer, UUID
from sqlalchemy.orm import relationship, Mapped, mapped_column
from bionic_eye.DB.models.base import Base


class Video(Base):
    __tablename__ = "videos"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    observation_name: Mapped[str] = mapped_column(String, nullable=False)
    storage_path: Mapped[str] = mapped_column(String, nullable=False)
    frames_count: Mapped[int] = mapped_column(Integer, nullable=False)

    frames: Mapped[List["Frame"]] = relationship(back_populates="video")
