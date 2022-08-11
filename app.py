from flask import Flask, request, render_template, redirect, jsonify
from flask_socketio import SocketIO, emit, join_room
from cryptography.fernet import Fernet
from flask import url_for
from datetime import datetime
import json
import os
import shutil
import secrets

app = Flask(__name__)

app.config.update(
    SECRET_KEY="hfuohfuiew9u9fewuifd",
)

io = SocketIO(app)

caminho_partidas = "dados/partidas"
caminho_partidas_em_andamento = caminho_partidas+"/em_andamento/"

#----------------------------------------------------------------------------

lista_clientes_conectados = []
"""
{
    "id_partida": "3ye3yuihkehdkqhbekbjq",
    "clientes": ["websocket1", "websocket2"]
    }
"""

#----------------------------------------------------------------------------

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

    dados = json.loads(request.data)
    usuario = dados['usuario']
    id_partida = dados['id_partida']

    arquivo_user = [i for i in os.listdir('dados') if 'usuarios.json' in i]

    if arquivo_user:
        with open('dados/usuarios.json') as arq:
            dados = json.load(arq)

        user = usuario in dados
        if user:
            pasta_partida = [i for i in os.listdir(caminho_partidas_em_andamento) if id_partida in i]

            if pasta_partida:
                caminho_pasta_partida = caminho_partidas_em_andamento+id_partida

                arquivo_partida = [i for i in os.listdir(caminho_pasta_partida) if "ultima_jogada" not in i and "mensagens_chat" not in i]

                with open(f"{caminho_pasta_partida}/{arquivo_partida[0]}") as arq:
                    partida = json.load(arq)
                
                if partida['jogador_branca'] == usuario:

                    id_partida = id_partida.split(".")[0]
                    
                    dados_returno = {
                        "usuario":usuario,
                        "usuario_cor":"branca",
                        "id_partida":id_partida, 
                        "jogador_da_vez":partida['jogador_da_vez'],
                        "cor_da_vez":partida['cor_da_vez'],
                        "jogador_branca":partida['jogador_branca'],
                        "jogador_preta":partida['jogador_preta']
                    }

                    return jsonify(dados_returno)

                elif partida['jogador_preta'] == "" or partida['jogador_preta'] == usuario:
                    partida['jogador_preta'] = usuario

                    id_partida = id_partida.split(".")[0]
                    
                    dados_returno = {
                        "usuario":usuario,
                        "usuario_cor":"preta",
                        "id_partida":id_partida, 
                        "jogador_da_vez":partida['jogador_da_vez'],
                        "cor_da_vez":partida['cor_da_vez'],
                        "jogador_branca":partida['jogador_branca'],
                        "jogador_preta":partida['jogador_preta']
                    }

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

                    return render_template("index.html", dados_returno=dados_returno)
                
                
    return jsonify({"erro": "Falha ao Entrar na  Partida"})

#----------------------------------------------------------------------------

