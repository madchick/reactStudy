var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var companySchema = new Schema({
    companyName: String, service: String, maintenanceTeam: String, dutyed: String
});

module.exports = mongoose.model('company', companySchema, 'companys');
//스키마명, 스키마 객체, 컬랙션명(db에 실제 있는)