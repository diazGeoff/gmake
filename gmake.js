#!/usr/bin/env node
var program = require('commander');
var http = require('http');
var fs = require('fs');
var jquery = "1.11.0",
    angular = "1.2.15",
    loc,
    fullInstall = false;

program.command('create-app [string]')
    .description('Template')
    .action(function(project){
        http.get("http://ajax.googleapis.com/ajax/libs/jquery/" + jquery + "/jquery.min.js", function(res) {
            if(res.statusCode == 404 || res.statusCode == 403) {
                console.log('There\'s an error in the version');
                throw new UserException('Project Not Created');
            }else{
                loc = process.cwd() + "/" + project;
                if(fs.existsSync(project) ){
                    console.log('Project Exist');
                }else{
                    fs.mkdirSync(loc);
                    fs.mkdirSync(loc + '/js/');
                    fs.mkdirSync(loc + '/image/');
                    fs.mkdirSync(loc + '/css/');
                    fs.writeFile(loc + "/css/style.css", '');
                    fs.createReadStream('template/app.js').pipe(fs.createWriteStream(loc + "/js/app.js"));
                    if(fullInstall){
                        res.pipe(fs.createWriteStream(loc + "/js/jquery.min.js"));
                        fs.readFile('template/index.html', function(err, data){
                            if(err)throw err;

                            var array = data.toString().split("\n");
                            array[4] = array[4] + "\n" +
                                "   \<script\ src=\"js/jquery.min.js\"> \</script\>";
                            var index = "";
                            for(var i = 0; i < array.length; i ++) {
                                index += array[i] + "\n";
                            }
                            fs.writeFile(loc + '/index.html', index, error);
                        });
                    }else{
                        fs.createReadStream('template/index.html').pipe(fs.createWriteStream(loc + "/index.html"));
                    }
                    console.log("Project " + project + " Successfully Created");
                }
            }
        });

    });
program.option('-f, --full', 'Create a Full Webpage Project', fullCreate);
program.option('-v, --version [version]', 'Version for Jquery', jqueryVersion);
program.command('install [dependencies]')
    .description('Install Other Dependencies')
    .option('-v, --version', 'Angular Version',angularVersion)
    .action(function(dependencies) {
        if(dependencies.toLowerCase() === "angular") {
            http.get("http://ajax.googleapis.com/ajax/libs/angularjs/" + angular + "/angular.min.js", function (res) {
                if (res.statusCode == 404 || res.statusCode == 403) {
                    console.log('There\'s an error in the version');
                    throw new UserException('Exit Download AngularJS');
                } else {
                    if (fs.existsSync('./js')) {
                        res.pipe(fs.createWriteStream('./js/angular.min.js'));
                        console.log('Successfully Installed');
                    } else {
                        console.log('js folder doesn\'t exists');
                    }
                }
            });
        }
    });
program.parse(process.argv);

function fullCreate(){
    fullInstall  = true;
}
function UserException(message){
    this.message = message;
    this.name = "UserException";
}
function jqueryVersion(ver){
    jquery = ver;
}
function angularVersion(ver){
    angular = ver;
}
function error(err){
    if(err)throw err;
}