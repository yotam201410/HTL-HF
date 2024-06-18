from pydantic import BaseModel, Field,ConfigDict
import uuid


class Metadata(BaseModel):
    id: uuid.UUID = Field(examples=[uuid.uuid4()])
    tagged: bool = Field(examples=[True, False])
    fov: float = Field(examples=[20.5, 96.1])
    azimuth: float = Field(examples=[12.6, 30.2])
    elevation: float = Field(examples=[5.1, 1.2])

    model_config = ConfigDict(from_attributes=True)

