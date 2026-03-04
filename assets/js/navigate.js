(function () {
    function loadPage(url, pushState) {
        fetch(url)
            .then(function (r) { return r.text(); })
            .then(function (html) {
                var doc = new DOMParser().parseFromString(html, 'text/html');

                document.querySelector('.content').innerHTML =
                    doc.querySelector('.content').innerHTML;

                document.title = doc.title;

                var path = new URL(url, location.origin).pathname;
                document.querySelectorAll('.tab-bar .tab').forEach(function (tab) {
                    tab.classList.toggle('active',
                        new URL(tab.href, location.origin).pathname === path);
                });

                if (pushState) history.pushState(null, '', url);
            });
    }

    document.addEventListener('click', function (e) {
        var link = e.target.closest('a[href]');
        if (!link) return;
        var url = new URL(link.href, location.origin);
        if (url.origin !== location.origin) return;
        e.preventDefault();
        loadPage(link.href, true);
    });

    window.addEventListener('popstate', function () {
        loadPage(location.href, false);
    });
})();
