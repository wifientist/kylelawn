// Image upload to R2

// POST /api/images/upload - Upload image to R2
export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    // TODO: Add authentication check
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const formData = await request.formData();
    const file = formData.get('image');
    const postId = formData.get('postId');
    const caption = formData.get('caption') || '';

    if (!file) {
      return new Response(JSON.stringify({ error: 'No image provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;
    const filePath = `images/${fileName}`;

    // Upload to R2
    await env.IMAGES.put(filePath, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // For local dev, serve via special endpoint
    // For production, configure R2 public URL
    const isLocal = !env.CF_PAGES;
    const imageUrl = isLocal
      ? `/api/images/serve/${fileName}`
      : `https://pub-${env.R2_PUBLIC_ID}.r2.dev/${filePath}`;

    console.log('[IMAGES] Uploaded:', fileName, '→', imageUrl, '(local:', isLocal, ')');

    // If postId provided, save to database
    if (postId) {
      const imageId = crypto.randomUUID();
      const now = new Date().toISOString();

      await env.DB.prepare(
        `INSERT INTO blog_images (id, post_id, image_url, caption, created_at)
         VALUES (?, ?, ?, ?, ?)`
      ).bind(imageId, postId, imageUrl, caption, now).run();
    }

    return new Response(JSON.stringify({
      success: true,
      imageUrl,
      fileName
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[IMAGES] Error uploading image:', error);
    return new Response(JSON.stringify({ error: 'Failed to upload image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
