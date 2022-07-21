
//********************************************************
//********************************************************

var url = window.location.origin

//********************************************************

//********************************************************

function login_usuario(){
	
	var usuario = input_usuario.value
	var api_login_usuario = url+'/api_login_usuario'

	fetch(api_login_usuario, {
		method: 'POST',
		body: JSON.stringify({"usuario":usuario}),
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
		else if(key_data.includes('usuario')){
			mensagem_erro.innerHTML = 'Login Realizado'

			sessionStorage.setItem("usuario", data['usuario'])

			window.location.href = url+'/partida';
		}
	})
	.catch(error => console.error('Error:', error))
	
}

//********************************************************