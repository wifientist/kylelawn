// Image alignment helper - Returns image URLs for manual processing
// Note: Cloudflare Workers doesn't support server-side image processing without additional services.
// Users should resize images using external tools (ImageMagick, GIMP, Photopea) before uploading.

export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    // Check auth
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { beforeImageName, afterImageName, width, height } = await request.json();

    if (!beforeImageName || !afterImageName) {
      return new Response(JSON.stringify({ error: 'Both image names are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if both images exist in R2
    const beforeObj = await env.IMAGES.get(`images/${beforeImageName}`);
    const afterObj = await env.IMAGES.get(`images/${afterImageName}`);

    if (!beforeObj || !afterObj) {
      return new Response(JSON.stringify({ error: 'One or both images not found in storage' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate URLs for the existing images
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const beforeUrl = `${baseUrl}/api/images/serve/${beforeImageName}`;
    const afterUrl = `${baseUrl}/api/images/serve/${afterImageName}`;

    console.log('[ALIGN] Returning image URLs for manual processing:', { beforeUrl, afterUrl, width, height });

    // Return the URLs with recommended dimensions
    return new Response(JSON.stringify({
      success: true,
      message: 'Please download these images, resize them to the same dimensions using an image editor, then re-upload them.',
      recommendedDimensions: {
        width: width || 1200,
        height: height || 800
      },
      beforeImage: {
        url: beforeUrl,
        filename: beforeImageName
      },
      afterImage: {
        url: afterUrl,
        filename: afterImageName
      },
      instructions: [
        '1. Download both images using the URLs above',
        `2. Resize both to ${width || 1200}x${height || 800}px using ImageMagick, GIMP, or Photopea`,
        '3. Re-upload the resized images',
        '4. Use the new URLs in your comparison syntax'
      ]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[ALIGN] Error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to process request',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
