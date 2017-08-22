var fs = require('fs');
let countertotaltheft= new Array(16);  //Counter array for total Thefts in corresponding year 
let counteronetheft= new Array(16);	  //Counter array for Thefts more than $500 in corresponding year
let counterzerotheft= new Array(16);	  //Counter array for Thefts less than $500 in corresponding year
let countertotalassault= new Array(16);  
let counteroneassault= new Array(16);	  
let counterzeroassault= new Array(16);	
let violentcrime = 0;
let indexcrime = 0;
let nonindexcrime = 0;
let propcrime =0;
let totaldata=0;
for (var j = 0; j<16; j++)				//Initializing Counter array
    {	countertotaltheft[j]=0;
    	counteronetheft[j]=0;
    	counterzerotheft[j]=0;
    	countertotalassault[j]=0;
    	counteroneassault[j]=0;
    	counterzeroassault[j]=0;			}
var instream = fs.createReadStream('crimedata.csv');					//Starting Instream
var outstreamtheft = fs.createWriteStream('JSON/Theft/crimedatatheft-year-count.json');	//Starting Outstreams
var outstreamgraphtheft = fs.createWriteStream('JSON/Theft/crimedatatheft-year-count-graph.json');
var outstreamassault = fs.createWriteStream('JSON/Assault/crimedataassault-year-count.json');	//Starting Outstreams
var outstreamgraphassault = fs.createWriteStream('JSON/Assault/crimedataassault-year-count-graph.json');
var outstreamgraph2015 = fs.createWriteStream('JSON/2015/crimedata2015-year-count-graph.json');
var corrupted=0;
function datainputtheft(array, year) {
    if(array[5]=="THEFT"){	
    	if((array[6]=="$500 AND UNDER")||(array[6]=="FINANCIAL ID THEFT:$300 &UNDER")||(array[6]=="PURSE-SNATCHING")||(array[6]=="POCKET-PICKING")||(array[6]=="ATTEMPT THEFT")||(array[6]=="FROM BUILDING")||(array[6]=="RETAIL THEFT"))
    	{	var final = {"ID":array[0], "YEAR" :year , "ABOVE500": 0 } ;
    		counterzerotheft[year-2001] += 1;}
    	else{	
    		var final = {"ID":array[0], "YEAR" :year , "ABOVE500": 1 } ;
    		counteronetheft[year-2001] += 1;}
    	countertotaltheft[year-2001] += 1;
		outstreamtheft.write(JSON.stringify(final, null, 2),'UTF8') }
	}
function datainputassault(array, year,i) {
if(array[5]=="ASSAULT")
			{	if((array[i]=="false"))
					{	final = {"ID":array[0], "YEAR" :year , "ARREST": 0 } ;
						counterzeroassault[year-2001] += 1;}
				else if((array[i]=="true"))
					{	final = {"ID":array[0], "YEAR" :year , "ARREST": 1 } ;
						counteroneassault[year-2001] += 1;}
				else if(array[i+2]=="false"){
						final = {"ID":array[0], "YEAR" :year , "ARREST": 0 } ;
						counterzeroassault[year-2001] += 1;}
				else if(array[i+2]=="true"){
						final = {"ID":array[0], "YEAR" :year , "ARREST": 1 } ;
						counteroneassault[year-2001] += 1;
					}/*else {console.log(array[i-1]+" : "+array[i]+" : "+i);console.log(array)}*/
				outstreamassault.write(JSON.stringify(final, null, 2),'UTF8')
				countertotalassault[year-2001] += 1;							}
}
function datainput2015(array, year, i) {
if(year==2015)
			 if((array[i]=="01A")||(array[i]=="02")||(array[i]=="03")||(array[i]=="04A")||(array[i]=="04B")||(array[i]=="05")||(array[i]=="06")||(array[i]=="07")||(array[i]=="09")){
               indexcrime+=1;
            }
    if((array[i]=="01B")||(array[i]=="08A")||(array[i]=="08B")||(array[i]=="10")||(array[i]=="11")||(array[i]=="12")||(array[i]=="13")||(array[i]=="14")||(array[i]=="15")||(array[i]=="16")||(array[i]=="17")||(array[i]=="18")||(array[i]=="19")||(array[i]=="20")||(array[i]=="22")||(array[i]=="24")||(array[i]=="26")){
            nonindexcrime+=1;
            }
    if((array[i]=="01A")||(array[i]=="02")||(array[i]=="03")||(array[i]=="04A")||(array[i]=="04B")){
            violentcrime+=1;
            }
    if((array[i]=="05")||(array[i]=="06")||(array[i]=="07")||(array[i]=="09")){
            propcrime+=1;
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
			var ind=0;
			if((typeof year == 'undefined')||(!((year<2017)&&(year>2000))))	//Broken Line correction
			{	var i
				for(i =0; i<5; i++){
					yearcol+=1;
					year = parseInt(array[yearcol])
					if((year<2017)&&(year>2000)){break;}
				}
				if(!((year<2017)&&(year>2000))){
						for(i =(array.length - 6); i>0; i--){
								yearcol-=1;
								year = parseInt(array[yearcol])
								if((year<2017)&&(year>2000)){break;}
							}
						if(!((year<2017)&&(year>2000)))
						 {if(array.length>4)
						 	{	var tsc = array[2]							//Year Extraction
						 		var arraytsc = tsc.split(" ")
						 		if(typeof arraytsc[2] !== 'undefined')
						 		{		var arraydate = arraytsc[0].split("/")
						 				year = arraydate[2]
						 					if((typeof array[5] !== 'undefined')&&(typeof array[6] !== 'undefined'))
						 					{	
						 						datainputtheft(array,year) 
						 						datainputassault(array,year,8)
						 					}else {corrupted+=1}		
						 		}else {corrupted+=1;}					 		
						 	}}else{			datainputtheft(array,year)
											datainputassault(array,year,yearcol-9)
											datainput2015(array,year,yearcol-3)}
						 }else{				datainputtheft(array,year)
											datainputassault(array,year,yearcol-9)
											datainput2015(array,year,yearcol-3)}
										}	
		else if ((year>2000)&&(year<2017)) //For normal lines
			{datainputtheft(array,year)
			 datainputassault(array,year,8)
			 datainput2015(array,year,yearcol-3)}
		})})
 		.on('end', function(){
 			for(var k =0 ; k<16; k++)
 			{	title =  {"Year":k+2001, "More Than $500" : counteronetheft[k]  , "Less Than $500": counterzerotheft[k] };
 				outstreamgraphtheft.write(JSON.stringify(title, null, 2),'UTF8');
 				title = {"Year":k+2001, "Arrested" : counteroneassault[k]  , "Not Arrested": counterzeroassault[k] };
 				outstreamgraphassault.write(JSON.stringify(title, null, 2),'UTF8');																
 			}
 			title = {"Index Crime":indexcrime, "Non-Index Crime" : nonindexcrime  , "Violent Crime": violentcrime, "Property Crime": propcrime };
 				outstreamgraph2015.write(JSON.stringify(title, null, 2),'UTF8');	
 		})
 		