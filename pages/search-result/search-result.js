// pages/search-result/search-result.js
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKeyword:"",
    toView: 'green',
    focus:false,
    height: wx.getSystemInfoSync().windowHeight - 100,
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
  searchData(type=0,pageNum=1,append=false){
    let that = this
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
            for (const Key in res.data.list) {
              res.data.list[Key].thumbnail=api.Host+'/'+res.data.list[Key].thumbnail
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
        console.log(res,'历史记录')
        that.setData({
          historyList:res.data.history,
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