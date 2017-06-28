/*!
 * Custom JS for DAE
 * Copyright 2016 Pixelslave, Inc. for Brand Tango
 * Author: Connie Finkelman http://www.pixelslave.com/
 */
 
 //This sets datepicker minimum, initialized to "0"
 //If minimum is desired set globally here
 //Otherwise, set per page in head of doc, above scripts.
if (bMin  == 'undefined'){ 
			var bMin = 0;
		}

//Get values passed on URL for use with modal warnings in particular 
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
} 



var clipL = 138;
function doClip(){
		  var st,clipP;
		 $('.clip .click-box').each(function(){
				if ($(this).attr('data-clip')) {
				clipL = $(this).data('clip');
				}  
		   clipP = $('p',this);
		   st = $(clipP).text();
		  if(st.length > clipL){
		  st = st.substring(0, clipL);
		  if (st[st.length-1] === "." || st[st.length-1] === " ") {
    			st = st.slice(0,-1);
		  }
		  $(clipP).text(st).append('&#8230;');  
		  
		}
		 });
		};
		
var exL = 660;		
function doExcerpt(){	
var exH;
	$('.excerpt').each(function(){
		if ($(this).attr('data-excerpt')) {
			exL = $(this).data('excerpt');
		}  
		if ($(this).height() > exL) {
			
			$(this).addClass('clipped');
		}
	});

}


		


var slide1;
function doSlide1(){	
 slide1= $('#imageBox .thumbs li:eq(0) img');
	if ($(slide1).data('video')) {
		$(slide1).click();
	}

}
		

$(document).ready(function() {	

//Initialize Tooltips

if ($('.tooltip').length > 0){
$('.tooltip').tooltipster();
}

//Initialize Tabs
initTabs();

//"#modalDateWarning"



//Initialize the custom selects - Don't hit the header, which has hidden labels and selects!
if ($('#contentWrapper select').length){
$('#contentWrapper select').material_select();
}


if ($('.datepicker').length){

Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}



var dat = new Date();
var dt = dat.addDays(bMin);
var month = dt.getMonth()+1;
var day = dt.getDate();
var year = dt.getFullYear();
var bankingMin = (year + ',' + month + ',' + day);
var dpTitle = '';


$('.datepicker').pickadate({
	onStart: function() {
	
	},
	closeOnSelect: true,
	closeOnClear: true,
	selectMonths: true, // Creates a dropdown to control month
    selectYears: 3, // Creates a dropdown of 15 years to control year
	showMonthsShort: true, //Oct instead of October
	format: 'dd mmm, yyyy',
	min: new Date(bankingMin)
  });

} // end if .datepicker



if ($('.modal-trigger,.dark-trigger').length){
// the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
     $('.modal-trigger').leanModal({
      dismissible: true,
	  opacity: .1,
	  ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
      },
      complete: function() { } // Callback for Modal close
    }
  );

     $('.dark-trigger').leanModal({
      dismissible: true,
	  opacity: .5,
	  ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        $('body').addClass('dark-modal-cover');
        $('#contentWrapper select').material_select();
      },
      complete: function() { $('body').removeClass('dark-modal-cover'); } // Callback for Modal close
    }
  );
}// end if leanModal


//Change the legend on the calendar popup by select
  
  $('#select-ExchangeLength').on('change',function(){
  var str = $('option:selected',this).val();
  	$('#selectedLegend').attr('class','').find('span').text(str);
	  if (str.toLowerCase().indexOf("bonus") >= 0)  {
	  	$('#selectedLegend').attr('class','bonus');
	  }
	  else if (str.toLowerCase().indexOf("rental") >= 0)  {
	  	$('#selectedLegend').attr('class','rental');
	  }
  }); 
  
  
