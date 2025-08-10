import type { VercelRequest, VercelResponse } from '@vercel/node';
import apiApp from './app';

export default async (req: VercelRequest, res: VercelResponse) => {
  // Convert Vercel request to Express format
  const expressReq = {
    ...req,
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    params: {},
    originalUrl: req.url,
    path: req.url?.split('?')[0] || '/',
    // Add other Express properties as needed
  } as any;

  // Create a Vercel-compatible response wrapper
  const expressRes = {
    _headers: {} as Record<string, string>,
    _statusCode: 200,
    
    setHeader: function(name: string, value: string) {
      this._headers[name.toLowerCase()] = value;
      res.setHeader(name, value);
      return this;
    },
    
    getHeader: function(name: string) {
      return this._headers[name.toLowerCase()];
    },
    
    removeHeader: function(name: string) {
      delete this._headers[name.toLowerCase()];
      res.removeHeader(name);
      return this;
    },
    
    status: function(code: number) {
      this._statusCode = code;
      return this;
    },
    
    json: function(body: any) {
      res.status(this._statusCode);
      Object.entries(this._headers).forEach(([key, value]) => {
        res.setHeader(key, value as string);
      });
      return res.json(body);
    },
    
    send: function(body: any) {
      res.status(this._statusCode);
      Object.entries(this._headers).forEach(([key, value]) => {
        res.setHeader(key, value as string);
      });
      return res.send(body);
    },
    
    end: function() {
      res.status(this._statusCode);
      Object.entries(this._headers).forEach(([key, value]) => {
        res.setHeader(key, value as string);
      });
      return res.end();
    }
  } as any;

  // Next function for Express middleware
  const next = (err?: any) => {
    if (err) {
      console.error('Middleware error:', err);
      res.status(500).json({ 
        error: err.message || 'Internal server error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    }
  };

  try {
    // Handle the request
    await apiApp(expressReq, expressRes, next);
  } catch (err) {
    console.error('Unhandled application error:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { 
        details: err instanceof Error ? err.message : String(err) 
      })
    });
  }
};