function checkAccess() {
    var url = (typeof CHECKACCESS_URL !== 'undefined' ? CHECKACCESS_URL : '') + '/check-access?userId=scratchfungames&appId=scratchfungames&timezone=Asia/Tokyo';
    fetch(url)
        .then(function (response) { return response.json(); })
        .then(function (data) {
            if (!data.allowed) {
                if (window.location.pathname !== '/closed.html' && !window.location.pathname.endsWith('closed.html')) {
                    window.location.href = '/closed.html' + (data.reason ? '?reason=' + encodeURIComponent(data.reason) : '');
                }
            } else {
                if (window.location.pathname === '/closed.html' || window.location.pathname.endsWith('closed.html')) {
                    window.location.href = '/';
                }
            }
        })
        .catch(function (err) { return console.error('Error checking access:', err); });
}

// Check every 30 seconds
setInterval(checkAccess, 30000);
