import openpyxl
import pymongo
from pymongo.errors import BulkWriteError

connection = pymongo.MongoClient("mongodb://127.0.0.1", 27017)
db = connection["maintenance"]
collection = db["companys"]

wb = openpyxl.load_workbook("\\\\Happy_jness\\10-유지보수\\J20200603_유지보수 팀및담당자 배정 현황.xlsx")
ws = wb["유지보수 배정 상세"]

data = list()
for r in ws.rows:
    if r[3].value!=None:
        data.append({
            "companyName" : r[3].value,
            "service": r[6].value,
            "maintenanceTeam": r[9].value,
            "dutyed": r[10].value
            })

try:
    collection.insert_many(data[1:]) 
except BulkWriteError as bwe:
    print(bwe.details)
