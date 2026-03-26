const form = document.getElementById('requestForm');
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('imagePreview');
const successMessage = document.getElementById('successMessage');
const formContainer = document.getElementById('formContainer');

let imageData = null;

// Image preview with animation
if (imageInput) {
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('Расм ҳажми 2MB дан ошмаслиги керак!');
                imageInput.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                imageData = e.target.result;
                imagePreview.innerHTML = `
                    <img src="${imageData}" alt="Preview">
                    <button type="button" class="remove-image" onclick="removeImage()">✕</button>
                `;
                imagePreview.style.display = 'block';

                // Update file input label
                const uploadText = document.querySelector('.upload-text');
                if (uploadText) {
                    uploadText.textContent = file.name;
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

// Remove image
function removeImage() {
    imageData = null;
    imageInput.value = '';
    imagePreview.innerHTML = '';
    imagePreview.style.display = 'none';
    const uploadText = document.querySelector('.upload-text');
    if (uploadText) {
        uploadText.textContent = 'Расм танланг';
    }
}

// Form submission (static - saves to localStorage)
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');

        // Show loading state
        submitBtn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoader) btnLoader.style.display = 'inline';

        // Get form data
        const formData = {
            id: Date.now(),
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            description: document.getElementById('description').value,
            image: imageData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // Save to localStorage
        try {
            const requests = JSON.parse(localStorage.getItem('remontRequests') || '[]');
            requests.push(formData);
            localStorage.setItem('remontRequests', JSON.stringify(requests));

            // Simulate network delay
            setTimeout(() => {
                formContainer.style.display = 'none';
                successMessage.style.display = 'flex';

                submitBtn.disabled = false;
                if (btnText) btnText.style.display = 'inline';
                if (btnLoader) btnLoader.style.display = 'none';
            }, 1500);
        } catch (error) {
            alert('Хатолик юз берди! Илтимос қайта уриниб кўринг.');
            submitBtn.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (btnLoader) btnLoader.style.display = 'none';
        }
    });
}

function resetForm() {
    if (form) {
        form.reset();
        removeImage();
        formContainer.style.display = 'block';
        successMessage.style.display = 'none';
    }
}

// Add input animations
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.form-group').forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        group.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
    });
});

// Phone number formatting
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.startsWith('998')) {
            value = value.substring(3);
        }
        if (value.length > 9) {
            value = value.substring(0, 9);
        }
        if (value.length > 0) {
            let formatted = '+998';
            if (value.length >= 2) {
                formatted += ' (' + value.substring(0, 2) + ')';
            }
            if (value.length >= 5) {
                formatted += ' ' + value.substring(2, 5);
            }
            if (value.length >= 7) {
                formatted += '-' + value.substring(5, 7);
            }
            if (value.length >= 9) {
                formatted += '-' + value.substring(7, 9);
            }
            e.target.value = formatted;
        }
    });
}
