/** Server-only test gateway; provider and engine secrets never enter the browser bundle. */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/artwork/')) return env.ASSETS.fetch(request);
    const json = (body, status = 200) => Response.json(body, {status, headers:{'Cache-Control':'no-store'}});
    if (url.pathname === '/api/artwork/readiness' && request.method === 'GET') {
      if (!env.ARTWORK_ENGINE_URL || !env.ENGINE_AUTH_TOKEN || !env.TEST_ACCESS_TOKEN) return json({ready:false, reason:'Artwork Engine test connection is not configured.'});
      try {
        const response = await fetch(new URL('/v1/readiness', env.ARTWORK_ENGINE_URL), {headers:{'X-Engine-Token':env.ENGINE_AUTH_TOKEN}});
        if (!response.ok) return json({ready:false,reason:'Artwork Engine is unavailable.'});
        const state = await response.json();
        return json({ready:state.ready === true,reason:state.ready?'Ready for limited artwork testing.':'Artwork Engine requires provider configuration.'});
      } catch {return json({ready:false,reason:'Artwork Engine is unreachable.'});}
    }
    const key = request.headers.get('X-Test-Access');
    if (!env.ARTWORK_ENGINE_URL || !env.ENGINE_AUTH_TOKEN || !env.TEST_ACCESS_TOKEN) return json({error:'Artwork test connection is not configured.'},503);
    if (!key || key !== env.TEST_ACCESS_TOKEN) return json({error:'Test access code is invalid.'},403);
    const route = url.pathname.slice('/api/artwork'.length);
    if (!/^\/jobs(?:\/[a-f0-9]{32}(?:\/masters\/(?:front|back))?)?$/.test(route)) return json({error:'Unknown artwork route.'},404);
    if (request.method !== 'GET' && request.method !== 'POST') return json({error:'Unsupported method.'},405);
    const headers = {'X-Engine-Token':env.ENGINE_AUTH_TOKEN,'X-User-Id':'limited-test-user'};
    let body;
    if (request.method === 'POST') {
      if (route !== '/jobs') return json({error:'Unsupported operation.'},405);
      if (Number(request.headers.get('content-length')||0)>14*1024*1024) return json({error:'Image is too large.'},413);
      let payload;try {payload=await request.json();}catch {return json({error:'Invalid job request.'},422);}
      if (!payload || !['professional','high','low'].includes(payload.quality_mode) || typeof payload.reference_image_b64 !== 'string' || payload.reference_image_b64.length>14*1024*1024) return json({error:'Invalid job request.'},422);
      body=JSON.stringify({project_id:'limited-test-project',quality_mode:payload.quality_mode,reference_image_b64:payload.reference_image_b64,production_authorization:env.TEST_ACCESS_TOKEN,customer_price_usd:{professional:.70,high:.50,low:.35}[payload.quality_mode]});
      headers['Content-Type']='application/json';headers['Idempotency-Key']=crypto.randomUUID();
    }
    try {
      const response=await fetch(new URL(`/v1${route}`,env.ARTWORK_ENGINE_URL),{method:request.method,headers,body});
      const output=new Headers(response.headers);output.set('Cache-Control','private, no-store');output.delete('set-cookie');
      return new Response(response.body,{status:response.status,headers:output});
    } catch {return json({error:'Artwork Engine is unreachable.'},502);}
  }
};
