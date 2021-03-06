﻿var localIp="localhost";//node.js 주소
jQueryCall=null;//js로 jQuery를 실행하기 위함.
var mp4Count;
var univCho;
function loader(){
    timer();
    parseWeather();
    parseNextWeather();
    setTimeout('videoPlayer()',3000)//비디오 플레이. 속성 받아오기위해 시간차.
    doomsDayInit();
    setInterval('doomsDayShow',72000000);//2시간 인터벌
    doomsDayShow1();
    setInterval('doomsDayShow1()',72000000);//2시간 인터벌
    parseMeal();
    eventDelay();
    getConfig();
    nboard()
    volumeController();
}
function getDateInit(){
    return new Date();
}
function getConfig(){
            {
                  loadJSON(function(response)
                  {
                      var jsonData = JSON.parse(response);
                      mp4Count=jsonData["mp4Count"];
                      pngCount=jsonData["pngCount"];
                      univCheck=jsonData["UnivCheck"];
                      console.log("MP4COUNT_"+mp4Count);
                      console.log("PNGCOUNT_"+pngCount);
                      console.log("UNIVCHECK_"+univCheck);
                      jAry=[pngCount, univCheck];
                      jQueryCall(jAry);
                      univCho=univCheck;
                  });

            }
           function loadJSON(callback) //url의 json 데이터 불러오는 함수
           {
              var url = "http://"+localIp+":53335";
              var request = new XMLHttpRequest();
              request.overrideMimeType("application/json");
              request.open('GET', url, true);
              request.onreadystatechange = function ()
              {
                if (request.readyState == 4 && request.status == "200")
                {
                  callback(request.responseText);
                }
              };
              request.send(null);
          }
}
function timer(){
    var today = getDateInit();
    var Hours = today.getHours();
    var noon;
    if(Hours==12)
    {
        noon="pm";
    }
    else if(Hours>12)
    {
        Hours=Hours-12;
        noon="pm";
    }
    else
    {
        noon="am";
    }
    var Min = today.getMinutes();
    var sec = today.getSeconds();

    var year = today.getYear();
    var month = today.getMonth()+1;
    var date = today.getDate();

    var week = new Array('일','월','화','수','목','금','토');
    if(sec<10)
    {
        sec="0"+sec;
    }
    if(Hours<10)
    {
        Hours="0"+Hours;
    }
    if(Min<10)
    {
        Min="0"+Min;
    }
    document.getElementById("Year").innerHTML=year+1900+"년";
    document.getElementById("MonthDay").innerHTML=month+"월 "+date+"일";
    document.getElementById("day").innerHTML=week[today.getDay()]+"요일";
    document.getElementById("time").innerHTML=Hours+":"+Min+":"+sec+noon;
    setTimeout('timer()',1000);
}
function parseWeather(){
            {
                var weatherTranslate;
                  loadJSON(function(response)
                  {
                      var jsonData = JSON.parse(response);
                      console.log("오늘날씨:"+jsonData["weather"][0]["main"]);
                      weatherTranslate = translator(jsonData["weather"][0]["main"]);
                       document.getElementById("weatherSta").innerHTML = weatherTranslate;
                      document.getElementById("degreeSta").innerHTML = Math.ceil(jsonData["main"]["temp"]-273.15)+"℃";//절대온도
                  });

            }
           function loadJSON(callback) //url의 json 데이터 불러오는 함수
           {
              var url = "http://api.openweathermap.org/data/2.5/weather?lat=36.192355&lon=127.076269&APPID=0829f0c4a2fc698fabc05bfd08b3ffe6";
              var request = new XMLHttpRequest();
              request.overrideMimeType("application/json");
              request.open('GET', url, true);
              request.onreadystatechange = function ()
              {
                if (request.readyState == 4 && request.status == "200")
                {
                  callback(request.responseText);
                }
              };
              request.send(null);
          }
    setTimeout(parseWeather, 10000);
}
function parseNextWeather(){
            {


                  loadJSON(function(response)
                  {
                      var jsonData=JSON.parse(response);
                      var weatherTranslate;
                      var i=0;
                      var today=getDateInit();
                      var month=today.getMonth()+1;
                      var year=today.getFullYear();
                      var day=today.getDate()+1;
                      if(month<10)//내일의 12시 날씨를 알기 위함.
                      {
                          month="0"+month;
                      }
                      if(day<10)
                          {
                              day="0"+day;
                          }
                      var query=year+"-"+month+"-"+day+" 12:00:00";
                      var i=0;
                      var rep=0;
                      while(rep<50)
                      {
                          if(query==jsonData["list"][i]["dt_txt"])
                              {
                                  break;
                              }
                          rep++;
                          i++;
                      }
                      weatherTranslate = translator(jsonData["list"][i]["weather"][0]["main"]);
                      document.getElementById("weatherNex").innerHTML = weatherTranslate;
                      document.getElementById("degreeNex").innerHTML = Math.ceil(jsonData["list"][i]["main"]["temp"]-273.15)+"℃";//절대온도
                      console.log("내일 날씨"+jsonData["list"][i]["dt_txt"]+"\n"+jsonData["list"][i]["weather"][0]["main"]);
                  });

            }
           function loadJSON(callback) //url의 json 데이터 불러오는 함수
           {
              var url = "http://api.openweathermap.org/data/2.5/forecast?lat=36.192355&lon=127.076269&APPID=0829f0c4a2fc698fabc05bfd08b3ffe6";
              var request = new XMLHttpRequest();
              request.overrideMimeType("application/json");
              request.open('GET', url, true);
              request.onreadystatechange = function ()
              {
                if (request.readyState == 4 && request.status == "200")
                {
                  callback(request.responseText);
                }
              };
              request.send(null);
          }
    setTimeout(parseNextWeather, 50000)
}
function translator(input){
    var weather;
    switch (input){
            case "Rain":
                weather="비";
                return weather;
            case "Sonw":
                weather="눈"
                return weather;
            case "Clouds":
                weather="흐림";
                return weather;
            case "Haze":
                weather="안개(연무)";
                return weather;
            case "Clear":
                weather="맑음";
                return weather;
            case "Mist":
                weather="안개(박무)";
                return weather;
            case "Fog":
                weather="안개";
                return weather;
            case "Drizzle":
                weather="이슬비";
                return weather;
            }
}
function videoPlayer(){
    var videoCount=mp4Count;//비디오 개수를 의미
    var mediaRoot="media/";
    var nextVideo=[];
    for(var i=1; i<=videoCount; i++)
        {

            nextVideo.push(mediaRoot+i+".mp4");
        }
    var videoPlayer = document.getElementById('videoPlayer');
    var curVideo = 0;
    videoPlayer.onended = function(){
       curVideo++;
       if(curVideo >= nextVideo.length){
         curVideo = 0;
       }
          videoPlayer.src = nextVideo[curVideo];
    }
}
function doomsDayInit(){
    var fDiffDay=getSDay();
    document.getElementById("doomsDay1").innerHTML = fDiffDay;
}
function calDiffDay(date) {
    //파라미터와 현재의 디데이 계산.
    var today = new Date();
    var timeDiff = date.getTime() - today.getTime();
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
  }
