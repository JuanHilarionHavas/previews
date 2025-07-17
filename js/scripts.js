window.addEventListener('DOMContentLoaded', event => {

    // Recarga de iframes en cualquier ad-frame
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.reload-iframe-btn');
        if (btn) {
            // Animación visual
            btn.classList.add('is-reloading');
            setTimeout(() => btn.classList.remove('is-reloading'), 500);

            const adFrame = btn.closest('.ad-frame');
            const iframe = adFrame?.querySelector('iframe');
            if (iframe) {
                // Recarga el iframe (fuerza reload)
                const src = iframe.getAttribute('src');
                iframe.setAttribute('src', src);
                // Muestra el loader si existe
                const loader = adFrame.querySelector('.iframe-loader');
                if (loader) loader.style.display = 'flex';
            }
        }
    });


    // Scrollspy
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            rootMargin: '0px -20% -200%',
        });
    }

    const generateQRCode = (targetId) => {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.origin}${encodeURIComponent(window.location.pathname)}%23${encodeURIComponent(targetId)}`;
        document.querySelector(`#qrCode`).setAttribute("src", qrUrl)
        document.querySelector(`#qrCodeLabel`).style.display = "block";
    };

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

    const activateSectionById = (targetId) => {
        // Control del overflow del HTML
        document.documentElement.style.overflow = (targetId === "scratch") ? "hidden" : "auto";

        const targetElement = document.getElementById(targetId);

        // Quitar clase activa de todas las secciones
        document.querySelectorAll("section").forEach(section => {
            section.classList.remove("active-section");
        });
        targetElement.classList.add("active-section");

        // Detener todos los iframes que no están en la sección activa
        document.querySelectorAll("section iframe").forEach(iframe => {
            if (!targetElement.contains(iframe)) {
                iframe.setAttribute("src", ""); // Detiene el iframe
            }
        });

        // Mostrar loader y recargar solo los iframes de la sección activa
        const iframes = targetElement.querySelectorAll("iframe");
        iframes.forEach(iframe => {
            const loader = iframe.previousElementSibling;
            if (loader && loader.classList.contains("iframe-loader")) {
                loader.style.display = "flex";
            }
            const src = iframe.getAttribute("data-src");
            iframe.setAttribute("src", src);
        });
        console.log("Sección activada:", targetId);
        generateQRCode(targetId);
    }


    // Navegación por secciones
    document.querySelectorAll(".format_item").forEach(el => {
        el.addEventListener("click", function () {
            // Quitar clase activa de todos los enlaces
            document.querySelectorAll(".format_item").forEach(link => {
                link.classList.remove("active");
            });
            el.classList.add("active");

            // Obtener ID destino y activar sección
            const targetId = el.getAttribute("href").substring(1);
            activateSectionById(targetId);

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



    let targetId = window.location.hash.substring(1);

    if (targetId == ""){
        targetId = "slidereel";
    }

    activateSectionById(targetId);
    const link = document.querySelector(`a[href="#${targetId}"]`);
    console.log("Enlace activado:", link);
    if (link) {
        link.classList.add("active");
        const collapseParent = link.closest('.collapse');
            if (collapseParent) {
            // Usa Bootstrap para colapsar la sección
            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseParent);
            bsCollapse.hide();
            }
    }

    generateQRCode(targetId);

});