var fs = require('fs');
var j =0;
let Arr1 =  new Array();
var uncount =0; //Entries Ignored
let countertotal= new Array(16);  //Counter array for total Thefts in corresponding year 
let counterone= new Array(16);	  //Counter array for Thefts more than $500 in corresponding year
let counterzero= new Array(16);	  //Counter array for Thefts less than $500 in corresponding year
let totaldata=0;				  //Counter array for total records parsed
let id=0;
for (j = 0; j<16; j++)				//Initializing Counter array
    {	countertotal[j]=0;
    	counterone[j]=0;
    	counterzero[j]=0;
    }
var instream = fs.createReadStream('../crimedata.csv');					//Starting Instream
var outstream = fs.createWriteStream('TheftDataTest.json');	//Starting Outstreams
/*var outstreamgraph = fs.createWriteStream('JSON/Theft/crimedatatheft-year-count-graph.json');
var badlines = fs.createWriteStream('JSON/Theft/badlineread.json');*/
var count = 0;
var corrupted=0;
var scavangedbrokenlines =0;
/*function datainputtheft(array, year) {
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
		outstream.write(JSON.stringify(final, null, 2),'UTF8')                             //FINAL :WRITE TO FILE : UNQUOTE
		count+=1
		console.log(final);																	//FINAL :WRITE TO CONSOLE : UNQUOTE																						
		}
}*/
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
			
			/*if((typeof year == 'undefined')||(!((year<2017)&&(year>2000))))	//Broken Line correction
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
						 					}else {corrupted+=1}
						 				}	
						 		}
						 		else
						 		{	corrupted+=1;}						 		
						 	}}}}
		else */if ((year>2000)&&(year<2017)) //For normal lines
			 {
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
		//outstream.write(JSON.stringify(final, null, 2),'UTF8')                             //FINAL :WRITE TO FILE : UNQUOTE
		count+=1
		Arr1.push(final)
		//console.log(final);
	}

			 }





			 //datainputtheft(array,year)
		})})
 		.on('end', function(){
 			/*var TOTALCOUNT=0;
 			var title = ["Total Count"+"Less than $500"+"More than $500"];
 			//outstreamgraph.write(title);
 			//outstreamgraph.write()
 			for(var k =0 ; k<16; k++)
 			{
 				title = [countertotal[k] +"    "+counterzero[k]+"    "+ counterone[k]];
 				console.log(title);
 				outstreamgraph.write(JSON.stringify(title, null, 2),'UTF8');
 				TOTALCOUNT+=countertotal[k];
 			}*/
 			outstream.write(JSON.stringify(Arr1, null, 2),'UTF8')
 			//outstream.write(Arr1.length)
 		})
 		
 			