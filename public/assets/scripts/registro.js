document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault(); // Evita que el form se envíe automáticamente

  if (this.checkValidity()) {
    // Si el formulario es válido, redirige
    window.location.href = "index-login.html";
  } else {
    // Activa los mensajes nativos del navegador
    this.reportValidity();
  }
});

document.getElementById('email').addEventListener('input', function () {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.pe$/;

    if (!regex.test(this.value)) {
        this.setCustomValidity("El correo debe terminar en .edu.pe");
        } else {
        this.setCustomValidity("");
        }
});
