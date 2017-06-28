// Ajax

$(document).ready(function() {	
//Search Results: Array the boxes of properties without a page refresh	
//Golbal variables
var cId, //Country code, e.g. 28 = Australia,
cCode, //Code letter for resort area, e.g. Q = Queensland
cName,//Country Name
cRegion, //Region, e.g. Queensland
lang = $('#languageListDD option:selected').val(),
loc = $('#destinationsPage #resultsListing'),
loc2 = $('#destinationsPage #lightboxWrapper'),
daeLoc = window.location,//Temporary because of staging site URL
daeURL = daeLoc.pathname.substring(0, daeLoc.pathname.lastIndexOf('/')); //Temporary because of staging site URL
	
$(loc2).add(loc).hide();

//FIRST, SELECT SOMETHING FROM THE SEARCH DROPDOWN
$('#searchSelect').change(function(){
  cId = $(this).val();
  cName = $('option:selected',this).text();
	
$('#searchOutput').html('');
$('#searchResultsBox').slideUp('slow');
$('#collectionsBlock').fadeOut('slow');
$(loc).fadeOut('slow');
$(loc2).fadeOut('slow');
	if (cId !="0") {//if you select a country, then go back to the default "Choose..." option box needs to hide
	$('#searchResultsBox').slideDown('slow');
		$.getJSON(daeURL + '/languages/'+lang+'/search.json', function(data) {     
					var doHTML = function(itemId,itemRegions) {
						  if(cId==itemId) {
								  var index = 0;
										$.each(itemRegions, function(index) {
										$('#searchOutput').append('<li><a href="' +this.code+ '"> '+this.area+'</a></li>');
												index++;
											});
							}
							
					}; 
			  $.each(data, function(i, item) {
				  doHTML(item.id,item.regions);
			  });
		});
	}
	else {
		$('#collectionsBlock').fadeIn('slow');
	}

  });


//NEXT BUILD CLICKBOXES FOR SEARCH RESULTS

//click on the results list links
$(document).on('click', '#searchOutput a', function(e){
	$('#searchOutput a').removeClass('selected');
	$(this).addClass('selected');//so selected link will persist
	
	e.preventDefault();//link should not go out to a new page
    cCode = $(this).attr('href'); //Got this value from the list link, e.g. "Q", for "Queensland"
	cRegion = $(this).text();
	var itemCount = 0,
	htmlCnt = '';//to store the iterated list
	$('#searchTabContent .title-bar').slideUp('slow');
   //Gracefully clear the old list
   $(loc2).fadeOut('slow'); //In case the search result link is hit instead of the back button
		
  $(loc).fadeOut('slow', function() {
	//Then switch out lists in the callback function		
		  $.getJSON(daeURL + '/languages/'+lang+'/areas.json', function(data) {
			//Build the result HTML
			
			var doHTML = function(itemResortID, itemImage, itemArea, itemExcerpt) {
			  htmlCnt += '<div class="click-box"><div><img src="' + itemImage + '"/></div><div><h3>' + itemArea + '</h3><p>'+itemExcerpt+'</p></div><span class="button medium ghost" data-resortid="' + itemResortID + '" title="'+itemArea+'">SELECT</span></div>';
			};
			//Iterate through the JSON data
			$.each(data, function(i, item) {
				//if it matches the select option value and the clicked area link...
				if (item.cid == cId && item.code == cCode) {
					//trim the excerpt to fit the box
					 if(item.excerpt.length > clipL){
						  //strip trailing period or space so all ellipses look the same, e.g. "word..."
						  if (item.excerpt[item.excerpt.length-1] === "." || item.excerpt[item.excerpt.length-1] === " ") {
    							item.excerpt = item.excerpt.slice(0,-1);
		  					}
						  
						  item.excerpt += '&#8230;'; //add "..." g
						  
						  
						}
						
				//Run it		
				  doHTML(item.ResortID, item.image, item.area, item.excerpt);
				}
				
				//Assemble the grid
  				$(loc).html('<div class="row grid-holder"><h2 class="c row sr-grid">'+ cName + ' - ' + cRegion +'</h2><div class="row sr-grid">' + htmlCnt + '</div></div>');
			}); //end $.each
			
		 
		 
	 });
		  
		  
		  
  //Ease in the new search results boxes
  
    $(loc).fadeIn('slow').delay(1000);
	
	});

});

	
	
//BUILD LIGHTBOX FOR THE RESORT AREA CHOSEN FROM THE RESULTS BOXES

//Bind to document, since it wasn't originally in the DOM
$(document).on('click', '#resultsListing .click-box', function(e){

	var resortID = $('.button',this).data('resortid'), 
	itemCount = 0;
   //Gracefully clear the old content
   
   $(loc).fadeOut('slow', function() {
	  
	  
	//Build the lightbox in the callback function	
		  $.getJSON(daeURL + '/languages/'+lang+'/areas.json', function(data) {
			//Build the result HTML
			var doHTMLDest = function(itemArea, itemAvail, itemText, itemResorts, itemImgs) {
				
   				
				
				$('#lightboxTitle h3', loc2).text(itemArea);
				$('#lightboxTitle .button',loc2).attr('href',itemAvail);
				$('#imageBox > div',loc2).html('');
				$('#imageBox > div',loc2).append(itemResorts[0].image);
				var thumbs = $('#imageBox .thumbs',loc2);
				$(thumbs).html('');
				var index = 0;
					$.each(itemResorts, function(index) {
						$(this.image).appendTo(thumbs).wrap('<li>');
							index++;
						});
				
					
				$('#lightboxText',loc2).html('').html(itemText).prepend('<h4>Destination Overview</h4>');
					
					$('#lightboxImgs',loc2).html('').append('<ul id="lbImg" />');
					var lbImg = $('#lightboxImgs #lbImg',loc2);
					index2 = 0;
					$.each(itemImgs, function(index2) {
							  $(this.image).appendTo(lbImg).wrap('<li>');
							index2++;
						});	
			
			}; //end doHTMLDest
			$.each(data, function(i, item) {
				if (item.ResortID == resortID) {
				  doHTMLDest(item.area, item.availability, item.text, item.resorts, item.imgs);
				
				};
    });
			
			
		  });
		  
		  
		  
  //Ease in the new list
  		$(loc2).fadeIn('slow',function(){
		doExcerpt();
		doSlide1();
		});
		$('#searchTabContent .title-bar').slideDown('slow');
	});
});
//SEARCH DETAIL

$('#searchTabContent .icon-back').on('click', function(){
		$(loc2).fadeOut('slow').hide();
		$(loc).fadeIn('slow');
		$('#searchTabContent .title-bar').slideUp('slow');
		
});

});
