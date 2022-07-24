
//********************************************************
//********************************************************

var url = window.location.origin

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

		var casas = table.querySelectorAll("td")
		
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
		    	//img.width = "60"
		    	//img.height = "60"
		    	img.width = "40"
		    	img.height = "40"
		    	img.alt = nome_peca+'___'+posicao_peca

				if(posicao_peca == casas[i].id){
					casas[i].appendChild(img);
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

		area_admin_jogador_branca.style.background = ""
		area_admin_jogador_preta.style.background = ""

		if(jogador_da_vez == usuario){
			area_admin_hide_show.style.background = "green"
		}else{
			area_admin_hide_show.style.background = "#4e82d2"
		}

		if(jogador_da_vez == jogador_branca){
			area_admin_jogador_branca.style.background = "green"
		}
		else if(jogador_da_vez == jogador_preta){
			area_admin_jogador_preta.style.background = "green"

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
		
	}

	//********************************************************
	//********************************************************
	/*
		Esse bloco de código acessa a API e consulta todas 
		as peças e seus atributos
	*/


	function func_api_partida(){
		
		sessionStorage.removeItem('peca_selecionada')

		usuario 	= sessionStorage.getItem('usuario')
		usuario_cor = sessionStorage.getItem('usuario_cor')

		jogador_branca = sessionStorage.getItem('jogador_branca')
		jogador_preta = sessionStorage.getItem('jogador_preta')

		jogador_da_vez 	= sessionStorage.getItem('jogador_da_vez')
		cor_da_vez 		= sessionStorage.getItem('cor_da_vez')

		key_session = Object.keys(sessionStorage)
		if(key_session.includes("visitante")){
			area_usuario_titulo.textContent = ""
			area_usuario_titulo.textContent = usuario+" - Visitante"
		}
		else{
			area_usuario_titulo.textContent = ""
			area_usuario_titulo.textContent = usuario
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
				
				
				//****************************
				//Adicionar a Mensagem de Erro
				//****************************


			}
			else if(key_data.includes('pecas')){

				sessionStorage.setItem('jogador_da_vez', data['jogador_da_vez'])
				sessionStorage.setItem('cor_da_vez', data['cor_da_vez'])

				status_partida 	= data['status']
				pecas_partida 	= data['pecas']

				separaPecas(pecas_partida)
				
			}
		})
		.catch(error => console.error('Error:', error))
	
	}

	if(id_partida && id_partida != 'undefined' && jogador_da_vez){
		
		// --------------------------------------------------------------

		func_api_partida();

		setInterval(function() {func_api_partida()}, 5000);

		// --------------------------------------------------------------
	
	}

	//********************************************************
	//*********************MOVER/CAPTURAR*********************

	var casas = document.querySelectorAll("td")

	for(casa of casas){

		casa.addEventListener("click", (e)=> {

			jogador_da_vez = sessionStorage.getItem('jogador_da_vez')
			cor_da_vez = sessionStorage.getItem('cor_da_vez')

			jogador_branca = sessionStorage.getItem('jogador_branca')
			jogador_preta = sessionStorage.getItem('jogador_preta')

			function moverPeca(dados){

				fetch(api_moverPeca, {
					  method: 'POST',
					  body: JSON.stringify(dados),
					  headers:{
					    'Content-Type': 'application/json'
					  }
					})
				.then(res => res.json())
				.then(function(data){

					key_data = Object.keys(data)

					if(key_data.includes('erro')){

						erro_mover_captura.textContent = data['erro']
						sessionStorage.removeItem('peca_selecionada')
					}
					else{

						if(key_data.includes('ultima_jogada')){
							console.log("***", data['ultima_jogada'])
						}
						
						status_partida 	= data['status']
						pecas_partida 	= data['pecas']

						func_api_partida()

						sessionStorage.setItem('jogador_da_vez', data['jogador_da_vez'])
						sessionStorage.setItem('cor_da_vez', data['cor_da_vez'])
					}
				})
				.catch(error => console.error('Error:', error))	

			}

			if(e.target.tagName == "IMG"){

				if(usuario == jogador_da_vez && usuario_cor == cor_da_vez){
				
					peca_selecionada = sessionStorage.getItem('peca_selecionada')
					peca_target_cor = e.target.alt.split("__")[0]

					if(cor_da_vez == peca_target_cor){

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
										
										moverPeca(data_capturar_peca)
									
									}
								}
								
							}else{
								sessionStorage.setItem('peca_selecionada', e.target.alt)

								peca_selecionada_nome 		= e.target.alt.split('___')[0]
								peca_selecionada_posicao 	= e.target.alt.split('___')[1]

								e.target.style.border = "thick solid green";
								e.target.style.borderRadius = "30px";
							
							}
						
						}else{
							console.log("Não é possivel Movimentar Essa Peça")

							e.target.style.border = "thick solid red";
							e.target.style.borderRadius = "30px";
						
							setInterval(function() {
								e.target.style.border = "";
							}, 1000);
						}

					}else{
						
						console.log("Não é possivel Movimentar Essa Peça")

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
										
										moverPeca(data_capturar_peca)
										
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
						e.target.style.border = "thick solid #ccc";
					}, 1000);
				}

			}else if(e.target.tagName == "TD"){

				peca_selecionada = sessionStorage.getItem('peca_selecionada')
				
				if(peca_selecionada){
					
					peca_selecionada_nome		= peca_selecionada.split('___')[0]
					peca_selecionada_posicao	= peca_selecionada.split('___')[1]
					target_posicao 				= e.target.id

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
					moverPeca(data_mover_peca)
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

	// ------------------- ENTRAR PARTIDA -------------------
	/*
	entrar_partida = document.querySelector('.entrar_partida')
	entrar_partida.addEventListener("click", (e)=>{
		
		var recurso = url+"/entrarPartida"
		if(link_partida.value != ""){

			fetch(recurso, {
				  method: 'POST',
				  body: JSON.stringify({"usuario":usuario, "id_partida":link_partida.value}),
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

				window.location.href = url+'/partida';
			})
			.catch(error => console.error('Error:', error))
		}
	
	});
	*/
	//********************************************************
	//********************************************************

	// -------------------- NOVA PARTIDA --------------------
	
	nova_partida.addEventListener("click", (e)=>{
		
		var recurso = url+"/novaPartida"
		
		fetch(recurso, {
			  method: 'POST',
			  body: JSON.stringify({"usuario":usuario}),
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
}

