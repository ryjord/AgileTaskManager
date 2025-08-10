import type { VercelRequest, VercelResponse } from '@vercel/node';
import apiApp from './app';

export default async (req: VercelRequest, res: VercelResponse) => {
  // Convert Vercel request to Express-like format
  const expressReq = {
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    params: {},
    originalUrl: req.url,
    path: req.url?.split('?')[0] || '/',
    // Add other Express request properties as needed
  } as any;

  // Create Express-like response object
  const expressRes = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    setHeader: function(name: string, value: string) {
      this.headers[name] = value;
      return this;
    },
    status: function(code: number) {
      this.statusCode = code;
      return this;
    },
    json: (body: any) => {
      res.status(expressRes.statusCode);
      Object.entries(expressRes.headers).forEach(([key, value]) => {
        res.setHeader(key, value as string);
      });
      return res.json(body);
    },
    send: (body: any) => {
      res.status(expressRes.statusCode);
      Object.entries(expressRes.headers).forEach(([key, value]) => {
        res.setHeader(key, value as string);
      });
      return res.send(body);
    },
    end: () => {
      res.status(expressRes.statusCode);
      Object.entries(expressRes.headers).forEach(([key, value]) => {
        res.setHeader(key, value as string);
      });
      return res.end();
    }
  } as any;

  // Mock next function
  const next = (err?: any) => {
    if (err) {
      console.error('Error in request handler:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  };

  // Handle the request
  try {
    await apiApp(expressReq, expressRes, next);
  } catch (err) {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};