var firebaseConfig = {
	apiKey: "AIzaSyCtzD_d6_Rc0SN9NSqXTDcYnjxqcUEYW5g",
	authDomain: "maxapp-df7ce.firebaseapp.com",
	databaseURL: "https://maxapp-df7ce.firebaseio.com",
	projectId: "maxapp-df7ce",
	storageBucket: "maxapp-df7ce.appspot.com",
	messagingSenderId: "883374548975",
	appId: "1:883374548975:web:4f11acaedd03d0e3efb81a",
	measurementId: "G-PN5E88EJ6Z"
	};
	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);
	//base de datos
	var database = firebase.database();
	//var storage = firebase.storage();

angular.module('starter.controllers', [])

//Controlador Para registro de usuario
.controller("registroCtrl",function($scope, $state){
	//cerrar sesion del  usuario
	firebase.auth().signOut().then(function(){
	}).catch(function(error){
		var mensaje = error.message;
		console.log(mensaje);
	})
	//variable UID del usuario registrado
	$scope.uid = "";

	$scope.obtener = function(user){
		//Crear usuario con la autenticacion
		firebase.auth().createUserWithEmailAndPassword(user.email, user.contra).then(function a(y){
			// Notificacion que se creo el usuario
			swal("se creo correctamente");
			//obteber uid del ususario registrado
			$scope.uid = y.user.uid;
			//Almacena el ususrio en la base de datos
			firebase.database().ref("/users").child($scope.uid).set({
				correo: user.email,
				nombre: user.nombre,
				uid: $scope.uid
			})
		})

		//cerrar sesion del  usuario
		firebase.auth().signOut().then(function(){
		}).catch(function(error){
			var mensaje = error.message;
			console.log(mensaje);
		})
		//borra el contenido del formulario
		$scope.user = {};
		//re direccion al login
		$state.go("login");
	}
})


//Controlador vista inicio
.controller("loginCtrl",function($scope, $state, $rootScope){

	$rootScope.uid;

	//cerrar sesion del  usuario
	firebase.auth().signOut().then(function(){
	}).catch(function(error){
		var mensaje = error.message;
		console.log(mensaje);
	})
	
	$scope.Inicio = function(userL){
		//Inicio de sesion con firebase
		firebase.auth().signInWithEmailAndPassword(userL.email,userL.password).then(function b(x){
			swal("BIENVENIDO");

			firebase.auth().onAuthStateChanged(function(usuario) {

				if (usuario) {
					//Usuario Activo
					$rootScope.uid = usuario.uid;
				} else {
					//usuario no activo
				}
			})

			$state.go("tab.dash")
		}).catch(function(error){
			var mensaje = error.message;
			console.log(mensaje);
			swal({
  				title: "Error",
				text: "Usuario o Contraseña Incorrecto",
  				icon: "error"
			});
		})
	}

})

//Controlador vista principal
.controller("tutorialCtrl",function($scope){

})

//Controlador vista products mostrar productos por categoria filtrados

.controller("productsCtrl",function($scope, $rootScope){

	$rootScope.carrito = [];
	$rootScope.favoritos = [];
	$rootScope.vista;
	$rootScope.nada;
	//Agrega Productos al Carrito
	$scope.agregar = function(x,cantidad){
		x["cantidad"]=parseInt(cantidad);
		$rootScope.carrito.push(x);
			swal("SI", "Se agrego el producto", "success");
		$rootScope.vista = true;
		$rootScope.subtotal = $rootScope.carrito[0].precio * $rootScope.carrito[0].cantidad;
		$rootScope.nada = false;
	}

	//Agregar Productos a Favoritos

	$scope.addFavorites = function(y){
		$rootScope.favoritos.push(y);
		swal("SI", "Se agrego a favoritos", "success")
	}

})

