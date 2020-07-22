// pages/search-result/search-result.js
import {formatTimeTwo, saveOneDecimal, saveTwoDecimal} from "../../utils/util";

const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKeyword:"",
    toView: 'green',
    focus:false,
    height: wx.getSystemInfoSync().windowHeight - 20,
    searchType:0,
    pageNum:1,
    pageSize:10,
    goodsList:[],
    shopList:[],
    historyList:[],
    hotList:[],
  },
  scrollToTop() {
    console.log('scrollToTop')
  },
  upper(e) {
    console.log(e)
  },

  lower(e) {
    console.log(e)
  },
  onSearchFocus(){
    console.log(this.data.searchType)
    this.setData({
      focus:true
    })
  },
  onSearchCancel(){
    console.log('onSearchCancel')
    console.log(this.data.searchType)
    this.setData({
      focus:false
    })
  },
  onSearchClick(){
    console.log(this.data.searchKeyword,'关键词')
    if(this.data.searchKeyword!=''){
      this.setData({
        focus:false
      })
      this.searchData()
    }

  },
  onSearchChange(e){
    this.setData({
      searchKeyword:e.detail,
    })
  },
  onTabsClick(event){
    this.setData({
      searchType:event.detail.name
    })
    this.searchData(this.data.searchType)
  },
  goHistory(e){
    let key=e.currentTarget.dataset.key
    console.log(key)
    this.setData({
      searchKeyword:key,
      focus:false
    })
    this.searchData()
  },
  setSearchRecord(keyword){
    let that = this
    let searchRecord=wx.getStorageSync('searchRecord')
    if(searchRecord){
      let items=searchRecord.split(',')
      let has=items.indexOf(keyword)
      console.log(has,'has')
      if(has==-1){
        wx.setStorageSync('searchRecord',searchRecord+','+keyword)
        items.unshift(keyword)
      }else {
        items.splice(has,1)
        items.unshift(keyword)
      }
      that.setData({
        historyList:items.slice(0,10)
      })
      console.log(that.data.historyList,'historyList')
    }else {
      wx.setStorageSync('searchRecord',keyword)
      that.setData({
        historyList:[keyword]
      })
    }
  },
  searchData(type=0,pageNum=1,append=false){
    let that = this
    this.setSearchRecord(that.data.searchKeyword)
    if(that.data.searchType==0){
      api.post({
        url:'/showGoods/queryGood',
        noLogin: true,
        data:{
          pageNum:pageNum,
          pageSize:that.data.pageSize,
          name:that.data.searchKeyword,
        },
        success(res){
          console.log(res,999)
          if(res.data.list.length>0){
            for (const Key in res.data.list) {
              res.data.list[Key].thumbnail=api.Host+'/'+res.data.list[Key].thumbnail
            }
            if(append){
              that.setData({
                goodsList:that.data.goodsList.concat(res.data.list)
              })
            }else {
              that.setData({
                goodsList:res.data.list
              })
            }
          }else {
            if(!append){
              that.setData({
                goodsList:[]
              })
            }
            wx.showToast({
              title: '暂无更多',
              icon: 'none',
              duration: 2000
            })
          }


        }
      })
    }else if(that.data.searchType==1){
      api.post({
        url:'/business/queryBusiness',
        noLogin: true,
        data:{
          pageNum:pageNum,
          pageSize:that.data.pageSize,
          name:that.data.searchKeyword,
        },
        success(res){
          if(res.data.list.length>0){
            for (const resKey in res.data.list) {
              res.data.list[resKey].nearby_img=api.Host+'/'+res.data.list[resKey].nearby_img
              res.data.list[resKey].end_time=formatTimeTwo(res.data.list[resKey].end_time)
              res.data.list[resKey].start_time=formatTimeTwo(res.data.list[resKey].start_time)
            }
            if(append){
              that.setData({
                shopList:that.data.shopList.concat(res.data.list)
              })
            }else {
              that.setData({
                shopList:res.data.list
              })
            }
          }else {
            if(!append){
              that.setData({
                shopList:[]
              })
            }

            wx.showToast({
              title: '暂无更多',
              icon: 'none',
              duration: 2000
            })
          }


        }
      })
    }

    api.get({
      url:'/showGoods/toQuery',
      data: {

      },
      noLogin:true,
      success(res){
        that.setData({
          hotList:res.data.hotList
        })
      }

    })

  },
  goTo(e){
    let path=e.currentTarget.dataset.path
    let id=e.currentTarget.dataset.id
    wx.navigateTo({
      url:path+'?id='+id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.searchKeyword)
    this.setData({searchKeyword:options.searchKeyword})
    this.searchData()
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
    this.searchData(this.data.searchType,this.data.pageNum+1,true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})