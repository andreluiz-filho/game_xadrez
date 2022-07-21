from flask import Flask, request, render_template, redirect, jsonify
from datetime import datetime
import json
import os
import secrets

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

@app.route("/entrarPartida", methods=["POST"])
def entrar_partida():

    data = json.loads(request.data)
    usuario = data['usuario']
    chave_partida = data['chave_partida']

    arquivo = [i for i in os.listdir('dados') if 'usuarios.json' in i]

    if arquivo:
        with open('dados/usuarios.json') as arq:
            dados = json.load(arq)

        user = usuario in dados
        if user:
            chave_partida = chave_partida+".json"
            arquivo = [i for i in os.listdir("dados/partidas/em_andamento") if chave_partida in i]
            if arquivo:

                with open(f"dados/partidas/em_andamento/{arquivo[0]}") as arq:
                    partida = json.load(arq)

                if partida['jogador_branca'] == usuario:
                    chave_partida = chave_partida.split(".")[0]
                    return jsonify({"chave_partida":chave_partida})

                elif partida['jogador_preta'] == "" or partida['jogador_preta'] == usuario:
                    partida['jogador_preta'] = usuario

                    with open(f"dados/partidas/em_andamento/{chave_partida}", "w") as arq:
                        json.dump(partida, arq)

                    chave_partida = chave_partida.split(".")[0]
                    return jsonify({"chave_partida":chave_partida})

                return jsonify({"erro": "Falha ao Entrar na  Partida"})

    return jsonify({"erro": "Falha ao Entrar na  Partida"})

#----------------------------------------------------------------------------

