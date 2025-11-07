// Cloudflare Pages Function for authentication
interface Env {
  ADMIN_PASSWORD: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    const { password } = await request.json() as { password: string };

    // Simple password check - in production, use proper password hashing
    if (password === env.ADMIN_PASSWORD) {
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

    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Bad request' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
