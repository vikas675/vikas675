
var dbtemplate = require('./dbtemplate');
module.exports = {
    AuthenticateUser: function (username, password, callback) {
        conditions = 'username = ' + "'" + username + "'" + ' AND ' + 'password = ' + "'" + password + "'";
        dbtemplate.GetQueryResult('user_login', '', conditions, null, null, null, function (err, data) {
            if (!err) {
                callback(null, data)
            } else {
                callback(err, false);
            }
        });
    }
}