from flask import Flask, render_template, redirect, url_for,request
from flask import make_response
#from flask_cors import CORS
import requests
app = Flask(__name__, template_folder='', static_folder='dist')
#CORS(app)

@app.route("/")
def home():
        return render_template("./index.html")
@app.route("/index")

@app.route("/klopapier")
def klopapier():
    url = 'https://products.dm.de/store-availability/DE/availability?dans=595420,708997,137425,28171,485698,799358,863567,452740,610544,846857,709006,452753,879536,452744,485695,853483,594080,504606,593761,525943,842480,535981,127048,524535&storeNumbers=915,185,1963,2063,275,2825,2831,292,333,445,518,1017,1096,1117,1507,152,1538'
    res = requests.get(url)
    response = make_response(res.json())
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

@app.route('/login', methods=['GET', 'POST'])
def login():
   message = None
   if request.method == 'POST':
        datafromjs = request.form['mydata']
        result = "return this"
        resp = make_response('{"response": '+result+'}')
        resp.headers['Content-Type'] = "application/json"
        return resp
        return render_template('login.html', message='')

if __name__ == "__main__":
    app.run(host='0.0.0.0')
