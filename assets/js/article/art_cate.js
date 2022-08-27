$(function() {
    initArtCateList()

    //初始化文章分类的列表数据
    function initArtCateList() {
        //发起请求
        $.ajax({
            type: 'GET',
            url: '/my/cate/list',
            success: function(res) {
                // console.log(res)
                var htmlStr = template('tpl-table', res)
                    // console.log(htmlStr)
                $('tbody').html(htmlStr)
            }
        })
    }

    var indexAdd = null;
    //添加类别监听事件
    $('#btnAddCate').on('click', function() {
        indexAdd = layui.layer.open({
            type: 1,
            area: ['500px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    //通过代理的形式为弹出层表单绑定submit提交事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/cate/add',
            data: $(this).serialize(),
            success: function(res) {
                if (res.code !== 0) {
                    return layui.layer.msg('新增分类失败')
                }
                initArtCateList()
                layui.layer.msg('新增分类成功')

                //关闭弹出层
                layui.layer.close(indexAdd)
            }
        })
    })

    var indexEdit = null;
    //点击编辑文章通过代理绑定监听事件
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layui.layer.open({
            type: 1,
            area: ['500px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var data_id = $(this).attr('data-id')

        // console.log(index);
        $.ajax({
            method: 'GET',
            url: '/my/cate/info',
            data: { id: data_id },
            success: function(res) {
                // console.log(res)
                layui.form.val('form-edit', res.data)
            }
        })
    })

    //编辑文章更新分类监听事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()

        // console.log($(this).serialize())
        $.ajax({
            method: 'PUT',
            url: '/my/cate/info',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) {
                    return layui.layer.msg('更新分类失败')
                }
                layui.layer.msg('更新分类成功')
                layui.layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    //代理形式删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
            // console.log(id);
        layui.layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: 'DELETE',
                url: '/my/cate/del',
                data: {
                    id: id,
                },
                success: function(res) {
                    if (res.code !== 0) {
                        return layui.layer.msg('删除分类失败')
                    }
                    layui.layer.msg('删除分类成功')
                    layer.close(index)
                    initArtCateList()
                }
            })
        });
    })
})