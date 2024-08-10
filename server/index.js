const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const cors = require('cors')

require('dotenv').config();
const { APP_ID, APP_SECRET, PORT } = process.env

// 确保 uploads 目录存在
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const app = express();
app.use(cors());

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

async function fetchCompleteVoiceResult(accessToken, voice_id) {
  const queryRecoresultUrl = `https://api.weixin.qq.com/cgi-bin/media/voice/queryrecoresultfortext?access_token=${accessToken}&voice_id=${voice_id}&lang=zh_CN`;

  let resultText = '';
  let isEnd = false;

  while (!isEnd) {
      try {
          const res = await axios.post(queryRecoresultUrl, {}, {
              headers: { 'Content-Type': 'application/json' }
          });

          if (res.data && res.data.result) {
              resultText += res.data.result;  // 拼接结果
          }

          isEnd = res.data.is_end;  // 更新is_end状态

      } catch (error) {
          console.error('Error fetching voice result:', error);
          throw error;  // 出现错误时抛出异常
      }
  }

  return resultText;  // 返回拼接好的结果
}

async function hashFile(filePath, algorithm = 'sha256') {
  return new Promise((resolve, reject) => {
      const hash = crypto.createHash(algorithm);
      const stream = fs.createReadStream(filePath);

      stream.on('data', (data) => {
          hash.update(data);
      });

      stream.on('end', () => {
          const result = hash.digest('hex');
          resolve(result);
      });

      stream.on('error', (err) => {
          reject(err);
      });
  });
}

// 调用微信语音识别接口
async function recognizeSpeech(accessToken, filePath) {
  try {
    console.log('Reading file:', filePath);
    // const fileContent = fs.readFileSync(filePath);
    // const base64Audio = fileContent.toString('base64');
    const form = new FormData();
    form.append('media', fs.createReadStream(filePath));

    // 计算文件的哈希值，并将其作为 voice_id
    const voice_id = await hashFile(filePath);
    console.log(`Generated voice_id (file hash): ${voice_id}`);

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

    const result = fetchCompleteVoiceResult(accessToken, voice_id)
    return result;

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

        recognitionResult = await recognizeSpeech(accessToken, req.file.path);
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
    // fs.unlinkSync(req.file.path);

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
