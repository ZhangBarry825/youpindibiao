// pages/nearby-shop/nearby-shop.js
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showShare:false,
    showSpecification:false,
    number:1,
    pageSize:10,  //全部商品的pageSize
    pageNum:1,
    id:'',
    shopDetail:{},
    commentList:[],
    goodsList:[]
  },
  minusNum(){
    if(this.data.number>1){
      this.setData({number:this.data.number-1})
    }
  },
  addNum(){
    this.setData({number:this.data.number+1})
  },
  showShare() {
    this.setData({ showShare: true });
  },
  onShareClose(){
    this.setData({ showShare: false });
  },
  showSpecification() {
    this.setData({ showSpecification: true });
  },
  onSpecificationClose(){
    this.setData({ showSpecification: false });
  },
  fetchData(){
    let that = this
    //获取商家详情
    api.post({
      url:'/business/selectBusinessById',
      data:{
        userId:that.data.id
      },
      noLogin:true,
      success(res){
        for (const apiKey in res.data.imageList) {
          res.data.imageList[apiKey].imageUrl=api.Host+'/'+res.data.imageList[apiKey].imageUrl
        }
        res.data.sysUser.nearbyImg=api.Host+'/'+ res.data.sysUser.nearbyImg
        that.setData({
          shopDetail:res.data
        })
        console.log(that.data.shopDetail,888)
      }
    })
    //获取评论预览
    api.post({
      url:'/evaluate/selectEvaluateList',
      data:{
        userId:that.data.id,
        pageSize:2
      },
      noLogin: true,
      success(res){
        for (const apiKey in res.data.list) {
          for (const apiKey1 in res.data.list[apiKey].images) {
            res.data.list[apiKey].images[apiKey1].imageUrl=api.Host+'/'+res.data.list[apiKey].images[apiKey1].imageUrl
          }
        }
        that.setData({
          commentList:res.data.list
        })
      }

    })

    //获取全部商品
    api.post({
      url:"/business/toNearbyShopList",
      data:{
        pageSize:that.data.pageSize,
        pageNum:1,
        userId:that.data.id
      },
      noLogin:true,
      success(res){
        for (const Key in res.data.list) {
          res.data.list[Key].thumbnail=api.Host+'/'+res.data.list[Key].thumbnail
        }
        that.setData({
          goodsList:res.data.list
        })
        console.log(that.data.goodsList)
      }

    })

  },
  fetchMoreGoods(pageNum=1,append=false){
    let that = this
    api.post({
      url:"/business/toNearbyShopList",
      data:{
        pageSize:that.data.pageSize,
        pageNum:pageNum,
        userId:that.data.id
      },
      noLogin:true,
      success(res){
        if( res.data.list.length>0){
          for (const Key in res.data.list) {
            res.data.list[Key].thumbnail=api.Host+'/'+res.data.list[Key].thumbnail
          }
          that.setData({
            goodsList:that.data.goodsList.concat(res.data.list),
            pageNum:pageNum
          })
        }else {
          wx.showToast({
            title:'暂无更多',
            icon:'none',
            duration:1000
          })
        }

        console.log(that.data.goodsList)
      }

    })
  },
  goTo(e){
    let id=e.currentTarget.dataset.id
    let path=e.currentTarget.dataset.path
    wx.navigateTo({
      url:path+'?id='+id
    })
  },
  goComments(){
    wx.navigateTo({
      url:'/pages/goods-comment/goods-comment?id='+this.data.id+'&type=shop'
    })
  },
  callShop(){
    wx.makePhoneCall({
      phoneNumber: this.data.shopDetail.sysUser.tel
    })
  },
  collectShop(){
    let that = this
    api.post({
      url:'/share/addShareByUser',
      data:{
        state:3,
        goodsid:that.data.id
      },
      success(res){
        console.log(res,999)
      }
    })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    this.setData({
      id:id
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
    this.fetchData()
    setTimeout(()=>{
      wx.stopPullDownRefresh()
    },1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('触底啦')
    this.fetchMoreGoods(this.data.pageNum+1,true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})