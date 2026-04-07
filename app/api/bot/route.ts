import { NextRequest, NextResponse } from "next/server";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const APP_URL = "https://recon-app-three.vercel.app";

async function sendMessage(chatId: number, text: string, replyMarkup?: object) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      reply_markup: replyMarkup,
    }),
  });
}

export async function POST(req: NextRequest) {
  const update = await req.json();
  const message = update.message;
  if (!message) return NextResponse.json({ ok: true });

  const chatId = message.chat.id;
  const text = message.text || "";

  if (text.startsWith("/start")) {
    await sendMessage(
      chatId,
      "👋 Hey! I'm <b>Recon</b> — I'll tell you if something is actually worth your time before you do it.\n\nTap the button below to get started 👇",
      {
        inline_keyboard: [[
          {
            text: "Open Recon 🔍",
            web_app: { url: APP_URL },
          },
        ]],
      }
    );
  }

  return NextResponse.json({ ok: true });
}
