import uuid

from pydantic import BaseModel, Field, ConfigDict

from bionic_eye.backend.schemas.metadata import Metadata


class Frame(BaseModel):
    id: uuid.UUID = Field(examples=["8041f36e-c80e-4ee4-84f9-65b159444c03"])
    storage_path: str = Field(examples=[""])
    frame_index: int = Field(examples=[1, 2, 66])
    metadata: Metadata = Field()

    model_config = ConfigDict(from_attributes=True)

