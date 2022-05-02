const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://user:password_pls@cluster0.r9iqh.mongodb.net/hw_14?retryWrites=true&w=majority";
const fs = require('fs');
const readline = require('readline');
 
MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
if(err) { return console.log(err); return;}
    dbo = db.db("hw_14");
   coll = dbo.collection('companies');
  
   // get file
   file = readline.createInterface({
       input: fs.createReadStream('companies.csv')
   });
   file.on('line', function(line) {
       lines = line.split(/,/g);
           curr_company = {};
           curr_company.company = lines[0];
           curr_company.ticker = lines[1];
           coll.insertOne(curr_company, function(err, res){
               if(err) {
                   console.log("Error: " + err);
                   return;
               }
           });
           console.log("adding... " + JSON.stringify(curr_company) + "\n");
 
           // delete the first line which added the header
           coll.deleteOne({"company":"Company", "ticker":"Ticker"}, function(err, res){
               if(err) {
                   console.log("Error: " + err);
                   return;
               }
           });
   });
});
