<?php
$ADDR='10.132.11.69';
// $ADDR='121.199.5.165';
$USER='qtang';
$PASSWORD='LAbV3RqGfhNX3fbJ';
$DB_NAME='qtang';
$TABLE='sports';

$redirectUrl = "http://cn.dolphin.com/dolphin-day/sports-meeting/";

if (isset($_POST)){
    if (isset($_POST['p']) && isset($_POST['v'])) {
        $pid = $_POST['p'];
        $value = $_POST['v'];
    } else {
        Header("HTTP/1.1 303 See Other");
        Header("Location: $redirectUrl");
        exit;
    }
} else {
    Header("HTTP/1.1 303 See Other");
    Header("Location: $redirectUrl");
    exit;
}

$user_agent = $_SERVER['HTTP_USER_AGENT'];
if (strpos($user_agent, 'MicroMessenger') === false) {
    // 非微信浏览器禁止浏览
    Header("HTTP/1.1 401 Unauthorized");
    exit;
}

$link = mysql_connect($ADDR, $USER, $PASSWORD) or die("Unable to connect to the database!");
mysql_select_db($DB_NAME) or die("Unable to connect to database ".$DB_NAME);

$valid = mysql_query("SELECT * FROM {$TABLE} WHERE `uid`='{$pid}' and `dt`=CURDATE() ");

if (mysql_fetch_row($valid)) {
    $now_time = date("y-m-d h:i:s");
    $expire_time = "2015-05-21 19:00:00";
    if (strtotime($now_time) > strtotime($expire_time)){
        // 投票超时
        echo "<script>alert('投票已结束！')</script>";
    }else{
        // 今日已投票
        echo "<script>alert('你今天已经投过票了！')</script>";
    }
}else{
    $sql_addVotes = "INSERT INTO {$TABLE}(uid, value, dt) VALUES ('{$pid}', {$value}, CURDATE())";
    mysql_query($sql_addVotes);
}

$sql_getResult = "SELECT count(uid)*3 as votes, value as team FROM {$TABLE} GROUP BY value";
$result = mysql_query($sql_getResult);
if (!$result) {
    echo 'Could not run query: '.mysql_error();
    exit;
}

$votesArray = array();
while($row = mysql_fetch_row($result)){
    $votesArray[] = array($row[0], $row[1]);
}

mysql_close($link);
?>

<html>
<head>
    <meta http-equiv='content-type' content='text/html;charset=UTF-8'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="format-detection" content="telephone=no">
    <title>海豚2015运动会, 投出你心中最牛战队!</title>
    <style>
body{
    margin: 0;
    padding: 0;
    font-family: 微软雅黑;
}
.result {
    width: 100%;
    height: 100%;
    background: url('./images/vote-bg.jpg') no-repeat;
    background-size: 100% auto;
}
.vote {
    margin:0px auto;padding:0px;
    position: relative;
    top: 130px;
    width:80%;
    border:1px solid #000000;

    -moz-border-radius-bottomleft:0px;
    -webkit-border-bottom-left-radius:0px;
    border-bottom-left-radius:0px;

    -moz-border-radius-bottomright:0px;
    -webkit-border-bottom-right-radius:0px;
    border-bottom-right-radius:0px;

    -moz-border-radius-topright:0px;
    -webkit-border-top-right-radius:0px;
    border-top-right-radius:0px;

    -moz-border-radius-topleft:0px;
    -webkit-border-top-left-radius:0px;
    border-top-left-radius:0px;
}.vote table{
    border-collapse: collapse;
        border-spacing: 0;
    width:100%;
/*    height:100%;*/
    margin:0px;padding:0px;
}.vote tr:last-child td:last-child {
    -moz-border-radius-bottomright:0px;
    -webkit-border-bottom-right-radius:0px;
    border-bottom-right-radius:0px;
}
.vote table tr:first-child td:first-child {
    -moz-border-radius-topleft:0px;
    -webkit-border-top-left-radius:0px;
    border-top-left-radius:0px;
}
.vote table tr:first-child td:last-child {
    -moz-border-radius-topright:0px;
    -webkit-border-top-right-radius:0px;
    border-top-right-radius:0px;
}.vote tr:last-child td:first-child{
    -moz-border-radius-bottomleft:0px;
    -webkit-border-bottom-left-radius:0px;
    border-bottom-left-radius:0px;
}.vote tr:hover td{
    background-color:#cccc99;
}
.vote td{
    vertical-align:middle;
    background-color:#ffffff;
    border:1px solid #000000;
    border-width:0px 1px 1px 0px;
    text-align:center;
    padding:7px;
    font-size:14px;
    font-family:Arial;
    font-weight:normal;
    color:#412311;
}.vote tr:last-child td{
    border-width:0px 1px 0px 0px;
}.vote tr td:last-child{
    border-width:0px 0px 1px 0px;
}.vote tr:last-child td:last-child{
    border-width:0px 0px 0px 0px;
}
.vote tr:first-child td{
    background-color:#6A3A05;
    border:0px solid #000000;
    text-align:center;
    border-width:0px 0px 1px 1px;
    font-size:14px;
    font-family:Arial;
    font-weight:bold;
    color:#ffffff;
}
.vote tr:first-child:hover td{
    background:-o-linear-gradient(bottom, #003366 5%, #003f7f 100%);    background:-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #003366), color-stop(1, #003f7f) );
    background:-moz-linear-gradient( center top, #003366 5%, #003f7f 100% );
    filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#003366", endColorstr="#003f7f");  background: -o-linear-gradient(top,#003366,003f7f);

    background-color:#003366;
}
.vote tr:first-child td:first-child{
    border-width:0px 0px 1px 0px;
}
.vote tr:first-child td:last-child{
    border-width:0px 0px 1px 1px;
}
.reset{
    width: 120px;
    margin: 0 auto;
    background-color: #21A938;
    font-size: 16px;
    color: #fff;
    margin-top: 165px;
    padding: 5px 15px;
    border-radius: 16px;
    text-align: center;
}
a {
    text-decoration: none;
}
.hidden{
    display: none;
}
    </style>
</head>
<body>
    <div class="hidden">
        <img src="./images/thumb.jpg">
    </div>
    <div class="result">
        <div class="vote">
            <table>
                <tr><td>队伍</td><td>得票数</td></tr>
                <?php
                    function getName($value){
                        if ($value == 1) {
                            return '北京队';
                        }
                        if ($value == 2) {
                            return '成都队';
                        }
                        if ($value == 3) {
                            return '武汉队';
                        }
                    }
                    for ($i=0; $i< count($votesArray); $i++) {
                        if ($votesArray[$i]){
                            echo '<tr><td>'.getName($votesArray[$i][1]).'</td><td>'.$votesArray[$i][0].'</td></tr>';
                        }else{
                            echo '<tr><td></td><td></td></tr>';
                        }
                    }
                ?>
            </table>
        </div>
        <div class="clear"></div>
        <a href="./index.html"><div class="reset">返回</div></a>
    </div>
    <div class="clear"></div>
</body>

<script src='./js/wechat_share.js'></script>
<script src='./js/ga.js'></script>

</html>

