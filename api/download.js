export default async function handler(req, res) {
    const { url, key } = req.query;

    if (!url || !key) {
        return res.status(400).json({ error: 'URL and API Key are required' });
    }

    try {
        const decodedUrl = decodeURIComponent(url);
        
        // Fetch original file headers to check size
        const headResponse = await fetch(decodedUrl, { method: 'HEAD' });
        const fileSize = headResponse.headers.get('content-length');
        const maxLimit = 45 * 1024 * 1024; // 45MB in bytes

        if (fileSize && parseInt(fileSize) > maxLimit) {
            return res.status(413).json({ error: 'File is too heavy! Max limit is 45MB.' });
        }

        const response = await fetch(decodedUrl);
        if (!response.ok) throw new Error('Failed to fetch file');

        const contentType = response.headers.get('content-type');
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="AhmadBhai_DL_${Date.now()}"`);
        res.setHeader('Access-Control-Allow-Origin', '*');

        const buffer = await response.arrayBuffer();
        return res.send(Buffer.from(buffer));

    } catch (error) {
        return res.status(500).json({ error: 'System Error: ' + error.message });
    }
}
