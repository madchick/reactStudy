var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sessionSchema = new Schema({
    session:String
});

module.exports = mongoose.model('session', sessionSchema, 'sessions');
//스키마명, 스키마 객체, 컬랙션명(db에 실제 있는)