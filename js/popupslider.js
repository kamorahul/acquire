var $card = $('.popupcard');
var lastCard = $(".card-list .popupcard").length - 1;

$('.slidenext').click(function(){ 
	var prependList = function() {
		if( $('.popupcard').hasClass('activeNow') ) {
			var $slicedCard = $('.popupcard').slice(lastCard).removeClass('transformThis activeNow');
			$('ul.card-list').prepend($slicedCard);
		}
	}
	$('.card-list li.popupcard').last().removeClass('transformPrev').addClass('transformThis').prev().addClass('activeNow');
	setTimeout(function(){prependList(); }, 250);
});

$('.slideprev').click(function() {
	var appendToList = function() {
		if( $('.popupcard').hasClass('activeNow') ) {
			var $slicedCard = $('.popupcard').slice(0, 1).addClass('transformPrev');
			$('.card-list').append($slicedCard);
			$('.popupcard').removeClass('activeNow');
			
		}}
	
			$('.card-list li.popupcard').removeClass('transformPrev').last().addClass('activeNow').prevAll().removeClass('activeNow');
	setTimeout(function(){appendToList();}, 250);
});