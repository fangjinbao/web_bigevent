//注意：每次调用$.get()或$.post()或$.ajax()时会先调用这个函数
// 在这个函数种，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    //再发起真正的Ajax请求之前,统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url);
})