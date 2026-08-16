export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { name, email, subject, message, userIP, deviceOS } = body;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Fails' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const BOT_TOKEN = context.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = context.env.TELEGRAM_CHAT_ID;

    const text = `💌 *پیام جدید از وب‌سایت*\n\n` +
                 `👤 *فرستنده:* ${name}\n` +
                 `📧 *ایمیل:* ${email}\n` +
                 `📌 *موضوع:* ${subject || 'بدون موضوع'}\n\n` +
                 `📝 *متن پیام:\n* ${message}\n\n` +
                 `🌐 *آی‌پی:* ${userIP || 'نامشخص'}\n` +
                 `📱 *سیستم‌عامل:* ${deviceOS || 'نامشخص'}`;

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'Markdown'
      })
    });

    if (tgRes.ok) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Telegram Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
