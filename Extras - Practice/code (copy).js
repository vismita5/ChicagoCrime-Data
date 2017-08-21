const fs = require('fs');
const readline = require('readline');
let dataa;
var instream = fs.createReadStream('crimedata500.csv');
var outstream = fs.createWriteStream('crimedata500.json');
//var lines = instream.toString().split('\n');
var data;
instream.setEncoding('UTF8');
instream.on('data', function(chunk){
	//let data;
	let newLdata;
	let newCdata;
	let reducedata;
	data +=chunk;
	newLdata = data.toString().trim().split('\n');
	dataa = newLdata;
	newCdata = newLdata.toString().split(',');
	//reducedata = newCdata.reduce();
	//console.log(newCdata);
	//outstream.write(JSON.stringify(newCdata,null,2),'UTF8');
	
	
});
const rl = readline.createInterface({
  input: fs.createReadStream('crimedata500.csv')
});

rl.on('line', (line) => {
	let lines = line.toString().trim().split('\n');
  console.log(`Line from file: ${lines}`);
  outstream.write(JSON.stringify(lines,null,2),'UTF8');
});
//outstream.write(data, 'UTF8');

instream.on('error', function(err) {
    console.log(err);
  });
/*instream.on('end', function(){
	console.log(data);
});
*/

/*for (var i = 0; i < lines.length; i++) {
	people.push(lines[i].toString().split(','));
}

for (var i = 0; i < lines.length; i++) {
	for (var j = 0; j < 15; j++) {
		console.log(people[i][j]);
	}
	console.log('\n');
}*/
