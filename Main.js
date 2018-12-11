const SimpleWebCrawler = require("./SimpleWebCrawler.js");
let webCrawler = new SimpleWebCrawler("https://www.jobstreet.com.ph/en/job-search/find-company?c=a");
webCrawler.crawl();

/**
  For unit test:
  https://nodejs.org/api/child_process.html
  
  Test URL: https://www.jobstreet.com.ph/en/job-search/find-company?c=a
  
  Exit code. Test description
  1. Test no URL
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