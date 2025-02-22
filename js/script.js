let dia = document.getElementById("theme");

// Función para cambiar entre modos
function modo() {
  if (dia.getAttribute("class") == "fa-solid fa-moon") {
    // Cambiar al modo nocturno
    dia.setAttribute("class", "fa-solid fa-sun");
    document.body.setAttribute("class", "nocturno");

    // Guardar en localStorage el estado
    localStorage.setItem("modo", "nocturno");
  } else if (dia.getAttribute("class") == "fa-solid fa-sun") {
    // Cambiar al modo diurno
    dia.setAttribute("class", "fa-solid fa-moon");
    document.body.setAttribute("class", "diurno");

    // Guardar en localStorage el estado
    localStorage.setItem("modo", "diurno");
  }
}

// Al cargar la página, verifica el estado guardado en localStorage
window.onload = function () {
  let modoGuardado = localStorage.getItem("modo");
  let tamanioGuardado = parseFloat(localStorage.getItem("tamanoLetra"));

  // Si hay un tamaño guardado en localStorage, lo aplicamos
  if (tamanioGuardado) {
    tamanioActual = tamanioGuardado;
    actualizarTamanio(tamanioActual);
  } else {
    // Si no hay valor guardado, usamos el tamaño inicial
    actualizarTamanio(tamanioInicial);
  }
  if (modoGuardado === "nocturno") {
    // Si está en modo nocturno, aplica ese estado
    dia.setAttribute("class", "fa-solid fa-sun");
    document.body.setAttribute("class", "nocturno");
  } else if (modoGuardado === "diurno") {
    // Si está en modo diurno, aplica ese estado
    dia.setAttribute("class", "fa-solid fa-moon");
    document.body.setAttribute("class", "diurno");
  }
  if (localStorage.getItem('formData')){
    loadFormData();
  }
  if (localStorage.getItem('paymentInfo')){
    loadPaymentData();
  }

};

// Elementos principales
const aumentarBtn = document.getElementById('aumentar');
const disminuirBtn = document.getElementById('disminuir');
const restablecerBtn = document.getElementById('restablecer');
// Se puede coger el elemento de otra forma?
//const header = document.querySelector("header");
const body = document.body;
const root = document.documentElement;
const headerTitle = document.querySelector("header span");
const nav = document.querySelector("nav");
const aside = document.querySelector("aside");
const main = document.querySelector("main");
//Esto no funciona
//const tituloSection=document.querySelectorAll("main section > span"); 


// Configuración de tamaños
const tamanioInicial = parseFloat(getComputedStyle(root).getPropertyValue('--font-size-base')); // Tamaño inicial en rem
const escala = parseFloat(getComputedStyle(root).getPropertyValue('--font-size-step')); // Incremento/decremento en rem (2px)

// Variable para controlar el tamaño actual
let tamanioActual = tamanioInicial;
let tamanioActual2 = tamanioInicial;
// Función para actualizar el tamaño de letra
function actualizarTamanio(nuevoTamanio) {
  tamanioActual = nuevoTamanio;
  body.style.fontSize = `${tamanioActual}rem`;
  //header.style.fontSize=  `${tamanioActual-1.5}rem`;
  headerTitle.style.fontSize = `${tamanioActual + 1}rem`;
  nav.style.fontSize = `${tamanioActual + 0.5}rem`;
  nav.style.fontSize = `${tamanioActual + 0.35}rem`;
  main.style.fontSize = `${tamanioActual - 0.5}rem`;
  //tituloSection.style.fontSize=`${tamanioActual+5}rem`;

  localStorage.setItem("tamanoLetra", tamanioActual);
}

aumentarBtn.addEventListener('click', () => {
  if (tamanioActual <= 2.25) {
    actualizarTamanio(tamanioActual + escala);
  }
});

disminuirBtn.addEventListener('click', () => {
  if (tamanioActual >= 1.75) {
    actualizarTamanio(tamanioActual - escala);
  }
});

restablecerBtn.addEventListener('click', () => {
  actualizarTamanio(tamanioInicial);
});


