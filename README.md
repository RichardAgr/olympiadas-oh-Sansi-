# Olimpiadas ¡oh sansi!
Proyecto para las olimpiadas de la Universidad Mayor de San Simon 2025

Este proyecto esta construido con [React.js](https://react.dev/learn) y [Laravel 8](https://laravel.com/api/8.x/)
## Requerimientos
Estos son los Requerimientos para trabajar con el Proyecto, asi como el orden para instalarlos.
- Un servidor PHP y MySQL, [Wamp](https://sourceforge.net/projects/wampserver/) o [Xampp](https://www.apachefriends.org/es/download.html)
- La version especifica de PHP 7.4.22
- [Node JS](https://nodejs.org/dist/v20.9.0/node-v20.9.0-x64.msi)
- [Composer](https://getcomposer.org/Composer-Setup.exe)
- Algún editor de texto o IDE, [Visual Studio Code](https://code.visualstudio.com/download) es recomendado

### Instalacion de Xampp
Simplemente es instalar el ejecutable y seguir los pasos. Para instalar  la version especifica solo es descargar la version especifica e instalarla.
### Instalacion de NodeJs
Simplemente es instalar el ejecutable y seguir los pasos.
### Instalacion de Composer
Es necesario tener antes el Wamp o el Xammp instalados, tambien es instalar el ejecutable y seguir los pasos.
### Instalacion de npm

## Ejecucion del Proyecto
Una vez clonado el proyecto, debemos abrir visual studio code y abrir la carpeta del proyecto.
Tenemos dos carpetas para el proyecto:
- **Backend**: Esta carpeta contiene el proyecto de Laravel
- **Frontend**: Esta carpeta contiene el proyecto de React.js
  
Es necesario saber identificar que el directorio en el que estas es el correcto, antes de Ejecutar los comandos.
Lo recomendable es que tengas dos terminales abiertas, una para el Backend y otra para el Frontend.
Los comandos para navegar entre directorios son:
```
cd <nombre de la carpeta> (para entrar al directorio seleccionado) 
cd .. (para salir del directorio actual e ir atrás)
```
### Ejecucion del Backend


Primero, dentro de la carpeta backend, ejecutamos el siguiente comando:
```
composer install
```

Luego, debemos configurar adecuadamente el archivo .env, para ello, debemos copiar el archivo .env.example y renombrarlo a .env. Normalmente ya deberia poseer todo para correr, lo unico que falta seria la APP_KEY, para ello, ejecutamos el siguiente comando:
```
php artisan key:generate
```
Luego, debemos crear la base de datos, para ello, abrimos el Xampp y nos dirigimos a la opcion de phpMyAdmin, una vez dentro, creamos una base de datos con el nombre que queramos, pero debemos asegurarnos que el nombre de la base de datos sea el mismo que el que pusimos en el archivo .env en la variable DB_DATABASE en el .env.


Esto instalará todas las dependencias necesarias para el proyecto.
Luego ejecutamos el siguiente comando:
```
php artisan migrate
```
Esto creará las tablas necesarias para el proyecto, y cada vez que se haga un cambio en las tablas, se debe ejecutar este comando para que se actualicen los cambios.


Si todo esta bien, ejecutamos el siguiente comando:
```
php artisan serve
```
Esto iniciará el servidor de Laravel, y si todo esta bien, deberiamos poder acceder a la pagina de inicio de Laravel, que es la que aparecera en la consola.

### Ejecucion del Frontend
Dentro de la carpeta frontend, ejecutamos el siguiente comando:
```
npm install
```
Esto instalará todas las dependencias necesarias para el proyecto.
Luego ejecutamos el siguiente comando:
```
npm run dev
o
npm start
```
Esto iniciará el servidor de React.js, y si todo esta bien, deberiamos poder acceder a la pagina de inicio de React.js, que es la que aparecera en la consola, el cual se obtiene del proyecto del backend.

