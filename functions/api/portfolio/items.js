// Portfolio items API - List and Create

// GET /api/portfolio/items - List all portfolio items
export async function onRequestGet(context) {
  const { env } = context;

  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM portfolio_items ORDER BY display_order ASC, created_at DESC'
    ).all();

    const items = results.map(item => ({
      ...item,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      imageUrl: item.image_url,
      displayOrder: item.display_order
    }));

    return new Response(JSON.stringify({ items }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[PORTFOLIO] Error fetching items:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch portfolio items' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST /api/portfolio/items - Create new portfolio item
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

    const itemData = await request.json();
    const { title, subtitle, image_url, display_order } = itemData;

    if (!title || !image_url) {
      return new Response(JSON.stringify({ error: 'Title and image_url are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    console.log('[PORTFOLIO] Creating item:', { title, subtitle });

    await env.DB.prepare(
      `INSERT INTO portfolio_items
       (id, title, subtitle, image_url, display_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      title,
      subtitle || null,
      image_url,
      display_order || 0,
      now,
      now
    ).run();

    console.log('[PORTFOLIO] Item created successfully:', id);

    return new Response(JSON.stringify({
      success: true,
      item: { id }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[PORTFOLIO] Error creating item:', error);
    return new Response(JSON.stringify({ error: 'Failed to create portfolio item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// DELETE /api/portfolio/items/:id - Delete portfolio item
export async function onRequestDelete(context) {
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

    const { id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await env.DB.prepare(
      'DELETE FROM portfolio_items WHERE id = ?'
    ).bind(id).run();

    console.log('[PORTFOLIO] Item deleted:', id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[PORTFOLIO] Error deleting item:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete portfolio item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
