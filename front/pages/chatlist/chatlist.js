// pages/chatlist/chatlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chatlist: [
      {
        "id": "1",
        "avatar": "image/user-avatar1.jpg",
        "title": "测试1",
        "message": "小程序登陆说明，测试数据",
        "time": "20:35"
      },
      {
        "id": "2",
        "avatar": "image/user-avatar1.jpg",
        "title": "测试2",
        "message": "这是另一个测试消息。",
        "time": "21:00"
      },
      {
        "id": "3",
        "avatar": "image/user-avatar1.jpg",
        "title": "测试3",
        "message": "请查看最新更新。",
        "time": "21:30"
      },
      {
        "id": "4",
        "avatar": "image/user-avatar1.jpg",
        "title": "测试4",
        "message": "您有一条新的通知。",
        "time": "22:00"
      },
      {
        "id": "5",
        "avatar": "image/user-avatar1.jpg",
        "title": "测试5",
        "message": "活动即将开始。",
        "time": "22:15"
      },
      {
        "id": "6",
        "avatar": "image/user-avatar1.jpg",
        "title": "测试6",
        "message": "系统维护通知。",
        "time": "22:45"
      },
      {
        "id": "7",
        "avatar": "image/user-avatar1.jpg",
        "title": "测试7",
        "message": "请检查您的账户设置。",
        "time": "23:00"
      },
      {
        "id": "8",
        "avatar": "image/user-avatar1.jpg",
        "title": "测试8",
        "message": "新消息提醒。",
        "time": "23:15"
      },
      {
        "id": "9",
        "avatar": "image/user-avatar1.jpg",
        "title": "测试9",
        "message": "您的密码已更改。",
        "time": "23:30"
      },
      {
        "id": "10",
        "avatar": "image/user-avatar1.jpg",
        "title": "测试10",
        "message": "请确认您的电子邮件地址。",
        "time": "23:45"
      },
      {
        "id": "11",
        "avatar": "image/user-avatar1.jpg",
        "title": "测试11",
        "message": "有新的任务分配给你。",
        "time": "00:00"
      },
      {
        "id": "12",
        "avatar": "image/user-avatar1.jpg",
        "title": "测试12",
        "message": "新的更新已发布。",
        "time": "00:15"
      },
      {
        "id": "13",
        "avatar": "image/user-avatar1.jpg",
        "title": "测试13",
        "message": "系统错误报告。",
        "time": "00:30"
      },
      {
        "id": "14",
        "avatar": "image/user-avatar1.jpg",
        "title": "测试14",
        "message": "您的账户需要验证。",
        "time": "00:45"
      },
      {
        "id": "15",
        "avatar": "image/user-avatar1.jpg",
        "title": "测试15",
        "message": "有关安全的更新。",
        "time": "01:00"
      },
      {
        "id": "16",
        "avatar": "image/user-avatar1.jpg",
        "title": "测试16",
        "message": "有新的推荐消息。",
        "time": "01:15"
      },
      {
        "id": "17",
        "avatar": "image/user-avatar1.jpg",
        "title": "测试17",
        "message": "请检查您的网络连接。",
        "time": "01:30"
      },
      {
        "id": "18",
        "avatar": "image/user-avatar1.jpg",
        "title": "测试18",
        "message": "您的订阅已到期。",
        "time": "01:45"
      },
      {
        "id": "19",
        "avatar": "image/user-avatar1.jpg",
        "title": "测试19",
        "message": "新功能发布。",
        "time": "02:00"
      },
      {
        "id": "20",
        "avatar": "image/user-avatar1.jpg",
        "title": "测试20",
        "message": "请完成您的设置。",
        "time": "02:15"
      }
    ]    
  },
  // 处理点击事件
  handleItemTap: function(e) {
    const id = e.currentTarget.dataset.id; // 获取点击项的 id
    wx.navigateTo({
      url: `/pages/chat/chat?id=${id}` // 跳转到详情页，并传递 id 参数
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})