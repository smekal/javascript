
var fs = require('fs');
var outputArray={};
var stateLiteracyObj = {};

function updateDataFromFile(filePath , outputArray){

  var hits=[''];

  fs.readFileSync(filePath).toString().split('\n').forEach(function (lineContent) { 
    var rowDataArray = lineContent.split(",");
    
    var areaName = rowDataArray[3];

    if(!hits[areaName]){
     
      if(stateLiteracyObj[areaName] != null){

        var record = stateLiteracyObj[areaName];
      
        record.illiterateMales= +record.illiterateMales + +rowDataArray[10];
        record.illiterateFemales= +record.illiterateFemales + +rowDataArray[11];
        record.literateMales= +record.literateMales + +rowDataArray[13];
        record.literateFemales= +record.literateFemales + +rowDataArray[14];

        hits[areaName] = true;
        
      }else{
        var tempArray = {};
      
        tempArray["illiterateMales" ]= rowDataArray[10];
        tempArray["illiterateFemales" ]= rowDataArray[11];
        tempArray["literateMales"]= rowDataArray[13];
        tempArray["literateFemales"]= rowDataArray[14];
   
        stateLiteracyObj[areaName] = tempArray;
   
        hits[areaName] = true;
      }
    }
  });

}
updateDataFromFile("includes/India2011.csv" , stateLiteracyObj);
updateDataFromFile("includes/IndiaSC2011.csv" , stateLiteracyObj);
updateDataFromFile("includes/IndiaST2011.csv" , stateLiteracyObj);

//removes the items 
delete stateLiteracyObj["Area Name"];
delete stateLiteracyObj["undefined"];

var totalLiteracyObj =  [];
var neStates = ["State - ARUNACHAL PRADESH" , "State - NAGALAND" , "State - MANIPUR", "State - MIZORAM" , "State - TRIPURA" , "State - MEGHALAYA" , "State - ASSAM"];
var neStatesLiteracyObj= [];
var stateWiseLiteracyObj = [];

function generateTotalLiteracy(stateLiteracyObj){

  var literateMales = 0, illiterateMales =0 , literateFemales=0,illiterateFemales=0;
  var neLiterateFemales=0,neIlliterateFemales=0,neLiterateMales=0,neIlliterateMales=0;
  var stateWiseLiterate=0,stateWiseIlliterate=0;

  for(var key in stateLiteracyObj){

    var value = stateLiteracyObj[key];

    literateMales += value.literateMales;
    illiterateMales += value.illiterateMales;
    literateFemales += value.literateFemales;
    illiterateFemales += value.illiterateFemales;

    if(neStates.indexOf(key) != -1){
      neLiterateFemales += value.literateFemales;
      neIlliterateFemales +=value.illiterateFemales;
      neLiterateMales +=value.literateMales;
      neIlliterateMales += value.illiterateMales;

    }

    var stateObj = {};
    stateObj.areaName = key;
    stateObj.totalLiterate = value.literateMales + value.literateFemales;
    stateObj.totalIlliterate = value.illiterateMales + value.illiterateFemales;

    stateWiseLiteracyObj.push( stateObj);
  }

  totalLiteracyObj.push({"category": "Literate Male" , "population" : literateMales});
  totalLiteracyObj.push({"category": "Illiterate Male" , "population" : illiterateMales});
  totalLiteracyObj.push({"category": "Literate Female" , "population" : literateFemales});
  totalLiteracyObj.push({"category": "Illiterate Female" , "population" : illiterateFemales});

  neStatesLiteracyObj.push({"category": "Literate Male" , "population" : neLiterateMales});
  neStatesLiteracyObj.push({"category": "Illiterate Male" , "population" : neIlliterateMales});
  neStatesLiteracyObj.push({"category": "Literate Female" , "population" : neLiterateFemales});
  neStatesLiteracyObj.push({"category": "Illiterate Female" , "population" : neIlliterateFemales});

}

generateTotalLiteracy(stateLiteracyObj);

fs.writeFile('includes/total-literacy-resource.json', JSON.stringify(totalLiteracyObj), function (err) {
  if (err) throw err;

  console.log("Successfully generated Total Literacy file.");
});

fs.writeFile('includes/northeastern-literacy-resource.json', JSON.stringify(neStatesLiteracyObj), function (err) {
  if (err) throw err;

  console.log("Successfully generated NorthEastern Literacy file.");
});

fs.writeFile('includes/statewise-literacy-resource.json', JSON.stringify(stateWiseLiteracyObj), function (err) {
  if (err) throw err;

  console.log("Successfully generated State-wise Literacy file.");
});