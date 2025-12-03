// 1. MENU HAMBURGUESA PRINCIPAL
    const btnMenu = document.getElementById('btn-menu');
    const menu = document.querySelector('.barra-navegacion .menu-horizontal');
    
    if(btnMenu) {
        btnMenu.addEventListener('click', () => {
            menu.classList.toggle('activo');
        });
    }

    // 2. SUBMENU ALIANZAS (SOLO MÓVIL)
    const btnAlianzas = document.getElementById("btn-alianzas");
    const submenuAlianzas = document.getElementById("submenu-alianzas");

    if (btnAlianzas && submenuAlianzas) {
        btnAlianzas.addEventListener("click", (event) => {
            // Solo actuar si estamos en modo celular
            if (window.innerWidth <= 768) {
                event.preventDefault(); // Evita que recargue la página al tocar "Alianzas"
                submenuAlianzas.classList.toggle("activo"); // Abre o cierra
            }
        });
    }

    