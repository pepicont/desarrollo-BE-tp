import { v2 as cloudinary } from "cloudinary";

<<<<<<< HEAD
if (process.env.NODE_ENV === 'production') {
  cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}
=======
// Verificar que las variables de entorno estén configuradas
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ ERROR: Variables de entorno de Cloudinary no configuradas');
  console.error('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✓ Configurado' : '✗ Falta');
  console.error('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✓ Configurado' : '✗ Falta');
  console.error('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✓ Configurado' : '✗ Falta');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
>>>>>>> 653f3c8730768d53ca097b12ac1a9c3f8beef8a7

export { cloudinary };