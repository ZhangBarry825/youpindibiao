// pages/goods-detail/goods-detail.js
import {formatTime} from "../../utils/util";

const api = require('../../utils/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrls: [
            'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
            'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
            'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
        ],
        showShare: false,
        showEwm: false,
        showSpecification: false,
        number: 1,//购买数量
        goodsDetail: {},
        id: '',
        shopid: '',//附近商家的商品会有shopid
        attributeList: [],
        skuList: [],
        selectItem: [],//匹配sku列表
        skuRes: {},//匹配sku结果
    },
    goTo(e) {
        let type = e.currentTarget.dataset.type
        let id = e.currentTarget.dataset.id
        console.log(type, id)
        if (type == 'comment') {
            wx.navigateTo({
                url: '/pages/goods-comment/goods-comment?id=' + id + '&type=goods',
            })
            return
        }
        // console.log(path)
    },
    previewImg(e) {
        let url = e.currentTarget.dataset.url
        let urls = e.currentTarget.dataset.urls
        let newUrls = []
        for (const urlsKey in urls) {
            newUrls.push(urls[urlsKey].imageUrl)
        }
        wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: newUrls// 需要预览的图片http链接列表
        })
    },
    minusNum() {
        if (this.data.number > 1) {
            this.setData({number: this.data.number - 1})
        }
    },
    addNum() {
        this.setData({number: this.data.number + 1})
    },
    showShare() {
        // this.setData({ showShare: true });//开启底部分享方式
        let that = this
        api.post({
            url: '/share/addShareByUser',
            data: {
                state: 0,
                goodsid: that.data.id
            },
            noLogin: true,
            success(res) {

            }
        })
    },
    showEWM(){
        this.setData({showEwm: true});
    },
    onShareClose() {
        this.setData({showShare: false});
    },
    onCloseEwm() {
        this.setData({showEwm: false});
    },
    showSpecification() {
        this.setData({showSpecification: true});
    },
    onSpecificationClose() {
        this.setData({showSpecification: false});
    },
    fetchData() {
        let that = this
        api.post({
            url: '/showGoods/showGood',
            noLogin: true,
            data: {
                goodsId: that.data.id,
                shopid: that.data.shopid
            },
            success(res) {
                res.data.list[0].thumbnail = api.Host + '/' + res.data.list[0].thumbnail
                for (const thatKey in res.data.lunbo) {
                    res.data.lunbo[thatKey].imageUrl = api.Host + '/' + res.data.lunbo[thatKey].imageUrl
                }
                for (const thatKey in res.data.evaluate) {
                    res.data.evaluate[thatKey].createtime = formatTime(res.data.evaluate[thatKey].createtime)
                    for (const argumentsKey in res.data.evaluate[thatKey].image) {
                        res.data.evaluate[thatKey].image[argumentsKey].imageUrl = api.Host + '/' + res.data.evaluate[thatKey].image[argumentsKey].imageUrl
                    }
                }

                let WxParse = require('../../utils/wxParse/wxParse.js');
                // let article = res.data.list[0].detail
                let article = res.data.list[0].detail
                /**
                 * WxParse.wxParse(bindName , type, data, target,imagePadding)
                 * 1.bindName绑定的数据名(必填)
                 * 2.type可以为html或者md(必填)
                 * 3.data为传入的具体数据(必填)
                 * 4.target为Page对象,一般为this(必填)
                 * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
                 */
                WxParse.wxParse('article', 'html', article, that, 10);


                that.setData({
                    goodsDetail: res.data,
                    // imgUrls:res.data.lunbo
                })
                console.log(that.data.goodsDetail)
            }
        })
        api.post({
            url: '/showGoods/goods_sku',
            noLogin: true,
            data: {
                goodsid: that.data.id
            },
            success(res) {

                //设置全部均可选择
                for (let key0 in res.data.attributeList) {
                    for (let key1 in res.data.attributeList[key0].attributeValueList) {
                        res.data.attributeList[key0].attributeValueList[key1].canSelect=true
                    }
                }
                //判断库存为零禁止选择
                console.log(res.data.attributeList,'true')
                if (res.data.attributeList.length == 1) {
                    for (let key3 in res.data.attributeList[0].attributeValueList) {
                        let attributeVal=res.data.attributeList[0].attributeValueList[key3]
                        for (let key4 in res.data.skuList) {
                            if(res.data.skuList[key4].skuAttributeList[0].attributeValueId==attributeVal.id && res.data.skuList[key4].goodsRepetory==0){
                                console.log(res.data.skuList[key4].skuAttributeList[0].attributeValueId,attributeVal.id,res.data.skuList[key4].goodsRepetory,'----',key3)
                                res.data.attributeList[0].attributeValueList[key3].canSelect=false
                            }

                        }
                    }
                } else if (res.data.attributeList == 2) {

                }
                //保存数据
                that.setData({
                    attributeList: res.data.attributeList,
                    skuList: res.data.skuList,
                })
            }
        })

    },
    goCollect() {
        let that = this
        api.post({
            url: '/share/addShareByUser',
            data: {
                state: 2,
                goodsid: that.data.id,
                shopid: that.data.shopid
            },
            success(res) {
                wx.showToast({
                    title: '收藏成功！',
                    icon: 'success',
                    duration: 1000
                })
            }
        })
    },
    selectSpe(e) {
        console.log(e.currentTarget.dataset.index, 111)
        console.log(e.currentTarget.dataset.value, 222)
        let that = this
        if(e.currentTarget.dataset.disabled){
            return
        }
       this.setData({
            [`selectItem[${e.currentTarget.dataset.index}]`]: e.currentTarget.dataset.value
        })
        let selectItem = this.data.skuList.filter(item => {
            return this.data.selectItem.every((value, i) => value == item.skuAttributeList[i].attributeValueId)
        })
        console.log(selectItem, 333)
        if (selectItem.length == 1) {
            that.setData({
                skuRes: selectItem[0]
            })
        }
        //判断库存为零禁止选择
        if(that.data.attributeList.length>1){
            if(e.currentTarget.dataset.index==0){
                let id1=e.currentTarget.dataset.value
                for (const key1 in that.data.attributeList[1].attributeValueList) {
                    let id2=that.data.attributeList[1].attributeValueList[key1].id
                    console.log(id1,id2)
                    for (const key2 in that.data.skuList) {
                        if(((that.data.skuList[key2].skuAttributeList[0].attributeValueId==id1 &&that.data.skuList[key2].skuAttributeList[1].attributeValueId==id2)||(that.data.skuList[key2].skuAttributeList[1].attributeValueId==id1 &&that.data.skuList[key2].skuAttributeList[0].attributeValueId==id2)) && that.data.skuList[key2].goodsRepetory==0){
                            that.setData({
                                [`attributeList[1].attributeValueList[${key1}].canSelect`]:false
                            })
                        }else if(((that.data.skuList[key2].skuAttributeList[0].attributeValueId==id1 &&that.data.skuList[key2].skuAttributeList[1].attributeValueId==id2)||(that.data.skuList[key2].skuAttributeList[1].attributeValueId==id1 &&that.data.skuList[key2].skuAttributeList[0].attributeValueId==id2)) && that.data.skuList[key2].goodsRepetory!=0) {
                            that.setData({
                                [`attributeList[1].attributeValueList[${key1}].canSelect`]:true
                            })
                        }
                    }
                }
            }else if(e.currentTarget.dataset.index==1){
                let id2=e.currentTarget.dataset.value
                for (const key1 in that.data.attributeList[0].attributeValueList) {
                    let id1=that.data.attributeList[0].attributeValueList[key1].id
                    console.log(id1,id2)
                    for (const key2 in that.data.skuList) {
                        if(((that.data.skuList[key2].skuAttributeList[0].attributeValueId==id1 &&that.data.skuList[key2].skuAttributeList[1].attributeValueId==id2)||(that.data.skuList[key2].skuAttributeList[1].attributeValueId==id1 &&that.data.skuList[key2].skuAttributeList[0].attributeValueId==id2)) && that.data.skuList[key2].goodsRepetory==0){
                            that.setData({
                                [`attributeList[0].attributeValueList[${key1}].canSelect`]:false
                            })
                        }else if(((that.data.skuList[key2].skuAttributeList[0].attributeValueId==id1 &&that.data.skuList[key2].skuAttributeList[1].attributeValueId==id2)||(that.data.skuList[key2].skuAttributeList[1].attributeValueId==id1 &&that.data.skuList[key2].skuAttributeList[0].attributeValueId==id2)) && that.data.skuList[key2].goodsRepetory!=0) {
                            that.setData({
                                [`attributeList[0].attributeValueList[${key1}].canSelect`]:true
                            })
                        }
                    }
                }
            }
        }

    },
    addTrolley() {
        let that = this
        if (that.data.skuRes.id) {
            api.post({
                url: '/tCar/addTCarByUser',
                data: {
                    goodsid: that.data.goodsDetail.list[0].id,
                    // shopid:that.data.goodsDetail.list[0].shopid,
                    skuid: that.data.skuRes.id,
                    shopid: that.data.shopid
                },
                success(res) {
                    if (res.code == 200) {
                        wx.showToast({
                            title: '添加成功！',
                            icon: 'success',
                            duration: 2000
                        })
                        that.setData({
                            showSpecification: false
                        })
                    } else {
                        wx.showToast({
                            title: res.message,
                            icon: 'none',
                            duration: 2000
                        })
                    }

                }
            })
        } else {
            wx.showToast({
                title: '请选择规格',
                icon: 'none',
                duration: 2000
            })
        }
    },
    goToBuy() {
        let that = this
        console.log(that.data.skuRes)
        if (that.data.skuRes.id) {
            if (that.data.skuRes.goodsRepetory > 0) {
                console.log(that.data.goodsDetail.list[0].id)
                let goodsList = [{
                    goods: that.data.goodsDetail.list[0],
                    number: that.data.number,
                    sku: that.data.skuRes
                }]
                goodsList[0].goods.detail = ''
                wx.navigateTo({
                    url: '/pages/order/order-confirm/order-confirm?goodsList=' + JSON.stringify(goodsList) + '&type=goods' + '&shopid=' + that.data.shopid
                })
            } else {
                wx.showToast({
                    title: '库存不足',
                    icon: 'none',
                    duration: 2000
                })
            }

        } else {
            wx.showToast({
                title: '请选择规格',
                icon: 'none',
                duration: 1000
            })
        }

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options, 990)

        this.setData({
            id: options.id
        })
        if (options.shopid) {
            this.setData({
                shopid: options.shopid
            })
        }
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

        setTimeout(() => {
            wx.stopPullDownRefresh()
        }, 1000)
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
        return {
            title: this.data.goodsDetail.list[0].name,
            path: '/pages/goods-detail/goods-detail?id=' + this.data.goodsDetail.list[0].id
        }
    }
})