document.addEventListener('DOMContentLoaded', () => {
    
    // --- TRUCO: SIMULAR ADMINISTRADOR SIEMPRE CONECTADO ---
    // No verificamos localStorage. Simplemente definimos que eres admin.
    const current = { 
        role: 'admin', 
        nombre: 'Admin (Acceso Directo)' 
    };

    // Nombre en el header
    const adminNameEl = document.getElementById('admin-name');
    if (adminNameEl) adminNameEl.textContent = current.nombre;

    // Botón Salir (Opcional: ahora solo recarga la página o te manda al home)
    const logoutBtn = document.getElementById('admin-logout');
    if (logoutBtn) logoutBtn.addEventListener('click', () => {
        alert("Sesión cerrada (simulada).");
        // window.location.href = 'index.html'; // Descomenta si quieres ir al inicio
    });

    // Cargar reportes
    const reports = window.getReports ? window.getReports() : [];
    const container = document.getElementById('report-list');
    
    // Elementos de filtros
    const filtrosYear = document.getElementById('filtro-year');
    const filtrosMonth = document.getElementById('filtro-month');
    const filtrosDay = document.getElementById('filtro-day');

    const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'];

    // Agrupar reportes por fecha
    const groupReports = (list) => {
        const grouped = {};
        list.forEach(r => {
            const d = new Date(r.fecha);
            const y = d.getFullYear();
            const m = d.getMonth() + 1;
            const day = d.getDate();
            if (!grouped[y]) grouped[y] = {};
            if (!grouped[y][m]) grouped[y][m] = {};
            if (!grouped[y][m][day]) grouped[y][m][day] = [];
            grouped[y][m][day].push(r);
        });
        return grouped;
    };

    const renderList = (list) => {
        container.innerHTML = '';
        if (!list.length) {
            container.innerHTML = '<p>No hay reportes registrados.</p>';
            return;
        }
        const grouped = groupReports(list);
        
        // Ordenar y renderizar
        Object.keys(grouped).sort((a,b)=>b-a).forEach(year => {
            const yearEl = document.createElement('div');
            yearEl.className = 'year-group';
            yearEl.innerHTML = `<h3>Año ${year}</h3>`;

            Object.keys(grouped[year]).sort((a,b)=>b-a).forEach(month => {
                const monthEl = document.createElement('div');
                monthEl.className = 'month-group';
                monthEl.innerHTML = `<h4>${monthNames[month-1]} ${year}</h4>`;

                Object.keys(grouped[year][month]).sort((a,b)=>b-a).forEach(day => {
                    const dayEl = document.createElement('div');
                    dayEl.className = 'day-group';
                    dayEl.innerHTML = `<h5>Día ${day}</h5>`;

                    const listEl = document.createElement('div');
                    listEl.className = 'reports-rows';

                    grouped[year][month][day].forEach(report => {
                        const row = document.createElement('div');
                        row.className = 'report-row';
                        
                        // --- AQUÍ ESTÁN LOS CONTROLES DE ADMINISTRADOR ---
                        row.innerHTML = `
                            <div class="report-main">
                                <div class="report-title">
                                    <a href="report_detail.html?id=${report.id}">${report.titulo}</a>
                                </div>
                                <div class="report-meta">
                                    ${report.distrito || ''} • ${report.urbanizacion || ''}
                                </div>
                            </div>
                            <div class="report-actions">
                                <span class="badge ${report.estado}">
                                    ${report.estado.charAt(0).toUpperCase()+report.estado.slice(1)}
                                </span>
                                <button class="btn action-proceso">En Proceso</button>
                                <button class="btn action-finalizado">Finalizado</button>
                            </div>
                        `;

                        // Funcionalidad de los botones
                        row.querySelector('.action-proceso').addEventListener('click', () => {
                            if(window.updateReportStatus) {
                                window.updateReportStatus(report.id, 'en-proceso');
                                showToast('Reporte marcado como En Proceso');
                                renderAll();
                            } else {
                                alert("Error: Función updateReportStatus no encontrada");
                            }
                        });
                        
                        row.querySelector('.action-finalizado').addEventListener('click', () => {
                            if(window.updateReportStatus) {
                                window.updateReportStatus(report.id, 'resuelto');
                                showToast('Reporte marcado como Finalizado');
                                renderAll();
                            } else {
                                alert("Error: Función updateReportStatus no encontrada");
                            }
                        });

                        listEl.appendChild(row);
                    });

                    monthEl.appendChild(dayEl);
                    monthEl.appendChild(listEl);
                    yearEl.appendChild(monthEl);
                });
            });
            container.appendChild(yearEl);
        });
    };

    const showToast = (msg) => {
        const el = document.getElementById('notificacion');
        if (!el) return;
        el.textContent = msg;
        el.className = 'notificacion exito visible';
        setTimeout(()=>el.classList.remove('visible'), 2500);
    };

    const renderAll = () => {
        const all = window.getReports ? window.getReports() : [];
        let filtered = all.slice();
        const y = filtrosYear ? filtrosYear.value : '';
        const m = filtrosMonth ? filtrosMonth.value : '';
        const d = filtrosDay ? filtrosDay.value : '';

        if (y) filtered = filtered.filter(r => new Date(r.fecha).getFullYear().toString() === y);
        if (m) filtered = filtered.filter(r => (new Date(r.fecha).getMonth()+1).toString() === m);
        if (d) filtered = filtered.filter(r => new Date(r.fecha).getDate().toString() === d);

        renderList(filtered);
        
        // Poblar filtros solo si están vacíos para no resetear selección
        if(filtrosYear && filtrosYear.options.length <= 1) populateFilters(all);
    };

    const populateFilters = (all) => {
        if(!filtrosYear) return;
        const years = Array.from(new Set(all.map(r=> new Date(r.fecha).getFullYear()))).sort((a,b)=>b-a);
        filtrosYear.innerHTML = '<option value="">Todos</option>' + years.map(y=>`<option value="${y}">${y}</option>`).join('');

        const months = Array.from(new Set(all.map(r=> new Date(r.fecha).getMonth()+1))).sort((a,b)=>a-b);
        filtrosMonth.innerHTML = '<option value="">Todos</option>' + months.map(m=>`<option value="${m}">${monthNames[m-1]}</option>`).join('');

        const days = Array.from(new Set(all.map(r=> new Date(r.fecha).getDate()))).sort((a,b)=>a-b);
        filtrosDay.innerHTML = '<option value="">Todos</option>' + days.map(d=>`<option value="${d}">${d}</option>`).join('');
    };

    if (filtrosYear) filtrosYear.addEventListener('change', renderAll);
    if (filtrosMonth) filtrosMonth.addEventListener('change', renderAll);
    if (filtrosDay) filtrosDay.addEventListener('change', renderAll);

    renderAll();
});