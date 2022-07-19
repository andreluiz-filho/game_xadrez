var url = window.location.origin

link_partida = sessionStorage.getItem('link_partida')
titulo_status_partida.innerText = 'Chave Sala: '+link_partida

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

var api_partida 	= url+'/api_partida'
var api_moverPeca 	= url+'/api_moverPeca'

fetch(api_partida)
.then((resp) => resp.json())
.then(function(data){

	status_partida 	= data['status']
	pecas_partida 	= data['pecas']
	
	atualizarPartida(pecas_partida)

})

//********************************************************
//***********************MOVER PEÇA***********************

var casas = document.querySelectorAll("td")

for(casa of casas){

	casa.addEventListener("click", (e)=> {
	
		if(e.target.tagName == "IMG"){
			sessionStorage.setItem('peca_selecionada', e.target.alt)
			
			nome_peca = e.target.alt.split('___')[0]
			posicao_peca = e.target.alt.split('___')[1]

			nome_peca_tabela_status.innerText = nome_peca
			posicao_peca_tabela_status.innerText = posicao_peca
			
			/*
			conteudo_ultima_peca_selecionada.innerHTML = 
			`
				<table id="tabela_status">
					<tr>
						<td>Nome da Peça: </td>
						<td>${nome_peca}</td>
					</tr>
					<tr>
						<td>Posição Anterior: </td>
						<td>${posicao_peca}</td>
					</tr>
				</table>
			`
			*/

		}else if(e.target.tagName == "TD"){

			const peca_selecionada 			= sessionStorage.getItem('peca_selecionada')
			
			nome_peca_selecionada 			= peca_selecionada.split('___')[0]
			posicao_peca_selecionada 		= peca_selecionada.split('___')[1]
			nova_posicao_peca_selecionada 	= e.target.id

			data_mover_peca = {'nome_peca':nome_peca_selecionada, 'posicao_atual':posicao_peca_selecionada, 'posicao_nova':nova_posicao_peca_selecionada}

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
				
				atualizarPartida(pecas_partida)
			})
			.catch(error => console.error('Error:', error))	
		}
	});	
}

//********************************************************
//********************************************************