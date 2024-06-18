import os.path
import time

from fastapi import Request
from pyinstrument import Profiler
from pyinstrument.renderers import HTMLRenderer, SpeedscopeRenderer

PROFILE_TYPE = "html"
PROFILES_DIR = "profiles"
PROFILE_EXTENSIONS = {"html": "html", "speedscope": "speedscope.json"}
PROFILE_RENDERS = {
    "html": HTMLRenderer,
    "speedscope": SpeedscopeRenderer,
}

PROFILE_EXTENSION = PROFILE_EXTENSIONS[PROFILE_TYPE]
PROFILE_RENDER = PROFILE_RENDERS[PROFILE_TYPE]()


async def profile_middleware(request: Request, call_next):

    with Profiler(interval=0.001, async_mode="enabled") as profiler:
        response = await call_next(request)

    if not os.path.isdir(PROFILES_DIR):
        os.mkdir(PROFILES_DIR)

    with open(f"{PROFILES_DIR}/{time.time_ns()}.{PROFILE_EXTENSION}", "w") as out:
        out.write(profiler.output(renderer=PROFILE_RENDER))

    return response
