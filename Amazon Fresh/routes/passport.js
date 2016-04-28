/**
 * 
 */
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var loginDatabase = "mongodb://localhost:27017/login";
var dbHelper = require('./mysql-db-helper');
var sqlQueryList = require('./sqlQueries');

module.exports = function(passport) {
    passport.use('login', new LocalStrategy(function(username, password, done) {
            var whereParams = {
                username:username,
                password:password
            }
            var profile;           
            process.nextTick(function(){
            	var CryptoJS = require("crypto-js");
                var loginCheck  = sqlQueryList.loginCheck(username);
                dbHelper.executeQuery(loginCheck,function(userDetails){
                	if(userDetails.length>0){
                	profile=userDetails;
                	var bytes  = CryptoJS.AES.decrypt(profile[0].password,'AMAZONFRESH');
                	var plaintext = bytes.toString(CryptoJS.enc.Utf8);
                	console.log(plaintext);
                	var puid = profile[0].puid;
                	if(plaintext===password){
                		var getProfile = sqlQueryList.getProfile(puid);
                		dbHelper.executeQuery(getProfile,function(userProfile){
                			done(null, userProfile);
                		},function(error){
                			done(null,false)
                		});
                	}
                	else{
                		done(null,false);
                	}                	
                	}
                	else
                		{
                		done(null,false);
                		}
    			},function(error){
    				profile=error;
    				done(null, false);
    			});                   
            });
    }));
}


