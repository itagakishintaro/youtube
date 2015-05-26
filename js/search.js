'use strict'

// https://developers.google.com/youtube/v3/docs/search/list?hl=ja
var KEY = 'AIzaSyAZAnCPdvCeig9K0NZ07986wqlSQjy3Kr4';
var SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
var FEEDS_URL = 'http://gdata.youtube.com/feeds/api/videos/';

var search_data = {
	key: KEY,
	part: 'snippet',
	type: 'video',
	maxResults: 50
}

loadIframePlayerAPI();

$('#search').on('click', function(){
	// $('#player').append('<iframe id="ytplayer" type="text/html" width="480" height="270" src="" frameborder="0" allowfullscreen>');
	
	$('#result').empty();
	search_data.q = $('#query').val();
	$.getJSON(SEARCH_URL, search_data, function(json){
		console.log(json);
		json.items.forEach(function(v){
			var id = v.id.videoId
			$('#result').append('<div id="' + id + '"></div>');
			$('#' + id).append('<span class="title">' + v.snippet.title + '</span>');
			var func = "changeVideo('" + id + "')";
			$('#' + id).append('<button onclick=' + func + '>SEE</button>');
			$('#' + id).append('<div class="comments"></div>');
		});

		setVideo( $('#result > div').attr('id') );
	});
});

$('#feed').on('click', function(){
	$.each($('#result > div'), function(i, v){
		setTimeout(function(){
			var id = $(v).attr('id');
			$.ajax({
				url: FEEDS_URL + id + '/comments',
				type: 'GET',
				dataType: 'xml',
				success: function(xml){
					$(xml).find('feed').find('entry').each(function(i, v){
						$('#' + id + ' > .comments').append( '<div>' + $(v).find('content').text() + '</div>' );
					});
				}
			});
		}, 500);
	});
});

function changeVideo(id){
	setVideo(id);
	currentIndex = $('#' + id).prevAll().length + 1;
}

// https://developers.google.com/youtube/iframe_api_reference?hl=ja
var player;
var options = {
    height: '270',
    width: '480',
    // videoId: 'M7lc1UVf-VE',
    events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
    }
};
var currentIndex = 1;

function loadIframePlayerAPI() {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
    // player = new YT.Player('player', options);
}

function setVideo(id){
	$('#player').remove();
	$('#frame').append('<div id="player"></div>');
	options.videoId = id;
    player = new YT.Player('player', options);
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
    	currentIndex += 1;
        setVideo( $('#result > div:nth-child(' +  currentIndex + ')' ).attr('id') );
    }
}

function stopVideo() {
    player.stopVideo();
}
