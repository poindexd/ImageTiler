var baseurl = 'http://104.131.136.57:3000';
var zoom_levels = {};

$.getJSON(baseurl + '/zoom-levels', function(data){
	zoom_levels = data;
	var zoom_levels_string = JSON.stringify(zoom_levels)
	.replace(/[{}":]/g, '')
	.replace(/,cols/g,'x')
	.replace(/rows/g, ':')
	.replace(/,/g, '\n');

 	var min_zoom = 100;
 	var max_zoom = 0;
 	for (var zoom in zoom_levels){
 		min_zoom = Math.min(zoom, min_zoom);
 		max_zoom = Math.max(zoom, max_zoom);
 	}

	$('#zoom').attr('min', min_zoom);
	$('#zoom').attr('max', max_zoom);

	$('#zoom_levels').append('<p>' + zoom_levels_string + '</p>');

	$('label').addClass('active');

	//Use this code for the Leafletjs version of tile stitcher
	/*
	var map = L.map('map').setView([Math.round(zoom_levels[0].cols/2), Math.round(zoom_levels[0].rows/2)], 0);

	L.tileLayer(baseurl + '/tiles/{z}-{y}-{x}.jpg', {
		continuousWorld: true,
		minZoom: min_zoom,
		maxZoom: max_zoom,
	}).addTo(map);
	*/

	$.getJSON(baseurl + '/zoom-levels', function(data){
		var stitcher = new TileStitcher('map', baseurl, data, 256);
		stitcher.init();
	});

	updatePreview();
});


$(":input").bind('keyup mouseup', function () {
	updatePreview();
});

function updatePreview(){
	var zoom = $('#zoom').val();

	var row_max = zoom_levels[zoom].rows - 1;
	var col_max = zoom_levels[zoom].cols - 1;

	row = Math.min($('#row').val(), row_max);
	col = Math.min($('#col').val(), col_max);

	$('#row').val(row).attr('max', row_max);
	$('#col').val(col).attr('max', col_max);

	$('#tile_preview').attr('src', baseurl + '/tile?zoom=' + zoom + '&row=' + row + '&col=' + col);
}