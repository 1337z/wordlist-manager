var fs = require('fs');
var neek = require('neek'); // Removing duplicate lines. More at: https://github.com/whitfin/neek

var inputDir = 'input';
var exportDir = 'output';
var exportName = 'export.txt';

//Normalize arguments
var args = process.argv.slice(2);

//Check if a name was entered and set it to 'exportName'
if(typeof args[0] !== 'undefined')
    exportName = args[0];

var exportPath = exportDir + '/' + exportName;

//Combine all input files to one export file.
fs.readdir(inputDir, (err, files) => {
    files.forEach(file => {
        var data = fs.readFileSync(inputDir + "/" + file).toString();
        fs.appendFileSync(exportPath + '-combined.tmp', "\n" + data);
    });

    //Remove duplicates with
    neek.unique(exportPath + '-combined.tmp', exportPath + '-uniq.tmp', function(){
        //Remove blank lines
        var data = fs.readFileSync(exportPath + '-uniq.tmp').toString();
        fs.writeFileSync(exportPath, data.replace(/^\s*[\r\n]/gm, "").replace("\r", "\n"));

        //Remove temporary files
        fs.unlink(exportPath + '-combined.tmp', function(){});
        fs.unlink(exportPath + '-uniq.tmp', function(){});
        //fs.unlink(exportPath + '.tmp', function(){});

    });

});