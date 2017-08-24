var fs = require('fs');
let countertotaltheft= new Array(16);  //Counter array for total Thefts in corresponding year 
let counteronetheft= new Array(16);	  //Counter array for Thefts more than $500 in corresponding year
let counterzerotheft= new Array(16);	  //Counter array for Thefts less than $500 in corresponding year
let countertotalassault= new Array(16);  
let counteroneassault= new Array(16);	  
let counterzeroassault= new Array(16);	
let totaldata=0;				  //Counter array for total records parsed
for (var j = 0; j<16; j++)				//Initializing Counter array
    {	countertotaltheft[j]=0;
    	counteronetheft[j]=0;
    	counterzerotheft[j]=0;
    	countertotalassault[j]=0;
    	counteroneassault[j]=0;
    	counterzeroassault[j]=0;
    }
var instream = fs.createReadStream('crimedata.csv');					//Starting Instream
var outstreamtheft = fs.createWriteStream('JSON/Theft/crimedatatheft-year-count.json');	//Starting Outstreams
var outstreamgraphtheft = fs.createWriteStream('JSON/Theft/crimedatatheft-year-count-graph.json');
var outstreamassault = fs.createWriteStream('JSON/Assault/crimedataassault-year-count.json');	//Starting Outstreams
var outstreamgraphassault = fs.createWriteStream('JSON/Assault/crimedataassault-year-count-graph.json');
var badlines = fs.createWriteStream('JSON/badlineread.json');
var corrupted=0;
var scavangedbrokenlines =0;
function datainputtheft(array, year) {
    if(array[5]=="THEFT"){	
    	if((array[6]=="$500 AND UNDER")||(array[6]=="FINANCIAL ID THEFT:$300 &UNDER")||(array[6]=="PURSE-SNATCHING")||(array[6]=="POCKET-PICKING")||(array[6]=="ATTEMPT THEFT")||(array[6]=="FROM BUILDING")||(array[6]=="RETAIL THEFT"))
    	{	
    		var final = {"ID":array[0], "YEAR" :year , "ABOVE500": 0 } ;
    		counterzerotheft[year-2001] += 1;
    	}
    	else
    	{	
    		var final = {"ID":array[0], "YEAR" :year , "ABOVE500": 1 } ;
    		counteronetheft[year-2001] += 1;
    	}
    	countertotaltheft[year-2001] += 1;
		outstreamtheft.write(JSON.stringify(final, null, 2),'UTF8')                             //FINAL :WRITE TO FILE : UNQUOTE
		console.log(final);																	//FINAL :WRITE TO CONSOLE : UNQUOTE																						
		}
}
function datainputassault(array, year) {
if(array[5]=="ASSAULT")
			{	
				if((array[8]=="false"))
					{
						final = {"ID":array[0], "YEAR" :year , "ARREST": 0 } ;
						counterzeroassault[year-2001] += 1;
					}
				else
					{
						final = {"ID":array[0], "YEAR" :year , "ARREST": 1 } ;
						counteroneassault[year-2001] += 1;
					}
				outstreamassault.write(JSON.stringify(final, null, 2),'UTF8')
				countertotalassault[year-2001] += 1;
				console.log(final);
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
			
			if((typeof year == 'undefined')||(!((year<2017)&&(year>2000))))	//Broken Line correction
			{	var i
				for(i =0; i<5; i++){
					yearcol+=1;
					year = parseInt(array[yearcol])
					if((year<2017)&&(year>2000)){break;}
				}
				if(!((year<2017)&&(year>2000))){
						for(i =(array.length - 5); i>0; i--){
								yearcol-=1;
								year = parseInt(array[yearcol])
								if((year<2017)&&(year>2000)){break;}
							}
						if(!((year<2017)&&(year>2000)))
						 	{badlines.write(JSON.stringify([line]));
						 	if(array.length>4)
						 	{	var tsc = array[2]							//Year Extraction
						 		var arraytsc = tsc.split(" ")
						 		if(typeof arraytsc[2] !== 'undefined')
						 		{
						 				var arraydate = arraytsc[0].split("/")
						 				year = arraydate[2]
						 				//For THEFT
						 				{
						 					if((typeof array[5] !== 'undefined')&&(typeof array[6] !== 'undefined'))
						 					{	
						 						datainputtheft(array,year) 
						 						datainputassault(array,year)
						 					}else {corrupted+=1}
						 				}	
						 		}
						 		else
						 		{	corrupted+=1;}						 		
						 	}}
						 }}
		else if ((year>2000)&&(year<2017)) //For normal lines
			 datainputtheft(array,year)
			datainputassault(array,year)
		})})
 		.on('end', function(){
 			var Thefttotal=0;
 			var Assaulttotal=0;
 			var title = ["Total Count"+"Year"+"Above500"];
 			outstreamgraphtheft.write(JSON.stringify(title, null, 2),'UTF8');
 			var title = ["Total Count"+"Year"+"Assault"];
 			outstreamgraphassault.write(JSON.stringify(title, null, 2),'UTF8');
 			//outstreamgraphtheft.write(title);
 			//outstreamgraphtheft.write()
 			for(var k =0 ; k<16; k++)
 			{
 				title = [countertotaltheft[k] +"    "+counterzerotheft[k]+"    "+ counteronetheft[k]];
 				console.log(title);
 				outstreamgraphtheft.write(JSON.stringify(title, null, 2),'UTF8');
 				title = [countertotalassault[k] +"    "+counterzeroassault[k]+"    "+ counteroneassault[k]];
 				console.log(title);
 				outstreamgraphassault.write(JSON.stringify(title, null, 2),'UTF8');
 				Thefttotal+=countertotaltheft[k];
 				Assaulttotal+=countertotalassault[k];
 			}
 			console.log(Thefttotal+Assaulttotal);
 		})
 		
