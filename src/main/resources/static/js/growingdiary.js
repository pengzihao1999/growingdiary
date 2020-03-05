//删除日记本
function delDiaryBook(id) {
    $.ajax({
        //请求方式
        type: "POST",
        //请求地址
        url: "/delDiaryBook",
        async: false,   //请求是否异步，默认为异步，这也是ajax重要特性
        //数据，json字符串
        data: {
            id: id
        },
        success: function (data) {
            console.log(data);
            if (data.code === 200) {
                window.location.reload()  //刷新页面
            }

        },
        //请求失败，包含具体的错误信息
        error: function (e) {
            console.log(e.status);
            console.log(e.responseText);
        }
    });

}

//创建日记本
function createDiary() {
    $("#action").text("创建");
    $("#title").val("");
    $("#description").text("");
}

//展示评论
var commentLength;

function showComment(id) {
    var collapseCommentId = $('#collapseComment' + id);
    var b = collapseCommentId.data("show") === '1';
    if (!b) {
        $.ajax({
            //请求方式
            type: "POST",
            //请求地址
            url: "/showComment",
            async: false,   //请求是否异步，默认为异步，这也是ajax重要特性
            //数据，json字符串
            data: {
                diaryId: id
            },
            success: function (data) {
                var comments = data.data;
                commentLength = comments.length;
                for (var i in comments) {
                    var comment = comments[i];
                    var commentTime = comment.createTime.toLocaleString();
                    var commentTemp = "<div class= 'media' id='media-comment-" + "" + i + "'>" +
                        "            <div class='media-left col-lg-1'>" +
                        "<img src = '" + comment.user.userImg + "' class='img-rounded user-img'" + " alt=''> </div>" +
                        "<div class='media-right  col-lg-10' style='margin-left: 5px;'>" +
                        " <div>" + comment.user.username + ": <span>" + comment.content + "</span></div>" +
                        "  <div style=\"font-size: 13px;float: right;\"><span>评论时间:</span>" + commentTime.substring(0, commentTime.indexOf('T')) + "</div>"
                        + "</div></div>";
                    $("#comment" + id).prepend(commentTemp);

                }
            },
            //请求失败，包含具体的错误信息
            error: function (e) {
                console.log(e.status);
                console.log(e.responseText);
            }
        });

        collapseCommentId.data("show", "1");
    } else if (b) {
        for (var i = 0; i < commentLength; i++) {
            $("#media-comment-" + i).remove();
        }
        sessionStorage.removeItem("diaryId");
        collapseCommentId.data("show", "0");
    }
}
//发布评论
function doComment(id,creator) {
    var content = $('#myComment-' + id).val();
    if (content === "" || content == null) {
        alert("请先输入内容");
        return;
    }
    $.ajax({
        //请求方式
        type: "POST",
        //请求地址
        url: "/doComment",
        async: true,   //请求是否异步，默认为异步，这也是ajax重要特性
        //数据，json字符串
        data: {
            diaryId: id,
            content: content,
            creator:creator
        },
        success: function (data) {
            if (data.code === 200) {
                sessionStorage.setItem("diaryId", id);
                window.location.reload();
            }
        },
        //请求失败，包含具体的错误信息
        error: function (e) {
            console.log(e.status);
            console.log(e.responseText);
        }
    });
    $("#collapseComment" + id).addClass("in");

}

//更新评论信息
function updateCommentRead(diaryId,commentId) {
    var isRead = parseInt($("#isRead" + commentId).val());
    console.log(isRead);
    if(isRead === 0) {
        $.ajax({
            type:"GET",
            async:true,
            url:"/updateCommentRead",
            data: {
                isRead:isRead,
                commentId:commentId
            },
            success: function (data) {
                if (data.code === 200) {
                    $("#info-" + commentId).css("display","none");
                    $("#isRead" + commentId).val(1);
                    var countNum = parseInt($(".badge").text());
                    if(countNum > 0) {
                        $(".badge").text(countNum-1);
                    }
                    console.log(countNum);

                }
            }
        })
    }
    showComment(diaryId);
}

//修改日记的状态
function changeState(state, diaryId) {
    $.ajax({
        type: "GET",
        async: true,
        url: "/changeState/",
        data: {
            isShow: state,
            id: diaryId
        },
        success: function (data) {

        }
    })
}

//添加活动信息
function addActivityInfo(id) {
    $("#" + id).append("<div class='activity-info'>" +
        "<div class='activity-div'><span class='activity-span'>活动名称: </span>" + "<span>星期天打球</span>" + "</div>" +
        "<div class='activity-div'><span class='activity-span'>活动描述: </span>" + "<span>打卡上空的飞机将大量经费哈德积分的家啊大家发</span></div>"+
        "<div class='activity-div'><span class='activity-span'>活动时间: </span>" + "<span>2020-10-10</span></div>" +
        "<div class='activity-div'><span class='activity-span'>活动地点: </span>" + "<span>湖北第二师范学院</span></div>" +
        "<div class='activity-div'><span class='activity-span'>参与人数: </span>" + "<span>64</span></div>" +
        "<div class='activity-div'><span class='activity-span'>热度: </span>" + "<span>632523</span></div>"+
        "<div class='activity-div'><span style='float: right;padding: 12px;'><a style='cursor:pointer;text-decoration:none;' href='/college/'>查看此活动</a></div>"+
        "</div>");
}

//
function qqLogin() {

    window.location.href = "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101850561&redirect_uri=http://growingdiary.club/authorize&state=1"

    //window.location.href = "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101850561&redirect_uri=http://192.168.1.105:8080/authorize&state=1"
}


