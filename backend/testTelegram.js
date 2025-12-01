import { sendTelegramMessage } from './utils/telegram.js';

(async () => {
  const chat = process.env.TELEGRAM_CHAT_ID || '8058194222:AAGSGExYa2YC18LD7yxrRBjqN1Vzotj1px0';
  const r = await sendTelegramMessage(chat, "Teste manual via testTelegram.js");
  console.log("testTelegram result:", r);
})();
