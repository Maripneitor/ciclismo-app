// frontend/src/services/imageService.js
export const imageService = {
    // Para desarrollo: placeholder images
    getPlaceholderImage: (width = 800, height = 400) => {
        return `https://via.placeholder.com/${width}x${height}/667eea/ffffff?text=Ciclismo+App`;
    },
    
    // Para producción: subir imágenes reales
    uploadImage: async (file) => {
        // Aquí integrarías con tu servicio de almacenamiento
        // Por ejemplo: Cloudinary, AWS S3, etc.
        const formData = new FormData();
        formData.append('image', file);
        
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            return await response.json();
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    },
    
    // Optimizar imágenes para web
    optimizeImageUrl: (url, options = {}) => {
        const { width = 800, height = 400, quality = 80 } = options;
        // Aquí agregarías parámetros de optimización según tu servicio
        return `${url}?w=${width}&h=${height}&q=${quality}&fit=crop`;
    }
};