//Only print a section of the page. Built for booking.html print action
$('.js-print-button').click(function(){
	//$('.print-this').removeClass('print-this');
	//$(this).parents().addClass('print-this');
	$(this).parents('.js-print-box').addClass('print-this');
	$('head').append("<style id='printStyles'>@media print { h1,header,#footer,#backToTop,#backToTop:before,#headerBanner,#progressBar,.sequence-panel:not(.print-this) { display:none; } .js-no-print{display:none!important;} .list-boxes {width: 100%;} }</styles>");
	window.print();
	window.onfocus = function () {
		$('#printStyles').remove();
		$('.print-this').removeClass('print-this');
	}
});  


$('.options-blocks.selectable .button').on('click', function(){
		$(this).closest('li').addClass('selected').siblings().removeClass('selected');
		
	});
      

	
	
//Probably temporary: Change the form from readonly to editable
function doMemberInfo() {
$('.member-form.editable.disabled').find('input,select').prop('disabled', 'disabled').end()
	.find('.caret').addClass('disabled');
	$('.form-toggle-save').hide();	
}
doMemberInfo();

$('.form-toggle-edit').on('click',function(e){
	var formParent = $(this).parents('.member-form');
	$(formParent).toggleClass('disabled long').find('input,select').prop('disabled', false).end()
	.find('.caret').removeClass('disabled');
	$('.form-toggle-save,.form-toggle-edit').toggle();	
	e.preventDefault();
	});


$('[id^=b-Save]').on('click',function(e){
	var curForm = $(this).parents('.member-form.editable');
	$(curForm).toggleClass('disabled long');
	doMemberInfo();
	$('.form-toggle-edit',curForm).show();
	$('html,body').animate({
				scrollTop: $(curForm).offset().top
					}, 1000);
	});	
  

//Use a select to show a form, then hide it on save and return select
$('.form-sequencer').change(function(){
	$(this).closest('.row').slideUp({ 
		  duration: 1000, 
		  easing: "easeOutQuart" }).delay(500);
		  $(this).parents('.row').next('.sequence-form').slideDown({ 
		  duration: 2000, 
		  easing: "easeInQuart" });
	});
	$('.sequence-form .save-form').on('click',function(){
		var colTop = $(this).parents('.sequence-form').prev('.row');
		$(this).parents('.sequence-form').slideUp({ 
		  duration: 1000, 
		  easing: "easeOutQuart" }).delay(500);
		  $(colTop).slideDown({ 
		  duration: 2000, 
		  easing: "easeInQuart" });
		  $('html,body').animate({
				scrollTop: $(colTop).offset().top
					}, 1000);
	});
	
//End select form sequencer	


  
//Do you need to pop a modal?
//usage: http://dae.com/somepage.html?modal=myModalId
var modalName  = decodeURIComponent($.urlParam('modal'));

//IMPORTANT: Trying to pop a modal that doesn't exist results in a cover being applied to the page that is invisible, cannot be dismissed, and blocks user action
//Test twice before auto-popping modal on load: Is there a modal being called? Is there a DOM object (modal) with that ID on the page?
if (modalName != 'null') { //no query string
	modalName = "#" + modalName;
	if($(modalName).length) { //modal is called, but doesn't exist
	$(modalName).openModal();
	}
}

  
  //Hide and show checkout date with flex-date checkbox
  
  $('[id^="hasFlexDate"]').change(function(){
	  $(this).closest('.row').find('[id$="Check-Out"]').parent('.datepicker-wrapper').toggleClass('hidden');
	  });

//If first slide in thumbs is a video it has to be embedded.
if ($('#imageBox .thumbs').length) {
doSlide1();
}

if ($('.excerpt').length) {
doExcerpt();
}




