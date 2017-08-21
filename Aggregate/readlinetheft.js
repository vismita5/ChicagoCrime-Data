const readline = require('readline')
const fs = require('fs')
var output = [];
const rl = readline.createInterface({
    input: fs.createReadStream('../crimedata.csv','utf8')
});

rl.on('line', (line) => {
    line.split('\n')
    var array=line.split(',');
    var jsonFromLine = {};
    var year=array.length -6;
    jsonFromLine.ID=array[0];
    jsonFromLine.YEAR=array[year];
    jsonFromLine.VALUE;

    if(array[5] === 'THEFT' ) {
       
        if((array[6]=="$500 AND UNDER")||(array[6]=="FINANCIAL ID THEFT:$300 &UNDER")||(array[6]=="PURSE-SNATCHING")||(array[6]=="POCKET-PICKING")||(array[6]=="ATTEMPT THEFT")||(array[6]=="FROM BUILDING")||(array[6]=="RETAIL THEFT"))
           
                jsonFromLine.VALUE =0 ;
        else
        jsonFromLine.VALUE =1;

        output.push(jsonFromLine);

    console.log(jsonFromLine);


}
});

rl.on('close', (line) => {
    console.log(output);
    var json=JSON.stringify(output);
    fs.writeFile("q1.json",json);


});
