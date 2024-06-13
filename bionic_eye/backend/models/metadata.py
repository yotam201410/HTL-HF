import uuid
from sqlalchemy import Boolean, Float, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Metadata(Base):
    __tablename__ = "metadata"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tagged: Mapped[bool] = mapped_column(Boolean, nullable=False)
    fov: Mapped[float] = mapped_column(Float, nullable=False)
    azimuth: Mapped[float] = mapped_column(Float, nullable=False)
    elevation: Mapped[float] = mapped_column(Float, nullable=False)

    frames: Mapped["Frame"] = relationship("Frame", back_populates="metadata_")
