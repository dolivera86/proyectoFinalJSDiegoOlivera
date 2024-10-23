// Función para cargar los productos desde el JSON
function cargarProductos() {

    fetch("json/data.json")
        .then(resp => resp.json())
        .then(data => {
            productos = data;
            mostrarArticulos(productos);
        });
};


// Función para mostrar articulos
function mostrarArticulos(productosAFiltrar) {

    contenedorArticulos.innerHTML = '';

    productosAFiltrar.forEach(productoDeLista => {
        let articuloElemento = crearArticulo(productoDeLista);
        contenedorArticulos.append(articuloElemento);
    });
};


// Crear elemento
function crearArticulo(productoDeLista) {

    let contenedor = document.createElement("div");
    contenedor.classList.add("productoDeLista");
    contenedor.innerHTML = `
        <img class="zapa-img" src="${productoDeLista.img}" alt="${productoDeLista.referencia}">
        <h3>${productoDeLista.referencia}</h3>
        <p>$${productoDeLista.valor}</p>
    `;

    let botonAgregar = document.createElement("button");
    botonAgregar.classList.add("btn-articulo");
    botonAgregar.textContent = "Agregar al carrito";

    botonAgregar.addEventListener('click', () => {
        agregarAlCarrito(productoDeLista);
        
        // Mostrar notificación con Toastify
        Toastify({
            text: `${productoDeLista.referencia} agregado al carrito!`,
            duration: 3000,
            gravity: "top",
            position: "right",
            avatar: `${productoDeLista.img}`,
            close: true,
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
                borderRadius: "0.5rem",
                color: "black",
            },
        }).showToast();
    });

    contenedor.append(botonAgregar);
    return contenedor;

};


// Función para gestionar filtrado por catgoría
function filtrarArticulos() {

    categoriaBoton.forEach(boton => {
        boton.addEventListener("click", (e) => {

            const estiloSeleccionado = e.currentTarget.parentElement.id;
            
            const carritoContenedor = document.querySelector("#carritoContenedor");
            carritoContenedor.classList.add('d-none');
            document.querySelector("#articulos").classList.remove('d-none');

            const productosCompras = document.querySelector("#productos-compras");
            productosCompras.innerHTML = "";

            const sinCompras = document.querySelector("#sin-compras");
            sinCompras.classList.remove("d-none");
            
            if (estiloSeleccionado === "todo") {
                mostrarArticulos(productos);
            } else {
                const categoriaElegida = productos.filter(productos => productos.categoria.estilo === estiloSeleccionado);
                mostrarArticulos(categoriaElegida);
            }

            categoriaBoton.forEach(boton => boton.classList.remove("catTodas"));
            e.currentTarget.classList.add("catTodas");

        });
    });
};


// Funciones para gestionar el carrito
function agregarAlCarrito(productoDeLista) {

    let productoEnCarrito = carro.filter(item => item.id === productoDeLista.id)[0];

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += 1;
    } else {
        let nuevoProducto = { ...productoDeLista, cantidad: 1 };
        carro.push(nuevoProducto);
    };

    actualizarCarrito();
    actualizarBurbuja();
};


// Función para actualizar número en burbuja de carrito
function actualizarBurbuja() {

    const carritoCantidad = document.querySelector("#carritoCantidad");
    const totalArticulos = carro.reduce((sum, item) => sum + item.cantidad, 0);
    
    carritoCantidad.textContent = totalArticulos;
};


//Función para vaciar carrito
function mostrarCarritoVacio() {

    mensajeCarritoVacio.classList.remove("d-none");
    contenedorDeCarrito.classList.add("d-none");
    etiquetaTotal.textContent = "$0";
};


//Función para actualizar carrito
function actualizarCarrito() {

    if (carro.length === 0) {
        mostrarCarritoVacio();
    } else {
        mostrarCarritoConContenido();
    }
    guardarCarritoEnLocalStorage();
};


