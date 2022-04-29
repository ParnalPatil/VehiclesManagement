from cmath import inf
import matplotlib
import matplotlib.pyplot as plt
import seaborn as sns
import random
import matplotlib.colors as mcolors
import numpy as np

import uuid 

import boto3
from botocore.client import Config

from itertools import count
import time
import flask
from flask import Flask, request, send_from_directory, url_for, session, redirect
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from random import randint
import datetime
import requests
import bcrypt
import os

app = Flask(__name__, static_folder='used_vehicles/build', static_url_path='')
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
    return send_from_directory(app.static_folder, 'index.html')

    # return flask.jsonify(message="LoggedIn") 


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
        # rowWithoutKey.pop('id')
        # print('updated row without key is: ', rowWithoutKey)
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

# @app.route("/plot", methods=["POST"])
# def plot():
#     try:
#         print("test")
#         mnf={}
#         year={}
#         size={}
#         # import pdb 
#         # pdb.set_trace()
#         vehicles = list(db.vehicles.find())
#         for itm in vehicles:
#             mnf_temp = itm.get('manufacturer',None)
#             year_temp = itm.get('year',None)
#             size_temp = itm.get('size',None)
#             if mnf_temp:
#                 mnf[mnf_temp] = mnf.get(mnf_temp,0)+1
#             if year_temp:
#                 year[year_temp] = year.get(year_temp,0)+1
#             if size_temp:
#                 size[size_temp] = size.get(size_temp,0)+1

        
#         # Manufacturer vs No. of vehicles -> bar chart
#         manufacturer_label=[key for key in mnf.keys()]
#         manufacturer_count=[val for val in mnf.values()]
#         matplotlib.pyplot.switch_backend('Agg') 
#         sns.set_style('darkgrid')
#         plt.figure(figsize = (15,8))
#         sns.barplot(manufacturer_label, manufacturer_count)
#         plt.xticks(rotation=90)
#         plt.xlabel("Manufacturer")
#         plt.ylabel("No. of vehicles")
#         plt.show()
#         plt.savefig('manufacturer.png')
#         plt.close()


#         # Year vs No. of Vehicles -> line chart
#         print("year: ",year)
#         year_label=[key for key in year.keys()]
#         year_count=[val for val in year.values()]
#         sns.set_theme(style="darkgrid")
#         plt.figure(figsize = (15,8))
#         sns.lineplot(year_label, year_count)
#         plt.xlabel("Year")
#         plt.ylabel("No. of vehicles")
#         plt.show()
#         plt.savefig('years.png')
#         plt.close()

#         # Size Pie chart
#         print("size: ",size)
#         size_label=[key for key in size.keys()]
#         size_count=[val for val in size.values()]
#         number_of_colors=len(size_count)
#         # colors = random.choices(list(mcolors.CSS4_COLORS.values()),k = number_of_colors)
#         hexadecimal_alphabets = '0123456789ABCDEF'
#         colors = ["#4A" + ''.join([random.choice(hexadecimal_alphabets) for j in range(4)]) for i in range(number_of_colors)]
#         fig, ax = plt.subplots()
#         ax.pie(size_count, labels = size_label, colors = colors, autopct='%.0f%%')
#         ax.set_title('Vehicles size distribution')
#         plt.show()
#         plt.savefig('pie.png')
#         plt.close()

        
#         # with open('manufacturer.png') as pltfile:
#         #     endpoint_url = os.getenv("S3_HOST")
#         #     boto3.setup_default_session(aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
#         #                     aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))
#         #     client = boto3.client(
#         #         "s3", 
#         #         region_name=os.environ.get('AWS_REGION'),
#         #         endpoint_url=endpoint_url,
#         #     )
#         #     response = client.upload_file(
#         #         'manufacturer.png',
#         #         os.getenv('S3_BUCKET'),
#         #         'manufacturer.png',
#         #         ExtraArgs={'ACL': 'public-read'}
#         #     )

#         # with open('years.png') as pltfile:
#         #     endpoint_url = os.getenv("S3_HOST")
#         #     boto3.setup_default_session(aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
#         #                     aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))
#         #     client = boto3.client(
#         #         "s3", 
#         #         region_name=os.environ.get('AWS_REGION'),
#         #         endpoint_url=endpoint_url,
#         #     )
#         #     response = client.upload_file(
#         #         'years.png',
#         #         os.getenv('S3_BUCKET'),
#         #         'years.png',
#         #         ExtraArgs={'ACL': 'public-read'}
#         #     )
        
#         # with open('pie.png') as pltfile:
#         #     endpoint_url = os.getenv("S3_HOST")
#         #     boto3.setup_default_session(aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
#         #                     aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))
#         #     client = boto3.client(
#         #         "s3", 
#         #         region_name=os.environ.get('AWS_REGION'),
#         #         endpoint_url=endpoint_url,
#         #     )
#         #     response = client.upload_file(
#         #         'pie.png',
#         #         os.getenv('S3_BUCKET'),
#         #         'pie.png',
#         #         ExtraArgs={'ACL': 'public-read'}
#         #     )
        

#         return flask.jsonify(message="Success")
#     except requests.exceptions.HTTPError as err:
#         return err.response.text, err.response.status_code 


