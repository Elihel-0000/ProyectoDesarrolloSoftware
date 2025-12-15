// Script general: registro/login (usuario y admin), sesión y reportes en localStorage
document.addEventListener('DOMContentLoaded', () => {
    const notificacionEl = document.getElementById('notificacion');

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

    // Registro de usuario (se usa en register.html)
    const registerUser = ({nombre, correo, password}) => {
        const users = getUsers();
        if (users.find(u => u.correo === correo)) {
            showNotification('Ya existe una cuenta con este correo.', 'error');
            return false;
        }
        const user = { id: Date.now(), nombre, correo, password: btoa(password), role: 'user' };
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

    // Registro admin
    const registerAdmin = ({nombre, correo, password}) => {
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
    const submitReport = ({titulo, tipo, descripcion, ubicacion, anonimo}) => {
        const current = getCurrentUser();
        if (!anonimo && !current) {
            showNotification('Debes iniciar sesión o marcar como anónimo.', 'error');
            return false;
        }
        const report = {
            id: 'R' + Date.now(),
            titulo,
            tipo,
            descripcion,
            ubicacion: ubicacion || '',
            fecha: new Date().toISOString(),
            estado: 'recibido',
            anonimo: !!anonimo,
            reporter: anonimo ? { nombre: 'Anónimo', correo: '' } : { nombre: current.nombre, correo: current.correo }
        };
        const reports = getReports();
        reports.push(report);
        saveReports(reports);
        showNotification('Reporte enviado. Código: ' + report.id, 'exito');
        return true;
    };

    // --- Conexión con formularios si existen en la página ---

    // Formulario de registro de usuario (register.html)
    const formRegister = document.getElementById('form-register');
    if (formRegister) {
        formRegister.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = formRegister.querySelector('#reg-nombre').value.trim();
            const correo = formRegister.querySelector('#reg-correo').value.trim();
            const password = formRegister.querySelector('#reg-password').value;
            if (nombre.length < 3 || password.length < 6) {
                showNotification('Nombre mínimo 3 caracteres y contraseña mínimo 6.', 'error');
                return;
            }
            if (registerUser({nombre, correo, password})) {
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
            if (nombre.length < 3 || password.length < 6) {
                showNotification('Nombre mínimo 3 caracteres y contraseña mínimo 6.', 'error');
                return;
            }
            if (registerAdmin({nombre, correo, password})) {
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
            const ubicacion = formReporte.querySelector('#ubicacion').value.trim();
            const anonimo = anonimoEl && anonimoEl.checked;
            if (!titulo || !descripcion) {
                showNotification('Completa título y descripción.', 'error');
                return;
            }
            if (submitReport({titulo, tipo, descripcion, ubicacion, anonimo})) {
                formReporte.reset();
                refreshUserUI();
            }
        });

        refreshUserUI();
    }

    // Botón global de logout si existe en otras páginas
    const btnLogoutGlobal = document.getElementById('logout-global');
    if (btnLogoutGlobal) btnLogoutGlobal.addEventListener('click', logout);
});