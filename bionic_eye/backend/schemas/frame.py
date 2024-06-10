import uuid

from pydantic import BaseModel

from bionic_eye.backend.schemas.metadata import Metadata


class FrameBase(BaseModel):
    storage_path: str
    frame_index: str


class FrameCreate(FrameBase):
    pass


class Frame(FrameBase):
    id: uuid.UUID
    metadata: Metadata

    class Config:
        orm_mode = True
