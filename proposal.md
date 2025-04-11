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
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Compañía<br>3. CRUD Categoría|
|CRUD dependiente|1. CRUD  Producto {depende de} CRUD Categorìa y CRUD Compañía<br>2. CRUD Venta {depende de} CRUD Producto y CRUD Usuario <br>CRUD de Reseña {depende de} CRUD Venta<br>CRUD Compra {depende de} CRUD Producto (posible)|
|Listado<br>+<br>detalle| 1. Listado de productos filtrado por categoría, compañía, tipo producto, nombre, edad mínima => detalle CRUD Producto <br> 2. Listado de ventas filtrado por rango de fecha, (lo dejé acá)ión, fecha inicio y fin estadía, estado y nombre del cliente => detalle muestra datos completos de la reserva y del cliente|
|CUU/Epic|1. Hacer una compra de un producto<br>2. Realizar una reseña sobre una venta<br>3.Moderar reseña (con API de IA o Libreriía)<br>4. Realizar compra de un producto (sin api, stock iliimitado para comprar)<br>5. Subir desafío para desbloquear contenido exclusivo u oculto|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo Habitacion<br>2. CRUD Servicio<br>3. CRUD Localidad<br>4. CRUD Provincia<br>5. CRUD Habitación<br>6. CRUD Empleado<br>7. CRUD Cliente|
|CUU/Epic|1. Reservar una habitación para la estadía<br>2. Realizar el check-in de una reserva<br>3. Realizar el check-out y facturación de estadía y servicios|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

