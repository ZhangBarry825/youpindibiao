// pages/collect/collect.js
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: wx.getSystemInfoSync().windowHeight - 50,
    type:1,  //0：商品收藏 1：店铺收藏
    pageNum:1,
    pageSize:10,
    itemList:[],
  },
  goHome(){
    wx.switchTab({
      url:'/pages/home/home'
    })
  },
  goTo(e){
    let path=e.currentTarget.dataset.path
    let id=e.currentTarget.dataset.id
    wx.navigateTo({
      url:path+'?id='+id,
    })
  },
  onTabsClick(e){
    console.log(e.detail.name)
    if(e.detail.name==1){
      this.setData({
        type:0
      })
      this.fetchData()
    }else {
      this.setData({
        type:1
      })
      this.fetchData()
    }
  },
  fetchData(pageNum=1,append=false){
    let that = this
    api.post({
      url:'/share/selectCollectByUser',
      data:{
        state:that.data.type,
        pageNum:pageNum,
        pageSize:that.data.pageSize,
      },
      success(res){
        console.log(res)
        if(res.data.list.length>0){

          for (const apiKey in res.data.list) {
            res.data.list[apiKey].nearby_img=api.Host+'/'+res.data.list[apiKey].nearby_img
            res.data.list[apiKey].thumbnail=api.Host+'/'+res.data.list[apiKey].thumbnail
          }
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
          wx.showToast({
            title:'暂无更多',
            icon:'none',
            duration:1000
          })
          if(!append){
            that.setData({
              itemList:[]
            })
          }
        }
        console.log(that.data.itemList,'1')
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchData()
    setTimeout(()=>{
      this.setData({
        height: wx.getSystemInfoSync().windowHeight - 50
      })
    },100)
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