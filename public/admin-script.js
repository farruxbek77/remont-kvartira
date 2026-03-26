// Admin Panel JavaScript - Static Version (No Backend)
// This version uses localStorage to simulate backend functionality

// Initialize data from localStorage
let requests = JSON.parse(localStorage.getItem('remontRequests') || '[]');

// Save data to localStorage
function saveData() {
    localStorage.setItem('remontRequests', JSON.stringify(requests));
    updateStats();
}

// Update statistics
function updateStats() {
    const total = requests.length;
    const pending = requests.filter(r => r.status === 'pending').length;
    const approved = requests.filter(r => r.status === 'approved').length;
    const rejected = requests.filter(r => r.status === 'rejected').length;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('totalRequests').textContent = total;
    document.getElementById('pendingRequests').textContent = pending;
    document.getElementById('approvedRequests').textContent = approved;
    document.getElementById('rejectedRequests').textContent = rejected;
}

// Render requests list
function renderRequests(filter = 'all') {
    const container = document.getElementById('requestsList');

    let filteredRequests = requests;
    if (filter !== 'all') {
        filteredRequests = requests.filter(r => r.status === filter);
    }

    if (filteredRequests.length === 0) {
        container.innerHTML = '<div class="empty-state">📭 Аризалар топилмади</div>';
        return;
    }

    container.innerHTML = filteredRequests.map(req => `
        <div class="request-card ${req.status}" data-id="${req.id}">
            <div class="request-header">
                <div class="request-id">#${req.id}</div>
                <div class="request-status status-${req.status}">
                    ${req.status === 'pending' ? '⏳ Кутилмоқда' :
            req.status === 'approved' ? '✅ Қабул қилинган' :
                '❌ Рад этилган'}
                </div>
            </div>
            <div class="request-body">
                <div class="request-info">
                    <div class="info-item">
                        <span class="info-label">👤 Исм:</span>
                        <span class="info-value">${req.name}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📞 Телефон:</span>
                        <span class="info-value">${req.phone}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📍 Манзил:</span>
                        <span class="info-value">${req.address || 'Кўрсатилмаган'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📝 Изоҳ:</span>
                        <span class="info-value">${req.description || 'Йўқ'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📅 Сана:</span>
                        <span class="info-value">${new Date(req.createdAt).toLocaleString('uz-UZ')}</span>
                    </div>
                </div>
                ${req.image ? `
                    <div class="request-image">
                        <img src="${req.image}" alt="Расм" onclick="viewImage('${req.image}')">
                    </div>
                ` : ''}
            </div>
            <div class="request-actions">
                ${req.status === 'pending' ? `
                    <button class="action-btn approve" onclick="updateStatus(${req.id}, 'approved')">
                        ✅ Қабул қилиш
                    </button>
                    <button class="action-btn reject" onclick="updateStatus(${req.id}, 'rejected')">
                        ❌ Рад этиш
                    </button>
                ` : ''}
                <button class="action-btn view" onclick="viewRequest(${req.id})">
                    👁️ Кўриш
                </button>
                <button class="action-btn delete" onclick="deleteRequest(${req.id})">
                    🗑️ Ўчириш
                </button>
            </div>
        </div>
    `).join('');
}

// Update request status
function updateStatus(id, status) {
    const request = requests.find(r => r.id === id);
    if (request) {
        request.status = status;
        saveData();
        renderRequests(currentFilter);
    }
}

// Delete request
function deleteRequest(id) {
    if (confirm('Ҳақиқатан ҳам ўчирмоқчимисиз?')) {
        requests = requests.filter(r => r.id !== id);
        saveData();
        renderRequests(currentFilter);
    }
}

// View request details in modal
function viewRequest(id) {
    const request = requests.find(r => r.id === id);
    if (!request) return;

    const modal = document.getElementById('requestModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>Ариза #${request.id}</h2>
            <div class="request-status status-${request.status}">
                ${request.status === 'pending' ? '⏳ Кутилмоқда' :
            request.status === 'approved' ? '✅ Қабул қилинган' :
                '❌ Рад этилган'}
            </div>
        </div>
        <div class="modal-details">
            <div class="detail-row">
                <span class="detail-label">👤 Исм:</span>
                <span class="detail-value">${request.name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">📞 Телефон:</span>
                <span class="detail-value"><a href="tel:${request.phone}">${request.phone}</a></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">📍 Манзил:</span>
                <span class="detail-value">${request.address || 'Кўрсатилмаган'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">📝 Изоҳ:</span>
                <span class="detail-value">${request.description || 'Йўқ'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">📅 Сана:</span>
                <span class="detail-value">${new Date(request.createdAt).toLocaleString('uz-UZ')}</span>
            </div>
            ${request.image ? `
                <div class="detail-row">
                    <span class="detail-label">🖼️ Расм:</span>
                    <div class="modal-image">
                        <img src="${request.image}" alt="Расм" style="max-width:100%;border-radius:4px;">
                    </div>
                </div>
            ` : ''}
        </div>
        <div class="modal-actions">
            ${request.status === 'pending' ? `
                <button class="action-btn approve" onclick="updateStatus(${request.id}, 'approved'); closeModal();">
                    ✅ Қабул қилиш
                </button>
                <button class="action-btn reject" onclick="updateStatus(${request.id}, 'rejected'); closeModal();">
                    ❌ Рад этиш
                </button>
            ` : ''}
            <button class="action-btn delete" onclick="deleteRequest(${request.id}); closeModal();">
                🗑️ Ўчириш
            </button>
        </div>
    `;

    modal.style.display = 'flex';
}

// View image in modal
function viewImage(imageSrc) {
    const modal = document.getElementById('requestModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <div class="modal-image-view">
            <img src="${imageSrc}" alt="Расм" style="max-width:100%;max-height:80vh;border-radius:4px;">
        </div>
    `;

    modal.style.display = 'flex';
}

// Close modal
function closeModal() {
    document.getElementById('requestModal').style.display = 'none';
}

// Filter functionality
let currentFilter = 'all';
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderRequests(currentFilter);
    });
});

// Modal close button
document.querySelector('.close').addEventListener('click', closeModal);

// Close modal on outside click
window.addEventListener('click', (e) => {
    const modal = document.getElementById('requestModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    renderRequests();
});

// Add some demo data if empty (for testing)
if (requests.length === 0) {
    requests = [
        {
            id: Date.now(),
            name: 'Алишер Рашидов',
            phone: '+998 91 234 56 78',
            address: 'Ташкент, Юнусабад 5-кв',
            description: '3-хонали квартира таъмирлаш керак',
            status: 'pending',
            createdAt: new Date().toISOString(),
            image: null
        }
    ];
    saveData();
}
