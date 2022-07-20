
//********************************************************
//********************************************************

var url = window.location.origin

chave_partida = sessionStorage.getItem('chave_partida')

titulo_status_partida.innerText = 'Chave Sala: '+chave_partida

//********************************************************
//*******************CRIA O TABULEIRO*********************

rows = [8, 7, 6, 5, 4, 3, 2, 1]
cols = [...Array(8).keys()]
letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

for(row of rows){

	var tr = document.createElement('tr');

	for(col of cols){
		var td = document.createElement('td');

		if(row % 2 == col % 2){
			td.className = " casa casa_cor_secundaria";
		}else{
			td.className = " casa casa_cor_primaria";
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

			nome_peca 		= peca['nome_peca']
	    	posicao_peca 	= peca['posicao']
	    	imagem_peca		= peca['imagem']

	    	var img = new Image();
	    	img.src = imagem_peca
	    	img.width = "70"
	    	img.height = "70"
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

var api_partida 	= url+'/api_partida'
var api_moverPeca 	= url+'/api_moverPeca'

fetch(api_partida, {
	method: 'POST',
	body: JSON.stringify({"chave_partida":chave_partida}),
	headers:{
	'Content-Type': 'application/json'
	}
})
.then(res => res.json())
.then(function(data){
	status_partida 	= data['status']
	pecas_partida 	= data['pecas']

	separaPecas(pecas_partida)
})
.catch(error => console.error('Error:', error))


//********************************************************
//*********************MOVER/CAPTURAR*********************

var casas = document.querySelectorAll("td")

for(casa of casas){

	casa.addEventListener("click", (e)=> {

		if(e.target.tagName == "IMG"){
			
			peca_selecionada = sessionStorage.getItem('peca_selecionada')
			

			if(peca_selecionada){
				peca_target_nome 		= e.target.alt.split("___")[0]
				peca_target_posicao 	= e.target.alt.split("___")[1]
				peca_target_cor 		= e.target.alt.split("__")[0]
				peca_selecionada_cor 	= peca_selecionada.split("__")[0]
				
				nome_peca = peca_selecionada.split('___')[0]
				posicao_peca = peca_selecionada.split('___')[1]

				nome_peca_tabela_status.innerText = nome_peca
				posicao_peca_tabela_status.innerText = posicao_peca

				if(peca_selecionada_cor != peca_target_cor){
					
					data_capturar_peca = {'chave_partida':chave_partida, 
											'nome_peca':peca_target_nome, 
											'posicao_atual':peca_target_posicao, 
											'nome_peca_dominante':peca_selecionada,
											'funcao':'capturar'
										}

					fetch(api_moverPeca, {
						  method: 'POST',
						  body: JSON.stringify(data_capturar_peca),
						  headers:{
						    'Content-Type': 'application/json'
						  }
						})
					.then(res => res.json())
					.then(function(data){
						status_partida 	= data['status']
						pecas_partida 	= data['pecas']

						separaPecas(pecas_partida)
						atualizarPartida(lista_pecas_ativas)


					})
					.catch(error => console.error('Error:', error))	
					
					sessionStorage.removeItem('peca_selecionada')
				}
				
			}else{
				sessionStorage.setItem('peca_selecionada', e.target.alt)

				nome_peca = e.target.alt.split('___')[0]
				posicao_peca = e.target.alt.split('___')[1]

				nome_peca_tabela_status.innerText = nome_peca
				posicao_peca_tabela_status.innerText = posicao_peca
			}

		}else if(e.target.tagName == "TD"){

			peca_selecionada = sessionStorage.getItem('peca_selecionada')
			
			if(peca_selecionada){
				
				nome_peca_selecionada 			= peca_selecionada.split('___')[0]
				posicao_peca_selecionada 		= peca_selecionada.split('___')[1]
				nova_posicao_peca_selecionada 	= e.target.id

				data_mover_peca = {'chave_partida':chave_partida, 
									'nome_peca':nome_peca_selecionada, 
									'posicao_atual':posicao_peca_selecionada, 
									'posicao_nova':nova_posicao_peca_selecionada,
									'funcao':'mover'
								}

				sessionStorage.removeItem('peca_selecionada')

				fetch(api_moverPeca, {
					  method: 'POST',
					  body: JSON.stringify(data_mover_peca),
					  headers:{
					    'Content-Type': 'application/json'
					  }
					})
				.then(res => res.json())
				.then(function(data){
					status_partida 	= data['status']
					pecas_partida 	= data['pecas']
					
					separaPecas(pecas_partida)
				})
				.catch(error => console.error('Error:', error))	
			}
		}
	});	

	casa.addEventListener("dblclick", (e)=>{
		sessionStorage.removeItem('peca_selecionada')
		nome_peca_tabela_status.innerText = ""
		posicao_peca_tabela_status.innerText = ""
	});
}

//********************************************************
//********************************************************
///////////////////////////AREA ADMIN/////////////////////
//********************************************************
//********************************************************

function entrar_partida(){
	sessionStorage.setItem('chave_partida', link_partida.value)
	window.location.href = url+'/partida';
}

function nova_partida(){
	
	var recurso = url+"/novaPartida"

	
	fetch(recurso, {
		  method: 'POST',
		  body: JSON.stringify({"status":"Iniciar Partida"}),
		  headers:{
		    'Content-Type': 'application/json'
		  }
		})
	.then(res => res.json())
	.then(function(data){
		console.log(data)
		sessionStorage.setItem('chave_partida', data['chave_sala'])

		window.location.href = url+'/partida';
	})
	.catch(error => console.error('Error:', error))
}

function sair_partida(){
	sessionStorage.clear()
	window.location.href = url+'/partida';
}

//********************************************************
//********************************************************
//********************************************************
//********************************************************