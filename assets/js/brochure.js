document.addEventListener('DOMContentLoaded', function() {
    // Function to validate form fields
    function validateForm() {
        var name = document.getElementById('modalname').value.trim();
        var mobile = document.getElementById('modalmobile').value.trim();
        var email = document.getElementById('modalemail').value.trim();
        var isValid = true;

        // Validate Name
        if (name === '') {
            isValid = false;
        }

        // Validate Mobile
        if (mobile === '' || !/^[0-9]{10}$/.test(mobile)) {
            isValid = false;
            
        }

        // Validate Email
        if (email === '' || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            isValid = false;
        }

        // Enable or disable submit button based on form validity
        document.getElementById('submitBtn').disabled = !isValid;

        return isValid;
    }

    // Event listener for form submission
    document.getElementById('enquiryForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting

        // Validate form before submitting
        if (!validateForm()) {
            console.log('Form validation failed');
            return;
        }

        // Clear previous messages
        document.getElementById('form-messages').innerHTML = '';

        var formData = new FormData(this);

        console.log('Before fetch');
        fetch('download.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            // console.log('Fetch completed');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Expected JSON response from server');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // console.log('Form submitted successfully');
                document.getElementById('form-messages').innerHTML = '<p class="text-success">Form submitted successfully!</p>';
                if (data.mail_sent) {
                    document.getElementById('form-messages').innerHTML += '<p class="text-success">Email sent successfully!</p>';
                    document.getElementById('download-readMore').classList.remove('hidden');
                } else {
                    document.getElementById('downloadDiv').style.display = 'block';
                    document.getElementById('form-messages').innerHTML += '<p class="text-danger">Failed to send email.</p>';
                }
                document.getElementById('enquiryForm').reset();
            } else {
                // console.log('Form submission failed:', data.error);
               
                document.getElementById('form-messages').innerHTML = '<p class="text-danger">Failed to submit form. ' + (data.error || 'Please check the fields and try again.') + '</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('form-messages').innerHTML = '<p class="text-danger">An unexpected error occurred. Please try again later.</p>';
        });
    });

    // Event listeners for input fields to check form validity on input change
    document.getElementById('modalname').addEventListener('input', validateForm);
    document.getElementById('modalmobile').addEventListener('input', validateForm);
    document.getElementById('modalemail').addEventListener('input', validateForm);

    // Initially disable the submit button
    document.getElementById('submitBtn').disabled = true;
});
