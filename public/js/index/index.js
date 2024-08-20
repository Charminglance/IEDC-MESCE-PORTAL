document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from submitting

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const batch = document.getElementById('batch').value;
    const department = document.getElementById('department').value;
    const address = document.getElementById('address').value;

    if (!fullName || !email || !phoneNumber || !batch || !department || !address) {
        alert('Please fill in all fields.');
        return;
    }

    // Creating an object with the form data
    const formData = {
        fullName,
        email,
        phoneNumber,
        batch,
        department,
        address
    };

    // Sending the data to the server
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // Convert form data to JSON
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        alert('User registered successfully');
    })
    .catch(error => console.error('Error:', error));
});
