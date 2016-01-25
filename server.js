var express = require('express');
var fs = require('fs');
var app = express();

app.use(express.static('public'));
app.use('/tiles', express.static('tiles'));

app.get('/tile', function (req, res){
	var img = fs.readFileSync('tiles/'+req.query.zoom+'-'+req.query.row+'-'+req.query.col+'.jpg');
	res.writeHead(200, {'Content-Type': 'image/jpg' });
	res.end(img, 'binary');
});

app.get('/zoom-levels', function(req, res){
	var levels = fs.readFileSync('zoom_levels.json');
	res.setHeader('Content-Type', 'application/json');
	res.end(levels);
});

app.listen(3000, function () {
	console.log('Listening on port 3000!');
});