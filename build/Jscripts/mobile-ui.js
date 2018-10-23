/*
* TABLE OF CONTENTS
*
* List JS file
* MOBILE MENU
*/

/* > List JS file */
// '/vendor/jquery-3.1.1.js',

/* > MOBILE MENU */
function openRight() {
    $("#menu-right").addClass('go-visible');
    $("#mask").removeClass().addClass('show');
    $('body,html').css('overflow', 'hidden');
};

function closeRight() {
    $("#menu-right").removeClass('go-visible');
    $("#mask").removeClass();
    $('body,html').css('overflow', 'initial');
};

$(".btn-cate button").click(function() {
    openRight();
});
$("#mask").click(function() {
    closeRight();
});
$(".nav-mobile > .title > a").click(function() {
    closeRight();
});

$('.nav__parent .btn-expand').click(function()
{
    _this = $(this);
    _this.parent().siblings().removeClass('is-active')
    _this.parent().addClass('is-active')
});



/* > bx slider */
$('#demo-01 .wrap').bxSlider({
    controls : false,
    minSlides: 2,
    maxSlides: 3,
    slideWidth : 160,
    slideMargin: 10,
    pagerSelector: '.slider-pager',
});

