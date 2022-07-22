
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

	titulo_status_partida.innerText = 'Chave Sala: '+id_partida

	//********************************************************
	//*******************CRIA O TABULEIRO*********************

	rows = [9, 8, 7, 6, 5, 4, 3, 2, 1]
	cols = [...Array(8).keys()]
	letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

	for(row of rows){

		var tr = document.createElement('tr');
		tr.className = " row"
		if(row == 9){

			// -----------------------------------------------------------
			// Area Entrar Partida
			// -----------------------------------------------------------
			/*
			var td_entrar = document.createElement('td');
			var h3_entrar = document.createElement('h3');
			var input_entrar = document.createElement('input');
			var button_entrar = document.createElement('button');
			
			h3_entrar.id = "usuario_logado"
			h3_entrar.textContent = usuario

			input_entrar.type = 'text'
			input_entrar.name = 'link_partida'
			input_entrar.id   = 'link_partida'

			button_entrar.type = 'button'
			button_entrar.className = ' btn btn-secondary entrar_partida'
			button_entrar.textContent = 'Entrar Partida'
			
			td_entrar.appendChild(h3_entrar)
			td_entrar.appendChild(input_entrar)
			td_entrar.appendChild(button_entrar)
			td_entrar.className = " topo_menu col";
			*/
			// -----------------------------------------------------------
			// Area Nova Partida
			// -----------------------------------------------------------





			/*
			var td_nova 	= document.createElement('td');
			var button_nova = document.createElement('button');
			var button_sair = document.createElement('button');
			var img_nova 	= new Image();

			button_nova.type = 'button'
			button_nova.className = ' btn btn-secondary nova_partida'
			//button_nova.textContent = 'Nova Partida'

			img_nova.src = '/static/img/plus.svg'
	    	img_nova.width = "20"
	    	img_nova.height = "20"

			button_nova.appendChild(img_nova)

			button_sair.type = 'button'
			button_sair.className = ' btn btn-secondary sair_partida'
			button_sair.textContent = 'Sair'

			td_nova.appendChild(button_nova)
			td_nova.appendChild(button_sair)
			td_nova.className = " topo_menu col";

			// -----------------------------------------------------------

			//tr.appendChild(td_entrar)
			tr.appendChild(td_nova)
			table.appendChild(tr)
			*/



		}else if(row != 9){

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

				nome_peca 		= peca['nome_peca']
		    	posicao_peca 	= peca['posicao']
		    	imagem_peca		= peca['imagem']

		    	var img = new Image();
		    	img.src = imagem_peca
		    	img.width = "60"
		    	img.height = "60"
		    	img.style.border = "thick solid #ccc"
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

		lista_pecas_capturadas = []
		lista_pecas_capturadas_brancas = []
		lista_pecas_capturadas_pretas = []

		lista_pecas_ativas = []
		
		for(peca of data){
			if(peca['capturada'] == 'true'){
				cor_peca = peca['nome_peca'].split('__')[0]
				nome_peca = peca['nome_peca'].split('__')[1].split('_')[0]
				
				nome_peca = cor_peca+'_'+nome_peca

				lista_pecas_capturadas.push(nome_peca)

				if(cor_peca == 'preta'){
					lista_pecas_capturadas_pretas.push(nome_peca)

				}else if(cor_peca == 'branca'){
					lista_pecas_capturadas_brancas.push(nome_peca)
				}

			}else if(peca['capturada'] == 'false'){
				lista_pecas_ativas.push(peca)
			}
		}
		
		atualizarPartida(lista_pecas_ativas)


		capturadas_brancas = document.querySelectorAll('.capturadas_brancas')
		capturadas_pretas = document.querySelectorAll('.capturadas_pretas')

		function qtd_pecas_capturadas(area_capturadas, lista_pecas_capturadas){

			for(i = 0; i < area_capturadas.length; i++){
				area_qtd = area_capturadas[i].children[1]

				area_qtd.innerText = 0

				id_qtd = area_qtd.id.split('_')[1]
				
				for(item of lista_pecas_capturadas){

					nome_peca = item.split('_')[1]
					if(nome_peca == id_qtd){
						area_qtd.innerText = parseInt(area_qtd.innerText)+1
					}
					
				}
				
			}
		}

		qtd_pecas_capturadas(capturadas_brancas, lista_pecas_capturadas_brancas)
		qtd_pecas_capturadas(capturadas_pretas, lista_pecas_capturadas_pretas)
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

			/*			
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
			*/

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

		if(jogador_da_vez != usuario){
			setInterval(function() {func_api_partida()}, 5000);
		}
		else if(jogador_da_vez == usuario){
			setTimeout(function() {func_api_partida()}, 20000);
		}
		

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
						erro_mover_captura.textContent = ""
						status_partida 	= data['status']
						pecas_partida 	= data['pecas']

						separaPecas(pecas_partida)

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

									//nome_peca_tabela_status.innerText = peca_selecionada_nome
									//posicao_peca_tabela_status.innerText = peca_selecionada_posicao

									//nome_peca_tabela_status.innerText = peca_selecionada_nome
									//posicao_peca_tabela_status.innerText = peca_selecionada_posicao

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

								nome_peca_tabela_status.innerText = peca_selecionada_nome
								posicao_peca_tabela_status.innerText = peca_selecionada_posicao

								e.target.style.border = "thick solid green";
							
							}
						
						}else{
							console.log("Não é possivel Movimentar Essa Peça")

							e.target.style.border = "thick solid red";
						
							setInterval(function() {
								e.target.style.border = "thick solid #ccc";
							}, 1000);
						
						}

					}else{
						
						console.log("Não é possivel Movimentar Essa Peça")

						e.target.style.border = "thick solid red";
					
						setInterval(function() {
							e.target.style.border = "thick solid #ccc";
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

									//nome_peca_tabela_status.innerText = peca_selecionada_nome
									//posicao_peca_tabela_status.innerText = peca_selecionada_posicao

									//nome_peca_tabela_status.innerText = peca_selecionada_nome
									//posicao_peca_tabela_status.innerText = peca_selecionada_posicao

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

					fetch(api_moverPeca, {
						  method: 'POST',
						  body: JSON.stringify(data_mover_peca),
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
							erro_mover_captura.textContent = ""
							status_partida 	= data['status']
							pecas_partida 	= data['pecas']

							sessionStorage.setItem('jogador_da_vez', data['jogador_da_vez'])
							sessionStorage.setItem('cor_da_vez', data['cor_da_vez'])

							sessionStorage.setItem('jogador_branca', data['jogador_branca'])
							sessionStorage.setItem('jogador_preta', data['jogador_preta'])

							/*
							jogador_da_vez = sessionStorage.getItem('jogador_da_vez')

							
							if(jogador_da_vez == jogador_branca){
								area_admin_jogador_branca.style.background = "green"
								area_admin_jogador_preta.style.background = ""
							}
							else if(jogador_da_vez == jogador_preta){
								area_admin_jogador_preta.style.background = "green"
								area_admin_jogador_branca.style.background = ""
							}
							
							area_admin_hide_show.style.background = ""
							if(jogador_da_vez == usuario){
								area_admin_hide_show.style.background = "green"
							}else{
								area_admin_hide_show.style.background = "#4e82d2"
							}
							*/

							func_api_partida()
							separaPecas(pecas_partida)
						}
					})
					.catch(error => console.error('Error:', error))	
					
				}
			
			}
		});	

		casa.addEventListener("dblclick", (e)=>{
			sessionStorage.removeItem('peca_selecionada')
			nome_peca_tabela_status.innerText = ""
			posicao_peca_tabela_status.innerText = ""
			e.target.style.border = "thick solid #ccc";
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

	/*
	area_admin.addEventListener("click", (e)=>{
		
		//console.log(e)

		console.log(area_admin_topo, area_admin_topo.style.display)
		console.log(area_admin_conteudo, area_admin_conteudo.style.display)

		area_admin_topo.style.display = 'none'
		area_admin_conteudo.style.display = 'none'

	});

	
	area_admin_hide_show.addEventListener("click", (e)=>{
		
		console.log(area_admin_topo, area_admin_topo.style.display)
		console.log(area_admin_conteudo, area_admin_conteudo.style.display)

		area_admin_topo.style.display = 'block'
		area_admin_conteudo.style.display = 'block'

	});
	*/
	


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

	/*
	function nova_partida(){
		
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
			
			sessionStorage.setItem('chave_partida', data['chave_partida'])
			sessionStorage.setItem('jogador_da_vez', data['jogador_da_vez'])

			window.location.href = url+'/partida';
		})
		.catch(error => console.error('Error:', error))
	}

	function sair_partida(){
		sessionStorage.clear()
		window.location.href = url+'/partida';
	}
	*/
	//********************************************************
	//********************************************************
}

