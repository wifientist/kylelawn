// Blog posts API - List and Create

// GET /api/blog/posts - List all published posts (or all if authenticated)
export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const showDrafts = url.searchParams.get('drafts') === 'true';

  try {
    // For now, show all posts if drafts=true (add auth check later)
    const query = showDrafts
      ? 'SELECT * FROM blog_posts ORDER BY created_at DESC'
      : 'SELECT * FROM blog_posts WHERE published = 1 ORDER BY created_at DESC';

    const { results } = await env.DB.prepare(query).all();

    // Parse tags from JSON string
    const posts = results.map(post => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
      published: post.published === 1
    }));

    return new Response(JSON.stringify({ posts }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[BLOG] Error fetching posts:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST /api/blog/posts - Create new post
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

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await env.DB.prepare(
      `INSERT INTO blog_posts
       (id, title, slug, content, excerpt, featured_image, category, tags, published, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      title,
      slug,
      content,
      excerpt,
      featured_image || null,
      category,
      JSON.stringify(tags || []),
      published ? 1 : 0,
      now,
      now
    ).run();

    return new Response(JSON.stringify({
      success: true,
      post: { id, slug }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[BLOG] Error creating post:', error);
    return new Response(JSON.stringify({ error: 'Failed to create post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
