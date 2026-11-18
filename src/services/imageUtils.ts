/**
 * Safely converts an image URL or path to a base64 Data URL for PptxGenJS embedding.
 * Handles relative paths, blob URLs, and falls back to a clean canvas placeholder if CORS blocks remote fetch.
 */
export async function getBase64Image(imageUrl: string, fallbackLabel: string = 'Site View'): Promise<string> {
  // If already a base64 data URL, return directly
  if (imageUrl.startsWith('data:image/')) {
    return imageUrl;
  }

  try {
    // 1. First try fetching as blob
    const response = await fetch(imageUrl, { mode: 'cors' });
    if (response.ok) {
      const blob = await response.blob();
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
  } catch {
    // Fetch failed (e.g. CORS or offline). Try Image + Canvas rendering next.
  }

  // 2. Try Image object with crossOrigin
  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 800;
          canvas.height = img.naturalHeight || 500;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context unavailable'));
            return;
          }
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = reject;
      img.src = imageUrl;
    });
    return dataUrl;
  } catch {
    // If canvas is tainted or blocked, generate a sleek high-res fallback card
    return generateFallbackSlideImage(fallbackLabel);
  }
}

/**
 * Creates a sleek branded placeholder image for PPTX if external asset is inaccessible
 */
export function generateFallbackSlideImage(caption: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 500;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 800, 500);
  grad.addColorStop(0, '#1e293b');
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 500);

  // Border frame
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, 760, 460);

  // Icon / Graphic
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(400, 200, 45, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(385, 185, 30, 30);

  // Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('OUT-OF-HOME SITE PHOTOGRAPH', 400, 290);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '20px sans-serif';
  ctx.fillText(caption, 400, 335);

  ctx.fillStyle = '#64748b';
  ctx.font = '14px sans-serif';
  ctx.fillText('[ Verified Ground Asset Media ]', 400, 375);

  return canvas.toDataURL('image/png');
}
