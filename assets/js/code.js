
let carro = []; //Variable global para ir agregando al carrito
let productos = []; // Variable global para almacenar productos


// Referencias a elementos del DOM
const contenedorArticulos = document.querySelector("#articulos");
const mensajeCarritoVacio = document.querySelector("#sin-compras");
const contenedorDeCarrito = document.querySelector("#productos-compras");
const etiquetaTotal = document.querySelector("#total-compras");
const categoriaBoton = document.querySelectorAll(".menuitem");
const btnVaciarCarro = document.querySelector("#btn-vaciar");
const btnFinalizarCompra = document.querySelector("#btn-comprar");




// IniciaApp
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    filtrarArticulos();
    misCompras();
    carritoVacio();
    finalizarCompra();
});
