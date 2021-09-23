//////////////////ANIMACIÓN CON JQUERY//////////
/* $.AutumnLeafStart({
	leavesfolder: "Music/",
	howmanyimgsare: 4,
	initialleaves: 5,
	maxyposition: -10,
	multiplyclick: true,
	multiplynumber: 2,
	infinite: true,
	fallingsequence: 3000
}); */

////////////BARRA DE NAVEGACCION SOBRE PUESTA////////////
$(document).ready(() => $("#navegacion").sticky({topSpacing:0}));


/////////////////////ANIMACION DE LETRAS DEL TITULO////////
let titutloAnimado = $("#titulo");
/* const mensajesCarrusel = ['Bienvenido', 'Uso de LocalStore', 'MusicLocalStore', 'Lista De Musica En LocalStore'];
let contador = 0;
titutloAnimado.text( mensajesCarrusel[0] );
//titutloAnimado.shuffleLetters();

setInterval(() => {
    contador++;
    if( contador >= mensajesCarrusel.length )
    {
        contador = 0;
    }
    titutloAnimado.shuffleLetters({
        "text": mensajesCarrusel[ contador]
    });

}, 4000); */
titutloAnimado.shuffleLetters();



/////////////CREACION DE LAS CLASES////////
//Se asignan los valores que se van a recoger y se guardan en un tipo objeto
class Musica {
    constructor(titulo, artista, album, año, codigo){
        this.titulo = titulo;
        this.artista = artista;
        this.album = album;
        this.año = año;
        this.codigo = codigo;
    }
}

//Graficos servira para agregar los elemntos a la pagina y puedan ser mostrados al cliente
class Graficos{
    static MostrarCanciones()
    {
        const music = DatosLocalStore.TraerMuisca();//se mandan a traer los datos guardados con el metodo de la clase DatosLocalStore
        music.forEach((musica) => Graficos.AgregarCanciones(musica));//se recorre el arreglo recibido con los datos almacenados y despues mandados al siguiente metodo para ser imprimidos  
    }

    static AgregarCanciones(musica)
    {
        const lista = document.querySelector('#musica-list');//se guarda en una variable el body de la tabla del html
        const tr = document.createElement('tr');//se crea una fila en la tabla para insertar los datos guardados
        //se hace la estructura de la fila insertando los valosres guardados
        tr.innerHTML = `
            <td>${musica.titulo}</td>
            <td>${musica.artista}</td>
            <td>${musica.album}</td>
            <td>${musica.año}</td>
            <td>${musica.codigo}</td>
            <td><a hrfe="#" class = "btn btn-danger btm-sm delete">X</a></td>
        `;

        lista.appendChild(tr);//finalmente se agrega la fila en la table para mostrarse

    }

    static EliminarMusica(elemento)
    {
        if(elemento.classList.contains('delete'))
        {
            elemento.parentElement.parentElement.remove();
        }
    }

    static Mensajes(mensaje, className)
    {   //este metodo se ocupara para mostrarle cualquier mensaje al cliente
        const div = document.createElement('div');//se crea un div en html
        div.className = `alert alert-${className}`;//al div de le asigna la classeName
        div.appendChild(document.createTextNode(mensaje));//se crea un nuevo div hijo donde se mostrara el mensaje

        const contenedor = document.querySelector('.contenedor');
        const formulario = document.querySelector('#musica-form');
        contenedor.insertBefore(div, formulario);//se dice que va insertar el div creado antes del formulario. Se puede poner la posición que uno desee

        setTimeout(() => document.querySelector('.alert').remove(), 4000);//Es el timpo que durara el mensaje mostrado patra despues ser removido
    }


    static Limpiar()
    {
        document.getElementById('musica').value = '';
        document.getElementById('artista').value = '';
        document.getElementById('album').value = '';
        document.getElementById('año').value = '';
        document.getElementById('codigo').value = '';
    }

}

//DatosLocalStore sirve para agregar los mismos elemntos de la pagina del cliente pero ahora guardados en la localstore
class DatosLocalStore{
    static TraerMuisca()
    {
        let musica;
        if(localStorage.getItem('musica') === null)//se busca en el localstore si hay datos
        {
            musica = [];//si no hay datos regresa un arreglo vacio
        }
        else
        {
            musica = JSON.parse(localStorage.getItem('musica'));//si hay datos regresa el archivo JSON
        }return musica;
    }

    static AgregarMusica(entradas)
    {
        const musica = DatosLocalStore.TraerMuisca();//se guarda el metodo de arriba
        musica.push(entradas);//se agrega los datos ingresados
        localStorage.setItem('musica',JSON.stringify(musica));//se guardan los datos en la localstore y se transforman en archivo JSON
    }


    static BorrarMusica(codigo)
    {
        const musica = DatosLocalStore.TraerMuisca();
        musica.forEach((music, index) => {
            if(music.codigo == codigo)
            {
                musica.splice(index, 1);
            }
        });
        localStorage.setItem('musica', JSON.stringify(musica));
    }
}



//funcion para cuando cargue la pagina se muestren los datos guardados en el localStore
function cargar()
{
    document.getElementById('musica').focus();
}

document.addEventListener('DOMContentLoaded',Graficos.MostrarCanciones());//Cargar los datsoa guardados en la tabla


document.querySelector('#musica-form').addEventListener('submit',(e) =>{ //controlar el evento submit de la pagina por si se presiona accidentalmente

    e.preventDefault();

// obtener los datos que se manden cuando se presione el sumit

    const titulo = document.querySelector('#musica').value;
    const artista = document.querySelector('#artista').value;
    const album = document.querySelector('#album').value;
    const año = document.querySelector('#año').value;
    const codigo = document.querySelector('#codigo').value;


    //verificar que todos los campos esten llenos

    if(titulo=== '' || artista == '' || album === '' || año === '' || codigo === '')
    {
        Graficos.Mensajes('Debe Llenar Todos los Campos', 'danger');//se llama al metodo, escribe el mensaje a mostrar y se agrega una clase para dar estilo
    }
    else
    {
        const entradas = new Musica(titulo, artista, album, año, codigo);//se llama la clase musica donde se gusradaran las entradas
        DatosLocalStore.AgregarMusica(entradas);//se llama al metodo agregar musica poniendo los datos de la clse musica
        Graficos.AgregarCanciones(entradas);
        Graficos.Mensajes('Has Agregado una Canción', 'success')//imvoca el metodo para mostrar mensajes al usuario
        Graficos.Limpiar();//limpiar el formulario
    }
});

//se crea ele evento click del boton borrar, para eleminar un registro de la tabla

document.querySelector('#musica-list').addEventListener('click',(e) => {
    Graficos.EliminarMusica(e.target);
    DatosLocalStore.BorrarMusica(e.target.parentElement.previousElementSibling.textContent);
    Graficos.Mensajes('Se Elimino Correctamente del LocalStore', 'success');
});
