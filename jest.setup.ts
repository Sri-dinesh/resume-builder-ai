import '@testing-library/jest-dom'
import 'whatwg-fetch'

if (!Response.json) {
  Response.json = (body, init) => {
    const headers = new Headers(init?.headers);
    headers.set('Content-Type', 'application/json');
    return new Response(JSON.stringify(body), { ...init, headers });
  };
}
