const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const axios = require("axios");

const textOnly = async (prompt) => {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  return result.response.text();
};


const multimodal = async (imageBinary) => {
  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  const prompt = "ช่วยบรรยายภาพนี้ให้หน่อย";
  const mimeType = "image/png";

  // Convert image binary to a GoogleGenerativeAI.Part object.
  const imageParts = [
    {
      inlineData: {
        data: Buffer.from(imageBinary, "binary").toString("base64"),
        mimeType
      }
    }
  ];

  const result = await model.generateContent([prompt, ...imageParts]);
  const text = result.response.text();
  return text;
};

const chat = async (prompt) => {
  const response = await axios.get("https://aueaarri.github.io/API/data.json");
  let information = await response.data
  information = JSON.stringify(information)

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "สวัสดีจ้า" }],
      },
      {
        role: "model",
        parts: [{ text: "สวัสดีครับ ผมชื่อ LIBOT ผมเป็นผู้เชี่ยวชาญเกี่ยวกับ LINE API ที่ช่วยตอบคำถามและแบ่งปันความรู้ให้กับชุมขนนักพัฒนา" }],
      },

    ]
  });

  const result = await chat.sendMessage(prompt);
  return result.response.text();
};

module.exports = { textOnly, multimodal, chat };

/*const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const axios = require("axios");
const data = require('./data.json'); // นำเข้าไฟล์ JSON

const textOnly = async (prompt) => {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

const multimodal = async (imageBinary) => {
  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  const prompt = "ช่วยบรรยายภาพนี้ให้หน่อย";
  const mimeType = "image/png";

  // Convert image binary to a GoogleGenerativeAI.Part object.
  const imageParts = [
    {
      inlineData: {
        data: Buffer.from(imageBinary, "binary").toString("base64"),
        mimeType
      }
    }
  ];

  const result = await model.generateContent([prompt, ...imageParts]);
  const text = result.response.text();
  return text;
};

const chat = async (prompt) => {
  // ใช้ข้อมูลจาก data.json
  let information = JSON.stringify(data); // แปลงข้อมูลเป็น JSON string

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "สวัสดีจ้า" }],
      },
      {
        role: "model",
        parts: [{ text: "สวัสดีครับ ผมชื่อ LIBOT ผมเป็นผู้เชี่ยวชาญเกี่ยวกับ LINE API ที่ช่วยตอบคำถามและแบ่งปันความรู้ให้กับชุมขนนักพัฒนา" }],
      },
    ]
  });

  // ส่งข้อความจาก JSON แทน prompt
  const response = await chat.sendMessage(information); 
  return response.response.text(); // ส่งข้อมูล JSON ตอบกลับ
};

module.exports = { textOnly, multimodal, chat };*/



