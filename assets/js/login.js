$(function() {
    //点击“去注册账号”
    $('#link_reg').on('click', function() {
        $('.login-box').hide().siblings('.reg-box').show()
    });
    //点击“去登陆”
    $('#link_login').on('click', function() {
        $('.reg-box').hide().siblings('.login-box').show()
    });

    //从layui中获取form对象
    var form = layui.form;
    form.verify({
        //密码校验规则
        'pwd': [
            /^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'
        ],
        //校验两次密码是否一致
        repwd: function(value) {
            //通过形参value拿到的是确认密码框的值
            //需要拿到密码框中的内容进行比较
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次输入密码不一致'
            }
        }
    })


    //监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault(); //阻止默认提交行为
        var data = {
            username: $('.reg-box [name=username').val(),
            password: $('.reg-box [name=password').val()
        };
        //发起Ajax请求注册接口
        $.post('/api/reguser', data, function(res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('注册失败');
            } else {
                // layer.msg('注册成功请登陆', function() {
                //     $('#link_login').click()
                // });
                layer.msg('注册成功请登陆', {
                    time: 1500 //1.5秒关闭
                }, function() {
                    $('#link_login').click() //自动调用点击事件
                });
            }
        })
    })

    //监听登陆表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault(); //阻止默认提交行为
        //发起Ajax请求注册接口
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(), //快速获取表单数据
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('登陆失败');
                } else {
                    console.log(res.token);
                    layer.msg('登陆成功', {
                        time: 1000 //1.5秒关闭
                    }, function() {
                        //将登陆成功得到的token字符串保存到localStorage中
                        localStorage.setItem('token', res.token)
                            //跳转到系统首页
                        location.href = '/index.html'
                    });
                }
            }
        })
    })
})