/**
 * Injects `nonce` attribute into script and style tags to enable CSP.
 * @param {import("@cloudflare/workers-types/experimental").EventContext} context
 */
export async function onRequest(context) {

    /**
     * @type {Response}
     */
    const response = await context.next();
    const nonce = crypto.randomUUID();

    let html = await response.text();

    // Add nonce to script and style tags that require it
    html = html.replace(/<script(.*?)>/g, `<script$1 nonce="${nonce}">`);
    html = html.replace(/<style>(.*?)>/g, `<style$1 nonce="${nonce}">`);
    
    const newResponse = new Response(html, response);

    const cspHeader = response.headers.get('Content-Security-Policy');
    const newCSPHeader = addNonceToCSPHeader(cspHeader, nonce);

    newResponse.headers.set('Content-Security-Policy', newCSPHeader);

    return newResponse;
}

/**
 * Adds a nonce to a CSP header
 * @param {string} cspHeader 
 * @param {string} nonce 
 * @returns {string}
 */
function addNonceToCSPHeader(cspHeader, nonce) {
    const csp = cspHeader.split(';');
    return csp.map((directive) => {
        if (directive.includes('script-src') || directive.includes('style-src')) {
            return `${directive} 'nonce-${nonce}'`;
        }
        return directive;
    }).join(';');
}
