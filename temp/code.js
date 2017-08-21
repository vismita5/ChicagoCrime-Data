var fs = require('fs');


var array ;
let final;
var instream = fs.createReadStream('crimedata500.csv');
var outstream = fs.createWriteStream('crimedatatheft500.json');
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
			if(array[5]=="THEFT")
			{	
				if((array[6]=="$500 AND UNDER")||(array[6]=="FINANCIAL ID THEFT:$300 &UNDER")||(array[6]=="PURSE-SNATCHING")||(array[6]=="POCKET-PICKING")||(array[6]=="ATTEMPT THEFT")||(array[6]=="FROM BUILDING")||(array[6]=="RETAIL THEFT"))
					final = (array[0]  + " " + array[array.length -6] + " 0" );
				else
					final = (array[0]  + " " + array[array.length -6] + " 1" );

				outstream.write(JSON.stringify(final, null, 2),'UTF8')
				console.log(final);
			}

		})

	//console.log(line[0]);

		
	
	
});


