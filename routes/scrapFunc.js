const rp = require('request-promise');
const fs = require('fs');
const os = require('os');
const csvjson = require('csvjson');


function scraping(options, filename) {
    const output = [];
    var oneFlightData = [];
    var tableHeader = [];
    var header;
    var table=[];
    var flightInformation;
  
    return rp(options)
      .then( $ => {
          console.log("scraping started");
        
        $('div.x21n .x7b tr th.x7w').each((i, tableRow) => {
          header = $(tableRow).text();
          tableHeader.push(header);
        });
        table.push(tableHeader);
        output.push(tableHeader.join());
  
        $('div.x21n .x7b tr').each((i, flightRow) => {
          oneFlightData = [];
          $(flightRow).find('.x7m').each((l, data) => {
            flightInformation = $(data).text();
            oneFlightData.push(flightInformation);
          });
          if (oneFlightData.length > 0) {
            table.push(oneFlightData);
            
            output.push(oneFlightData.join());
          }
        });
  
        fs.writeFileSync(filename, output.join(os.EOL));
        fs.readFile(filename, 'utf-8', (err, fileContent) => {
          if (err) {
            console.log(err); // Do something to handle the error or just throw it
            throw new Error(err);
          }
          const jsonObj = csvjson.toObject(fileContent);
          var finalData = JSON.stringify(jsonObj);
          fs.writeFileSync(filename.split('.')[0]+'.json', finalData);
        });
        console.log(filename, "  CREATED");
        console.log(filename.split('.')[0]+'.json', "  CREATED");
        return table;
        
      }).catch(err =>
        console.log(err))
  }
  

  module.exports= scraping;