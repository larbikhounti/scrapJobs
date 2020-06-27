const request = require('request');
const cheerio = require("cheerio");
const express = require('express');
const app = express();

let jobsContent = {
  Title: [''],
  Description: [''],
  city: [''],
  salary: [''],
  link: [''],
  date: ['']
}

let jobsContentBulkFormat = [''];
let location = [''];
let times = [''];
let $;
let globlres;
//get the jobs
app.get('/jobs/:job?/:city?', function (req, res) {
  let url = "https://ma.indeed.com/emplois?q=" + req.params.job + "&l=" + req.params.city + "";
  getJobs(url);
 globlres =  res;

}) // end of get the jobs route


//mainpage
app.get('/', function (req, res) {
  
  res.json("here we go");
})

app.listen(process.env.PORT || process.env.PORT );

function getJobs(url) {

  request(url, function (error, response, body) {
      
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
    //console.log('body:', body); // Print the HTML for the Google homepage.
    if (response.statusCode == 200 && body != null) {
       $ = cheerio.load(body);
      console.log($);
      // store all a links
      jobsContentBulkFormat = $("a.jobtitle"); // get all jobs
      location = $("span.location"); // get all location
      times = $("span.date"); // get all dates 
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
   
  }
  globlres.json(jobsContent);
}