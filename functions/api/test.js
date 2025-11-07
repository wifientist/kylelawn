// Simple test function
export async function onRequestGet() {
  return new Response(JSON.stringify({ message: 'Functions are working!' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
