
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
  // ==========================================
  // LÓGICA DE BÚSQUEDA Y FILTROS (COORDINADOR)
  // ==========================================

  const inputBusquedaEst = document.getElementById('input-busqueda-estudiantes');
  const contenedorResultados = document.getElementById('contenedor-resultados-busqueda');
  const textoSubtitulo = document.getElementById('texto-resultados');
  
  // Elementos del Filtro
  const btnFiltro = document.getElementById('btn-toggle-filtro');
  const menuFiltros = document.getElementById('menu-filtros');
  const opcionesFiltro = document.querySelectorAll('.opcion-filtro');

  // Estado inicial del filtro
  let filtroActual = 'nombre'; // 'nombre' o 'codigo'

  // Datos del estudiante (Base de datos local simulada)
  const estudianteVictor = {
      nombre: "Victor Alberca Saavedra",
      universidad: "Pontificia Universidad Católica del Perú (PUCP)",
      carrera: "Ingeniería de Software",
      codigo: "u201924127",
      foto: "../assets/images/ima-foto-victor.png",
      estado: "Pendiente de Verificación"
  };

  // --- A. Manejo del Menú Desplegable ---
  if (btnFiltro && menuFiltros) {
      // 1. Abrir/Cerrar menú al hacer clic en el botón
      btnFiltro.addEventListener('click', (e) => {
          e.stopPropagation(); // Evitar que el clic se propague al document
          menuFiltros.classList.toggle('activo');
      });

      // 2. Cerrar menú al hacer clic fuera
      document.addEventListener('click', (e) => {
          if (!menuFiltros.contains(e.target) && !btnFiltro.contains(e.target)) {
              menuFiltros.classList.remove('activo');
          }
      });

      // 3. Seleccionar una opción
      opcionesFiltro.forEach(opcion => {
          opcion.addEventListener('click', (e) => {
              // Actualizar variable de estado
              filtroActual = e.target.dataset.tipo;

              // Actualizar estilos visuales (negrita/color)
              opcionesFiltro.forEach(op => op.classList.remove('seleccionado'));
              e.target.classList.add('seleccionado');

              // Actualizar el placeholder del input para guiar al usuario
              if (filtroActual === 'nombre') {
                  inputBusquedaEst.placeholder = "Buscar alumno por nombre...";
              } else {
                  inputBusquedaEst.placeholder = "Buscar alumno por código (ej: u20...)";
              }

              // Cerrar menú y enfocar el input
              menuFiltros.classList.remove('activo');
              inputBusquedaEst.focus();
          });
      });
  }

  // --- B. Lógica de Búsqueda Actualizada ---
  if (inputBusquedaEst && contenedorResultados) {
      
      inputBusquedaEst.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
              e.preventDefault();
              realizarBusqueda();
          }
      });

      function realizarBusqueda() {
          const texto = inputBusquedaEst.value.toLowerCase().trim();
          contenedorResultados.innerHTML = ''; // Limpiar resultados previos
          let encontrado = false;

          // Lógica condicional según el filtro seleccionado
          if (filtroActual === 'nombre') {
              // Buscar por Nombre
              if (texto.includes("victor") || texto.includes("alberca")) {
                  encontrado = true;
              }
          } else if (filtroActual === 'codigo') {
              // Buscar por Código
              if (texto.includes("u201924127") || texto.includes("201924127")) {
                  encontrado = true;
              }
          }

          // Renderizar resultado
          if (encontrado) {
              if(textoSubtitulo) textoSubtitulo.textContent = `Resultado encontrado por ${filtroActual}:`;
              
              const tarjetaHTML = `
                  <div class="tarjeta-correo-item" style="cursor: default; background-color: #f0f8ff; border: 1px solid #005a9c; animation: fadeIn 0.3s;">
                      <img src="${estudianteVictor.foto}" alt="Foto Perfil" class="correo-imagen" style="width: 60px; height: 60px;">
                      <div class="correo-detalles" style="margin-left: 15px;">
                          <p class="correo-nombre" style="font-size: 18px;">${estudianteVictor.nombre} <span style="color: #005a9c;">✓</span></p>
                          <p class="correo-universidad">${estudianteVictor.universidad}</p>
                          <p style="font-size: 14px; color: #555;">Código: <strong>${estudianteVictor.codigo}</strong></p>
                          <div style="margin-top: 5px;">
                              <span style="background-color: #ffc107; padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: bold;">${estudianteVictor.estado}</span>
                          </div>
                      </div>
                      <div style="margin-left: auto;">
                          <button class="boton-accion-coord aceptar" onclick="alert('Perfil de Victor Verificado Exitosamente!')">Verificar</button>
                      </div>
                  </div>
              `;
              contenedorResultados.innerHTML = tarjetaHTML;

          } else if (texto === "") {
              if(textoSubtitulo) textoSubtitulo.textContent = "Lista de resultados:";
              contenedorResultados.innerHTML = '<p style="color: #666; text-align: center;">Escribe algo para buscar.</p>';
          } else {
              // No encontrado
              if(textoSubtitulo) textoSubtitulo.textContent = `Resultados para: "${inputBusquedaEst.value}"`;
              contenedorResultados.innerHTML = `
                  <div style="text-align: center; padding: 20px; color: #666;">
                      <p>No se encontraron estudiantes con ese <strong>${filtroActual}</strong>.</p>
                      <p style="font-size: 13px; margin-top: 5px;">Prueba cambiando el filtro o verificando el texto.</p>
                  </div>
              `;
          }
      }
  }

  // ==========================================
  // LÓGICA DE CERRAR SESIÓN
  // ==========================================
  
  const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');

  if (btnCerrarSesion) {
      btnCerrarSesion.addEventListener('click', (e) => {
          e.preventDefault(); // Evita el salto inmediato
          
          // Preguntar al usuario (Buena práctica)
          const confirmar = confirm("¿Estás seguro de que deseas cerrar sesión?");
          
          if (confirmar) {
              // Redirigir al Login (está en la misma carpeta 'sitios')
              window.location.href = "./index-login.html";
          }
      });
  }
    
  // ==========================================
  // LÓGICA DE NOTIFICACIONES (COORDINADOR)
  // ==========================================
  
  const navNotifCoord = document.getElementById('nav-notificaciones-coord');
  const dropdownNotifCoord = document.getElementById('dropdown-notificaciones-coord');
  const btnInvestigar = document.getElementById('btn-investigar-alerta');

  if (navNotifCoord && dropdownNotifCoord) {
      // 1. Abrir/Cerrar al hacer clic en la campana
      navNotifCoord.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropdownNotifCoord.classList.toggle('activo');
      });

      // 2. Cerrar al hacer clic fuera
      document.addEventListener('click', (e) => {
          if (!dropdownNotifCoord.contains(e.target) && !navNotifCoord.contains(e.target)) {
              dropdownNotifCoord.classList.remove('activo');
          }
      });

      // 3. Evitar cierre al hacer clic dentro
      dropdownNotifCoord.addEventListener('click', (e) => {
          e.stopPropagation();
      });
  }

  // 4. Acción del botón "Investigar Ahora" dentro de la notificación
  if (btnInvestigar) {
      btnInvestigar.addEventListener('click', (e) => {
          e.preventDefault();
          // Cierra el dropdown
          dropdownNotifCoord.classList.remove('activo');
          
          // Navega a la sección de Reportes
          mostrarSeccion('panel-reportes');
          
          // Opcional: Feedback visual o filtro automático (simulado)
          alert("Navegando al detalle de reportes de Juan Perez...");
      });
  }

  // ==========================================
  // LÓGICA: Procesar Verificaciones (CON MODAL)
  // ==========================================

  // Elementos del Modal
  const modalRechazo = document.getElementById('modal-confirmacion');
  const btnCancelarModal = document.getElementById('btn-cancelar-modal');
  const btnConfirmarRechazo = document.getElementById('btn-confirmar-rechazo');
  const spanCantidad = document.getElementById('cantidad-rechazo');

  // Elementos del Panel
  const btnAceptarVerif = document.querySelector('#panel-verificacion .boton-accion-coord.aceptar');
  const btnRechazarVerif = document.querySelector('#panel-verificacion .boton-accion-coord.rechazar');

  // Función CORE (Ejecuta la acción real)
  function ejecutarAccionMasiva(accion) {
      const checkboxesMarcados = document.querySelectorAll('#panel-verificacion .correo-checkbox:checked');
      
      // Eliminar visualmente con animación
      checkboxesMarcados.forEach(checkbox => {
          const tarjeta = checkbox.closest('.tarjeta-correo-item');
          if (tarjeta) {
              tarjeta.style.transition = "all 0.3s ease";
              tarjeta.style.opacity = "0";
              tarjeta.style.transform = "translateX(20px)";
              setTimeout(() => tarjeta.remove(), 300);
          }
      });

      // Verificar si quedó vacío después de borrar
      setTimeout(() => {
          const restantes = document.querySelectorAll('#panel-verificacion .tarjeta-correo-item');
          if (restantes.length === 0) {
              mostrarSeccion('panel-verificacion-vacio');
          } else {
              // Mensaje de éxito discreto
              console.log(`Acción ${accion} completada.`);
          }
      }, 350);
  }

  // 1. Botón RECHAZAR (Abre el Modal Rojo)
  if (btnRechazarVerif) {
      btnRechazarVerif.addEventListener('click', (e) => {
          e.preventDefault();
          const seleccionados = document.querySelectorAll('#panel-verificacion .correo-checkbox:checked').length;

          if (seleccionados === 0) {
              alert("Selecciona al menos un estudiante para rechazar.");
              return;
          }

          // Actualizar texto del modal y mostrarlo
          if(spanCantidad) spanCantidad.textContent = seleccionados;
          modalRechazo.classList.add('activo');
      });
  }

  // 2. Botón ACEPTAR (Mantenemos confirmación simple o directa, según prefieras)
  if (btnAceptarVerif) {
      btnAceptarVerif.addEventListener('click', (e) => {
          e.preventDefault();
          const seleccionados = document.querySelectorAll('#panel-verificacion .correo-checkbox:checked').length;
          
          if (seleccionados === 0) {
              alert("Selecciona al menos un estudiante para aceptar.");
              return;
          }

          if(confirm(`¿Deseas validar a los ${seleccionados} estudiantes seleccionados?`)) {
              ejecutarAccionMasiva('aceptar');
              alert("¡Validación exitosa!");
          }
      });
  }

  // --- Lógica interna del Modal ---
  
  // A. Confirmar Rechazo (Botón Rojo del Modal)
  if (btnConfirmarRechazo) {
      btnConfirmarRechazo.addEventListener('click', () => {
          ejecutarAccionMasiva('rechazar');
          modalRechazo.classList.remove('activo'); // Cerrar modal
      });
  }

  // B. Cancelar (Cerrar modal)
  if (btnCancelarModal) {
      btnCancelarModal.addEventListener('click', () => {
          modalRechazo.classList.remove('activo');
      });
  }

  // ==========================================
  // INTERACCIONES DEL DASHBOARD PRINCIPAL
  // ==========================================

  // 1. Flecha "Ver más" de Verificaciones
  const btnVerMasVerif = document.getElementById('btn-ver-mas-verificaciones');
  if (btnVerMasVerif) {
      btnVerMasVerif.addEventListener('click', () => {
          // Redirige a la sección completa de verificaciones
          mostrarSeccion('panel-verificacion');
      });
  }

  // 2. Flecha "Ver más" de Reportes
  const btnVerMasRep = document.getElementById('btn-ver-mas-reportes');
  if (btnVerMasRep) {
      btnVerMasRep.addEventListener('click', () => {
          // Redirige a la sección completa de reportes
          mostrarSeccion('panel-reportes');
      });
  }

  // 3. Mini Formulario de Búsqueda de Estudiantes
  const formBusquedaDash = document.getElementById('form-busqueda-dashboard');
  const inputNombreDash = document.getElementById('input-nombre-dash');
  
  // Referencia al input de la sección de Estudiantes (destino)
  const inputEstudiantesPrincipal = document.getElementById('input-busqueda-estudiantes');

  if (formBusquedaDash) {
      formBusquedaDash.addEventListener('submit', (e) => {
          e.preventDefault(); // Evita que se recargue la página
          
          const terminoBusqueda = inputNombreDash.value;
          
          // A. Cambiamos a la sección de estudiantes
          mostrarSeccion('panel-estudiantes');
          
          // B. (Opcional) Pasamos el texto al buscador principal para simular continuidad
          if (inputEstudiantesPrincipal) {
              inputEstudiantesPrincipal.value = terminoBusqueda;
              inputEstudiantesPrincipal.focus();
              
              // Simular clic en buscar si ya existe la función (opcional)
              // realizarBusqueda(); 
          }
      });
  }
  
  // 4. Iconos "Ojo" (Ver detalle) en las tarjetitas del dashboard
  // Esto hace que los ojitos pequeños del dashboard también funcionen
  const ojosDashboard = document.querySelectorAll('#panel-dashboard .item-icono-ver');
  
  ojosDashboard.forEach(ojo => {
      ojo.addEventListener('click', (e) => {
          e.preventDefault();
          // Dependiendo de la columna, llevamos a uno u otro lado
          // Como es prototipo, podemos llevarlos a la sección correspondiente
          const columnaPadre = ojo.closest('.panel-columna');
          const tituloColumna = columnaPadre.querySelector('h2').innerText;

          if (tituloColumna.includes("Verificaciones")) {
              mostrarSeccion('panel-verificacion');
          } else if (tituloColumna.includes("Reportes")) {
              mostrarSeccion('panel-reportes');
          }
      });
  });
  
  

    // Opcional: Nos aseguramos de que el dashboard sea lo primero que se vea al cargar la página.
    // (Esto es una doble seguridad, ya que también pusimos la clase 'activa' en el HTML)
    mostrarSeccion('panel-dashboard');
  });
