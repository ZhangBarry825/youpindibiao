// pages/goods-comment/goods-comment.js
import {formatTime} from "../../utils/util";

const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    pageSize:10,
    pageNum:1,
    commentList:[],
    type:'',//评价类型  goods or shop
  },
  previewImg(e){
    let url=e.currentTarget.dataset.url
    let urls=e.currentTarget.dataset.urls
    let newUrls=[]
    for (const urlsKey in urls) {
      newUrls.push(urls[urlsKey].imageUrl)
    }
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: newUrls// 需要预览的图片http链接列表
    })
  },
  fetchData(pageNum=1,append=false){
    let that = this
    let id = {}
    that.data.type=='goods'?id={goodId:that.data.id}:id={userId:that.data.id}
    api.post({
      url:that.data.url,
      noLogin: true,
      data:{
        pageNum: pageNum,
        pageSize: that.data.pageSize,
        ...id
      },
      success(res){
        if(that.data.type=='goods'){
          for (const thatKey in res.data.list) {
            res.data.list[thatKey].createtime=formatTime(res.data.list[thatKey].createtime)
            for (const argumentsKey in res.data.list[thatKey].image) {
              res.data.list[thatKey].image[argumentsKey].imageUrl=api.Host+'/'+res.data.list[thatKey].image[argumentsKey].imageUrl
            }
          }
        }else if(that.data.type=='shop'){
          for (const thatKey in res.data.list) {
            for (const argumentsKey in res.data.list[thatKey].images) {
              res.data.list[thatKey].images[argumentsKey].imageUrl=api.Host+'/'+res.data.list[thatKey].images[argumentsKey].imageUrl
            }
          }
        }

        if(append){
          if(res.data.list.length>0){
            that.setData({
              commentList:that.data.commentList.concat(res.data.list),
              pageNum:pageNum
            })
          }else {
            wx.showToast({
              title: '暂无更多',
              icon: 'none',
              duration: 2000
            })
          }

        }else {
          that.setData({
            commentList:res.data.list
          })
        }

        console.log(that.data.commentList)
      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    console.log(options.type)
    if(options.type=='goods'){
      this.setData({
        id:options.id,
        url:'/evaluate/showEvaluate',
        type:'goods'
      })
    }else if(options.type=='shop'){
      this.setData({
        id:options.id,
        url:'/evaluate/selectMoreEvaluateList',
        type:'shop'
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
    this.fetchData(this.data.pageNum+1,true)
    console.log('触底啦')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})