// api/download.js 
import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const response = await fetch(decodeURIComponent(url));
        
        if (!response.ok) throw new Error('Failed to fetch file');

        const contentType = response.headers.get('content-type');
        
        // Headers set kar rahe hain taake browser download shuru kare
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', 'attachment');
        res.setHeader('Access-Control-Allow-Origin', '*'); // Sab bots ko allow karne ke liye

        // File ko stream karna (High Speed)
        const buffer = await response.arrayBuffer();
        res.send(Buffer.from(buffer));

    } catch (error) {
        res.status(500).json({ error: 'Download failed: ' + error.message });
    }
}
