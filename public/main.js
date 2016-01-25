var baseurl = 'http://104.131.136.57:3000';
var zoom_levels = {};

$.getJSON(baseurl + '/zoom-levels', function(data){
	zoom_levels = data;
	var zoom_levels_string = JSON.stringify(zoom_levels)
	.replace(/[{}":]/g, '')
	.replace(/,cols/g,'x')
	.replace(/rows/g, ':')
	.replace(/,/g, '\n');

	var zoom_values = [];
	for (var zoom in zoom_levels)
		zoom_values.push(zoom);
	
	var min_zoom = zoom_values[0];
	var max_zoom = zoom_values[zoom_values.length - 1];

	$('#zoom').attr('min', min_zoom);
	$('#zoom').attr('max', max_zoom);

	$('#zoom_levels').append('<p>' + zoom_levels_string + '</p>');

	$('label').addClass('active');

	var map = L.map('map').setView([0, 0], 0);

	L.tileLayer(baseurl + '/tiles/{z}-{y}-{x}.jpg', {
		continuousWorld: true,
		minZoom: min_zoom,
		maxZoom: max_zoom,
	}).addTo(map);

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