export default async function handler(req, res) {
    const { url, key } = req.query;

    if (!url || !key) {
        return res.status(400).json({ error: 'URL and API Key are required' });
    }

    try {
        const decodedUrl = decodeURIComponent(url);
        const response = await fetch(decodedUrl);
        
        if (!response.ok) throw new Error('Failed to fetch file');

        const contentType = response.headers.get('content-type');
        
        // --- FIXED FOR OFFICIAL BOT & FORCED DOWNLOAD ---
        res.setHeader('Content-Type', contentType);
        // 'attachment' ke sath 'force-download' browser ko majboor karta hai download ke liye
        res.setHeader('Content-Disposition', 'attachment; filename="AhmadBhai_Media_' + Date.now() + '"');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'no-cache');

        // ReadableStream se direct pipe (BJS/Bot compatibility ke liye)
        const buffer = await response.arrayBuffer();
        return res.send(Buffer.from(buffer));

    } catch (error) {
        // Console log taake aap Vercel dashboard mein error dekh sakein
        console.error("Download Error:", error.message);
        return res.status(500).json({ error: 'Download failed: ' + error.message });
    }
}
