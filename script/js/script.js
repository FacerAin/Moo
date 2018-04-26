var localIp="localhost";//node.js 주소
jQueryCall=null;//js로 jQuery를 실행하기 위함.
var mp4Count;
function loader(){
    timer();
    setInterval('rice()', 72000000);//2시간 인터벌
    parseWeather();
    setInterval('parseWeather()',72000000);//2시간 인터벌
    parseNextWeather();
    setInterval('parseNextWeather()',72000000);//2시간 인터벌
    videoPlayer();//비디오 플레이어
    doomsDayShow();
    setInterval('doomsDayShow',72000000);//2시간 인터벌
    doomsDayShow1();
    setInterval('doomsDayShow1()',72000000);//2시간 인터벌
    parseMealChecker();
    setInterval('parseMealChecker()',10000);//10초 인터벌
    eventDelay();
    setInterval('event()',72000000);
    getConfig();
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
                      console.log(mp4Count);
                      console.log(pngCount);
                      jQueryCall(pngCount);
                  });

            }
           function loadJSON(callback) //url의 json 데이터 불러오는 함수
           {
              var url = "http://"+localIp+":53335";
              var request = new XMLHttpRequest();
               console.log("req");
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
                      if(month<10)
                      {
                          month="0"+month;
                      }
                      if(day<10)
                          {
                              day="0"+day;
                          }
                      var query=year+"-"+month+"-"+day+" 12:00:00";
                      console.log(query);
                      console.log(jsonData["list"][10]["dt_txt"]);
                      console.log(query==jsonData["list"][10]["dt_txt"]);
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
function doomsDayShow(){
    var doomsDay = null;
    var textArea = $('#doomsDay1');
    var today = getDateInit();
    //D day가 저장되지 않았을 경우에는 실행시키고 저장되었을 경우에는 저장된 값으로 실행 날짜 변경시 새로 계산하는 코드는 어차피 스마트 미러가 꺼질꺼라 안넣음
    if(doomsDay === null){

        doomsDay = doomsDayCal(0);
        var timeDiff = doomsDay.getTime() - today.getTime();
        //만약 수능이 지나고 난뒤 12월달 정도에는 D day 값이 음수로 반환될테니 그럴경우 내년으로 계산
    if(timeDiff<0){
      doomsDay = doomsDayCal(1);
      timeDiff = doomsDay.getTime() - today.getTime();
    }
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    textArea.text(diffDays);
    }
    // 수능까지 남은 날을 계산하는 코드 islasted parameter는 연도가 지난건지 아닌지 확인
    function doomsDayCal(isLasted){
      //오늘 날짜를 불러와 연도를 변경. 만약 수능 날짜가 지나지 않으면 올해 그대로 지났다면 1년 추가
      var lastDay = new Date();
      var year = lastDay.getFullYear() + isLasted;
      lastDay.setYear(year);
      lastDay.setHours(0, 0, 0, 0);
      lastDay.setDate(1)
      lastDay.setMonth(10);
    //getDay 함수는 요일을 반환하는 함수. 오늘의 날짜가 목요일이 될때까지 하루씩 추가.
        //var thursday = 4; 불필요한 변수 생성
    while(lastDay.getDay() != 4) {
        lastDay.setDate(lastDay.getDate() + 1);
    }
    // 수능은 11월 3째주 목요일임으로 2주를 추가
    lastDay.setDate(lastDay.getDate() + 14);
      return lastDay;
      }
}
function doomsDayShow1(){

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
//급식 파싱. 2018.04.09 Lani
function parseMealChecker(){
    var virgin=true;
    var firstExe=true;
    var i;
    var time=getDateInit();
    console.log(time.getHours());
    if(time.getHours()>=19 && virgin){
        parseMeal(1);
        virgin=false;
        return;
    }
    else if(i>=1080){
        parseMeal(0);
        i=0;
        return;
    }
    else if(firstExe){
        parseMeal(0);
        firstExe=false;
        return;
    }
    
}
function parseMeal(ary){
            {
                  loadJSON(function(response)
                  {
                      var jsonData = JSON.parse(response);
                      document.getElementById("breakfast").innerHTML=jsonData[ary]["아침"];
                      document.getElementById("lunch").innerHTML=jsonData[ary]["점심"];
                      document.getElementById("dinner").innerHTML=jsonData[ary]["저녁"];
                  });

            }
           function loadJSON(callback) //url의 json 데이터 불러오는 함수
           {
              var url = "http://"+localIp+":53334";
              var request = new XMLHttpRequest();
              request.overrideMimeType("application/json");
              request.open('GET', url, true);
              request.onreadystatechange = function ()
              {
                if (request.readyState == 4 && request.status == "200")
                {
                    console.log("readystate");
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
function event(){
            {
                  loadJSON(function(response)
                  {
                      var jsonData = JSON.parse(response);
                      document.getElementById("date1").innerHTML=jsonData[0]["date"]+"&nbsp;|";
                      document.getElementById("script1").innerHTML=jsonData[0]["summary"];
                      document.getElementById("date2").innerHTML=jsonData[1]["date"]+"&nbsp;|";
                      document.getElementById("script2").innerHTML=jsonData[1]["summary"];
                      document.getElementById("date3").innerHTML=jsonData[2]["date"]+"&nbsp;|";
                      document.getElementById("script3").innerHTML=jsonData[2]["summary"];
                  });

            }
           function loadJSON(callback) //url의 json 데이터 불러오는 함수
           {
              var url = "http://"+localIp+":53333";
              var request = new XMLHttpRequest();;
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