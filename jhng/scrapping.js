const x2j = require( 'xml2js' );
const cheerio = require('cheerio');
const request = require('request');
var s=null;

request({
     uri: 'http://myhome.chosun.com/rss/www_section_rss.xml',
     method: 'GET',
     headers: {
          'Accept-Charset': 'utf-8'
     }
}, function(err, res, body){
     var p = new x2j.Parser();
     var sXMLData = body;

     p.parseString( sXMLData, function( err, result ) {
        s = JSON.stringify( result, undefined, 3 );
        //  console.log(s);
        s=JSON.parse(s);
     });
     
     console.log(s["rss"]["channel"]["0"]["item"]["0"]["title"]);
});
