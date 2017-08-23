var fs = require('fs');
var j =0;
var uncount =0; //Entries Ignored
let countertotal= new Array(16);  //Counter array for total Thefts in corresponding year 
let counterone= new Array(16);	  //Counter array for Thefts more than $500 in corresponding year
let counterzero= new Array(16);	  //Counter array for Thefts less than $500 in corresponding year
let totaldata=0;				  //Counter array for total records parsed
let crimearray = new Array();
let id=0;
for (j = 0; j<16; j++)				//Initializing Counter array
    {	countertotal[j]=0;
    	counterone[j]=0;
    	counterzero[j]=0;
    }
var instream = fs.createReadStream('crimedata500.csv');					//Starting Instream
var outstream = fs.createWriteStream('crimedatatheft-year-count.json');	//Starting Outstreams
var count = 0;
var corrupted=0;
var scavangedbrokenlines =0;
function datainputtheft(array, year) {
    if(array[5]=="THEFT"){	
    	if((array[6]=="$500 AND UNDER")||(array[6]=="FINANCIAL ID THEFT:$300 &UNDER")||(array[6]=="PURSE-SNATCHING")||(array[6]=="POCKET-PICKING")||(array[6]=="ATTEMPT THEFT")||(array[6]=="FROM BUILDING")||(array[6]=="RETAIL THEFT"))
    	{	
    		var final = {"ID":array[0], "YEAR" :year , "ABOVE500": 0 } ;
    		counterzero[year-2001] += 1;
    	}
    	else
    	{	
    		var final = {"ID":array[0], "YEAR" :year , "ABOVE500": 1 } ;
    		counterone[year-2001] += 1;
    	}
    	countertotal[year-2001] += 1;
    	crimearray.push(final);
    	outstream.write(JSON.stringify(crimearray, null, 2),'UTF8')
		//outstream.write(JSON.stringify(final, null, 2),'UTF8')                             //FINAL :WRITE TO FILE : UNQUOTE
		count+=1
		//console.log(final);																	//FINAL :WRITE TO CONSOLE : UNQUOTE																						
		}
}
instream.setEncoding('UTF8');			//Setting encoding
instream.on('data', function(chunk){
	let data = '';
	data +=chunk;
	data.trim()
		.split('\n') 					//Splitting data line by line
		.map(line => line.split('\t'))  //Splitting data by tab
		.map(line => {
			let array = line[0].split(','); //Splitting columns
			var yearcol = array.length -6;
			var year = parseInt(array[yearcol])
			totaldata+=1
			
		if ((year>2000)&&(year<2017)) //For normal lines
			 datainputtheft(array,year)
		})})
 		.on('end', function(){
 			var TOTALCOUNT=0;
 			var title = ["Total Count"+"Less than $500"+"More than $500"];
 			//outstreamgraph.write(title);
 			//outstreamgraph.write()
 			for(var k =0 ; k<16; k++)
 			{
 				title = [countertotal[k] +"    "+counterzero[k]+"    "+ counterone[k]];
 				console.log(title);
 				TOTALCOUNT+=countertotal[k];
 			}
 		console.log(crimearray)
 		}
 			)
 		