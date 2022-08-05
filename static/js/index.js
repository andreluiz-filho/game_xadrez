
//********************************************************
//********************************************************

const url 		= window.location.origin
const socket 	= io(url)

var api_partida 	= url+'/api_partida'
var api_moverPeca 	= url+'/api_moverPeca'

usuario 	= sessionStorage.getItem('usuario')
usuario_cor = sessionStorage.getItem('usuario_cor')


if(usuario == null){

	key_session = Object.keys(sessionStorage)

	if(key_session.length == 0){

		if(get_usuario.value != '' && get_id_partida.value != '' && get_jogador_da_vez.value != '' && get_cor_da_vez.value != '' && get_jogador_branca.value != '' && get_jogador_preta.value != ''){
			sessionStorage.setItem('usuario', get_usuario.value)
			sessionStorage.setItem('id_partida', get_id_partida.value)
			sessionStorage.setItem('jogador_da_vez', get_jogador_da_vez.value)
			sessionStorage.setItem('cor_da_vez', get_cor_da_vez.value)
			sessionStorage.setItem('usuario_cor', get_usuario_cor.value)

			sessionStorage.setItem('jogador_branca', get_jogador_branca.value)
			sessionStorage.setItem('jogador_preta', get_jogador_preta.value)

			if(get_usuario_cor.value == ""){
				sessionStorage.setItem('visitante', 'true')
			}

			window.location.href = url+'/partida';
		}else if(get_usuario.value == ''){
			sessionStorage.clear()
			window.location.href = url+'/';
		}

	}else{
		sessionStorage.clear()
		window.location.href = url+'/';
	}

}else{

	// -----------------------------------------------------------
	// --------------------PARTIDAS EM ANDAMENTO------------------

	id_partida = sessionStorage.getItem('id_partida')
	function func_partidas_em_andamento(partidas_em_andamento){

		area_partidas_em_andamento_itens.innerHTML = ""

		if(partidas_em_andamento){

			for(i of partidas_em_andamento.split(",")){

				if(i){
					var div_andamento = document.createElement("div")

					div_andamento.className = "box_partidas_em_andamento"
					
					var btn = document.createElement("button")
					btn.className = " btn btn-secondary entrar_partida"
					btn.textContent = i

					//----------------------------------------------------------------------------------
					
					btn.addEventListener("click", (e)=>{
						
						var recurso = url+"/entrarPartida"
						fetch(recurso, {
							  method: 'POST',
							  body: JSON.stringify({"usuario":usuario, "id_partida":e.target.textContent}),
							  headers:{
							    'Content-Type': 'application/json'
							  }
							})
						.then(res => res.json())
						.then(function(data){

							sessionStorage.setItem('id_partida', data['id_partida'])
							sessionStorage.setItem('jogador_da_vez', data['jogador_da_vez'])
							sessionStorage.setItem('cor_da_vez', data['cor_da_vez'])
							sessionStorage.setItem('usuario_cor', data['usuario_cor'])

							sessionStorage.setItem('jogador_branca', data['jogador_branca'])
							sessionStorage.setItem('jogador_preta', data['jogador_preta'])

							window.location.href = url+'/partida';
						})
						.catch(error => console.error('Error:', error))

					})
					
					//----------------------------------------------------------------------------------

					if(i == id_partida){

						var btn_anterior = document.createElement("button")
						var btn_proximo = document.createElement("button")

						btn_anterior.textContent = "<"
						btn_anterior.className = "btn btn-secondary btn_jogada_anterior"

						btn_proximo.textContent = ">"
						btn_proximo.className = "btn btn-secondary btn_jogada_proxima"

						div_andamento.appendChild(btn_anterior)
						div_andamento.appendChild(btn)
						div_andamento.appendChild(btn_proximo)

						area_partidas_em_andamento_itens.appendChild(div_andamento)	

					}else{
						div_andamento.appendChild(btn)
						area_partidas_em_andamento_itens.appendChild(div_andamento)	
					}
				}
				
			}
		}
	}

	partidas_em_andamento = sessionStorage.getItem('partidas_em_andamento')
	func_partidas_em_andamento(partidas_em_andamento)

	// ----------------------------------------------------------
	//------------------------CHAT MENSAGENS---------------------

	function chat_mensagens(data){

		area_mensagens.innerHTML = ""

		for(i of data){
			de = i['de']
			para = i['para']
			mensagem = i['mensagem']
			id_partida_mensagem = i['id_partida']

			if(id_partida_mensagem == id_partida){
				
				var span = document.createElement("span")
				var br = document.createElement("br")
				span.className = "span_mensagem"
				span.innerHTML += `<strong>${de}:</strong> ${mensagem}`

				area_mensagens.appendChild(span)
				area_mensagens.appendChild(br)
				area_mensagens.scrollTop = area_mensagens.scrollHeight - area_mensagens.clientHeight
				
			}
		}
	}

	// ----------------------------------------------------------
	// ----------------------------------------------------------

	id_partida 		= sessionStorage.getItem('id_partida')
	jogador_da_vez 	= sessionStorage.getItem('jogador_da_vez')
	cor_da_vez 		= sessionStorage.getItem('cor_da_vez')

	//********************************************************
	//*******************CRIA O TABULEIRO*********************
	if(usuario_cor == 'preta'){
		rows = [1, 2, 3, 4, 5, 6, 7, 8]
		letras = ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']
	}
	else{
		rows = [8, 7, 6, 5, 4, 3, 2, 1]
		letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
	}
	
	cols = [...Array(8).keys()]
	

	for(row of rows){

		var tr = document.createElement('tr');
		tr.className = " row"
		
		for(col of cols){
			var td = document.createElement('td');

			if(row % 2 == col % 2){
				td.className = " casa casa_cor_secundaria col";
			}else{
				td.className = " casa casa_cor_primaria col";
			}

			nome_casa = letras[col]+row
			td.id = nome_casa

			tr.appendChild(td);
	    	table.appendChild(tr);

	    }
	}

	//********************************************************
	//*******************ATUALIZAR PARTIDA********************

	function atualizarPartida(data){

		var imagens = table.querySelectorAll("img")
		for(im = 0; im < imagens.length; im++){
			imagens[im].remove()
		}

		ultima_jogada_posicao = sessionStorage.getItem('ultima_jogada_posicao')

		if(ultima_jogada_posicao){
			ultima_jogada_posicao = ultima_jogada_posicao.split(",")
			de = ultima_jogada_posicao[0].replace(" ", "")
			para = ultima_jogada_posicao[1].replace(" ", "")	
		}

		var casas = table.querySelectorAll(".casa")

		for(i = 0; i < casas.length; i++){

			for(peca of data){
				
				nome_peca 			= peca['nome_peca']
				nome_peca_cor 		= nome_peca.split("__")[0]
				nome_peca_isolado 	= nome_peca.split("__")[1].split("_")[0]
				nome_peca_formatada = nome_peca_isolado+"_"+nome_peca_cor
		    	posicao_peca 		= peca['posicao']
				imagem_peca 		= '/static/img/pecas'+'/'+nome_peca_formatada+'.png'

		    	var img = new Image();
		    	img.src = imagem_peca
		    	img.alt = nome_peca+'___'+posicao_peca

				if(posicao_peca == casas[i].id){
					casas[i].appendChild(img);
				}
			}

			if(ultima_jogada_posicao){
				if(casas[i].id == de | casas[i].id == para){
					casas[i].style.border = "thin solid yellow";
				}	
			}
			
		}

		xeque_mate = sessionStorage.getItem('xeque_mate')
		xeque_mate_usuario = sessionStorage.getItem('xeque_mate_usuario')

		if(xeque_mate){

			if(xeque_mate == "true"){

				if(xeque_mate_usuario == usuario){
					alert("Voce Ganhou")
				}
				else if(xeque_mate_usuario != usuario){
					alert("Voce Perdeu")
				}
			}
		}
	}

	//********************************************************
	//********************************************************

	function separaPecas(data){

		// ---------------------------------------------

		jogador_da_vez 	= sessionStorage.getItem('jogador_da_vez')
		jogador_branca 	= sessionStorage.getItem('jogador_branca')
		jogador_preta 	= sessionStorage.getItem('jogador_preta')

		area_admin_jogador_branca.textContent = jogador_branca
		area_admin_jogador_preta.textContent = jogador_preta

		area_admin_jogador_branca_status.style.background = "#a6b5a6"
		area_admin_jogador_preta_status.style.background = "#a6b5a6"

		if(jogador_da_vez == usuario){
			area_admin_hide_show.style.background = "blue"
			area_admin_jogador_branca_status.style.background = "blue"
		}else{
			area_admin_hide_show.style.background = "#999"
		}

		if(jogador_da_vez == jogador_branca){
			area_admin_jogador_branca_status.style.background = "blue"
			area_admin_jogador_preta_status.style.background = "#a6b5a6"
		}
		else if(jogador_da_vez == jogador_preta){
			area_admin_jogador_preta_status.style.background = "blue"
			area_admin_jogador_branca_status.style.background = "#a6b5a6"
		}

		// ---------------------------------------------

		sessionStorage.removeItem('peca_selecionada')

		lista_pecas_ativas = []
		lista_pecas_capturadas = []
		
		for(peca of data){
			if(peca['capturada'] == 'true'){
				cor_peca = peca['nome_peca'].split('__')[0]
				nome_peca = peca['nome_peca'].split('__')[1].split('_')[0]
				nome_peca = nome_peca+'_'+cor_peca
				lista_pecas_capturadas.push(nome_peca)

			}else if(peca['capturada'] == 'false'){
				lista_pecas_ativas.push(peca)
			}
		}
		
		atualizarPartida(lista_pecas_ativas)	
		
		// ----------------------STATUS DAS CAPTURAS DE PEÇAS---------------------

		pecas_capturadas = document.querySelectorAll(".pecas_capturadas")
		for(i = 0; i < pecas_capturadas.length; i++){
			status_nome_peca = pecas_capturadas[i].id.split("__")[1]
			
			qtd = 0
			for(p of lista_pecas_capturadas){
				if(p == status_nome_peca){
					qtd += 1
				}
			}
			pecas_capturadas[i].textContent = qtd
		}

		// ----------------------------------------------------------------------
		
	}

	//********************************************************
	//********************************************************
	/*
		Esse bloco de código acessa a API e consulta todas 
		as peças e seus atributos
	*/	

	if(id_partida && id_partida != 'undefined' && jogador_da_vez){

		sessionStorage.removeItem('peca_selecionada')

		usuario 		= sessionStorage.getItem('usuario')
		usuario_cor 	= sessionStorage.getItem('usuario_cor')
		jogador_branca 	= sessionStorage.getItem('jogador_branca')
		jogador_preta 	= sessionStorage.getItem('jogador_preta')
		jogador_da_vez 	= sessionStorage.getItem('jogador_da_vez')
		cor_da_vez 		= sessionStorage.getItem('cor_da_vez')

		key_session = Object.keys(sessionStorage)

		if(key_session.includes("visitante")){
			area_usuario_titulo.textContent = ""
			area_usuario_titulo.textContent = usuario+" - Visitante"
		}

		fetch(api_partida, {
			method: 'POST',
			body: JSON.stringify({"id_partida":id_partida}),
			headers:{
			'Content-Type': 'application/json'
			}
		})
		.then(res => res.json())
		.then(function(data){
			
			key_data = Object.keys(data)

			if(key_data.includes('erro')){
				
				sessionStorage.clear()
				window.location.href = url+'/';
				
				//****************************
				//Adicionar a Mensagem de Erro
				//****************************


			}
			else if(key_data.includes('pecas')){

				sessionStorage.setItem('xeque_mate', data['xeque_mate'])
				sessionStorage.setItem('xeque_mate_usuario', data['xeque_mate_usuario'])

				sessionStorage.setItem('cor_da_vez', data['cor_da_vez'])

				sessionStorage.setItem('jogador_branca', data['jogador_branca'])
				sessionStorage.setItem('jogador_preta', data['jogador_preta'])

				status_partida 	= data['status']
				pecas_partida 	= data['pecas']

				separaPecas(pecas_partida)

				// --------------------------TITULO ID PARTIDA----------------------------
				var div_titulo_id_partida = document.createElement("div")
				div_titulo_id_partida.id = "div_titulo_id_partida"
				div_titulo_id_partida.textContent = "ID Partida: "+id_partida
				//titulo_id_partida.textContent = "ID Partida: "+id_partida
				//area_admin_hide_show.textContent  = "ID Partida: "+id_partida

				area_admin_hide_show.appendChild(div_titulo_id_partida)

				// -----------------------------------------------------------------------

				if(jogador_preta == "NULL"){

					area_admin_hide_show.style.background = "red"

					if(data['jogador_da_vez'] != usuario){
						sessionStorage.setItem('jogador_da_vez', "NULL")
					}
					else{
						sessionStorage.setItem('jogador_da_vez', data['jogador_da_vez'])
					}

				}

				// -----------------------------------------------------------------------

				if(key_data.includes('mensagem')){
					chat_mensagens(data['mensagem'])
				}

				// -----------------------------------------------------------------------

				if(id_partida){
					finalizar_partida.style.display = "block"	
				}

				// -----------------------------------------------------------------------

			}
			else if(key_data.includes('status')){
				sessionStorage.clear()
				sessionStorage.setItem('usuario', usuario)
			}
		})
		.catch(error => console.error('Error:', error))
	
	}

	// ---------------------------------WEBSOCKET---------------------------------

	var casas = document.querySelectorAll(".casa")
	
	socket.on('getPartida', (data) => {
		
		key_data = Object.keys(data)

		if(key_data.includes('erro')){

			erro_mover_captura.textContent = data['erro']
			sessionStorage.removeItem('peca_selecionada')
		}
		else{
			
			sessionStorage.setItem('xeque_mate', data['xeque_mate'])
			sessionStorage.setItem('xeque_mate_usuario', data['xeque_mate_usuario'])

			status_partida 	= data['status']
			pecas_partida 	= data['pecas']

			sessionStorage.setItem('cor_da_vez', data['cor_da_vez'])
			sessionStorage.setItem('jogador_da_vez', data['jogador_da_vez'])
			sessionStorage.setItem('jogador_branca', data['jogador_branca'])
			sessionStorage.setItem('jogador_preta', data['jogador_preta'])

			separaPecas(pecas_partida)

			if(jogador_preta == "NULL"){

				area_admin_hide_show.style.background = "red"

				if(data['jogador_da_vez'] != usuario){
					sessionStorage.setItem('jogador_da_vez', "NULL")
				}
				else{
					sessionStorage.setItem('jogador_da_vez', data['jogador_da_vez'])
				}
			}
		}
	})

	socket.on('getUltimoMovimento', (data) => {

		ultima_jogada_posicao = `${data[0]}, ${data[1]}`

		sessionStorage.setItem('ultima_jogada_posicao', ultima_jogada_posicao)

		
		for(casa of casas){
			if(casa.id == data[0] | casa.id == data[1]){
				casa.style.border = "thin solid yellow";
			}
			else{
				casa.style.border = "thin solid black";
			}	
		}
	})

	socket.on('getChat', (data) => {
		chat_mensagens(data)
	})
	
	//---------------------------------------------------------------------------
	
	//********************************************************
	//*********************MOVER/CAPTURAR*********************

	for(casa of casas){

		casa.addEventListener("click", (e)=> {

			jogador_da_vez = sessionStorage.getItem('jogador_da_vez')
			cor_da_vez = sessionStorage.getItem('cor_da_vez')

			jogador_branca = sessionStorage.getItem('jogador_branca')
			jogador_preta = sessionStorage.getItem('jogador_preta')

			function socket_moverPeca(dados){
				socket.emit('socket_moverPeca', dados)	
			}

			if(e.target.tagName == "IMG" && e.target.alt != "icone"){

				if(usuario == jogador_da_vez && usuario_cor == cor_da_vez){
				
					peca_selecionada = sessionStorage.getItem('peca_selecionada')
					peca_target_cor = e.target.alt.split("__")[0]

					if(peca_target_cor == cor_da_vez){

						if(usuario_cor == peca_target_cor){

							if(peca_selecionada){

								peca_selecionada_cor 		= peca_selecionada.split("__")[0]
								peca_selecionada_nome 		= peca_selecionada.split("___")[0]
								peca_selecionada_posicao 	= peca_selecionada.split('___')[1]
								
								peca_target_nome 			= e.target.alt.split("___")[0]
								target_posicao 				= e.target.alt.split("___")[1]
								
								if(peca_selecionada_nome != peca_target_nome){
									
									e.target.style.border = "thick solid green";

									if(peca_selecionada_cor != peca_target_cor){

										data_capturar_peca = {
															'usuario':usuario,
															'usuario_cor':usuario_cor,
															'id_partida':id_partida, 
															'peca_selecionada_nome':peca_selecionada_nome,
															'peca_target_nome':peca_target_nome, 
															'target_posicao':target_posicao, 
															'funcao':'capturar'
														}
										
										socket_moverPeca(data_capturar_peca)
										//moverPeca(data_capturar_peca)
									
									}
								}
								else if(peca_selecionada_nome == peca_target_nome){
									e.target.style.border = "none"
									sessionStorage.removeItem('peca_selecionada')
								}
								
							}else{
								sessionStorage.setItem('peca_selecionada', e.target.alt)

								peca_selecionada_nome 		= e.target.alt.split('___')[0]
								peca_selecionada_posicao 	= e.target.alt.split('___')[1]

								e.target.style.border = "thick solid green";
								e.target.style.borderRadius = "30px";
							
							}
						
						}
						else if(usuario_cor != peca_target_cor){

							e.target.style.border = "thick solid red";
							e.target.style.borderRadius = "30px";
						
							setInterval(function() {
								e.target.style.border = "";
							}, 1000);
						}

					}
					else if(cor_da_vez != peca_target_cor){

						e.target.style.border = "thick solid red";
						e.target.style.borderRadius = "30px";
					
						setInterval(function() {
							e.target.style.border = "";
						}, 1000);
						
						if(peca_selecionada){

							peca_selecionada_cor 		= peca_selecionada.split("__")[0]
							peca_selecionada_nome 		= peca_selecionada.split("___")[0]
							peca_selecionada_posicao 	= peca_selecionada.split('___')[1]
							
							peca_target_nome 			= e.target.alt.split("___")[0]
							target_posicao 				= e.target.alt.split("___")[1]
							

							if(peca_selecionada_nome != peca_target_nome){
								
								if(cor_da_vez == peca_selecionada_cor){

									e.target.style.border = "thick solid green";
									e.target.style.borderRadius = "30px";

									if(peca_selecionada_cor != peca_target_cor){

										data_capturar_peca = {
															'usuario':usuario,
															'usuario_cor':usuario_cor,
															'id_partida':id_partida, 
															'peca_selecionada_nome':peca_selecionada_nome,
															'peca_target_nome':peca_target_nome, 
															'target_posicao':target_posicao, 
															'funcao':'capturar'
														}
										
										socket_moverPeca(data_capturar_peca)
										//moverPeca(data_capturar_peca)
										
									}						
								}
							}
						}
					}

				}else{
					console.log("Não é a sua vez")
					
					e.target.style.border = "thick solid red";
					e.target.style.borderRadius = "30px";
					
					setInterval(function() {
						e.target.style.border = "none";
					}, 1000);
				}

			}else if(e.target.tagName == "TD"){

				peca_selecionada = sessionStorage.getItem('peca_selecionada')
				
				if(peca_selecionada){
					
					peca_selecionada_nome		= peca_selecionada.split('___')[0]
					peca_selecionada_posicao	= peca_selecionada.split('___')[1]
					target_posicao 				= e.target.id

					if(peca_selecionada_posicao != target_posicao){
						data_mover_peca = {
										'usuario':usuario,
										'usuario_cor':usuario_cor,
										'id_partida':id_partida, 
										'peca_selecionada_nome':peca_selecionada_nome,
										'target_posicao':target_posicao, 
										'jogador_branca':jogador_branca, 
										'jogador_preta':jogador_preta, 
										'funcao':'mover'
									}

						socket_moverPeca(data_mover_peca)
					}
					else if(peca_selecionada_posicao == target_posicao){
						console.log("Não pode andar para a mesma Casa")
					}

				}
			
			}
		});	
	
	}

	//********************************************************
	//********************************************************
	/////////////////////////CRIAR USUARIO////////////////////

	function criar_usuario(){
		
	}

	//********************************************************
	//********************************************************
	///////////////////////////AREA ADMIN/////////////////////

	function func_area_admin_hide_show(){

		if(area_admin_topo.style.display == 'none' && area_admin_conteudo.style.display == 'none'){
			area_admin_topo.style.display = 'block'
			area_admin_conteudo.style.display = 'block'

		}else{
			area_admin_topo.style.display = 'none'
			area_admin_conteudo.style.display = 'none'
		}

	}

	//********************************************************
	//********************************************************

	// ------------------- ENTRAR PARTIDA -------------------
	/*
	entrar_partida = document.querySelectorAll(".entrar_partida")
	console.log("entrar_partida", entrar_partida)
	for(i = 0; i < entrar_partida.length; i++){

		entrar_partida[i].addEventListener("click", (e)=>{
			
			var recurso = url+"/entrarPartida"
			fetch(recurso, {
				  method: 'POST',
				  body: JSON.stringify({"usuario":usuario, "id_partida":e.target.textContent}),
				  headers:{
				    'Content-Type': 'application/json'
				  }
				})
			.then(res => res.json())
			.then(function(data){

				sessionStorage.setItem('id_partida', data['id_partida'])
				sessionStorage.setItem('jogador_da_vez', data['jogador_da_vez'])
				sessionStorage.setItem('cor_da_vez', data['cor_da_vez'])
				sessionStorage.setItem('usuario_cor', data['usuario_cor'])

				sessionStorage.setItem('jogador_branca', data['jogador_branca'])
				sessionStorage.setItem('jogador_preta', data['jogador_preta'])

				window.location.href = url+'/partida';
			})
			.catch(error => console.error('Error:', error))


		})

	}
	*/


	//********************************************************
	//********************************************************

	// -------------------- NOVA PARTIDA --------------------
	
	nova_partida.addEventListener("click", (e)=>{
		usuario_adversario.value = ""
		adicionar_adversario_partida.style.display = "block"
	})

	nova_partida_cancelar.addEventListener("click", (e)=>{
		usuario_adversario.value = ""
		adicionar_adversario_partida.style.display = "none"
	})

	nova_partida_confirmar.addEventListener("click", (e)=>{

		var recurso = url+"/novaPartida"
		
		fetch(recurso, {
			  method: 'POST',
			  body: JSON.stringify({"usuario":usuario, "usuario_adversario":usuario_adversario.value}),
			  headers:{
			    'Content-Type': 'application/json'
			  }
			})
		.then(res => res.json())
		.then(function(data){
			
			sessionStorage.setItem('id_partida', data['id_partida'])
			sessionStorage.setItem('jogador_da_vez', data['jogador_da_vez'])
			sessionStorage.setItem('cor_da_vez', data['cor_da_vez'])
			sessionStorage.setItem('usuario_cor', data['usuario_cor'])
			sessionStorage.setItem('jogador_branca', data['jogador_branca'])
			sessionStorage.setItem('jogador_preta', data['jogador_preta'])
			sessionStorage.setItem('partidas_em_andamento', data['id_partida'])

			window.location.href = url+'/partida';
		})
		.catch(error => console.error('Error:', error))
		
	});
	
	//********************************************************
	//********************************************************

	// -------------------- SAIR PARTIDA --------------------

	sair_partida.addEventListener("click", (e)=>{
		sessionStorage.clear()
		window.location.href = url+'/';
	
	});

	//********************************************************
	//********************************************************

	finalizar_partida.addEventListener("click", (e)=>{
		confirmacao_finalizar_partida.style.display = "block"
		if(usuario == jogador_preta){
			confirmacao_finalizar_partida.querySelector("label").textContent = "Abandonar a Partida?"
		}
	})

	finalizar_partida_confirmar.addEventListener("click", (e)=>{

		if(usuario == jogador_branca){

			var recurso = url+"/finalizar_partida"
			fetch(recurso, {
				  method: 'POST',
				  body: JSON.stringify({"usuario":usuario, "id_partida":id_partida}),
				  headers:{
				    'Content-Type': 'application/json'
				  }
				})
			.then(res => res.json())
			.then(function(data){


				key_data = Object.keys(data)

				if(key_data.includes('erro')){
					console.log(data)
				}else{

					lista_partidas_em_andamento = ""
					for(i of partidas_em_andamento.split(",")){
						
						if(i != data['id_partida']){
							if(lista_partidas_em_andamento == ""){
								lista_partidas_em_andamento += i	
							}else{
								lista_partidas_em_andamento += ","+i	
							}
						}
					}

					sessionStorage.clear()

					sessionStorage.setItem('usuario', usuario)

					sessionStorage.setItem('partidas_em_andamento', lista_partidas_em_andamento)
					window.location.href = url+'/partida';

				}

			})
			.catch(error => console.error('Error:', error))

		}
		else if(usuario == jogador_preta){

			function socket_abandonar_partida(dados){
				socket.emit('socket_abandonar_partida', dados)
			}
			dados = {"usuario":usuario, "id_partida":id_partida}
			
			socket_abandonar_partida(dados)

			sessionStorage.clear()
			window.location.href = url+'/';

		}

	})

	finalizar_partida_cancelar.addEventListener("click", (e)=>{
		confirmacao_finalizar_partida.style.display = "none"
	})

	//********************************************************
	//********************************************************
	
	btn_atualizar_partidas_em_andamento.addEventListener("click", (e)=>{

		var api_login_usuario = url+'/api_login_usuario'

		dados = {"usuario":usuario}

		fetch(api_login_usuario, {
			method: 'POST',
			body: JSON.stringify(dados),
			headers:{
			'Content-Type': 'application/json'
			}
		})
		.then(res => res.json())
		.then(function(data){

			key_data = Object.keys(data)

			if(key_data.includes('partidas_em_andamento')){

				sessionStorage.removeItem("partidas_em_andamento")
				sessionStorage.setItem("partidas_em_andamento", data['partidas_em_andamento'])

				lista_partidas_em_andamento_selecionada = []
				lista_partidas_em_andamento = []
				for(p of data['partidas_em_andamento']){
					
					if(p == id_partida){
						lista_partidas_em_andamento_selecionada.push(p)
					}else{
						lista_partidas_em_andamento.push(p)
					}
				}

				
				partidas_em_andamento = lista_partidas_em_andamento_selecionada+","+lista_partidas_em_andamento
				func_partidas_em_andamento(partidas_em_andamento)
			}
			
		})
		.catch(error => console.error('Error:', error))
			

	})

	//********************************************************
	//********************************************************
	partidas_em_andamento = sessionStorage.getItem('partidas_em_andamento')

	if(partidas_em_andamento){
		btn_jogada_anterior = document.querySelectorAll(".btn_jogada_anterior")

		for(i = 0; i < btn_jogada_anterior.length; i++){
			btn_jogada_anterior[i].addEventListener("click", (e)=>{
				if(usuario == jogador_da_vez){
					confirmacao_jogada_anterior.style.display = "grid"
				}
			})	
		}
	}
	
	if(partidas_em_andamento){
		jogada_anterior_confirmar.addEventListener("click", (e)=>{

			if(usuario == jogador_da_vez){
				function socket_jogada_anterior(dados){
					socket.emit('socket_jogada_anterior', dados)
				}
				dados = {"usuario":usuario, "id_partida":id_partida}
				
				socket_jogada_anterior(dados)

				confirmacao_jogada_anterior.style.display = "none"
			}

		})
	}

	if(partidas_em_andamento){
		jogada_anterior_cancelar.addEventListener("click", (e)=>{
			confirmacao_jogada_anterior.style.display = "none"
		})
	}

	//********************************************************
	//********************************************************
	// --------------------- AREA CHAT -----------------------

	jogador_branca = sessionStorage.getItem('jogador_branca')
	jogador_preta = sessionStorage.getItem('jogador_preta')

	if(jogador_branca && jogador_preta){

		if(usuario == jogador_branca){
			para = jogador_preta
		}
		else if(usuario == jogador_preta){
			para = jogador_branca
		}

		// ----------------------------------------------------
		btn_enviar_mensagem.addEventListener("click", (e)=>{
			
			if(input_enviar_mensagem.value){

				input_mensagem = input_enviar_mensagem.value
				input_enviar_mensagem.value = ""

				function socket_enviar_mensagem_chat(dados){
					socket.emit('socket_enviar_mensagem_chat', dados)	
				}

				mensagem = {'de': usuario, 'para': para, "mensagem": input_mensagem, "id_partida": id_partida}

				socket_enviar_mensagem_chat(mensagem)

			}
			
		})
		// ----------------------------------------------------
		input_enviar_mensagem.addEventListener("keyup", (e)=>{

			if(e.key == "Enter"){
				if(input_enviar_mensagem.value != ""){

					input_mensagem = input_enviar_mensagem.value
					input_enviar_mensagem.value = ""

					function socket_enviar_mensagem_chat(dados){
						socket.emit('socket_enviar_mensagem_chat', dados)	
					}

					mensagem = {'de': usuario, 'para': para, "mensagem": input_mensagem, "id_partida": id_partida}

					socket_enviar_mensagem_chat(mensagem)

				}
			}
		})
		// ----------------------------------------------------

	}

	//********************************************************
	//********************************************************

	function func_area_chat_hide_show(){

		if(area_chat.style.display == "block"){
			area_chat.style.display = "none"
		}
		else if(area_chat.style.display == "none"){
			area_chat.style.display = "block"	
		}
		
	}

	//********************************************************
	//********************************************************
	
}

