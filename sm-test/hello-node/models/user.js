var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    id: String,
    pwd: String
});

module.exports = mongoose.model('user', userSchema, 'users');
//스키마명, 스키마 객체, 컬랙션명(db에 실제 있는)