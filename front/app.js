// app.js
App({
  onLaunch() {
    // app.js
    App({
      onLaunch() {
        // 自动切换到指定的tab
        // wx.switchTab({
        //   url: 'pages/chatlist/chatlist'
        // });
      }
    })
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: res => {
    //     console.log('login success', res)
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     wx.request({
    //       url:'http://127.0.0.1:3000/login',
    //       method:'POST',
    //       data:{
    //           code : res.code
    //       }
    //     })
    //   }
    // })
  },
  globalData: {
    userInfo: null
  }
})
