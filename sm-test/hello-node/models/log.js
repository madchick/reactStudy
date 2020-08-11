var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logSchema = new Schema({
    addedDate:Date,
    companyName:String,
    service:String,
    resubmissioned:String,
    contactor:String,
    rank:String,
    type:String,
    subtype:String,
    body:String,
    channel:String,
    log:String,
    closed:Boolean,
    receptionist:String,
    check:String,
    processed:String,
    agentNo:Number,
    remark:String,
    maintenanceTeam:String,
    dutyed:String,
    agentTeam:String,
    plannedDate:Schema.Types.Mixed,
    completedDate:Date,
    result:String,
    MM:Number
});

module.exports = mongoose.model('log', logSchema, 'logs');
//스키마명, 스키마 객체, 컬랙션명(db에 실제 있는)