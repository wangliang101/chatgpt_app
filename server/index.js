const path = require('path');
const fs = require('fs');
const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');

require('dotenv').config();
const { APP_ID, APP_SECRET, PORT } = process.env

// 确保 uploads 目录存在
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const app = express();

// 替换为你的 AppID 和 AppSecret
const appId = APP_ID;
const appSecret = APP_SECRET;

// 配置 multer 来处理文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// 获取 ACCESS_TOKEN 的函数
async function getAccessToken() {
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
  try {
    const response = await axios.get(url);
    console.log('Access token response:', response.data);
    if (response.data.access_token) {
      return response.data.access_token;
    } else {
      throw new Error('Failed to get access token');
    }
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

// 调用微信语音识别接口
async function recognizeSpeech(accessToken, filePath) {
  try {
    console.log('Reading file:', filePath);
    // const fileContent = fs.readFileSync(filePath);
    // const base64Audio = fileContent.toString('base64');
    const form = new FormData();
    form.append('media', fs.createReadStream(filePath));

    const voice_id = Date.now().toString();
    const url = `https://api.weixin.qq.com/cgi-bin/media/voice/addvoicetorecofortext?access_token=${accessToken}&format=mp3&voice_id=${voice_id}&lang=zh_CN`
    console.log('Calling WeChat API...', url);
    const response = await axios.post(url,
      form,
      {
        headers: form.getHeaders(),
      }
    );

    console.log('WeChat API response:', response.data);
    if (response.data.errcode) {
      throw new Error(`WeChat API error: ${response.data.errmsg}`);
    }

    const queryRecoresultUrl = `https://api.weixin.qq.com/cgi-bin/media/voice/queryrecoresultfortext?access_token=${accessToken}&voice_id=${voice_id}&lang=zh_CN`
    const res = await axios.post(queryRecoresultUrl,
      {},
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    console.log('xxxxx', res.data)
    return res.data.result;
  } catch (error) {
    console.error('Error recognizing speech:', error);
    throw error;
  }
}

// 处理语音文件上传和识别
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  console.log('File uploaded:', req.file);

  try {
    let accessToken;
    let recognitionResult;
    let retries = 1;

    while (retries > 0) {
      try {
        accessToken = await getAccessToken();
        console.log('Got access token:', accessToken);

        recognitionResult = await recognizeSpeech(accessToken, `uploads/0.mp3`);
        console.log('Recognition result:', recognitionResult);
        break;
      } catch (error) {
        console.error(`Attempt failed, retries left: ${retries - 1}`, error);
        retries--;
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒后重试
      }
    }

    // 删除临时文件
    fs.unlinkSync(req.file.path);

    res.json({ text: recognitionResult });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Server error: ' + error.message);
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
