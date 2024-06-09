from models.metadata import Metadata
from models.frame import Frame
from models.video import Video

from bionic_eye.DB.database import engine
from bionic_eye.DB.models.base import Base

Base.metadata.create_all(bind=engine)