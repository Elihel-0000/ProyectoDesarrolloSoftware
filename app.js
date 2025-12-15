// Espera a que todo el contenido del DOM esté cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {

    // --- SELECCIÓN DE ELEMENTOS DEL DOM ---
    const form = document.getElementById('registro-ciudadano-form');
    const nombreInput = document.getElementById('nombre');
    const correoInput = document.getElementById('correo');
    const edadInput = document.getElementById('edad');
    const dniInput = document.getElementById('dni');
    const notificacionEl = document.getElementById('notificacion');
    const totalCiudadanosEl = document.getElementById('total-ciudadanos');
    const listaUltimosCiudadanosEl = document.getElementById('lista-ultimos-ciudadanos');

    // --- EVENT LISTENERS ---
    // Escuchar el evento 'submit' del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que el formulario se envíe de la manera tradicional
        registrarCiudadano();
    });

    // Validar en tiempo real mientras el usuario escribe
    nombreInput.addEventListener('input', () => validarCampo(nombreInput, validarNombre));
    correoInput.addEventListener('input', () => validarCampo(correoInput, validarCorreo));
    edadInput.addEventListener('input', () => validarCampo(edadInput, validarEdad));
    dniInput.addEventListener('input', () => validarCampo(dniInput, validarDNI));
    
    // --- LÓGICA DE VALIDACIÓN ---

    // Valida que el nombre tenga al menos 3 caracteres
    const validarNombre = (nombre) => nombre.trim().length >= 3;

    // Valida que el correo tenga un formato válido usando una expresión regular
    const validarCorreo = (correo) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(correo.trim());
    };
    
    // Valida que la edad sea un número y que la persona sea mayor de edad
    const validarEdad = (edad) => {
        const edadNum = parseInt(edad, 10);
        return !isNaN(edadNum) && edadNum >= 18;
    };
    
    // Valida que el DNI tenga exactamente 8 dígitos numéricos
    const validarDNI = (dni) => {
        const regex = /^\d{8}$/;
        return regex.test(dni.trim());
    };

    /**
     * Función genérica para validar un campo y mostrar/ocultar mensaje de error
     * @param {HTMLElement} input - El elemento del input a validar
     * @param {Function} funcionValidacion - La función específica que valida el valor
     * @returns {boolean} - True si es válido, false si no
     */
    const validarCampo = (input, funcionValidacion) => {
        const esValido = funcionValidacion(input.value);
        const mensajeErrorEl = document.getElementById(`error-${input.id}`);
        let mensaje = '';

        if (!esValido) {
            input.classList.add('invalido');
            input.classList.remove('valido');
            // Mensajes de error específicos
            switch(input.id) {
                case 'nombre': mensaje = 'El nombre debe tener al menos 3 caracteres.'; break;
                case 'correo': mensaje = 'Por favor, ingresa un correo electrónico válido.'; break;
                case 'edad': mensaje = 'Debes ser mayor de 18 años.'; break;
                case 'dni': mensaje = 'El DNI debe contener 8 dígitos numéricos.'; break;
            }
        } else {
            input.classList.remove('invalido');
            input.classList.add('valido');
        }
        
        mensajeErrorEl.textContent = mensaje;
        return esValido;
    };

    // --- LÓGICA PRINCIPAL ---

    // Procesa el registro del ciudadano
    const registrarCiudadano = () => {
        // Ejecuta todas las validaciones
        const esNombreValido = validarCampo(nombreInput, validarNombre);
        const esCorreoValido = validarCampo(correoInput, validarCorreo);
        const esEdadValida = validarCampo(edadInput, validarEdad);
        const esDNIValido = validarCampo(dniInput, validarDNI);

        // Si todos los campos son válidos, procede a guardar
        if (esNombreValido && esCorreoValido && esEdadValida && esDNIValido) {
            const nuevoCiudadano = {
                id: Date.now(), // ID único basado en la fecha actual
                nombre: nombreInput.value.trim(),
                correo: correoInput.value.trim(),
                edad: parseInt(edadInput.value),
                dni: dniInput.value.trim(),
            };

            guardarEnLocalStorage(nuevoCiudadano);
            mostrarNotificacion('¡Ciudadano registrado con éxito!', 'exito');
            form.reset(); // Limpia el formulario
            // Quita las clases de validación de los campos
            [nombreInput, correoInput, edadInput, dniInput].forEach(input => {
                input.classList.remove('valido', 'invalido');
            });
            actualizarEstadisticas(); // Actualiza la UI
        } else {
            mostrarNotificacion('Por favor, corrige los errores en el formulario.', 'error');
        }
    };

    // --- MANEJO DE LOCALSTORAGE ---

    // Obtiene los ciudadanos del localStorage
    const obtenerCiudadanos = () => {
        return JSON.parse(localStorage.getItem('ciudadanos')) || [];
    };
    
    // Guarda un nuevo ciudadano en el localStorage
    const guardarEnLocalStorage = (ciudadano) => {
        const ciudadanos = obtenerCiudadanos();
        ciudadanos.push(ciudadano);
        localStorage.setItem('ciudadanos', JSON.stringify(ciudadanos));
    };

    // --- MANIPULACIÓN DEL DOM Y UI ---

    /**
     * Muestra una notificación temporal en la pantalla
     * @param {string} mensaje - El texto a mostrar
     * @param {string} tipo - 'exito' o 'error' para el estilo CSS
     */
    const mostrarNotificacion = (mensaje, tipo) => {
        notificacionEl.textContent = mensaje;
        notificacionEl.className = `notificacion ${tipo} visible`; // Agrega clases para estilo y visibilidad

        // Oculta la notificación después de 3 segundos
        setTimeout(() => {
            notificacionEl.classList.remove('visible');
        }, 3000);
    };

    // Actualiza las estadísticas en la página
    const actualizarEstadisticas = () => {
        const ciudadanos = obtenerCiudadanos();
        
        // Actualiza el contador total
        totalCiudadanosEl.textContent = ciudadanos.length;

        // Limpia la lista de últimos ciudadanos
        listaUltimosCiudadanosEl.innerHTML = '';

        if (ciudadanos.length === 0) {
            listaUltimosCiudadanosEl.innerHTML = '<li>No hay registros aún.</li>';
        } else {
            // Muestra los últimos 5 ciudadanos registrados
            const ultimosCinco = ciudadanos.slice(-5).reverse();
            ultimosCinco.forEach(ciudadano => {
                const li = document.createElement('li');
                li.textContent = `${ciudadano.nombre} (DNI: ...${ciudadano.dni.slice(-4)})`;
                listaUltimosCiudadanosEl.appendChild(li);
            });
        }
    };
    
    // Llama a la función de actualizar estadísticas al cargar la página por primera vez
    actualizarEstadisticas();
});