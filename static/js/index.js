
partida = JSON.parse(partida.textContent)
status_partida = partida['status']
pecas_partida = partida['pecas']

for(i = 0; i < pecas_partida.length; i++){

	nome_peca 		= pecas_partida[i]["nome_peca"]
	posicao_peca 	= pecas_partida[i]["posicao"]
	imagem_peca 	= pecas_partida[i]["imagem"]

	// ---------------------------ROW 8---------------------------

	if(posicao_peca == 'a8'){
		a8.innerText = nome_peca.split("__")[1]
		a8.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'b8'){
		b8.innerText = nome_peca.split("__")[1]
		b8.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'c8'){
		c8.innerText = nome_peca.split("__")[1]
		c8.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'd8'){
		d8.innerText = nome_peca.split("__")[1]
		d8.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'e8'){
		e8.innerText = nome_peca.split("__")[1]
		e8.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'f8'){
		f8.innerText = nome_peca.split("__")[1]
		f8.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'g8'){
		g8.innerText = nome_peca.split("__")[1]
		g8.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'h8'){
		h8.innerText = nome_peca.split("__")[1]
		h8.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	// ---------------------------ROW 7---------------------------

	if(posicao_peca == 'a7'){
		a7.innerText = nome_peca.split("__")[1]
		a7.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'b7'){
		b7.innerText = nome_peca.split("__")[1]
		b7.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'c7'){
		c7.innerText = nome_peca.split("__")[1]
		c7.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'd7'){
		d7.innerText = nome_peca.split("__")[1]
		d7.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'e7'){
		e7.innerText = nome_peca.split("__")[1]
		e7.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'f7'){
		f7.innerText = nome_peca.split("__")[1]
		f7.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'g7'){
		g7.innerText = nome_peca.split("__")[1]
		g7.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'h7'){
		h7.innerText = nome_peca.split("__")[1]
		h7.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}


	// ---------------------------ROW 6---------------------------

	if(posicao_peca == 'a6'){
		a6.innerText = nome_peca.split("__")[1]
		a6.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'b6'){
		b6.innerText = nome_peca.split("__")[1]
		b6.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'c6'){
		c6.innerText = nome_peca.split("__")[1]
		c6.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'd6'){
		d6.innerText = nome_peca.split("__")[1]
		d6.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'e6'){
		e6.innerText = nome_peca.split("__")[1]
		e6.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'f6'){
		f6.innerText = nome_peca.split("__")[1]
		f6.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'g6'){
		g6.innerText = nome_peca.split("__")[1]
		g6.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'h6'){
		h6.innerText = nome_peca.split("__")[1]
		h6.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	// ---------------------------ROW 5---------------------------

	if(posicao_peca == 'a5'){
		a5.innerText = nome_peca.split("__")[1]
		a5.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'b5'){
		b5.innerText = nome_peca.split("__")[1]
		b5.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'c5'){
		c5.innerText = nome_peca.split("__")[1]
		c5.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'd5'){
		d5.innerText = nome_peca.split("__")[1]
		d5.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'e5'){
		e5.innerText = nome_peca.split("__")[1]
		e5.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'f5'){
		f5.innerText = nome_peca.split("__")[1]
		f5.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'g5'){
		g5.innerText = nome_peca.split("__")[1]
		g5.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'h5'){
		h5.innerText = nome_peca.split("__")[1]
		h5.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	// ---------------------------ROW 4---------------------------

	if(posicao_peca == 'a4'){
		a4.innerText = nome_peca.split("__")[1]
		a4.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'b4'){
		b4.innerText = nome_peca.split("__")[1]
		b4.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'c4'){
		c4.innerText = nome_peca.split("__")[1]
		c4.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'd4'){
		d4.innerText = nome_peca.split("__")[1]
		d4.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'e4'){
		e4.innerText = nome_peca.split("__")[1]
		e4.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'f4'){
		f4.innerText = nome_peca.split("__")[1]
		f4.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'g4'){
		g4.innerText = nome_peca.split("__")[1]
		g4.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'h4'){
		h4.innerText = nome_peca.split("__")[1]
		h4.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	// ---------------------------ROW 3---------------------------

	if(posicao_peca == 'a3'){
		a3.innerText = nome_peca.split("__")[1]
		a3.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'b3'){
		b3.innerText = nome_peca.split("__")[1]
		b3.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'c3'){
		c3.innerText = nome_peca.split("__")[1]
		c3.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'd3'){
		d3.innerText = nome_peca.split("__")[1]
		d3.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'e3'){
		e3.innerText = nome_peca.split("__")[1]
		e3.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'f3'){
		f3.innerText = nome_peca.split("__")[1]
		f3.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'g3'){
		g3.innerText = nome_peca.split("__")[1]
		g3.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'h3'){
		h3.innerText = nome_peca.split("__")[1]
		h3.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	// ---------------------------ROW 2---------------------------

	if(posicao_peca == 'a2'){
		a2.innerText = nome_peca.split("__")[1]
		a2.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'b2'){
		b2.innerText = nome_peca.split("__")[1]
		b2.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'c2'){
		c2.innerText = nome_peca.split("__")[1]
		c2.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'd2'){
		d2.innerText = nome_peca.split("__")[1]
		d2.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'e2'){
		e2.innerText = nome_peca.split("__")[1]
		e2.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'f2'){
		f2.innerText = nome_peca.split("__")[1]
		f2.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'g2'){
		g2.innerText = nome_peca.split("__")[1]
		g2.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'h2'){
		h2.innerText = nome_peca.split("__")[1]
		h2.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	// ---------------------------ROW 1---------------------------

	if(posicao_peca == 'a1'){
		a1.innerText = nome_peca.split("__")[1]
		a1.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'b1'){
		b1.innerText = nome_peca.split("__")[1]
		b1.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'c1'){
		c1.innerText = nome_peca.split("__")[1]
		c1.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'd1'){
		d1.innerText = nome_peca.split("__")[1]
		d1.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'e1'){
		e1.innerText = nome_peca.split("__")[1]
		e1.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'f1'){
		f1.innerText = nome_peca.split("__")[1]
		f1.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'g1'){
		g1.innerText = nome_peca.split("__")[1]
		g1.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}

	if(posicao_peca == 'h1'){
		h1.innerText = nome_peca.split("__")[1]
		h1.innerHTML = '<img src="'+imagem_peca+'" alt="'+nome_peca+'" width="50" height="50">'
	}
}

function valorCasa(e){
	id_casa = e.id

	for(i = 0; i < pecas_partida.length; i++){
		if(pecas_partida[i]['posicao'] == id_casa){
			console.log(pecas_partida[i])
		}
	}
}
