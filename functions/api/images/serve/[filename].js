// Serve images from R2

// GET /api/images/serve/:filename - Serve image from R2
export async function onRequestGet(context) {
  const { env, params } = context;
  const { filename } = params;

  try {
    const filePath = `images/${filename}`;

    // Get object from R2
    const object = await env.IMAGES.get(filePath);

    if (!object) {
      return new Response('Image not found', { status: 404 });
    }

    // Return image with proper content type
    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata.contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('[IMAGES] Error serving image:', error);
    return new Response('Error loading image', { status: 500 });
  }
}
