import uuid
from typing import List

from pydantic.v1 import BaseModel

from bionic_eye.backend.schemas.frame import Frame


class VideoBase(BaseModel):
    observation_name: str
    storage_path: str
    frames_count: int


class VideoCreate(VideoBase):
    pass


class Video(VideoBase):
    id: uuid.UUID
    frames: List[Frame]

    class Config:
        orm_mode: True
