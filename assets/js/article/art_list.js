$(function () {
    var layer = layui.layer
    var laypage = layui.laypage

    //定义美化事件的过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //定义查询的参数对象，请求数据时，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: '',
    }

    //调用初始化文章列表数据
    initTable()

    //初始化下拉分类数据
    initCate()

    //获取文章列表数据函数
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.code !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // layer.msg('获取文章列表成功')
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                //调用渲染分页的函数
                renderPage(res.total)
            },
        })
    }

    //初始化文章分类函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success: function (res) {
                if (res.code !== 0) {
                    return layer.msg('获取分章分类失败')
                }

                //模板引擎渲染分类下拉选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                //重新渲染
                layui.form.render()
            },
        })
    }

    //监听筛选表单提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        q.cate_id = $('[name=cate_id]').val()
        q.state = $('[name=state]').val()
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            jump: function (obj, first) {
                // console.log(obj.curr)
                // console.log(first);
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            },
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
        })
    }

    //删除按钮
    $('body').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确定删除文章?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'DELETE',
                url: '/my/article/info' + '?id=' + id,
                success: function (res) {
                    if (res.code !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                },
            })
            layer.close(index)
        })
    })

    //编辑文章
    $('body').on('click', '.btn-edit', function () {
        // location.href = '/article/art_edit.html'
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/info' + id,
            success: function (res) {
                if (res.code !== 0) {
                    console.log(res)
                    return layer.msg('获取文章失败')
                }
                layer.msg('获取文章成功')
            },
        })
    })
})