@app.route("/novaPartida", methods=["POST"])
def nova_partida():

    dados_request = json.loads(request.data)
    usuario = dados_request['usuario']
    usuario_adversario = dados_request['usuario_adversario']

    arquivo = [i for i in os.listdir('dados') if 'usuarios.json' in i]

    if arquivo:
        with open('dados/usuarios.json') as arq:
            dados = json.load(arq)

        user = usuario in dados
        if user:
            
            id_partida = secrets.token_hex(10)

            partida = {
                        "status": "aberta",
                        "xeque_mate": "false",
                        "xeque_mate_usuario": "",
                        "xeque_mate_usuario": "",
                        "ultimo_movimento":[],
                        "jogador_branca":usuario, 
                        "jogador_preta":usuario_adversario,
                        "jogador_da_vez":usuario,
                        "cor_da_vez":"branca",
                        "pecas":[
                            {"nome_peca": "branca__torre_1", "posicao":"a1", "capturada":"false"}, 
                            {"nome_peca": "branca__cavalo_1", "posicao":"b1", "capturada":"false"}, 
                            {"nome_peca": "branca__bispo_1", "posicao":"c1", "capturada":"false"}, 
                            {"nome_peca": "branca__rainha", "posicao":"d1", "capturada":"false"},
                            {"nome_peca": "branca__rei", "posicao":"e1", "capturada":"false"},
                            {"nome_peca": "branca__bispo_2", "posicao":"f1", "capturada":"false"},
                            {"nome_peca": "branca__cavalo_2", "posicao":"g1", "capturada":"false"},
                            {"nome_peca": "branca__torre_2", "posicao":"h1", "capturada":"false"},
                            {"nome_peca": "branca__peao_1", "posicao":"a2", "capturada":"false"},
                            {"nome_peca": "branca__peao_2", "posicao":"b2", "capturada":"false"},
                            {"nome_peca": "branca__peao_3", "posicao":"c2", "capturada":"false"},
                            {"nome_peca": "branca__peao_4", "posicao":"d2", "capturada":"false"},
                            {"nome_peca": "branca__peao_5", "posicao":"e2", "capturada":"false"},
                            {"nome_peca": "branca__peao_6", "posicao":"f2", "capturada":"false"},
                            {"nome_peca": "branca__peao_7", "posicao":"g2", "capturada":"false"},
                            {"nome_peca": "branca__peao_8", "posicao":"h2", "capturada":"false"},
                            {"nome_peca": "preta__torre_1", "posicao":"a8", "capturada":"false"}, 
                            {"nome_peca": "preta__cavalo_1", "posicao":"b8", "capturada":"false"}, 
                            {"nome_peca": "preta__bispo_1", "posicao":"c8", "capturada":"false"}, 
                            {"nome_peca": "preta__rainha", "posicao":"d8", "capturada":"false"},
                            {"nome_peca": "preta__rei", "posicao":"e8", "capturada":"false"},
                            {"nome_peca": "preta__bispo_2", "posicao":"f8", "capturada":"false"},
                            {"nome_peca": "preta__cavalo_2", "posicao":"g8", "capturada":"false"},
                            {"nome_peca": "preta__torre_2", "posicao":"h8", "capturada":"false"},
                            {"nome_peca": "preta__peao_1", "posicao":"a7", "capturada":"false", "rainha":"false"},
                            {"nome_peca": "preta__peao_2", "posicao":"b7", "capturada":"false", "rainha":"false"},
                            {"nome_peca": "preta__peao_3", "posicao":"c7", "capturada":"false", "rainha":"false"},
                            {"nome_peca": "preta__peao_4", "posicao":"d7", "capturada":"false", "rainha":"false"},
                            {"nome_peca": "preta__peao_5", "posicao":"e7", "capturada":"false", "rainha":"false"},
                            {"nome_peca": "preta__peao_6", "posicao":"f7", "capturada":"false", "rainha":"false"},
                            {"nome_peca": "preta__peao_7", "posicao":"g7", "capturada":"false", "rainha":"false"},
                            {"nome_peca": "preta__peao_8", "posicao":"h7", "capturada":"false", "rainha":"false"},
                        ]
                }

            os.mkdir(f"dados/partidas/em_andamento/{id_partida}")
            with open(f"dados/partidas/em_andamento/{id_partida}/{id_partida}.json", "w") as arq:
                json.dump(partida, arq)
            
            dados_returno = {
                        "usuario":usuario,
                        "usuario_cor":"branca",
                        "id_partida":id_partida, 
                        "jogador_da_vez":partida['jogador_da_vez'],
                        "cor_da_vez":partida['cor_da_vez'],
                        "jogador_branca":partida['jogador_branca'],
                        "jogador_preta":partida['jogador_preta']
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

    caminho_pasta_partida = caminho_partidas_em_andamento+id_partida

    #-------------------------------------------------------------------------------------------------
    
    pasta_partida = [i for i in os.listdir(caminho_partidas_em_andamento) if id_partida in i]

    if pasta_partida:
        arquivo_partida = [i for i in os.listdir(caminho_pasta_partida) if id_partida+".json" in i and "ultima_jogada" not in i]
        if arquivo_partida:
            with open(f"{caminho_pasta_partida}/{arquivo_partida[0]}") as arq:
                partida = json.load(arq)
            
            if partida['status'] != 'finalizada':
                arquivo_mensagem = [i for i in os.listdir(caminho_pasta_partida) if "mensagens_chat.json" in i]

                if arquivo_mensagem:

                    with open(f"{caminho_pasta_partida}/{arquivo_mensagem[0]}") as arq:
                        dados_load = json.load(arq)

                    partida["mensagem"] = []
                    partida["mensagem"] = dados_load

                return jsonify(partida)
            else:
                return jsonify({"status":"Partida Finalizada"})
        else:
            return jsonify({"erro":"ID da Partida Inválido"})

    else:
        return jsonify({"erro":"ID da Partida Inválido"})
    
    return jsonify({"erro":"ID da Partida Inválido"})

#----------------------------------------------------------------------------

@app.route('/api_login_usuario', methods=['GET', 'POST'])
def api_login_usuario():

    metodo_dados = ""
    if request.data:
        dados = json.loads(request.data)
        usuario = dados['usuario']


    arquivo_user = [i for i in os.listdir('dados') if 'usuarios.json' in i]
    
    if arquivo_user:
        with open('dados/usuarios.json') as arq:
            dados = json.load(arq)

        user = usuario in dados
        if user:

            partidas_em_andamento = []
            
            pastas_partidas = [i for i in os.listdir(caminho_partidas_em_andamento) if ".json" not in i]
            
            for p in pastas_partidas:
                partidas = [i for i in os.listdir(caminho_partidas_em_andamento+p) if "ultima_jogada" not in i and "mensagens_chat" not in i]
                
                for arq_partida in partidas:

                    with open(caminho_partidas_em_andamento+p+"/"+arq_partida) as arq:
                        dados = json.load(arq)

                    if dados['status'] != 'finalizada':
                        jogador_branca  = dados['jogador_branca']
                        jogador_preta   = dados['jogador_preta']

                        if usuario == jogador_branca or usuario == jogador_preta:
                            partidas_em_andamento.append(p)

            return jsonify({"usuario":usuario, "partidas_em_andamento":partidas_em_andamento})
        
        return jsonify({'erro':'Login Incorreto'})
    
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

@app.route('/finalizar_partida', methods=['POST'])
def finalizar_partida():
    
    if request.data:
        dados = json.loads(request.data)
        usuario     = dados['usuario']
        id_partida  = dados['id_partida']

        pasta_partida = [i for i in os.listdir(caminho_partidas_em_andamento) if id_partida in i]
        if pasta_partida:
            caminho_pasta_partida = caminho_partidas_em_andamento+id_partida
            arquivo_partida = [i for i in os.listdir(caminho_pasta_partida) if id_partida+".json" in i]
            if arquivo_partida:
                with open(f"{caminho_pasta_partida}/{arquivo_partida[0]}") as arq:
                    partida = json.load(arq)

                if partida['jogador_branca'] == usuario:
                    #shutil.rmtree(caminho_partidas_em_andamento+pasta_partida[0])
                    partida['status'] = 'finalizada'

                    with open(f"{caminho_pasta_partida}/{arquivo_partida[0]}", "w") as arq:
                        json.dump(partida, arq)

                    return jsonify({"status":"finalizada", "id_partida":id_partida})
                
                if partida['jogador_preta'] == usuario:
                    partida['jogador_preta'] = ""

                    with open(f"{caminho_pasta_partida}/{arquivo_partida[0]}", "w") as arq:
                        json.dump(partida, arq)

                    return jsonify({"status":"Abandonada", "id_partida":id_partida})
                else:
                    return jsonify({"erro":"não possui permissão para finalizar a partida"})
        
            return jsonify({"erro":"erro"})

    return jsonify({"erro":"erro"})

#----------------------------------------------------------------------------
#----------------------------------------------------------------------------
#----------------------------------------------------------------------------



#----------------------------------------------------------------------------
#----------------------------------------------------------------------------

@io.on('socket_moverPeca')
def socket_moverPeca(dados):

    #---------------------------------------------------------------------------------------------------

    peca_selecionada = dados
    
    usuario                 = peca_selecionada['usuario']
    usuario_cor             = peca_selecionada['usuario_cor']
    id_partida              = peca_selecionada['id_partida']

    peca_selecionada_nome   = peca_selecionada['peca_selecionada_nome']
    target_posicao          = peca_selecionada['target_posicao']

    #---------------------------------------------------------------------

    def consulta_Partida():
        pasta_partida = [i for i in os.listdir(caminho_partidas_em_andamento) if id_partida in i]
        if pasta_partida:
            caminho_pasta_partida = caminho_partidas_em_andamento+id_partida
            arquivo_partida = [i for i in os.listdir(caminho_pasta_partida) if id_partida+".json" in i and "ultima_jogada" not in i]
            if arquivo_partida:
                with open(f"{caminho_pasta_partida}/{arquivo_partida[0]}") as arq:
                    partida = json.load(arq)
                return partida

    #---------------------------------------------------------------------
    
    def salva_Partida(data):
        caminho_pasta_partida = caminho_partidas_em_andamento+id_partida
        arquivo_partida = [i for i in os.listdir(caminho_pasta_partida) if id_partida+".json" in i and "ultima_jogada" not in i]
        with open(f"{caminho_pasta_partida}/{arquivo_partida[0]}", "w") as arq:
            json.dump(data, arq)

    #---------------------------------------------------------------------

    def salva_ultima_jogada(id_partida, partida):

        caminho_pasta_partida = caminho_partidas_em_andamento+id_partida

        arq_ultima_jogada = f"ultima_jogada__{id_partida}.json"
        
        with open(f"{caminho_pasta_partida}/{arq_ultima_jogada}", "w") as arq:
            json.dump(partida, arq)  
        
    #---------------------------------------------------------------------

    partida = consulta_Partida()
    
    if partida:

        salva_ultima_jogada(id_partida, partida)

        jogador_da_vez = partida['jogador_da_vez']

        if usuario == jogador_da_vez:
            
            peca_selecionada_cor = peca_selecionada_nome.split("_")[0]

            if peca_selecionada_cor == usuario_cor:

                if peca_selecionada['funcao'] == 'capturar':

                    peca_target_nome  = peca_selecionada['peca_target_nome']

                    for i in partida['pecas']:

                        if peca_target_nome == i['nome_peca']:
                            
                            i['capturada'] = 'true'

                            if "rei" in peca_target_nome:
                                partida['xeque_mate'] = "true"
                                partida['xeque_mate_usuario'] = usuario

                        if peca_selecionada_nome == i['nome_peca']:
                            posicao_atual = i['posicao']
                            i['posicao'] = target_posicao

                            ultimo_movimento = [posicao_atual, target_posicao]
                            emit('getUltimoMovimento', ultimo_movimento, broadcast=True)

                        if usuario_cor == 'branca':
                            partida['jogador_da_vez'] = partida['jogador_preta']
                            partida['cor_da_vez'] = 'preta'
                            

                        elif usuario_cor == 'preta':
                            partida['jogador_da_vez'] = partida['jogador_branca']
                            partida['cor_da_vez'] = 'branca'
                        
                    salva_Partida(partida)
                    emit('getPartida', partida, broadcast=True)
                    
                    return jsonify(partida)

                    
                elif peca_selecionada['funcao'] == 'mover':

                    for i in partida['pecas']:
                        if peca_selecionada_nome == i['nome_peca']:
                            
                            nome_peca = i['nome_peca']
                            posicao_peca = i['posicao']
                            target_posicao_peca = target_posicao

                            posicao_atual = i['posicao']

                            i["posicao"] = target_posicao_peca

                            ultimo_movimento = [posicao_atual, target_posicao]
                            partida['ultimo_movimento'] = ultimo_movimento

                            # ********************** JOGADA ESPECIAL (ROCK) **********************
                            
                            if nome_peca == 'branca__rei':
                                
                                if target_posicao == 'g1':
                                    for j in partida['pecas']:
                                        if j['nome_peca'] == 'branca__torre_2' and j['posicao'] == 'h1':
                                            j['posicao'] = 'f1'

                                elif target_posicao == 'c1':
                                    for j in partida['pecas']:
                                        if j['nome_peca'] == 'branca__torre_1' and j['posicao'] == 'a1':
                                            j['posicao'] = 'd1'

                            elif nome_peca == 'preta__rei':
                                if target_posicao == 'g8':
                                    for j in partida['pecas']:
                                        if j['nome_peca'] == 'preta__torre_2' and j['posicao'] == 'h8':
                                            j['posicao'] = 'f8'

                                elif target_posicao == 'c8':
                                    for j in partida['pecas']:
                                        if j['nome_peca'] == 'preta__torre_1' and j['posicao'] == 'a8':
                                            j['posicao'] = 'd8'

                            # *******************************************************************
                            
                            emit('getUltimoMovimento', ultimo_movimento, broadcast=True)

                            if usuario_cor == 'branca':
                                partida['jogador_da_vez'] = partida['jogador_preta']
                                partida['cor_da_vez'] = 'preta'
                                

                            elif usuario_cor == 'preta':
                                partida['jogador_da_vez'] = partida['jogador_branca']
                                partida['cor_da_vez'] = 'branca'
                            

                    salva_Partida(partida)
                    
                    emit('getPartida', partida, broadcast=True)
                    
                    return jsonify(partida)

            else:
                return jsonify({'erro':'Não pode mover essa Peça'})  
        else:
            return jsonify({'erro':'Não é a sua vez'})        
    else:
        return jsonify({"erro":"partida não existe"})

#----------------------------------------------------------------------------
#----------------------------------------------------------------------------

@io.on('socket_jogada_anterior')
def socket_jogada_anterior(dados):

    peca_selecionada = dados
    
    usuario     = peca_selecionada['usuario']
    id_partida  = peca_selecionada['id_partida']

    #---------------------------------------------------------------------

    def consulta_partida():
        pasta_partida = [i for i in os.listdir(caminho_partidas_em_andamento) if id_partida in i]
        if pasta_partida:
            caminho_pasta_partida = caminho_partidas_em_andamento+id_partida
            arquivo_partida = [i for i in os.listdir(caminho_pasta_partida) if id_partida+".json" in i and "ultima_jogada" not in i]
            if arquivo_partida:
                with open(f"{caminho_pasta_partida}/{arquivo_partida[0]}") as arq:
                    partida = json.load(arq)
                return partida
    

    def consulta_partida_jogada_anterior():
        pasta_partida = [i for i in os.listdir(caminho_partidas_em_andamento) if id_partida in i]
        if pasta_partida:
            caminho_pasta_partida = caminho_partidas_em_andamento+id_partida
            arquivo_partida = [i for i in os.listdir(caminho_pasta_partida) if "ultima_jogada" in i]
            if arquivo_partida:
                with open(f"{caminho_pasta_partida}/{arquivo_partida[0]}") as arq:
                    partida = json.load(arq)
                return partida
    
    partida = consulta_partida()
    partida_jogada_anterior = consulta_partida_jogada_anterior()

    #---------------------------------------------------------------------
    
    def salva_Partida(data):
        caminho_pasta_partida = caminho_partidas_em_andamento+id_partida
        arquivo_partida = [i for i in os.listdir(caminho_pasta_partida) if id_partida+".json" in i and "ultima_jogada" not in i]
        with open(f"{caminho_pasta_partida}/{arquivo_partida[0]}", "w") as arq:
            json.dump(data, arq)

    if(partida_jogada_anterior != None):
        salva_Partida(partida_jogada_anterior)

    #---------------------------------------------------------------------
    
    def salva_ultima_jogada(data):
        pasta_partida = [i for i in os.listdir(caminho_partidas_em_andamento) if id_partida in i]
        if pasta_partida:
            caminho_pasta_partida = caminho_partidas_em_andamento+id_partida
            arquivo_partida = [i for i in os.listdir(caminho_pasta_partida) if "ultima_jogada" in i]
            if arquivo_partida:
                with open(f"{caminho_pasta_partida}/{arquivo_partida[0]}", "w") as arq:
                    json.dump(data, arq)
    
    salva_ultima_jogada(partida)

    #---------------------------------------------------------------------
    
    partida = consulta_partida()
    emit('getPartida', partida, broadcast=True)

#----------------------------------------------------------------------------
#----------------------------------------------------------------------------

@io.on('socket_abandonar_partida')
def socket_abandonar_partida(dados):

    peca_selecionada = dados
    
    usuario     = peca_selecionada['usuario']
    id_partida  = peca_selecionada['id_partida']

    #---------------------------------------------------------------------

    def consulta_partida():
        pasta_partida = [i for i in os.listdir(caminho_partidas_em_andamento) if id_partida in i]
        if pasta_partida:
            caminho_pasta_partida = caminho_partidas_em_andamento+id_partida
            arquivo_partida = [i for i in os.listdir(caminho_pasta_partida) if id_partida+".json" in i and "ultima_jogada" not in i]
            if arquivo_partida:
                with open(f"{caminho_pasta_partida}/{arquivo_partida[0]}") as arq:
                    partida = json.load(arq)
                return partida
    
    def consulta_partida_jogada_anterior():
        pasta_partida = [i for i in os.listdir(caminho_partidas_em_andamento) if id_partida in i]
        if pasta_partida:
            caminho_pasta_partida = caminho_partidas_em_andamento+id_partida
            arquivo_partida = [i for i in os.listdir(caminho_pasta_partida) if "ultima_jogada" in i]
            if arquivo_partida:
                with open(f"{caminho_pasta_partida}/{arquivo_partida[0]}") as arq:
                    partida = json.load(arq)
                return partida
    
    partida = consulta_partida()
    partida_jogada_anterior = consulta_partida_jogada_anterior()
    
    #---------------------------------------------------------------------
    
    def salva_Partida(data):
        caminho_pasta_partida = caminho_partidas_em_andamento+id_partida
        arquivo_partida = [i for i in os.listdir(caminho_pasta_partida) if id_partida+".json" in i and "ultima_jogada" not in i]
        with open(f"{caminho_pasta_partida}/{arquivo_partida[0]}", "w") as arq:
            json.dump(data, arq)

    partida['jogador_preta'] = "NULL"
    salva_Partida(partida)

    #---------------------------------------------------------------------
    
    def salva_ultima_jogada(data):
        pasta_partida = [i for i in os.listdir(caminho_partidas_em_andamento) if id_partida in i]
        if pasta_partida:
            caminho_pasta_partida = caminho_partidas_em_andamento+id_partida
            arquivo_partida = [i for i in os.listdir(caminho_pasta_partida) if "ultima_jogada" in i]
            if arquivo_partida:
                with open(f"{caminho_pasta_partida}/{arquivo_partida[0]}", "w") as arq:
                    json.dump(data, arq)
    
    if(partida_jogada_anterior != None):
        partida_jogada_anterior['jogador_preta'] = "NULL"
        salva_ultima_jogada(partida_jogada_anterior)

    #---------------------------------------------------------------------

    partida = consulta_partida()
    emit('getPartida', partida, broadcast=True)

#----------------------------------------------------------------------------
#----------------------------------------------------------------------------

@io.on('socket_enviar_mensagem_chat')
def socket_enviar_mensagem_chat(dados):

    caminho_pasta_partida = caminho_partidas_em_andamento+dados['id_partida']
    arquivo_chat = [i for i in os.listdir(caminho_pasta_partida) if "mensagens_chat.json" in i]
    
    if arquivo_chat:
        
        with open(f"{caminho_pasta_partida}/{arquivo_chat[0]}") as arq:
            dados_load = json.load(arq)
        
        dados_load.append(dados)

        with open(f"{caminho_pasta_partida}/{arquivo_chat[0]}", "w") as arq:
            json.dump(dados_load, arq)

        emit('getChat', dados_load, broadcast=True)
        
    else:
        dados_load = [dados]
        with open(f"{caminho_pasta_partida}/mensagens_chat.json", "w") as arq:
            json.dump(dados_load, arq)
        
        emit('getChat', dados_load, broadcast=True)

#----------------------------------------------------------------------------
#----------------------------------------------------------------------------

@io.on('socket_xeque')
def socket_xeque(dados):
    emit('getXeque', dados, broadcast=True)

#----------------------------------------------------------------------------
#----------------------------------------------------------------------------
#----------------------------------------------------------------------------

if __name__ == "__main__":
    io.run(app, debug=True)
