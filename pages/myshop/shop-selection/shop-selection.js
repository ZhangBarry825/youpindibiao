// pages/myshop/shop-selection/shop-selection.js
const api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagsActive:0,
    baseUrl:api.Host+'/',
    showMenus:true,
    searchKeyword:"",
    pageSize:10,
    pageNum:1,
    goodsList:[],
    bannerList:[],
    categoryList:[],
    categoryTwoList:[],//二级分类
    creatTime:'',
    money:'',
    commission:'',
    fk_id:''
  },
  orderBy(e){
    let that = this
    let type=e.currentTarget.dataset.type
    if(type=='creatTime'){
      if(that.data.creatTime=='asc'){
        that.setData({
          creatTime:'desc',
          commission:'',
          money:'',
          goodsList:[]
        })
      }else{
        that.setData({
          creatTime:'asc',
          commission:'',
          money:'',
          goodsList:[]
        })
      }
    }

    if(type=='money'){
      if(that.data.money=='asc'){
        that.setData({
          money:'desc',
          creatTime:'',
          commission:'',
          goodsList:[]
        })
      }else{
        that.setData({
          money:'asc',
          creatTime:'',
          commission:'',
          goodsList:[]
        })
      }
    }

    if(type=='commission'){
      if(that.data.commission=='asc'){
        that.setData({
          commission:'desc',
          money:'',
          creatTime:'',
          goodsList:[]
        })
      }else{
        that.setData({
          money:'',
          creatTime:'',
          commission:'asc',
          goodsList:[]
        })
      }
    }
    this.fetchData()

  },
  onSearchChange(event){
    console.log(event.detail)
    console.log(this.data.searchKeyword)
    this.setData({
      searchKeyword:event.detail
    })
    this.setData({
      pageNum:1,
      goodsList:[]
    })
    this.fetchData()
  },
  selectByCat(e){
    let item=e.currentTarget.dataset.item
    this.setData({
      fk_id:item.fk_id.id,
      pageNum:1,
      goodsList:[]
    })
    this.fetchData()
  },
  onSearchCancel(event){
    console.log(event.detail)
    this.setData({
      searchKeyword:''
    })
  },
  onTagsChange(event) {
    let that = this
    api.get({
      url:'/goodsType/childTypeList',
      data:{
        typeId:that.data.categoryList[event.detail.name].id
      },
      success(res){
        if(res.code == 200){
          that.setData({
            categoryTwoList:res.data
          })
        }
      }
    })
  },
  toggleShow(){
    if(this.data.showMenus){
      this.setData({
        showMenus:false
      })
    }else {
      this.setData({
        showMenus:true
      })
    }
  },
  upGoods(e){
    let that = this
    let item = e.currentTarget.dataset.item
    console.log(item)
    api.post({
      url:'/myShop/addGoods',
      data:{
        goodsid:item.id
      },
      success(res){
        if(res.code == 200){
          wx.showToast({
            title:'上架成功！',
            icon:'success',
            duration:2000
          })
          setTimeout(()=>{
            that.fetchData()
          },1000)
        }
      }
    })
  },
  goGoodsDetail(e){
    let id=e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url:'/pages/myshop/goods-detail/goods-detail?id='+id
    })

  },
  fetchBanner(){
    let that = this
    //轮播
    api.get({
      url:'/image/showAd',
      noLogin:true,
      data:{
        pageSize:3
      },
      success:res=>{
        for (const resKey in res.data.list) {
          res.data.list[resKey].imageUrl=api.Host+'/'+res.data.list[resKey].imageUrl
        }
        that.setData({
          bannerList:res.data.list
        })
      }
    })

    //首页精选类型
    api.get({
      url:'/goodsType/TypeList',
      noLogin:true,
      data:{},
      success:res=>{
        that.setData({
          categoryList:res.data
        })
        api.get({
          url:'/goodsType/childTypeList',
          data:{
            typeId:res.data[0].id
          },
          success(res){
            if(res.code == 200){
              that.setData({
                categoryTwoList:res.data
              })
            }
          }
        })
      }
    })
  },
  fetchData(pageNum=1,append=false){
    let that = this
    api.post({
      url:'/myShop/xpgoodsdate',
      data:{
        pageNum:pageNum,
        pageSize: that.data.pageSize,
        creat_time:that.data.creatTime,
        money:that.data.money,
        commission:that.data.commission,
        name:that.data.searchKeyword,
        fk_id:that.data.fk_id
      },
      success(res){
        console.log(res)
        if(res.code == 200){
          if(res.data.list.length>0){
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
            if(!append){
              that.setData({
                goodsList:[]
              })
            }
            wx.showToast({
              title:'暂无更多',
              icon:'none',
              duration:1500
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
    this.fetchBanner()
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
    this.fetchData(this.data.pageNum+1,true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})