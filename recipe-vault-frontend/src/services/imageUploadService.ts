import axios from 'axios';

interface ImageUploadResponse {
  imageUrl: string;
  message: string;
}

class ImageUploadService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.VUE_APP_API_BASE_URL || 'http://localhost:9000/api';
  }

  async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post<ImageUploadResponse>(
        `${this.baseUrl}/images/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 second timeout for uploads
        }
      );

      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.message || 'Failed to upload image';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to upload image. Please try again.');
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/images`, {
        params: { imageUrl },
        timeout: 10000,
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.message || 'Failed to delete image';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to delete image.');
    }
  }
}

// Create singleton instance
export const imageUploadService = new ImageUploadService();

export default imageUploadService;