//show ellipsized CMS content
 $(document).on('click', '.mask', function () {
	$(this).prev('.excerpt').removeClass('clipped');
});
	
	$('.click-box').on('click',function(){
		var thistarget=$('a:eq(0)', this).attr('target'),
		thisurl= $('a:eq(0)', this).attr('href');
		if (thistarget){
			window.open(thisurl,thistarget);
		}
		else {
  		window.location = $('a:eq(0)', this).attr('href');
  	}
	});
	
	//Ellipsize text in click boxes
	if ($('.clip .click-box').length > 0) {
		doClip();
	}
	
	
	//Tabs
	var openContent;
	function initTabs() {
	if ($('[id$="Tabs"]').length) {
		//Initialize
		
		$('[id$="Tabs"]').find('[class$="tabs"] > li:eq(0)').addClass('active');
		$('[id$="TabContent"]').hide();
		var opener;
		$('[id$="Tabs"] .active a').each(function (index, value) { 
		  opener = $(this).attr('href'); 
		  $(opener).show();
		});
	}
	
	$('body').on('click','[class$="tabs"] > li', function(e) {
		e.stopPropagation();
		e.preventDefault();
		var sDur = 1000;
		var slider = $('a', this).attr('href'),
			tabHolder = $(this).closest('[id$="Tabs"]');
		  $(this).addClass('active').siblings().removeClass('active');
		  if ($(this).closest('ul').hasClass('sub-tabs')) {
			  sDur = 500;
		  }
		 $(slider).siblings('[id$="TabContent"]').slideUp({ 
		  duration: sDur, 
		  easing: "easeOutQuart" }).delay(sDur/2);
		  slider = $('a', this).attr('href');
		  
		  $(slider).slideDown({ 
		  duration: sDur*2, 
		  easing: "easeInQuart" });
		});	
		
		  
	}	
	
	//go directly to tab on destinations page
if (window.location.hash) {
        var target = $(location).attr('href').split('#')[1];
		if (target.indexOf("Tab") > -1) {
			$('#' + target).trigger('click');
		}
       
}

//Temporary custom request tab submit, show thank you

$('#crf-Submit').on('click', function(e){
	e.preventDefault();
	$('#crf-MakeARequest').slideUp('slow',function(){
		$('#panelRequestSubmitted').slideDown('slow');
		});
	});
$('#panelRequestSubmitted a').on('click', function(e){
	e.preventDefault();
	$('#panelRequestSubmitted').slideUp('slow',function(){
		$('#crf-MakeARequest').appendTo('#customTabContent').slideDown('slow');
		});
	});	
	

	
	//Resort images
	//Video iframe needs height and the box height can only be calculated when box is full .
	
	$(document).on('click', '.thumbs img', function(){
		var isrc,
			ialt,
			embedsrc;
		if ($(this).data('video')) {
			var imgW = $('#imageBox > div').width(),
			imgH = $('#imageBox > div').height()
			resH = Math.round((imgW * 9)/16);
			if (resH < imgH) {
				resH = imgH;
			}
			isrc= $(this).data('video');
			
			embedsrc = '<iframe width="100%" height="' + resH + 'px" src="https://www.youtube.com/embed/' + isrc + '?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>';
			$('#imageBox > div').html(embedsrc); 
		}
			else {
			  isrc = $(this).attr('src');
			  ialt = $(this).attr('alt');
			  $('#imageBox > div').html('<img src="' + isrc + '" alt="' + ialt + '" />'); 
			}
	});

	
	$('.touchevents .dd-proxy-trigger').on('click',function(){
		$(this).toggleClass('hover');
		});
	
	//Pass value of styled pseudo-dropdowns into hidden select element
	$('.dd-proxy li').on('click',function(){
		var opt = $(this).data('lang'),
        dd = $(this).parent('ul').data('target');
		$(dd).val(opt);
		});
	
	
	//init slider
	function doSlider() {
		if ($('#slider').length) {
	$('#slider').slippry( {
		transition: 'horizontal',
		easing: 'swing',
		auto: true,
		preload: 'visible',
		controls: true,
		pager: false,
		autoHover: false,
		pause: 600000//debug
		//pause: 6000
				});
	}
	}
	doSlider();
	
		//shim to make forms understandable for downlevel browsers
		
		if(typeof document.createElement("input").placeholder == 'undefined') {
			$("form").addClass("no-placeholder");
		};
		
//Universal open
	//data-open="#idName"
	
	$('.trigger-open').on('click', function(){
		var openElem;
			if ($(this).data('open').length) {
				openElem = $(this).data('open');
			}
			$(openElem).slideToggle('slow');
	});				