//Carrito Obtener el total
function obtenerTotal() {
  let subtotal = 0;
  let igic = 0;
  let total = 0;
  let cantidadProducto = false; // Variable para verificar si al menos un producto tiene cantidad > 0

  // Obtener todos los checkboxes seleccionados
  const checkboxes = document.querySelectorAll('.input:checked');

  // Si no hay checkboxes seleccionados, deshabilitamos el botón
  if (checkboxes.length === 0) {
    document.getElementById('pedir').disabled = true;  // Deshabilitamos el botón
  } else {
    document.getElementById('pedir').disabled = false; // Habilitamos el botón
  }

  checkboxes.forEach(function (checkbox) {
    // Obtener el precio y la cantidad del producto seleccionado
    const id = checkbox.closest('.artic').getAttribute("id");
    const idRecortada = id.replace(/Id$/,'');

    const priceElement = checkbox.closest('.artic').querySelector('.price');
    const cantElement = checkbox.closest('.artic').querySelector('.cantidad');
    const prca=idRecortada+"PriceXcantidad";
    const precioXCantidad=document.getElementById(prca);

    const price = parseFloat(priceElement.textContent); // Convertimos el precio a número
    const cantidad = parseInt(cantElement.value, 10); // Convertimos la cantidad a número

    // Si la cantidad es mayor que 0, continuamos sumando al subtotal
    if (cantidad > 0) {
      subtotal += price * cantidad; // Sumamos el precio al total
      cantidadProducto = true; // Hay al menos un producto con cantidad > 0
      precioXCantidad.textContent="";
    } 
    if(cantidad>1){precioXCantidad.textContent=(price * cantidad).toFixed(2)+" €";}


    // Si la cantidad es 0, deshabilitamos el botón
    if (cantidad === 0) {
      document.getElementById('pedir').disabled = true; // Deshabilitamos el botón
    }
  });

  // Calcular el IGIC y el total
  igic = 7 * subtotal / 100;
  total = subtotal + igic;

  // Mostrar el total en el DOM
  document.getElementById('subtotal').textContent = 'Subtotal: ' + subtotal.toFixed(2) + ' €';
  document.getElementById('IGIC').textContent = 'IGIC (7%): ' + igic.toFixed(2) + ' €';
  document.getElementById('total').textContent = 'Total: ' + total.toFixed(2) + ' €';
}

// Agregar un listener a cada checkbox para que el total se actualice cuando se cambie el estado
document.querySelectorAll('.input').forEach(function (checkbox) {
  checkbox.addEventListener('change', function () {
    obtenerTotal(); // Llamar a la función para actualizar el total
  });
});

// Agregar un listener para actualizar el estado del botón cuando se cambie la cantidad
document.querySelectorAll('.cantidad').forEach(function (input) {
  input.addEventListener('input', function () {
    obtenerTotal(); // Llamar a la función para actualizar el total
  });
});


// Llamar a la función al cargar la página para mostrar el total inicial
//window.onload = obtenerTotal;

// Función para incrementar el valor del input
function incrementar(inputId) {

  const input = document.getElementById(inputId); // Obtener el input por su id
  let currentValue = parseInt(input.value); // Obtener el valor actual como número

// Convertimos el precio a número

  // Asegurarse de que el valor no exceda el máximo permitido
  if (currentValue < input.max) {
    input.value = currentValue + 1; // Incrementar el valor

    obtenerTotal();
  }
}

// Función para decrementar el valor del input
function decrementar(inputId) {
  const input = document.getElementById(inputId); // Obtener el input por su id
  let currentValue = parseInt(input.value); // Obtener el valor actual como número

  // Asegurarse de que el valor no sea menor que el mínimo permitido
  if (currentValue > input.min) {
    input.value = currentValue - 1; // Decrementar el valor
    obtenerTotal();
  }
}

function borrar(articleId) {
  var article = document.getElementById(articleId);
  if (article) {
    article.remove(); // Elimina el artículo del DOM
  }
}

//Agregar Al Carrito

