// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:0,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  allowGetUserInfo: function(e){
    console.log('e', e)
    // wx.getUserInfo({
    //   success: res => {
    //     console.log('res', res)

    //   }
    // })
  },
  getPhoneNumber: function(e){
    console.log("getPhoneNumber", e.detail.code,e)
  },

  onChooseAvatar: function(e) {
    const { avatarUrl } = e.detail
    console.log('选择头像',avatarUrl, e);

    // this.setData({
    //   ['userInfo.avatar']: avatarUrl
    // })
  },
  bindGetUserInfo (e) {
    console.log(e.detail.userInfo)
  },
  getUserProfile(){
    console.log('点击了 getUserProfile')
    wx.getUserProfile({
      desc: '获取用户信息',
      success: (res)=>{
        console.log('获取用户信息 成功', res)
      },
      fail:(err) => {
        console.log('获取用户信息 失败', err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
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