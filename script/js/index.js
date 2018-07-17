var i = 0;
init();
function init(){
    $(".footerRotate").eq(i).fadeOut("slow");
    $(".footerRotate").eq(i+1).fadeOut("slow");
    loaderRotate();
}
function slide1(){
    $(".footerRotate").eq(i).fadeIn("slow");
    $(".footerRotate").eq(i+1).fadeOut("slow");
    return;
}
function slide2(){
    $(".footerRotate").eq(i).fadeIn();
    $(".footerRotate").eq(i-1).fadeOut();
    return;
}
function loaderRotate(){
    if(i==0){
        slide1();
        i++;
    }
    else{
        slide2();
        i=0;
    }
    setTimeout('loaderRotate()',10000);//setInterval은 이벤트 딜레이 있음. 재귀함수 구성.
    
}
var imgCount;
$(function(){
    function jQueryCalled(imgNum){
        console.log("jQueryCalled");
        imgCount=imgNum;
    }
    jQueryCall=jQueryCalled;
    for(var imgord=1; imgord<=(imgCount+1); imgord++)
    {
        $("<img src=\"./../../img/"+imgord+".png\" alt=slide"+imgord+">").appendTo($(".imgRotate"));
    }
});
var index=0;
var imgCount=2;
var timeDelay=10000;
$(".imgRotate img").eq(index).css("left","0");
index++;
setTimeout('imgRotate()',timeDelay);
function imgRotate(){
    if(index==imgCount){
        $(".imgRotate img").eq(index-1).css("left","-700px");
        $(".imgRotate img").eq(index-imgCount).css("left","0");
        index=1;
    }else{
        $(".imgRotate img").eq(index-1).css("left","-700px");
        $(".imgRotate img").eq(index).css("left","0");
        index++;
    }
    setTimeout('imgRotate()',timeDelay);
}