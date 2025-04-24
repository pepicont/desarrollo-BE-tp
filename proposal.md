# Propuesta TP DSW

## Grupo
### Integrantes
* 52479 - Brizio, Augusto
* 52850 - Conti, Stefano
* 53137 - Vitali, Bruno

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
El negocio consiste de un portal de videojuegos donde un usuario luego de iniciar sesión con su cuenta en el sitio podrá acceder al catálogo de los mismos, ampliar sobre los detalles de estos pudiendo visualizar sus requisitos físicos, comentarios, reseñas diversas de otros usuarios, compañía desarrolladora entre otras cosas. A su vez, también podrá acceder a un catálogo de complementos sobre estos videojuegos o membresías mensuales de los canales de streaming del momento. Cualquiera sea el producto al que el usuario desee acceder, este seleccionará el mismo y se le mostrará un código de cupón junto a las instrucciones para poder canjearlo y hacer uso de su producto.

### Modelo

![image](https://github.com/user-attachments/assets/ddb9655b-07e0-4a18-b7b8-e6010fa36a79)


Link: https://drive.google.com/file/d/1Yka-HRDaMmvCM-fxjBVcX36k_-_MT6ZQ/view?usp=sharing


*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Compañía<br>3. CRUD Categoría|
|CRUD dependiente|1. CRUD  Juego {depende de} CRUD Categoría y CRUD Compañía<br>2. CRUD Servicio {depende de} CRUD Categoría y CRUD Compañía <br>3. CRUD Complemento {depende de} CRUD Categoría y CRUD Compañía
|Listado<br>+<br>detalle| 1. Listado de productos filtrado por categoría, compañía, tipo producto, nombre, edad mínima => detalle CRUD Producto <br> 2. Listado de ventas filtrado por rango de fecha, producto, compañía, juego (si es complemento), categoría => detalle muestra datos completos de la reserva y del cliente|
|CUU/Epic|1. Hacer una compra de un producto <br>2. Realizar una reseña sobre una venta|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD Dependiente|1. CRUD Compra {depende de} CRUD Producto y CRUD Usuario<br>2. CRUD Complemento {depende de} CRUD Juego |
|Listado<br>+<br>detalle| 1. Listado Reseña filtrado fecha, producto|
|CUU/Epic|1. Moderar reseña (con API de IA o Librería)<br>2. Realizar compra de un producto (pago, con API (ej: MercadoPago))|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|CRUD Dependiente|1. CRUD Servicio (de streaming) |
|CUU/Epic|1. Subir desafío para desbloquear contenido exclusivo u oculto|


