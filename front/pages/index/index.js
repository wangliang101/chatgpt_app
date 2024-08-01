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
    wx.showLoading({ title: '识别中...' });
    wx.uploadFile({
      url: 'http://localhost:3000/upload', // 替换为你的服务器地址
      filePath: filePath,
      name: 'file',
      success: (res) => {
        wx.hideLoading();
        const data = JSON.parse(res.data);
        if (data.text) {
          this.setData({
            voices: [...this.data.voices, { type: 'text', content: data.text }]
          });
        }
      },
      fail: (error) => {
        wx.hideLoading();
        console.error('Upload failed', error);
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        });
      }
    });
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