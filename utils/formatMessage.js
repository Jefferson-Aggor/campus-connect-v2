const moment = require("moment");

module.exports = {
    formatMessage: function(username, msg) {
        return {
            username,
            msg,
            date: moment().format("h:mm a"),
        };
    },
};