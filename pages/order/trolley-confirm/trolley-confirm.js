// pages/order/order-confirm/order-confirm.js
const api = require('../../../utils/api.js');
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        message: '',
        showPay: false,
        payType: '1',
        payTypeText: '微信支付',
        goodsList: [],
        addressDetail: '',
        totalPrice: 0.00,
        expressPrice: 0.00,
        shopid: '',//附近商家的商品会有shopid
        showCoupon: false,
        couponList: [],
        couponSelected: [
            {
                coupon: {
                    couponQuota: 0
                }
            }
        ],//选中优惠券
        saveMoney: 0,//优惠金额
    },
    fetchCoupon() {
        let that = this
        console.log(that.data.goodsList, 'fetchCoupon')
        let paramArrStr = []
        that.data.goodsList.map(item => {
            paramArrStr.push({
                goodsId: item.goodsid,
                skuId: item.skuid,
                goodNum: item.goodsnum,
            })
            return item
        })
        api.post({
            url: '/coupon/getSettlementList',
            data: {
                paramArrStr: JSON.stringify(paramArrStr)
            },
            success(res) {
                if (res.code == 200 && res.data.length > 0) {
                    res.data.map(item => {
                        item.couponList.map(item2 => {
                            item2.selected = false
                            return item2
                        })
                        return item
                    })
                    that.setData({
                        couponList: res.data,
                        couponSelected: [],
                        couponText: '请选择',
                    })
                } else {
                    that.setData({
                        couponList: [],
                        couponSelected: [],
                        couponText: '请选择',
                    })
                }
            }
        })
    },

    selectCoupon(e) {
        let that = this
        let index1 = e.currentTarget.dataset.index1
        let index2 = e.currentTarget.dataset.index2
        console.log(index1, index2)
        let couponList = that.data.couponList

        for (const key1 in couponList) {
            for (const key2 in couponList[key1].couponList) {
                if (key1 == index1) {
                    couponList[key1].couponList[key2].selected = false
                }
            }
        }
        couponList[index1].couponList[index2].selected = true
        //取消其他相同其他规格的优惠券
        for (const key1 in couponList) {
                for (const key2 in couponList[key1].couponList) {
                    if(couponList[index1].couponList[index2].id== couponList[key1].couponList[key2].id && index1!=key1){
                        couponList[key1].couponList[key2].selected = false
                }
            }
        }
        let saveMoney = 0
        for (const key1 in couponList) {
            for (const key2 in couponList[key1].couponList) {
                if (couponList[key1].couponList[key2].selected == true) {
                    saveMoney += couponList[key1].couponList[key2].coupon.couponQuota
                }
            }
        }
        that.setData({
            couponList: couponList,
            couponText: '已优惠' + saveMoney + '元',
            saveMoney: saveMoney,
        })
    },
    cancelCoupon(e) {
        let that = this
        let index1 = e.currentTarget.dataset.index1
        let index2 = e.currentTarget.dataset.index2
        console.log(index1, index2)
        that.setData({
            ['couponList[' + index1 + '].couponList[' + index2 + '].selected']: false,
            couponText: '请选择'
        })
        let couponList = that.data.couponList
        let saveMoney = 0
        for (const key1 in couponList) {
            for (const key2 in couponList[key1].couponList) {
                if (couponList[key1].couponList[key2].selected == true) {
                    saveMoney += couponList[key1].couponList[key2].coupon.couponQuota
                }
            }
        }
        that.setData({
            saveMoney: saveMoney,
            couponText: saveMoney > 0 ? ('已优惠' + saveMoney + '元') : '请选择'
        })
    },
    showCoupon() {
        let that = this
        that.setData({
            showCoupon: true
        })
    },
    onCloseCoupon() {
        let that = this
        that.setData({
            showCoupon: false,
        })
    },
    onConfirmCoupon() {
        let that = this
        that.setData({
            showCoupon: false
        })
    },

    minusNum() {
        let that = this
        if (that.data.goodsList[0].number > 1) {
            let totalPrice = parseFloat(that.data.goodsList[0].goods.freight)
            totalPrice += (that.data.goodsList[0].number - 1) * that.data.goodsList[0].sku.goodsPrice
            that.setData({
                ['goodsList[0].number']: that.data.goodsList[0].number - 1,
                totalPrice: totalPrice
            })
        }
    },
    addNum() {
        let that = this
        let totalPrice = parseFloat(that.data.goodsList[0].goods.freight)
        totalPrice += (that.data.goodsList[0].number + 1) * that.data.goodsList[0].sku.goodsPrice
        that.setData({
            ['goodsList[0].number']: that.data.goodsList[0].number + 1,
            totalPrice: totalPrice
        })
    },
    goAddressList() {
        wx.navigateTo({
            url: '/pages/address-list/address-list?type=select'
        })
    },
    onPayChange(event) {
        const {type} = event.currentTarget.dataset;
        // console.log(type)
        let payTypeText = ''
        if (type == '1') {
            payTypeText = '微信支付'
        } else {
            payTypeText = '余额支付'
        }
        this.setData({
            payType: type,
            payTypeText: payTypeText,
            showPay: false
        });
    },
    onPayShow() {
        this.setData({showPay: true})
    },
    onPayClose() {
        this.setData({showPay: false})
    },
    fetchData() {
        let that = this
        api.post({
            url: '/user/selectAddressList',
            data: {
                token: wx.getStorageSync('token')
            },
            success(res) {
                console.log(res)
                if (res.code == 200) {
                    if (res.data.length > 0) {
                        that.setData({
                            // addressDetail:res.data[0]
                            addressDetail: res.data[0]
                        })
                    }
                }
            }
        })
    },
    submitForm() {
        let that = this
        let caridsarr = []  //购物车id数组
        for (const Key in that.data.goodsList) {
            caridsarr.push(that.data.goodsList[Key].id)
        }
        let formData = {
            caridsarr: caridsarr,
            addressid: that.data.addressDetail.id || '',
            paytype: that.data.payType,
            notes: that.data.message
        }
        let couponList = that.data.couponList
        let selectedCouponId=[]
        for (const key1 in couponList) {
            let has = ''
            for (const key2 in couponList[key1].couponList) {
                if (couponList[key1].couponList[key2].selected == true) {
                    has=couponList[key1].couponList[key2].id
                }
            }
            selectedCouponId.push(has)
        }
        formData.couponUserIdArr=selectedCouponId
        console.log(formData)
        if (!formData.addressid) {
            wx.showToast({
                title: '请添加配送地址',
                icon: 'none',
                duration: 1000
            })
        } else {
            if (that.data.payType == 0) {
                Dialog.confirm({
                    title: '提示',
                    message: '确认余额支付？',
                }).then(() => {
                    api.post({
                        url: '/order/addOrderByCars',
                        data: {...formData},
                        success(res) {
                            if (res.code == 200) {
                                if (res.message == '余额不足') {
                                    wx.showToast({
                                        title: '您的余额不足!',
                                        icon: 'none',
                                        duration: 1000
                                    })
                                } else if (res.message == '商品库存不足') {
                                    wx.showToast({
                                        title: '商品库存不足!',
                                        icon: 'none',
                                        duration: 1000
                                    })
                                } else {
                                    wx.navigateTo({
                                        url: '/pages/order/order-payed/order-payed?orderid=' + JSON.stringify(res.data)
                                    })
                                }
                            } else if (res.code == 205) {
                                wx.showToast({
                                    title: res.message,
                                    icon: 'none',
                                    duration: 2000
                                })
                            } else {
                                wx.showToast({
                                    title: '数据异常',
                                    icon: 'none',
                                    duration: 1000
                                })
                            }
                        }
                    })
                }).catch(() => {
                    // on cancel
                });
            } else {
                api.post({
                    url: '/order/addOrderByCars',
                    data: {...formData},
                    success(res) {
                        if (res.code == 200 && res.message != '余额不足' && res.message != '商品库存不足') {
                            let orderids=res.data.orderids
                            wx.requestPayment({
                                timeStamp: res.data.timeStamp,
                                nonceStr: res.data.nonceStr,
                                package: res.data.package,
                                signType: res.data.signType,
                                paySign: res.data.paySign,
                                total_fee: res.data.total_fee,
                                success(res1) {
                                    wx.navigateTo({
                                        url: '/pages/order/order-payed/order-payed?orderid=' + JSON.stringify(res.data.orderids)
                                    })
                                },
                                fail(res) {
                                    wx.showToast({
                                        title: '支付失败！',
                                        icon: 'none',
                                        duration: 2000
                                    })

                                    setTimeout(()=>{
                                        wx.redirectTo({
                                            url:'/pages/order/order-status/order-status?orderid='+orderids[0]
                                        })
                                    },2000)
                                }
                            })
                        } else if (res.message == '余额不足') {
                            wx.showToast({
                                title: '您的余额不足！',
                                icon: 'none',
                                duration: 1000
                            })
                        } else if (res.message == '商品库存不足') {
                            wx.showToast({
                                title: '商品库存不足',
                                icon: 'none',
                                duration: 1000
                            })
                        } else if (res.code == 205) {
                            wx.showToast({
                                title: res.message,
                                icon: 'none',
                                duration: 2000
                            })
                        } else {
                            wx.showToast({
                                title: '数据异常',
                                icon: 'none',
                                duration: 1000
                            })
                        }
                    }
                })
            }

        }

    },
    messageChange(e) {
        this.setData({
            message: e.detail
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        let buyList = JSON.parse(wx.getStorageSync('buyList')).buyList
        let totalPrice = JSON.parse(wx.getStorageSync('buyList')).totalPrice
        let goodList = []
        let expressPrice = 0.00
        for (const Key1 in buyList) {
            for (const Key2 in buyList[Key1].list) {
                buyList[Key1].list[Key2].reserved1 = api.Host + '/' + buyList[Key1].list[Key2].reserved1
                expressPrice = parseFloat(buyList[Key1].list[Key2].reserved3) + parseFloat(expressPrice)
                goodList.push(buyList[Key1].list[Key2])
            }
        }
        totalPrice = (parseFloat(expressPrice) + parseFloat(totalPrice)).toFixed(2)
        console.log(goodList, 'goodList')
        console.log(totalPrice, 'totalPrice')
        that.setData({
            expressPrice: expressPrice.toFixed(2),
            goodsList: goodList,
            totalPrice: totalPrice
        })
        that.fetchData()
        that.fetchCoupon()

        // that.fetchData()
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