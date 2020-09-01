// pages/trolley/trolley.js
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl:api.Host+'/',
    nothing:false,
    shopChecked:false,
    goodsChecked:false,
    trolleyList:[],
    totalPrice:0.00,//合计
  },
  goPay(){
    let that = this
    let buyList=[]
    let trolleyList=JSON.parse(JSON.stringify(that.data.trolleyList))

    for (const apiKey in trolleyList) {
      for (const apiKey1 in trolleyList[apiKey].list) {
        if(trolleyList[apiKey].list[apiKey1].checked){
          let shopList=trolleyList[apiKey]
          let newList=[]
          for (const apiKey2 in shopList.list) {
            if(shopList.list[apiKey2].checked){
              newList.push(shopList.list[apiKey2])
            }
          }
          shopList.list=newList
          buyList.push(shopList)
          break;
        }
      }
    }
    let setBuyList={
      totalPrice:that.data.totalPrice,
      buyList:buyList
    }
    if(buyList.length>0){
      wx.setStorageSync('buyList',JSON.stringify(setBuyList))
      console.log(setBuyList,'setBuyList')
      wx.navigateTo({
        url:'/pages/order/trolley-confirm/trolley-confirm'
      })
    }else {
      wx.showToast({
        title:'请先选择商品！',
        icon:'none',
        duration:1000
      })
    }

  },
  goHome(){
    wx.switchTab({
      url:'/pages/home/home'
    })
  },
  onShopCheckedChange(event){
    let index=event.currentTarget.dataset.index
    let trolleyList=this.data.trolleyList
    for (const Key in trolleyList) {
      if(index==Key){
        trolleyList[Key].checked=event.detail
        for (const Key2 in trolleyList[Key].list) {
          let item = trolleyList[Key].list[Key2]
          if(item.goodsnum>parseInt(item.reserved2)){
            wx.showToast({
              title:'部分商品库存不足',
              icon:'none',
              duration:1000
            })
          }else {
            trolleyList[Key].list[Key2].checked=event.detail
          }
        }
      }
    }
    this.setData({
      trolleyList: trolleyList,
    });
    this.countPrice()
  },
  onGoodsCheckedChange(event){
    let that = this
    let index=event.currentTarget.dataset.index
    let index2=event.currentTarget.dataset.index2
    let trolleyList=this.data.trolleyList
    console.log(that.data.trolleyList[index].list[index2])
    let item=that.data.trolleyList[index].list[index2]
    console.log(that.data.trolleyList)
    if(item.goodsnum>parseInt(item.reserved2)){
      wx.showToast({
        title:'库存不足，库存为'+parseInt(item.reserved2),
        icon:'none',
        duration:1000
      })
    }else {
      this.setData({
        ['trolleyList['+index+'].list['+index2+'].checked']: event.detail,
      });
      this.countPrice()
    }
  },
  updateData(e){
    let action=e.currentTarget.dataset.action
    let index=e.currentTarget.dataset.index
    let index2=e.currentTarget.dataset.index2
    let item=e.currentTarget.dataset.item
    let that = this
    let trolleyList=that.data.trolleyList
    if(action=='add'){
      api.post({
        url:'/tCar/updateTCarByGoods',
        data:{
          carid:item.id,
          goodsid:item.goodsid,
          shopid:item.shopid,
          goodsnum:item.goodsnum+1,
          skuid:item.skuid
        },
        success(res){
          console.log(res)
          if(res.message!='库存不足'){
            that.setData({
              ['trolleyList['+index+'].list['+index2+'].goodsnum']:item.goodsnum+1
            })
            that.countPrice()
          }else{
            wx.showToast({
              title:'库存不足！',
              icon:'none',
              duration:1000
            })
          }

        }
      })
    }else if(action=='minus'){
      if(item.goodsnum>1){
        api.post({
          url:'/tCar/updateTCarByGoods',
          data:{
            carid:item.id,
            goodsid:item.goodsid,
            shopid:item.shopid,
            goodsnum:item.goodsnum-1,
            skuid:item.skuid
          },
          success(res){
            console.log(res)
            that.setData({
              ['trolleyList['+index+'].list['+index2+'].goodsnum']:item.goodsnum-1
            })
            that.countPrice()
          }
        })
      }
    }else if(action=='del'){
      api.post({
        url:'/tCar/updateTCarByGoods',
        data:{
          carid:item.id,
          goodsid:item.goodsid,
          shopid:item.shopid,
          goodsnum:0,
          skuid:item.skuid
        },
        success(res){
          console.log(res)
          trolleyList[index].list.splice(index2,1)
          if(trolleyList[index].list.length==0){
            trolleyList.splice(index,1)
          }
          that.setData({
            trolleyList:trolleyList
          })
          that.countPrice()
        }
      })
    }
  },
  goGoodsDetail(e){
    let item = e.currentTarget.dataset.item
    console.log(item,'item')
    wx.navigateTo({
      url:'/pages/goods-detail/goods-detail?id='+item.goodsid
    })

  },
  countPrice(){
    let that = this
    let trolleyList=that.data.trolleyList
    let totalPrice=0
    for (const apiKey in trolleyList) {
      let total=0
      for (const apiKey1 in trolleyList[apiKey].list) {
        if(trolleyList[apiKey].list[apiKey1].checked){
          total=total+trolleyList[apiKey].list[apiKey1].goodsnum*trolleyList[apiKey].list[apiKey1].payNum
        }
      }
      trolleyList[apiKey].countPrice=total
      totalPrice+=total
    }
    that.setData({
      totalPrice:totalPrice.toFixed(2),
      trolleyList:trolleyList
    })
  },
  fetchData(){
    let that = this
    api.post({
      url:'/tCar/selectTCarByUser',
      data:{},
      success(res){
       if(res.code == 200){
         for (const apiKey in res.data) {
           for (const apiKey1 in res.data[apiKey].list) {
             res.data[apiKey].list[apiKey1].checked=false
           }
           res.data[apiKey].countPrice=0.00
           res.data[apiKey].checked=false
         }
         that.setData({
           trolleyList:res.data,
           totalPrice:0.00
         })
       }

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.fetchData()

    setTimeout(()=>{
      wx.stopPullDownRefresh()
    },1000)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})