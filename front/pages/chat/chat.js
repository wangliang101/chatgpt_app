Page({
  data: {
    userAvatar: '/assets/user-avatar.png', // 用户头像路径
    contactAvatar: '/assets/contact-avatar.png', // 对方头像路径
    inputValue: '',
    messages: [
      {
        id: 1,
        content: '你好！',
        time: '08:45',
        isSentByUser: false
      },
      {
        id: 2,
        content: '早上好！',
        time: '08:46',
        isSentByUser: true
      },
      {
        id: 3,
        content: '今天有什么计划？',
        time: '08:47',
        isSentByUser: false
      }
    ]
  },
  
  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },
  
  sendMessage() {
    const { inputValue, messages } = this.data;

    if (!inputValue.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      content: inputValue,
      time: this.getCurrentTime(),
      isSentByUser: true
    };
    
    this.setData({
      messages: [...messages, newMessage],
      inputValue: ''
    });

    this.scrollToBottom();
  },
  
  getCurrentTime() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  },
  
  scrollToBottom() {
    const query = wx.createSelectorQuery();
    query.select('.message-list').boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec(function(res) {
      wx.pageScrollTo({
        scrollTop: res[0].bottom
      });
    });
  }
});
