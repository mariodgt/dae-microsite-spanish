
$(document).ready(function () {

    function doLightboxTabs() {
      if ($('[id="lightboxSubTabs"]').length) {
        $('[id="lightboxSubTabs"]').find('[class="sub-tabs"] > li:eq(0)').addClass('active');
        $('[id="lightboxSubTabs"] [id$="SubTabContent"]').hide();
        var opener;
        $('[id="lightboxSubTabs"] .active a').each(function (index, value) { 
          opener = $(this).attr('href'); 
          $(opener).show();
        });
        }
    }
    //Auto post on language selection
    $('#languageListDD').on('change', function () {
        window.location('?language=' + $('#languageListDD').val())
    });


    
var loc = $('#destinationsPage #resultsListing'),
        loc2 = $('#destinationsPage #lightboxWrapper');
    $(loc2).add(loc).hide();
    

    function doDest() {
    $('[id^="searchOutput"]').html('');            //Region list
        $('[id^="searchResultsBox"]').slideUp('slow'); //Article/Availability list
        $('#searchResultsDestination').slideUp('slow');
        $('#collectionsBlock').fadeOut('slow');
        $(loc).fadeOut('slow');
        $(loc2).fadeOut('slow');
        }
    
   
    var countryID = 0;
    //New: choose region by graphics of geo-areas

    $('input:radio[name="region-map-choice"]').change(function(){
        var targetSel = $('#searchSelect');
        var areaval = $('input:radio[name="region-map-choice"]:checked').val();

        $(targetSel).material_select('destroy');

        $(targetSel).load('api/destinations/areas/' + areaval, function(){
            $(targetSel).material_select();
            doDest();
            var targetUL = $(targetSel).parents('.select-wrapper').find('ul'),
                scrollTarget = $(targetSel).parents('.select-wrapper').prev('.title-label')

            //User shouldn't have to repeat a selection if there are no sub-areas, e.g. "Asia".
                if ($('li',targetUL).length==1) {
                    $(targetUL,'body').children('li:eq(0)').trigger('click');
                }
                $('html,body').animate({
                scrollTop: $(scrollTarget).offset().top
                        }, 1000);
        });
        
    });

     //Country Dropdown AJAX
    $('[id^="searchSelect"], document').change(function () {

        countryID = $(this).val();
       
        doDest();

        if (countryID != "0") {
            //if you select a country, then go back to the default "Choose..." option box needs to hide
            $('[id^="searchResultsBox"]').slideDown('slow');
            $('[id^="searchOutput"]').load('/dae/api/destinations/regions/' + countryID);
        }
        else {
            $('#collectionsBlock').fadeIn('slow');
        }

    });

    //Region List AJAX
    
    
    $(document).on('click', '#searchOutput a', function (e) {
        $('[id^="searchOutput"] a').removeClass('selected');
        $(this).addClass('selected'); //so selected link will persist

        e.preventDefault();//link should not go out to a new page

        var regionCode = $(this).attr('href');

        $('#searchTabContent .title-bar').slideUp('slow');

        //Gracefully clear the old list
        $(loc2).fadeOut('slow'); //In case the search result link is hit instead of the back button

        $(loc).fadeOut('slow', function () {
            $(loc).load('/dae/api/destinations/search/' + countryID + '/' + regionCode, function () {
                $(loc).fadeIn('slow').delay(1000);
                doClip();
                $('html,body').animate({
                scrollTop: $(loc).offset().top
                        }, 1000);
            });
        });
    });
	
	//Resort List AJAX
    $(document).on('click', '#searchOutputC a', function (e) {
        $('[id="searchOutputC"] a').removeClass('selected');
		$('#searchResultsDestination').slideUp('slow');
        $(this).addClass('selected'); //so selected link will persist

        e.preventDefault();//link should not go out to a new page

       // var regionCode = $(this).attr('href');
        
            $('#searchDestinationC').load('/dae/api/destinations/resorts/28/Q', function () {
                $('#searchResultsDestination').slideDown('slow');
            });
    });
	
	
	//Add the resort selection to a hidden field for submission with form
	$(document).on('click', '#searchDestinationC a', function (e) {
		e.preventDefault();//link should not go out to a new page
		$('[id="searchDestinationC"] a').removeClass('selected');
        $(this).addClass('selected'); //so selected link will persist
		var resVal = $(this).attr('href');
		$('#destinationSelection').val(resVal);
	});

    $(document).on('click', '#resultsListing .click-box', function (e) {

        var articleID = $('.button', this).data('articleid'),
        itemCount = 0;
        //Gracefully clear the old content

        $(loc).fadeOut('slow', function () { });


        $('#lightboxWrapper').load('/dae/api/destinations/' + articleID, function () {
            //Ease in the new list

          
        });

        $(loc2).fadeIn('slow', function () {
            doExcerpt();
            doSlide1();
            doLightboxTabs();
        });
        $('#searchTabContent .title-bar').slideDown('slow');
      
    
     
    });
    //SEARCH DETAIL

    $('#searchTabContent .icon-back').on('click', function () {
        $(loc2).fadeOut('slow').hide();
        $(loc).fadeIn('slow');
        $('#searchTabContent .title-bar').slideUp('slow');

    });

});