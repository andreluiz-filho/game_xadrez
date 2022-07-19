from flask import Flask, request, render_template, redirect, jsonify
from datetime import datetime
import json
import os

app = Flask(__name__)


#----------------------------------------------------------------------------

@app.route("/")
def login():
    return render_template("login.html") 

#----------------------------------------------------------------------------

@app.route("/partida")
def index():
    return render_template("index.html") 

#----------------------------------------------------------------------------

@app.route("/novaPartida", methods=["POST"])
def nova_partida():

    chave_sala = "dhsjdhkjshdksk"

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

    with open(f"dados/partidas/em_andamento/{chave_sala}.json", "w") as arq:
        json.dump(partida, arq)

    return jsonify({"chave_sala":chave_sala})

#----------------------------------------------------------------------------

@app.route("/api_partida", methods=['POST'])
def api_partida():

    chave_partida = json.loads(request.data)
    chave_partida = chave_partida['chave_partida']
    
    arquivo = [i for i in os.listdir("dados/partidas/em_andamento") if chave_partida in i]
    with open(f"dados/partidas/em_andamento/{arquivo[0]}") as arq:
        partida = json.load(arq)
    

    return jsonify(partida)

#----------------------------------------------------------------------------

@app.route('/api_moverPeca', methods=['POST'])
def api_moverPeca():

    peca_selecionada = json.loads(request.data)

    nome_peca       = peca_selecionada['nome_peca']
    posicao_atual   = peca_selecionada['posicao_atual']
    posicao_nova    = peca_selecionada['posicao_nova']
    chave_partida    = peca_selecionada['chave_partida']
    

    arquivo = [i for i in os.listdir("dados/partidas/em_andamento") if chave_partida in i]
    with open(f"dados/partidas/em_andamento/{arquivo[0]}") as arq:
        partida = json.load(arq)

    for i in partida['pecas']:
        if nome_peca == i['nome_peca']:
            i["posicao"] = posicao_nova

    arquivo = [i for i in os.listdir("dados/partidas/em_andamento") if chave_partida in i]
    with open(f"dados/partidas/em_andamento/{arquivo[0]}", "w") as arq:
        json.dump(partida, arq)


    return jsonify(partida)

#----------------------------------------------------------------------------

"""
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

    with open(f"dados/partidas/em_andamento/partida_{data_formatada}.json", "w") as arq:
        json.dump(partida, arq)

    return redirect("/")

#----------------------------------------------------------------------------

@app.route('/moverPeca', methods=['POST'])
def update_record():
    dados = json.loads(request.data)
    print(dados)
    if dados['nome_peca'] == "":
        mover_peca_para = dados["posicao"]
        print(mover_peca_para)

        with open("dados/partidas/em_andamento/ultima_jogada.json") as arq:
            ultima_jogada = json.load(arq)


        arquivo = [i for i in os.listdir("dados/partidas/em_andamento") if "partida_" in i]
        with open(f"dados/partidas/em_andamento/{arquivo[0]}") as arq:
            partida = json.load(arq)


        for pecas in partida["pecas"]:
            if pecas['nome_peca'] == ultima_jogada["nome_peca"]:
                print(pecas)
                print(mover_peca_para)
                pecas["posicao"] = mover_peca_para


        arquivo = [i for i in os.listdir("dados/partidas/em_andamento") if "partida_" in i]
        with open(f"dados/partidas/em_andamento/{arquivo[0]}", "w") as arq:
            json.dump(partida, arq)

    else:
        with open("dados/partidas/em_andamento/ultima_jogada.json", "w") as arq:
            json.dump(dados, arq)
    
    #dados.headers.add("Access-Control-Allow-Origin", "*")
    #print(dados)
    return jsonify(dados)
"""
#----------------------------------------------------------------------------
