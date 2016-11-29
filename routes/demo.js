var express = require("express"); //导入express模块
var path = require('path'); //路径配置模块
var bodyParser = require('body-parser') //页面传递参数解析
var mysql = require('mysql'); //mysql模块
var multiparty = require('multiparty'); //文件上传模块
var util = require('util');
var fs = require('fs');
var app = express();
var port = 3000; //端口号
app.set("views", "views/"); //设置视图文件路径
app.set("view engine", "ejs"); //设置模板引擎
app.use(express.static(path.join(__dirname, 'bower_components'))) //设置静态文件路径
app.use(bodyParser.urlencoded({ extended: true, }))
app.listen(port); //监听端口
console.log("start..." + port);
console.log('连接开始');

//创建连接数据库
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lulinOne'
});
conn.connect(); //连接数据库 


app.get("/demo", function(req, res) {
    res.render('demo', {})
})
app.post("/demo", function(req, res) {
    var insertSQL = 'insert into student values(0,?,?,?,?,?)';
    var insertSQL_params = [];
    var form = new multiparty.Form(); //实例一个multiparty
    form.uploadDir = __dirname + "/bower_components/uploads/"; //设置文件储存路径
    //开始解析前台传过来的文件
    form.parse(req, function(err, fields, files) {
        // console.log(fields + 'fields==========')
        for (var item in fields) {
            insertSQL_params.push(fields[item][0]) //将fields[item][0] push到insertSQL_params中
            // console.log(fields[item][0] + 'fields[item][0]')
        }
        console.log(files + 'files')
         console.log('qoqoqoqooqoqoqoqoqoqooqqoqooqoqqooqoqooqqooqoqoqoqooo')
        var filesTmp = JSON.stringify(files);
        var pr = JSON.parse(filesTmp)
        console.log(pr.upfiles.length + 'pr.upfiles.length')
        if (err) {
            console.log('parse error: ' + err);
        } else {
            for (var i = 0; i < pr.upfiles.length; i++) {
                var inputFile = files.upfiles[i]; //获取第一个文件
                var finalname = inputFile.originalFilename;
                insertSQL_params.push(finalname)
                var new_name = __dirname + "/bower_components/uploads/" + finalname; //获取文件名
                console.log(new_name + 'new_name')
                var old_name = inputFile.path; //获取文件路径
                console.log(old_name + 'old_name')
                fs.renameSync(old_name, new_name);
            }
        }
        //添加数据到数据库
        conn.query(insertSQL, insertSQL_params, function(err2, rows) {
            if (err2) {
                console.log(err2);
            } else {
                console.log("成功" + '成功')
            }
        })
        res.send("成功")
    })
})