from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
import urllib.request
import urllib.error
from pathlib import Path

ROOT = Path(__file__).parent
HOST = "0.0.0.0"
PORT = int(os.getenv("PORT", "8080"))
MODEL = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")
API_KEY = os.getenv("OPENAI_API_KEY", "")

SYSTEM_PROMPT = """Ты — креативный сотрудник небольшой видеостудии.
Твоя задача — помогать главному ассистенту придумывать сильные, оригинальные и реализуемые идеи для коротких роликов, рекламных сцен, исторических сюжетов и визуальных объяснений.

Всегда отвечай на русском языке.
Если просят идеи, предложи 3–5 действительно разных вариантов, а не одну идею, перефразированную пять раз.
Для каждой идеи кратко укажи: замысел, визуальный ход, звук или дикторский текст и почему это сработает.
Учитывай заданную длительность и не растягивай короткую сцену.
Отделяй подтверждённые факты от художественного вымысла. Не выдумывай исторические детали.
Не запускай генерацию, не редактируй файлы, не публикуй материалы и не выполняй внешние действия. Ты только предлагаешь и анализируешь.
Если вводных мало, сначала предложи разумный вариант на основе имеющихся данных, а не устраивай длинный допрос.
Пиши живо, конкретно, без канцелярита и пустых похвал."""

HTML = """<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Креативный сотрудник</title>
<style>
body{font:17px -apple-system,BlinkMacSystemFont,sans-serif;background:#101827;color:#eef2f7;margin:0;padding:18px}
main{max-width:820px;margin:auto}h1{font-size:25px}
#log{min-height:55vh;max-height:65vh;overflow:auto;background:#1e293b;border-radius:12px;padding:14px;white-space:pre-wrap;line-height:1.5}
.msg{margin:0 0 16px}.who{font-weight:700;color:#b9d5ff}
textarea,button{box-sizing:border-box;width:100%;font:inherit;border-radius:10px;padding:13px;margin-top:10px}
textarea{background:#1e293b;color:white;border:1px solid #64748b;min-height:100px}
button{background:#d7e8ff;color:#102033;border:0;font-weight:700}
small{color:#bac7d8}
</style></head><body><main>
<h1>Креативный сотрудник</h1>
<p>Внутренний помощник для идей, сценарных ходов и визуальных концепций.</p>
<div id="log" role="log" aria-live="polite">Сотрудник готов к работе. Напишите задачу.</div>
<textarea id="prompt" placeholder="Например: предложи 4 способа показать историю за 5 секунд"></textarea>
<button id="send">Передать задачу сотруднику</button>
<p><small>Это отдельный экспериментальный сервис. Он предлагает идеи и ничего не публикует и не генерирует автоматически.</small></p>
</main><script>
const log=document.getElementById('log'),input=document.getElementById('prompt'),send=document.getElementById('send');
const history=[];
function add(role,text){const p=document.createElement('p');p.className='msg';const b=document.createElement('span');b.className='who';b.textContent=role==='user'?'Задача: ':'Сотрудник: ';p.append(b,document.createTextNode(text));log.append(p);log.scrollTop=log.scrollHeight}
send.onclick=async()=>{const text=input.value.trim();if(!text)return;input.value='';send.disabled=true;add('user',text);history.push({role:'user',content:text});add('assistant','Думаю над задачей…');const placeholder=log.lastChild;
try{const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history})});const data=await r.json();if(!r.ok)throw Error(data.error||'Ошибка запроса');placeholder.remove();history.push({role:'assistant',content:data.reply});add('assistant',data.reply)}
catch(e){placeholder.textContent='Сотрудник пока недоступен: '+e.message;history.pop()}
finally{send.disabled=false;input.focus()}
};
input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send.click()}});
</script></body></html>"""

class Handler(BaseHTTPRequestHandler):
    def _json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path in ("/", "/index.html"):
            body = HTML.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        elif self.path == "/health":
            self._json(200, {"ok": True, "service": "creative-agent"})
        else:
            self._json(404, {"error": "Страница не найдена."})

    def do_POST(self):
        if self.path != "/api/chat":
            return self._json(404, {"error": "Маршрут не найден."})
        if not API_KEY:
            return self._json(503, {"error": "На сервере не задан OPENAI_API_KEY. Добавьте ключ в переменные окружения сервиса."})
        try:
            size = int(self.headers.get("Content-Length", "0"))
            if size > 100_000:
                return self._json(413, {"error": "Слишком большой запрос."})
            payload = json.loads(self.rfile.read(size) or b"{}")
            messages = payload.get("messages", [])
            if not isinstance(messages, list) or not messages:
                return self._json(400, {"error": "Передайте текст задачи."})
            safe_messages = []
            for item in messages[-20:]:
                if isinstance(item, dict) and item.get("role") in ("user", "assistant") and isinstance(item.get("content"), str):
                    safe_messages.append({"role": item["role"], "content": item["content"][:8000]})
            request_data = json.dumps({
                "model": MODEL,
                "messages": [{"role": "system", "content": SYSTEM_PROMPT}] + safe_messages,
                "temperature": 0.8
            }).encode("utf-8")
            req = urllib.request.Request(
                "https://api.openai.com/v1/chat/completions",
                data=request_data,
                headers={"Authorization": "Bearer " + API_KEY, "Content-Type": "application/json"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=90) as response:
                result = json.loads(response.read().decode("utf-8"))
            reply = result["choices"][0]["message"]["content"]
            return self._json(200, {"reply": reply})
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")[:1200]
            return self._json(502, {"error": "Ошибка API модели: " + detail})
        except Exception as exc:
            return self._json(500, {"error": "Не удалось обработать задачу: " + str(exc)})

if __name__ == "__main__":
    print(f"Creative Agent listening on {HOST}:{PORT}")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
