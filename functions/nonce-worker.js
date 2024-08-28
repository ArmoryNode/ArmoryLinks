addEventListener('fetch', event => event.respondWith(handleRequest(event.request)));

/**
 * 
 * @param {Request} request 
 */
async function handleRequest(request) {
    const nonce = crypto.generateUUID();

    const response = await fetch(request);
    let html = await response.text();

    const cspNonceHeader = `
        script-src 'self' 'nonce-${nonce}';
        style-src 'self' 'nonce-${nonce}';
    `;

    html = html.replace('<script nonce="">', `<script nonce="${nonce}">`);
    html = html.replace('<style nonce="">', `<style nonce="${nonce}">`);
    
    const newResponse = new Response(html, response);
    request.headers.append('Content-Security-Policy', cspNonceHeader);

    return newResponse;
}
