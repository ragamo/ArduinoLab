var OAuth2 = require('oauth').OAuth2;
var https = require('https');

var oauth2 = new OAuth2('WRJtRBTk7zFbsiGLLqiGA', 'WTirBqob4lGRxM5OmgGrT1FsEHV6u4vWOnmOrRrjw', 'https://api.twitter.com/', null, 'oauth2/token', null);

oauth2.getOAuthAccessToken('', {
    'grant_type': 'client_credentials'
}, function (e, access_token) {
    //console.log(access_token); //string that we can use to authenticate request
 
    var options = {
        hostname: 'api.twitter.com',
        path: '/1.1/search/tweets.json?q=#pubsubhubbub&count=1',
        headers: {
            Authorization: 'Bearer ' + access_token
        }
    };
 
    https.get(options, function (result) {
        var buffer = '';
        result.setEncoding('utf8');
        result.on('data', function (data) {
            buffer += data;
        });
        result.on('end', function () {
            var data = JSON.parse(buffer);
            //console.log(data); // the tweets!

            console.log(data.statuses[0].text);
        });
    });
});