@app.route("/plot", methods=["POST"])
def plot():
    try:
        req=request.get_json()
        region=req.get("region")
        price_start=req.get("price_start")
        price_end=req.get("price_end")
        year_manufactured=req.get("year_manufactured")

        if region:
            vehicles = list(db.vehicles.find({"region": region,"price":{"$gt": 0 if not price_start else price_start, "$lt":float('inf') if not price_end else price_end}}))
        else:
            vehicles = list(db.vehicles.find({"price":{"$gt": 0 if not price_start else price_start, "$lt":float('inf') if not price_end else price_end}}))
        
        mnf={}
        year={}
        size={}

        for itm in vehicles:
            mnf_temp = itm.get('manufacturer',None)
            year_temp = itm.get('year',None)
            size_temp = itm.get('size',None)
            if mnf_temp:
                mnf[mnf_temp] = mnf.get(mnf_temp,0)+1
            if year_temp:
                year[year_temp] = year.get(year_temp,0)+1
            if size_temp:
                size[size_temp] = size.get(size_temp,0)+1

        # Manufacturer vs No. of vehicles -> bar chart
        manufacturer_label=[key for key in mnf.keys()]
        manufacturer_count=[val for val in mnf.values()]
        matplotlib.pyplot.switch_backend('Agg') 
        sns.set_style('darkgrid')
        plt.figure(figsize = (15,8))
        sns.barplot(manufacturer_label, manufacturer_count)
        plt.xticks(rotation=90)
        plt.xlabel("Manufacturer")
        plt.ylabel("No. of vehicles")
        plt.title(f'Manufacturer vs No of Vehicles for total {len(vehicles)} vehicles')
        plt.show()
        unique_id=uuid.uuid4().hex[:10].upper()
        imgname_manufacturer = "manufacturer-"+unique_id
        plt.savefig('manufacturer.png')
        plt.savefig(f'{imgname_manufacturer}.png')
        plt.close()

        with open(f'{imgname_manufacturer}.png') as pltfile:
            endpoint_url = os.getenv("S3_HOST")
            boto3.setup_default_session(aws_access_key_id=os.getenv('ACCESS_KEY'),
                            aws_secret_access_key=os.getenv('SECRET_KEY'))
            client = boto3.client(
                "s3", 
                region_name=os.environ.get('AWS_REGION'),
                endpoint_url=endpoint_url,
            )
            response = client.upload_file(
                f'{imgname_manufacturer}.png',
                os.getenv('S3_BUCKET'),
                f'{imgname_manufacturer}.png',
                ExtraArgs={'ACL': 'public-read'}
            )


        # Year vs No. of Vehicles -> line chart
        year_label=[key for key in year.keys()]
        year_count=[val for val in year.values()]
        sns.set_theme(style="darkgrid")
        plt.figure(figsize = (15,8))
        sns.lineplot(year_label, year_count)
        plt.xlabel("Year")
        plt.ylabel("No. of vehicles")
        plt.title(f'Make Year vs No of Vehicles for total {len(vehicles)} vehicles')
        plt.show()
        imgname_years = "years-"+unique_id
        plt.savefig(f'{imgname_years}.png')
        plt.close()

        with open(f'{imgname_years}.png') as pltfile:
            endpoint_url = os.getenv("S3_HOST")
            boto3.setup_default_session(aws_access_key_id=os.getenv('ACCESS_KEY'),
                            aws_secret_access_key=os.getenv('SECRET_KEY'))
            client = boto3.client(
                "s3", 
                region_name=os.environ.get('AWS_REGION'),
                endpoint_url=endpoint_url,
            )
            response = client.upload_file(
                f'{imgname_years}.png',
                os.getenv('S3_BUCKET'),
                f'{imgname_years}.png',
                ExtraArgs={'ACL': 'public-read'}
            )

        # Size Pie chart
        
        size_label=[key for key in size.keys()]
        size_count=[val for val in size.values()]
        number_of_colors=len(size_count)
        # colors = random.choices(list(mcolors.CSS4_COLORS.values()),k = number_of_colors)
        hexadecimal_alphabets = '0123456789ABCDEF'
        colors = ["#4A" + ''.join([random.choice(hexadecimal_alphabets) for j in range(4)]) for i in range(number_of_colors)]
        fig, ax = plt.subplots()
        ax.pie(size_count, labels = size_label, colors = colors, autopct='%.0f%%')
        ax.set_title(f'Vehicles size distribution of total {len(vehicles)} vehicles')
        plt.show()
        imgname_pie = "pie-"+unique_id
        plt.savefig(f'{imgname_pie}.png')
        plt.close()


        with open(f'{imgname_pie}.png') as pltfile:
            endpoint_url = os.getenv("S3_HOST")
            boto3.setup_default_session(aws_access_key_id=os.getenv('ACCESS_KEY'),
                            aws_secret_access_key=os.getenv('SECRET_KEY'))
            client = boto3.client(
                "s3", 
                region_name=os.environ.get('AWS_REGION'),
                endpoint_url=endpoint_url,
            )
            response = client.upload_file(
                f'{imgname_pie}.png',
                os.getenv('S3_BUCKET'),
                f'{imgname_pie}.png',
                ExtraArgs={'ACL': 'public-read'}
            )
    
        image_links={
            "manufacturer":f'https://s3.us-east-2.amazonaws.com/vehicles-plot/{imgname_manufacturer}.png',
            "years":f'https://s3.us-east-2.amazonaws.com/vehicles-plot/{imgname_years}.png',
            "pie":f'https://s3.us-east-2.amazonaws.com/vehicles-plot/{imgname_pie}.png'
        }
        return flask.jsonify(image_links)
    except requests.exceptions.HTTPError as err:
        return err.response.text, err.response.status_code 

       

if __name__ == "__main__":
    # app.secret_key = 'super secret key'
    app.run(host='0.0.0.0', port=5000, debug=True)
