import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
cloudinary.config({
    cloud_name: 'aca_iria_el_cloudname_de_nuestro_cloudinary', //no subido por cuestiones de seguridad
    api_key: 'aca_iria_el_api_key_de_nuestro_cloudinary',
    api_secret: 'aca_iria_el_api_secret_de_nuestro_cloudinary',
});
// Recorrer fotos-productos/juego, fotos-productos/servicio, fotos-productos/complemento
const baseDir = './fotos-productos';
const categorias = fs.readdirSync(baseDir);
categorias.forEach((categoria) => {
    const categoriaPath = path.join(baseDir, categoria);
    if (fs.statSync(categoriaPath).isDirectory()) {
        const files = fs.readdirSync(categoriaPath);
        files.forEach((file) => {
            const nombreProducto = file.split('.')[0];
            const filePath = path.join(categoriaPath, file);
            cloudinary.uploader.upload(filePath, {
                public_id: nombreProducto,
                folder: `${categoria}`,
            })
                .then((result) => {
                console.log(`Subido ${categoria}/${file}:`, result.secure_url);
            })
                .catch((err) => {
                console.error(`Error subiendo ${categoria}/${file}:`, err);
            });
        });
    }
});
/*Instrucciones para subir imágenes a Cloudinary:
2. dentro de src poner la carpetas fotos-productos/juego, fotos-productos/servicio, fotos-productos/complemento con las imágenes a subir.

(REGLAS PARA NOMBRAR LAS IMÁGENES: nombres todo en minuscula, reemplazar " ", ":" por _
,ignorar "-","'" y reemplazar letra con acento por letra sin)

3. navegar en consola hasta la carpeta backend (cd desarrollo-BE-tp/backend)
4. ejecutar el script con tsc src/api_cloudinary.ts (para compilarlo a js)
5. cambiar el archivo generado .js a .cjs (renombrar src/api_cloudinary.js a src/api_cloudinary.cjs)
6. reemplazar las credenciales de cloudinary.config con las de nuestra cuenta (en el .cjs).
7. ejecutar el script con node src/api_cloudinary.cjs
8 luego de corrido el script, borrar carpeta fotos-productos y el archivo src/api_cloudinary.cjs
9 actualizar el seed para que las contemple*/ 
//# sourceMappingURL=api_cloudinary.js.map