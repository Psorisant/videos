// Estado del carrito
let carrito = {};

// Elementos del DOM
const domElements = {
    cartBtn: document.querySelector('.cart-btn'),
    cartBadge: document.getElementById('contador-carrito'),
    cartSidebar: document.getElementById('menuCarrito'),
    cartList: document.getElementById('lista-carrito'),
    cartTotal: document.getElementById('total-carrito'),
    emptyCartBtn: document.getElementById('btnVaciar')
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    actualizarCarrito();
});

function toggleCarrito() {
    domElements.cartSidebar.classList.toggle('active');
    document.body.style.overflow = domElements.cartSidebar.classList.contains('active') ? 'hidden' : '';
}

function agregarAlCarrito(id, nombre, precio) {
    if (carrito[id]) {
        carrito[id].cantidad++;
    } else {
        carrito[id] = { nombre, cantidad: 1, precio };
    }
    actualizarCarrito();
    mostrarNotificacion(nombre, carrito[id].cantidad);
}

function actualizarCarrito() {
    const listaCarrito = domElements.cartList;
    const totalCarrito = domElements.cartTotal;
    const contadorCarrito = domElements.cartBadge;
    const btnVaciar = domElements.emptyCartBtn;
    let total = 0;
    let cantidadTotal = 0;
    let mensajeDescuento = '';

    if (listaCarrito) {
        listaCarrito.innerHTML = Object.entries(carrito).map(([id, item]) => {
            let subtotal = item.precio * item.cantidad;

            // Aplicar descuentos según la cantidad
            if (item.cantidad === 2) {
                subtotal = 95000;
                mensajeDescuento = 'Descuento por compra superior a una unidad';
            } else if (item.cantidad === 3) {
                subtotal = 120000;
                mensajeDescuento = 'Descuento por compra superior a una unidad';
            } else if (item.cantidad >= 4) {
                subtotal = item.precio * item.cantidad;
                mensajeDescuento = '';
            }

            total += subtotal;
            cantidadTotal += item.cantidad;

            return `
                <div class="cart-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-0">${item.nombre}</h6>
                            <p class="text-muted mb-0">$${subtotal.toLocaleString()} (${item.cantidad} unidades)</p>
                        </div>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-secondary" onclick="modificarCantidad(${id}, -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="btn btn-outline-secondary" onclick="modificarCantidad(${id}, 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    if (totalCarrito) totalCarrito.textContent = `$${total.toLocaleString()}`;
    if (contadorCarrito) {
        contadorCarrito.textContent = cantidadTotal;
        contadorCarrito.style.display = cantidadTotal > 0 ? 'block' : 'none';
    }
    if (btnVaciar) btnVaciar.style.display = cantidadTotal > 0 ? 'block' : 'none';

    if (mensajeDescuento) {
        listaCarrito.innerHTML += `<strong><p class="text-danger text-center">${mensajeDescuento}</p></strong>`;
    }
}

function modificarCantidad(id, cambio) {
    if (!carrito[id]) return;

    carrito[id].cantidad += cambio;
    if (carrito[id].cantidad <= 0) {
        delete carrito[id];
    }

    actualizarCarrito();
}

function vaciarCarrito() {
    if (!confirm('¿Estás seguro de que deseas vaciar el carrito?')) return;

    carrito = {};
    actualizarCarrito();
    
    // Mostrar notificación personalizada cuando el carrito se vacía
    mostrarNotificacion('Carrito vacío', '', true);

    // Cerrar el carrito antes de redirigir
    toggleCarrito();
}


function mostrarNotificacion(nombreProducto, cantidad, esVaciado = false) {
    const notificacion = document.getElementById('notificacion-carrito');
    const mensajeNotificacion = document.getElementById('mensaje-notificacion');
    const nombreProductoElem = document.getElementById('nombre-producto');
    const cantidadProductoElem = document.getElementById('cantidad-producto');
    const iconoCheck = document.querySelector('.icono-check');

    if (esVaciado) {
        mensajeNotificacion.innerHTML = "<strong>Carrito vaciado correctamente</strong>";
        nombreProductoElem.textContent = "";
        cantidadProductoElem.textContent = "";
        notificacion.style.background = "#dc3545"; // Rojo para destacar el vaciado
        iconoCheck.innerHTML = "❌"; // Cambia el ícono a una equis
        iconoCheck.style.background = "white"; // Mantiene el diseño
        iconoCheck.style.color = "#dc3545"; // Hace la equis roja
    } else {
        nombreProductoElem.textContent = nombreProducto;
        cantidadProductoElem.textContent = `Cantidad en carrito: ${cantidad}`;
        notificacion.style.background = "#28a745"; // Verde para productos agregados
        iconoCheck.innerHTML = "✔"; // Devuelve el ícono a check
        iconoCheck.style.background = "white";
        iconoCheck.style.color = "#28a745";
    }

    notificacion.classList.add('mostrar');

    setTimeout(() => {
        notificacion.classList.remove('mostrar');
    }, 1000);
}


function cerrarNotificacion() {
    document.getElementById('notificacion-carrito').classList.remove('mostrar');
}

function comprarPorWhatsApp() {
    if (Object.keys(carrito).length === 0) {
        mostrarNotificacion('El carrito está vacío');
        return;
    }

    let mensaje = "¡Hola! Me gustaría realizar el siguiente pedido:\n\n";
    let total = 0;

    Object.entries(carrito).forEach(([_, item]) => {
        let subtotal = item.precio * item.cantidad;

        if (item.cantidad === 2) subtotal = 95000;
        if (item.cantidad === 3) subtotal = 120000;

        mensaje += `${item.nombre} x${item.cantidad} - $${subtotal.toLocaleString()}\n`;
        total += subtotal;
    });

    mensaje += `\nTotal: $${total.toLocaleString()}`;

    const numeroWhatsApp = "573202274408";
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    carrito = {};
    actualizarCarrito();

    // 🔹 Cerrar el carrito antes de redirigir
    toggleCarrito();

    // 🔹 Redirigir al menú y abrir WhatsApp después de 1 segundo
    setTimeout(() => {
        window.location.href = "#";
        window.open(url, "_blank");
    }, 1000);
}
//Eliminar hamburguesa en móvil
document.addEventListener("DOMContentLoaded", function () {
    if (window.innerWidth <= 768) {
        let menu = document.getElementById("navbarNav"); // Menú desplegable
        let menuToggler = document.querySelector(".navbar-toggler"); // Botón hamburguesa

        if (menu) menu.remove(); // Elimina el menú
        if (menuToggler) menuToggler.remove(); // Elimina el botón hamburguesa
    }
});

// Chatbot
document.addEventListener("DOMContentLoaded", function () {
    const chatWidget = document.querySelector(".chat-widget");
    const chatBtn = document.querySelector(".chat-btn");
    const closeChat = document.querySelector(".close-chat");
    const nextBtn = document.querySelector(".next-btn");
    const prevBtn = document.querySelector(".prev-btn");
    const pages = document.querySelectorAll(".faq-page");
    let currentPage = 0;

    chatBtn.addEventListener("click", function () {
        chatWidget.classList.add("active");
    });

    closeChat.addEventListener("click", function () {
        chatWidget.classList.remove("active");
        resetChat();
    });

    function updateFAQPage() {
        pages.forEach((page, index) => {
            page.classList.toggle("active", index === currentPage);
        });

        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === pages.length - 1;
    }

    nextBtn.addEventListener("click", function () {
        if (currentPage < pages.length - 1) {
            currentPage++;
            updateFAQPage();
        }
    });

    prevBtn.addEventListener("click", function () {
        if (currentPage > 0) {
            currentPage--;
            updateFAQPage();
        }
    });

    document.querySelectorAll(".faq-question").forEach((question) => {
        question.addEventListener("click", function () {
            this.nextElementSibling.classList.toggle("visible");
        });
    });

    function resetChat() {
        currentPage = 0;
        updateFAQPage();
        document.querySelectorAll(".faq-answer").forEach(answer => {
            answer.classList.remove("visible");
        });
    }

    updateFAQPage();
});
