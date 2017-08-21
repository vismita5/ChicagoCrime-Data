var fs = require('fs');
var j =0;
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
var instream = fs.createReadStream('crimedata.csv');					//Starting Instream
var outstream = fs.createWriteStream('JSON/Theft/crimedatatheft-year-count.json');	//Starting Outstreams
var outstreamgraph = fs.createWriteStream('JSON/Theft/crimedatatheft-year-count-graph.json');
var badlines = fs.createWriteStream('JSON/Theft/badlineread.json');
var count = 0;
var corrupted=0;
var scavangedbrokenlines =0;
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
			//Broken Line correction
			if((typeof year == 'undefined')||(!((year<2017)&&(year>2000))))
			{	var i
				//console.log(year)
				count+=1
				for(i =0; i<5; i++)
				{
					yearcol+=1;
					year = parseInt(array[yearcol])
					if((year<2017)&&(year>2000)){break;}
				}
				if(!((year<2017)&&(year>2000))){

						
						//console.log("Not Corrected"+ year)
						for(i =(array.length - 5); i>0; i--)
							{
								yearcol-=1;
								year = parseInt(array[yearcol])
								if((year<2017)&&(year>2000)){break;}
							}
						if(!((year<2017)&&(year>2000)))
							{
						 	badlines.write(JSON.stringify([line]));
						 	if(array.length>4)
						 	{	
						 		//Year Extraction
						 		var tsc = array[2]
						 		var arraytsc = tsc.split(" ")
						 		
						 		if(typeof arraytsc[2] !== 'undefined')
						 		{
						 				var arraydate = arraytsc[0].split("/")
						 				year = arraydate[2]
						 				//console.log(year)

						 				//For THEFT
						 				{
						 					if((typeof array[5] !== 'undefined')&&(array[5]=='THEFT')&&(typeof array[6] !== 'undefined'))
						 					{	Y=year;
						 						{	
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
													scavangedbrokenlines+=1;
													console.log(final);																	//FINAL :WRITE TO CONSOLE : UNQUOTE
											}
						 					}
						 					else {corrupted+=1}
						 				}	
						 		}
						 		else
						 		{
						 			corrupted+=1;
						 		}

						 	}
						 	
						 }
						}
			}



			//For normal lines
		else if ((year>2000)&&(year<2017))
			 {if(array[5]=="THEFT")			//Filter 
			{	
				if((array[6]=="$500 AND UNDER")||(array[6]=="FINANCIAL ID THEFT:$300 &UNDER")||(array[6]=="PURSE-SNATCHING")||(array[6]=="POCKET-PICKING")||(array[6]=="ATTEMPT THEFT")||(array[6]=="FROM BUILDING")||(array[6]=="RETAIL THEFT"))
					{	
						var final = {"ID":array[id], "YEAR" :year , "ABOVE500": 0 } ;
						counterzero[year-2001] += 1;
							}
				else
					{	
						var final = {"ID":array[id], "YEAR" :year , "ABOVE500": 1 } ;
						counterone[year-2001] += 1;
						 }
				countertotal[year-2001] += 1;
				outstream.write(JSON.stringify(final, null, 2),'UTF8')                             //FINAL :WRITE TO FILE : UNQUOTE
				//console.log(final);																	//FINAL :WRITE TO CONSOLE : UNQUOTE
			}}
			totaldata+=1;
		})


})
 		.on('end', function(){
 			var TOTALCOUNT=0;
 			var title = "Total Count\tLess than $500\tMore than $500";
 			//outstreamgraph.write(title);
 			//outstreamgraph.write()
 			for(var k =0 ; k<16; k++)
 			{
 				title = [countertotal[k] +"    "+counterzero[k]+"    "+ counterone[k]];
 				console.log(title);
 				outstreamgraph.write(JSON.stringify(title, null, 2),'UTF8');
 				TOTALCOUNT+=countertotal[k];
 			}
 			console.log("Uncounted : "+ uncount);
 			console.log("Total Counted : "+ TOTALCOUNT);
 			console.log("Total Records Checked : "+ totaldata);
 			//console.log(/*"Beforecc"+beforeCC+*/"  AfterCC"+afterCC);	
 			console.log("Year at incorrect location : "+count)
			console.log("Scavanged Broken Lsines"+scavangedbrokenlines)
			console.log("Corrupted lines:"+ corrupted)
 		})