// pages/myshop/shop-invite/shop-invite.js
const api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'http://600s.baidu.com/s/1kUMNzEJ',
    dataDetail:{

    }

  },
  textPaste(){
    let that = this
    wx.showToast({
      title: '复制成功',
    })
    wx.setClipboardData({
      data: that.data.url,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  fetchData(){
    let that = this
    api.post({
      url:'/myShop/getInviteInfo',
      data:{},
      success(res){
        console.log(res)
        if(res.code == 200){
          that.setData({
            dataDetail:res.data
          })
        }
      }
    })
    api.post({
      url:'/user/createQRcode',
      data:{
        type:1,
        page:'pages/home/home',
      },
      success(res){
        console.log(res)
        if(res.code == 200 && res.data){
          that.setData({
            imgUrl:res.data
          })
        }else {
          wx.showToast({
            title:'加载出错！',
            icon:'none',
            duration:3000
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