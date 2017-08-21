var fs = require('fs');


var array ;
var instream = fs.createReadStream('crimedata500.csv');
var outstream = fs.createWriteStream('crimedata500.json');
//var lines = instream.toString().split('\n');

instream.setEncoding('UTF8');
instream.on('data', function(chunk){
	let data = '';
	data +=chunk;

	data.trim()
		.split('\n')
		.map(line => line.split('\t'))
		.map(line => {
			console.log(line[0].split(',')[0])
		})

	//console.log(line[0]);

		
	
	
});