// Función para crear el artículo dinámicamente
// Función para agregar el artículo al carrito
function agregarCarrito() {
  // Obtener el artículo original
  const articleOriginal = document.getElementById('space');

  // Extraer los datos del artículo
  const nombre = articleOriginal.querySelector('h2').textContent;
  const precio = articleOriginal.querySelector('.price').textContent;
  const imagenSrc = articleOriginal.querySelector('img').src;

  // Crear el nuevo artículo en el formato requerido
  const article = document.createElement('article');
  article.classList.add('artic');
  article.id = "spacemarine" // Generar un ID único basado en el nombre del artículo
  // Crear el contenedor de juego
  const juegoDiv = document.createElement('div');
  juegoDiv.classList.add('juego');

  // Crear el checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'game5';
  checkbox.value = nombre.toLowerCase().replace(/\s+/g, '');
  checkbox.classList.add('input');
  checkbox.checked = false;

  // Crear el contenedor de la imagen
  const imagenDiv = document.createElement('div');
  const imagen = document.createElement('img');
  imagen.alt = nombre;
  imagen.src = imagenSrc;

  // Crear el contenedor del artículo
  const articleContenDiv = document.createElement('div');
  articleContenDiv.classList.add('articleConten');

  // Crear el título del artículo
  const h2 = document.createElement('h2');
  h2.setAttribute('aria-label', 'nombre');
  h2.classList.add('name');
  h2.textContent = nombre;

  // Crear el precio
  const priceDiv = document.createElement('div');
  const priceSpan = document.createElement('span');
  priceSpan.classList.add('price');
  priceSpan.textContent = precio;

  const precioPortSpan = document.createElement('span');
  precioPortSpan.textContent = "Precio por Unidad:";

  // Crear la fecha de entrega
  const fechaSpan = document.createElement('span');
  fechaSpan.setAttribute("id","spacemarinePriceXcantidad")
  fechaSpan.textContent = '';

  // Crear las acciones (botones)
  const actionsDiv = document.createElement('div');
  actionsDiv.classList.add('actions');

  // Crear el botón de borrar
  const borrarButton = document.createElement('button');
  borrarButton.setAttribute('aria-label', 'borrar');
  borrarButton.classList.add('action');
  borrarButton.setAttribute('onclick', `borrar('${article.id}')`);
  const borrarIcon = document.createElement('i');
  borrarIcon.classList.add('fa-solid', 'fa-trash');
  borrarButton.appendChild(borrarIcon);

  // Crear el contenedor de las unidades
  const unidadesDiv = document.createElement('div');
  unidadesDiv.classList.add('unidades');

  // Botón restar unidades
  const restarButton = document.createElement('button');
  restarButton.setAttribute('aria-label', 'restarUnidad');
  restarButton.classList.add('action');
  restarButton.setAttribute('onclick', `decrementar("spacem")`);
  const restarIcon = document.createElement('i');
  restarIcon.classList.add('fa-solid', 'fa-minus');
  restarButton.appendChild(restarIcon);

  // Input para cantidad
  const cantidadInput = document.createElement('input');
  cantidadInput.setAttribute('type', 'number');
  cantidadInput.setAttribute('aria-label', 'unidadesDelProducto');
  cantidadInput.classList.add('input', 'cantidad');
  cantidadInput.id = "spacem"
  cantidadInput.min = 1;
  cantidadInput.max = 200;
  cantidadInput.value = 1;

  // Botón sumar unidades
  const sumarButton = document.createElement('button');
  sumarButton.setAttribute('aria-label', 'sumarUnidad');
  sumarButton.classList.add('action');
  sumarButton.setAttribute('onclick', `incrementar("spacem")`);
  const sumarIcon = document.createElement('i');
  sumarIcon.classList.add('fa-solid', 'fa-plus');
  sumarButton.appendChild(sumarIcon);

  // Estructura del artículo
  // Añadir elementos a sus contenedores respectivos
  articleContenDiv.appendChild(h2);
  priceDiv.appendChild(precioPortSpan);
  priceDiv.appendChild(priceSpan);
  articleContenDiv.appendChild(priceDiv);
  articleContenDiv.appendChild(fechaSpan);

  imagenDiv.appendChild(imagen);

  juegoDiv.appendChild(checkbox);
  juegoDiv.appendChild(imagenDiv);
  juegoDiv.appendChild(articleContenDiv);

  unidadesDiv.appendChild(restarButton);
  unidadesDiv.appendChild(cantidadInput);
  unidadesDiv.appendChild(sumarButton);

  actionsDiv.appendChild(borrarButton);
  actionsDiv.appendChild(unidadesDiv);

  // Añadir los divs de juego y acciones al artículo
  article.appendChild(juegoDiv);
  article.appendChild(actionsDiv);

  // Seleccionar el contenedor donde se añadirá el artículo (por ejemplo, un contenedor con id 'carrito')
  const carrito = document.getElementById('carrito');
  //carrito.appendChild(article);

  // Insertar el nuevo artículo delante del artículo con id 'neva'
  const articuloNeva = document.getElementById('neva');
  carrito.insertBefore(article, articuloNeva);

  checkbox.addEventListener('change', function () {
    obtenerTotal(); // Llamar a la función para actualizar el total
  });
}


function realizarPedido() {
  let subtotal = 0;
  let igic = 0;
  let total = 0;
  const productos = [];  // Array para almacenar los productos seleccionados

  // Obtener todos los checkboxes seleccionados
  const checkboxes = document.querySelectorAll('.input:checked');

  checkboxes.forEach(function (checkbox) {
    // Obtener el precio del producto seleccionado
    const id = checkbox.closest('.artic').getAttribute("id");
    const idRecortada = id.replace(/Id$/,'');
    const priceElement = checkbox.closest('.artic').querySelector('.price');
    const cantElement = checkbox.closest('.artic').querySelector('.cantidad');
    const nombreElement = checkbox.closest('.artic').querySelector('.name');

    const price = parseFloat(priceElement.textContent); // Convertimos el precio a número
    const cantidad = parseInt(cantElement.value, 10); // Convertimos la cantidad a número
    const nombre = nombreElement ? nombreElement.textContent : 'Producto sin nombre'; // Nombre del producto

    // Sumar al subtotal
    subtotal += price * cantidad;

    // Almacenar el producto en el array
    productos.push({
      id:idRecortada,
      nombre: nombre,
      cantidad: cantidad,
      precio: price,
      total: price * cantidad
    });
  });

  // Calcular el IGIC y el total
  igic = 7 * subtotal / 100;  // IGIC al 7%
  total = subtotal + igic;    // Total con IGIC

  // Crear un objeto con los datos a almacenar
  const datos = {
    productos: productos,
    subtotal: subtotal,
    igic: igic,
    total: total
  };

  // Convertir el objeto a JSON y almacenarlo en localStorage
  localStorage.setItem('carrito', JSON.stringify(datos));


  window.location.href = 'datosCliente/index.html';  // Redirige a la nueva página
}


