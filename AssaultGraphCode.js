var fs = require('fs');
var array ;
let final;
let year;
let id=0;
var instream = fs.createReadStream('../crimedata.csv');
var outstream = fs.createWriteStream('crimedataassault.json');
//var lines = instream.toString().split('\n');

instream.setEncoding('UTF8');
instream.on('data', function(chunk){
	let data = '';
	data +=chunk;

	data.trim()
		.split('\n')
		.map(line => line.split('\t'))
		.map(line => {
			//console.log(line[0].split(',')[0])
			array = line[0].split(',')
			year = array.length -6;
			if(array[5]=="ASSAULT")
			{	
				if((array[8]=="false"))
					final = {"ID":array[id], "YEAR" :array[year] , "ARREST": 0 } ;
				else
					final = {"ID":array[id], "YEAR" :array[year] , "ARREST": 1 } ;

				outstream.write(JSON.stringify(final, null, 2),'UTF8')

				console.log(final);
			}

		})

	//console.log(line[0]);h

		
	
	
});


