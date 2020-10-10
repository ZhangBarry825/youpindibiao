// pages/setting/setting.js
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel:""
  },
  goTo(e){
    let path= e.currentTarget.dataset.path
    wx.navigateTo({
      url:path
    })
  },
  callUs(){
    wx.makePhoneCall({
      phoneNumber: this.data.tel
    })
  },
  fetchData(){
    let that = this
    api.post({
      url:'/user/selectLevelDetail',
      data:{},
      success(res){
        //console.log(res)
        if(res.code == 200){
          that.setData({
            tel:res.data.tel
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchData()
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