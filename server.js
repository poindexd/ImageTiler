var express = require('express');
var fs = require('fs');
var app = express();

app.use(express.static('public'));
app.use('/tiles', express.static('tiles'));

app.get('/tile', function (req, res) {
	var row = req.query.row;
	var col = req.query.col;
	var zoom = req.query.zoom;

	var img = fs.readFileSync('tiles/'+zoom+'-'+row+'-'+col+'.jpg');
	res.writeHead(200, {'Content-Type': 'image/jpg' });
	res.end(img, 'binary');
});

app.get('zoom-levels', function(req, res){
	//var files = fs.readdirSync('/tiles');
	//for (int i=0; i<files.length; i++)

	var levels = require('zoom-levels.json');
    res.json(levels);
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});