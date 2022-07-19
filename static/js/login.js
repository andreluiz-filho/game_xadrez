var url = window.location.origin

function entrar_partida(){

	/*
	sessionStorage.clear();

	link_partida = document.querySelector("#link_partida")
	sessionStorage.setItem('link_partida', link_partida.value)

	window.location.href = "http://www.devmedia.com.br";
	*/
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
		sessionStorage.setItem('link_partida', data['chave_sala'])

		window.location.href = url+'/partida';
	})
	.catch(error => console.error('Error:', error))	
	
}
