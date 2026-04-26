export default async function handler(req, res) {
    const { url, key } = req.query;

    // Allowed API Keys (Aap yahan mazeed keys add kar sakte hain)
    const VALID_KEYS = {
        "ahmad_bhai_admin": "Admin Key",
        "user_magic_99": "Magic Scripts User",
        "guest_key_123": "Free Tier User"
    };

    // 1. Check API Key
    if (!key || !VALID_KEYS[key]) {
        return res.status(401).json({ error: 'Invalid or missing API Key. Contact Ahmad Bhai for access.' });
    }

    // 2. Check URL
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const decodedUrl = decodeURIComponent(url);
        const response = await fetch(decodedUrl);
        
        if (!response.ok) throw new Error('Failed to fetch file from source');

        const contentType = response.headers.get('content-type');
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', 'attachment; filename="magic-download"');
        res.setHeader('Access-Control-Allow-Origin', '*'); // Public access for API users

        const buffer = await response.arrayBuffer();
        return res.send(Buffer.from(buffer));

    } catch (error) {
        return res.status(500).json({ error: 'Download failed: ' + error.message });
    }
}
