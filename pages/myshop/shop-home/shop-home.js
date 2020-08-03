// pages/myshop/shop-home/shop-home.js
const api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl:api.Host+'/',
    searchKeyword:'',
    ewmShow: false,
    shopInfo:{},
    pageNum:1,
    pageSize:10,
    goodsList:[],
    creat_time:'',//按照创建时间查询 "asc":升序 "desc"降序
    money:'',//按照价格查询 "asc":升序 "desc"降序
    commission:'',//按佣金查询 "asc":升序 "desc"降序
  },
    onEwmClickShow() {
        this.setData({ ewmShow: true });
    },

    onEwmClickHide() {
        this.setData({ ewmShow: false });
    },
  onSearchChange(event){
    console.log(event.detail)
    console.log(this.data.searchKeyword)
  },
  onSearchCancel(event){
    console.log(event.detail)
  },
  fetchData(){
    let that = this
    api.post({
      url:'/myShop/toIndex',
      data:{},
      success(res){
        console.log(res)
        if(res.code == 200){
          that.setData({
            shopInfo:res.data
          })
        }
      }
    })

  },
  fetchGoods(pageNum=1,append=false){
    let that = this
    api.post({
      url:'/myShop/xpgoodsdate',
      data:{
        pageNum:pageNum,
        pageSize:that.data.pageSize,
      },
      success(res){
        if(res.code == 200){
          if(res.data.list.length>0){
            if(append){
              that.setData({
                pageNum:pageNum,
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
    this.fetchGoods()
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
    this.fetchGoods(this.data.pageNum+1,true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})