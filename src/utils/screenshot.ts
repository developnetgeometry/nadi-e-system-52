
import html2canvas from 'html2canvas';

export const takeScreenshot = async (elementId: string, filename: string = 'screenshot.png'): Promise<string | null> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with ID "${elementId}" not found.`);
      return null;
    }

    const canvas = await html2canvas(element, {
      backgroundColor: null,
      logging: false,
      useCORS: true,
      scale: 2, // Higher quality
    });

    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/png');
    
    // Create download link
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
    
    return dataUrl;
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    return null;
  }
};

// Function to share screenshot
export const shareScreenshot = async (elementId: string, title: string = 'Screenshot'): Promise<boolean> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with ID "${elementId}" not found.`);
      return false;
    }

    const canvas = await html2canvas(element, {
      backgroundColor: null,
      logging: false,
      useCORS: true,
      scale: 2,
    });

    // Convert to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob as Blob);
      }, 'image/png');
    });

    // Check if Web Share API is supported
    if (navigator.share) {
      await navigator.share({
        title,
        files: [new File([blob], 'screenshot.png', { type: 'image/png' })],
      });
      return true;
    } else {
      // Fallback to download if sharing is not supported
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'screenshot.png';
      link.click();
      return true;
    }
  } catch (error) {
    console.error('Error sharing screenshot:', error);
    return false;
  }
};
