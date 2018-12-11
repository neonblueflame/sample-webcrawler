
/**
* Exit codes:
* 0 - program exits without errors
* 1 - program exits due to invalid URL
* 2 - program exits due to HTTP errors
*/

function SimpleWebCrawler(url) {
  "use strict";
  
  const fs = require("fs");
  const path = require("path");
  const uuid = require("uuid/v1");
  
  const config = require("./package.json")["config"];
  
  // Use http module if URL uses HTTP protocol or https if HTTPS
  var protocol;
  function checkURLprotocol() {
    var arrTemp = url.split(":");
    
    if (arrTemp[0] == "https")
      protocol = require("https");
    
    else if (arrTemp[0] == "http")
      protocol = require("http");
  };
  
  function log(text) {
    console.log(text);
  };
  
  function isValidURL() {
    if (isNull(url) || url == "")
      return false;
    
    checkURLprotocol();
  }
  
  function isNull(obj) {
    if (obj == undefined || obj == null)
      return true;
      
    else
      return false;
  };
  
  function isStatusCodeOk(code) {
    // If status code is a number and is 2xx
    if (typeof code == "number" && Math.floor(code / 100) == 2)
      return true;
    
    else
      return false;
  };

  function createDownloadDir() {
    if (!fs.existsSync(config["dirDownloads"]))
      fs.mkdirSync(config["dirDownloads"]);
  };
  
  function processWebPage() {
    protocol.get(url, (resp) => {
      
      let hasOk = isStatusCodeOk(resp.statusCode);
      if (!hasOk) {
        log("Error in web page status");
        process.exit(2);
      }
      
      log("Downloading from " + url);
      
      let bufferData = "";
      resp.on("data", (chunk) => {
        bufferData += chunk.toString();
      });
      
      //TODO:  write on file while reading from response?
      resp.on("end", () => {
        createDownloadDir();
        let dirRead = path.join(config["dirDownloads"], uuid())
        fs.mkdirSync(dirRead);
        
        fs.writeFileSync(
          path.join(dirRead, "page.txt"), bufferData);
          
        fs.writeFileSync(
          path.join(dirRead, "url.txt"), url);
        
        log("Download saved in " + dirRead);
      });
      
      resp.on("error", (e) => {
        log(e);
      });
      
    }).on("error", (e) => {
      log(e);
    });
  };
  
  return {
    url: "",
    crawl: function() {
      if (isValidURL() || isNull(protocol)) {
        log("URL protocol must be a WWW protocol");
        process.exit(1);
      }
      
      processWebPage();
    }
  };
  
}
module.exports = SimpleWebCrawler;