const express = require('express');
const app = express();
const PORT = 3000;

// ข้อมูล JSON
const data = {
  "faculty": "คณะวิศวกรรมศาสตร์",
  "university": "มหาวิทยาลัยขอนแก่น",
  "location": "อ.เมือง จ.ขอนแก่น, ประเทศไทย",
  "programs": [
    "วิศวกรรมเครื่องกล",
    "วิศวกรรมไฟฟ้า",
    "วิศวกรรมโยธา",
    "วิศวกรรมคอมพิวเตอร์"
  ],
  "facultyMembers": [
    {
      "name": "รศ.ดร.สมชาย ใจดี",
      "position": "คณบดี"
    },
    {
      "name": "ดร.จิตติมา แสนสุข",
      "position": "อาจารย์"
    },
    {
      "name": "ผศ.ดร.นพดล พันธุ์ดี",
      "position": "อาจารย์"
    }
  ],
  "establishedYear": 1994,
  "mission": "ผลิตบัณฑิตที่มีคุณภาพ มีความรู้ความสามารถด้านวิศวกรรมศาสตร์และมีจริยธรรม",
  "vision": "เป็นคณะวิศวกรรมศาสตร์ที่มีความเป็นเลิศในระดับนานาชาติ"
};

// กำหนดเส้นทาง API ที่จะให้บริการข้อมูล JSON
app.get('/api/info', (req, res) => {
  res.json(data);
});

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
