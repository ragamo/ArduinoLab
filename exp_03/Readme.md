Activando un ventilador a través de Twitter utilizando un Arduino Yún con NodeJS incorporado
============================================================================================

Objetivos
---------

El objetivo del experimento es encender o apagar un ventilador conectado a la corriente (220V) al enviar un twit con un respectivo hashtag, en este caso #trokkOn y #trokkOff.


Explicación
-----------

La idea es la siguiente, instalar NodeJS en el procesador Atheros del Arduino Yún el cual corre una distribución liviana de Linux llamada Linino (http://www.linino.org/). Esto para crear una rutina en JavaScript que conecte con Twitter y extraiga información desde las búsquedas. El script responderá imprimiendo ON u OFF en caso de encontrar alguno de los hashtags mencionados. El Arduino consultará a este proceso periódicamente para establecer que compuerta (PIN) debe activar o desactivar. Utilizando un Relay Shield (http://www.olimex.cl/product_info.php?products_id=1097) abriremos la compuerta de un relé para encender un ventilador.


Diagramación
------------
![Diagrama eléctrico](http://haack.cl/downloads/diagramaElectrico.jpg "Diagrama eéctrico")


Programación
------------

Para instalar NodeJS en el Yún seguir estas instrucciones: https://github.com/ragamo/NodeJSforArduino


### JavaScript

Crearemos una rutina JS que nos permita recuperar los hashtags desde Twitter. Para ello usamos la librería OAuth2 (https://npmjs.org/package/oauth) que se puede obtener con 

	$ npm install oauth

Además utilizaremos un archivo de texto para guardar algunos datos.
query: cambiará entre #trokkOn y #trokkOff de acuerdo al estado que presente switchFlag para cambiar el endpoint de la búsqueda.
switchFlag: registra el estado que define la salida entre ON y OFF.
Declaramos un objeto “core” para encapsular los métodos y definimos algunas variables iniciales

	var core = {
		fileData: {
		    query: '#trokkOn',
		    flagTrock: false,
		    lastTweets: [1]
		},
		...

En resumen: leemos data.txt para obtener los últimos valores almacenados, buscamos en twitter si hay respuesta contraria al estado actual de switchFlag, almacenamos los valores e imprimimos el estado.

	...
	process: function() {
	    core.readFile(function(data) {
	        core.fileData = data;
	        core.request(function(status) {
	             if(core.fileData.flagTrock) {
	                console.log('ON');
	                core.fileData.flagTrock = false;
	                core.fileData.query = "#trokkOn";
	                
	            } else {
	                console.log('OFF');
	                core.fileData.flagTrock = true;
	                core.fileData.query = "#trokkOff";
	            }

	            if(status) core.writeFile(core.fileData);
	        });
	    });
	}
	...

El código completo es el siguiente https://github.com/ragamo/ArduinoLab/blob/master/exp_03/linino/index.js

El archivo lo copias al Arduino con el siguiente comando

	$ scp index.js root@arduinoIP:/node


### Arduino Sketch

El Arduino ejecutará el proceso anterior cada 5 segundos por medio de la interfaz Bridge. En caso de que responda con ON activaremos el PIN A0 el cual, conectado al Ralay Shield, cerrará el circuito de corriente alterna.
El código es el siguiente.
Declaramos algunos setups iniciales

	...code setup…

El proceso “node” se ejecuta cada 5 siempre y cuando no esté trabajando

	...code loop...

Leemos la respuesta de la siguiente forma y trabajamos con ella

	...code runNode...

El código completo es el siguiente https://github.com/ragamo/ArduinoLab/blob/master/exp_03/sketch/sketch.ino
