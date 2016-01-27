//sharp.dimens.io
var sharp = require('sharp');
var fs = require('fs');
var del = require('del');

//command line params
var image_path = process.argv[2];
var tile_size = process.argv[3] || 256;

//Globals
var num_zoom_levels, ratio;
var zoom_levels = {};
var image = sharp(image_path);

//Clear tiles folder
del.sync(['tiles/*.jpg']);

generateTiles();

function generateTiles(){

	image.metadata(function(err, metadata){

		if (err)
			console.log(err);

		console.log('tile size: ' + tile_size);
		console.log('width: ' + metadata.width + ' height: ' + metadata.height);

		ratio = Math.round(metadata.width / metadata.height);
		num_zoom_levels = getNumZoomLevels(metadata);

		for (var zoom=0; zoom<num_zoom_levels; zoom++)
			generateTilesForZoom(zoom);

	});

}

/*  Determines how many zoom levels to use
 *  based on the size of the image
 */
 function getNumZoomLevels(metadata){
 	var short_dimension = (metadata.width > metadata.height) ? metadata.height : metadata.width;
 	return Math.log2(short_dimension) - Math.log2(tile_size) + 1;
 }

/*  Given a zoom level, generates and writes
 *	all tiles
 */
 function generateTilesForZoom(zoom){

 	var data = getScaledImage(zoom);
 	if (data === null)
 		return;

 	var scaled_image = data.image;

 	console.log(data.width + 'x' + data.height);

 	for (var row=0; row<data.height; row+=tile_size){
 		for (var col=0; col<data.width; col+=tile_size){

			scaled_image.extract({left: col, top: row, width: tile_size, height: tile_size})
			.toFile('./tiles/' + zoom + '-'+ row / tile_size + '-' + col / tile_size +'.jpg' , function(err){

				if (err)
					console.log(err);
				else{
					zoom_levels[zoom.toString()] = {'rows': row / tile_size, 'cols': col / tile_size};
					fs.writeFileSync('./zoom_levels.json', JSON.stringify(zoom_levels), 'utf-8');
				}

			});
		}
	}
}

/*  Given a zoom level, returns a scaled
 *	instance of the image, along with size
 */
 function getScaledImage(zoom){
 	var data = {};
 	
 	data.width = ratio*tile_size*Math.pow(2,zoom);
 	data.height = tile_size*Math.pow(2,zoom);

 	if (data.width > 16383 || data.height > 16383)
 		return null;

 	data.image = (zoom==num_zoom_levels-1) ? 
 	image.clone() 
 	: image
 	.clone()
 	.resize(
 		roundToTileSize(data.width), 
 		roundToTileSize(data.height)
 		);

 	return data;
 }

/*  Given a number, rounds it to the
 *  nearest multiple of tile size
 */ 
 function roundToTileSize(num){
 	return tile_size*(Math.round(num/tile_size));
 }
