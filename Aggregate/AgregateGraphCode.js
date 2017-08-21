var fs = require('fs');


var array ;
let final;
let year;
let id=0;
var instream = fs.createReadStream('../crimedata500.csv');
var outstream = fs.createWriteStream('crimedataaggregate500.json');
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
					final = (array[id]  + " " + array[year] + " 0\n" );
				else
					final = (array[id]  + " " + array[year] + " 1\n" );

				outstream.write(JSON.stringify(final, null, 2),'UTF8')

				console.log(final);
			}

		})

	//console.log(line[0]);

		
	
	
});


