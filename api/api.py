import time
import flask
import json
import math
from flask import Flask, Response, request
from flask_cors import CORS, cross_origin
import pymongo
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from random import randint
import datetime
import requests
app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/vehicles"
mongodb_client = PyMongo(app)
db = mongodb_client.db


@app.route('/time')
def get_current_time():
    return {'time': time.time()}


@app.route('/vehicles')
def read():
    try:
        vehicles = list(db.vehicles.find())
        for vehicle in vehicles:
            vehicle["_id"] = str(vehicle["_id"])

        print("Type: ", type(vehicles))
        return flask.jsonify(vehicles)
    except Exception as ex:
        print(ex)


@app.route('/insert', methods=["POST"])
@cross_origin()
def insert():
    try:
        # new = {
        #     "id": 1,
        #     "test": "test",
        #     "region": "auburn",
        #     "price": 33590,
        #     "year": 2014,
        #     "manufacturer": "gmc",
        #     "model": "sierra 1500 crew cab slt",
        #     "condition": "good",
        #     "cylinders": "8 cylinders",
        #     "fuel": "gas",
        #     "odometer": 57923,
        #     "title_status": "clean",
        #     "transmission": "other",
        #     "type": "pickup",
        #     "paint_color": "white",
        #     "state": "al",
        #     "lat": 32,
        #     "long": -85,
        #     "posting_date": datetime.datetime.now()
        # }
        newRow = request.get_json()
        newRow['posting_date'] = datetime.datetime.now()
        newRow['id'] = randint(100000000000,900000000000)
        dbResponse = db.vehicles.insert_one(newRow)
        print(dbResponse.inserted_id)
        return flask.jsonify(message="Success", id = newRow['id'])
    except Exception as ex:
        print(ex)


@app.route("/update", methods=["POST"])
def update():
    try:
        rowToUpdate = request.get_json()
        rowWithoutKey = rowToUpdate
        print('updated row is: ', rowToUpdate)
        rowWithoutKey.pop('_id')
        print('updated row without key is: ', rowWithoutKey)
        result = db.vehicles.update_one({'id': rowToUpdate['id']}, {"$set": rowToUpdate})
        print(result)
        return flask.jsonify(message="Success")
    except Exception as ex:
        print(ex)

@app.route("/delete", methods=["POST"])
def delete():
    try:
        rowToDelete = request.get_json()
        print('received: ', rowToDelete)
        result = db.vehicles.find_one_and_delete({'_id': ObjectId(rowToDelete['_id'])})
        print(result)
        return flask.jsonify(message="Success")
    except Exception as ex:
        print(ex)


if __name__ == "__main__":
    app.run(port=5000, debug=True)
