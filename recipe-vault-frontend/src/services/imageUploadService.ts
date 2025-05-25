import { apiService } from './api';

interface ImageUploadResponse {
  imageUrl: string;
  message: string;
}

class ImageUploadService {
  async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Use apiService instead of raw axios - this includes auth headers automatically
      const response = await apiService.post<ImageUploadResponse>(
        '/images/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        }
      );

      return response.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image. Please try again.');
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Use apiService instead of raw axios
      await apiService.delete('/images', {
        params: { imageUrl },
        timeout: 10000,
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image.');
    }
  }
}

export const imageUploadService = new ImageUploadService();
export default imageUploadService;
