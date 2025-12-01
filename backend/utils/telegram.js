// utils/telegram.js
import fetch from 'node-fetch';

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithTimeout(url, opts = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function sendOnce(chatId, text, parse_mode) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!BOT_TOKEN) return { ok: false, reason: 'no-token' };
  if (!chatId) return { ok: false, reason: 'no-chatid' };

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const body = {
    chat_id: chatId,
    text,
    disable_web_page_preview: true,
    ...(parse_mode ? { parse_mode } : {}),
  };

  try {
    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }, 8000); // timeout 8s
    const json = await res.json();
    if (!res.ok || !json.ok) {
      return { ok: false, httpStatus: res.status, json };
    }
    return { ok: true, json };
  } catch (err) {
    // network errors, timeouts etc.
    return { ok: false, reason: 'exception', error: String(err) };
  }
}

export async function sendTelegramMessage(chatId, text) {
  // tentativas com backoff exponencial
  const attempts = [
    { parse_mode: 'HTML', timeout: 8000 },
    { parse_mode: null, timeout: 8000 },
    { parse_mode: null, timeout: 12000 },
  ];

  let lastResult = null;
  let backoff = 500;
  for (let i = 0; i < attempts.length; i++) {
    const attempt = attempts[i];
    try {
      lastResult = await sendOnce(chatId, text, attempt.parse_mode);
      if (lastResult.ok) {
        // sucesso
        return lastResult;
      }

      // se deu erro que parece parse/entities, e ainda não tentamos sem parse_mode, continue loop
      // se foi timeout/exception, vamos tentar de novo após backoff
    } catch (err) {
      lastResult = { ok: false, reason: 'exception', error: String(err) };
    }

    // aguardar antes do próximo retry
    await wait(backoff);
    backoff *= 3; // exponencial
  }

  return lastResult || { ok: false, reason: 'no-response' };
}
