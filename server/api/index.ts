import type { VercelRequest, VercelResponse } from '@vercel/node';
import apiApp from './app';

export default async (req: VercelRequest, res: VercelResponse) => {
  // Convert Vercel request to Express format
  const expressReq = {
    ...req,
    method: req.method,
    url: req.url?.startsWith('/api') ? req.url.slice(4) : req.url, // Remove /api prefix
    headers: req.headers,
    query: req.query,
    body: req.body,
    params: {},
    originalUrl: req.url,
    path: req.url?.split('?')[0]?.replace(/^\/api/, '') || '/'
  } as any;

  // Create Vercel-compatible response
  const expressRes = {
    _status: 200,
    _headers: {} as Record<string, string>,
    
    status(code: number) {
      this._status = code;
      return this;
    },
    
    setHeader(name: string, value: string) {
      this._headers[name.toLowerCase()] = value;
      res.setHeader(name, value);
      return this;
    },
    
    getHeader(name: string) {
      return this._headers[name.toLowerCase()];
    },
    
    removeHeader(name: string) {
      delete this._headers[name.toLowerCase()];
      res.removeHeader(name);
      return this;
    },
    
    json(body: any) {
      res.status(this._status);
      Object.entries(this._headers).forEach(([k, v]) => res.setHeader(k, v as string));
      return res.json(body);
    },
    
    send(body: any) {
      res.status(this._status);
      Object.entries(this._headers).forEach(([k, v]) => res.setHeader(k, v as string));
      return res.send(body);
    },
    
    end() {
      res.status(this._status);
      Object.entries(this._headers).forEach(([k, v]) => res.setHeader(k, v as string));
      return res.end();
    }
  } as any;

  try {
    await apiApp(expressReq, expressRes, (err?: any) => {
      if (err) {
        console.error('Middleware error:', err);
        res.status(500).json({ 
          error: err.message || 'Internal server error' 
        });
      } else if (!expressRes.headersSent) {
        res.status(404).json({
          status: 'error',
          message: 'Route not found',
          path: req.url
        });
      }
    });
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && {
        details: err instanceof Error ? err.message : String(err)
      })
    });
  }
};