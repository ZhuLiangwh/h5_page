/**
 * Created by jhzhang on 2015/7/22.
 */
var path = require('path'),
    fs = require('fs'),
    express = require('express'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    cors = require('cors');

var app = express();


app.set('port',process.env.PORT || 8005);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(compression());
app.use(cors());
app.use(express.static(path.join(__dirname,'src')));

app.use(function(req,res,next){
    res.set({
        'Content-type':'application/json',
        'Access-Control-Allow-Origin':'*'
    });
    console.log('%s %s %s',req.method,req.url,req.path);
    next();
});

app.get('/testData/:resource',function(req,res){
    try{
        var data = fs.readFileSync(path.join(__dirname,'/testData/'+req.params['resource']));
        res.send(data);
    }catch(err){
        res.send({'500':'server Error'});
    }
});
app.listen(app.get('port'),function(){
    console.log('Express server listening on prot: ' + app.get('port'));
});