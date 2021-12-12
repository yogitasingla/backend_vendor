let nconf = require('nconf');

function Config() {
    console.log("inside config")
    nconf.argv().env();
    const environment = nconf.get('NODE_ENV') || 'development';
    console.log('environment',environment)
    nconf.file(environment, './config/' + environment.toLowerCase() + '.json');
    nconf.file('default', './config/default.json');
    console.log(environment)
}

Config.prototype.get = function(key) {
    return nconf.get(key);
};

//Export Modules
module.exports = new Config();