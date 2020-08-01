// pages/order/express/express.js
const api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid:'',
    expressDetail:{},
    steps: [],
  },
  fetchData(){
    let that = this
    api.post({
      url:'/order/queryWuliu',
      data:{
        orderid:that.data.orderid
      },
      success(res){
        console.log(res)
        if(res.code == 200){
          res.data.thumbnail=api.Host+'/'+res.data.thumbnail
          res.data.mapList.reverse()
          for (const thatKey in res.data.mapList) {
            res.data.mapList[thatKey].text=res.data.mapList[thatKey].context
            res.data.mapList[thatKey].desc=res.data.mapList[thatKey].time
          }
          that.setData({
            expressDetail:res.data,
            steps:res.data.mapList
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderid:options.orderid
    })
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