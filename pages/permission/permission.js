// pages/permission/permission.js
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  bindGetUserInfo(e) {
    // wx.openSetting()
    console.log(e.detail,'e')
    api.login({
      ...e.detail,
      success:res=>{
        wx.showToast({
          title: '登录成功!',
          icon: 'success',
          duration: 1000
        });
        wx.setStorageSync('token',res.token)
        wx.setStorageSync('nickName',e.detail.userInfo.nickName)
        wx.setStorageSync('avatarUrl',e.detail.userInfo.avatarUrl)
        setTimeout(()=>{
          const eventChannel = this.getOpenerEventChannel()
          console.log(eventChannel)
          eventChannel.emit('refreshData', {});
          wx.navigateBack({
            delta:-1
          })
        },1000)
      }

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