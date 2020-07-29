// pages/address-list/address-list.js
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[],
    type:''//select 为选择地址  空 为编辑地址
  },
  fetchData(){
    let that = this
    api.post({
      url:'/user/selectAddressList',
      data:{
        token:wx.getStorageSync('token')
      },
      success(res){
        console.log(res)
        if(res.data.length>0){
          for (const thatKey in res.data) {
            if(res.data[thatKey].isdefault=='y'){
              res.data[thatKey].isdefault=true
            }else {
              res.data[thatKey].isdefault=false
            }
          }
          that.setData({
            addressList:res.data
          })
        }
      }
    })
  },

  goAdd(){
    wx.navigateTo({
      url:'/pages/address-detail/address-detail'
    })
  },
  goDetail(e){
    let that = this
    if(that.data.type=='select'){
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];   //当前页面
      var prevPage = pages[pages.length - 2];  //上一个页面
//直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        addressDetail:e.currentTarget.dataset.item,
      })
      wx.navigateBack({
        delta: 1
      })
    }else {
      let id=e.currentTarget.dataset.item.id
      wx.navigateTo({
        url:'/pages/address-detail/address-detail?id='+id
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type=options.type
    if(type=='select'){
      this.setData({
        type:type
      })
    }
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