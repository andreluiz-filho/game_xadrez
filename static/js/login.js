
//********************************************************

var url = window.location.origin

//********************************************************

sessionStorage.clear()

function login_usuario(){
	
	var usuario 	= input_usuario.value
	var id_partida 	= input_id_partida.value

	var api_login_usuario = url+'/api_login_usuario'

	dados = {"usuario":usuario, "id_partida":id_partida}

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

		if(key_data.includes('erro')){
			mensagem_erro.style.display = "grid"
			mensagem_erro.innerHTML = 'Falha no Login'

			setTimeout(function() {
				mensagem_erro.style.display = "none"
				mensagem_erro.innerHTML = ""
			}, 2000);

		}
		else if(key_data.includes('id_partida')){

			sessionStorage.setItem("usuario", data['usuario'])
			sessionStorage.setItem('id_partida', data['id_partida'])
			sessionStorage.setItem('jogador_da_vez', data['jogador_da_vez'])
			sessionStorage.setItem('cor_da_vez', data['cor_da_vez'])
			sessionStorage.setItem('usuario_cor', data['usuario_cor'])

			window.location.href = url+'/partida';
		}
		else if(key_data.includes('usuario')){
			mensagem_erro.innerHTML = 'Login Realizado'

			sessionStorage.setItem("usuario", data['usuario'])

			window.location.href = url+'/partida';
		}
		
	})
	.catch(error => console.error('Error:', error))
	
}

//********************************************************