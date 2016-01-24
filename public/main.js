var baseurl = 'http://104.131.136.57:3000';
var map = L.map('map').setView([0, 0], 1);

L.tileLayer(baseurl + '/tiles/{z}-{y}-{x}.jpg', {
	minZoom: 1,
	maxZoom: 4,
}).addTo(map);

$(":input").bind('keyup mouseup', function () {
	$('#tile_preview').attr('src', baseurl + '/tile?zoom=' + $('#zoom').val() + '&row=' + $('#row').val() + '&col=' + $('#col').val());
});