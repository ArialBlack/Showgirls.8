jQuery(document).ready(function($){

    function wrapPortraits (list, item) {
        var $list = $(list),
            $items = $list.find(item),
            r = 0;

        for( var i = 0; i < $items.length; i+=2) {
            $items.slice(i, i+2).wrapAll("<div class='portraitsRow'></div>");
        }
    }

    function setGalHeight() {
        var wh = $(window).height(),
            $portraits = $('.mediagallery-wrap.cd-slider-active .field--field-mediagallery-item.portrait');

        $('.mediagallery-wrap.cd-slider-active').height(wh + 'px');
        $('.mediagallery-wrap.cd-slider-active .field--field-mediagallery-item').height(wh + 'px');

        $portraits.each(function(index){
            var $this = $(this),
                $bgImage = $this.find('.bg-image'),
                origWidth = $bgImage.data('orig-width'),
                origHeight = $bgImage.data('orig-height'),
                newWidth = origWidth * wh / origHeight;

            $bgImage.width(newWidth + 'px');
        });
    }

    function clearGalHeight() {
        $('.mediagallery-wrap').height('auto');
        $('.mediagallery-wrap .field--field-mediagallery-item').height('auto');
        $('.mediagallery-wrap .field--field-mediagallery-item.portrait .bg-image').width('');
    }
    
    var itemInfoWrapper = $('.cd-single-item');

    $('.field--field-mediagallery-item:first-child').addClass('selected');
    
    itemInfoWrapper.each(function(){
        var container = $(this),
            sliderPagination = createSliderPagination(container);
        updateNavigation(container, container.find('.cd-slider .field--field-mediagallery-item').eq(0));

        container.find('.cd-slider').on('click', function(event){
            if( !container.hasClass('cd-slider-active') && $(event.target).is('.field--field-mediagallery-item')) {
                $('.field--field-mediagallery-item.portrait').unwrap();
                itemInfoWrapper.removeClass('cd-slider-active');
                container.addClass('cd-slider-active');
                setGalHeight();

                container.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
                    $('body,html').animate({'scrollTop':container.offset().top}, 200);
                });
            }
        });

        container.find('.cd-close').on('click', function(){
            container.removeClass('cd-slider-active');
            clearGalHeight();
            wrapPortraits('.field--field-mediagallery', '.field--field-mediagallery-item.portrait');
        });
        
        container.find('.cd-next').on('click', function(){
            nextSlide(container, sliderPagination);
        });

        container.find('.cd-prev').on('click', function(){
            prevSlide(container, sliderPagination);
        });

        container.find('.cd-slider').on('swipeleft', function(){
            var wrapper = $(this),
                bool = enableSwipe(container);
            if(!wrapper.find('.selected').is(':last-child') && bool) {nextSlide(container, sliderPagination);}
        });

        container.find('.cd-slider').on('swiperight', function(){
            var wrapper = $(this),
                bool = enableSwipe(container);
            if(!wrapper.find('.selected').is(':first-child') && bool) {prevSlide(container, sliderPagination);}
        });

        sliderPagination.on('click', function(){
            var selectedDot = $(this);
            if(!selectedDot.hasClass('selected')) {
                var selectedPosition = selectedDot.index(),
                    activePosition = container.find('.cd-slider .selected').index();
                if( activePosition < selectedPosition) {
                    nextSlide(container, sliderPagination, selectedPosition);
                } else {
                    prevSlide(container, sliderPagination, selectedPosition);
                }
            }
        });
    });

    $(document).keyup(function(event){
        if(event.which=='37' && $('.cd-slider-active').length > 0 && !$('.cd-slider-active .cd-slider .selected').is(':first-child')) {
            prevSlide($('.cd-slider-active'), $('.cd-slider-active').find('.cd-slider-pagination .field--field-mediagallery-item'));
        } else if( event.which=='39' && $('.cd-slider-active').length && !$('.cd-slider-active .cd-slider .selected').is(':last-child')) {
            nextSlide($('.cd-slider-active'), $('.cd-slider-active').find('.cd-slider-pagination .field--field-mediagallery-item'));
        } else if(event.which=='27') {
            itemInfoWrapper.removeClass('cd-slider-active');
        }
    });

    function createSliderPagination($container){
        var wrapper = $('<ul class="cd-slider-pagination"></ul>').insertAfter($container.find('.cd-slider-navigation'));
        $container.find('.cd-slider .field--field-mediagallery-item').each(function(index){
            var dotWrapper = (index == 0) ? $('<li class="selected"></li>') : $('<li></li>'),
                dot = $('<a href="#0"></a>').appendTo(dotWrapper);
            dotWrapper.appendTo(wrapper);
            dot.text(index+1);
        });
        return wrapper.children('li');
    }

    function nextSlide($container, $pagination, $n){
        var visibleSlide = $container.find('.cd-slider .selected'),
            navigationDot = $container.find('.cd-slider-pagination .selected');
        if(typeof $n === 'undefined') $n = visibleSlide.index() + 1;
        visibleSlide.removeClass('selected');
        $container.find('.cd-slider .field--field-mediagallery-item').eq($n).addClass('selected').prevAll().addClass('move-left');
        navigationDot.removeClass('selected');
        $pagination.eq($n).addClass('selected');
        updateNavigation($container, $container.find('.cd-slider .field--field-mediagallery-item').eq($n));
    }

    function prevSlide($container, $pagination, $n){
        var visibleSlide = $container.find('.cd-slider .selected'),
            navigationDot = $container.find('.cd-slider-pagination .selected');
        if(typeof $n === 'undefined') $n = visibleSlide.index() - 1;
        visibleSlide.removeClass('selected');
        $container.find('.cd-slider .field--field-mediagallery-item').eq($n).addClass('selected').removeClass('move-left').nextAll().removeClass('move-left');
        navigationDot.removeClass('selected');
        $pagination.eq($n).addClass('selected');
        updateNavigation($container, $container.find('.cd-slider .field--field-mediagallery-item').eq($n));
    }

    function updateNavigation($container, $active) {
        $container.find('.cd-prev').toggleClass('inactive', $active.is(':first-child'));
        $container.find('.cd-next').toggleClass('inactive', $active.is(':last-child'));
    }

    function enableSwipe($container) {
        var mq = window.getComputedStyle(document.querySelector('.cd-slider'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
        return ( mq=='mobile' || $container.hasClass('cd-slider-active'));
    }
});