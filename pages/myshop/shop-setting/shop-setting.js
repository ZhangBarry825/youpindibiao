// pages/myshop/shop-setting/shop-setting.js
const api = require('../../../utils/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        baseUrl: api.Host + '/',
        shopInfo: {
            shopname: '',
            usercode: '',
            text: '',
            tel: '',
            headimg: '',
            bgimg: '',
        }
    },
    uploadImg(e){
        let type=e.currentTarget.dataset.type
        wx.chooseImage({
            success (res) {
                const tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    url: api.Host+'/imageUpload/upReturnImage',
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {},
                    success (res){
                        console.log(res.data)
                    }
                })
            }
        })
    },
    onShopNameChange(e){
        this.setData({
            ['shopInfo.shopname']:e.detail
        })
    },
    onTextChange(e){
        this.setData({
            ['shopInfo.text']:e.detail
        })
    },
    onTelChange(e){
        this.setData({
            ['shopInfo.tel']:e.detail
        })
    },
    fetchData() {
        let that = this
        api.post({
            url: '/myShop/userShopInfo',
            data: {},
            success(res) {
                console.log(res)
                if (res.code == 200) {
                    that.setData({
                        shopInfo: res.data
                    })
                }
            }
        })
    },
    submitForm(){
      console.log(this.data.shopInfo)
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