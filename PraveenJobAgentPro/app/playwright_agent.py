from pathlib import Path
import json
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
PROFILE = json.loads((ROOT / "config" / "profile.json").read_text(encoding="utf-8"))

VALUES = {
    "first_name": "Guddanti",
    "last_name": "Praveen Kumar",
    "full_name": "Guddanti Praveen Kumar",
    "email": "guddantipraveenkumar@gmail.com",
    "phone": "6301055471",
    "city": "Hyderabad",
    "state": "Telangana",
    "country": "India",
    "linkedin": "https://linkedin.com/in/guddanti-praveen-kumar",
    "github": "https://github.com/kumar057",
    "portfolio": "https://portfolio-jpazpgd0u-praveen-kumar057.vercel.app",
}

BLOCKED = {"linkedin.com", "www.linkedin.com", "naukri.com", "www.naukri.com"}
SENSITIVE = ("password", "otp", "captcha", "verification code", "security code")

def blocked(url):
    host = urlparse(url).netloc.lower().split(":")[0]
    return host in BLOCKED or host.endswith(".linkedin.com") or host.endswith(".naukri.com")

def guess(text):
    text = text.lower()
    if "first name" in text or "given name" in text: return VALUES["first_name"]
    if "last name" in text or "surname" in text or "family name" in text: return VALUES["last_name"]
    if "full name" in text or text.strip() in {"name", "candidate name"}: return VALUES["full_name"]
    if "email" in text: return VALUES["email"]
    if "phone" in text or "mobile" in text or "telephone" in text: return VALUES["phone"]
    if "linkedin" in text: return VALUES["linkedin"]
    if "github" in text: return VALUES["github"]
    if "portfolio" in text or "website" in text: return VALUES["portfolio"]
    if "city" in text: return VALUES["city"]
    if "state" in text: return VALUES["state"]
    if "country" in text: return VALUES["country"]
    return None

def run(url, headless=False):
    if blocked(url):
        raise ValueError("LinkedIn and Naukri are excluded.")
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=headless)
        page = browser.new_page()
        page.goto(url, wait_until="domcontentloaded", timeout=30000)
        body = page.locator("body").inner_text(timeout=5000)
        if any(word in body.lower() for word in SENSITIVE):
            return {"url": page.url, "title": page.title(), "filled": [], "needs_user": True,
                    "reason": "CAPTCHA, OTP, password, or verification content detected."}
        filled = []
        for control in page.locator("input, textarea").all():
            try:
                if not control.is_visible() or not control.is_editable():
                    continue
                typ = (control.get_attribute("type") or "text").lower()
                if typ in {"hidden", "submit", "button", "file", "checkbox", "radio", "password"}:
                    continue
                ident = control.get_attribute("id") or ""
                name = control.get_attribute("name") or ""
                placeholder = control.get_attribute("placeholder") or ""
                label = ""
                if ident:
                    loc = page.locator('label[for="' + ident + '"]')
                    if loc.count():
                        label = loc.first.inner_text(timeout=300)
                value = guess(" ".join([label, name, ident, placeholder]))
                if value:
                    control.fill(value)
                    filled.append(name or ident or placeholder)
            except Exception:
                pass
        return {"url": page.url, "title": page.title(), "filled": filled, "needs_user": False}

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("url")
    parser.add_argument("--headless", action="store_true")
    args = parser.parse_args()
    print(json.dumps(run(args.url, args.headless), indent=2))
