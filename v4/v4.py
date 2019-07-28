from flask import Flask, render_template
import pandas as pd
import os

app = Flask(__name__)

raw_data=pd.read_csv('static/data/database.csv')

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/getData/<int:minprice>/<int:maxprice>/<string:countries>/<string:words>/<float:minrating>')
def getData(minprice,maxprice,countries,words,minrating):
	return {
	"filters": (minprice,maxprice,countries.split(','),words.split(','),minrating)
	}