export default async function handler(req, res) {
    const { url, key } = req.query;

    // API Key aur URL check
    if (!url || !key) {
        return res.status(400).json({ error: 'URL and API Key are required' });
    }

    try {
        const decodedUrl = decodeURIComponent(url);
        
        // 45MB Limit Check
        const headResponse = await fetch(decodedUrl, { method: 'HEAD' });
        const fileSize = headResponse.headers.get('content-length');
        if (fileSize && parseInt(fileSize) > 45 * 1024 * 1024) {
            return res.status(413).json({ error: 'File too heavy! Max 45MB allowed.' });
        }

        const response = await fetch(decodedUrl);
        if (!response.ok) throw new Error('Failed to fetch file');

        const contentType = response.headers.get('content-type');
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', 'attachment');
        res.setHeader('Access-Control-Allow-Origin', '*');

        // ReadableStream direct pipe (Aapka Official Logic)
        const buffer = await response.arrayBuffer();
        return res.send(Buffer.from(buffer));

    } catch (error) {
        return res.status(500).json({ error: 'Download failed: ' + error.message });
    }
}
