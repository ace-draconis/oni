#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { listBoard } = require('./board');

const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT || 4173);
const PUBLIC_FILES = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
]);
const AUDIT_PATH = path.join(__dirname, 'logs', 'audit.jsonl');

function sendJson(response, statusCode, value) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(JSON.stringify(value));
}

function readAuditEvents() {
  if (!fs.existsSync(AUDIT_PATH)) return [];
  return fs.readFileSync(AUDIT_PATH, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        throw new Error(`Invalid audit JSON on line ${index + 1}: ${error.message}`);
      }
    })
    .slice(-100)
    .reverse();
}

function requestHandler(request, response) {
  const url = new URL(request.url, `http://${HOST}`);
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    sendJson(response, 405, { error: 'Only GET requests are supported.' });
    return;
  }

  try {
    if (url.pathname === '/api/board') {
      sendJson(response, 200, { tickets: listBoard() });
      return;
    }
    if (url.pathname === '/api/audit') {
      sendJson(response, 200, { events: readAuditEvents() });
      return;
    }

    const asset = PUBLIC_FILES.get(url.pathname);
    if (!asset) {
      sendJson(response, 404, { error: 'Not found.' });
      return;
    }
    const [filename, contentType] = asset;
    const body = fs.readFileSync(path.join(__dirname, 'public', filename));
    response.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store',
      'Content-Security-Policy': "default-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(body);
  } catch (error) {
    process.stderr.write(`Kanban web request failed: ${error.message}\n`);
    sendJson(response, 500, { error: 'Could not load board data.' });
  }
}

if (!Number.isInteger(PORT) || PORT < 0 || PORT > 65535) {
  process.stderr.write('PORT must be an integer from 0 to 65535.\n');
  process.exitCode = 1;
} else {
  const server = http.createServer(requestHandler);
  server.listen(PORT, HOST, () => {
    const address = server.address();
    process.stdout.write(`Kanban web view: http://${HOST}:${address.port}\n`);
  });
}
