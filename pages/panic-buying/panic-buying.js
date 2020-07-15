// pages/panic-buying/panic-buying.js
import {formatTimeTwo, saveOneDecimal, saveTwoDecimal} from "../../utils/util";
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab:0,
    height: wx.getSystemInfoSync().windowHeight-98,
    leftTime: 0,
    scrapStart:false,
    nowScrapIndex:0,//选择的当前抢购时间下标
    startOne:false,
    startTwo:false,
    startTree:false,
  },
  goTo(e){
    let path=e.currentTarget.dataset.path
    let id=e.currentTarget.dataset.id
    wx.navigateTo({
      url:path,
    })
    console.log(path)
    console.log(id)
  },
  onTabChange(event){
    let t=event.detail.name
    this.setData({
      nowScrapIndex:event.detail.name
    })
    this.getScrapGoods(event.detail.name)
  },
  getScrapGoods(timeLimitState = 0){
    let that = this
    //首页显示抢购
    api.post({
      url:'/timeLimit/tGoodsTimeLimitList',
      noLogin:true,
      data:{
        timeLimitState:timeLimitState,
        pageSize:2,
      },
      success:res=>{
        console.log(res)
        for (const resKey in res.data.data.list) {
          res.data.data.list[resKey].thumbnail=api.Host+'/'+res.data.data.list[resKey].thumbnail
        }
        let serverTime=res.data.localtime
        let startTime=0

        let{timeOne,timeTwo,timeThree}={
          timeOne:new Date(new Date().toLocaleDateString()).getTime()+10*60*60*1000,
          timeTwo:new Date(new Date().toLocaleDateString()).getTime()+16*60*60*1000,
          timeThree:new Date(new Date().toLocaleDateString()).getTime()+20*60*60*1000,
        }
        //判断三个栏目是否已经开始
        if(serverTime>timeOne){
          that.setData({
            startOne:true
          })
        }
        if(serverTime>timeTwo){
          that.setData({
            startTwo:true
          })
        }
        if(serverTime>timeThree){
          that.setData({
            startThree:true
          })
        }


        let endTime=new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000
        if(timeLimitState==0){
          startTime=timeOne
        }else if(timeLimitState==1){
          startTime=timeTwo
        }else if(timeLimitState==2){
          startTime=timeThree
        }
        if(serverTime<startTime){
          //未开始
          that.setData({
            leftTime:startTime-serverTime,
            scrapStart:false
          })
        }else {
          //已开始
          that.setData({
            leftTime:endTime-serverTime,
            scrapStart:true
          })
        }
        console.log(this.data.leftTime)
        that.setData({
          grabList:res.data.data.list
        })
        console.log(res.data.data.list,'显示抢购')
      }
    })
  },
  onTimeOut(){
    console.log('倒计时结束')
    this.getScrapGoods(this.data.nowScrapIndex)
  },
  onTimeChange(e) {
    this.setData({
      timeData: e.detail,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getScrapGoods()


    // let windowHeight = wx.getSystemInfoSync().windowHeight
    // console.log(windowHeight,9090)
    // this.setData({
    //   height: windowHeight - 95
    // })
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