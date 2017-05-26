jQuery(document).ready(function($){

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

    function setGalImagesHeight() {
        var wh = $(window).height(),
            //ww = $('.mediagallery-wrap').width(),
            $gallery = $('.mediagallery-wrap').not('.cd-slider-active');

        $gallery.each(function(index){
            var $gal = $(this),
                $images = $gal.find('.field--field-mediagallery-item');

            if ($(this).parents('article.foto').length > 0) {
                ww = $(this).width();
            }

            if  ($(this).parents('#ajaxNodeModal .modal-dialog').length > 0) {
                ww = $('#ajaxNodeModal .modal-dialog').width();
            }


            $images.each(function(index){
                var $this = $(this),
                    $item = $this.find('.bg-image');

                $this.addClass($item.attr('class')).css('height', wh + 'px');
                $item.css('height', wh + 'px');
            });

        });
    }

    setGalImagesHeight();
    wrapPortraits('.field--field-mediagallery', '.field--field-mediagallery-item.portrait');

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
                                //$('#exampleModalLong .modal-body').append(coverImage);
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
                                    gallImage = '<div class="field--field-mediagallery-item"><img class="mGallery" width="' + mWidth + '" height="' + mHeight + '" src="' + mUrl + '" /></div>';

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

    $(document).ajaxStop(function () {
        if(aRun === false) {
            $('body').removeClass('ajax-run');
            $('#ajaxNodeModal .modal-title').text(nTitle);
            $('#ajaxNodeModal .modal-body').append(coverImage);
            $('#ajaxNodeModal .modal-body').append(nBody);
            $('#ajaxNodeModal .modal-body').append('<div class="mediagallery-wrap cd-single-item"><div class="field-mediagallery cd-slider-wrapper">' + nGall + '</div></div>');
            setGalImagesHeight();
            wrapPortraits('#ajaxNodeModal .field--field-mediagallery', '.field--field-mediagallery-item.portrait');
            $('#ajaxNodeModal').modal();
        }
    });

    jQuery(window).resize(function($){
        setGalImagesHeight();
    });

    $('.cd-single-item').find('.cd-close').on('click', function(){
        setGalImagesHeight();
    });
});

