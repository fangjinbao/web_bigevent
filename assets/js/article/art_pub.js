$(function() {
    initCate()

    //富文本编辑器
    initEditor()

    //加载文章分类方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success: function(res) {
                if (res.code !== 0) {
                    return layui.layer.msg('获取文章分类失败')
                }
                // console.log(res);
                var htmlStr = template('tpl_cate ', res)
                $('[name=cate_id]').html(htmlStr)

                //重新渲染表单区域
                layui.form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //选择封面点击事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    //监听 coverFile 的 change 事件 ，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        var file = e.target.files
        if (file.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(file[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //文章状态
    var art_state = '已发布'
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })


    //表单绑定提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()

        //创建FormData对象
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                fd.append('cover_img', blob)
                publishArticle(fd)
            })
    })


    //发布文章函数
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.code !== 0) {
                    return layui.layer.msg('发布文章失败')
                }
                layui.layer.msg('发布文章成功')
                location.href = '/article/art_list.html'
            }
        })
    }
})