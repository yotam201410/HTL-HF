import uuid
from sqlalchemy import Integer, UUID, ForeignKey, String
from sqlalchemy.orm import relationship, Mapped, mapped_column
from bionic_eye.DB.models.base import Base


class Frame(Base):
    __tablename__ = 'frames'
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    video_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('videos.id'))
    object_storage_path: Mapped[str] = mapped_column(String, nullable=False)
    frame_index: Mapped[int] = mapped_column(Integer, nullable=False)
    metadata_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('metadata.id'))

    video: Mapped["Video"] = relationship(back_populates="frames")
    frame_metadata: Mapped["Metadata"] = relationship(back_populates="frames")
