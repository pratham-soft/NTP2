$(function(){
    var pageHeight = $(window).height();
    var leftPanelHeight = pageHeight - (81);
    $(".leftPanel").css("max-height",leftPanelHeight+"px");
    $(".leftPanel").css("overflow-y","auto");
	$(".pageContent").css("max-height",leftPanelHeight+"px");
	$(".pageContent").css("overflow-y","auto");
	$(".pageContent").css("padding-bottom","50px");
});