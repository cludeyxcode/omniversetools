from fastapi import FastAPI, Request
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import FileResponse, Response
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
import os
from datetime import date

# Disable docs/OpenAPI — nothing to expose on a static-serving app
app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)

# Reject requests with unexpected Host headers (defense against host header injection)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["omniversetools.com", "www.omniversetools.com", "localhost", "127.0.0.1"],
)

# Strip the server fingerprinting header that uvicorn adds
class StripServerHeaderMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        if "server" in response.headers:
            del response.headers["server"]
        return response

app.add_middleware(StripServerHeaderMiddleware)

DIST = os.path.join(os.path.dirname(__file__), "../dist")

# Serve hashed JS/CSS assets with long cache headers
app.mount("/assets", StaticFiles(directory=os.path.join(DIST, "assets")), name="assets")

TOOL_SLUGS = [
    "qr-code",
    "json-formatter",
    "base64",
    "password-generator",
    "word-counter",
    "unit-converter",
    "color-converter",
    "regex-tester",
    "url-encoder",
    "markdown-previewer",
    "hash-generator",
    "timestamp-converter",
    "image-to-base64",
    "diff-checker",
    "jwt-decoder",
    "css-minifier",
    "html-minifier",
    "cron-explainer",
    "lorem-ipsum",
    "number-base-converter",
    "uuid-generator",
    "string-case-converter",
    "sql-formatter",
    "html-entity-encoder",
    "percentage-calculator",
    "age-calculator",
    "text-sorter",
    "bmi-calculator",
    "bmr-calculator",
    "ideal-weight-calculator",
    "tip-calculator",
    "loan-calculator",
    "compound-interest",
    "random-number-generator",
    "scientific-calculator",
    "date-duration-calculator",
    "timezone-converter",
    "slugify",
    "json-csv-converter",
    "color-palette-generator",
    "chmod-calculator",
    "word-frequency-counter",
    "reading-time-estimator",
    "character-limit-tester",
    "aspect-ratio-calculator",
    "roman-numeral-converter",
    "vat-calculator",
    "currency-formatter",
    "mortgage-calculator",
    "body-fat-calculator",
    "water-intake-calculator",
    "css-gradient-generator",
    "css-box-shadow-generator",
]

BASE_URL = "https://omniversetools.com"
TODAY = date.today().isoformat()


@app.get("/sitemap.xml")
async def sitemap():
    urls = [BASE_URL + "/", *[f"{BASE_URL}/tools/{slug}" for slug in TOOL_SLUGS]]
    entries = "\n".join(
        f"  <url><loc>{u}</loc><lastmod>{TODAY}</lastmod><changefreq>monthly</changefreq><priority>{'1.0' if u == BASE_URL + '/' else '0.8'}</priority></url>"
        for u in urls
    )
    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{entries}
</urlset>"""
    return Response(content=xml, media_type="application/xml")


@app.get("/robots.txt")
async def robots():
    content = f"User-agent: *\nAllow: /\nSitemap: {BASE_URL}/sitemap.xml\n"
    return Response(content=content, media_type="text/plain")


# SPA catch-all — serve index.html for every other path so React Router works
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    # Serve known root-level static files directly
    file_path = os.path.join(DIST, full_path)
    if full_path and os.path.isfile(file_path):
        return FileResponse(file_path)
    return FileResponse(os.path.join(DIST, "index.html"))
