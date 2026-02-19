const axios = require('axios');
const cheerio = require('cheerio');

const SUPPORTED_PLATFORMS = [
    'instagram.com', 'facebook.com', 'fb.watch', 'pinterest.com', 'pin.it',
    'twitter.com', 'x.com', 'snapchat.com', 'tiktok.com', 'threads.net',
    'linkedin.com', 'tumblr.com', 'twitch.tv', 'vimeo.com', 'vk.com', 'vk.ru',
    'soundcloud.com', 'reddit.com', 't.me', 'telegram.org'
];

// URL validatsiya
function isValidUrl(url) {
    try {
        const urlObj = new URL(url);
        return SUPPORTED_PLATFORMS.some(platform => urlObj.hostname.includes(platform));
    } catch {
        return false;
    }
}

// Token olish
async function getToken() {
    try {
        const response = await axios.get('https://getindevice.com/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache'
            },
            timeout: 15000
        });

        const $ = cheerio.load(response.data);
        const token = $('#token').val();
        
        if (!token) {
            throw new Error('Token topilmadi');
        }

        return token;
    } catch (error) {
        throw new Error('Token olishda xatolik: ' + error.message);
    }
}

// Video ma'lumotlarini olish
async function getVideoData(url, token) {
    try {
        const formData = new URLSearchParams();
        formData.append('url', url);
        formData.append('token', token);

        const response = await axios.post('https://getindevice.com/wp-json/aio-dl/video-data/', formData, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'Origin': 'https://getindevice.com',
                'Referer': 'https://getindevice.com/'
            },
            timeout: 30000
        });

        return response.data;
    } catch (error) {
        throw new Error('Video ma\'lumotlarini olishda xatolik: ' + error.message);
    }
}

module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // URL ni olish
        const url = req.method === 'GET' ? req.query.url : req.body?.url;

        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'URL parametri kerak',
                supported_platforms: SUPPORTED_PLATFORMS
            });
        }

        if (!isValidUrl(url)) {
            return res.status(400).json({
                success: false,
                error: 'Qo\'llab-quvvatlanmaydigan platforma',
                supported_platforms: SUPPORTED_PLATFORMS
            });
        }

        // Token olish
        const token = await getToken();
        
        // Video ma'lumotlarini olish
        const videoData = await getVideoData(url, token);

        res.status(200).json({
            success: true,
            data: videoData
        });

    } catch (error) {
        console.error('Xatolik:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
