export async function onRequestPost(context) {
  try {
    const { name, email, subject, message, userIP, deviceOS } = await context.request.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ message: 'فیلدهای ضروری پر نشده‌اند.' }), { status: 400 });
    }

    const TELEGRAM_BOT_TOKEN = context.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = context.env.TELEGRAM_CHAT_ID;

    const text = `💌 *پیام جدید از وب‌سایت*\n\n` +
                 `👤 *فرستنده:* ${name}\n` +
                 `📧 *ایمیل:* ${email}\n` +
                 `📌 *موضوع:* ${subject || 'بدون موضوع'}\n\n` +
                 `📝 *متن پیام:\n* ${message}\n\n` +
                 `🌐 *آی‌پی:* ${userIP || 'نامشخص'}\n` +
                 `📱 *سیستم‌عامل:* ${deviceOS || 'نامشخص'}`;

    const telegramRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'Markdown'
      })
    });

    if (telegramRes.ok) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'خطا در ارسال به تلگرام' }), { status: 500 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: 'خطای سرور' }), { status: 500 });
  }
}
