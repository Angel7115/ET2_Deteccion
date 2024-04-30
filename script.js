// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function() {
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
          elementId: 'ventilador-image'
        },
        'apaga el ventilador': {
          command: 'img/ventiladorOFF.png',
          elementId: 'ventilador-image'
        },
        'enciende la luz de la recámara': {
          command: 'img/Foco_ON.png',
          elementId: 'recamara-luz-image'
        },
        'apaga la luz de la recámara': {
          command: 'img/Foco_OFF.png',
          elementId: 'recamara-luz-image'
        },
        'enciende la luz de la sala': {
          command: 'img/Foco_ON.png',
          elementId: 'sala-luz-image'
        },
        'apaga la luz de la sala': {
          command: 'img/Foco_OFF.png',
          elementId: 'sala-luz-image'
        },
        'enciende luces del jardín': {
          command: 'img/gardenlamp_ON.png',
          elementId: 'jardin-luz-image'
        },
        'apaga luces del jardín': {
          command: 'img/gardenlamp_OFF.png',
          elementId: 'jardin-luz-image'
        },
        'abre las cortinas': {
          command: 'img/CortinasOPEN.png',
          elementId: 'cortinas-image'
        },
        'cierra las cortinas': {
          command: 'img/CortinasCLOSE.png',
          elementId: 'cortinas-image'
        },
        'activa la alarma': {
          command: 'activa la alarma',
          elementId: 'alarma-image'
        },
        'apaga la alarma': {
          command: 'apaga la alarma',
          elementId: 'alarma-image'
        },
        'enciende las camaras': {
          command: 'img/Camaras_ON.png',
          elementId: 'camaras-image'
        },
        'apaga las camaras': {
          command: 'img/Camaras_OFF.png',
          elementId: 'camaras-image'
        }
        // Agrega aquí los demás comandos y sus imágenes correspondientes
      };

      // Itera sobre las palabras clave para controlar dispositivos
      for (const keyword in deviceKeywords) {
        if (transcript.includes(keyword)) {
          const { command, elementId } = deviceKeywords[keyword];
          console.log(`Se detectó la palabra clave: ${keyword}`);
          console.log(`Comando a ejecutar: ${command}`);
          // Cambiar la imagen del elemento correspondiente
          const element = document.getElementById(elementId);
          if (element) {
            if (elementId === 'alarma-image' && keyword.includes('activa')) {
              // Reproducir el sonido de la alarma
              const audio = new Audio('img/alarm.mp3');
              audio.play();
            } else if (elementId === 'alarma-image' && keyword.includes('apaga')) {
              // Detener el sonido de la alarma
              const audio = new Audio('img/alarm.mp3');
              audio.pause();
              audio.currentTime = 0;
            } else {
              // Cambiar la imagen del dispositivo
              element.src = command;
            }
          }
          enviarOrdenA(mockApiUrl, keyword, command); // Llama a la función para enviar la orden a MockAPI.io
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

//********************************************************* SECCION MOCKAPI */

// Función para enviar la orden aceptada a MockAPI.io
function enviarOrdenA(url, comando, imagen) {
  // Datos de la orden aceptada
  const orden = {
    orden: comando,
    usuario: "Angel",
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
