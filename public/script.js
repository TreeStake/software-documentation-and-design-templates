function render(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
}

function statusBadge(status) {
    const map = { 
        'Applied': { label: 'Новий', color: 'secondary' },
        'Interviewing': { label: 'Співбесіда', color: 'primary' },
        'Offered': { label: 'Оффер', color: 'warning' },
        'Rejected': { label: 'Відмова', color: 'danger' },
        'Accepted': { label: 'Прийнятий', color: 'success' }
    };
    const s = map[status] || { label: status || 'Новий', color: 'secondary' };
    return `<span class="badge bg-${s.color}">${s.label}</span>`;
}

function actions(url, id, reload, entityData) {
    const dataStr = btoa(unescape(encodeURIComponent(JSON.stringify(entityData))));
    return `
    <div class="mt-auto d-flex gap-2">
        <button class="btn btn-outline-primary btn-sm w-50" onclick="openEdit('${url}', '${id}', '${reload}', '${dataStr}')">✏ Редагувати</button>
        <button class="btn btn-outline-danger btn-sm w-50" onclick="handleDelete('${url}','${id}','${reload}')">🗑 Видалити</button>
    </div>`;
}

window.handleDelete = async function(url, id, reloadFn) {
    if (!confirm('Delete this record?')) return;
    try {
        const r = await fetch(`${url}/${id}`, { method: 'DELETE' });
        if (r.ok) window[reloadFn](); else alert('Delete failed');
    } catch (e) { alert('Network error'); }
};

let currentEdit = { url: '', id: '', reload: '' };
const editModalEl = document.getElementById('editModal');
const editModal = editModalEl ? new bootstrap.Modal(editModalEl) : null;

window.openEdit = function(url, id, reload, dataStr) {
    const data = JSON.parse(decodeURIComponent(escape(atob(dataStr))));
    currentEdit = { url, id, reload };
    const form = document.getElementById('edit-form');
    
    let html = '';
    for (const key in data) {
        if (['id', 'candidate', 'recruiter', 'result', 'interview', 'vacancy', 'candidateId', 'recruiterId', 'resultId'].includes(key)) continue;
        const val = data[key];
        const label = key.charAt(0).toUpperCase() + key.slice(1);
        
        if (typeof val === 'boolean' || key === 'isActive') {
            html += `<div class="col-12"><div class="form-check"><input class="form-check-input" type="checkbox" name="${key}" id="edit-${key}" ${val ? 'checked' : ''}><label class="form-check-label">${label}</label></div></div>`;
        } else if (key === 'scheduledDate') {
            const date = val ? new Date(val).toISOString().slice(0, 16) : '';
            html += `<div class="col-12"><label class="form-label">${label}</label><input type="datetime-local" class="form-control" name="${key}" value="${date}"></div>`;
        } else if (key === 'status') {
            const options = [
                { v: 'Applied', l: 'Новий' },
                { v: 'Interviewing', l: 'Співбесіда' },
                { v: 'Offered', l: 'Оффер' },
                { v: 'Rejected', l: 'Відмова' },
                { v: 'Accepted', l: 'Прийнятий' }
            ];
            html += `<div class="col-12"><label class="form-label">Статус</label><select class="form-select" name="${key}">${options.map(o => `<option value="${o.v}" ${o.v === val ? 'selected' : ''}>${o.l}</option>`).join('')}</select></div>`;
        } else {
            html += `<div class="col-12"><label class="form-label">${label}</label><input type="${typeof val === 'number' ? 'number' : 'text'}" class="form-control" name="${key}" value="${val ?? ''}"></div>`;
        }
    }
    form.innerHTML = html;
    editModal.show();
};

