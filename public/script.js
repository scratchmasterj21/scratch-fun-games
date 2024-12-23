function checkAccess() {
        fetch('/check-access') // Ask the server if access is still allowed
            .then(response => response.json())
            .then(data => {
                if (!data.accessAllowed) { // If blocked, redirect to closed page
                    window.location.href = '/closed.html';
                }
            })
            .catch(err => console.error('Error checking access:', err));
    }

    // Check every 30 seconds
    setInterval(checkAccess, 30000);