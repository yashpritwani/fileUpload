const http = require('http');
const fs = require('fs');
const path = require('path');

let port = process.argv[2] || 3001;
const httpServer = http.createServer(requestHandler);
httpServer.listen(port, () => {console.log('server is listening on port '+ port)});

function requestHandler(req, res){
  if(req.url === '/'){
    sendIndexHtml(res);
  }else if( req.url === '/list'){
    sendListOfUploadedFiles(res);
  }else if( /\/download\/[^\/]+$/.test(req.url)){
    var url = "http://54.144.195.246:3001" + req.url;
    
    const accountSid = 'AC1eb714bdb15606c179afb3cc69f013db';
const authToken = 'cb7a43bc83cb734efd026ef19f1053c3';

const twilio = require('twilio')(accountSid, authToken);
    // const twilio = require("twilio")(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    // const { phoneNo } = req.body.num;
    var num = "+917678394361";
    twilio.messages
    .create({
        body: `Welcome to Dawaaii! this is url link ${url}`,
        from: "+18183517064",
        to: num,
    })
    .then((message) => console.log(message.sid));
    console.log(url);
    sendUploadedFile(req.url, res);

  }else if( /\/upload\/[^\/]+$/.test(req.url) ){
    saveUploadedFile(req, res)
  }else{
    sendInvalidRequest(res);
  }
}

function sendIndexHtml(res){
  let indexFile = path.join(__dirname, 'index.html');
  fs.readFile(indexFile, (err, content) => {
    if(err){
      res.writeHead(404, {'Content-Type': 'text'});
      res.write('File Not Found!');
      res.end();
    }else{
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(content);
      console.log("udhar hun main")
      res.end();
    }
  })
}

function sendListOfUploadedFiles(res){
  let uploadDir = path.join(__dirname, 'download');
  fs.readdir(uploadDir, (err, files) => {
    if(err){
      console.log(err);
      res.writeHead(400, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(err.message));
      res.end();
    }else{
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(files));
      res.end();
    }
  })
}


function sendUploadedFile(url, res){
  let file = path.join(__dirname, url);
  fs.readFile(file, (err, content) => {
    if(err){
      res.writeHead(404, {'Content-Type': 'text'});
      res.write('File Not Found!');
      res.end();
    }else{
      res.writeHead(200, {'Content-Type': 'application/octet-stream'});
      res.write(content);
      console.log("resend aap")
      res.end();
    }
  })
}


function saveUploadedFile(req, res){
  console.log('saving uploaded file');
  let fileName = path.basename(req.url);
  let file = path.join(__dirname, 'download', fileName)
  req.pipe(fs.createWriteStream(file));
  req.on('end', () => {
    res.writeHead(200, {'Content-Type': 'text'});
    res.write('uploaded succesfully');
    res.end();
  })
}

function sendInvalidRequest(res){
  res.writeHead(400, {'Content-Type': 'application/json'});
  res.write('Invalid Request');
  res.end(); 
}

function downloadFile(req,res){
  let name = req.body.file;
  var url = "http://54.144.195.246:3001/download/"+name;
  console.log(url)
  res.redirect(url);
}