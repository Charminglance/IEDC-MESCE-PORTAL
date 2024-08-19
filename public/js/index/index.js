document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from submitting
    console.log("safeel");
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsCheck = document.getElementById('termsCheck').checked;

    if (!fullName || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    if (!termsCheck) {
        alert('You must agree to the terms and conditions.');
        return;
    }

    alert('Registration successful!');
});
