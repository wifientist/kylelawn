// Cloudflare Pages Function for authentication

export async function onRequestPost(context) {
  const { request, env } = context;

  console.log('[AUTH] Login attempt received');
  console.log('[AUTH] ADMIN_PASSWORD is set:', !!env.ADMIN_PASSWORD);
  console.log('[AUTH] ADMIN_PASSWORD length:', env.ADMIN_PASSWORD?.length || 0);

  try {
    const { password } = await request.json();

    console.log('[AUTH] Received password length:', password?.length || 0);

    // Simple password check - in production, use proper password hashing
    if (password === env.ADMIN_PASSWORD) {
      console.log('[AUTH] Login successful');
      // Generate a simple token (in production, use JWT or similar)
      const token = btoa(JSON.stringify({
        authenticated: true,
        timestamp: Date.now()
      }));

      return new Response(JSON.stringify({ token }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    console.log('[AUTH] Login failed - password mismatch');
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[AUTH] Error processing login:', error);
    return new Response(JSON.stringify({ error: 'Bad request' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
