$(function() {
    //调用用户基本信息函数
    getUserInfo()

    //退出登陆监听事件
    $('#btnLogout').on('click', function() {
        //提示用户是否退出登陆
        layui.layer.confirm('确定退出登陆', { icon: 3, title: '提示' }, function(index) {
            //清空用户token
            localStorage.removeItem('token')

            //返回登陆页
            location.href = '/login.html'

            //关闭弹出层
            layer.close(index);
        });
    })
})

// 获取用户基本信息函数
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: '/my/userinfo',
        success: function(res) {
            // console.log(res)
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败');
            }

            //调用renderAvatar用户头像函数
            renderAvatar(res.data)
        }
    })
}

//渲染用户头像函数
function renderAvatar(user) {
    //渲染用户名
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    //渲染头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').prop('src', user.user_pic).show()
        $('.text-avater').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avater').html(first).show()
    }
}