//DATOS DEL CLIENTE

const FORMULARIO = {
  // DOM datos
  fullName: document.getElementById('fullName'),
  email: document.getElementById('email'),
  shippingAddress: document.getElementById('shippingAddress'),
  shippingPostalcod: document.getElementById('shippingPostalcod'),
  phoneNumber: document.getElementById('phoneNumber'),
  billingPostalcod: document.getElementById('billingPostalcod'),
  billingAddress: document.getElementById('billingAddress'),
};

const ERROR = {
  // Errores de validación
  errorfullName: document.getElementById('errorfullName'),
  erroremail: document.getElementById('erroremail'),
  errorshippingAddress: document.getElementById('errorshippingAddress'),
  errorshippingPostalcod: document.getElementById('errorshippingPostalcod'),
  errorphoneNumber: document.getElementById('errorphoneNumber'),
  errorbillingPostalcod:document.getElementById('errorbillingPostalcod'),  
  errorbillingAddress:document.getElementById('errorbillingAddress'),  
};

const shippingPrices = {
  zona1: { 'Estándar': 5, 'Exprés': 10 },
  zona2: { 'Económico': 3 },
  zona3: { 'No Servida': 0 }
};

function toggleBillingData() {
  const isChecked = document.getElementById('sameAsShipping').checked;
  document.getElementById('billingAddress').disabled = isChecked;
  document.getElementById('billingPostalcod').disabled = isChecked;
}

function updateShippingMethods() {
  const zone = document.getElementById('zone').value;
  const methodsSelect = document.getElementById('shippingMethod');
  const methodsDiv = document.getElementById('methods');

  // Limpiar métodos de envío
  methodsSelect.innerHTML = '<option value="">Seleccionar...</option>';

  if (zone === 'Peninsula') {
    methodsSelect.innerHTML += `<option value="Recogida en tienda">Recogida en tienda - Gratis</option>
                                   <option value="Envio a casa">Envio a casa - 10€</option>`;
  } else if (zone === 'Canarias') {
    methodsSelect.innerHTML += `<option value="Recogida en tienda">Recogida en tienda</option>`;
  } else if (zone === 'Baleares') {
  }

  methodsDiv.classList.remove('hidden');
}

function validateForm() {
  const fullName = document.getElementById('fullName');
  const email = document.getElementById('email');
  const shippingAddress = document.getElementById('shippingAddress');
  const shippingPostalcod = document.getElementById('shippingPostalcod');
  const phoneNumber = document.getElementById('phoneNumber');
  const zone = document.getElementById('zone');
  const method = document.getElementById('shippingMethod');

  if (!fullName.value || (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email.value)) || !shippingAddress.value || !shippingPostalcod.validationMessage==""|| !phoneNumber.validationMessage==""|| !phoneNumber.value  || !zone.value || !method.value) {
    if (!fullName.value) {
      ERROR.errorfullName.textContent = "Campo obligatorio"
    } else {
      ERROR.errorfullName.textContent = ""
    }
    if (!email.value) {
      ERROR.erroremail.textContent = "Campo obligatorio"
    } else {
      ERROR.erroremail.textContent = ""
    }
    if ((!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email.value))) {
      ERROR.erroremail.textContent = "Tiene que tener un formato correcto de email"
    } else {
      ERROR.erroremail.textContent = ""
    }
    if (!shippingAddress.value) {
      ERROR.errorshippingAddress.textContent = "Campo obligatorio"
    } else {
      ERROR.errorshippingAddress.textContent = ""
    }
    if (!shippingPostalcod.value) {
      ERROR.errorshippingPostalcod.textContent = "Campo obligatorio"
    } else if (!shippingPostalcod.validationMessage=="") {
      ERROR.errorshippingPostalcod.textContent = "Tiene que empezar por 38"
    } else {
      ERROR.errorshippingPostalcod.textContent = ""
    }
   

    if (!phoneNumber.value) {
      ERROR.errorphoneNumber.textContent = "Campo obligatorio"
    } else  if (!phoneNumber.validationMessage=="") {
      ERROR.errorphoneNumber.textContent = "Solo puede contener digitos"
    } else {
      ERROR.errorphoneNumber.textContent = ""
    }
    if(!document.getElementById('sameAsShipping').checked){
      if (!FORMULARIO.billingAddress.value) {
        ERROR.errorbillingAddress.textContent = "Campo obligatorio"
      } else {
         ERROR.errorbillingAddress.textContent = ""
      }
      if (!FORMULARIO.billingPostalcod.value) {
        ERROR.errorbillingPostalcod.textContent = "Campo obligatorio"
      } else {
         ERROR.errorbillingPostalcod.textContent = ""
      }
      if(FORMULARIO.billingPostalcod.isValid){
          ERROR.errorbillingPostalcod.textContent = ""
      }
    } else{
       ERROR.errorbillingAddress.textContent = ""
       ERROR.errorbillingPostalcod.textContent = ""
    }


    document.getElementById('sameAsShipping').addEventListener("change", () => {
      if(!document.getElementById('sameAsShipping').checked){
        if (!FORMULARIO.billingAddress.value) {
          ERROR.errorbillingAddress.textContent = "Campo obligatorio"
        } else {
           ERROR.errorbillingAddress.textContent = ""
        }
        if (!FORMULARIO.billingPostalcod.value) {
          ERROR.errorbillingPostalcod.textContent = "Campo obligatorio"
        } else {
           ERROR.errorbillingPostalcod.textContent = ""
        }
        if(FORMULARIO.billingPostalcod.isValid){
            ERROR.errorbillingPostalcod.textContent = ""
        }
      } else{
         ERROR.errorbillingAddress.textContent = ""
         ERROR.errorbillingPostalcod.textContent = ""
      }
    })

    return false;
  } else {
    saveFormData();
  }
}


