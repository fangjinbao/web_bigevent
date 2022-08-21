$(function() {
    layui.form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间'
            }
        }
    })

    //调用初始化用户信息函数
    initUserInfo()

    //初始化用户信息函数
    function initUserInfo() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败')
                }
                // console.log(res)

                // $('.layui-form-item [name=username]').val(res.data.username)
                // $('.layui-form-item [name=nickname]').val(res.data.nickname)
                // $('.layui-form-item [name=email]').val(res.data.email)

                //调用form.val() 快速为表单赋值
                layui.form.val('formUserInfo', res.data)
            }
        })
    }

    //重置表单数据
    $('#btnReset').on('click', function(e) {
        //阻止默认提交行为
        e.preventDefault();
        initUserInfo()
    })

    //监听表单提交事件实现用户信息更新
    $('.layui-form').on('submit', function(e) {
        //阻止表单默认提交行为
        e.preventDefault();
        //发起请求
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            // data: {
            //     id: $('.layui-form [name=id]').val(),
            //     nickname: $('.layui-form [name=nickname]').val(),
            //     email: $('.layui-form [name=email]').val()
            // },

            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('修改用户信息失败')
                }
                layui.layer.msg('修改用户信息成功')

                //调用父页面中的方法，重新渲染用户头像和用户信息
                window.parent.getUserInfo()
            }
        })
    })
})