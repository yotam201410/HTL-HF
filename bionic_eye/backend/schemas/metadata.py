import uuid

from pydantic import BaseModel


class MetadataBase(BaseModel):
    frame_tag: bool
    fov: float
    azimuth: float
    elevation: float


class MetadataCreate(BaseModel):
    pass


class Metadata(BaseModel):
    id: uuid.UUID

    class Config:
        orm_mode = True
