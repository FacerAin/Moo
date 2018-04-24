﻿//json 변형 부분은 격한 최적화가 필요
const http = require('http');
const fs = require('fs');
const mkdirp = require('mkdirp');
const readline = require('readline');
const Path = require('path');
const {
  google
} = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'credentials.json';
const jsesc = require('jsesc');
var eventString = '';
var mealString = '';
var path = '/Users/wnwng/Desktop/node';
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
 fs.readFile('client_secret.json', (err, content) => {
   if (err) return console.log('Error loading client secret file:', err);
   // Authorize a client with credentials, then call the Google Drive API.
   authorize(JSON.parse(content), listEvents);
   authorize(JSON.parse(content), listMeals);
 });

function authorize(credentials, callback) {
  const {
    client_secret,
    client_id,
    redirect_uris
  } = credentials.installed;
  const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the next 6 events on the user's meal calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listMeals(auth) {
  const calendar = google.calendar({
    version: 'v3',
    auth
  });
  calendar.events.list({
    calendarId: '1u66hlmljmnnccnqsafh73vkro@group.calendar.google.com',
    timeMin: (new Date()).toISOString(),
    maxResults: 6,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, {
    data
  }) => {
    if (err) return console.log('The API returned an error: ' + err);

    mealString = jsesc('[');
    var eventDay = null;

    const events = data.items;
    if (events.length) {
      console.log('loading events');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;

        if(eventDay==null){
          eventDay = start;
          mealString = mealString + jsesc('{"date":"') + start + jsesc('","') + event.summary + jsesc('":"') + event.description + jsesc('"')
        }else if(eventDay != start){
          eventDay = start;
          mealString = mealString + jsesc('},{"date":"') + start + jsesc('","') + event.summary + jsesc('":"') + event.description + jsesc('"');
        }else{
        mealString = mealString + jsesc(',"') + event.summary + jsesc('":"') + event.description +jsesc('"') ;
      }
      });
    } else {
      console.log('No upcoming events found.');
    }
    mealString = mealString + jsesc('}]');
    /* 파일 형식으로 출력 하는 코드
    var today = new Date();
    fileName = today.getFullYear() + "_" + (today.getMonth() + 1) + "_" + today.getDate();
    fs.writeFileSync(fileName + '_meal.json', mealString, 'utf8');
    */
  });
}

function listEvents(auth) {
  const calendar = google.calendar({
    version: 'v3',
    auth
  });
  calendar.events.list({
    calendarId: '9g11330b8eqphhgrd0nnapved0@group.calendar.google.com',
    timeMin: (new Date()).toISOString(),
    maxResults: 15,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, {
    data
  }) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = data.items;

    eventString = jsesc('[');
    if (events.length) {
      console.log('loading meals');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        eventString = eventString + jsesc('{"date":"') + start + jsesc('","summary":"') + event.summary + jsesc('"},');
      });
    } else {
      console.log('No upcoming events found.');
    }
    eventString = eventString.substr(0, eventString.length - 1) + jsesc(']');
    /*파일 출력하는 코드
    var today = new Date();
    fileName = today.getFullYear() + "_" + (today.getMonth() + 1) + "_" + today.getDate();
    fs.writeFileSync(fileName + '_event.json', eventString, 'utf8');
    */
  });
}

http.createServer(function (request, response){
  response.writeHead(200, { "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
});
  fs.readFile('client_secret.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), listEvents);
  });
  response.end(eventString);
}).listen(53333, function(){
  console.log('server port 53333 is for event');
});

http.createServer(function (request, response){
  response.writeHead(200, { "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
});
  fs.readFile('client_secret.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), listMeals);
  });
  response.end(mealString);
}).listen(53334, function(){
  console.log('server port 53334 is for meal');
});