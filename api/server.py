import os
import httpx
import threading
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__, static_folder="../", static_url_path="")

PROVIDERS = [
    {"key": os.environ.get("DEEPSEEK_KEY_1", ""), "endpoint": "https://api.deepseek.com/chat/completions", "model": "deepseek-chat"},
    {"key": os.environ.get("DEEPSEEK_KEY_2", ""), "endpoint": "https://api.deepseek.com/chat/completions", "model": "deepseek-chat"},
    {"key": os.environ.get("DEEPSEEK_KEY_3", ""), "endpoint": "https://api.deepseek.com/chat/completions", "model": "deepseek-chat"},
    {"key": os.environ.get("DEEPSEEK_KEY_4", ""), "endpoint": "https://api.deepseek.com/chat/completions", "model": "deepseek-chat"},
    {"key": os.environ.get("DEEPSEEK_KEY_5", ""), "endpoint": "https://api.deepseek.com/chat/completions", "model": "deepseek-chat"},
    {"key": os.environ.get("OPENROUTER_KEY_1", ""), "endpoint": "https://openrouter.ai/api/v1/chat/completions", "model": "deepseek/deepseek-v4-flash"},
    {"key": os.environ.get("OPENROUTER_KEY_2", ""), "endpoint": "https://openrouter.ai/api/v1/chat/completions", "model": "deepseek/deepseek-v4-flash"},
    {"key": os.environ.get("OPENAI_KEY", ""), "endpoint": "https://api.openai.com/v1/chat/completions", "model": "gpt-4o-mini"},
]

_lock = threading.Lock()
_idx = 0

SYSTEM_PROMPT = (
    "You are OranAI, an Algerian AI assistant from Oran. "
    "You speak derja (Oranese dialect), French, and Arabic. "
    "Be helpful, witty, and engaging. "
    "Address the user as 'يا الشيخ' or 'ya l'chikh'. "
    "Keep responses concise (2-4 sentences). "
    "IMPORTANT: Never greet with 'Bonjour' or 'Salut'. "
    "Use Arabic/Derja greetings only. "
    "Never use the word 'sahbi' or 'صهبي'."
)

def try_providers(messages, is_first):
    global _idx
    n = len(PROVIDERS)
    for _ in range(n):
        with _lock:
            prov = PROVIDERS[_idx]
            _idx = (_idx + 1) % n
        if not prov["key"]:
            continue
        body = {
            "model": prov["model"],
            "messages": messages,
            "max_tokens": 512,
            "temperature": 0.7,
        }
        headers = {
            "Authorization": f"Bearer {prov['key']}",
            "Content-Type": "application/json",
        }
        if "openrouter" in prov["endpoint"]:
            headers["HTTP-Referer"] = "https://riachsaid.github.io/oranai-landing"
            headers["X-Title"] = "OranAI"
        try:
            resp = httpx.post(prov["endpoint"], json=body, headers=headers, timeout=60)
            if resp.status_code in (401, 429):
                print(f"[fail] {prov['model']}@{prov['endpoint']} HTTP {resp.status_code}")
                continue
            resp.raise_for_status()
            reply = resp.json()["choices"][0]["message"]["content"]
            print(f"[ok] {prov['model']}@{prov['endpoint']}")
            if is_first:
                reply = "عندك بايان عندك بايان هههه " + reply
            return reply
        except Exception as e:
            print(f"[fail] {prov['model']}@{prov['endpoint']}: {e}")
            continue
    return None

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    if not data or "messages" not in data:
        return jsonify({"error": "missing messages"}), 400

    user_msgs = [m for m in data["messages"] if m["role"] != "system"]
    assistant_count = sum(1 for m in user_msgs if m["role"] == "assistant")
    messages = [{"role": "system", "content": SYSTEM_PROMPT}] + user_msgs

    reply = try_providers(messages, is_first=(assistant_count == 0))
    if reply:
        return jsonify({"reply": reply})
    return jsonify({"error": "all providers exhausted"}), 502

@app.route("/")
def index():
    return send_from_directory("../", "index.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
