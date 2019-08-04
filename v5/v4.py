from flask import Flask, render_template
import pandas as pd
import os

app = Flask(__name__)

raw_data=pd.read_csv('static/data/database.csv')

@app.route('/')
def index():
	return render_template('index.html')



@app.route('/getData')
# def getData(min_price,max_price,countries,ratings):
def getData():
	# raw_data["price"]=[float((x.split('R$')[1])[:-1]) for x in raw_data.price]
	# filtered_data=raw_data[raw_data.price>=min_price].copy()
	# filtered_data=filtered_data[filtered_data<=max_price]
	# filtered_data=filtered_data[filtered_data.country in countries]
	# filtered_data=filtered_data[filtered_data.rating>=ratings]

	filtered_data=raw_data.copy()

	filtered_data["grapes"]=[grape[1:].replace('\n','') if grape[0]==' ' else grape.replace('\n','') for grape in filtered_data.grapes]

	db=filtered_data[["types","grapes"]].copy()

	db['count']=1

	db["grapes"]=[x.split(',') for x in db["grapes"]]

	rows=[]
	_=db.apply(lambda row: [rows.append([row['types'], nn]) 
	                         for nn in row.grapes], axis=1)
	data_new=pd.DataFrame(rows)
	data_new

	data_new[1]=[x.strip() for x in data_new[1]]
	data_new.rename(columns={0:"Type",1:"Grape"}, inplace=True)
	dt=data_new.groupby(by=["Type","Grape"]).size().copy()
	dt=pd.DataFrame(dt)
	dt.reset_index(inplace=True)
	dt.rename(columns={0:"Count"}, inplace=True)
	dt.index.names=['id']
	return dt.to_csv()