const express = require('express');
const axios = require('axios');

require('dotenv').config(); 

const app = express();
const port = 3000;

const {APP_ID, APP_SECRET} = process.env

// 替换为你的 AppID 和 AppSecret
const appId = APP_ID;
const appSecret = APP_SECRET;

// 获取 ACCESS_TOKEN 的函数
async function getAccessToken() {
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
  
  try {
    const response = await axios.get(url);
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

// 创建一个 API 端点来获取 ACCESS_TOKEN
app.get('/getAccessToken', async (req, res) => {
  console.log('接口测试')
  const accessToken = await getAccessToken();
  if (accessToken) {
    res.send({ access_token: accessToken });
  } else {
    res.status(500).send({ error: 'Failed to get access token' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
