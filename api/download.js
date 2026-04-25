export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const decodedUrl = decodeURIComponent(url);
        
        // Fetching the target URL
        const response = await fetch(decodedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
            }
        });
        
        if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);

        // Get Content-Type or default to octet-stream for safety
        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        
        // Headers Set Karna
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', 'attachment'); // Isse force download hoga
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

        // ReadableStream ke bajaye ArrayBuffer use kar rahe hain for stability with Telegram
        const buffer = await response.arrayBuffer();
        
        // Final Response Send Karna
        return res.send(Buffer.from(buffer));

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Download failed: ' + error.message });
    }
}
