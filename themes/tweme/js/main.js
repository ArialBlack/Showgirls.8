jQuery(document).ready(function($){

    function setGalImagesHeight() {
        var wh = $(window).height(),
            $gallery = $('.mediagallery-wrap');

        $gallery.each(function(index){
            var $gal = $(this),
                $images = $gal.find('.img-orinent');

            $images.each(function(index){
                var $parent = $(this).parent('.field--field-mediagallery-item');
                $parent.addClass($(this).attr('class'));
            });
        });
    }

    setGalImagesHeight();
    $('.mediagallery-wrap .field--field-mediagallery-item').css('max-height', $(window).height() + 'px');
});

jQuery(window).resize(function($){
    $('.mediagallery-wrap .field--field-mediagallery-item').css('max-height', $(window).height() + 'px');
});