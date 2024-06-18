import uuid
from typing import List

from pydantic import BaseModel, Field, ConfigDict

from bionic_eye.backend.schemas.frame import Frame


class Video(BaseModel):
    id: uuid.UUID = Field(examples=["8041f36e-c80e-4ee4-84f9-65b159444c03"])
    observation_name: str = Field(examples=["north-east"])
    frame_count: int = Field(examples=[400, 500])
    storage_path: str = Field(examples=["resources\\fake\\path1.mp4"])
    frames: List[Frame]

    model_config = ConfigDict(from_attributes=True)


class VideoInput(BaseModel):
    storage_path: str = Field(examples=["resources\\fake\\path1.mp4"])

    model_config = ConfigDict(from_attributes=True)
