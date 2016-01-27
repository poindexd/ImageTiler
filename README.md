# ImageTiler
### Break large images into tiles and serve them using Node/Express

## Installation
    npm install
    
### Prerequisites
- C++11 compatible compiler such as gcc 4.6+ (Node v4+ requires gcc 4.8+), clang 3.0+ or MSVC 2013
- [node-gyp](https://github.com/TooTallNate/node-gyp#installation)

## Usage
### Create Tiles
    node create_tiles <image path> <tile size>

### Start Server
    node server
    
### tilestitcher.js
    var stitcher = new TileStitcher(element_id, baseurl, zoom_levels, tile_size);

## Endpoints
Server runs on port 3000
- / (demo page)
- /tile?zoom=z&row=r&col=c (tile jpg)
- /zoom-levels (json)
  
