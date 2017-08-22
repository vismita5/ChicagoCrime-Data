var fs = require('fs');
var array ;
let final;
var instream = fs.createReadStream('../crimedata.csv');
var outstream = fs.createWriteStream('smaple.json');
var badlines = fs.createWriteStream('badlineread.json');
//var lines = instream.toString().split('\n');
var count = 0;
var count1 = 0;
var count2 = 0;
var count3 = 0;
var corrupted=0;
var scavangedbrokenlines =0;

var cor1=0;
instream.setEncoding('UTF8');
instream.on('data', function(chunk){
	let data = '';
	data +=chunk;
	
	data.trim()
		.split('\n')
		.map(line => line.split('\t'))
		.map(line => {
			array = line[0].split(',')
			
			var yearcol = array.length -6;
			var year = parseInt(array[yearcol])
			
			if(!((year<2017)&&(year>2000)))
			{	var i
				//console.log(year)
				count+=1
				for(i =0; i<5; i++)
				{
					yearcol+=1;
					year = parseInt(array[yearcol])
					if((year<2017)&&(year>2000)){break;}
				}
				if((year<2017)&&(year>2000)){ /*console.log("Corrected"+year)*/;cor1+=1}
				else {

						count1+=1;
						//console.log("Not Corrected"+ year)
						for(i =(array.length - 5); i>0; i--)
							{
								yearcol-=1;
								year = parseInt(array[yearcol])
								if((year<2017)&&(year>2000)){break;}
							}
						if((year<2017)&&(year>2000)){ count2+=1;/*console.log("Corrected a second time"+year)*/}
						else{count3+=1
						 	//console.log("Still uncorrected"+ year);
						 	//console.log(line)

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
						 				/*{
						 					if((typeof array[5] !== 'undefined')&&(array[5]=='THEFT')&&(typeof array[6] !== 'undefined'))
						 					{	Y=year;
						 						{	
													if((array[6]=="$500 AND UNDER")||(array[6]=="FINANCIAL ID THEFT:$300 &UNDER")||(array[6]=="PURSE-SNATCHING")||(array[6]=="POCKET-PICKING")||(array[6]=="ATTEMPT THEFT")||(array[6]=="FROM BUILDING")||(array[6]=="RETAIL THEFT"))
													{	
														final = {"ID":array[0], "YEAR" :Y , "ABOVE500": 0 } ;
														//counterzero[Y-2001] += 1;
						
													}
													else
													{	
														final = {"ID":array[0], "YEAR" :Y , "ABOVE500": 1 } ;
														//counterone[Y-2001] += 1;
						 							}
													//countertotal[Y-2001] += 1;
				
													//outstream.write(JSON.stringify(final, null, 2),'UTF8')                             //FINAL :WRITE TO FILE : UNQUOTE
													scavangedbrokenlines+=1;
													console.log(final);																	//FINAL :WRITE TO CONSOLE : UNQUOTE
											}
						 					}
						 					else {corrupted+=1}
						 				}*/
						 				//For Assault

						 				{
						 					if((typeof array[5] !== 'undefined')&&(typeof array[8] !== 'undefined')&&(array[5]=="ASSAULT"))
											{	
												if((array[8]=="false"))
												{   final = {"ID":array[0], "YEAR" :year , "ARREST": 0 } ;
													//counterzero[l] += 1;
												}
												else
												{   final = {"ID":array[0], "YEAR" :year , "ARREST": 1 } ;
													//counterone[l] += 1;
												}

												//outstream.write(JSON.stringify(final, null, 2),'UTF8')
												//countertotal[l] += 1;
												scavangedbrokenlines+=1;
												console.log(final);
											}
											else {corrupted+=1}
						 				}
						 				//For Aggregate
						 				/*{
						 					if((typeof array[5] !== 'undefined')&&())
						 					{

						 					}
						 					else {corrupted+=1}
						 				}*/
						 		}
						 		else
						 		{
						 			corrupted+=1;
						 		}

						 	}
						 	
						 }
						}
			}
		})
})

			.on('end',function(){
			console.log("Year at incorrect location : "+count)
			console.log("Corrected after shifting Year cursor forward : "+cor1)
			console.log("Not corrected after shifting Year cursor forward : "+count1)
			console.log("Corrected after shifting Year cursor backwards : "+count2)
			console.log("Badlines Corrected:" + count3)
			console.log("Scavanged Broken Lsines"+scavangedbrokenlines)
			console.log("Corrupted lines:"+ corrupted)

		})
