import uuid

from pydantic import BaseModel, Field, ConfigDict

from bionic_eye.backend.schemas.metadata import Metadata


class Frame(BaseModel):
    id: uuid.UUID = Field(examples=[uuid.uuid4()])
    storage_path: str = Field(examples=["resources/fake/frame1.jpg"])
    frame_index: int = Field(examples=[1, 2, 66])
    metadata: Metadata = Field()

    model_config = ConfigDict(from_attributes=True)
