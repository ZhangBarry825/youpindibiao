// pages/order/apply-refund/apply-refund.js
const api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refundCount:'',
    refundReason:'',
    orderid:'',
    payNum:0,//实际支付金额（去除快递费）
    fileList: [],
    imgList:[],
    reasonList:[],//原因列表
    goodsList:[],//商品列表
    showReason:false,
    showGoods:false,
    columns: [],
    goodsColumns: [],
    reasonValue:'',
    reasonText:'选择退货原因',
    orderDetail:{},
    orderDetailId:'', //订单详情下商品对应id
    orderDetailName:'选择退货商品' //订单详情下商品名称
  },
  onGoodsConfirm(event){
    let that = this
    const { picker, value, index } = event.detail;
    //console.log(index)
    that.setData({
      orderDetailId:that.data.goodsList[index].id,
      orderDetailName:that.data.goodsList[index].goodsname,
      showGoods:false,
      refundCount:parseFloat(that.data.goodsList[index].goodsmoney)*that.data.goodsList[index].goodsnum
    })
  },
  onReasonConfirm(event){
    let that = this
    const { picker, value, index } = event.detail;
    //console.log(index)
    //console.log(that.data.reasonList[index])
    that.setData({
      reasonValue:that.data.reasonList[index].id,
      reasonText:that.data.reasonList[index].reasonName,
      showReason:false
    })
  },
  showReason(){
    this.setData({
      showReason:true
    })
  },
  hideReason(){
    this.setData({
      showReason:false
    })
  },
  showGoods(){
    //console.log(this.data.goodsColumns)
    //console.log(this.data.goodsList)
    this.setData({
      showGoods:true
    })
  },
  hideGoods(){
    this.setData({
      showGoods:false
    })
  },
  deleteImg(event){
    let that = this
    //console.log(event.detail.index)
    let fileList=that.data.fileList
    let imgList=that.data.imgList
    //console.log(fileList,imgList,1)
    fileList.splice(event.detail.index,1)
    imgList.splice(event.detail.index,1)
    //console.log(fileList,imgList,2)
    that.setData({
      fileList:fileList,
      imgList:imgList
    })
  },
  afterRead(event) {
    let that = this
    const { file } = event.detail;
    //console.log(file,'file')
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: api.Host+'/imageUpload/upReturnImage', // 仅为示例，非真实的接口地址
      filePath: file.path,
      name: 'file',
      formData: { },
      success(res) {
        // 上传完成需要更新 fileList
        res= JSON.parse(res.data)
        //console.log(res)
        let fileList=that.data.fileList
        let imgList=[]
        for (const eventKey in res.data) {
          fileList.push({
            name:'',
            url: api.Host+'/'+res.data[eventKey],
            isImage: true,
            deletable: true,
          });
          imgList.push(res.data[eventKey])
        }
        that.setData({
          fileList:fileList,
          imgList:imgList
        });
        //console.log(that.data.fileList)
        //console.log(that.data.imgList)
      },
    });
  },
  refundCountChange(e){
    this.setData({
      refundCount:e.detail
    })
  },
  refundReasonChange(e){
    this.setData({
      refundReason:e.detail
    })
  },
  submitForm(){
    let that = this
    let formData={
      orderid:that.data.orderDetail.id,
      reasonid:that.data.reasonValue,
      // goodsMoney:that.data.refundCount,
      remarks:that.data.refundReason,
      imageList:that.data.imgList,
      orderDetailId:that.data.orderDetailId
    }
    //console.log(formData)
    if(formData.orderid==''||formData.reasonid==''){
      wx.showToast({
        title:'请选择退货原因',
        icon:'none',
        duration:1000
      })
    }else {
      api.post({
        url:'/returnGoods/addReturnGoods',
        data:formData,
        success(res){
          if(res.code == 200&&res.message=='申请退货成功'||res.message=='申请售后成功'){
            wx.showToast({
              title:'提交成功！',
              icon:'success',
              duration:1000
            })
            setTimeout(()=>{
              wx.navigateBack({
                delta:1
              })
            },1500)
          }else {
            wx.showToast({
              title:'提交异常或已提交过退货申请',
              icon:'none',
              duration:1000
            })
          }
        }
      })
    }


  },
  fetchData(){
    let that = this
    api.post({
      url:'/returnGoods/returnReasonList',
      data:{},
      success(res){
        if(res.code == 200){
          let columns=[]
          for (const Key in res.data) {
            columns.push(res.data[Key].reasonName)
          }
          //console.log(columns,'columns')
          that.setData({
            columns:columns,
            reasonList:res.data,
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let orderDetail=JSON.parse(wx.getStorageSync('refundItem'))
    this.setData({
      orderDetail:orderDetail
    })
    //console.log(orderDetail,998)
    let goodsColumns=[]
    for (const Key in orderDetail.orderDetailslist) {
      goodsColumns.push(orderDetail.orderDetailslist[Key].goodsname+' '+orderDetail.orderDetailslist[Key].goodsParam)
    }
    //console.log(goodsColumns,'goodsColumns')
    that.setData({
      goodsColumns:goodsColumns,
      goodsList:orderDetail.orderDetailslist,
    })
    //console.log(that.data.goodsList,'---------')
    //console.log(that.data.goodsColumns,'---------')


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