// pages/goods-list/goods-list.js
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex:0,
    height: wx.getSystemInfoSync().windowHeight+35,
    pageSize:10,
    pageNum:1,
    goodsType:'',
    goodsList:[],
    bySales:null,
    byStar:null,
    byPrice:null,
  },
  orderBy(e){
    if(e.currentTarget.dataset.index==0){
      if(this.data.bySales==null){
        this.setData({
          bySales:'y',
          byStar:null,
          byPrice:null,
        })
      }else {
        this.setData({
          bySales:null,
          byStar:null,
          byPrice:null,
        })
      }
    }else if(e.currentTarget.dataset.index==1){
      if(this.data.byStar==null){
        this.setData({
          byStar:'y',
          bySales:null,
          byPrice:null,
        })
      }else {
        this.setData({
          bySales:null,
          byStar:null,
          byPrice:null,
        })
      }
    }else if(e.currentTarget.dataset.index==1){
      if(this.data.byPrice==null){
        this.setData({
          byPrice:'y',
          bySales:null,
          byStar:null,
        })
      }else {
        this.setData({
          bySales:null,
          byStar:null,
          byPrice:null,
        })
      }
    }
    this.fetchData(1,false,this.data.bySales,this.data.byStar,this.data.byPrice)

  },
  fetchData(pageNum=1,append=false,bySales=null,byStar=null,byPrice=null){
    let that = this
    let url=this.data.goodsType=='hotGoods'?'/hotGoods/moreHotGoodsList':this.data.goodsType=='newGoods'?'/newGoods/moreNewGoodsList':''
    api.post({
      url:url,
      noLogin:true,
      data:{
        pageNum: pageNum,
        pageSize: that.data.pageSize,
        bySales:bySales,
        byStar:byStar,
        byPrice:byPrice,
      },
      success(res){
        console.log(res)
        if(res.data.list.length>0){
          for (const bySalesKey in res.data.list) {
            res.data.list[bySalesKey].thumbnail=api.Host+'/'+res.data.list[bySalesKey].thumbnail
          }
          if(append){
            that.setData({
              goodsList:that.data.goodsList.concat(res.data.list),
              pageNum:pageNum
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
            duration: 1000
          })
        }
      }
    })
  },
  appendData(){
    let that = this
    console.log('触底啦')
    this.fetchData(that.data.pageNum+1,true,that.data.bySales,that.data.byStar,that.data.byPrice)

  },
  goTo(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url:'/pages/goods-detail/goods-detail'+'?id='+id,
    })

    // console.log(path)
    // console.log(id)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type=options.type
    this.setData({
      goodsType:type
    })
    console.log(type)
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