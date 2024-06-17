import time

from fastapi import Request
from pyinstrument import Profiler
from pyinstrument.renderers import HTMLRenderer, SpeedscopeRenderer


async def profile_middleware(request: Request, call_next):
    """Profile the current request

    Taken from https://pyinstrument.readthedocs.io/en/latest/guide.html#profile-a-web-request-in-fastapi
    with small improvements.

    """
    # we map a profile type to a file extension, as well as a pyinstrument profile renderer
    profile_type_to_ext = {"html": "html", "speedscope": "speedscope.json"}
    profile_type_to_renderer = {
        "html": HTMLRenderer,
        "speedscope": SpeedscopeRenderer,
    }

    # we profile the request along with all additional middlewares, by interrupting
    # the program every 1ms1 and records the entire stack at that point
    with Profiler(interval=0.001, async_mode="enabled") as profiler:
        response = await call_next(request)

    # we dump the profiling into a file
    extension = profile_type_to_ext["html"]
    renderer = profile_type_to_renderer["html"]()
    with open(f"profiles/{time.time_ns()}.{extension}", "w") as out:
        out.write(profiler.output(renderer=renderer))
    return response
