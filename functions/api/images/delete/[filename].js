// Delete image from R2 and database

// DELETE /api/images/delete/:filename - Delete image
export async function onRequestDelete(context) {
  const { env, params, request } = context;
  const { filename } = params;

  try {
    // Check auth
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete from R2
    const filePath = `images/${filename}`;
    await env.IMAGES.delete(filePath);

    // Delete from database
    await env.DB.prepare(
      'DELETE FROM uploaded_images WHERE filename = ?'
    ).bind(filename).run();

    // Also delete any blog_images references
    await env.DB.prepare(
      'DELETE FROM blog_images WHERE image_url LIKE ?'
    ).bind(`%${filename}%`).run();

    console.log('[IMAGES] Deleted:', filename);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[IMAGES] Error deleting image:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