function saveFormData() {
  const formData = {
    fullName: document.getElementById('fullName').value,
    email: document.getElementById('email').value,
    shippingAddress: document.getElementById('shippingAddress').value,
    shippingPostalcod: document.getElementById('shippingPostalcod').value,
    billingAddress: document.getElementById('billingAddress').value,
    billingPostalcod: document.getElementById('billingPostalcod').value,
    phoneNumber: document.getElementById('phoneNumber').value,
    zone: document.getElementById('zone').value,
    shippingMethod: document.getElementById('shippingMethod').value,
    sameAsShipping: document.getElementById('sameAsShipping').checked,
    method: document.getElementById('shippingMethod').value
  };
  // Guardamos el objeto como JSON en el localStorage
  localStorage.setItem('formData', JSON.stringify(formData));
  window.location.href = 'SistemasPago/index.html';
}

///Cargar los datos
function loadFormData() {
  // Recuperamos los datos del localStorage
  const savedData = localStorage.getItem('formData');

  if (savedData) {
    const formData = JSON.parse(savedData);
    if (document.getElementById('fullName')&&document.getElementById('email')){
    // Rellenamos los campos del formulario con los datos recuperados
    document.getElementById('fullName').value = formData.fullName || '';
    document.getElementById('email').value = formData.email || '';
    document.getElementById('shippingAddress').value = formData.shippingAddress || '';
    document.getElementById('shippingPostalcod').value = formData.shippingPostalcod || '';
    document.getElementById('billingAddress').value = formData.billingAddress || '';
    document.getElementById('billingPostalcod').value = formData.billingPostalcod || '';
    document.getElementById('phoneNumber').value = formData.phoneNumber || '';
    document.getElementById('zone').value = formData.zone || '';
    document.getElementById('shippingMethod').value = formData.shippingMethod || '';
    document.getElementById('sameAsShipping').checked = formData.sameAsShipping || false;
  }}
}

//
//SISTEMA DE PAGO
//
if (localStorage.getItem('carrito')) {
  const carrito = JSON.parse(localStorage.getItem("carrito"));
  let doubleee= carrito.total.toFixed(2);
  if(document.getElementById('precioCarritoDescuento')){
    if(localStorage.getItem('formData')){
      const formJson = JSON.parse(localStorage.getItem("formData"));
      const costEnvio=document.getElementById('costEnvio');
      if (formJson.method==='Envio a casa') {
        costEnvio.textContent='Costes de envio: 10 €'
        document.getElementById('precioCarritoDescuento').textContent=parseFloat(doubleee)+10;
      } else {
        costEnvio.textContent='Costes de envio: 0 €'
        document.getElementById('precioCarritoDescuento').textContent=doubleee;
      }
    }
}
}

