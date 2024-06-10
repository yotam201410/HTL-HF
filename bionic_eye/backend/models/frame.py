import uuid
from sqlalchemy import Text, Integer, CheckConstraint, ForeignKey,UUID
from sqlalchemy.orm import relationship
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base
from .metadata import Metadata


class Frame(Base):
    __tablename__ = "frames"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    storage_path: Mapped[str] = mapped_column(Text, nullable=False)
    frame_index: Mapped[int] = mapped_column(Integer, CheckConstraint('frame_index>0'), nullable=False)
    video_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("videos.id"))
    metadata_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("metadata.id"))

    video: Mapped["Video"] = relationship("Video", back_populates="frames")
    metadata_: Mapped["Metadata"] = relationship("Metadata", back_populates="frames")
