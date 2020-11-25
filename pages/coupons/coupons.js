// pages/coupons/coupons.js
const api = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    itemList:[],
    state:1  //1未使用 2已使用 3已过期
  },
  onChange(event) {
    if(event.detail.name == 0){
      this.setData({
        state:1
      })
    }else if(event.detail.name == 1){
      this.setData({
        state:2
      })
    }else if(event.detail.name == 2){
      this.setData({
        state:3
      })
    }
    this.fetchData()
  },
  goGoodsDetail(e){
    wx.navigateTo({
      url:'/pages/goods-detail/goods-detail?id='+e.currentTarget.dataset.id
    })
  },
  fetchData(){
    let that = this
    api.post({
      url:'/coupon/getListByUser',
      data:{
        state:that.data.state
      },
      success(res){
        if(res.code == 200 && res.data.length>0){
          that.setData({
            itemList:res.data
          })
        }else {
          that.setData({
            itemList:[]
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