function calSDay(year) {
    //수능이 11월 3째주 목요일임을 이용. 수능의 날짜를 계산.
    var sDay = new Date();
    sDay.setYear(year);
    sDay.setHours(0,0,0,0);
    sDay.setDate(13);
    sDay.setMonth(10);

    while (sDay.getDay() != 4) {
      sDay.setDate(sDay.getDate() + 1);
      s=sDay.getDate();
    }
    return sDay;
}
function getSDay() {
    //올해와 내년 수능까지 남은 날을 계산. 만약 올해의 수능이 지났으면 내년과 내후년의 것을 계산
    var today = new Date();
    var fDiffDay;//1번째 수능일 디데이
    var sDiffDay;//재수 수능일 디데이
    var fSDay;//1번째 수능일
    var sSDay;//재수 수능일
    fSDay = calSDay(today.getFullYear());
    fDiffDay = calDiffDay(fSDay);
    console.log(fDiffDay);
    //날짜가 지났는지 확인
    if (fDiffDay > 0) {
        sSDay = calSDay(today.getFullYear() + 1);
        sDiffDay = calDiffDay(sSDay);
        console.log(sDiffDay);
    } else {
        fSDay = calSDay(today.getFullYear() + 1);
        fDiffDay = calDiffDay(fSDay);
        sSday = calSDay(today.getFullYear() + 2);
        fDiffDay = calDiffDay(sSday);
    }
    return fDiffDay;
}
function doomsDayShow1(){
    //사관학교 디데이 계산
    var doomsDay = null;
    var textArea = $('#doomsDay2');
    var today = getDateInit();
    textArea.fadeIn();
    //D day가 저장되지 않았을 경우에는 실행시키고 저장되었을 경우에는 저장된 값으로 실행 날짜 변경시 새로 계산하는 코드는 어차피 스마트 미러가 꺼질꺼라 안넣음
    if(doomsDay === null){
        doomsDay = doomsDayCal();
        var timeDiff = doomsDay.getTime() - today.getTime();
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        textArea.text(diffDays);
    }
//7월 28일
    function doomsDayCal(){
        //오늘 날짜를 불러와 연도를 변경.
        var lastDay = new Date();
        lastDay.setHours(0, 0, 0, 0);
        lastDay.setDate(28)
        lastDay.setMonth(6);
        return lastDay;
    }
}

