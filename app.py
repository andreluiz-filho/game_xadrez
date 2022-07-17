from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():

    rows = [8, 7, 6, 5, 4, 3, 2, 1]
    letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

    return render_template("index.html", rows=rows, letras=letras)