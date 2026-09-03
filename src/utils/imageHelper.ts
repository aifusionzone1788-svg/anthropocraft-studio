/**
 * Utility to process and compress uploaded image files to safe dimensions
 * so they fit comfortably within local storage without losing detail.
 */
export const compressImageFile = (
  file: File,
  maxWidth = 1200,
  maxHeight = 900,
  quality = 0.85
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not a valid image format.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result !== 'string') {
        reject(new Error('Invalid image result.'));
        return;
      }

      // If svg or gif, keep original dataUrl to preserve vectors or animation
      if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
        resolve(result);
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image in browser.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(result);
          return;
        }

        // Draw image onto canvas with high quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = result;
    };

    reader.readAsDataURL(file);
  });
};
