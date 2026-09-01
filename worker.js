/**
 * Cloudflare Worker Entry Point: worker.js
 * Handles serverless API routing (/api/chat, /api/contact) and serves static assets via env.ASSETS
 */

import { onRequestPost as chatPost, onRequestOptions as chatOptions } from './functions/api/chat.js';
import { onRequestPost as contactPost, onRequestOptions as contactOptions } from './functions/api/contact.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. AI Chatbot API Endpoint
    if (url.pathname === '/api/chat' || url.pathname === '/api/chat/') {
      if (request.method === 'OPTIONS') {
        return chatOptions();
      }
      if (request.method === 'POST') {
        return chatPost({ request, env, waitUntil: (p) => ctx?.waitUntil?.(p) });
      }
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Contact & Application Form API Endpoint
    if (url.pathname === '/api/contact' || url.pathname === '/api/contact/') {
      if (request.method === 'OPTIONS') {
        return contactOptions();
      }
      if (request.method === 'POST') {
        return contactPost({ request, env, waitUntil: (p) => ctx?.waitUntil?.(p) });
      }
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Static Assets Delivery
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    // Fallback
    return new Response('Not Found', { status: 404 });
  }
};
