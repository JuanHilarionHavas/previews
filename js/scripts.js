window.addEventListener('DOMContentLoaded', event => {

    // Scrollspy
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            rootMargin: '0px 0px -40%',
        });
    }

    // Configurar cada iframe una sola vez al cargar
    document.querySelectorAll("iframe").forEach(iframe => {
        const loader = iframe.previousElementSibling;

        if (!iframe.getAttribute("data-src")) {
            iframe.setAttribute("data-src", iframe.getAttribute("src"));
        }

        if (!iframe.dataset.listenerSet) {
            iframe.addEventListener("load", () => {
                const loader = iframe.previousElementSibling;
                if (loader && loader.classList.contains("iframe-loader")) {
                    setTimeout(() => {
                        loader.style.display = "none";
                    }, 1000);
                }
            });
            iframe.dataset.listenerSet = "true";
        }
    });

    // Navegación por secciones
    document.querySelectorAll(".nav-link").forEach(el => {
        el.addEventListener("click", function () {
            // Quitar clase activa de todos los enlaces
            document.querySelectorAll(".nav-link").forEach(link => {
                link.classList.remove("active");
            });
            el.classList.add("active");

            // Obtener ID destino y activar sección
            const targetId = el.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);

            document.querySelectorAll("section").forEach(section => {
                section.classList.remove("active-section");
            });
            targetElement.classList.add("active-section");

            // Mostrar loader y recargar iframe(s)
            const iframes = targetElement.querySelectorAll("iframe");
            iframes.forEach(iframe => {
                const loader = iframe.previousElementSibling;
                if (loader && loader.classList.contains("iframe-loader")) {
                    loader.style.display = "flex";
                }
                const src = iframe.getAttribute("data-src");
                iframe.setAttribute("src", src);
            });
        });
    });

    // Cierre automático del menú móvil
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});
