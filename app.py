from flask import Flask, request, render_template, redirect, jsonify
from flask import url_for
from datetime import datetime
import json
import os
import secrets

app = Flask(__name__)

app.config.update(
    SECRET_KEY="secret_sauce",
)

#----------------------------------------------------------------------------

@app.route("/")
def login():
    return render_template("login.html") 

#----------------------------------------------------------------------------

@app.route("/partida")
def index():
    return render_template("index.html") 

#----------------------------------------------------------------------------

@app.route("/entrarPartida", methods=["GET", "POST"])
def entrar_partida():
    # 192.168.0.219:5000/entrarPartida?usuario=teste02&id_partida=2937e46c0dafa6c58fd8

    metodo_dados = ""
    if request.data:
        dados = json.loads(request.data)
        usuario = dados['usuario']
        id_partida = dados['id_partida']
        metodo_dados = 'post'

    dict_dados = {}
    if request.args:
        for i in request.args:
            dict_dados[i] = request.args[i]

    if dict_dados:
        usuario = dict_dados['usuario']
        id_partida = dict_dados['id_partida']
        metodo_dados = 'get'


    arquivo_user = [i for i in os.listdir('dados') if 'usuarios.json' in i]

    if arquivo_user:
        with open('dados/usuarios.json') as arq:
            dados = json.load(arq)

        user = usuario in dados
        if user:
            id_partida = id_partida+".json"
            arquivo_id_partida = [i for i in os.listdir("dados/partidas/em_andamento") if id_partida in i]
            if arquivo_id_partida:

                with open(f"dados/partidas/em_andamento/{arquivo_id_partida[0]}") as arq:
                    partida = json.load(arq)

                if partida['jogador_branca'] == usuario:
                    id_partida = id_partida.split(".")[0]
                    
                    dados_returno = {
                        "usuario":usuario,
                        "id_partida":id_partida, 
                        "jogador_da_vez":partida['jogador_da_vez'], 
                        "cor_da_vez":partida['cor_da_vez'],
                        "usuario_cor":"branca"
                    }

                    if metodo_dados == 'get':
                        #return redirect(url_for("index", dados_returno=dados_returno))
                        return render_template("index.html", dados_returno=dados_returno)

                    elif metodo_dados == 'post':
                        return jsonify(dados_returno)

                elif partida['jogador_preta'] == "" or partida['jogador_preta'] == usuario:
                    partida['jogador_preta'] = usuario

                    with open(f"dados/partidas/em_andamento/{id_partida}", "w") as arq:
                        json.dump(partida, arq)

                    id_partida = id_partida.split(".")[0]
                    
                    dados_returno = {
                        "usuario":usuario,
                        "id_partida":id_partida, 
                        "jogador_da_vez":partida['jogador_da_vez'], 
                        "cor_da_vez":partida['cor_da_vez'],
                        "usuario_cor":"preta"
                    }

                    if metodo_dados == 'get':
                        #return redirect(url_for("index", dados_returno=dados_returno))
                        return render_template("index.html", dados_returno=dados_returno)

                    elif metodo_dados == 'post':
                        return jsonify(dados_returno)

                else:
                    id_partida = id_partida.split(".")[0]
                    dados_returno = {
                        "usuario":usuario,
                        "id_partida":id_partida, 
                        "jogador_da_vez":partida['jogador_da_vez'], 
                        "cor_da_vez":partida['cor_da_vez'],
                        "usuario_cor":"",
                        "visitante":"true"
                    }
                    print("***Visitante Convidado")
                    print(dados_returno)
                    return render_template("index.html", dados_returno=dados_returno)



                #Usuario não esta na Partida
                if metodo_dados == 'get':
                    return redirect("/")

                elif metodo_dados == 'post':
                    return jsonify({"erro": "Falha ao Entrar na  Partida"})
    
    if metodo_dados == 'get':
        return redirect("/")

    elif metodo_dados == 'post':
        return jsonify({"erro": "Falha ao Entrar na  Partida"})
    #return jsonify({"erro": "Falha ao Entrar na  Partida"})

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
            
            id_partida = secrets.token_hex(10)

            partida = {
                        "status": "aberta",
                        "jogador_branca":usuario, 
                        "jogador_preta":"",
                        "jogador_da_vez":usuario,
                        "cor_da_vez":"branca",
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

            with open(f"dados/partidas/em_andamento/{id_partida}.json", "w") as arq:
                json.dump(partida, arq)

            dados_returno = {
                    "id_partida":id_partida, 
                    "jogador_da_vez":partida['jogador_da_vez'], 
                    "cor_da_vez":partida['cor_da_vez'],
                    "usuario_cor":"branca"
                    }

            return jsonify(dados_returno)
        else:
            return redirect("/api_login_usuario")
    else:
        return redirect("/api_login_usuario")

#----------------------------------------------------------------------------

@app.route("/api_partida", methods=['POST'])
def api_partida():

    id_partida = json.loads(request.data)

    id_partida = id_partida['id_partida']
    id_partida = id_partida+".json"
    
    arquivo = [i for i in os.listdir("dados/partidas/em_andamento") if id_partida in i]
    if arquivo:
        
        with open(f"dados/partidas/em_andamento/{arquivo[0]}") as arq:
            partida = json.load(arq)
        
        return jsonify(partida)
    else:
        return jsonify({"erro":"ID da Partida Inválido"})

#----------------------------------------------------------------------------

@app.route('/api_moverPeca', methods=['POST'])
def api_moverPeca():

    #---------------------------------------------------------------------

    def consulta_Partida():
        arquivo = [i for i in os.listdir("dados/partidas/em_andamento") if id_partida in i]
        with open(f"dados/partidas/em_andamento/{arquivo[0]}") as arq:
            partida = json.load(arq)
        return partida

    #---------------------------------------------------------------------
    
    def salva_Partida(data):
        arquivo = [i for i in os.listdir("dados/partidas/em_andamento") if id_partida in i]
        with open(f"dados/partidas/em_andamento/{arquivo[0]}", "w") as arq:
            json.dump(data, arq)

    #---------------------------------------------------------------------

    peca_selecionada = json.loads(request.data)
    
    usuario                 = peca_selecionada['usuario']
    usuario_cor             = peca_selecionada['usuario_cor']
    id_partida           = peca_selecionada['id_partida']

    peca_selecionada_nome   = peca_selecionada['peca_selecionada_nome']
    target_posicao          = peca_selecionada['target_posicao']
    
    partida = consulta_Partida()
    jogador_da_vez = partida['jogador_da_vez']

    if usuario == jogador_da_vez:

        peca_selecionada_cor = peca_selecionada_nome.split("_")[0]

        if peca_selecionada_cor == usuario_cor:
            
            if peca_selecionada['funcao'] == 'capturar':
                
                peca_target_nome  = peca_selecionada['peca_target_nome']

                for i in partida['pecas']:

                    if peca_target_nome == i['nome_peca']:
                        i['capturada'] = 'true'

                    if peca_selecionada_nome == i['nome_peca']:
                        i['posicao'] = target_posicao

                    if usuario_cor == 'branca':
                        partida['jogador_da_vez'] = partida['jogador_preta']
                        partida['cor_da_vez'] = 'preta'
                        

                    elif usuario_cor == 'preta':
                        partida['jogador_da_vez'] = partida['jogador_branca']
                        partida['cor_da_vez'] = 'branca'
                    
                salva_Partida(partida)
                
                return jsonify(partida)

                
            elif peca_selecionada['funcao'] == 'mover':

                for i in partida['pecas']:
                    if peca_selecionada_nome == i['nome_peca']:
                        i["posicao"] = target_posicao

                        if usuario_cor == 'branca':
                            partida['jogador_da_vez'] = partida['jogador_preta']
                            partida['cor_da_vez'] = 'preta'
                            

                        elif usuario_cor == 'preta':
                            partida['jogador_da_vez'] = partida['jogador_branca']
                            partida['cor_da_vez'] = 'branca'

                salva_Partida(partida)
                
                return jsonify(partida)

        else:
            return jsonify({'erro':'Não pode mover essa Peça'})  
    else:
        return jsonify({'erro':'Não é a sua vez'})        

#----------------------------------------------------------------------------

@app.route('/api_login_usuario', methods=['GET', 'POST'])
def api_login_usuario():

    metodo_dados = ""
    if request.data:
        dados = json.loads(request.data)
        usuario = dados['usuario']
        id_partida = dados['id_partida']
        metodo_dados = 'post'

    dict_dados = {}
    if request.args:
        for i in request.args:
            dict_dados[i] = request.args[i]

    if dict_dados:
        usuario = dict_dados['usuario']
        id_partida = dict_dados['id_partida']
        metodo_dados = 'get'

    arquivo_user = [i for i in os.listdir('dados') if 'usuarios.json' in i]
    
    if arquivo_user:
        with open('dados/usuarios.json') as arq:
            dados = json.load(arq)

        user = usuario in dados
        if user:

            if id_partida:

                id_partida = id_partida+".json"
                
                arquivo_id_partida = [i for i in os.listdir("dados/partidas/em_andamento") if id_partida in i]
                if arquivo_id_partida:
                    
                    with open(f"dados/partidas/em_andamento/{arquivo_id_partida[0]}") as arq:
                        partida = json.load(arq)
                    
                    partida['usuario'] = usuario
                    partida['id_partida'] = id_partida.split(".")[0]

                    if usuario == partida['jogador_branca']:
                        partida["usuario_cor"] = "branca"

                    elif usuario == partida['jogador_preta']:
                        partida["usuario_cor"] = "preta"

                    if metodo_dados == 'post':
                        return jsonify(partida)
                    elif metodo_dados == 'get':
                        return redirect("/")
                else:
                    return jsonify({"erro":"ID da Partida Inválido"})
            else:
                return jsonify({"usuario":usuario})
    
    return jsonify({'erro':'Login Incorreto'})
    
#----------------------------------------------------------------------------

@app.route('/api_criar_usuario', methods=['GET', 'POST'])
def api_criar_usuario():

    #usuario = json.loads(request.data)

    arquivo = [i for i in os.listdir('dados') if 'usuarios.json' in i]
    
    if arquivo:
        with open('dados/usuarios.json') as arq:
            dados = json.load(arq)

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
