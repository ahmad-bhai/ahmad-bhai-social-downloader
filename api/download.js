export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const decodedUrl = decodeURIComponent(url);
        const response = await fetch(decodedUrl);
        
        if (!response.ok) throw new Error('Failed to fetch file');

        const contentType = response.headers.get('content-type');
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', 'attachment');
        res.setHeader('Access-Control-Allow-Origin', '*');

        // ReadableStream se direct pipe karna fast hota hai
        const buffer = await response.arrayBuffer();
        return res.send(Buffer.from(buffer));

    } catch (error) {
        return res.status(500).json({ error: 'Download failed: ' + error.message });
    }
}