@app.route("/novaPartida", methods=["POST"])
def nova_partida():

    usuario = json.loads(request.data)
    usuario = usuario['usuario']

    arquivo = [i for i in os.listdir('dados') if 'usuarios.json' in i]

    if arquivo:
        with open('dados/usuarios.json') as arq:
            dados = json.load(arq)

        user = usuario in dados
        if user:
            
            chave_sala = secrets.token_hex(10)

            partida = {
                        "status": "aberta",
                        "jogador_branca":usuario, 
                        "jogador_preta":"",
                        "jogador_da_vez":"jogador_branca",
                        "pecas":[
                            {"nome_peca": "branca__torre_1", "posicao":"a1", "imagem":"static/img/pecas/branca_torre.png", "capturada":"false"}, 
                            {"nome_peca": "branca__cavalo_1", "posicao":"b1", "imagem":"static/img/pecas/branca_cavalo.png", "capturada":"false"}, 
                            {"nome_peca": "branca__bispo_1", "posicao":"c1", "imagem":"static/img/pecas/branca_bispo.png", "capturada":"false"}, 
                            {"nome_peca": "branca__rainha", "posicao":"d1", "imagem":"static/img/pecas/branca_rainha.png", "capturada":"false"},
                            {"nome_peca": "branca__rei", "posicao":"e1", "imagem":"static/img/pecas/branca_rei.png", "capturada":"false"},
                            {"nome_peca": "branca__bispo_2", "posicao":"f1", "imagem":"static/img/pecas/branca_bispo.png", "capturada":"false"},
                            {"nome_peca": "branca__cavalo_2", "posicao":"g1", "imagem":"static/img/pecas/branca_cavalo.png", "capturada":"false"},
                            {"nome_peca": "branca__torre_2", "posicao":"h1", "imagem":"static/img/pecas/branca_torre.png", "capturada":"false"},
                            {"nome_peca": "branca__peao_1", "posicao":"a2", "imagem":"static/img/pecas/branca_peao.png", "capturada":"false"},
                            {"nome_peca": "branca__peao_2", "posicao":"b2", "imagem":"static/img/pecas/branca_peao.png", "capturada":"false"},
                            {"nome_peca": "branca__peao_3", "posicao":"c2", "imagem":"static/img/pecas/branca_peao.png", "capturada":"false"},
                            {"nome_peca": "branca__peao_4", "posicao":"d2", "imagem":"static/img/pecas/branca_peao.png", "capturada":"false"},
                            {"nome_peca": "branca__peao_5", "posicao":"e2", "imagem":"static/img/pecas/branca_peao.png", "capturada":"false"},
                            {"nome_peca": "branca__peao_6", "posicao":"f2", "imagem":"static/img/pecas/branca_peao.png", "capturada":"false"},
                            {"nome_peca": "branca__peao_7", "posicao":"g2", "imagem":"static/img/pecas/branca_peao.png", "capturada":"false"},
                            {"nome_peca": "branca__peao_8", "posicao":"h2", "imagem":"static/img/pecas/branca_peao.png", "capturada":"false"},
                            {"nome_peca": "preta__torre_1", "posicao":"a8", "imagem":"static/img/pecas/preta_torre.png", "capturada":"false"}, 
                            {"nome_peca": "preta__cavalo_1", "posicao":"b8", "imagem":"static/img/pecas/preta_cavalo.png", "capturada":"false"}, 
                            {"nome_peca": "preta__bispo_1", "posicao":"c8", "imagem":"static/img/pecas/preta_bispo.png", "capturada":"false"}, 
                            {"nome_peca": "preta__rainha", "posicao":"d8", "imagem":"static/img/pecas/preta_rainha.png", "capturada":"false"},
                            {"nome_peca": "preta__rei", "posicao":"e8", "imagem":"static/img/pecas/preta_rei.png", "capturada":"false"},
                            {"nome_peca": "preta__bispo_2", "posicao":"f8", "imagem":"static/img/pecas/preta_bispo.png", "capturada":"false"},
                            {"nome_peca": "preta__cavalo_2", "posicao":"g8", "imagem":"static/img/pecas/preta_cavalo.png", "capturada":"false"},
                            {"nome_peca": "preta__torre_2", "posicao":"h8", "imagem":"static/img/pecas/preta_torre.png", "capturada":"false"},
                            {"nome_peca": "preta__peao_1", "posicao":"a7", "imagem":"static/img/pecas/preta_peao.png", "capturada":"false", "rainha":"false"},
                            {"nome_peca": "preta__peao_2", "posicao":"b7", "imagem":"static/img/pecas/preta_peao.png", "capturada":"false", "rainha":"false"},
                            {"nome_peca": "preta__peao_3", "posicao":"c7", "imagem":"static/img/pecas/preta_peao.png", "capturada":"false", "rainha":"false"},
                            {"nome_peca": "preta__peao_4", "posicao":"d7", "imagem":"static/img/pecas/preta_peao.png", "capturada":"false", "rainha":"false"},
                            {"nome_peca": "preta__peao_5", "posicao":"e7", "imagem":"static/img/pecas/preta_peao.png", "capturada":"false", "rainha":"false"},
                            {"nome_peca": "preta__peao_6", "posicao":"f7", "imagem":"static/img/pecas/preta_peao.png", "capturada":"false", "rainha":"false"},
                            {"nome_peca": "preta__peao_7", "posicao":"g7", "imagem":"static/img/pecas/preta_peao.png", "capturada":"false", "rainha":"false"},
                            {"nome_peca": "preta__peao_8", "posicao":"h7", "imagem":"static/img/pecas/preta_peao.png", "capturada":"false", "rainha":"false"},
                        ]
                }

            with open(f"dados/partidas/em_andamento/{chave_sala}.json", "w") as arq:
                json.dump(partida, arq)

            with open(f"dados/partidas/em_andamento/jogador_da_vez.json", "w") as arq:
                json.dump({"jogador": usuario}, arq)

            return jsonify({"chave_sala":chave_sala})
        else:
            return redirect("/api_login_usuario")
    else:
        return redirect("/api_login_usuario")

#----------------------------------------------------------------------------

