// pages/myshop/shop-home/shop-home.js
const api = require('../../../utils/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        baseUrl: api.Host + '/',
        searchKeyword: '',
        ewmShow: false,
        shopInfo: {},
        pageNum: 1,
        pageSize: 10,
        goodsList: [],
        creat_time: '',//按照创建时间查询 "asc":升序 "desc"降序
        money: '',//按照价格查询 "asc":升序 "desc"降序
        commission: '',//按佣金查询 "asc":升序 "desc"降序
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
        this.fetchGoods()

    },
    goGoodsDetail(e) {
        let id = e.currentTarget.dataset.id
        console.log(id)
        wx.navigateTo({
            url: '/pages/myshop/goods-detail/goods-detail?id=' + id
        })

    },
    goShop() {
        let that = this
        console.log(that.data.shopInfo)
        wx.redirectTo({
            url: '/pages/nearby-shop/nearby-shop?id=' + that.data.shopInfo.sysUser.userId
        })
    },
    goUp() {
        wx.navigateTo({
            url: '/pages/myshop/shop-selection/shop-selection'
        })
    },
    downGoods(e) {
        let that = this
        let item = e.currentTarget.dataset.item
        console.log(item)
        api.post({
            url: '/myShop/delGoods',
            data: {
                goodsid: item.id
            },
            success(res) {
                if (res.code == 200) {
                    wx.showToast({
                        title: '下架成功！',
                        icon: 'success',
                        duration: 2000
                    })
                    setTimeout(() => {
                        that.fetchGoods()
                    }, 1000)

                }
            }
        })

    },
    onEwmClickShow() {
        this.setData({ewmShow: true});
    },

    onEwmClickHide() {
        this.setData({ewmShow: false});
    },
    onSearchChange(event) {
        console.log(event.detail)
        console.log(this.data.searchKeyword)
    },
    goLivePage(){
        wx.showToast({
            title:'敬请期待！',
            icon:'info',
            duration:1000
        })
    },
    onSearchFocus() {
        wx.navigateTo({
            url: '/pages/myshop/shop-selection/shop-selection'
        })
    },
    onSearchCancel(event) {
        console.log(event.detail)
    },
    fetchData() {
        let that = this
        api.post({
            url: '/myShop/toIndex',
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
    fetchGoods(pageNum = 1, append = false) {
        let that = this
        api.post({
            url: '/myShop/toMyShop',
            data: {
                pageNum: pageNum,
                pageSize: that.data.pageSize,
                create_time:that.data.create_time,
                money:that.data.money,
                commission:that.data.commission,
            },
            success(res) {
                if (res.code == 200) {
                    if (res.data.pageInfo.list.length > 0) {
                        if (append) {
                            that.setData({
                                pageNum: pageNum,
                                goodsList: that.data.goodsList.concat(res.data.pageInfo.list)
                            })
                        } else {
                            that.setData({
                                goodsList: res.data.pageInfo.list
                            })
                        }
                    } else {
                        if (!append) {
                            that.setData({
                                goodsList: []
                            })
                        }
                        wx.showToast({
                            title: '暂无更多',
                            icon: 'none',
                            duration: 1500
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
        this.fetchGoods()
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
        this.fetchGoods()
        setTimeout(() => {
            wx.stopPullDownRefresh()
        }, 1000)
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.fetchGoods(this.data.pageNum + 1, true)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})