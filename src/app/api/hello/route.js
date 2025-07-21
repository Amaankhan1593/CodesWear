
// src/app/api/getproducts/route.js

export async function GET(request) {
  return new Response(JSON.stringify({ name: 'John Doe' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
