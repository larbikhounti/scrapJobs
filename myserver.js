const request = require('request');
const cheerio = require("cheerio");
const express = require('express');
const cors = require('cors');
const app = express();

let jobsContent = {
  Title: [''],
  Description: [''],
  city: [''],
  salary: [''],
  link: [''],
  date: [''],
  summary : ['']
}
let port = process.env.PORT || 3000 ;
let jobsContentBulkFormat = [''];
let location = [''];
let times = [''];
let summrays = [''];
let $;
let globlres;
app.use(cors());
app.set("port",port);
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

//get the jobs
app.get('/jobs/:job?/:city?', function (req, res) {
  let url = "https://ma.indeed.com/emplois?q=" + req.params.job + "&l=" + req.params.city + "&limit=20";
  getJobs(url);
 globlres =  res;

}) // end of get the jobs route

//get the jobs
app.get('/', function (req, res) {
  res.sendfile('./welcome/welcome.html');
}) // end of get the jobs route




function getJobs(url) {

  request(url, function (error, response, body) {
      
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
    //console.log('body:', body); // Print the HTML for the Google homepage.
    if (response.statusCode == 200 && body != null) {
       $ = cheerio.load(body);
    
      // store all a links
      jobsContentBulkFormat = $("a.jobtitle"); // get all jobs
      location = $("span.location"); // get all location
      times = $("span.date"); // get all dates 
      summrays = $(".summary");
      
      addData();
    
      

      //console.log( jobsContent.Title);
      // console.log( jobsContent.link);
      // console.log( jobsContent.city);



    }

  });

} // end of function 
function addData(){
  for (let i = 0; i < jobsContentBulkFormat.length; i++) {
    jobsContent.link[i] = "https://ma.indeed.com"+$(jobsContentBulkFormat[i]).attr("href");
    jobsContent.Title[i] = $(jobsContentBulkFormat[i]).attr("title");
    jobsContent.city[i] = $(location[i]).text();
    jobsContent.date[i] = $(times[i]).text();
    jobsContent.summary[i] = $(summrays[i]).text();
  }
  globlres.set({ 'content-type': 'application/json; charset=utf-8' });

  globlres.json(jobsContent);
 globlres.end();

}