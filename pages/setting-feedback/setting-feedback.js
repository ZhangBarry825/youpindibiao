// pages/setting-feedback/setting-feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    email:'',
    message:'',
  },
  onPhoneChange(event){
    console.log(event.detail);
    this.setData({
      phone:event.detail
    })
  },
  onEmailChange(event){
    console.log(event.detail);
    this.setData({
      email:event.detail
    })
  },
  onMessageChange(event){
    console.log(event.detail);
    this.setData({
      message:event.detail
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})