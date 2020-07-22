// pages/setting-help/setting-help.js
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    helpList:[],
    pageSize:20,
    pageNum:1
  },
  goDetail(e){
    let item= e.currentTarget.dataset.item
    console.log(item)
    wx.navigateTo({
      url:'/pages/setting-help-detail/setting-help-detail?id='+item.id
    })
  },
  fetchData(pageNum=1,append=false){
    let that = this
    api.post({
      url:'/user/helpTextPageList',
      data:{
        pageSize:that.data.pageSize,
        pageNum:pageNum
      },
      success(res){
        console.log(res)
        if(res.code == 200){
          if(res.data.list.length>0){
            if(append){
              that.setData({
                helpList:that.data.helpList.concat(res.data.list),
                pageNum:pageNum
              })
            }else {
              that.setData({
                helpList:res.data.list
              })
            }
          }else {
            wx.showToast({
              title:'暂无更多',
              icon:'none',
              duration:1000
            })
          }

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