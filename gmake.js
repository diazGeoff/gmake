#!/usr/bin/env node
var program = require('commander');
var http = require('http');
var template = require('./template/app');
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
                    fs.writeFile(loc + "/js/app.js", template.app);
                    if(fullInstall){
                        res.pipe(fs.createWriteStream(loc + "/js/jquery.min.js"));
                        var holder = template.index.split("\n");
                        var indexString = "";
                        holder[4] += "\n   \<script src=\"js/jquery.min.js\"\>\</script\>";
                        for(var iterate = 0; iterate < holder.length; iterate ++){
                            indexString += holder[iterate] + "\n";
                        }
                        fs.writeFile(loc + '/index.html', indexString);
                    }else{
                        fs.writeFile(loc + '/index.html', template.index);
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