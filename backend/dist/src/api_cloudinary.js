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
//# sourceMappingURL=api_cloudinary.js.map