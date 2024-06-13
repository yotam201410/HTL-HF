import uuid

from sqlalchemy import Text, Integer, CheckConstraint, UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship

from .base import Base
from .frame import Frame


class Video(Base):
    __tablename__ = "videos"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    observation_name: Mapped[str] = mapped_column(Text, nullable=False)
    frame_count: Mapped[int] = mapped_column(Integer, CheckConstraint('frame_count>0'), nullable=False)
    storage_path: Mapped[str] = mapped_column(Text, nullable=False)

    frames: Mapped[list["Frame"]] = relationship("Frame", back_populates="video", cascade="all, delete-orphan", lazy='selectin')

    def __repr__(self):
        return f"<Video(id={self.id}, observation_name={self.observation_name}, frame_count={self.frame_count})>"
