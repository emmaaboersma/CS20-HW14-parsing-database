const MongoClient = require('mongodb').MongoClient;
const urldb = "mongodb+srv://user:password_pls@cluster0.r9iqh.mongodb.net/hw_14?retryWrites=true&w=majority";  // connection string goes here
 
var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('qs');
 
http.createServer(function (req, res) {
   if(req.url == "/") {
       file = "index.html";
       fs.readFile(file, function(err, txt) {
       res.writeHead(200, {'Content-Type': 'text/html'});
       console.log("accessing homepage...");
       res.write(txt);
       res.end();
       });
   } else if(req.url == "/process") {
       res.writeHead(200, {'Content-Type':'text/html'});
       console.log("Process the form");
       pdata = "";
      
       req.on('data', data => {
           pdata += data.toString();
       });
 
       // when complete POST data is received
       req.on('end', () => {
           pdata = qs.parse(pdata);
           radio_btn = pdata["c_or_t"];
 
           MongoClient.connect(urldb, { useUnifiedTopology: true }, function(err, db) {
               if(err) {
                   console.log("Connection err: " + err); return;
               }
               var dbo = db.db("hw_14");
               var coll = dbo.collection('companies');
               console.log("finding...");
 
               // name search
               if (radio_btn == "coName") {
                   res.write("Searching for... " + pdata['searchC'] + "<br>");
                   coll.find({"Company":pdata["searchC"]}).toArray(function(err, items) {
                       if(err) {
                           console.log("Error: " + err);
                       } else {
                           res.write("Results:<br>");
                           for(i=0; i<items.length;i++) {
                               res.write(items[i].Company + " " + items[i].Ticker + "<br>");
                           }
                       }
                   }); // end coll.find
               } else if(radio_btn == "coTicker") {
                   res.write("Searching for... " + pdata['searchT'] + "<br>");
                   coll.find({"Ticker":pdata["searchT"]}).toArray(function(err, items) {
                       if(err) {
                           console.log("Error: " + err);
                       } else {
                           res.write("Results:<br>");
                           for(i=0; i<items.length;i++) {
                               res.write(items[i].Company + " " + items[i].Ticker + "<br>");
                           }
                       }
                   }); // end coll.find
               }
           }); // end mongo client connect
       }); //  end req.on
   } else {
       res.writeHead(200, {'Content-Type':'text/html'});
       res.write ("Unknown page request");
       res.end();
   }
}).listen(8080);