//Universal close "x"
	//data-closefor="#idName"
	
	$('.trigger-close').on('click', function(){
		var closePar;
			if ($(this).data('closefor').length) {
				closePar = $(this).data('closefor');
			}
			else {
				closePar = $(this).parent();
			}
				$(closePar).animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
	});		
		
		//Accordion for mobile footer
		$('[class$="accordion"] ul:hidden').parents('[class$="accordion"]').addClass('accordion');
		$('.accordion h4').on('click',function(){
			$(this).siblings('ul').slideToggle();
			});
			
//Accordion for Dashboard and Member Benefits: "dashbar"


var hideOthers = ["#"],
	showOthers = ["#"];
$('.dashbar li > div').hide();
		$('.dashbar h3').on('click',function(){
			var thisbar = $(this).parent('li').not('.active');
			$('.dashbar > li.active').removeClass('active').find('> div').slideUp();
			
    
      $.each(hideOthers, function (index, value) {
          if (value) {
		        $(value).show();
		    }
      });
			$(thisbar).addClass('active').find('> div').slideDown('slow', function(){
				$('html,body').animate({
				scrollTop: $(thisbar).offset().top
						}, 1000);
			});
			
			if ($(this,thisbar).attr('data-hideothers') && (this,thisbar).hasClass('active')) {
          		hideOthers = $(this).data('hideothers');
			        $.each(hideOthers, function (index, value) {
			        	if (value) {
			          $(value).hide();
			      }
			        });
        	}
		     else {
		        $.each(hideOthers, function (index, value) {
		          $(value).slideDown();
		      });
      		}
      		if ($(this,thisbar).attr('data-showothers') && (this,thisbar).hasClass('active')) {
          		showOthers = $(this).data('showothers');
			        $.each(showOthers, function (index, value) {
			        	if (value) {
				          $(value).slideDown();
				      }
			    	});
        	}
		      else {
		        $.each(showOthers, function (index, value) {
		          $(value).hide();
		      	});
      		}
        $('select',thisbar).material_select();
        
    });
	
	
//MEMBER WALLET
if ($('#memberWallet').length) {
	if ($('#daeRewards span').text() == "0") {
		$('#daeRewards').addClass('badge');//puts the diagonal badge on the box
	}
	//Shrink the font size if the number is too big for the circle
	if ($('#daeRewards span').width() > 100) {//circle is 108px, but need to leave space for side pad
		var nfont = 100/parseInt($('#daeRewards span').width());
		$('#daeRewards span').css('font-size',nfont*40);//"40" is the default font size
	}
	
	//click boxes trigger content
		$('#memberWallet li').on('click', function(){
			if (!$(this).hasClass('active')) {
				$(this).addClass('active').siblings().removeClass('active');
				var wcont = '#' + ($(this).attr('id')) + 'Content';
					$('#walletContent [id$="Content"]').not(wcont).removeClass('open').slideUp('slow', function(){
						
						$(wcont).slideDown('slow', function(){
							if($(window).width()<1024) {
								$('html,body').animate({
								  scrollTop: $(wcont).offset().top
								}, 1000);
							}
						});
					});
					$(wcont).addClass('open');
				}
		});//#memberWallet.click
		
		//"x" closes content, resets triggers
		
		$('#walletContent .icon-close-empty').on('click', function(){
			$(this).closest('[id$="Content"]').removeClass('open').slideUp('slow');
			$('#memberWallet li').removeClass('active');
			if($(window).width()<1024) {
				$('html,body').animate({
					scrollTop: $('#memberWallet').offset().top
						}, 1000);
							}
			
			});
	
}
			
//END MEMBER WALLET

			
	//Back to top button
	var amountScrolled = 300;

$(window).scroll(function() {
	if ( $(window).scrollTop() > amountScrolled ) {
		$('#backToTop').fadeIn('slow');
	} else {
		$('#backToTop').fadeOut('slow');
	}
});		
$('#backToTop').click(function() {
	$('html, body').animate({
		scrollTop: 0
	}, 700);
	return false;
});


