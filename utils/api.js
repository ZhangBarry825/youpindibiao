
const Host = 'https://youpin.qqwea.com'
// const Host = 'http://192.168.1.8:8081'

module.exports = {
    Host: Host,

    get(options) {
        options.method = 'GET'
        this.request(options)
    },
    post(options) {
        options.method = 'POST'
        this.request(options)
    },
    request(options) {
        wx.hideLoading()
        wx.showLoading({
            title: '加载中',
        })
        let token = '';
        try {
            token = wx.getStorageSync('token');
        } catch (e) {
            // Do something when catch error
        }
        if(options.noLogin || token!=''){
            wx.request({
                url: Host + options.url,
                data: options.data,
                method: options.method,
                header: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'XX-Token': token,
                },
                success(res) {
                    if(res.data){
                        options.success(res.data);
                    }else {
                        options.success(res);
                    }

                },
                fail: function (res) {
                    if (options.fail) {
                        options.fail(res)
                    }
                },
                complete(){
                    setTimeout(function () {
                        wx.hideLoading()
                    }, 300)
                    options.complete ? options.complete : null
                }
            })
        }else {
            wx.hideLoading()
            wx.reLaunch({url:'/pages/permission/permission?type=login'})
        }

    },
    login(data) {
        let that = this

        let formData={}
        console.log(wx.getStorageSync('upopenid'))
        let upopenid=wx.getStorageSync('upopenid')
        if(upopenid){
            formData.upopenid=upopenid
        }
        wx.login({
            success(res) {
                if (res.code) {
                    // 发起网络请求s
                    that.request({
                        url:'/common/wxEntry',
                        noLogin:true,
                        method:'POST',
                        data:{
                            code: res.code,
                            avatarUrl: data.userInfo.avatarUrl,
                            nickName: data.userInfo.nickName,
                            ...formData
                        },
                        success:res=>{
                            console.log(res)
                            if(res.data){
                                wx.setStorageSync('token',res.data.token)
                                wx.setStorageSync('nickName',data.userInfo.nickName)
                                wx.setStorageSync('avatarUrl',data.userInfo.avatarUrl)
                                data.success(res.data)
                            }
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    }
}