@app.route("/api_partida", methods=['POST'])
def api_partida():

    chave_partida = json.loads(request.data)

    chave_partida = chave_partida['chave_partida']
    chave_partida = chave_partida+".json"
    
    arquivo = [i for i in os.listdir("dados/partidas/em_andamento") if chave_partida in i]
    with open(f"dados/partidas/em_andamento/{arquivo[0]}") as arq:
        partida = json.load(arq)

    return jsonify(partida)

#----------------------------------------------------------------------------

@app.route('/api_moverPeca', methods=['POST'])
def api_moverPeca():

    #---------------------------------------------------------------------

    def consulta_Partida():
        arquivo = [i for i in os.listdir("dados/partidas/em_andamento") if chave_partida in i]
        with open(f"dados/partidas/em_andamento/{arquivo[0]}") as arq:
            partida = json.load(arq)
        return partida

    #---------------------------------------------------------------------
    
    def salva_Partida(data):
        arquivo = [i for i in os.listdir("dados/partidas/em_andamento") if chave_partida in i]
        with open(f"dados/partidas/em_andamento/{arquivo[0]}", "w") as arq:
            json.dump(data, arq)

    #---------------------------------------------------------------------

    peca_selecionada = json.loads(request.data)
    
    usuario                 = peca_selecionada['usuario']
    chave_partida           = peca_selecionada['chave_partida']

    peca_selecionada_nome   = peca_selecionada['peca_selecionada_nome']
    target_posicao          = peca_selecionada['target_posicao']
    
    partida = consulta_Partida()
    jogador_da_vez = partida['jogador_da_vez']

    if usuario == partida[jogador_da_vez]:

        if peca_selecionada_nome.split("_")[0] == jogador_da_vez.split("_")[1]:
            
            if peca_selecionada['funcao'] == 'capturar':
                
                peca_target_nome  = peca_selecionada['peca_target_nome']

                for i in partida['pecas']:

                    if peca_target_nome == i['nome_peca']:
                        i['capturada'] = 'true'

                    if peca_selecionada_nome == i['nome_peca']:
                        i['posicao'] = target_posicao

                    if jogador_da_vez == 'jogador_preta':
                        partida['jogador_da_vez'] = 'jogador_branca'

                    if jogador_da_vez == 'jogador_branca':
                        partida['jogador_da_vez'] = 'jogador_preta'
                    
                salva_Partida(partida)
                
                return jsonify(partida)

                
            elif peca_selecionada['funcao'] == 'mover':
                
                
                for i in partida['pecas']:
                    if peca_selecionada_nome == i['nome_peca']:
                        i["posicao"] = target_posicao
                        if jogador_da_vez == 'jogador_preta':
                            partida['jogador_da_vez'] = 'jogador_branca'
                        elif jogador_da_vez == 'jogador_branca':
                            partida['jogador_da_vez'] = 'jogador_preta'

                salva_Partida(partida)
                
                return jsonify(partida)

        else:
            return jsonify({'erro':'Não pode mover essa Peça'})  
    else:
        return jsonify({'erro':'Não é a sua vez'})        

#----------------------------------------------------------------------------

@app.route('/api_login_usuario', methods=['POST'])
def api_login_usuario():

    usuario = json.loads(request.data)
    usuario = usuario['usuario']
    
    arquivo = [i for i in os.listdir('dados') if 'usuarios.json' in i]
    
    if arquivo:
        with open('dados/usuarios.json') as arq:
            dados = json.load(arq)

        user = usuario in dados
        if user:
            return jsonify({'usuario':usuario})

    return jsonify({'erro':'Login Incorreto'})
    
#----------------------------------------------------------------------------

@app.route('/api_criar_usuario', methods=['GET', 'POST'])
def api_criar_usuario():

    #usuario = json.loads(request.data)

    arquivo = [i for i in os.listdir('dados') if 'usuarios.json' in i]
    
    if arquivo:
        with open('dados/usuarios.json') as arq:
            dados = json.load(arq)

        print(dados)
    else:
        with open('dados/usuarios.json', "w") as arq:
            lista_usuarios = ['admin']
            json.dump(lista_usuarios, arq)


    return jsonify({'status':'Usuario criado com sucesso'})

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
