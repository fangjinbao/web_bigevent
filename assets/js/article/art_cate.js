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

})