// pages/class/class.js
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKeyword:"",
    focus:false,
    height: wx.getSystemInfoSync().windowHeight - 55,
    mainActiveIndex: 0,
    activeId: 0,
    navItems:[],
    classItems:[]
  },

  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
    });
    console.log()
    this.fetchItem(this.data.mainActiveIndex)
  },

  onClickNavItem({ detail = {} }) {
    const activeId = this.data.activeId === detail.id ? null : detail.id;

    this.setData({ activeId });
  },
  onSearchFocus(){
    this.setData({
      focus:true
    })
  },
  onSearchCancel(){
    console.log('onSearchCancel')
    this.setData({
      searchKeyword:'',
      focus:false
    })
  },
  onSearchClick(event){
    console.log(event.detail)
    wx.navigateTo({
      url:'/pages/search-result/search-result?searchKeyword='+event.detail
    })
  },
  onSearchChange(e){
    this.setData({
      searchKeyword:e.detail
    })
  },
  fetchData(){
    let that = this
    //获取一级分类
    api.get({
      url:'/goodsType/TypeList',
      noLogin:true,
      data:{

      },
      success(res){

        for (const Key in res.data) {
          res.data[Key].img=api.Host+'/'+res.data[Key].img
          res.data[Key].text=res.data[Key].typeName
        }
        that.setData({
          navItems:res.data
        })

        console.log(that.data.navItems)
        that.fetchItem()
      }
    })
  },
  fetchItem(index = 0){
    let that = this
    api.get({
      url:'/goodsType/childTypeList',
      data:{
        typeId:that.data.navItems[index].id
      },
      noLogin:true,
      success(res) {
        for (const Key in res.data) {
          res.data[Key].img=api.Host+'/'+res.data[Key].img
        }
        that.setData({
          classItems:res.data
        })
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