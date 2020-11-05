// pages/encash/encash.js
const api = require('../../utils/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        balance: 0,
        count: '',
        bankName:'',
        bankNumber:'',
        bankNumberFour:'',
    },
    onCountChange(event) {
        this.setData({count: event.detail})
    },
    goTo(e){
        let type = e.currentTarget.dataset.type
        wx.navigateTo({
            url:e.currentTarget.dataset.path+'?type='+type
        })
    },
    setCard(e){
        console.log(e)
        let that = this
        that.setData({
            bankName:e.bankName,
            bankNumber:e.bankNumber,
            bankNumberFour:e.codeid2,
        })
    },
    submitForm() {
        let that = this
        if (parseFloat(that.data.count) > 0) {
            if(that.data.bankNumber) {

                api.post({
                    url: '/myMoney/withdrawToCard',
                    data: {
                        money: that.data.count,
                        codeid:that.data.bankNumber
                    },
                    success(res) {
                        if (res.code == 200) {
                            wx.showToast({
                                title: res.message,
                                icon: 'success',
                                duration: 2000
                            })
                            setTimeout(() => {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }, 2000)
                        } else {
                            wx.showToast({
                                title: res.message,
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    }
                })
            }else {
                wx.showToast({
                    title:'请先选择银行卡',
                    icon:'none',
                    duration:2000
                })
            }
        }else {
            wx.showToast({
                title:'请输入正确的金额！',
                icon:'none',
                duration:2000
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