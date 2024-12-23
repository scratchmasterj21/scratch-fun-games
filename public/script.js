function checkAccess() {
    fetch('/check-access') // Ask the server if access is still allowed
        .then(response => response.json())
        .then(data => {
            if (!data.accessAllowed) { // If blocked, redirect to closed page
                if (window.location.pathname !== '/closed.html') {
                    window.location.href = '/closed.html';
                }
            } else {
                // If allowed, reload the page or redirect to home
                if (window.location.pathname === '/closed.html') {
                    window.location.href = '/'; // Redirect to the homepage
                }
            }
        })
        .catch(err => console.error('Error checking access:', err));
}

// Check every 30 seconds
setInterval(checkAccess, 30000);