//controlador vista de productos por categoria sin filtrar
.controller('DashCtrl', function($scope,$rootScope, $state) {

	$rootScope.name;
	$rootScope.email;
	$rootScope.foto;

	firebase.database().ref("/users/"+$rootScope.uid).once("value").then(function(data){
		$rootScope.name = data.val().nombre;
		$rootScope.email = data.val().correo;
		$rootScope.foto = data.val().foto;
	})

	$rootScope.listaProductos=[];
	$rootScope.lista = [];
	firebase.database().ref("/productos").on("value", function(p){
		$rootScope.listaProductos = p.val();

	p.forEach(function(datos){
		$rootScope.lista.push(datos.val());
	})

		console.log($rootScope.listaProductos);
	})

	//Diccionario categoria de productos
	$rootScope.Categorias = [
		{
			nombreCategoria : "TV y VIDEO",
			imagen : "img/tag1.png",
			descripcion:"Televisores, Audio y Reproductores.",
			banner: "img/tele.jpg"
		},
		{
			nombreCategoria : "CELULARES",
			imagen : "img/tag2.png",
		 	descripcion:"Tigo, Claro y Liberados.",
		 	banner: "img/cel.jpg"
		},
		{
			nombreCategoria : "LINEA BLANCA",
			imagen : "img/tag3.png",
			descripcion:"Refrigeracion, Estufas, Lavadoras.",
			banner: "img/refri2.jpg"
		},
		{
			nombreCategoria : "VIDEOJUEGOS",
			imagen : "img/tag4.png",
			descripcion:"Playstation, Xbox One, Pc Gaming.",
			banner: "img/game.jpg"
		},
		{
			nombreCategoria : "COMPUTACION",
			imagen : "img/tag5.png",
			descripcion:"Laptop, Desktop, Accesorios.",
			banner: "img/compu.jpg"
		},
		{
			nombreCategoria : "AUDIO",
			imagen : "img/tag6.png",
			descripcion:"Audifonos, Fiestas, Bocinas Personales.",
			banner: "img/audio1.png"
		}
  
	]

	//mostrar productos filtrados por categoria
	$scope.viewProducts = function(ncategoria){
		$rootScope.nombreCategoria = ncategoria;
		$state.go("products")
	}

})

.controller('carritoCtrl', function($scope, Chats, $rootScope) {
	
	if($rootScope.favoritos == undefined){
		$rootScope.vista = false;
		$rootScope.nada = true;
	}

})

//controlador favoritos
.controller("favoritosCtrl", function($scope, $rootScope, $state){

	if($rootScope.carrito == undefined){
		$rootScope.vista = false;
		$rootScope.nada = true;
	}

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
	$scope.chat = Chats.get($stateParams.chatId);
})

// Controlador Vista Perfil
.controller('AccountCtrl', function($scope, $rootScope, $state) {

	var storage = firebase.storage();

	var uploadFoto;
	var foto;
	var nav;
	var file;
	var name;
	
	// Preload and Preview Image
	$("#foto").on("change",function(){
	    var uploadFoto = document.getElementById("foto").value;
	    var foto       = document.getElementById("foto").files;
	    var nav = window.URL || window.webkitURL;

	    if(uploadFoto !=''){
	        var type = foto[0].type;
	        var name = foto[0].name;
	        if(type != 'image/jpeg' && type != 'image/jpg' && type != 'image/png'){
	            $("#img").remove();
	            //$(".delPhoto").addClass('notBlock');
	            $('#foto').val('');
	            return false;
	        }else{
	            $("#img").remove();
	            //$(".delPhoto").removeClass('notBlock');
	            var objeto_url = nav.createObjectURL(this.files[0]);
	            file = this.files[0];
	            $(".prevPhoto").append("<img class='previewProfile' id='img' src="+objeto_url+">");
	            $(".upimg label").remove();
	        }
	    }else{
	        alert("No selecciono foto");
	        $("#img").remove();
	    }
	});

	var enlace;

	//almacenar imagen en la base de datos
	$scope.saveChange = function(){
		//creo una referencia al lugar donde guardamos el archivo
		var refStorage = storage.ref('Users/').child(file.name);
		//Almacenar la imagen dentro de la referncia del storage
		var uploadTask = refStorage.put(file).then(function(result){
			//get Url and store pass
			refStorage.getDownloadURL().then(function(result){

				var enlace = result;


				//crear referencia al usuario
				var database = firebase.database().ref().child("users/"+$rootScope.uid);
				database.update({
					foto: enlace
				})

			})

		})

	}

});