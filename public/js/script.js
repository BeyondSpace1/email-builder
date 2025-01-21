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

    // Apply text styles
    const textColor = document.getElementById('text-color').value;
    const textSize = document.getElementById('text-size').value;
    const textAlignment = document.getElementById('text-alignment').value;

    emailContent.className = `email-content ${textColor} ${textSize} ${textAlignment}`;
}

document.getElementById('email-title').addEventListener('input', updateEditor);
document.getElementById('email-content').addEventListener('input', updateEditor);

document.getElementById('email-image').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imageURL = e.target.result;
            updateEditor();
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('text-color').addEventListener('change', updateEditor);
document.getElementById('text-size').addEventListener('change', updateEditor);
document.getElementById('text-alignment').addEventListener('change', updateEditor);

document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    const html = document.querySelector('html');
    if (html.getAttribute('data-theme') === 'light') {
        html.setAttribute('data-theme', 'dark');
        document.body.classList.replace('bg-gray-100', 'bg-gray-800');
        document.body.classList.replace('text-black', 'text-white');
    } else {
        html.setAttribute('data-theme', 'light');
        document.body.classList.replace('bg-gray-800', 'bg-gray-100');
        document.body.classList.replace('text-white', 'text-black');
    }
});