//Selects that show page content, e.g. contact form select region
$('select.hash-change').on('change',function(){
	var contentHolder =  $(this).data('contentholder'),
		hashval=$('option:selected',this).val();
		$('dl',contentHolder).hide();
		$(hashval).slideDown('slow');

});




//"TRENDING" FORM MANIPUTLATION
//Request form is moved to the resort chosen so that one form can serve all.
var trendingForm;
if ($('#trendingForm').length) {
 trendingForm = $('#trendingForm');
$('.data-request').on('click',function(){
	$(trendingForm).hide();
	$('.sequence-panel:not(:eq(0))',trendingForm).hide();
	$('.sequence-panel:eq(0)',trendingForm).show();
	var trRequest = $(this).data('request'),
	trPar = $(this).closest('.list-boxes > li');
	if($(window).width()<1024) {
		trPar = $(this).closest('.list-boxes').parent();
	}
	$(trendingForm).appendTo(trPar).end()
	.slideDown('slow', function(){
				$('html,body').animate({
				scrollTop: $(trendingForm).offset().top
						}, 1000);
			});
	
	
	$('#ResortRequestName').val(trRequest);
	});
}



//temp -- dismisses the ajax processing window on the booking form. In prod, should dismiss on an ajax success.
$('#wci-NextButtonWrapper6 .button').on('click',function(e){
	e.preventDefault();
	var thisParent = $(this).parents('.sequence-panel'),
		thisHolder = $(this).parents('[id^="bookingSequence"]'),
		nextHolder = $(thisHolder).find('.sequence-panel:last-child');
		$(nextHolder).fadeIn('slow',function(){
		$('.sequence-panel').not(nextHolder).hide();	
	$(thisParent).fadeOut('slow', function() {
			
				//$(thisParent).fadeIn('slow');
				if ($('#progressBar').length>0) {
					$('#progressBar li').removeClass('step');
					$('#progressBar li:last-child').addClass('step');
				}
				});
		});

});

	
	
	var panelOffset = 100;
	$('body').on('click','.button.next-panel',function(e){
	var myPanel = $(this).closest('.sequence-panel');
	var nextPanel;
	if ($(this).attr('data-panel')) {
		var seqId = '#' + $(this).data('panel');
		nextPanel = $(seqId).find('.sequence-panel:eq(0)');
		
	}
	else {
	nextPanel = $(myPanel).next('.sequence-panel');
	}
	if ($(nextPanel).attr('data-offset')) {
			panelOffset = $(nextPanel).data('offset');
		}
	$(myPanel).hide();
	$(nextPanel).show(function(){
		if ($('#progressBar').length > 0) {
		var step = $(nextPanel).data('step');
		$('#progressBar li').removeClass('step');
		$('#progressBar li:eq('+step+')').addClass('step');
			$('html,body').animate({
				scrollTop: $('#progressBar').offset().top
					}, 1000);
			}
		
		else {
				$('html,body').animate({
				scrollTop: $(nextPanel).offset().top - panelOffset
					}, 1000);
			}
		});
	return false;
	});
	
	$('body').on('click','.button.prev-panel',function(e){
	var myPanel = $(this).parents('.sequence-panel');
	$(myPanel).hide();
	var prevPanel;
	if ($(this).attr('data-panel')) {
		var seqId = '#' + $(this).data('panel');
		prevPanel = $(seqId).find('.sequence-panel:eq(0)');
	}
	else {
	prevPanel = $(myPanel).prev('.sequence-panel');
	}
	if ($(prevPanel).attr('data-offset')) {
			panelOffset = $(prevPanel).data('offset');
		}
	$(prevPanel).show(function(){
		if ($('#progressBar').length>0) {
		var step = $(prevPanel).data('step');
		$('#progressBar li').removeClass('step');
		$('#progressBar li:eq('+step+')').addClass('step');
			$('html,body').animate({
				scrollTop: $('#progressBar').offset().top
					}, 1000);
			}
		
		else {
				$('html,body').animate({
				scrollTop: $(nextPanel).offset().top - panelOffset
					}, 1000);
			}
			});
	return false;
	});
	
	
	//Calculate the dollar amount for credits when rewards credit is edited on payment page
	$('#rewardsEnter').change(function(){
		var r = parseFloat($('#rewardsEnter').val()/100);
		$('#rewardsCalc span').text(r.toFixed(2));
		
		});
		
	//Throw up the credit card processing screen
	$('#pb-NextButtonWrapper5 .button').on('click',function(){
		$('#paymentFormContent *').css('pointer-events','none');
		$('#paymentFormContent').animate({ opacity: .1}, 'slow', function() {
			$('html,body').animate({
				scrollTop: $('#progressBar').offset().top
					}, 1000, function() {
   				$('#paymentPending').fadeIn('slow');
				});
  		});
		return false;//temp until there is a submit action
		});	

