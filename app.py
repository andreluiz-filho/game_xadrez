from flask import Flask, render_template, redirect
from datetime import datetime
import json
import os

app = Flask(__name__)

@app.route("/")
def index():

    rows = [8, 7, 6, 5, 4, 3, 2, 1]
    letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

    arquivo = [i for i in os.listdir("dados/partidas") if ".json" in i]
    with open(f"dados/partidas/{arquivo[0]}") as arq:
        partida = json.load(arq)

    partida = str(partida).replace("'", "\"")

    return render_template("index.html", 
                            rows=rows, 
                            letras=letras,
                            partida=partida
                            )


@app.route("/new_game")
def new_game():

    rows = [8, 7, 6, 5, 4, 3, 2, 1]
    letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

    partida = {
                "status": "aberta",
                "pecas":[
                    {"nome_peca": "branca__torre_1", "posicao":"a8", "imagem":"static/img/pecas/branca_torre.png"}, 
                    {"nome_peca": "branca__cavalo_1", "posicao":"b8", "imagem":"static/img/pecas/branca_cavalo.png"}, 
                    {"nome_peca": "branca__bispo_1", "posicao":"c8", "imagem":"static/img/pecas/branca_bispo.png"}, 
                    {"nome_peca": "branca__rainha", "posicao":"d8", "imagem":"static/img/pecas/branca_rainha.png"},
                    {"nome_peca": "branca__rei", "posicao":"e8", "imagem":"static/img/pecas/branca_rei.png"},
                    {"nome_peca": "branca__bispo_2", "posicao":"f8", "imagem":"static/img/pecas/branca_bispo.png"},
                    {"nome_peca": "branca__cavalo_2", "posicao":"g8", "imagem":"static/img/pecas/branca_cavalo.png"},
                    {"nome_peca": "branca__torre_2", "posicao":"h8", "imagem":"static/img/pecas/branca_torre.png"},
                    {"nome_peca": "branca__peao_1", "posicao":"a7", "imagem":"static/img/pecas/branca_peao.png"},
                    {"nome_peca": "branca__peao_2", "posicao":"b7", "imagem":"static/img/pecas/branca_peao.png"},
                    {"nome_peca": "branca__peao_3", "posicao":"c7", "imagem":"static/img/pecas/branca_peao.png"},
                    {"nome_peca": "branca__peao_4", "posicao":"d7", "imagem":"static/img/pecas/branca_peao.png"},
                    {"nome_peca": "branca__peao_5", "posicao":"e7", "imagem":"static/img/pecas/branca_peao.png"},
                    {"nome_peca": "branca__peao_6", "posicao":"f7", "imagem":"static/img/pecas/branca_peao.png"},
                    {"nome_peca": "branca__peao_7", "posicao":"g7", "imagem":"static/img/pecas/branca_peao.png"},
                    {"nome_peca": "branca__peao_8", "posicao":"h7", "imagem":"static/img/pecas/branca_peao.png"},
                    {"nome_peca": "preta__torre_1", "posicao":"a1", "imagem":"static/img/pecas/preta_torre.png"}, 
                    {"nome_peca": "preta__cavalo_1", "posicao":"b1", "imagem":"static/img/pecas/preta_cavalo.png"}, 
                    {"nome_peca": "preta__bispo_1", "posicao":"c1", "imagem":"static/img/pecas/preta_bispo.png"}, 
                    {"nome_peca": "preta__rainha", "posicao":"d1", "imagem":"static/img/pecas/preta_rainha.png"},
                    {"nome_peca": "preta__rei", "posicao":"e1", "imagem":"static/img/pecas/preta_rei.png"},
                    {"nome_peca": "preta__bispo_2", "posicao":"f1", "imagem":"static/img/pecas/preta_bispo.png"},
                    {"nome_peca": "preta__cavalo_2", "posicao":"g1", "imagem":"static/img/pecas/preta_cavalo.png"},
                    {"nome_peca": "preta__torre_2", "posicao":"h1", "imagem":"static/img/pecas/preta_torre.png"},
                    {"nome_peca": "preta__peao_1", "posicao":"a2", "imagem":"static/img/pecas/preta_peao.png"},
                    {"nome_peca": "preta__peao_2", "posicao":"b2", "imagem":"static/img/pecas/preta_peao.png"},
                    {"nome_peca": "preta__peao_3", "posicao":"c2", "imagem":"static/img/pecas/preta_peao.png"},
                    {"nome_peca": "preta__peao_4", "posicao":"d2", "imagem":"static/img/pecas/preta_peao.png"},
                    {"nome_peca": "preta__peao_5", "posicao":"e2", "imagem":"static/img/pecas/preta_peao.png"},
                    {"nome_peca": "preta__peao_6", "posicao":"f2", "imagem":"static/img/pecas/preta_peao.png"},
                    {"nome_peca": "preta__peao_7", "posicao":"g2", "imagem":"static/img/pecas/preta_peao.png"},
                    {"nome_peca": "preta__peao_8", "posicao":"h2", "imagem":"static/img/pecas/preta_peao.png"},
                ]
        }


    data = datetime.now()
    dia = data.day
    mes = data.month
    ano = data.year

    hora = data.hour
    minuto = data.minute
    segundo = data.second

    if dia < 10:
        dia = "0{}".format(dia)
    if mes < 10:
        mes = "0{}".format(mes)
    if hora < 10:
        hora = "0{}".format(hora)
    if minuto < 10:
        minuto = "0{}".format(minuto)
    if segundo < 10:
        segundo = "0{}".format(segundo)

    data_formatada = "{}_{}_{}_{}_{}_{}".format(dia, mes, ano, hora, minuto, segundo)

    with open(f"dados/partidas/partida_{data_formatada}.json", "w") as arq:
        json.dump(partida, arq)

    return redirect("/")