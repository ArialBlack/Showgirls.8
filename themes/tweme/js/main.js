(function ($) {
    $(function() {

        var aRun = true,
            nTitle = '',
            nBody = '',
            coverImage = '',
            nGall = '';

        function wrapPortraits (list, item) {
            var $list = $(list),
                $items = $list.find(item),
                r = 0;

            for( var i = 0; i < $items.length; i+=2) {
                $items.slice(i, i+2).wrapAll("<div class='portraitsRow'></div>");
            }
        }

        $('.ajax_modal_load').on('click', function(){
            var siteUrl = document.location.origin,
                tNode = $(this).data('node');

            $('body').addClass('ajax-run');

            $('#ajaxNodeModal .modal-body').text('');
            nTitle = '';
            nBody = '';
            coverImage = '';
            nGall = '';

            $.ajax({
                    url: siteUrl + '/node/' + tNode + '?_format=json',
                    type: 'GET'
                })
                .done(function(data) {
                    nTitle = data.title[0].value;

                    console.log(data.body.length);

                    if (data.body.length > 0) {
                        nBody = data.body[0].value;
                    }

                    if (data.field_cover) {
                        var nCover = siteUrl + data.field_cover[0].url;

                        if (nCover.length > 7) {
                            $.ajax({
                                    url: nCover + '?_format=json',
                                    type: 'GET'
                                })
                                .done(function(data) {
                                    var mUrl = data.field_image[0].url;
                                    coverImage = '<img class="aCover" src="' + mUrl + '" />';
                                })
                                .fail(function(event) {
                                    console.log(event.status);
                                });
                        }
                    }

                    var mGallery = data.field_mediagallery;

                    if (mGallery.length > 0) {
                        nGall = '';

                        for(i = 0; i < mGallery.length; i++) {
                            $.ajax({
                                    url: siteUrl + mGallery[i].url + '?_format=json',
                                    type: 'GET'
                                })
                                .done(function(data) {
                                    var mUrl = data.field_image[0].url,
                                        mWidth = data.field_image[0].width,
                                        mHeight = data.field_image[0].height,
                                        ratio = mWidth / mHeight,
                                        mediaRatio = '';

                                    if (ratio > 1.14) {
                                        mediaRatio = "landscape";
                                    } else if (ratio <= 1.14 && ratio >= 0.875) {
                                        mediaRatio = "square";
                                    } else if (ratio < 0.875) {
                                        mediaRatio = "portrait";
                                    }

                                    var gallImage = '<div class="field--field-mediagallery-item selected bg-image ' + mediaRatio + '" ><article class="media media-image view-mode-url-formatter"><div class="field-item">';
                                    gallImage =  gallImage + '<div style="background-image: url(' + mUrl + ');" class="bg-image ' + mediaRatio + '" data-orig-width="' + mWidth + '" data-orig-height="' + mHeight +'"></div></div></article></div>';
                                    nGall = nGall + gallImage;
                                })
                                .fail(function(event) {
                                    console.log(event.status);
                                });
                        }//end gall for
                        //nGall = nGall + '</div></div>';
                    }//end gal if
                    aRun = false;
                })
                .fail(function(event) {
                    console.log(event.status);
                });
        });

        $('.cd-single-item').find('.cd-close').on('click', function(){
            setGalImagesHeight();
        });

        function setGalImagesHeight() {
            var wh = $(window).height() - 80,
            //ww = $('.mediagallery-wrap').width(),
                $gallery = $('.mediagallery-wrap').not('.cd-slider-active');

            $gallery.each(function(index){
                var $gal = $(this),
                    $images = $gal.find('.field--field-mediagallery-item');

                if ($(this).parents('article.foto').length > 0) {
                    ww = $(this).width();

                    $images.each(function(index){
                        var $this = $(this),
                            $item = $this.find('.bg-image');

                        $this.addClass($item.attr('class')).css('height', wh + 'px');
                        $item.css('height', wh + 'px');
                    });
                }

                if  ($(this).parents('#ajaxNodeModal .modal-dialog').length > 0) {
                    ww = $('#ajaxNodeModal .modal-dialog').width();

                    $images.each(function(index){
                        var $this = $(this),
                            $item = $this.find('.bg-image');

                        if(!$item.hasClass('portrait') &&  $item.data('orig-height') < wh) {
                            $this.addClass($item.attr('class')).css('height', $item.data('orig-height') + 'px');
                            $item.css('height', $item.data('orig-height') + 'px');
                        } else {
                            $this.addClass($item.attr('class')).css('height', wh + 'px');
                            $item.css('height', wh + 'px');
                        }

                    });
                }
            });
        }

        function link2Coub() {
            var $coubLink = $('article .paragraph--type--coub .field-item a');

            $coubLink.each(function( index ) {
                var $this = $(this),
                    src = $this.attr('href'),
                    pos = src.lastIndexOf('/'),
                    id = src.substring(pos + 1),
                    $iframe = '<iframe src="//coub.com/embed/' + id + '?muted=false&autostart=false&originalSize=false&startWithHD=false" allowfullscreen="true" frameborder="0" width="100%" height="600"></iframe>';
                $this.parent('.field-item').html($iframe);
            });
        }

        $(document).ready(function(){
            console.log('run');
            setGalImagesHeight();
            wrapPortraits('.field--field-mediagallery', '.field--field-mediagallery-item.portrait');
            link2Coub();
        });

        $(document).ajaxStop(function () {
            if(aRun === false) {
                $('body').removeClass('ajax-run');
                $('#ajaxNodeModal .modal-title').text(nTitle);
                $('#ajaxNodeModal .modal-body').append(coverImage);
                $('#ajaxNodeModal .modal-body').append('<div class="nbody">' + nBody + '</div>');
                $('#ajaxNodeModal .modal-body').append('<div class="mediagallery-wrap cd-single-item"><div class="field-mediagallery cd-slider-wrapper">' + nGall + '</div></div>');
                setGalImagesHeight();
                wrapPortraits('.modal-body .field-mediagallery', '.field--field-mediagallery-item.portrait');
                $('#ajaxNodeModal').modal();
            }
        });

        jQuery(window).resize(function($){
            setGalImagesHeight();
        });

    });
}(jQuery));


