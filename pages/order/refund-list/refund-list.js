// pages/order/refund-list/refund-list.js
const api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum:1,
    pageSize:10,
    itemList:[],
    baseUrl:api.Host+'/'
  },
  goOrderDetail(e){
    let orderid=e.currentTarget.dataset.id
    wx.navigateTo({
      url:'/pages/order/refund-detail/refund-detail?orderid='+orderid
    })
  },
  fetchData(pageNum=1,append=false){
    let that = this
    api.post({
      url:'/returnGoods/selectReturnGoods',
      data:{
        pageSize:that.data.pageSize,
        pageNum:pageNum,
      },
      success(res){
        console.log(res)
        if(res.code == 200){
          if(res.data.list.length>0){
            if(append){
              that.setData({
                itemList:that.data.itemList.concat(res.data.list)
              })
            }else {
              that.setData({
                itemList:res.data.list
              })
            }
          }else {
            if(!append){
              that.setData({
                itemList:[]
              })
            }
            wx.showToast({
              title:'暂无更多',
              icon:'none',
              duration:1000
            })
          }
          console.log(that.data.itemList,'itemList')

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
    this.fetchData(this.data.pageNum+1,true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})