if (document.getElementById('paymentMethod')){
document.getElementById('paymentMethod').addEventListener('change', function () {
  const paymentMethod = this.value;
  document.getElementById('cardDetails').style.display = paymentMethod === 'card' ? 'block' : 'none';
  document.getElementById('paypalDetails').style.display = paymentMethod === 'paypal' ? 'block' : 'none';
  document.getElementById('bankTransferDetails').style.display = paymentMethod === 'bankTransfer' ? 'block' : 'none';
});
}
let descuentoAplicado = 0;
if (document.getElementById('discountCode')){
document.getElementById('discountCode').addEventListener('input', function () {
  const discountCode = this.value;
  const discountMessage = document.getElementById('discountMessage');
  const precioCarritoDescuento = document.getElementById('precioCarritoDescuento');

  let precioActual = parseFloat(precioCarritoDescuento.textContent);

  if (discountCode==='DAW') {
    discountMessage.textContent = 'Código válido. Descuento: 10%';
    discountMessage.style.color="green"
    descuentoAplicado = 10;
    precioCarritoDescuento.textContent = (precioActual - precioActual * 0.10).toFixed(2);
  } else if (discountCode === 'DOR') {
    discountMessage.textContent = 'Código válido. Descuento: 20%';
    discountMessage.style.color="green"
    descuentoAplicado = 20;
    precioCarritoDescuento.textContent = (precioActual - precioActual * 0.20).toFixed(2);
  } else {
    discountMessage.textContent = 'Código no válido';
    descuentoAplicado = 0;
    discountMessage.style.color="red"
    if (localStorage.getItem('carrito')) {
      const carrito = JSON.parse(localStorage.getItem("carrito"));
      let doubleee= carrito.total.toFixed(2);
      if(document.getElementById('precioCarritoDescuento')){
        if(localStorage.getItem('formData')){
          const formJson = JSON.parse(localStorage.getItem("formData"));
          const costEnvio=document.getElementById('costEnvio');
          if (formJson.method==='Envio a casa') {
            costEnvio.textContent='Costes de envio: 10 €'
            document.getElementById('precioCarritoDescuento').textContent=parseFloat(doubleee)+10;
          } else {
            costEnvio.textContent='Costes de envio: 0 €'
            document.getElementById('precioCarritoDescuento').textContent=doubleee;
          }
        }
    }
    }
  }
});
}
if(document.getElementById('paymentForm')){
document.getElementById('paymentForm').addEventListener('submit', function (e) {
  e.preventDefault();

  let isValid = true;
  const paymentMethod = document.getElementById('paymentMethod').value;
  const cardNumber = document.getElementById('cardNumber').value;
  const cardName = document.getElementById('cardName').value;
  const cvc = document.getElementById('cvc').value;
  const expiryDate = document.getElementById('expiryDate').value;
  const paypalEmail = document.getElementById('paypalEmail').value;
  const bankTransferFile = document.getElementById('bankTransferFile');

  if (paymentMethod === 'card') {
    if (!/^\d{16}$/.test(cardNumber) || !/^\d{3}$/.test(cvc) || !/^\d{2}\/\d{2}$/.test(expiryDate) ||cardNumber.value=="") {
      document.getElementById('cardMessage').textContent = 'Revisa los datos de tu tarjeta.';
      isValid = false;
    }
  } else if (paymentMethod === 'paypal') {
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(paypalEmail)) {
      document.getElementById('paypalMessage').textContent = 'El correo electrónico no es válido.';
      isValid = false;
    }
  } else if (paymentMethod === 'bankTransfer') {
    if (bankTransferFile.files.length === 0) {
      document.getElementById('bankTransferMessage').textContent = 'Debes subir un archivo PDF como justificante.';
      isValid = false;
    }
    if (!bankTransferFile.value.endsWith(".pdf")) {
      document.getElementById('bankTransferMessage').textContent = 'Debes subir un archivo PDF como justificante.';
      isValid = false;
  }
  }

  if (isValid) {
    const totalCarrito = parseFloat(document.getElementById('precioCarritoDescuento').textContent);

    // Crear datos para guardar en localStorage
    const paymentData = {
      paymentMethod,
      total: totalCarrito,
      descuento: descuentoAplicado,
      details: {}
    };

    if (paymentMethod === 'card') {
      paymentData.details = {
        cardName,
        cardNumber,
        expiryDate,
        cvc
      };
    } else if (paymentMethod === 'paypal') {
      paymentData.details = {
        paypalEmail
      };
    } else if (paymentMethod === 'bankTransfer') {
      paymentData.details = {
        bankTransferProof: "Archivo cargado"
      };
    }

    // Guardar en localStorage
    localStorage.setItem('paymentInfo', JSON.stringify(paymentData));

    console.log('Datos guardados en localStorage:', paymentData);

    window.location.href = 'ConfirmacionCompra/index.html';
  }
});
}

