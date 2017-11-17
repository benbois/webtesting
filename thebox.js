/*
 * source: http://thebox.maxvoltar.com/assets/js/master.js
 */

$(function() {
	$("body").addClass("listen");
	$("#nav-listen a").click(showListen);
	$("#nav-archive a").click(showArchive);
	$("#nav-info a").click(showInfo);
	$("#nav-rss a[href='#rss']").click(toggleRSS);
	initAudio();
	addPopupLink();
	$("a.popup").popupWindow({height:150, width:400});
});

function showListen() {
	$("body").removeClass("archive");
	$("body").removeClass("info");
	$("body").addClass("listen");
	return false;
}

function showArchive() {
	$("body").removeClass("listen");
	$("body").removeClass("info");
	$("body").addClass("archive");
	return false;
}

function showInfo() {
	$("body").removeClass("listen");
	$("body").removeClass("archive");
	$("body").addClass("info");
	return false;
}

function toggleRSS() {
	$("#nav-rss").toggleClass("open");
	return false;
}

function addPopupLink() {
	var episodeID = $('body')[0].id;
	$(".default .player").append("<a class='popup' href='http://thebox.maxvoltar.com/" + episodeID + "?audio'>Popup</a>");
}

function initAudio() {
	
	var supportsAudio = !!document.createElement('audio').canPlayType,
			audio,
			loadingIndicator,
			positionIndicator,
			timeleft,
			loaded = false,
			manualSeek = false;

	if (supportsAudio) {
		
		var episodeTitle = $('body')[0].id;
		
		var player = '<p class="player">\
									  <span id="playtoggle" />\
									  <span id="gutter">\
									    <span id="loading" />\
									    <span id="handle" class="ui-slider-handle" />\
									  </span>\
									  <span id="timeleft" />\
									  <audio preload="metadata">\
									    <source src="http://maxvoltar.s3.amazonaws.com/thebox/' + episodeTitle + '.ogg" type="audio/ogg"></source>\
											<source src="http://maxvoltar.s3.amazonaws.com/thebox/' + episodeTitle + '.mp3" type="audio/mpeg"></source>\
												<source src="http://maxvoltar.s3.amazonaws.com/thebox/' + episodeTitle + '.wav" type="audio/x-wav"></source>\
										</audio>\
									</p>';									
		
		$(player).insertAfter("#listen .photo");
		
		audio = $('.player audio').get(0);
		loadingIndicator = $('.player #loading');
		positionIndicator = $('.player #handle');
		timeleft = $('.player #timeleft');
		
		if ((audio.buffered != undefined) && (audio.buffered.length != 0)) {
			$(audio).bind('progress', function() {
				var loaded = parseInt(((audio.buffered.end(0) / audio.duration) * 100), 10);
				loadingIndicator.css({width: loaded + '%'});
			});
		}
		else {
			loadingIndicator.remove();
		}
		
		$(audio).bind('timeupdate', function() {
			
			var rem = parseInt(audio.duration - audio.currentTime, 10),
					pos = (audio.currentTime / audio.duration) * 100,
					mins = Math.floor(rem/60,10),
					secs = rem - mins*60;
			
			timeleft.text('-' + mins + ':' + (secs < 10 ? '0' + secs : secs));
			if (!manualSeek) { positionIndicator.css({left: pos + '%'}); }
			if (!loaded) {
				loaded = true;
				
				$('.player #gutter').slider({
						value: 0,
						step: 0.01,
						orientation: "horizontal",
						range: "min",
						max: audio.duration,
						animate: true,					
						slide: function(){							
							manualSeek = true;
						},
						stop:function(e,ui){
							manualSeek = false;					
							audio.currentTime = ui.value;
						}
					});
			}
			
		}).bind('play',function(){
			$("#playtoggle").addClass('playing');		
		}).bind('pause ended', function() {
			$("#playtoggle").removeClass('playing');		
		});		
		
		$("#playtoggle").click(function() {			
			if (audio.paused) {	audio.play();	} 
			else { audio.pause(); }			
		});

	}
	
	
}
