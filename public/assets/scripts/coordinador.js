
  // Función para mostrar la sección correcta y ocultar las demás
  function mostrarSeccion(idSeccionAMostrar) {
    // 1. Ocultar todas las secciones
    document.querySelectorAll('.panel-seccion').forEach(seccion => {
      seccion.classList.remove('activa');
    });
    
    // 2. Mostrar solo la sección deseada
    const seccion = document.getElementById(idSeccionAMostrar);
    if (seccion) {
      seccion.classList.add('activa');
    }
  }

  // Añadir los "event listeners" a los links de navegación
  // Se ejecuta cuando todo el HTML está cargado
  document.addEventListener('DOMContentLoaded', () => {
    
    // Link del Panel (icono de perfil)
    document.getElementById('nav-dashboard').addEventListener('click', (e) => {
      e.preventDefault(); // Evita que la página salte por el href="#"
      mostrarSeccion('panel-dashboard');
    });

    // Link de Verificación
    document.getElementById('nav-verificacion').addEventListener('click', (e) => {
      e.preventDefault();
      // Por defecto, mostramos el panel con contenido.
      // Puedes cambiar 'panel-verificacion' por 'panel-verificacion-vacio' si quieres probar esa vista
      mostrarSeccion('panel-verificacion'); 
    });

    // Link de Reportes
    document.getElementById('nav-reportes').addEventListener('click', (e) => {
      e.preventDefault();
      mostrarSeccion('panel-reportes');
    });

    // Link de Estudiantes
    document.getElementById('nav-estudiantes').addEventListener('click', (e) => {
      e.preventDefault();
      mostrarSeccion('panel-estudiantes');
    });

    // ==========================================
  // NUEVO: Lógica "Seleccionar Todos" (Coordinador)
  // ==========================================

  /**
   * Configura un checkbox maestro para marcar/desmarcar un grupo de checkboxes.
   * @param {string} idMaster - El ID del checkbox "Seleccionar todos".
   * @param {string} claseItems - La clase de los checkboxes individuales.
   */
  function configurarSeleccionarTodos(idMaster, claseItems) {
      const masterCheckbox = document.getElementById(idMaster);
      
      if (masterCheckbox) {
          masterCheckbox.addEventListener('change', (e) => {
              const isChecked = e.target.checked;
              // Buscar todos los checkboxes hijos VISIBLES en la página con esa clase
              const checkboxesHijos = document.querySelectorAll(`.${claseItems}`);
              
              checkboxesHijos.forEach(cb => {
                  cb.checked = isChecked;
              });
          });
      }
  }

  // 1. Para la sección "Verificaciones Pendientes" (La que tiene datos)
  // ID del master: 'seleccionar-todos-coord'
  // Clase de los hijos: 'correo-checkbox'
  configurarSeleccionarTodos('seleccionar-todos-coord', 'correo-checkbox');

  // 2. Para la sección "Verificaciones Vacío" (La que me pediste específicamente)
  // ID del master: 'seleccionar-todos'
  // Clase de los hijos: Asumimos que usarás 'correo-checkbox' o 'item-checkbox' si agregas datos ahí.
  // Nota: Si esa sección está vacía actualmente, esto no marcará nada hasta que agregues elementos.
  configurarSeleccionarTodos('seleccionar-todos', 'correo-checkbox');


  // ==========================================
  // Lógica: Mostrar Detalle de Verificación (Coordinador)
  // ==========================================
  
  const tarjetasVerificacion = document.querySelectorAll('.tarjeta-correo-item');
  const panelVacio = document.getElementById('vista-detalle-vacia');
  const panelLleno = document.getElementById('vista-detalle-llena');
  const btnCerrarDetalle = document.getElementById('btn-cerrar-detalle');

  // Verificamos que existan los paneles en esta página
  if (panelVacio && panelLleno) {
      
      // 1. Evento: Clic en una tarjeta de la lista
      tarjetasVerificacion.forEach(tarjeta => {
          tarjeta.addEventListener('click', (e) => {
              // Si el clic fue en el checkbox, no abrimos el detalle
              if (e.target.type === 'checkbox' || e.target.classList.contains('correo-checkbox')) {
                  return;
              }

              // Lógica de cambio de panel
              panelVacio.style.display = 'none'; // Oculta el vacío
              panelLleno.style.display = 'flex'; // Muestra el lleno
          });
      });

      // 2. Evento: Clic en el botón "Cerrar" (X)
      if (btnCerrarDetalle) {
          btnCerrarDetalle.addEventListener('click', () => {
              panelLleno.style.display = 'none'; // Oculta el lleno
              panelVacio.style.display = 'flex'; // Muestra el vacío (o block si prefieres)
          });
      }
  }

  // ==========================================
  // NUEVO: Exportar Reporte a CSV
  // ==========================================
  const btnExportar = document.getElementById('btn-exportar-csv');
  
  if (btnExportar) {
      btnExportar.addEventListener('click', (e) => {
          e.preventDefault();
          
          // 1. Feedback visual (cambiar texto del botón)
          const originalText = btnExportar.innerHTML;
          btnExportar.innerHTML = 'Descargando...';
          btnExportar.style.opacity = '0.7';
          
          // 2. Simular tiempo de procesamiento (1 segundo)
          setTimeout(() => {
              // 3. Crear contenido falso del CSV
              const mes = document.getElementById('mes').value;
              const anio = document.getElementById('anio').value;
              
              const csvContent = `Reporte de Verificados - SkillSwap\nPeriodo: ${mes} ${anio}\n\nNombre,Universidad,Estado,Fecha\nLuis Garcia,UPC,Verificado,12/05/${anio}\nMaria Lopez,U. Lima,Verificado,15/05/${anio}\nCarlos Perez,PUCP,Pendiente,20/05/${anio}`;
              
              // 4. Crear un enlace temporal para forzar la descarga
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.setAttribute("href", url);
              link.setAttribute("download", `reporte_verificados_${mes}_${anio}.csv`);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              
              // 5. Clic automático y limpieza
              link.click();
              document.body.removeChild(link);
              
              // 6. Restaurar botón y avisar
              btnExportar.innerHTML = originalText;
              btnExportar.style.opacity = '1';
              alert(`✅ El reporte de ${mes} ${anio} se ha descargado correctamente.`);
              
          }, 1000);
      });
  }

    // Opcional: Nos aseguramos de que el dashboard sea lo primero que se vea al cargar la página.
    // (Esto es una doble seguridad, ya que también pusimos la clase 'activa' en el HTML)
    mostrarSeccion('panel-dashboard');
  });
