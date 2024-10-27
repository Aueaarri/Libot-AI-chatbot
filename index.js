/*const { onRequest } = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");
setGlobalOptions({maxInstances:10});
const line = require("./utils/line");
const gemini = require("./utils/gemini");
const { WebhookClient } = require("dialogflow-fulfillment");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

exports.webhook = onRequest(async (req, res) => {
  if (req.method === "POST") {
    const events = req.body.events;
    for (const event of events) {
      switch (event.type) {
        case "message":
          if (event.message.type === "text") {
            //const msg = await gemini.textOnly(event.message.text);
            //await line.reply(event.replyToken, [{ type: "text", text: msg }]);
            //return res.end();

            const msg = await gemini.chat(event.message.text);
            await line.reply(event.replyToken, [{ type: "text", text: msg }]);
            return res.end();
          }
          if (event.message.type === "image") {
          }
          break;
      }
    }
  }
  res.send(req.method);
});




exports.dialogflowFulfillment = onRequest(async (req, res) => {
    console.log("DialogflowFulfillment");
    if (req.method === "POST") {
      var userId =
        req.body.originalDetectIntentRequest.payload.data.source.userId;
      var replyToken =
        req.body.originalDetectIntentRequest.payload.data.replyToken;
      const agent = new WebhookClient({ request: req, response: res });
      console.log("Query " + agent.query);
  
      console.log("UserId: " + userId);
      var mode = myCache.get(userId);
      console.log("Mode: " + mode);
      if (mode === undefined) {
        mode = "Dialogflow";
      }
      var notifyStatus = myCache.get("Notify" + userId);
      if (notifyStatus === undefined) {
        notifyStatus = true;
      }
  
      if (agent.query == "reset") {
        mode = "Dialogflow";
        console.log("Change Mode to: " + mode);
        await line.reply(replyToken, [
          {
            type: "text",
            text: "ระบบตั้งค่าเริ่มต้นให้คุณแล้ว สอบถามได้เลยค่ะ",
          },
        ]);
        myCache.set(userId, mode, 600);
        console.log("Lastest Mode: " + mode);
        return res.end();
      }
  
      if (mode == "bot") {
        agent.query = "สอบถามกับ LiBot" + agent.query;
      } else if (mode == "staff") {
        agent.query = "สอบถามกับ Admin" + agent.query;
      }
  
      if (agent.query.includes("สอบถามกับ Admin")) {
        mode = "staff";
        console.log("Change Mode to: " + mode);
        let profile = await line.getUserProfile(userId);
        console.log(profile.data);
        if (notifyStatus) {
          line.notify({
            message:
              "มีผู้ใช้ชื่อ " +
              profile.data.displayName +
              " ต้องการติดต่อ " +
              agent.query,
            imageFullsize: profile.data.pictureUrl,
            imageThumbnail: profile.data.pictureUrl,
          });
          await line.reply(replyToken, [
            {
              type: "text",
  
              text:
                agent.query +
                " เราได้แจ้งเตือนไปยัง Admin แล้วค่ะ Admin จะรีบมาตอบนะคะ",
            },
          ]);
        }
        myCache.set("Notify" + userId, false, 600);
      } else if (agent.query.includes("สอบถามกับ LiBot")) {
        mode = "bot";
        console.log("Change Mode to: " + mode);
        let question = agent.query;
        question = question.replace("สอบถามกับ LiBot", "");
        const msg = await gemini.chat(question);
        await line.reply(replyToken, [
          {
            type: "text",
            sender: {
              name: "Gemini",
              iconUrl: "https://wutthipong.info/images/geminiicon.png",
            },
            text: msg,
          },
        ]);
      } else {
        mode = "Dialogflow";
        let question = "คุณต้องการสอบถามกับ LiBot หรือ Admin";
        let answer1 = "สอบถามกับ LiBot " + agent.query;
        let answer2 = "สอบถามกับ Admin " + agent.query;
  
        // await line.reply(
        //   replyToken,
        //   template.quickreply(question, answer1, answer2)
        // );
        await line.reply(replyToken, [
          {
            type: "text",
            text: question,
            sender: {
              name: "Dialogflow",
              
            },
            quickReply: {
              items: [
                {
                  type: "action",
                  action: {
                    type: "message",
                    label: "สอบถามกับ LiBot",
                    text: answer1,
                  },
                },
                {
                  type: "action",
                  action: {
                    type: "message",
                    label: "สอบถามกับ Admin",
                    text: answer2,
                  },
                },
              ],
            },
          },
        ]);
      }
      myCache.set(userId, mode, 600);
      console.log("Lastest Mode: " + mode);
    }
    return res.send(req.method);
  });*/

const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const fs = require('fs');  // นำเข้าโมดูล fs
const path = require('path');
setGlobalOptions({ maxInstances: 10 });
const line = require("./utils/line");
const gemini = require("./utils/gemini");
const { WebhookClient } = require("dialogflow-fulfillment");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

function readEngineeringData() {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, 'engineeringData.json'); 
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

