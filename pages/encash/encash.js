// pages/encash/encash.js
const api = require('../../utils/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        balance: 0,
        count: ''
    },
    onCountChange(event) {
        this.setData({count: event.detail})
    },
    submitForm() {
        let that = this
        if (parseInt(that.data.count) > 0) {

            api.post({
                url:'/myMoney/withdrawToCard',
                data:{
                    money:that.data.count
                },
                success(res){
                    if(res.code == 200){
                        //TODO
                    }
                }
            })
        }else {
            wx.showToast({
                title:'请输入正确的金额！',
                icon:'none',
                duration:1000
            })
        }
    },
    selectAll() {
        this.setData({
            count: this.data.balance
        })
    },
    fetchData() {
        let that = this
        api.post({
            url: '/myMoney/selectPurse',
            data: {},
            success(res) {
                console.log(res)
                if (res.code == 200) {
                    that.setData({
                        balance: res.data
                    })
                }
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