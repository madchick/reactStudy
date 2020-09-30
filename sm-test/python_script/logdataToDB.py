import openpyxl
import pymongo
from pymongo.errors import BulkWriteError

connection = pymongo.MongoClient("mongodb://127.0.0.1", 27017)
db = connection["maintenance"]
collection = db["logs"]

wb = openpyxl.load_workbook("\\\\Happy_jness\\10-유지보수\\J2020_엠오피스 유지보수 접수 및 지원 현황.xlsx", data_only=True)
ws = wb["유지보수현황"]

data = list()

for r in ws.rows:
    if r[2].value!=None:
        data.append({
            "addedDate" : r[1].value,
            "companyName" : r[2].value,
            "service" : r[3].value,
            "resubmissioned" :  r[4].value,
            "contactor" : r[5].value,
            "rank" : r[6].value,
            "type" : r[7].value,
            "subtype" : r[8].value,
            "body" : r[9].value,
            "channel" : r[10].value,
            "log" : r[11].value,
            "closed" : r[12].value=="Close",
            "receptionist" : r[13].value,
            "check" : r[14].value,
            "processed" : r[15].value,
            "agentNo" : r[16].value,
            "remark" : r[17].value,
            "maintenanceTeam" : r[18].value,
            "dutyed" : r[19].value,
            "agentTeam" : r[20].value,
            "plannedDate" : r[21].value,
            "completedDate" : r[22].value,
            "result" : r[24].value,
            "MM" : r[25].value
            })
try:
    collection.insert_many(data[1:]) 
except BulkWriteError as bwe:
    print(bwe.details)

    
