// index.js
const recorderManager = wx.getRecorderManager();

Page({
  data: {
    recordState: false,  // 录音状态
    recordTime: 0,       // 录音时长
    voices: [],          // 语音消息列表
  },
  
  // 开始录音
  startRecord() {
    const options = {
      duration: 60000, // 最长录音时间，单位ms
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 48000,
      format: 'mp3',
    };
    
    recorderManager.start(options);
    this.setData({ recordState: true, recordTime: 0 });
    
    this.startTimer();
    
    recorderManager.onStart(() => {
      console.log('recorder start');
    });
    
    recorderManager.onError((res) => {
      console.error('recorder error:', res);
    });
  },
  
  // 停止录音
  stopRecord() {
    recorderManager.stop();
    this.setData({ recordState: false });
    this.clearTimer();
    
    recorderManager.onStop((res) => {
      console.log('recorder stop', res);
      this.uploadVoice(res.tempFilePath);
    });
  },
  
  // 上传语音文件并转换为文本
  uploadVoice(filePath) {
    wx.request({
      url: 'http://localhost:3000/getAccessToken', 
      success: function (res) {
        const accessToken = res.data.access_token;
        if (accessToken) {
          console.log('accessToken', filePath,accessToken)
              
        // 上传录音文件到微信服务器
          wx.uploadFile({
            url: `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${accessToken}&type=voice`,
            filePath: filePath,
            name: 'file',
            success: (uploadRes) => {
              const data = JSON.parse(uploadRes.data);
              console.log('data',data)
              const mediaId = data.media_id;
              if (mediaId) {
                // 调用语音转文字接口
                wx.request({
                  url: `https://api.weixin.qq.com/cgi-bin/media/voice/addvoicetorecofortext?access_token=${accessToken}&format=mp3&voice_id=${mediaId}&lang=zh_CN`,
                  method: 'POST',
                  success: function (recoRes) {
                    if (recoRes.data.errcode === 0) {
                      // 获取结果
                      const recognitionResult = recoRes.data.result;
                      that.setData({ recognitionResult: recognitionResult });
                    } else {
                      console.error('Failed to recognize voice', recoRes.data);
                    }
                  },
                  fail: function (err) {
                    console.error('Failed to recognize voice', err);
                  }
                });
              } else {
                console.error('Failed to upload voice', data);
              }
            },
            fail: (err) => {
              console.error('Failed to upload voice', err);
            }
          });
        } else {
          console.error('Failed to get access token');
        }
      },
      fail: function (err) {
        console.error('Failed to get access token', err);
      }
    })

    // wx.uploadFile({
    //   url: 'http://localhost:3000/getAccessToken', 
    //   filePath: filePath,
    //   name: 'file',
    //   success: (res) => {
    //     const data = JSON.parse(res.data);
    //     if (data.text) {
    //       this.setData({
    //         voices: [...this.data.voices, { type: 'text', content: data.text }]
    //       });
    //     }
    //   },
    //   fail: (error) => {
    //     console.error('Upload failed', error);
    //     wx.showToast({
    //       title: '上传失败',
    //       icon: 'none'
    //     });
    //   }
    // });
  },
  
  // 开始计时器
  startTimer() {
    this.timer = setInterval(() => {
      this.setData({ recordTime: this.data.recordTime + 1 });
    }, 1000);
  },
  
  // 清除计时器
  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  // 组件生命周期函数
  onUnload() {
    this.clearTimer();
  }
});