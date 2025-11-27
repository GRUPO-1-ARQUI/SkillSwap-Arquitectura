// Función que maneja el inicio de sesión
function validarLogin(event) {
    // 1. Evitar que el formulario recargue la página
    event.preventDefault();

    // 2. Obtener los valores de los campos
    // Usamos .trim() para quitar espacios accidentales al inicio o final
    const usuarioInput = document.getElementById("email").value.trim(); 
    const passwordInput = document.getElementById("password").value.trim();

    // 3. Definir la clave maestra (según el ejemplo de tu profesor)
    const CLAVE_MAESTRA = "ok";

    // 4. Lógica de validación
    if (passwordInput === CLAVE_MAESTRA) {
        
        // A. Verificar si es Coordinador (admin o pcjim)
        // Convertimos a minúsculas para que no importe si escriben "Admin" o "ADMIN"
        const usuario = usuarioInput.toLowerCase();

        if (usuario === "admin" || usuario === "pcjim") {
            alert("¡Bienvenido Coordinador!");
            // Redirección a la carpeta de sitios -> coordinador
            window.location.href = "public/sitios/index-user-coordinador.html";
        } 
        // B. Si no es coordinador, asumimos que es Estudiante
        else {
            alert("¡Bienvenido Estudiante!");
            // Redirección a la carpeta de sitios -> estudiante
            window.location.href = "public/sitios/index-user-estudiante.html";
        }

    } else {
        // C. Contraseña incorrecta
        alert("Contraseña incorrecta. Intenta con 'ok'.");
        // Limpiar el campo de contraseña
        document.getElementById("password").value = "";
    }
}