// Mostrar carrito con contenido
function mostrarCarritoConContenido() {

    mensajeCarritoVacio.classList.add("d-none");
    contenedorDeCarrito.classList.remove("d-none");
    contenedorDeCarrito.innerHTML = "";

    carro.forEach(articulo => {

        let productoEnCarrito = ProductoEnCarrito(articulo);
        contenedorDeCarrito.append(productoEnCarrito);
    });
    calcularTotal();
};


// Acción menú Mis Productos
function misCompras() {

    const carritoContenedor = document.querySelector("#carritoContenedor");
    const botonMisProductos = document.querySelector('#misProductos');
    const articulos = document.querySelector("#articulos");

    botonMisProductos.addEventListener('click', () => {

        articulos.classList.add('d-none');
        carritoContenedor.classList.remove('d-none');
        actualizarCarrito();
    });
}


//Función botón vaciar carrito
function carritoVacio() {

    btnVaciarCarro.addEventListener('click', () => {

        Swal.fire({
            title: "¿Desea vaciar el carrito?",
            icon: "question",
            iconColor: "green",
            showCloseButton: true,
            showConfirmButton: true,
            showCancelButton: true,

            confirmButtonText: "Confirmar!",
            cancelButtonText: "Cancelar!",

        }).then((result) => {
            if (result.isConfirmed) {
                
                carro.length = 0;
                guardarCarritoEnLocalStorage();
                mostrarCarritoVacio();
                actualizarCarrito();
                actualizarBurbuja();

                Swal.fire({
                    title: "El carrito está vacío!",
                    icon: "success",
                });

            } else if (result.dismiss) {
                Swal.fire("Sigue comprando 💪");
            }
        });

    });

};


// Función botón finalizar compra
function finalizarCompra() {

    btnFinalizarCompra.addEventListener('click', () => {
        if (carro.length === 0) {
            Swal.fire({
                title: "El carrito está vacío",
                text: "No puedes finalizar la compra sin productos.",
                icon: "warning",
            });
            return;
        }

        Swal.fire({
            title: "¿Desea finalizar la compra?",
            icon: "question",
            iconColor: "green",
            showCloseButton: true,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                
                Swal.fire({
                    title: "¡Gracias por tu compra!",
                    text: "Tu pedido ha sido procesado con éxito.",
                    icon: "success",
                });

                carro.length = 0;
                guardarCarritoEnLocalStorage();
                mostrarCarritoVacio();
                actualizarCarrito();
                actualizarBurbuja();

            } else if (result.dismiss) {
                Swal.fire("Sigue comprando 💪");
            }
        });
    });
};


// Crear elemento del producto en el carrito
function ProductoEnCarrito(productoDeLista) {

    let contenedor = document.createElement("div");
    contenedor.classList.add("carrito-producto");
    contenedor.innerHTML = `
        <h3>${productoDeLista.referencia}</h3>
        <p>$${productoDeLista.valor}</p>
        <p>Cantidad: ${productoDeLista.cantidad}</p>
        <p>Subtotal: $${productoDeLista.valor * productoDeLista.cantidad}</p>
    `;

    let botonEliminar = document.createElement("button");
    botonEliminar.textContent = "✖️";

    botonEliminar.onclick = () => eliminarProducto(productoDeLista);
    contenedor.append(botonEliminar);

    return contenedor;
};


// Función para eliminar de a un producto del carrito
function eliminarProducto(productoDeLista) {

    carro = carro.filter(item => item.id !== productoDeLista.id);
    actualizarCarrito();
    actualizarBurbuja();
    calcularTotal();
    guardarCarritoEnLocalStorage();

    Swal.fire({
        title: "Producto eliminado",
        text: `${productoDeLista.referencia} ha sido eliminado del carrito.`,
        icon: "info",
        iconColor: "green",
        confirmButtonText: "OK"
    });
};


// Función para calcular total del carrito
function calcularTotal() {

    let total = carro.reduce((sum, item) => sum + item.valor * item.cantidad, 0);
    etiquetaTotal.textContent = `$${total}`;
};


// Función del LS
function guardarCarritoEnLocalStorage() {

    localStorage.setItem("carritoCompras", JSON.stringify(carro));
};
