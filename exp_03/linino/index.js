var OAuth2 = require('oauth').OAuth2;
var oauth2 = new OAuth2('Dsd00rMdiPuR6X7XJag', 'YJCo5hO1MPhTBXeMFyndGxoESfgPY0O9kvX2evLik', 'https://api.twitter.com/', null, 'oauth2/token', null);
var https = require('https');
var fs = require('fs');

var core = {
    fileData: {
        query: '#trokkOn',
        flagTrock: false,
        lastTweets: [1]
    },

    request: function(_fnCallback) {
        oauth2.getOAuthAccessToken('', {
            'grant_type': 'client_credentials'
        }, function (e, access_token) {
            //console.log(access_token); //string that we can use to authenticate request
         
            https.get({
                hostname: 'api.twitter.com', 
                path: '/1.1/search/tweets.json?q='+core.fileData.query+'&count=1',
                headers: {
                    Authorization: 'Bearer ' + access_token
                }
            }, function(result) {
                var buffer = "";
                result.setEncoding('utf8');
                result.on('data', function(data) {
                    buffer += data;
                });
                result.on('end', function() {
                    var data = JSON.parse(buffer);
                    //console.log(data);

                    if(data && data.statuses && data.statuses.length > 0) {
                        if(!core.inArray(data.statuses[0].id, core.fileData.lastTweets)) {
                            core.clearQueue();
                            core.fileData.lastTweets.push(data.statuses[0].id);

                            if(_fnCallback)
                                _fnCallback(true);
                            
                        } else {
                            if(_fnCallback)
                                _fnCallback(false);
                        }
                    } else {
                        if(_fnCallback)
                            _fnCallback(false);
                    }
                });
            });
        });
    },

    inArray: function(val, arr) {
        for(var i=0; i<arr.length; i++) {
            if(arr[i] == val) {
                return true;
            }
        }
        return false;
    },

    clearQueue: function() {
        if(core.fileData.lastTweets.length > 20) {
            core.fileData.lastTweets = core.fileData.lastTweets.reverse().slice(0,10).reverse();
        }
    },

    readFile: function(_fnCallback) {
        fs.readFile('data.txt', 'UTF-8', function(err, data) {
            if(err) {
                core.writeFile(core.fileData, function(){
                    core.readFile(_fnCallback);
                });

            } else {
                if(_fnCallback)
                    _fnCallback(JSON.parse(data));
            }
        });
    },

    writeFile: function(data, _fnCallback) {
        if(!data) data = core.fileData;

        fs.writeFile('data.txt', JSON.stringify(data), function(err) {
            if(err) throw err;
            if(_fnCallback)
                _fnCallback(data);
        });
    },

    process: function() {
        core.readFile(function(data) {
            core.fileData = data;
            core.request(function(status) {
                 if(core.fileData.flagTrock) {
                    console.log('ON');
                    core.fileData.flagTrock = false;
                    core.fileData.query = "#trokkOn";
                    
                } else {
                    console.log('OFF');
                    core.fileData.flagTrock = true;
                    core.fileData.query = "#trokkOff";
                }

                if(status) core.writeFile(core.fileData);
            });
        });
    },

    run: function() {
        this.process();
    }
};

core.run();