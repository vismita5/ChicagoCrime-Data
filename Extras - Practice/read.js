/*For Simple CSV File*/

var fs = require('fs'); //load fs

var people = [];
var fileContents = fs.readFileSync('crimedata10.csv');
var lines = fileContents.toString().split('\n');

for (var i = 0; i < lines.length; i++) {
	people.push(lines[i].toString().split(','));
}

for (var i = 0; i < lines.length; i++) {
	for (var j = 0; j < 15; j++) {
		console.log(people[i][j]);
	}
	console.log('\n');
}




for(var i=0; i<lines.length; i++)
{
	for (var j=0; j<10; j++)
	{
		if(people[i][17]=='2008')
		{
			console.log(people[i][j]);

		}	
	}
		
	console.log('\n');

}
