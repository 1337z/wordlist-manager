var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var neek = require('neek'); // Removing duplicate lines. More at: https://github.com/whitfin/neek
var naturalSort = require("node-natural-sort"); //Sorting. More at: https://github.com/yobacca/node-natural-sort

var inputDir = 'input';
var exportDir = 'output';
var exportName = 'export.txt';

//Normalize arguments
var args = process.argv.slice(2);

//Check if a name was entered and set it to 'exportName'
if (typeof args[0] !== 'undefined')
    exportName = args[0];

var exportPath = exportDir + '/' + exportName;

//Combine all input files to one export file.
fs.readdir(inputDir, (err, files) => {
    files.forEach(file => {
        var data = fs.readFileSync(inputDir + "/" + file).toString();
        fs.appendFileSync(exportPath + '-combined.tmp', "\n" + data);
    });
    //Remove duplicates with neek
    neek.unique(exportPath + '-combined.tmp', exportPath + '-uniq.tmp', function () {
        //Remove blank lines
        var data = fs.readFileSync(exportPath + '-uniq.tmp').toString();
        fs.writeFile(exportPath + '-rm-blank.tmp', data.replace(/^\s*[\r\n]/gm, "").replace("\r", "\n"), function () {
            //Sorting the file with node-natural-sort
            var rl = readline.createInterface(fs.createReadStream(exportPath + '-rm-blank.tmp'), new stream);
            var lines = [];
            rl.on('line', function (line) {
                lines.push(line);
            });

            rl.on('close', function () {
                lines = lines.sort(naturalSort({
                    caseSensitive: false
                }));
                lines.forEach(line => {
                    fs.appendFileSync(exportPath, line + "\n");
                });

                //Remove temporary files
                fs.unlinkSync(exportPath + '-combined.tmp');
                fs.unlinkSync(exportPath + '-uniq.tmp');
                fs.unlinkSync(exportPath + '-rm-blank.tmp');

            });
        });

    });

});