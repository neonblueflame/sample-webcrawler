const SimpleWebCrawler = function(url) {
  
  /**
  * Exit codes:
  * 0 - program exits without errors
  * 1 - program exits due to invalid URL
  * 2 - program exits due to HTTP errors
  */
  
  /**
    For unit test:
    https://nodejs.org/api/child_process.html
    
    Test URL: https://www.jobstreet.com.ph/en/job-search/find-company?c=a
    
    Exit code. Test description
    1. Test invalid URL with invalid protocol
    1. Test invalid URL with valid protocol
    1. Test valid URL with invalid protocol
    1. Test valid URL with valid protocol
    2. Test code 2xx with valid URL and valid protocol - dirDownloads created, file with web page contents created
    2. Test code 4xx with valid URL and valid protocol
    2. Test code 5xx with valid URL and valid protocol
    
    Test if download-page is not existing - create dir 1st
    Test if download-page is existing - continue
  */
  
  const fs = require("fs");
  const path = require("path");
  const uuid = require("uuid/v1");
  
  const dirDownloads = "download-page";
  
  var protocol;
  function checkURLprotocol() {
    var arrTemp = url.split(":");
    
    if (arrTemp[0] == "https")
      protocol = require("https");
    
    else if (arrTemp[0] == "http")
      protocol = require("http");
  };
  
  // TODO: Make this accessible/extendable
  function log(text) {
    console.log(text);
  }
  
  // TODO:
  function validateURL() {}
  
  function isNull(obj) {
    if (obj == undefined || obj == null)
      return true;
      
    else
      return false;
  }
  
  function isStatusCodeOk(code) {
    // If status code is a number and is 2xx
    if (typeof code == "number" 
      && Math.floor(code / 100) == 2)
      return true;
    
    else
      return false;
  }
  
  function createDownloadDir() {
    if (!fs.existsSync(dirDownloads))
      fs.mkdirSync(dirDownloads);
  }
  
  // TODO: allow setting of callback to process response
  // TODO: set as property, URL and callback
  function processWebPage() {
    protocol.get(url, (resp) => {
      
      let hasOk = isStatusCodeOk(resp.statusCode);
      if (!hasOk) {
        log("Error in web page status");
        process.exit(2);
      }
      
      let bufferData = "";
      resp.on("data", (chunk) => {
        bufferData += chunk.toString();
      });
      
      //TODO:  write on file while reading from response?
      resp.on("end", () => {
        log(bufferData);
        
        createDownloadDir();
        let dirRead = path.join(dirDownloads, uuid())
        fs.mkdirSync(dirRead);
          
        fs.writeFileSync(
          path.join(dirRead, "read.txt"), bufferData);
      });
      
      resp.on("error", (e) => {
        log(e);
      });
      
    }).on("error", (e) => {
      log(e);
    });
  }
  
  checkURLprotocol();
  if (isNull(protocol)) {
    log("URL protocol must be a WWW protocol");
    process.exit(1);
  }
  
  processWebPage();
  
}(process.argv[2]);