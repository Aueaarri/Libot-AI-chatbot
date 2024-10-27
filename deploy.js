const express = require('express');
const axios = require('axios'); // ใช้ในการส่งข้อมูลกลับไปที่ LINE
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const CHANNEL_ACCESS_TOKEN = 'K5XLbXBX40FFPeDTzBcsf2XXPiMCSqvVWaAU3hhL9G28ITetL7J3wJHY0Uj+zhqToHDQt0mDa163dObg352fJAGQ41gPaA4N+/xtpGNV83A08aNJhvp6aW6jQxBSO3owTneCWNEN2Q650Rdk0YS44wdB04t89/1O/w1cDnyilFU=';

app.use(bodyParser.json());

// Endpoint สำหรับรับ Webhook จาก LINE
app.post('/webhook', async (req, res) => {
    const events = req.body.events;

    for (let event of events) {
        if (event.type === 'message' && event.message.type === 'text') {
            const replyToken = event.replyToken;
            const userMessage = event.message.text;

            // ตอบกลับผู้ใช้
            await replyMessage(replyToken, `คุณส่งข้อความว่า: ${userMessage}`);
        }
    }

    res.sendStatus(200); // ส่งสถานะกลับไปที่ LINE เพื่อบอกว่ารับ webhook แล้ว
});

// ฟังก์ชันในการตอบกลับผู้ใช้
async function replyMessage(replyToken, text) {
    await axios.post(
        'https://api.line.me/v2/bot/message/reply',
        {
            replyToken: replyToken,
            messages: [{ type: 'text', text: text }]
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
            }
        }
    );
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
