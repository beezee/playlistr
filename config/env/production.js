var _ = require('underscore');

module.exports = _.extend({
    db: "mongodb://localhost/ytpl",
    port: 8000,
    app: {
        name: "Playlistr - YouTube on IV drip"
    },
}, require(__dirname+'/../../../playlistr.socialConfig.js'));