exports.webhook = onRequest(async (req, res) => {
  if (req.method === "POST") {
    const events = req.body.events;
    for (const event of events) {
      switch (event.type) {
        case "message":
          if (event.message.type === "text") {
            // ถ้าได้รับคำถามเกี่ยวกับคณะวิศวกรรมศาสตร์
            if (event.message.text.includes("คณะวิศวกรรมศาสตร์")) {
              try {
                const engineeringData = await readEngineeringData(); // อ่านข้อมูลจาก JSON
                const facultyMembers = engineeringData.facultyMembers.map(member => 
                  `${member.name} - ${member.position}`
                ).join("\n");

                const responseMessage = `ชื่อคณะ: ${engineeringData.faculty}\n` +
                                        `มหาวิทยาลัย: ${engineeringData.university}\n` +
                                        `ที่ตั้ง: ${engineeringData.location}\n` +
                                        `หลักสูตร: ${engineeringData.programs.join(", ")}\n` +
                                        `ปีที่ก่อตั้ง: ${engineeringData.establishedYear}\n` +
                                        `ภารกิจ: ${engineeringData.mission}\n` +
                                        `วิสัยทัศน์: ${engineeringData.vision}\n` +
                                        `อาจารย์:\n${facultyMembers}`;

                await line.reply(event.replyToken, [{ type: "text", text: responseMessage }]);
                return res.end();
              } catch (error) {
                console.error("Error reading JSON data:", error);
                await line.reply(event.replyToken, [{ type: "text", text: "เกิดข้อผิดพลาดในการอ่านข้อมูล กรุณาลองใหม่อีกครั้ง" }]);
                return res.end();
              }
            } else {
              const msg = await gemini.chat(event.message.text);
              await line.reply(event.replyToken, [{ type: "text", text: msg }]);
              return res.end();
            }
          }
          if (event.message.type === "image") {
           
          }
          break;
      }
    }
  }
  res.send(req.method);
});

exports.dialogflowFulfillment = onRequest(async (req, res) => {
  console.log("DialogflowFulfillment");
  if (req.method === "POST") {
    var userId = req.body.originalDetectIntentRequest.payload.data.source.userId;
    var replyToken = req.body.originalDetectIntentRequest.payload.data.replyToken;
    const agent = new WebhookClient({ request: req, response: res });
    console.log("Query " + agent.query);

    console.log("UserId: " + userId);
    var mode = myCache.get(userId);
    console.log("Mode: " + mode);
    if (mode === undefined) {
      mode = "Dialogflow";
    }
    var notifyStatus = myCache.get("Notify" + userId);
    if (notifyStatus === undefined) {
      notifyStatus = true;
    }

    if (agent.query == "reset") {
      mode = "Dialogflow";
      console.log("Change Mode to: " + mode);
      await line.reply(replyToken, [
        {
          type: "text",
          text: "ระบบตั้งค่าเริ่มต้นให้คุณแล้ว สอบถามได้เลยค่ะ",
        },
      ]);
      myCache.set(userId, mode, 600);
      console.log("Lastest Mode: " + mode);
      return res.end();
    }

    if (mode == "bot") {
      agent.query = "สอบถามกับ LiBot" + agent.query;
    } else if (mode == "staff") {
      agent.query = "สอบถามกับ Admin" + agent.query;
    }

    if (agent.query.includes("สอบถามกับ Admin")) {
      mode = "staff";
      console.log("Change Mode to: " + mode);
      let profile = await line.getUserProfile(userId);
      console.log(profile.data);
      if (notifyStatus) {
        line.notify({
          message:
            "มีผู้ใช้ชื่อ " +
            profile.data.displayName +
            " ต้องการติดต่อ " +
            agent.query,
          imageFullsize: profile.data.pictureUrl,
          imageThumbnail: profile.data.pictureUrl,
        });
        await line.reply(replyToken, [
          {
            type: "text",
            text:
              agent.query +
              " เราได้แจ้งเตือนไปยัง Admin แล้วค่ะ Admin จะรีบมาตอบนะคะ",
          },
        ]);
      }
      myCache.set("Notify" + userId, false, 600);
    } else if (agent.query.includes("สอบถามกับ LiBot")) {
      mode = "bot";
      console.log("Change Mode to: " + mode);
      let question = agent.query;
      question = question.replace("สอบถามกับ LiBot", "");
      const msg = await gemini.chat(question);
      await line.reply(replyToken, [
        {
          type: "text",
          sender: {
            name: "Gemini",
          },
          text: msg,
        },
      ]);
    } else {
      mode = "Dialogflow";
      let question = "คุณต้องการสอบถามกับ LiBot หรือ Admin";
      let answer1 = "สอบถามกับ LiBot " + agent.query;
      let answer2 = "สอบถามกับ Admin " + agent.query;

      await line.reply(replyToken, [
        {
          type: "text",
          text: question,
          sender: {
            name: "Dialogflow",
          },
          quickReply: {
            items: [
              {
                type: "action",
                action: {
                  type: "message",
                  label: "สอบถามกับ LiBot",
                  text: answer1,
                },
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "สอบถามกับ Admin",
                  text: answer2,
                },
              },
            ],
          },
        },
      ]);
    }
    myCache.set(userId, mode, 600);
    console.log("Lastest Mode: " + mode);
  }
  return res.send(req.method);
});
