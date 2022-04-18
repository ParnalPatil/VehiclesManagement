import time
import flask
import json
import math
from flask import Flask, request, url_for, session, redirect
from flask_cors import CORS, cross_origin
import pymongo
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from random import randint
import datetime
import requests
import bcrypt
import os

app = Flask(__name__)
# app.config["JWT_SECRET_KEY"] = "please-remember-to-change-me"
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET')
CORS(app)
jwt = JWTManager(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/vehicles"
mongodb_client = PyMongo(app)
db = mongodb_client.db
# vehicle_db = db['vehicles']
# vehicles_col = vehicle_db['vehicles']



@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/')
def index():
    if 'username' in session:
        return 'You are logged in as ' + session['username']

    return flask.jsonify(message="LoggedIn")

@app.route('/token', methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email != "test" or password != "test":
        return flask.jsonify(message = "Wrong email or password")

    access_token = create_access_token(identity=email)
    response = {"access_token":access_token}
    return response

@app.route('/register', methods=['POST'])
def register():
    username = request.get_json()
    print(username)

    existing_user = db.users.find_one({'email' : username['email']})
    print(existing_user)

    if existing_user is None:
        hashpass = bcrypt.hashpw(username['password'].encode('utf-8'), bcrypt.gensalt())
        db.users.insert_one({'email' : username['email'], 'password' : hashpass})
        # session['username'] = username['email']
        # return redirect(url_for('index'))
        # return flask.jsonify(status=True)
        return flask.jsonify(message="Registered")

    
    # return flask.jsonify(status=False)
    return flask.jsonify(message="Already Registered")


@app.route('/login', methods=['POST'])
def login():
    username = request.get_json()
    print(username)

    login_user = db.users.find_one({'email' : username['email']})
    print('login user is: ', login_user)

    if login_user:
        if bcrypt.hashpw(username['password'].encode('utf-8'), login_user['password']) == login_user['password']:
            # session['username'] = request.form['username']
            access_token = create_access_token(identity=username['email'])
            response = {"access_token":access_token, "message": "Logged In", "email": username['email']}
            return response

    return flask.jsonify(message="Invalid Login")


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
    # app.secret_key = 'super secret key'
    app.run(port=5000, debug=True)
