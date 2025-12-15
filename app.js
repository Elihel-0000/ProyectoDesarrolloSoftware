// Script general: registro/login (usuario y admin), sesión y reportes en localStorage
document.addEventListener('DOMContentLoaded', () => {
    const notificacionEl = document.getElementById('notificacion');

    // Código de administrador válido (cambiar según necesidades)
    const ADMIN_CODE = 'ADMIN2025';

    // Helpers para localStorage
    const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];
    const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));
    const getAdmins = () => JSON.parse(localStorage.getItem('admins')) || [];
    const saveAdmins = (admins) => localStorage.setItem('admins', JSON.stringify(admins));
    const getReports = () => JSON.parse(localStorage.getItem('reports')) || [];
    const saveReports = (reports) => localStorage.setItem('reports', JSON.stringify(reports));

    const setCurrentUser = (user) => localStorage.setItem('currentUser', JSON.stringify(user));
    const getCurrentUser = () => JSON.parse(localStorage.getItem('currentUser')) || null;
    const clearCurrentUser = () => localStorage.removeItem('currentUser');

    const showNotification = (message, type = 'exito') => {
        if (!notificacionEl) return;
        notificacionEl.textContent = message;
        notificacionEl.className = `notificacion ${type} visible`;
        setTimeout(() => notificacionEl.classList.remove('visible'), 3000);
    };

    // Registro de usuario con más datos
    const registerUser = ({nombre, dni, correo, telefono, fechaNac, sexo, direccion, password}) => {
        const users = getUsers();
        if (users.find(u => u.correo === correo)) {
            showNotification('Ya existe una cuenta con este correo.', 'error');
            return false;
        }
        if (users.find(u => u.dni === dni)) {
            showNotification('Ya existe una cuenta con este DNI.', 'error');
            return false;
        }
        const user = { 
            id: Date.now(), 
            nombre, 
            dni,
            correo, 
            telefono,
            fechaNac,
            sexo,
            direccion,
            password: btoa(password), 
            role: 'user' 
        };
        users.push(user);
        saveUsers(users);
        showNotification('Registro exitoso. Ahora puedes iniciar sesión.', 'exito');
        return true;
    };

    // Login usuario
    const loginUser = ({correo, password}) => {
        const users = getUsers();
        const user = users.find(u => u.correo === correo && u.password === btoa(password));
        if (!user) {
            showNotification('Credenciales inválidas.', 'error');
            return false;
        }
        setCurrentUser({ id: user.id, nombre: user.nombre, correo: user.correo, role: user.role });
        showNotification('Inicio de sesión exitoso.', 'exito');
        return true;
    };

    // Registro admin con verificación de código
    const registerAdmin = ({nombre, correo, password, codigo}) => {
        if (codigo !== ADMIN_CODE) {
            showNotification('Código de administrador inválido.', 'error');
            return false;
        }
        const admins = getAdmins();
        if (admins.find(a => a.correo === correo)) {
            showNotification('Ya existe un administrador con este correo.', 'error');
            return false;
        }
        const admin = { id: Date.now(), nombre, correo, password: btoa(password), role: 'admin' };
        admins.push(admin);
        saveAdmins(admins);
        showNotification('Administrador registrado.', 'exito');
        return true;
    };

    // Login admin
    const loginAdmin = ({correo, password}) => {
        const admins = getAdmins();
        const admin = admins.find(a => a.correo === correo && a.password === btoa(password));
        if (!admin) {
            showNotification('Credenciales de administrador inválidas.', 'error');
            return false;
        }
        setCurrentUser({ id: admin.id, nombre: admin.nombre, correo: admin.correo, role: 'admin' });
        showNotification('Ingreso de administrador correcto.', 'exito');
        return true;
    };

    // Registro admin con verificación de código
    const registerAdmin = ({nombre, correo, password, codigo}) => {
        if (codigo !== ADMIN_CODE) {
            showNotification('Código de administrador inválido.', 'error');
            return false;
        }
        const admins = getAdmins();
        if (admins.find(a => a.correo === correo)) {
            showNotification('Ya existe un administrador con este correo.', 'error');
            return false;
        }
        const admin = { id: Date.now(), nombre, correo, password: btoa(password), role: 'admin' };
        admins.push(admin);
        saveAdmins(admins);
        showNotification('Administrador registrado.', 'exito');
        return true;
    };

    // Login admin
    const loginAdmin = ({correo, password}) => {
        const admins = getAdmins();
        const admin = admins.find(a => a.correo === correo && a.password === btoa(password));
        if (!admin) {
            showNotification('Credenciales de administrador inválidas.', 'error');
            return false;
        }
        setCurrentUser({ id: admin.id, nombre: admin.nombre, correo: admin.correo, role: 'admin' });
        showNotification('Ingreso de administrador correcto.', 'exito');
        return true;
    };

    // Logout
    const logout = () => {
        clearCurrentUser();
        showNotification('Sesión cerrada.', 'exito');
        // reload para actualizar UI
        setTimeout(() => location.reload(), 600);
    };

    // Envío de reporte
    const submitReport = ({titulo, tipo, descripcion, distrito, urbanizacion, referencia, anonimo}) => {
        const current = getCurrentUser();
        if (!anonimo && !current) {
            showNotification('Debes iniciar sesión o marcar como anónimo.', 'error');
            return false;
        }
        const ubicacionCompleta = `${distrito} - ${urbanizacion}${referencia ? ' (' + referencia + ')' : ''}`;
        const report = {
            id: 'R' + Date.now(),
            titulo,
            tipo,
            descripcion,
            distrito,
            urbanizacion,
            referencia,
            ubicacion: ubicacionCompleta,
            fecha: new Date().toISOString(),
            estado: 'recibido',
            anonimo: !!anonimo,
            reporter: anonimo ? { nombre: 'Anónimo', correo: '' } : { nombre: current.nombre, correo: current.correo }
        };
        const reports = getReports();
        reports.push(report);
        saveReports(reports);
        return report;
    };

    // --- Conexión con formularios si existen en la página ---

    // Formulario de registro de usuario (register.html)
    const formRegister = document.getElementById('form-register');
    if (formRegister) {
        formRegister.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = formRegister.querySelector('#reg-nombre').value.trim();
            const dni = formRegister.querySelector('#reg-dni').value.trim();
            const correo = formRegister.querySelector('#reg-correo').value.trim();
            const telefono = formRegister.querySelector('#reg-telefono').value.trim();
            const fechaNac = formRegister.querySelector('#reg-fecha-nac').value;
            const sexo = formRegister.querySelector('#reg-sexo').value;
            const direccion = formRegister.querySelector('#reg-direccion').value.trim();
            const password = formRegister.querySelector('#reg-password').value;
            
            if (nombre.length < 3) {
                showNotification('Nombre mínimo 3 caracteres.', 'error');
                return;
            }
            if (dni.length !== 8 || isNaN(dni)) {
                showNotification('DNI debe contener 8 dígitos.', 'error');
                return;
            }
            if (!fechaNac) {
                showNotification('Debes seleccionar una fecha de nacimiento.', 'error');
                return;
            }
            if (!sexo) {
                showNotification('Debes seleccionar un sexo.', 'error');
                return;
            }
            if (password.length < 6) {
                showNotification('Contraseña mínimo 6 caracteres.', 'error');
                return;
            }
            if (registerUser({nombre, dni, correo, telefono, fechaNac, sexo, direccion, password})) {
                setTimeout(() => location.href = 'login.html', 800);
            }
        });
    }

    // Formulario login usuario (login.html)
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const correo = formLogin.querySelector('#login-correo').value.trim();
            const password = formLogin.querySelector('#login-password').value;
            if (loginUser({correo, password})) {
                setTimeout(() => location.href = 'index.html', 600);
            }
        });
    }

    // Formulario admin register
    const formAdminRegister = document.getElementById('form-admin-register');
    if (formAdminRegister) {
        formAdminRegister.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = formAdminRegister.querySelector('#admin-reg-nombre').value.trim();
            const correo = formAdminRegister.querySelector('#admin-reg-correo').value.trim();
            const password = formAdminRegister.querySelector('#admin-reg-password').value;
            const codigo = formAdminRegister.querySelector('#admin-reg-codigo').value.trim();
            
            if (nombre.length < 3) {
                showNotification('Nombre mínimo 3 caracteres.', 'error');
                return;
            }
            if (password.length < 6) {
                showNotification('Contraseña mínimo 6 caracteres.', 'error');
                return;
            }
            if (!codigo) {
                showNotification('Debes ingresar el código de administrador.', 'error');
                return;
            }
            if (registerAdmin({nombre, correo, password, codigo})) {
                setTimeout(() => location.href = 'admin_login.html', 800);
            }
        });
    }

    // Formulario admin login
    const formAdminLogin = document.getElementById('form-admin-login');
    if (formAdminLogin) {
        formAdminLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const correo = formAdminLogin.querySelector('#admin-login-correo').value.trim();
            const password = formAdminLogin.querySelector('#admin-login-password').value;
            if (loginAdmin({correo, password})) {
                setTimeout(() => location.href = 'dashboard.html', 600);
            }
        });
    }

    // Formulario de reporte (index.html)
    const formReporte = document.getElementById('form-reporte');
    if (formReporte) {
        const anonimoEl = document.getElementById('anonimo');
        const infoUsuarioEl = document.getElementById('info-usuario');
        const usuarioNombreEl = document.getElementById('usuario-nombre');
        const usuarioCorreoEl = document.getElementById('usuario-correo');
        const btnLogout = document.getElementById('btn-logout');

        const refreshUserUI = () => {
            const current = getCurrentUser();
            if (current) {
                infoUsuarioEl.style.display = 'block';
                usuarioNombreEl.textContent = current.nombre;
                usuarioCorreoEl.textContent = current.correo;
            } else {
                infoUsuarioEl.style.display = 'none';
            }
        };

        if (btnLogout) btnLogout.addEventListener('click', logout);

        formReporte.addEventListener('submit', (e) => {
            e.preventDefault();
            const titulo = formReporte.querySelector('#titulo').value.trim();
            const tipo = formReporte.querySelector('#tipo').value;
            const descripcion = formReporte.querySelector('#descripcion').value.trim();
            const distrito = formReporte.querySelector('#distrito').value;
            const urbanizacion = formReporte.querySelector('#urbanizacion').value.trim();
            const referencia = formReporte.querySelector('#referencia').value.trim();
            const anonimo = anonimoEl && anonimoEl.checked;
            
            if (!titulo || !descripcion) {
                showNotification('Completa título y descripción.', 'error');
                return;
            }
            if (!distrito || !urbanizacion) {
                showNotification('Debes seleccionar distrito y urbanización/calle.', 'error');
                return;
            }
            
            const report = submitReport({titulo, tipo, descripcion, distrito, urbanizacion, referencia, anonimo});
            if (report) {
                formReporte.reset();
                refreshUserUI();
                // Mostrar modal con código
                mostrarModalReporteExitoso(report.id);
            }
        });

        refreshUserUI();
    }

    // Formulario de seguimiento (index.html)
    const formSeguimiento = document.getElementById('form-seguimiento');
    if (formSeguimiento) {
        const codigoReporteEl = document.getElementById('codigo-reporte');
        const resultadoEl = document.getElementById('resultado-seguimiento');

        formSeguimiento.addEventListener('submit', (e) => {
            e.preventDefault();
            const codigo = codigoReporteEl.value.trim().toUpperCase();
            const reports = getReports();
            const report = reports.find(r => r.id === codigo);

            if (!report) {
                showNotification('Reporte no encontrado.', 'error');
                resultadoEl.style.display = 'none';
                return;
            }

            // Mostrar detalles del reporte
            document.getElementById('titulo-reporte').textContent = report.titulo;
            document.getElementById('codigo-resultado').textContent = report.id;
            document.getElementById('tipo-resultado').textContent = report.tipo;
            document.getElementById('desc-resultado').textContent = report.descripcion;
            document.getElementById('ubicacion-resultado').textContent = report.ubicacion || 'No especificada';
            document.getElementById('reportante-resultado').textContent = report.reporter.nombre;
            document.getElementById('fecha-resultado').textContent = new Date(report.fecha).toLocaleString('es-PE');
            
            const estadoBadge = document.getElementById('estado-resultado');
            estadoBadge.textContent = report.estado.charAt(0).toUpperCase() + report.estado.slice(1);
            estadoBadge.className = `badge ${report.estado}`;

            resultadoEl.style.display = 'block';
            showNotification('Reporte encontrado.', 'exito');
        });
    }

    // Función para mostrar modal con código de seguimiento exitoso
    const mostrarModalReporteExitoso = (codigo) => {
        const modal = document.getElementById('modal-reporte-exitoso');
        const codigoModalEl = document.getElementById('codigo-modal');
        const btnCerrarModal = document.getElementById('btn-cerrar-modal');
        const btnCerrarModalFooter = document.getElementById('btn-cerrar-modal-footer');
        const btnCopiar = document.getElementById('btn-copiar-codigo');

        if (!modal) return;

        codigoModalEl.textContent = codigo;

        const cerrarModal = () => {
            modal.style.display = 'none';
        };

        // Mostrar modal
        modal.style.display = 'flex';

        // Cerrar con botones
        if (btnCerrarModal) btnCerrarModal.addEventListener('click', cerrarModal);
        if (btnCerrarModalFooter) btnCerrarModalFooter.addEventListener('click', cerrarModal);

        // Copiar código al portapapeles
        if (btnCopiar) {
            btnCopiar.addEventListener('click', () => {
                navigator.clipboard.writeText(codigo).then(() => {
                    showNotification('Código copiado al portapapeles', 'exito');
                }).catch(() => {
                    showNotification('Error al copiar código', 'error');
                });
            });
        }

        // Cerrar si se hace click fuera del modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarModal();
            }
        });
    };

    // Exponer funciones útiles al scope global para páginas de admin (dashboard.js, report_detail.html)
    window.getReports = getReports;
    window.saveReports = saveReports;
    window.getCurrentUser = getCurrentUser;
    window.logout = logout;
    window.updateReportStatus = (id, status) => {
        const reports = getReports();
        const idx = reports.findIndex(r => r.id === id);
        if (idx === -1) return false;
        reports[idx].estado = status;
        saveReports(reports);
        return true;
    };

    // Botón global de logout si existe en otras páginas
    const btnLogoutGlobal = document.getElementById('logout-global');
    if (btnLogoutGlobal) btnLogoutGlobal.addEventListener('click', logout);
});