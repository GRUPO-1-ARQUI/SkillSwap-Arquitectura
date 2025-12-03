// Función para mostrar la sección correcta y ocultar las demás
function mostrarSeccion(idSeccionAMostrar) {
  document.querySelectorAll('.panel-seccion').forEach(seccion => {
    seccion.classList.remove('activa');
  });
  
  const seccion = document.getElementById(idSeccionAMostrar);
  if (seccion) {
    seccion.classList.add('activa');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. NAVEGACIÓN
  // ==========================================
  document.getElementById('nav-dashboard').addEventListener('click', (e) => {
    e.preventDefault();
    mostrarSeccion('panel-dashboard');
  });

  document.getElementById('nav-verificacion').addEventListener('click', (e) => {
    e.preventDefault();
    mostrarSeccion('panel-verificacion'); 
  });

  document.getElementById('nav-reportes').addEventListener('click', (e) => {
    e.preventDefault();
    mostrarSeccion('panel-reportes');
  });

  document.getElementById('nav-estudiantes').addEventListener('click', (e) => {
    e.preventDefault();
    mostrarSeccion('panel-estudiantes');
  });

  // ==========================================
  // 2. LÓGICA "SELECCIONAR TODOS"
  // ==========================================
  function configurarSeleccionarTodos(idMaster, claseItems) {
      const masterCheckbox = document.getElementById(idMaster);
      if (masterCheckbox) {
          masterCheckbox.addEventListener('change', (e) => {
              const isChecked = e.target.checked;
              const checkboxesHijos = document.querySelectorAll(`.${claseItems}`);
              checkboxesHijos.forEach(cb => cb.checked = isChecked);
          });
      }
  }
  configurarSeleccionarTodos('seleccionar-todos-coord', 'correo-checkbox');
  configurarSeleccionarTodos('seleccionar-todos', 'correo-checkbox');

  // ==========================================
  // 3. VARIABLES DE ESTADO (Detalle y Modal)
  // ==========================================
  
  // Guardamos qué tarjeta se está viendo actualmente
  let itemActualEnDetalle = null;
  
  // Guardamos qué acción ejecutará el modal al confirmar
  let accionConfirmacionPendiente = null; 

  const contenedorVerificaciones = document.querySelector('.contenido-verificaciones-coord');
  const tarjetasVerificacion = document.querySelectorAll('.tarjeta-correo-item');
  const panelVacio = document.getElementById('vista-detalle-vacia');
  const panelLleno = document.getElementById('vista-detalle-llena');
  
  const modalRechazo = document.getElementById('modal-confirmacion');
  const btnCancelarModal = document.getElementById('btn-cancelar-modal');
  const btnConfirmarRechazo = document.getElementById('btn-confirmar-rechazo');
  const spanCantidad = document.getElementById('cantidad-rechazo');

  // ==========================================
  // 4. VISUALIZACIÓN DE DETALLES
  // ==========================================

  function cerrarDetalle() {
      // Desktop
      if(panelLleno) panelLleno.style.display = 'none';
      if(panelVacio) panelVacio.style.display = 'flex';
      // Móvil
      if(contenedorVerificaciones) contenedorVerificaciones.classList.remove('mostrando-detalle');
      // Limpiar
      itemActualEnDetalle = null;
  }

  // Botón "Volver" para móvil
  let btnVolver = document.querySelector('.btn-volver-movil');
  if (!btnVolver && panelLleno) {
      btnVolver = document.createElement('button');
      btnVolver.className = 'btn-volver-movil';
      btnVolver.innerHTML = '← Volver a la lista';
      panelLleno.prepend(btnVolver);
      btnVolver.addEventListener('click', () => {
          contenedorVerificaciones.classList.remove('mostrando-detalle');
      });
  }

  if (panelVacio && panelLleno) {
      tarjetasVerificacion.forEach(tarjeta => {
          tarjeta.addEventListener('click', (e) => {
              // Evitar si es clic en checkbox
              if (e.target.type === 'checkbox' || e.target.classList.contains('correo-checkbox')) {
                  return;
              }

              // Guardamos referencia a esta tarjeta
              itemActualEnDetalle = tarjeta;

              // Actualizar datos visuales del detalle (Simulado)
              const nombre = tarjeta.querySelector('.correo-nombre').innerText;
              const tituloDetalle = panelLleno.querySelector('.detalle-datos-principales h3');
              if(tituloDetalle) tituloDetalle.innerText = nombre;

              // Mostrar panel
              panelVacio.style.display = 'none'; 
              panelLleno.style.display = 'flex'; 
              contenedorVerificaciones.classList.add('mostrando-detalle');
              window.scrollTo({ top: 0, behavior: 'smooth' });
          });
      });

      const btnCerrarDetalle = document.getElementById('btn-cerrar-detalle');
      if (btnCerrarDetalle) {
          btnCerrarDetalle.addEventListener('click', cerrarDetalle);
      }
  }

  // ==========================================
  // 5. BOTONES DENTRO DEL DETALLE (Aprobar/Rechazar)
  // ==========================================

  const btnAceptarDetalle = document.querySelector('.panel-detalle-completo-coord .btn-accion-detalle.aceptar');
  const btnRechazarDetalle = document.querySelector('.panel-detalle-completo-coord .btn-accion-detalle.rechazar');

  // ESCENARIO 1: APROBAR
  if (btnAceptarDetalle) {
      btnAceptarDetalle.addEventListener('click', () => {
          if (itemActualEnDetalle) {
              alert(`✅ El perfil de "${itemActualEnDetalle.querySelector('.correo-nombre').innerText}" ha sido activado exitosamente.`);
              itemActualEnDetalle.remove();
              cerrarDetalle();
          }
      });
  }

  // ESCENARIO 2: RECHAZAR (Con Modal)
  if (btnRechazarDetalle) {
      btnRechazarDetalle.addEventListener('click', () => {
          if (itemActualEnDetalle) {
              if(spanCantidad) spanCantidad.textContent = "1";
              
              accionConfirmacionPendiente = () => {
                  itemActualEnDetalle.remove(); 
                  cerrarDetalle(); 
              };
              modalRechazo.classList.add('activo');
          }
      });
  }

  // ==========================================
  // 6. ACCIONES MASIVAS (Barra Superior)
  // ==========================================

  const btnRechazarVerifMasivo = document.querySelector('.barra-acciones-coord .boton-accion-coord.rechazar');
  const btnAceptarVerifMasivo = document.querySelector('.barra-acciones-coord .boton-accion-coord.aceptar');

  function eliminarItemsMarcados() {
      const checkboxesMarcados = document.querySelectorAll('#panel-verificacion .correo-checkbox:checked');
      checkboxesMarcados.forEach(checkbox => {
          const tarjeta = checkbox.closest('.tarjeta-correo-item');
          if (tarjeta) tarjeta.remove();
      });
      
      if (itemActualEnDetalle && !document.body.contains(itemActualEnDetalle)) {
          cerrarDetalle();
      }

      const restantes = document.querySelectorAll('#panel-verificacion .tarjeta-correo-item');
      if (restantes.length === 0) {
          mostrarSeccion('panel-verificacion-vacio');
      }
  }

  if (btnRechazarVerifMasivo) {
      btnRechazarVerifMasivo.addEventListener('click', (e) => {
          e.preventDefault();
          const seleccionados = document.querySelectorAll('#panel-verificacion .correo-checkbox:checked').length;

          if (seleccionados === 0) {
              alert("Selecciona al menos un estudiante para rechazar.");
              return;
          }

          if(spanCantidad) spanCantidad.textContent = seleccionados;

          accionConfirmacionPendiente = () => {
              eliminarItemsMarcados();
          };

          modalRechazo.classList.add('activo');
      });
  }

  if (btnAceptarVerifMasivo) {
      btnAceptarVerifMasivo.addEventListener('click', (e) => {
          e.preventDefault();
          const seleccionados = document.querySelectorAll('#panel-verificacion .correo-checkbox:checked').length;
          
          if (seleccionados === 0) {
              alert("Selecciona al menos un estudiante para aceptar.");
              return;
          }

          if(confirm(`¿Deseas validar a los ${seleccionados} estudiantes seleccionados?`)) {
              eliminarItemsMarcados();
              alert("¡Validación exitosa!");
          }
      });
  }

  // ==========================================
  // 7. CONTROL DEL MODAL
  // ==========================================
  
  if (btnConfirmarRechazo) {
      btnConfirmarRechazo.addEventListener('click', () => {
          if (accionConfirmacionPendiente) accionConfirmacionPendiente();
          modalRechazo.classList.remove('activo'); 
          accionConfirmacionPendiente = null; 
      });
  }

  if (btnCancelarModal) {
      btnCancelarModal.addEventListener('click', () => {
          modalRechazo.classList.remove('activo');
          accionConfirmacionPendiente = null;
      });
  }

  // ==========================================
  // 8. LÓGICA DE FILTRO: SECCIÓN VERIFICACIONES (Tu código insertado)
  // ==========================================

  const btnFiltroVerif = document.getElementById('btn-toggle-filtro-verif');
  const menuFiltrosVerif = document.getElementById('menu-filtros-verif');
  const opcionesVerif = document.querySelectorAll('#menu-filtros-verif .opcion-filtro');
  const inputBusquedaVerif = document.getElementById('input-busqueda-verif');

  // Estado del filtro actual
  let filtroVerifActual = 'nombre';

  if (btnFiltroVerif && menuFiltrosVerif) {
      
      // 1. Abrir/Cerrar menú
      btnFiltroVerif.addEventListener('click', (e) => {
          e.stopPropagation();
          menuFiltrosVerif.classList.toggle('activo');
      });

      // 2. Cerrar al hacer clic fuera
      document.addEventListener('click', (e) => {
          if (!menuFiltrosVerif.contains(e.target) && !btnFiltroVerif.contains(e.target)) {
              menuFiltrosVerif.classList.remove('activo');
          }
      });

      // 3. Selección de opciones (Nombre / Código)
      opcionesVerif.forEach(opcion => {
          opcion.addEventListener('click', (e) => {
              // Actualizar variable de estado
              filtroVerifActual = e.target.dataset.tipo;

              // Actualizar visualmente la opción seleccionada (negrita/color)
              opcionesVerif.forEach(op => op.classList.remove('seleccionado'));
              e.target.classList.add('seleccionado');

              // Cambiar el placeholder del input para dar feedback al usuario
              if (filtroVerifActual === 'nombre') {
                  inputBusquedaVerif.placeholder = "Buscar alumno por nombre...";
              } else {
                  inputBusquedaVerif.placeholder = "Buscar alumno por código (ej: u20...)";
              }

              // Cerrar menú
              menuFiltrosVerif.classList.remove('activo');
              
              // Enfocar el input para que escriban de una vez
              if(inputBusquedaVerif) inputBusquedaVerif.focus();
          });
      });
  }

  // ==========================================
  // 9. LÓGICA DE BÚSQUEDA EN TIEMPO REAL (Usa el filtro anterior)
  // ==========================================
  
  if (inputBusquedaVerif) {
      inputBusquedaVerif.addEventListener('input', function() {
          const textoBusqueda = this.value.toLowerCase().trim();
          
          const tarjetas = document.querySelectorAll('.panel-lista-correos .tarjeta-correo-item');

          tarjetas.forEach(tarjeta => {
              const nombreEstudiante = tarjeta.querySelector('.correo-nombre').textContent.toLowerCase();
              // Aquí asumimos que el código podría estar en el texto, aunque en tu HTML actual solo hay nombre y universidad.
              // Buscamos en todo el texto de la tarjeta para cubrir ambos casos de forma sencilla.
              const textoTarjeta = tarjeta.textContent.toLowerCase();

              let hayCoincidencia = false;

              if (filtroVerifActual === 'nombre') {
                  if (nombreEstudiante.includes(textoBusqueda)) hayCoincidencia = true;
              } else {
                  // Filtro por código (busca en todo el contenido de la tarjeta)
                  if (textoTarjeta.includes(textoBusqueda)) hayCoincidencia = true;
              }

              if (hayCoincidencia) {
                  tarjeta.style.display = 'flex'; 
              } else {
                  tarjeta.style.display = 'none'; 
              }
          });
      });
  }

  // ==========================================
  // 10. EXTRAS (CSV, Logout, Notificaciones, Etc)
  // ==========================================

  // Exportar CSV
  const btnExportar = document.getElementById('btn-exportar-csv');
  if (btnExportar) {
      btnExportar.addEventListener('click', (e) => {
          e.preventDefault();
          const originalText = btnExportar.innerHTML;
          btnExportar.innerHTML = 'Descargando...';
          btnExportar.style.opacity = '0.7';
          
          setTimeout(() => {
              const mes = document.getElementById('mes').value;
              const anio = document.getElementById('anio').value;
              const csvContent = `Reporte de Verificados - SkillSwap\nPeriodo: ${mes} ${anio}\n\nNombre,Universidad,Estado,Fecha\nLuis Garcia,UPC,Verificado,12/05/${anio}\nMaria Lopez,U. Lima,Verificado,15/05/${anio}\nCarlos Perez,PUCP,Pendiente,20/05/${anio}`;
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.setAttribute("href", url);
              link.setAttribute("download", `reporte_verificados_${mes}_${anio}.csv`);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              btnExportar.innerHTML = originalText;
              btnExportar.style.opacity = '1';
              alert(`✅ El reporte de ${mes} ${anio} se ha descargado correctamente.`);
          }, 1000);
      });
  }

  // Cerrar Sesión
  const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
  if (btnCerrarSesion) {
      btnCerrarSesion.addEventListener('click', (e) => {
          e.preventDefault();
          const confirmar = confirm("¿Estás seguro de que deseas cerrar sesión?");
          if (confirmar) window.location.href = "./index-login.html";
      });
  }
  
  // Notificaciones Coordinador
  const navNotifCoord = document.getElementById('nav-notificaciones-coord');
  const dropdownNotifCoord = document.getElementById('dropdown-notificaciones-coord');
  const btnInvestigar = document.getElementById('btn-investigar-alerta');

  if (navNotifCoord && dropdownNotifCoord) {
      navNotifCoord.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropdownNotifCoord.classList.toggle('activo');
      });
      document.addEventListener('click', (e) => {
          if (!dropdownNotifCoord.contains(e.target) && !navNotifCoord.contains(e.target)) {
              dropdownNotifCoord.classList.remove('activo');
          }
      });
      dropdownNotifCoord.addEventListener('click', (e) => e.stopPropagation());
  }

  if (btnInvestigar) {
      btnInvestigar.addEventListener('click', (e) => {
          e.preventDefault();
          dropdownNotifCoord.classList.remove('activo');
          mostrarSeccion('panel-reportes');
          alert("Navegando al detalle de reportes de Juan Perez...");
      });
  }

  // Botones "Ver Más" del dashboard
  const btnVerMasVerif = document.getElementById('btn-ver-mas-verificaciones');
  if (btnVerMasVerif) {
      btnVerMasVerif.addEventListener('click', () => mostrarSeccion('panel-verificacion'));
  }
  const btnVerMasRep = document.getElementById('btn-ver-mas-reportes');
  if (btnVerMasRep) {
      btnVerMasRep.addEventListener('click', () => mostrarSeccion('panel-reportes'));
  }

  // Mini Buscador del Dashboard
  const formBusquedaDash = document.getElementById('form-busqueda-dashboard');
  const inputNombreDash = document.getElementById('input-nombre-dash');
  const inputEstudiantesPrincipal = document.getElementById('input-busqueda-estudiantes');
  
  if (formBusquedaDash) {
      formBusquedaDash.addEventListener('submit', (e) => {
          e.preventDefault(); 
          const terminoBusqueda = inputNombreDash.value;
          mostrarSeccion('panel-estudiantes');
          if (inputEstudiantesPrincipal) {
              inputEstudiantesPrincipal.value = terminoBusqueda;
              inputEstudiantesPrincipal.focus();
          }
      });
  }

  // Ojos del dashboard para navegar
  const ojosDashboard = document.querySelectorAll('#panel-dashboard .item-icono-ver');
  ojosDashboard.forEach(ojo => {
      ojo.addEventListener('click', (e) => {
          e.preventDefault();
          const columnaPadre = ojo.closest('.panel-columna');
          const tituloColumna = columnaPadre.querySelector('h2').innerText;
          if (tituloColumna.includes("Verificaciones")) mostrarSeccion('panel-verificacion');
          else if (tituloColumna.includes("Reportes")) mostrarSeccion('panel-reportes');
      });
  });

  // Iniciar en dashboard
  mostrarSeccion('panel-dashboard');
});