function loadPaymentData() {
  // Recuperar los datos del localStorage
  const savedPaymentData = localStorage.getItem('paymentInfo');

  if (savedPaymentData) {
    const paymentData = JSON.parse(savedPaymentData);
    if (document.getElementById('paymentMethod')){
    // Restaurar el método de pago seleccionado
    document.getElementById('paymentMethod').value = paymentData.paymentMethod;

    // Mostrar u ocultar los detalles según el método de pago
    document.getElementById('cardDetails').style.display = paymentData.paymentMethod === 'card' ? 'block' : 'none';
    document.getElementById('paypalDetails').style.display = paymentData.paymentMethod === 'paypal' ? 'block' : 'none';
    document.getElementById('bankTransferDetails').style.display = paymentData.paymentMethod === 'bankTransfer' ? 'block' : 'none';

    // Restaurar los detalles del método de pago
    if (paymentData.paymentMethod === 'card') {
      document.getElementById('cardName').value = paymentData.details.cardName || '';
      document.getElementById('cardNumber').value = paymentData.details.cardNumber || '';
      document.getElementById('expiryDate').value = paymentData.details.expiryDate || '';
      document.getElementById('cvc').value = paymentData.details.cvc || '';
    } else if (paymentData.paymentMethod === 'paypal') {
      document.getElementById('paypalEmail').value = paymentData.details.paypalEmail || '';
    } else if (paymentData.paymentMethod === 'bankTransfer') {
      // No se puede restaurar el archivo cargado, pero puedes mostrar un mensaje
      //document.getElementById('bankTransferMessage').textContent = 'Archivo cargado previamente.';
    }
    const discountMessage = document.getElementById('discountMessage');
    // Restaurar el descuento aplicado
    if (paymentData.descuento) {
      if (paymentData.descuento=='10') {
        document.getElementById('discountCode').value = 'DAW';
        discountMessage.style.color="green"
      }
      if (paymentData.descuento=='20') {
        document.getElementById('discountCode').value = 'DEW';
        discountMessage.style.color="green"
      }

      document.getElementById('discountMessage').textContent = `Código válido. Descuento: ${paymentData.descuento}%`;
      const precioCarritoDescuento = document.getElementById('precioCarritoDescuento');
      precioCarritoDescuento.textContent = (paymentData.total).toFixed(2);
    }
  }}
}

function limpiarCarritoStorage(){
if (localStorage.getItem('carrito')) {
  localStorage.removeItem('carrito');
  console.log('Clave eliminada');
}
if (localStorage.getItem('formData')) {
  localStorage.removeItem('formData');
  console.log('Clave eliminada');
}
if (localStorage.getItem('paymentInfo')) {
  localStorage.removeItem('paymentInfo');
  console.log('Clave eliminada');
}
  window.location.href = './../../../../../../index.html';
}
if (localStorage.getItem("carrito")){
    // Recuperamos el carrito del localStorage
    const carrito = JSON.parse(localStorage.getItem("carrito"));
  if(document.getElementById("carritoCardsContainer")){
    // Contenedor donde se agregarán las cards
    const carritoContainer = document.getElementById("carritoCardsContainer");

    if (carrito && carrito.productos) {
        carrito.productos.forEach(producto => {
            // Creamos la card para cada producto
            const card = document.createElement("article");
            card.classList.add("card");

            // Agregamos el contenido de la card
            card.innerHTML = `
                <h1>${producto.nombre}</h1>
                <span>Cantidad: ${producto.cantidad}</span>
                 <span>Precio Unitario: $${producto.precio.toFixed(2)}</span>
                 <span class="precio">Precio Total: $${producto.total.toFixed(2)}</span>
                <div>
                <img alt="WEBP" src="./../../../../../../img/${producto.id}.webp"/>
                </div>
            `;      
            // Añadimos la card al contenedor del carrito
            carritoContainer.appendChild(card);
            
        });
    } else {
        carritoContainer.innerHTML = "<p>No hay productos en el carrito.</p>";
    }
  }
  }

