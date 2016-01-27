/* tilestitcher.js
 * Stitches tiles together in the browser
 *
 * TODO: remove jQuery dependency
 * TODO: allow templated tile url
 * TODO: add zoom ui controls
 */

 function TileStitcher(id, baseurl, zoom_levels, tilesize){

	this.init = function(){
		var parent = document.getElementById(id);

		var canvas = document.createElement('canvas');
		canvas.style.background = '#455a64';
		canvas.style.cursor = 'move';
		canvas.height = 512;
		canvas.width = 1024;
		parent.appendChild(canvas);

		this.ctx = canvas.getContext("2d");
		this.tile_size = tilesize || 256;

		this.min_zoom = 100;
		this.max_zoom = 0;
		for (var zoom in zoom_levels){
			this.min_zoom = Math.min(zoom, this.min_zoom);
			this.max_zoom = Math.max(zoom, this.max_zoom);
		}

		this.zoom = 0;
		this.x = 0;
		this.y = 0;
		this.width = canvas.width;
		this.height = canvas.height;
		this.canvas = canvas;

		this.bindListeners();
		this.draw();
	}

	this.draw = function(){

		var top_left = this.getTileIndex(-this.x, -this.y);
		var bottom_right = this.getTileIndex(-this.x + this.width, -this.y + this.height);

		//Clear left, top, right, bottom of canvas
		this.ctx.clearRect(0, 0, this.x, this.height);
		this.ctx.clearRect(0, 0, this.width, this.y);
		this.ctx.clearRect(this.getImageWidth(), 0, this.getImageWidth(), this.height);
		this.ctx.clearRect(0, this.getImageHeight(), this.width, this.getImageHeight());

		for (var row = top_left.row; row <= bottom_right.row; row++){
			for (var col = top_left.col; col <= bottom_right.col; col++){
				if (this.isValidTile(row, col)){
					this.drawTile(row, col);
				}
			}
		}	
	}

	this.isValidTile = function (row, col){
		return row >= 0 && row < zoom_levels[this.zoom].rows 
			&& col >= 0 && col < zoom_levels[this.zoom].cols;
	}

	this.getImageWidth = function(){
		return this.x+this.tile_size*zoom_levels[this.zoom].cols;
	}

	this.getImageHeight = function(){
		return this.y+this.tile_size*zoom_levels[this.zoom].rows;
	}

	this.drawTile = function(row, col){

		//var cached_tile = localStorage.getItem(this.getLookupString(this.zoom, row, col));

		//if (cached_tile){
			//this.ctx.drawImage(cached_tile, this.x+this.tile_size*col, this.y+this.tile_size*row, this.tile_size, this.tile_size)
		//} else {
			var img = new Image();
			var self = this;
			img.onload = function(){
				self.ctx.drawImage(img, self.x+self.tile_size*col, self.y+self.tile_size*row, self.tile_size, self.tile_size)
			}
			img.src = baseurl+'/tiles/' + this.getLookupString(this.zoom, row, col) + '.jpg';
			//localStorage.setItem(this.getLookupString(this.zoom, row, col), img);
		//}
	}

	this.getTileIndex = function(x, y){
		return {
			col: Math.floor(x/this.tile_size),
			row: Math.floor(y/this.tile_size)
		};
	}

	this.getLookupString = function (zoom, row, col){
		return zoom + '-' + row + '-' + col;
	}

	this.bindListeners = function(){

		var self = this;

		self.dragging = false;

		$(this.canvas)
		.mousedown(function(e){
			self.dragging = true;
			self.startX = e.clientX;
			self.startY = e.clientY;
		})
		.mousemove(function(e){
			if (self.dragging){
				self.x+= e.clientX - self.startX;
				self.y+= e.clientY - self.startY;
				self.startX = e.clientX;
				self.startY = e.clientY;
				self.draw();
			}
		})
		.mouseup(function(e){
			self.dragging = false;
		})
		.bind('mousewheel DOMMouseScroll', function(e){

			var prev_zoom = self.zoom;

			if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0)
				self.zoom = Math.min(++self.zoom, self.max_zoom);
			else 
				self.zoom = Math.max(--self.zoom, self.min_zoom);

			var dz = self.zoom-prev_zoom;

			//zoom in
			if (dz > 0){
				self.x = 2*self.x - e.clientX + self.canvas.offsetLeft;
				self.y = 2*self.y - e.clientY + self.canvas.offsetTop;
			} else if (dz < 0){
				self.x = Math.round(0.5*(self.x + e.clientX - self.canvas.offsetLeft));
				self.y = Math.round(0.5*(self.y + e.clientY - self.canvas.offsetTop));
			}


			self.draw();
		});
	}
}