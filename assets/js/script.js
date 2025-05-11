$(document).ready(function(){

    $('.scroll-top').hide();

    /*--------------- Navbar Toggler ---------------*/
    $('#menu-btn').click(function(){
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('active');
    });

    /*--------------- Scroll-Top ---------------*/
    $(window).on('scroll',function(){

        $('#menu-btn').removeClass('fa-times');
        $('.navbar').removeClass('active');

        // STICKY HEADER
        if($(window).scrollTop() > 0){
            $(".header").addClass("sticky");
        }else{
            $(".header").removeClass("sticky");
        }

        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $('.scroll-top').fadeIn();
            } else {
                $('.scroll-top').fadeOut();
            }
        });

    });

    //cursor
    $(function(){
        var body =  document.querySelector('body');
        var $cursor = $('.cursor');
        var $cursortwo = $('.cursor-two')
        function cursormover(e){

            gsap.to( $cursor , {
                x : e.clientX ,
                y : e.clientY,
            })
            gsap.to( $cursortwo , {
                x : e.clientX ,
                y : e.clientY,
            })
        }
        function cursorhover(e){
            gsap.to( $cursor,{
                scale:1.5,
                opacity:.4,
                background:'rgb(235,235,235)',
                border:'none',
                ease: Expo.easeOut,
            })
            gsap.to( $cursortwo,{
                scale:0,
                opacity:0
            })
        }
        function linkhover(e){
            gsap.to( $cursor,{
                scale:1.5,
                opacity:1,
                background:'rgb(245,245,245)',
                border:'none',
                innerHTML:'view <br> project'
            })
            gsap.to( $cursortwo,{
                scale:0,
                opacity:0
            })
        }
        function cursor(e){
            gsap.to( $cursor, {
                scale:1,
                opacity:1,
                background:'transparent',
                border:'1px solid #3abb94',
                innerHTML:''
            })
            gsap.to( $cursortwo,{
                scale:1,
                opacity:1
            })
        }
        $(window).on('mousemove',cursormover);
        $('a').hover(cursorhover,cursor);
        $('.control').hover(cursorhover,cursor);
        $('.hover').hover(cursorhover,cursor);
        $('.project-link').hover(linkhover,cursor)

    })

    //cursor over

});