// Llamar a la función para cargar las cards cuando se carga la página
    // Obtener la información del localStorage bajo la clave 'formData'
    const userInfo = JSON.parse(localStorage.getItem('formData'));

    // Verificamos si los datos existen antes de procesarlos
    if (userInfo) {
        // Contenedor donde se agregará la información
        if(document.getElementById("user-info-container")){
          const userInfoContainer = document.getElementById("user-info-container");

          // Creamos un artículo que contiene la información del usuario
          const userCard = document.createElement("article");
          //userCard.classList.add("card");
          
          // Función para crear un span con la información del usuario
          function createInfoSpan(label, value) {
            const span = document.createElement("span");
            const highlight = document.createElement("span");
            highlight.classList.add("highlight");
            highlight.textContent = label;
            span.appendChild(highlight);
            span.appendChild(document.createTextNode(` ${value}`));
            return span;
          }
          
          // Agregamos la información al artículo
          userCard.appendChild(createInfoSpan("Nombre Completo:", userInfo.fullName));
          userCard.appendChild(createInfoSpan("Correo Electrónico:", userInfo.email));
          userCard.appendChild(createInfoSpan("Dirección de Envío:", userInfo.shippingAddress));
          userCard.appendChild(createInfoSpan("Código Postal de Envío:", userInfo.shippingPostalcod));
          userCard.appendChild(createInfoSpan("Número de Teléfono:", userInfo.phoneNumber));
          userCard.appendChild(createInfoSpan("Zona:", userInfo.zone));
          if (userInfo.method=="Envio a casa"){
            userCard.appendChild(createInfoSpan("Método de Envío:", userInfo.method));
            userCard.appendChild(createInfoSpan("Costes de envio: ", "10 €"));
          }
          else {
            userCard.appendChild(createInfoSpan("Método de Envío:", userInfo.method));
          }
          userCard.appendChild(createInfoSpan("¿Es la misma dirección de envío?", userInfo.sameAsShipping ? 'Sí' : 'No'));
          userCard.appendChild(createInfoSpan("Dirección de Facturación:", userInfo.billingAddress || userInfo.shippingAddress));
          userCard.appendChild(createInfoSpan("Código Postal de Facturación:", userInfo.billingPostalcod || userInfo.shippingPostalcod));
          
          // Agregamos el artículo al contenedor principal
          userInfoContainer.appendChild(userCard);
        }
    } else {
    }

    function displayPaymentInfo() {
      
      // Recuperar los datos del localStorage
      const paymentInfo = JSON.parse(localStorage.getItem('paymentInfo'));
    
      if (paymentInfo) {
        const paymentInfoContainer = document.getElementById("payment-info-container");
        const article = document.createElement('article');
        article.id = 'payment-info';
    
        // Función para crear un span con un label y un valor
        const createSpan = (label, value) => {
          const span = document.createElement('span');
          span.innerHTML = `<strong>${label}:</strong> ${value}`;
          return span;
        };
    
        // Agregar los datos del paymentInfo al article
        const userInfo = JSON.parse(localStorage.getItem('formData'));
        // Agregar los detalles específicos del método de pago
        if (paymentInfo.paymentMethod === 'card') {
          article.appendChild(createSpan('Método de Pago', 'Tarjeta'));
          article.appendChild(createSpan('Titular de la Tarjeta', paymentInfo.details.cardName));
          article.appendChild(createSpan('Número de Tarjeta', paymentInfo.details.cardNumber));
          article.appendChild(createSpan('Fecha de Expiración', paymentInfo.details.expiryDate));
          article.appendChild(createSpan('CVC', paymentInfo.details.cvc));
        } else if (paymentInfo.paymentMethod === 'paypal') {
          article.appendChild(createSpan('Método de Pago', 'Paypal'));
          article.appendChild(createSpan('Correo de PayPal', paymentInfo.details.paypalEmail));
        } else if (paymentInfo.paymentMethod === 'bankTransfer') {
          article.appendChild(createSpan('Método de Pago', 'Transferencia bancaria'));
          article.appendChild(createSpan('Justificante', paymentInfo.details.bankTransferProof));
        }
        article.appendChild(createSpan('Descuento', `${paymentInfo.descuento}%`));
        if (localStorage.getItem('carrito')) {
          const carrito = JSON.parse(localStorage.getItem("carrito"));
          let totalfinal= carrito.total.toFixed(2);

          if (userInfo.method=="Envio a casa"){
            article.appendChild(createSpan('Total(descuentos no aplicados)', (parseFloat(totalfinal)+10)+' €'));
            if(paymentInfo.descuento>0){
              totalfinal = (totalfinal - (((totalfinal+10) * paymentInfo.descuento)/100)).toFixed(2);}
            else{
              totalfinal = parseFloat(totalfinal)+10;
            }
          } else{
            article.appendChild(createSpan('Total(descuentos no aplicados)', totalfinal+' €'));
            if(paymentInfo.descuento>0){
              totalfinal = (totalfinal - (((totalfinal) * paymentInfo.descuento)/100)).toFixed(2);}
          }
          
   
            article.appendChild(createSpan('Total', totalfinal+' €'));
        }
        // Agregar el article al cuerpo del documento
        paymentInfoContainer.appendChild(article);
      } else {
        console.log('No hay datos de pago guardados en el localStorage.');
      }
    }
    displayPaymentInfo();

    function showCustomAlert(message) {
      // Crear el fondo oscuro
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      overlay.style.display = 'flex';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';
      overlay.style.zIndex = '1000';
    
      // Crear el contenido del alert
      const alertBox = document.createElement('div');
      alertBox.style.backgroundColor = 'white';
      alertBox.style.padding = '20px';
      alertBox.style.borderRadius = '10px';
      alertBox.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      alertBox.style.textAlign = 'center';
      alertBox.style.maxWidth = '300px';
    
      // Crear el mensaje del alert
      const alertMessage = document.createElement('p');
      alertMessage.textContent = message;
      alertMessage.style.margin = '0 0 20px 0';
    
      // Crear el botón de aceptar
      const acceptButton = document.createElement('button');
      acceptButton.textContent = 'Aceptar';
      acceptButton.style.backgroundColor = '#007bff';
      acceptButton.style.color = 'white';
      acceptButton.style.border = 'none';
      acceptButton.style.padding = '10px 20px';
      acceptButton.style.borderRadius = '5px';
      acceptButton.style.cursor = 'pointer';
    
      // Cerrar el alert al hacer clic en "Aceptar"
      acceptButton.addEventListener('click', () => {
        limpiarCarritoStorage();
      });
    
      // Agregar elementos al DOM
      alertBox.appendChild(alertMessage);
      alertBox.appendChild(acceptButton);
      overlay.appendChild(alertBox);
      document.body.appendChild(overlay);

    }
    
    function completePurchase(){
      showCustomAlert('Muchas gracias por su compra');
    }
