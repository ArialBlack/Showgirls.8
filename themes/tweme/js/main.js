jQuery(document).ready(function($){

    function wrapPortraits (list, item) {
        var $list = $(list),
            $items = $list.find(item),
            r = 0;

        for( var i = 0; i < $items.length; i+=2) {
            $items.slice(i, i+2).wrapAll("<div class='portraitsRow'></div>");
        }
    }

    function setGalImagesHeight() {
        var wh = $(window).height(),
            ww = $('.mediagallery-wrap').width(),
            $gallery = $('.mediagallery-wrap').not('.cd-slider-active');

        $gallery.each(function(index){
            var $gal = $(this),
                $images = $gal.find('.field--field-mediagallery-item');

            $images.each(function(index){
                var $this = $(this),
                    $img = $this.find('img'),
                    imgWidth = $img.attr('width'),
                    imgHeight = $img.attr('height'),
                    ratio = imgWidth / imgHeight,
                    mediaRatio = '';


                if (ratio > 1) {
                    mediaRatio = "landscape";
                    widthScale = ww / imgWidth;
                    newHeight = imgHeight * widthScale;

                    if (newHeight > wh) {
                        $this.css('height', $(window).height() + 'px');
                        $img.addClass('cover-landscape');
                    } else {
                        $this.css('height', newHeight + 'px');
                        $img.addClass('resize-landscape');
                    }

                } else {
                    mediaRatio = "portrait";
                    heightScale = wh / imgHeight;
                    newWidth = imgWidth * heightScale;

                    if (newWidth > ww / 2) {
                        //$img.addClass('cover-portrait');
                        $img.css('height', 'auto');
                        $img.css('width', '100%');
                    } else {
                        $img.css('height', wh + 'px');
                        $img.css('width', 'auto');
                    }
                }

                $this.addClass(mediaRatio);

                //if(imgHeight > wh) {
                //    $this.css('height', $(window).height() + 'px');
                //} else {
                //    $this.css('height', $(window).height() + 'px');
               // }
            });

            $('.field--field-mediagallery-item img.cover-landscape').cover();
            $('.field--field-mediagallery-item img.cover-portrait').cover();
        });
    }

    setGalImagesHeight();
    wrapPortraits('.field--field-mediagallery', '.field--field-mediagallery-item.portrait');

    jQuery(window).resize(function($){
        setGalImagesHeight();
    });

    $('.cd-single-item').find('.cd-close').on('click', function(){
        setGalImagesHeight();
    });
});

