import asyncio
import base64
import json
import os
import shutil
import aiofiles

from typing import List
from playwright.async_api import async_playwright, BrowserType


def get_folder_name(link: str) -> str:
    return link[link.find('/') + 6:link.find('.', link.find('.') + 1)]


async def write_to_json(filename, content: str, page_resources: List[str], screenshot_string: str):
    async with aiofiles.open(filename, 'w') as file:
        await file.write(
            json.dumps({"html": content, "resources": page_resources, "screenshot": screenshot_string}))


async def handle_link(link: str):
    folder_name = get_folder_name(link)

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto(link)
        page_resources = []
        page.on('request', lambda request: page_resources.append(request.url))

        content = await page.content()
        screenshot_bytes = await page.screenshot(
            path=f"outputs/{folder_name}/screenshot.png")
        screenshot_string = base64.b64encode(screenshot_bytes).decode()

        await page.wait_for_load_state('domcontentloaded')
        await write_to_json(f"outputs/{folder_name}/browse.json", content, page_resources, screenshot_string)
        await browser.close()


async def main():
    tasks = []
    if os.path.exists("outputs"):
        shutil.rmtree("outputs")

    with open("inputs/urls.input", 'r') as urls_file:
        urls = urls_file.readlines()

        for url in urls:
            tasks.append(asyncio.create_task(handle_link(url)))

    await asyncio.gather(*tasks)


if __name__ == "__main__":
    asyncio.run(main())
