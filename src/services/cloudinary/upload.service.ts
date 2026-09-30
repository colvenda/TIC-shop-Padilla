import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  static async uploadImage(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: 'image', folder: 'tic-shop' }, (error, result) => {
          if (error || !result) {
            reject(error ?? new Error('No se pudo subir la imagen'));
            return;
          }
          resolve(result.secure_url);
        })
        .end(buffer);
    });
  }
}
