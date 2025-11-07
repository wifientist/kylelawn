// List all uploaded images

// GET /api/images/list - Get all uploaded images
export async function onRequestGet(context) {
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

    const { results } = await env.DB.prepare(
      'SELECT * FROM uploaded_images ORDER BY created_at DESC'
    ).all();

    return new Response(JSON.stringify({ images: results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[IMAGES] Error fetching images:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch images' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
