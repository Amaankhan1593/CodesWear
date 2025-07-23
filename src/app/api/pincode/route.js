


export async function GET() {
    const pincode = [110001, 560001, 400001];
    return new Response(JSON.stringify({ serviceablePincodes: pincode }), {
      status: 200,
    });
  }
  