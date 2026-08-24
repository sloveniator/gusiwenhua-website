"""古四文化咨询工作室 - 联系表单后端

接收前端 POST /api/contact，服务端校验后用 SMTP 把咨询内容发到企业微信邮箱。
SMTP 凭证通过环境变量注入（docker-compose env_file: ./backend/.env），不入库、不进镜像。
"""
import os
import re
import smtplib
import ssl

from dotenv import load_dotenv
from email.mime.text import MIMEText
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="古四联系表单后端")

# 同源经 nginx 反代访问；放开 CORS 仅便于本地直接调试，不影响生产
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DIRECTION_MAP = {
    "metaphysics": "玄学（命理 / 塔罗 / 风水）",
    "psychology": "心理（情绪 / 认知 / 关系）",
    "finance": "财经（投资 / 理财 / 市场）",
    "comprehensive": "综合咨询",
}


class ContactIn(BaseModel):
    name: str = ""
    contact: str = ""
    direction: str = ""
    content: str = ""


def _is_valid_contact(value: str) -> bool:
    value = value.strip()
    phone = re.match(r"^1[3-9]\d{9}$", value)
    email = re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", value)
    return bool(phone or email)


def send_email(payload: ContactIn) -> None:
    host = os.getenv("SMTP_HOST", "smtp.exmail.qq.com")
    port = int(os.getenv("SMTP_PORT", "465"))
    user = os.getenv("SMTP_USER", "")
    pwd = os.getenv("SMTP_PASS", "")
    to_addr = os.getenv("SMTP_TO", "Slceleto@gmail.com")
    from_addr = os.getenv("SMTP_FROM", user or to_addr)

    direction_label = DIRECTION_MAP.get(payload.direction, payload.direction or "未选择")
    subject = f"[古四咨询] 新咨询来自 {payload.name}"
    body = (
        f"姓名：{payload.name}\n"
        f"联系方式：{payload.contact}\n"
        f"咨询方向：{direction_label}\n"
        f"需求描述：\n{payload.content}\n"
    )
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"] = from_addr
    msg["To"] = to_addr

    if port == 465:
        with smtplib.SMTP_SSL(host, port, timeout=15) as server:
            server.login(user, pwd)
            server.sendmail(from_addr, [to_addr], msg.as_string())
    else:
        context = ssl.create_default_context()
        with smtplib.SMTP(host, port, timeout=15) as server:
            server.starttls(context=context)
            server.login(user, pwd)
            server.sendmail(from_addr, [to_addr], msg.as_string())


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/api/contact")
def api_contact(payload: ContactIn):
    name = payload.name.strip()
    contact = payload.contact.strip()
    content = payload.content.strip()

    if len(name) < 2:
        return {"ok": False, "error": "请填写姓名（至少 2 个字）"}
    if not _is_valid_contact(contact):
        return {"ok": False, "error": "请填写有效的手机号或邮箱"}
    if not payload.direction:
        return {"ok": False, "error": "请选择咨询方向"}
    if len(content) < 10:
        return {"ok": False, "error": "需求描述至少 10 个字"}

    if not os.getenv("SMTP_PASS"):
        return {"ok": False, "error": "邮件服务未配置（缺少 SMTP 凭证），请稍后重试或直接发邮件"}

    try:
        send_email(payload)
    except Exception as exc:  # noqa: BLE001 - 向前端返回可读错误，不抛 500
        return {"ok": False, "error": f"邮件发送失败：{exc}"}

    return {"ok": True}
