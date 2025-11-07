// Blog post API - Get, Update, Delete by slug

// GET /api/blog/:slug - Get single post by slug
export async function onRequestGet(context) {
  const { env, params } = context;
  const { slug } = params;

  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM blog_posts WHERE slug = ?'
    ).bind(slug).all();

    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const post = results[0];
    post.tags = post.tags ? JSON.parse(post.tags) : [];
    post.published = post.published === 1;

    // Get associated images
    const { results: images } = await env.DB.prepare(
      'SELECT * FROM blog_images WHERE post_id = ? ORDER BY display_order'
    ).bind(post.id).all();

    return new Response(JSON.stringify({ post, images }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[BLOG] Error fetching post:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// PUT /api/blog/:slug - Update post
export async function onRequestPut(context) {
  const { env, params, request } = context;
  const { slug } = params;

  try {
    // TODO: Add authentication check
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const postData = await request.json();
    const {
      title,
      content,
      excerpt,
      featured_image,
      category,
      tags,
      published
    } = postData;

    const now = new Date().toISOString();

    // Generate new slug if title changed
    const newSlug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    await env.DB.prepare(
      `UPDATE blog_posts
       SET title = ?, slug = ?, content = ?, excerpt = ?,
           featured_image = ?, category = ?, tags = ?,
           published = ?, updated_at = ?
       WHERE slug = ?`
    ).bind(
      title,
      newSlug,
      content,
      excerpt,
      featured_image || null,
      category,
      JSON.stringify(tags || []),
      published ? 1 : 0,
      now,
      slug
    ).run();

    return new Response(JSON.stringify({
      success: true,
      post: { slug: newSlug }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[BLOG] Error updating post:', error);
    return new Response(JSON.stringify({ error: 'Failed to update post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// DELETE /api/blog/:slug - Delete post
export async function onRequestDelete(context) {
  const { env, params, request } = context;
  const { slug } = params;

  try {
    // TODO: Add authentication check
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get post ID first
    const { results } = await env.DB.prepare(
      'SELECT id FROM blog_posts WHERE slug = ?'
    ).bind(slug).all();

    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete post (cascade will delete images)
    await env.DB.prepare(
      'DELETE FROM blog_posts WHERE slug = ?'
    ).bind(slug).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[BLOG] Error deleting post:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
