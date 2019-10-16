# sofifa-psx-react
Sofifa stats scrapper to **convert** into **mcr psx** for WE2002


# ¿De que se trata la herramienta?
Es una herramienta que automatiza todo el proceso de obtención de datos de [sofifa.com](https://sofifa.com/). y la conversión de los mismos al formato de **.MCR**

Como todos lo sabrán, hacer las **.MCR** es algo relativamente fácil pero muy tardado y eso hace que se pueda convertir en algo tedioso. Fue entonces que con toda la experiencia del equipo y con las tools y tutoriales que vienen en el SuperPack de edición, me hizo darme cuenta que podía mejorar este proceso, en especial por los grandes aportes que **Polipoli** hizo.



# ¿Como es el proceso?
Se hace **scraping** en la pagina de [sofifa.com](https://sofifa.com/) para obtener todas las **stats de los jugadores**, luego se **convierten mediante las formulas de Polipoli** y que ahora estan escritas en **Javascript.** Después de convertir los datos a los valores que una **.MCR** debe tener, se envía toda esa información a un **server** que crear el archivo **.MCR** y lo regresa para ser descargado.

  
## ¿Como fue construido?
- **Javascript:** [Javascript](https://developer.mozilla.org/es/docs/Web/JavaScript).  ya que es una web app. Se utilizó para todo el backend y frontend.

- **React:** [React](https://es.reactjs.org/). para todo el UI que esta hecho hasta el momento.

- **Node JS:** [NodeJs](https://nodejs.org/es/). necesario para echar a andar este show. El server esta hecho con las librerias de Express.

- **Netlify:**  aqui se deploya el sitio para poder ser usado por todos. 
Nota: se puede usar en `Localhost` de tu computadora o en tu hosting si soporta `Node JS`

- **Heroku:**  [Heroku](https://www.heroku.com/) aqui se levanta el servidor para poder descargar el archivo **.MCR**

- **GitHub:** [GitHub](https://github.com/Darkensses/sofifa-psx-react) epositiorio del proyecto. El proyecto es open source


**Notas:**
- [x] Todas las estadisticas son recolectadas por [sofifa.com](https://sofifa.com/), por favor denle soporte y apoyo
- [x] La tool depende de las actualizaciones de sofifa, por lo que puede haber fallos.
- [x] Si hay **fallos** por favor dejen un issue en el repositorio de **GitHub**
- [ ] Por la ultima actualización de **sofifa**, la carga de jugadores está algo lenta. Se paciente Very Happy
- [x] En **dispositivos móviles** es necesario **activar** la opción de sitio de escritorio.
- [ ] Tambien puedes descargar un csv con toda la info en mcr.



## Instalando la App de conversion

1. Debes de Clonar el Repositorio de Github:

        $ git@github.com:Darkensses/sofifa-psx-react.git

2. Debes de hacer la instalacion:

        $ npm install


3. debes de `start` iniciar la Aplicacion en web server:

        $ npm start

   Run with `start` la app.

4. Go to `http://localhost:3000` y observaras en:

![Texto alternativo](https://i.ibb.co/tKR4Z1L/localhost.png)


## Contribuciones, ayudas y agradecimientos:
Todo el equipo de **MexWE por su trabajo**

- [x] @joshmx_15
- [x] @ramonpsx
- [x] @Frank y Benja
- [x] @Darkensses
- [x] @DiegoPino
- [x] @PoliPoli


## Code Status
[![Build Status](https://badge.buildkite.com/ab1152b6a1f6a61d3ea4ec5b3eece8d4c2b830998459c75352.svg?branch=master)](https://buildkite.com/)

- Aca van el estado del codigo, (alfa,beta, Relase Candidato, Version1... etc) por ahora esta en desarrollo

## License
Aunque es OpenSource es bueno definir la licencia, pero eso si lo define @Darkensses y el equipo de **MexWE**, ejemplo:

 is released under the [MIT License](https://opensource.org/licenses/MIT).
 
 ## Web Referencias:
Cual es la Pagina de MexWe?. Gracias **MexWE por su trabajo**

- [x] [Darkensses](https://darkensses.me/)
- [x] [ZonaWe](http://zonawe.forosactivos.net/)
- [x] [Winning Eleven](https://winningeleven-games.com/)
- [x] [Facebook Group WE2002 Rom Hacking](https://www.facebook.com/groups/365322350532665/)