//TEMPORARY SIMULATE PAYMENT SUCCESS ON BOOKING FORM


/*sequence selects on dashboard.html Request an Exchange - 
Path has to be constructed dynamically, but selection isn't a one-way
street. User can select above an already selected dropdown and the
path to data has to be set backwards and forwards.*/

 /*Already-selected values have to persist across multiple change events, so global*/
var regVal='',
	resVal='';
/*If you don't wipe out the materialize markup, the select will reset, but the fake 
"materialize-styled" dropdown the user sees (which is a <ul>) will retain the previous values.*/

if ($('.sequential-selects .row:hidden select').length) {
$('.sequential-selects .row:hidden select').material_select('destroy');
}

$('.sequential-selects select').change(function () { 
 /*Hide the "Next" button until all three dropdowns are selected*/
 var nextButton = $(this).parents('.sequential-selects').children('*[data-sequence="button"]');
 nextButton.css('visibility','hidden');

/*Queried elements and values*/
  var parRow = $(this).closest('.long'),
      nextRow = $(parRow).next('.long'),
      nextSel = $(nextRow).find('select:eq(0)'),
      selVal=$('option:selected',this).val(),
	  selTxt = $('option:selected',this).text(),
	  nextSelType = '';//inserts "resorts/" path when needed
	  
	  
/*Every select's value is used a little differently to build the string*/
/*Select #1 chooses a country code, e.g. "28", for Australia,
so it's select value is passed to the region value. On first select, this becomes "28.txt", e.g., 
then becomes a directory name later. */
  
	  if (parRow.is(':nth-child(1)')) {
		  regVal = selVal;//regVal is used to make file name
		  selVal='';
		  
	  }
/*Select #2 adds the resorts directory to the URL string. */	  
	  else if (parRow.is(':nth-child(2)')) {
		  nextSelType = 'resorts/';
		  /* A slash is added to turn the country code into a directory name, 
		  and selVal is added to get the resort file (e.g. "28" + "/" + "N").  */	 
		  resVal= '/' + selVal;
		  selVal='';
	  }
	  
/*Select #3's value is not needed, as there is no more data to fetch.
After selection we get the "Next" button.  */		  
	  else {  
		    nextButton.css('visibility','visible');
	  }

/*Adding and removing checks for finished selections and hiding all subsequent children for reset in 
case they are already showing from a previous selection.  */		 
  $(parRow).addClass('completed').nextAll('.long').removeClass('completed').slideUp('slow', function() {

/*Reset material selects, since we may have re-selected above it.  */		  
    $(nextSel).material_select('destroy');

/*Create load url 
(".txt" had to be added to api flies, as system was adding a slash 
to file names without extensions, making directories, which aren't allowed to be read.)*/	

    $(nextSel).load('api/dashboard/regions/' + nextSelType + regVal + resVal + selVal + '.txt', function() {
      $(nextSel).material_select();
      $(nextRow).slideDown('slow');
	  resVal=selVal='';
   });
   }); 
});



	
});//END DOC READY