window.submitEdit = async function() {
    const form = document.getElementById('edit-form');
    const formData = new FormData(form);
    const data = {};
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            data[input.name] = input.checked;
        } else if (input.type === 'number') {
            data[input.name] = parseInt(input.value, 10);
        } else {
            data[input.name] = input.value;
        }
    });

    try {
        const res = await fetch(`${currentEdit.url}/${currentEdit.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            editModal.hide();
            window[currentEdit.reload]();
        } else {
            const err = await res.json();
            alert('Save failed: ' + (err.error || res.statusText));
        }
    } catch (e) { alert('Network error: ' + e.message); }
};

window.loadVacancies = async function() {
    const items = await fetch('/api/vacancies').then(r => r.json());
    render('vacancies-list', [...items].reverse().map(v => `
        <div class="col-md-6">
            <div class="card p-3">
                <div class="card-body p-0">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="card-title mb-0">${v.title}</h6>
                        <span class="badge ${v.isActive ? 'badge-active' : 'badge-inactive'}">● ${v.isActive ? 'Активна' : 'Неактивна'}</span>
                    </div>
                    <p class="small text-muted mb-1">🛠 ${v.requiredSkills}</p>
                    <p class="small mb-3">${v.description}</p>
                    ${actions('/api/vacancies', v.id, 'loadVacancies', v)}
                </div>
            </div>
        </div>`).join(''));
};

window.loadCandidates = async function() {
    const items = await fetch('/api/candidates').then(r => r.json());
    render('candidates-list', [...items].reverse().map(c => `
        <div class="col-md-4">
            <div class="card p-3">
                <div class="card-body p-0">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="card-title mb-0">${c.name}</h6>
                        ${statusBadge(c.status)}
                    </div>
                    <p class="small text-primary mb-1">✉ ${c.email}</p>
                    <p class="small text-muted mb-2">🛠 ${c.skills || 'Навички не вказані'}</p>
                    ${c.resumeUrl ? `<p class="small mb-3">📄 <a href="${c.resumeUrl}" target="_blank">Резюме</a></p>` : '<div class="mb-3"></div>'}
                    ${actions('/api/candidates', c.id, 'loadCandidates', c)}
                </div>
            </div>
        </div>`).join(''));
};

window.loadRecruiters = async function() {
    const items = await fetch('/api/recruiters').then(r => r.json());
    render('recruiters-list', [...items].reverse().map(r => `
        <div class="col-md-4">
            <div class="card p-3">
                <div class="card-body p-0">
                    <h6 class="card-title">${r.name}</h6>
                    <p class="small text-muted mb-2">✉ ${r.email} · ${r.department}</p>
                    <div class="d-flex gap-2 flex-wrap mb-3">
                        <span class="stat-item">✅ ${r.successfulHires ?? 0}</span>
                        <span class="stat-item">📂 ${r.activeVacanciesCount ?? 0}</span>
                        <span class="stat-item">⏱ ${r.averageTimeToHire ?? 0}д</span>
                    </div>
                    ${actions('/api/recruiters', r.id, 'loadRecruiters', r)}
                </div>
            </div>
        </div>`).join(''));
};

window.loadInterviews = async function() {
    const items = await fetch('/api/interviews').then(r => r.json());
    render('interviews-list', [...items].reverse().map(i => `
        <div class="col-md-4">
            <div class="card p-3">
                <div class="card-body p-0">
                    <h6 class="card-title">${i.type}</h6>
                    <p class="small mb-1">📅 ${new Date(i.scheduledDate).toLocaleString('uk-UA')}</p>
                    <p class="small mb-3">👤 Кандидат: <strong>${i.candidate?.name || 'Unknown'}</strong><br>🎯 Рекрутер: <strong>${i.recruiter?.name || 'Unknown'}</strong></p>
                    ${actions('/api/interviews', i.id, 'loadInterviews', i)}
                </div>
            </div>
        </div>`).join(''));
    const rInt = document.getElementById('r-interview');
    if (rInt) rInt.innerHTML = '<option value="">Виберіть інтерв\'ю...</option>' + items.map(i => `<option value="${i.id}">${i.type} — ${i.candidate?.name || '?'}</option>`).join('');
};

window.loadResults = async function() {
    try {
        const items = await fetch('/api/interview-results').then(r => r.json());
        render('results-list', [...items].reverse().map(r => `
            <div class="col-md-4">
                <div class="card p-3">
                    <div class="card-body p-0">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="card-title">Оцінка: ${r.score}/10</h6>
                            <span class="badge bg-${r.isPassed ? 'success' : 'danger'}">${r.isPassed ? 'Пройдено' : 'Не пройдено'}</span>
                        </div>
                        <div class="small mb-3">
                            <p class="mb-1 text-muted">📋 Співбесіда: <strong>${r.interview?.type || '—'}</strong></p>
                            <p class="mb-1 text-muted">👤 Кандидат: <strong>${r.interview?.candidate?.name || 'Невідомо'}</strong></p>
                        </div>
                        <p class="small border-top pt-2">💬 ${r.feedback || 'Відгук відсутній'}</p>
                        ${actions('/api/interview-results', r.id, 'loadResults', r)}
                    </div>
                </div>
            </div>`).join(''));
    } catch(e) {}
};

async function populateSelects() {
    try {
        const [c, r] = await Promise.all([fetch('/api/candidates').then(r => r.json()), fetch('/api/recruiters').then(r => r.json())]);
        render('i-candidate', '<option value="">Виберіть кандидата...</option>' + c.map(x => `<option value="${x.id}">${x.name}</option>`).join(''));
        render('i-recruiter', '<option value="">Виберіть рекрутера...</option>' + r.map(x => `<option value="${x.id}">${x.name}</option>`).join(''));
    } catch(e) {}
}

function setupForms() {
    const configs = [
        { id: 'vacancy-form', url: '/api/vacancies', reload: 'loadVacancies', transform: d => ({ ...d, isActive: document.getElementById('v-isActive').checked }) },
        { id: 'candidate-form', url: '/api/candidates', reload: 'loadCandidates' },
        { id: 'recruiter-form', url: '/api/recruiters', reload: 'loadRecruiters', transform: d => ({ ...d, successfulHires: 0, activeVacanciesCount: 0, averageTimeToHire: 0 }) },
        { id: 'interview-form', url: '/api/interviews', reload: 'loadInterviews' },
        { id: 'result-form', url: '/api/interview-results', reload: 'loadResults', transform: d => ({ ...d, score: parseInt(d.score), isPassed: d.isPassed === 'true' }) }
    ];
    configs.forEach(conf => {
        const f = document.getElementById(conf.id);
        if (!f) return;
        f.addEventListener('submit', async (e) => {
            e.preventDefault();
            let data = Object.fromEntries(new FormData(f));
            if (conf.transform) data = conf.transform(data);
            const res = await fetch(conf.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            if (res.ok) { f.reset(); window[conf.reload](); if (conf.id.includes('candidate') || conf.id.includes('recruiter')) populateSelects(); }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.search) history.replaceState(null, '', window.location.pathname);
    setupForms();
    window.loadVacancies(); window.loadCandidates().then(populateSelects); window.loadRecruiters().then(populateSelects); window.loadInterviews(); window.loadResults();
});
