// js/script.js
let imageURL = '';

function updateEditor() {
    const title = document.getElementById('email-title').value || 'Your Email Title';
    const content = document.getElementById('email-content').value || 'Your email content goes here.';
    const emailEditor = document.getElementById('email-editor');
    const emailTitle = emailEditor.querySelector('.email-title');
    const emailContent = emailEditor.querySelector('.email-content');
    const emailImage = emailEditor.querySelector('.email-image');

    // Update the editor content with the new values
    emailTitle.textContent = title;
    emailContent.textContent = content;

    if (imageURL) {
        emailImage.src = imageURL;
        emailImage.style.display = 'block';
    } else {
        emailImage.style.display = 'none';
    }
}

document.getElementById('email-title').addEventListener('input', updateEditor);
document.getElementById('email-content').addEventListener('input', updateEditor);

document.getElementById('email-image').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageURL = e.target.result;
            updateEditor();
        };
        reader.readAsDataURL(file);
    }
});

function saveTemplate() {
    const title = document.getElementById('email-title').value;
    const content = document.getElementById('email-content').value;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', document.getElementById('email-image').files[0]);

    fetch('/saveTemplate', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Template saved!');
        } else {
            alert('Error saving template');
        }
    })
    .catch(error => {
        console.error('Error occurred:', error);
        alert('Failed to save template');
    });
}
