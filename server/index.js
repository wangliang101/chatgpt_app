const axios = require('axios');

// 替换为你的 AppID 和 AppSecret
const appId = 'YOUR_APP_ID';
const appSecret = 'YOUR_APP_SECRET';

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

// 示例调用
getAccessToken().then(accessToken => {
  console.log('Access Token:', accessToken);
});

