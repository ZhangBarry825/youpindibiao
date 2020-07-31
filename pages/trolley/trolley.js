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
    // for (const listKey1 in trolleyList) {
    //   for (const listKey2 in trolleyList[listKey1].list) {
    //     delete trolleyList[listKey1].list[listKey2].createtime
    //     delete trolleyList[listKey1].list[listKey2].shopName
    //     delete trolleyList[listKey1].list[listKey2].state
    //     delete trolleyList[listKey1].list[listKey2].sysUsers
    //     delete trolleyList[listKey1].list[listKey2].userid
    //     delete trolleyList[listKey1].list[listKey2].reserved2
    //     delete trolleyList[listKey1].list[listKey2].reserved3
    //   }
    // }
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
    wx.setStorageSync('buyList',JSON.stringify(setBuyList))
    console.log(setBuyList,'setBuyList')
    wx.navigateTo({
      url:'/pages/order/trolley-confirm/trolley-confirm'
    })
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
          trolleyList[Key].list[Key2].checked=event.detail
        }
      }
    }
    this.setData({
      trolleyList: trolleyList,
    });
    this.countPrice()
  },
  onGoodsCheckedChange(event){
    let index=event.currentTarget.dataset.index
    let index2=event.currentTarget.dataset.index2
    let trolleyList=this.data.trolleyList
    this.setData({
      ['trolleyList['+index+'].list['+index2+'].checked']: event.detail,
    });
    this.countPrice()
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
          goodsnum:item.goodsnum+1
        },
        success(res){
          console.log(res)
          that.setData({
            ['trolleyList['+index+'].list['+index2+'].goodsnum']:item.goodsnum+1
          })
          that.countPrice()
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
            goodsnum:item.goodsnum-1
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
          goodsnum:0
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
      totalPrice:totalPrice,
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