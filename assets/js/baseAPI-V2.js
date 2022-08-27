//注意：每次调用$.get()或$.post()或$.ajax()时会先调用这个函数
// 在这个函数种，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    //再发起真正的Ajax请求之前,统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3008' + options.url
        // console.log(options.url);

    //统一为有权限的接口设置headers请求头,无权限的不加headers
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }
    }
    //全局配置挂载 complete函数
    options.complete = function(res) {
        // console.log('执行了complete')
        // console.log(res)
        if (res.responseJSON.code === 1 && res.responseJSON.message === "身份认证失败！") {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})