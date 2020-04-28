
//Global function variables

    var autoSlideWidth = 300;
    var autoSlideSpeed = 1000;
    var autoSlidePause = 3000;
    var currentSlide = 1;
    var interval;

$(document).ready(function(){
    
    //BEGIN : Code for responsive menu toggling
    $('.responsive_nav_icon').click(function(){ 
        $('.responsive_nav').slideToggle("500");
        });
     
    //Open/Close side nav menu on click
    $('.side_nav_btn').click(side_nav_open);
    $('.side_nav_close').click(side_nav_close);
    //END: Responsive menu
    
    //BEGIN: Code for auto slideshow
     var $carousel = $('.auto_slideshow'); 
    //Have carousel started on page load
    startSlideShow();
    $carousel.on('mouseenter',stopSlideShow).on('mouseleave', startSlideShow);
    //END: Auto Slideshow
    
    
    //BEGIN: Code for the thumbnail slider gallery
    var lgImgCont = $('.slider').css('overflow','hidden').children('ul');
    var thumImgCont = $('.thumb_gallery').children('ul');
    
    //Create new slider object for thumbnail gallery
    if($('.slider').length){
        var sliderObj = new slider(lgImgCont, thumImgCont, $('.sliderCtrls') );

        //Set up click functions for slider control buttons
        sliderObj.nav.find('button').on('click',function(){                   
            sliderObj.setCurrentPos($(this).data('dir'));
            sliderObj.transition();
                    });

        //Set up click function for thumbnail images
        sliderObj.thumImgCont.find('li a').on('click', function(evt){
            evt.preventDefault();
            sliderObj.setCurrentPos($(this).data('pgno'));
            sliderObj.transition();
        });   
    } //END: Code for the thumbnail slider gallery
    
    //BEGIN: Code for Modal pop-up
    if($('.popUpImg').length){
        $('.popUpImg img').each(function() {
            $(this).click(function(){
                var imgSrc = $(this).attr('src');
                var caption = $(this).attr('alt');
                $(this).parent().after('<div class="modal"></div>');
                $('.modal').css('display', 'block');
                /* Create subdivs inside modal class */
                var code = "<div class='modal_close'></div>";
                code += '<img class="modalImg" src='+imgSrc+' />';
                code += '<div class="imgCaption">'+caption+'</div>';
                $('.modal').prepend(code);
                 $('.modal_close').click(function(){
                    $('.modal').css('display', 'none');
                    $('.modal').remove();
                });
            }); //End popup click event
        });//END: Each function
    } //END: Modal Pop-up
    
     //Code to scroll to top of the page
    $('.btn_top').click(function(e){
        e.preventDefault();
        $('html, body').stop().animate({
            scrollTop : 0},500);

    });// END scroll to top function
    
    //Scroll to specific elements on the page (useful for single page websites)
    //function to enable page scrolling
    $('.scroll').on('click', function(e) { 
        var target = $(this).attr('href');
        if(target.length){
            e.preventDefault();
            $('html, body').stop().animate({
                scrollTop: $(target).offset().top},500);
        }
    }); //End scroll function
        
}); //END Doc ready
    
    

/* Function to start-stop SlideShow */
function startSlideShow(){
    
    var $slideBox = $('.auto_slideshow ul');
    var $slides = $('.auto_slideshow li');
    
        interval = setInterval(function(){
        $slideBox.animate({'margin-left': '-=' +autoSlideWidth},autoSlideSpeed, function() {
                ($slideBox).find('li:last').after($slideBox.find('li:first'));
                $slideBox.css('margin-left',0);
            }); //End animate function     
        }, autoSlidePause);//End Setinterval function
    };//End startCarousel function 
    
function stopSlideShow(){
        clearInterval(interval);
    }

/*Function to open side Nav*/
function side_nav_open(){
//    $('.side_nav').addClass('showSideNav');
    $(".side_nav").animate({left:'0'},10);
    $('.push_right').addClass('push_animation');
}

function side_nav_close(){
    //$('.side_nav').removeClass('showSideNav push_right');
    $(".side_nav").animate({left:'-500px'},10);
    $('.push_right').removeClass('push_animation');
}

//Function to initialize the slider instance

function slider(lgImgCont, thumImgCont, nav){
    this.lgImgCont = lgImgCont;
    this.thumImgCont = thumImgCont;
    this.nav = nav;
    this.imgs = this.lgImgCont.find('img');
    this.width = this.imgs[0].width;
    this.numImgs = this.imgs.length;
    console.log("Total no. of Items in the list are : "+this.numImgs);
    console.log("Width of this each item is "+this.width);
    //add the "data-pgno" attribute to the Thumbnail Container
    item=0;
    this.thumbList = thumImgCont.find('li');

    //loop thr each list iem and add pgno data attribute
    this.thumbList.each(function(){
        $anchor = $(this).find('a');
        $anchor.data('pgno',item);
        item++;
    });
    this.current = 0;
    //Default style for all thumbnails
    this.thumImgCont.find('li a img').toggleClass('imgThumb');
    //Additional style for first thumbnail
    this.thumImgCont.find('li:nth-child(1) a img').toggleClass('imgThumbSelected');
}

//Thumbnail Slider animation function
slider.prototype.transition = function(coords){
    this.lgImgCont.animate({
        'margin-left':coords || -(this.current*this.width)},500);
    this.thumImgCont.find('li a img').removeClass('imgThumbSelected');
    this.thumImgCont.find("li:nth-child("+(this.current+1)+") a img").toggleClass('imgThumbSelected');
    };

//Set the current counter to prev or next position based on data-dir property
slider.prototype.setCurrentPos = function(dir){
    var pos = this.current;

    if(isNaN(dir)){
        pos+= Math.floor(dir=='next') || -1;
       // pos+= ~~(dir=='next') || -1;

        this.current = (pos<0)?this.numImgs-1:pos%(this.numImgs);
    }
    else
        {
        this.current = Number(dir);
        }
    console.log("this.current is " +this.current);

};
