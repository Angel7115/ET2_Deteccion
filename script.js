// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function() {

// Obtener el valor del parámetro 'usuario' de la URL
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const usuario = getParameterByName('usuario');
console.log('Usuario:', usuario);


  // Agrega un evento click al botón de voz
  document.getElementById('voice-btn').addEventListener('click', function() {
    // Inicializa el objeto de reconocimiento de voz
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'es-ES'; // Establece el idioma del reconocimiento de voz

    // Callback que se ejecuta cuando se detecta una transcripción de voz
    recognition.onresult = function(event) {
      // Obtiene la transcripción de voz
      const transcript = event.results[0][0].transcript.toLowerCase(); // Convierte el texto a minúsculas para facilitar la comparación

      // Palabras clave para controlar dispositivos
      const deviceKeywords = {
        'enciende el ventilador': {
          command: 'img/ventiladorON.gif',
          className: 'ventilador-image'
        },
        'apaga el ventilador': {
          command: 'img/ventiladorOFF.png',
          className: 'ventilador-image'
        },
        'enciende la luz de la recámara': {
          command: 'img/Foco_ON.png',
          className: 'recamara-luz-image'
        },
        'apaga la luz de la recámara': {
          command: 'img/Foco_OFF.png',
          className: 'recamara-luz-image'
        },
        'enciende la luz de la sala': {
          command: 'img/Foco_ON.png',
          className: 'sala-luz-image'
        },
        'apaga la luz de la sala': {
          command: 'img/Foco_OFF.png',
          className: 'sala-luz-image'
        },
        'enciende luces del jardín': {
          command: 'img/gardenlamp_ON.png',
          className: 'gardenlamp-image' // Clase específica para las gardenlamp
        },
        'apaga luces del jardín': {
          command: 'img/gardenlamp_OFF.png',
          className: 'gardenlamp-image' // Clase específica para las gardenlamp
        },
        'abre las cortinas': {
          command: 'img/CortinasOPEN.png',
          className: 'cortinas-image' // Clase específica para las cortinas
        },
        'cierra las cortinas': {
          command: 'img/CortinasCLOSE.png',
          className: 'cortinas-image' // Clase específica para las cortinas
        },
        'enciende las cámaras': {
          command: 'img/Camaras_ON.png',
          className: 'camaras-image' // Clase específica para las cámaras
        },
        'apaga las cámaras': {
          command: 'img/Camaras_OFF.png',
          className: 'camaras-image' // Clase específica para las cámaras
        },
        'activa la alarma': {
          command: 'activa la alarma ',
          className: 'alarma-image'
        },
        'apaga la alarma': {
          command: 'apaga la alarma',
          className: 'alarma-image'
        }
      };

      // Itera sobre las palabras clave para controlar dispositivos
      for (const keyword in deviceKeywords) {
        if (transcript.includes(keyword)) {
          const { command, className } = deviceKeywords[keyword];
          console.log(`Se detectó la palabra clave: ${keyword}`);
          console.log(`Comando a ejecutar: ${command}`);

          // Seleccionar y cambiar el estado de las imágenes específicas
          const elements = document.getElementsByClassName(className);
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (className === 'alarma-image') {
              // Controlar la alarma
              controlarAlarma(command);
            } else {
              // Cambiar la imagen del dispositivo
              element.src = command;
            }
          }

          enviarOrdenA(mockApiUrl, keyword, command, usuario); // Llama a la función para enviar la orden a MockAPI.io
          return; // Sal del bucle una vez que se ha encontrado una coincidencia
        }
      }

      // Mensaje para comandos no reconocidos
      console.log('Comando no reconocido');
    };

    // Callback que se ejecuta cuando hay un error en el reconocimiento de voz
    recognition.onerror = function(event) {
      console.error('Error de reconocimiento de voz: ' + event.error); // Muestra un mensaje de error en la consola
    };

    // Inicia el reconocimiento de voz
    recognition.start();
  });
});

// Función para controlar la alarma
function controlarAlarma(command) {
  const alarmSound = new Audio('img/alarm.mp3');
  if (command === 'activa la alarma') {
    // Activar la alarma y reproducir el sonido
    
    alarmSound.play();
  } else if (command === 'apaga la alarma') {
    // Desactivar la alarma y detener el sonido
    alarmSound.pause();
    alarmSound.currentTime = 0;
  }
}

// Función para enviar la orden aceptada a MockAPI.io
function enviarOrdenA(url, comando, imagen, usuario) {
  // Datos de la orden aceptada
  const orden = {
    orden: comando,
    usuario: usuario,
    fecha: new Date().toLocaleDateString(),
    hora: new Date().toLocaleTimeString()
  };

  // Configuración de la solicitud
  const opciones = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orden)
  };

  // Realizar la solicitud POST a MockAPI.io
  fetch(url, opciones)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al enviar la orden a MockAPI.io');
      }
      return response.json();
    })
    .then(data => {
      console.log('Orden enviada correctamente a MockAPI.io:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// URL de tu recurso en MockAPI.io
const mockApiUrl = 'https://662f708a43b6a7dce30f7eff.mockapi.io/ordenCasa';
