var fs = require('fs');
var j =0;
var uncount =0; //Entries Ignored
let countertotalassault= new Array(16);  
let counteroneassault= new Array(16);	  
let counterzeroassault= new Array(16);	  
let totaldata=0;				  //Counter array for total records parsed
let id=0;
for (j = 0; j<16; j++)				//Initializing Counter array
    {	countertotalassault[j]=0;
    	counteroneassault[j]=0;
    	counterzeroassault[j]=0;
    }
var instreamassault = fs.createReadStream('../crimedata.csv');					//Starting Instream
var outstreamassault = fs.createWriteStream('crimedataassault-year-count.json');	//Starting Outstreams
var outstreamgraphassault = fs.createWriteStream('crimedataassault-year-count-graph.json');
var badlines = fs.createWriteStream('badlineread.json');
var count = 0;
var corrupted=0;
var scavangedbrokenlines =0;
function datainputassault(array, year,i) {
if(array[5]=="ASSAULT")
			{	
				if((array[i]=="false"))
					{
						final = {"ID":array[id], "YEAR" :year , "ARREST": 0 } ;
						counterzeroassault[year-2001] += 1;
					}
				else if((array[i]=="true"))
					{
						final = {"ID":array[id], "YEAR" :year , "ARREST": 1 } ;
						counteroneassault[year-2001] += 1;
					}
				else if(array[i+2]=="false"){
						final = {"ID":array[id], "YEAR" :year , "ARREST": 0 } ;
						counterzeroassault[year-2001] += 1;
					}
				else if(array[i+2]=="true"){
						final = {"ID":array[id], "YEAR" :year , "ARREST": 1 } ;
						counteroneassault[year-2001] += 1;
					}else {console.log(array[i]);}
				outstreamassault.write(JSON.stringify(final, null, 2),'UTF8')
				countertotalassault[year-2001] += 1;
			}

}
instreamassault.setEncoding('UTF8');			//Setting encoding
instreamassault.on('data', function(chunk){
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
						 	if(array.length>7)
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
						 						datainputassault(array,year,8)
												//console.log(i)
						 					}else {corrupted+=1}
						 				}	
						 		}
						 		else
						 		{	corrupted+=1;}						 		
						 	}}
						 	else{
												//console.log( array[0]+"here + " +array[yearcol-9]+" "+yearcol+"decr in i")
											datainputassault(array,year,yearcol-9)}
						 }
						 	else {
												//console.log( array[0]+"here + " +array[yearcol-9]+" "+yearcol +"incr in i")
											datainputassault(array,year,yearcol-9)}}
		else if ((year>2000)&&(year<2017)) //For normal lines
			 datainputassault(array,year,8)
		})})
 		.on('end', function(){
 			var TOTALCOUNT=0;
 			var TOT =0;
 			var title = "Total Count\tLess than $500\tMore than $500";
 			//outstreamgraphassault.write(title);
 			//outstreamgraphassault.write()
 			for(var k =0 ; k<16; k++)
 			{
 				title = [countertotalassault[k] +"    "+counterzeroassault[k]+"    "+ counteroneassault[k]];
 				console.log(title);
 				outstreamgraphassault.write(JSON.stringify(title, null, 2),'UTF8');
 				TOT = TOT + counteroneassault[k]+counterzeroassault[k];
 				TOTALCOUNT+=countertotalassault[k];
 			}
 			
 		})
 		
