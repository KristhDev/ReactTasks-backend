# ReactTasks Backend

Este es la **api** para el proyecto **ReactTasks**, una aplicación web para gestionar tareas. Este documento contiene 
explicaciones sobre las tecnologías utilizadas, el entorno de desarrollo, base de datos, cómo ejecutar el servidor y 
test de la aplicación.

## Tecnologías

### 1.1) Express
Es un **popular framework de aplicaciones web para Node.js**, que se utiliza para crear aplicaciones web y servicios web 
basados en el protocolo HTTP. Express es una **capa delgada sobre Node.js y proporciona una amplia gama de características** 
para la creación rápida y fácil de aplicaciones web robustas.

### 1.2) Typescript
Es un lenguaje de programación libre y de código abierto desarrollado y mantenido por Microsoft. Es un **superconjunto 
de JavaScript**, que esencialmente añade tipos estáticos y objetos basados en clases. **Extiende la sintaxis de JavaScript**, 
por tanto, cualquier código JavaScript existente debería funcionar sin problemas.

Soporta **ficheros de definición** que contengan información sobre los tipos de librerías JavaScript existentes, similares 
a los ficheros de cabeceras de C/C++ que describen la estructura de ficheros de objetos existentes. Esto permite a otros 
programas usar los valores definidos en los ficheros como si fueran entidades TypeScript de tipado estático.

### 1.3) MongoDB
MongoDB es un **sistema de base de datos NoSQL**, lo que significa que **no utiliza el modelo relacional tradicional** de las 
bases de datos SQL. En su lugar, MongoDB utiliza un **formato de almacenamiento de documentos JSON** con esquemas dinámicos, 
lo que permite una mayor flexibilidad y escalabilidad en la estructura de los datos. 

MongoDB es conocido por su **capacidad de manejar grandes volúmenes de datos** y su capacidad de escalar horizontalmente a 
través de la distribución en clústeres. Además, ofrece un lenguaje de consulta poderoso y flexible que permite realizar consultas 
complejas y análisis en los datos almacenados.

### 1.4) Mongoose
Mongoose es una **herramienta de modelado de datos** para MongoDB en Node.js. Proporciona una **solución sencilla y basada en 
esquemas** para modelar la aplicación de datos de MongoDB. Mongoose se utiliza comúnmente en aplicaciones Node.js que interactúan 
con bases de datos MongoDB.

Al utilizar Mongoose, los desarrolladores pueden **definir modelos de datos con esquemas** que representan la estructura de 
los documentos en la base de datos MongoDB. Esto proporciona una **capa de abstracción sobre la base de datos**, lo que facilita 
la validación de datos, la definición de relaciones y la manipulación de datos.

### 1.5) JWT
JWT **(JSON Web Token) es un estándar** qué está dentro del documento RFC 7519.

En el mismo se define un **mecanismo para poder propagar entre dos partes**, y de forma segura, la identidad de un 
determinado usuario, además con una serie de claims o privilegios.

Estos **privilegios están codificados en objetos de tipo JSON**, que se incrustan dentro de del payload o cuerpo de un 
mensaje que va firmado digitalmente.

### 1.6) BetterStack Logtail
BetterStack es una **plataforma de desarrollo de software** que ofrece herramientas y servicios para ayudar a los equipos de 
ingeniería y desarrollo a **crear, implementar y administrar aplicaciones web de manera eficiente.** Se centra en ofrecer una serie 
de servicios y productos que cubren diversas áreas del desarrollo de software.

Uno de ellos es **BetterStack Logtail**, un servicio de **recopilación y análisis** de registros (logs) que ayuda a los equipos 
a **rastrear y diagnosticar problemas en las aplicaciones.** Los usuarios pueden enviar de forma sencilla los registros generados 
por sus aplicaciones y sistemas a diferentes destinos de almacenamiento y análisis.

### 1.7) Docker
Una **plataforma de código abierto** que permite la **creación, el despliegue y la ejecución de aplicaciones en contenedores.** Un 
contenedor es una **unidad de software ligera y portátil que encapsula una aplicación** y todas sus dependencias, incluidas bibliotecas, marcos de trabajo y archivos de configuración necesarios para que la **aplicación se ejecute de manera eficiente y 
confiable en diferentes entornos.**

Docker facilita la creación y el despliegue de aplicaciones al proporcionar una forma consistente de empaquetar, distribuir y 
ejecutar software. Además, permite **la gestión eficiente de recursos**, ya que los contenedores son **livianos y comparten el 
núcleo del sistema operativo,** lo que los hace rápidos de crear y lanzar. Docker también **ofrece herramientas para administrar y 
orquestar múltiples contenedores,** como Docker Compose y Kubernetes, que simplifican la gestión de aplicaciones distribuidas y 
escalables.

### 1.8) Jest
Es la **herramienta de Test más popular** y recomendada para React. Es creado por Facebook. Jest no es solo una biblioteca, es un marco de prueba. Significa 
que **viene con una biblioteca de afirmaciones, un corredor de pruebas y soporte** para cosas. Como ha sido diseñado específicamente para probar las 
aplicaciones React, también se puede utilizar en otros marcos de JavaScript.

### 1.9) SuperTest
Supertest es una biblioteca de Node.js que permite **realizar pruebas de integración** para aplicaciones web. Es una **extensión**
de la biblioteca de aserciones de pruebas de Node.js, llamada ```assert```, que proporciona una interfaz para **enviar solicitudes 
HTTP** a una aplicación web y comprobar la respuesta.

Funciona de manera **similar a un cliente HTTP,** pero está diseñada específicamente para pruebas de integración. Permite enviar 
solicitudes HTTP a una aplicación web y comprobar la respuesta de la aplicación.

### 1.10) Enlaces
 * [Express](https://expressjs.com)    
 * [TypeScript](https://www.typescriptlang.org)  
 * [MongoDB](https://www.mongodb.com/es)  
 * [Mongoose](https://mongoosejs.com)  
 * [JWT](https://jwt.io)
 * [BetterStack Logtail](https://betterstack.com/logs)
 * [Docker](https://www.docker.com)
 * [Jest](https://jestjs.io)
 * [SuperTest](https://github.com/ladjs/supertest)

<br>