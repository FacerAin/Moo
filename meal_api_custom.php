<?php
header('Access-Control-Allow-Origin: *');

error_reporting(0);                           // error reporting disable
header("Content-type: application/json; charset=UTF-8");        // json type and UTF-8 encoding
require "simple_html_dom.php";                // use 'simple_html_dom.php'
$countryCode = $_GET['countryCode'];          // local office of education website
$schulCode =  $_GET['schulCode'];             // school code
$insttNm = $_GET['insttNm'];                  // school name
$schulCrseScCode = $_GET['schulCrseScCode'];  // school levels code
$schMmealScCode = $_GET['schMmealScCode'];    // meal kinds code
$schYmd = $_GET['schYmd'];

$MENU_URL = "sts_sci_md01_001.do";            // view weekly table

// url for today
$URL="http://" . $countryCode . "/" . $MENU_URL . "?schulCode=" . $schulCode . "&insttNm=" . urlencode( $insttNm ) . "&schulCrseScCode=" . $schulCrseScCode . "&schMmealScCode=" . $schMmealScCode . "&schYmd=" . $schYmd;

// DOMDocument
$dom=new DOMDocument;

// load HTML file
$html=$dom->loadHTMLFile($URL);
$dom->preserveWhiteSpace=false;

// get elements by tag name
$table=$dom->getElementsByTagName('table');
$tbody=$table->item(0)->getElementsByTagName('tbody');
$rows=$tbody->item(0)->getElementsByTagName('tr');
$cols=$rows->item(1)->getElementsByTagName('td');
// reset date format
$schYmd=str_replace(".", "-", $schYmd);

// get day
$day=date('w', strtotime($schYmd));

// check blank has values
if($cols->item($day)->  nodeValue==null){
    echo '';
}else{
    $final=$cols->item($day)->nodeValue;
}

// replace unnecessary characters
$final=preg_replace("/[0-9]/", "", $final);

$string = $final;
$str_ary = preg_split("/[.]/", $string );
$str_uni = array_unique($str_ary);

$str_temp = "";
$j=0;

for($i=0; $i<count($str_ary); $i++){
    if($str_uni[$i]=="" or $str_uni[$i]=="."){
    }else{
        $str_uni[$j] = $str_uni[$i];
        $j++;
        $str_temp = $str_temp.$str_uni[$i].",";
    }
}

  $str_temp_num = mb_strlen(trim($str_temp))-1;
  $str_temp = mb_substr($str_temp, 0, $str_temp_num);
  $final=$str_temp;
  $loc=strpos($final,'밥',0);


  $tmp=substr($final,0,$loc+3);
$heelyHan=substr($final,$loc+3);
$final='';
$final .= $tmp;
$final .= ',';
$final .= $heelyHan;
if($final==','){
    $final='';
}
// change code number to text
if($schulCrseScCode==1){
    $schulCrseScCode="유치원";
}
if($schulCrseScCode==2){
    $schulCrseScCode="초등학교";
}
if($schulCrseScCode==3){
    $schulCrseScCode="중학교";
}
if($schulCrseScCode==4){
    $schulCrseScCode="고등학교";
}
if($schMmealScCode==1){
    $schMmealScCode="조식";
}
if($schMmealScCode==2){
    $schMmealScCode="중식";
}
if($schMmealScCode==3){
    $schMmealScCode="석식";
}

// no meal
if($final==null){
    $final="오늘은 급식이 없습니다.";
}

// array
$array = array(
    '교육청 코드' => $countryCode,
    '학교 코드' => $schulCode,
    '학교 명' => $insttNm,
    '학교 종류' => $schulCrseScCode,
    '급식 종류' => $schMmealScCode,
    '날짜' => $schYmd,
    '메뉴' => $final
);

// json encoding
$json = json_encode($array, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);

// echo json
echo $json;
?>
