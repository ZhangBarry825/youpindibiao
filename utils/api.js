const AppID = 'wxb34aa6beac0ea28e'
const AppSecret = '63f87f5d2131a99099a07ad91607b8a6'
const Host = 'http://192.168.1.12:8081'

module.exports = {
    Host: Host,
    AppID: AppID,
    AppSecret: AppSecret,
    get(options) {
        options.method = 'GET'
        this.request(options)
    },
    post(options) {
        options.method = 'POST'
        this.request(options)
    },
    request(options) {
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
                    wx.request({
                        url:Host+'/setSessionInfo',
                        method: 'post',
                        header: {
                            'Cache-Control': 'no-cache',
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'XX-Token': token,
                        },
                        success(res){
                            console.log('加入缓存成功')
                            console.log(res)
                        }
                    })
                    if(res.cookies){
                        res.data.cookies=res.cookies
                    }
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
            wx.navigateTo({url:'/pages/permission/permission'})
        }

    },
    login(data) {
        let that = this

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