function parseMeal(){
    day=getDateInit();
    a=day.getMonth()+1;
    console.log(a);
    if(a<10){
        chymd=day.getFullYear()+'.0'+(day.getMonth()+1)+'.'+day.getDate()+'';
    }else{
        chymd=day.getFullYear()+'.'+(day.getMonth()+1)+'.'+day.getDate()+'';
    }
    console.log(chymd);
    mealRe(chymd, 1);
    mealRe(chymd, 2);
    mealRe(chymd, 3);
    setTimeout(parseMeal, 100000);
}//날짜에 따라 재활용
function mealRe(date, time){
    var meal='';
            {
                  loadJSON(function(response)
                  {
                      var jsonData = JSON.parse(response);
                      var dataArr = jsonData["메뉴"].split(",");
                      for(var i=0; dataArr[i]!=null; i++){
                          if(dataArr[i]!="우유"){
                              meal+=dataArr[i]+"<br/>";
                          }
                      }
                      if(time==1){
                          document.getElementById("breakfast").innerHTML=meal;
                      }else if(time==2){
                          document.getElementById("lunch").innerHTML=meal;
                      }else if(time==3){
                          document.getElementById("dinner").innerHTML=meal;
                      }
                      this.meal=meal;
                  });

            }
           function loadJSON(callback) //url의 json 데이터 불러오는 함수
           {
              var url = "http://wiki.daegeonlife.com/meals/meal_api_custom.php?countryCode=stu.cne.go.kr&schulCode=N100000151&insttNm=%EB%85%BC%EC%82%B0%EB%8C%80%EA%B1%B4%EA%B3%A0%EB%93%B1%ED%95%99%EA%B5%90&schulCrseScCode=4&schMmealScCode="+time+"&"+"schYmd="+date;
              var request = new XMLHttpRequest();
              request.overrideMimeType("application/json");
              request.open('GET', url, true);
              request.onreadystatechange = function ()
              {
                if (request.readyState == 4 && request.status == "200")
                {
                  callback(request.responseText);
                }
              };
              request.send(null);
          }
}
function eventDelay(){
    event();
    setTimeout('event()',5000);
}
function parseXml(xml) {
   var dom = null;
   if (window.DOMParser) {
      try { 
         dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
      } 
      catch (e) { dom = null; }
   }
   else if (window.ActiveXObject) {
      try {
         dom = new ActiveXObject('Microsoft.XMLDOM');
         dom.async = false;
         if (!dom.loadXML(xml)) // parse error ..

            window.alert(dom.parseError.reason + dom.parseError.srcText);
      } 
      catch (e) { dom = null; }
   }
   else
      alert("cannot parse xml string!");
   return dom;
}
function nboard(){
    {
                  loadJSON(function(response)
                  {
                      var XMLData = response;
                      var dom = parseXml(XMLData);
                      var json = xml2json(dom, "");
                      
                      console.log(json);
                      document.getElementById("nb1").innerHTML=json["channel"]["item"][0]["title"];
                      document.getElementById("nb2").innerHTML=json["channel"]["item"][1]["title"];
                      document.getElementById("nb3").innerHTML=json["channel"]["item"][2]["title"];
                                        });

            }
           function loadJSON(callback) //url의 json 데이터 불러오는 함수
           {
              var url = "http://daegeonlife.com/wp-content/plugins/kboard/rss.php";
              var request = new XMLHttpRequest();
              request.overrideMimeType("application/json");
              request.open('GET', url, true);
              request.onreadystatechange = function ()
              {
                if (request.readyState == 4 && request.status == "200")
                {
                  callback(request.responseText);
                }
              };
              request.send(null);
          }
    setTimeout(nboard,10000);
}
function xml2json(xml, tab) {
   var X = {
      toObj: function(xml) {
         var o = {};
         if (xml.nodeType==1) {   // element node ..
            if (xml.attributes.length)   // element with attributes  ..
               for (var i=0; i<xml.attributes.length; i++)
                  o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
            if (xml.firstChild) { // element has child nodes ..
               var textChild=0, cdataChild=0, hasElementChild=false;
               for (var n=xml.firstChild; n; n=n.nextSibling) {
                  if (n.nodeType==1) hasElementChild = true;
                  else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                  else if (n.nodeType==4) cdataChild++; // cdata section node
               }
               if (hasElementChild) {
                  if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                     X.removeWhite(xml);
                     for (var n=xml.firstChild; n; n=n.nextSibling) {
                        if (n.nodeType == 3)  // text node
                           o["#text"] = X.escape(n.nodeValue);
                        else if (n.nodeType == 4)  // cdata node
                           o["#cdata"] = X.escape(n.nodeValue);
                        else if (o[n.nodeName]) {  // multiple occurence of element ..
                           if (o[n.nodeName] instanceof Array)
                              o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                           else
                              o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                        }
                        else  // first occurence of element..
                           o[n.nodeName] = X.toObj(n);
                     }
                  }
                  else { // mixed content
                     if (!xml.attributes.length)
                        o = X.escape(X.innerXml(xml));
                     else
                        o["#text"] = X.escape(X.innerXml(xml));
                  }
               }
               else if (textChild) { // pure text
                  if (!xml.attributes.length)
                     o = X.escape(X.innerXml(xml));
                  else
                     o["#text"] = X.escape(X.innerXml(xml));
               }
               else if (cdataChild) { // cdata
                  if (cdataChild > 1)
                     o = X.escape(X.innerXml(xml));
                  else
                     for (var n=xml.firstChild; n; n=n.nextSibling)
                        o["#cdata"] = X.escape(n.nodeValue);
               }
            }
            if (!xml.attributes.length && !xml.firstChild) o = null;
         }
         else if (xml.nodeType==9) { // document.node
            o = X.toObj(xml.documentElement);
         }
         else
            alert("unhandled node type: " + xml.nodeType);
         return o;
      },
      toJson: function(o, name, ind) {
         var json = name ? ("\""+name+"\"") : "";
         if (o instanceof Array) {
            for (var i=0,n=o.length; i<n; i++)
               o[i] = X.toJson(o[i], "", ind+"\t");
            json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
         }
         else if (o == null)
            json += (name&&":") + "null";
         else if (typeof(o) == "object") {
            var arr = [];
            for (var m in o)
               arr[arr.length] = X.toJson(o[m], m, ind+"\t");
            json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
         }
         else if (typeof(o) == "string")
            json += (name&&":") + "\"" + o.toString() + "\"";
         else
            json += (name&&":") + o.toString();
         return json;
      },
      innerXml: function(node) {
         var s = ""
         if ("innerHTML" in node)
            s = node.innerHTML;
         else {
            var asXml = function(n) {
               var s = "";
               if (n.nodeType == 1) {
                  s += "<" + n.nodeName;
                  for (var i=0; i<n.attributes.length;i++)
                     s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
                  if (n.firstChild) {
                     s += ">";
                     for (var c=n.firstChild; c; c=c.nextSibling)
                        s += asXml(c);
                     s += "</"+n.nodeName+">";
                  }
                  else
                     s += "/>";
               }
               else if (n.nodeType == 3)
                  s += n.nodeValue;
               else if (n.nodeType == 4)
                  s += "<![CDATA[" + n.nodeValue + "]]>";
               return s;
            };
            for (var c=node.firstChild; c; c=c.nextSibling)
               s += asXml(c);
         }
         return s;
      },
      escape: function(txt) {
         return txt.replace(/[\\]/g, "\\\\")
                   .replace(/[\"]/g, '\\"')
                   .replace(/[\n]/g, '\\n')
                   .replace(/[\r]/g, '\\r');
      },
      removeWhite: function(e) {
         e.normalize();
         for (var n = e.firstChild; n; ) {
            if (n.nodeType == 3) {  // text node
               if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                  var nxt = n.nextSibling;
                  e.removeChild(n);
                  n = nxt;
               }
               else
                  n = n.nextSibling;
            }
            else if (n.nodeType == 1) {  // element node
               X.removeWhite(n);
               n = n.nextSibling;
            }
            else                      // any other node
      xml = xml.documentElement;
               n = n.nextSibling;
         }
         return e;
      }
   };
   if (xml.nodeType == 9) // document node
   var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
   return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
}
function event(){
            {
                  loadJSON(function(response)
                  {
                      var jsonData = JSON.parse(response);
                      var univ='[';//입시설명회변수
                      var common='[';//입설 제외
                      for(var i=0; jsonData[i]!=null; i++){
                          if(jsonData[i]["summary"].indexOf("입시설명회")!=-1){
                              univ+=('{\"date\":'+'\"'+jsonData[i]["date"]+'\"'+', \"summary\":'+'\"'+jsonData[i]["summary"]+'\"'+'},');
                          }
                           else{
                               common+=('{\"date\":'+'\"'+jsonData[i]["date"]+'\"'+', \"summary\":'+'\"'+jsonData[i]["summary"]+'\"'+'},');
                           }
                      }
                      univ+=('{}]');
                      common+=('{}]');
                      univData=JSON.parse(univ);
                      commonData=JSON.parse(common);
                      document.querySelector("#event1 #date1").innerHTML=commonData[0]["date"]+"&nbsp;|";
                      document.querySelector("#event1 #script1").innerHTML=commonData[0]["summary"];
                      document.querySelector("#event2 #date2").innerHTML=commonData[1]["date"]+"&nbsp;|";
                      document.querySelector("#event2 #script2").innerHTML=commonData[1]["summary"];
                      document.querySelector("#event3 #date3").innerHTML=commonData[2]["date"]+"&nbsp;|";
                      document.querySelector("#event3 #script3").innerHTML=commonData[2]["summary"];
                      if(univCho){
                      document.querySelector("#univ1 #date").innerHTML=univData[0]["date"]+"&nbsp;|";
                      document.querySelector("#univ1 #script").innerHTML=univData[0]["summary"];
                      document.querySelector("#univ2 #date").innerHTML=univData[1]["date"]+"&nbsp;|";
                      document.querySelector("#univ2 #script").innerHTML=univData[1]["summary"];
                      document.querySelector("#univ3 #date").innerHTML=univData[2]["date"]+"&nbsp;|";
                      document.querySelector("#univ3 #script").innerHTML=univData[2]["summary"];    
                      }
                                        });

            }
           function loadJSON(callback) //url의 json 데이터 불러오는 함수
           {
              var url = "http://"+localIp+":53333";
              var request = new XMLHttpRequest();
              request.overrideMimeType("application/json");
              request.open('GET', url, true);
              request.onreadystatechange = function ()
              {
                if (request.readyState == 4 && request.status == "200")
                {
                  callback(request.responseText);
                }
              };
              request.send(null);
          }
    setTimeout('event()',10000);
}
//11시 자습 끝나기 전까지 노래 틀면 안됨^^
function volumeController(){
    var volumeControl=document.getElementById("videoPlayer");
    var time=getDateInit();
    volumeControl.volume=0;
    if((time.getHours()>=23) && (time.getMinutes()>=2))
        {
            volumeControl.volume=1;
        }
    setTimeout('volumeController()',1000);
}
