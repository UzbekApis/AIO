const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

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

// Token olish (Puppeteer bilan)
async function getToken() {
    let browser = null;
    
    try {
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });
        
        const page = await browser.newPage();
        
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36');
        
        await page.goto('https://getindevice.com/', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Cloudflare challenge kutish
        await page.waitForTimeout(3000);
        
        // Token ni olish
        const token = await page.evaluate(() => {
            const tokenInput = document.getElementById('token');
            return tokenInput ? tokenInput.value : null;
        });
        
        if (!token) {
            throw new Error('Token topilmadi');
        }
        
        return token;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Video ma'lumotlarini olish
async function getVideoData(url, token) {
    let browser = null;
    
    try {
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });
        
        const page = await browser.newPage();
        
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36');
        
        // API ga so'rov yuborish
        const response = await page.evaluate(async (url, token) => {
            const formData = new URLSearchParams();
            formData.append('url', url);
            formData.append('token', token);
            
            const res = await fetch('https://getindevice.com/wp-json/aio-dl/video-data/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Origin': 'https://getindevice.com',
                    'Referer': 'https://getindevice.com/'
                },
                body: formData
            });
            
            return await res.json();
        }, url, token);
        
        return response;
    } finally {
        if (browser) {
            await browser.close();
        }
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

        console.log('Token olinmoqda...');
        const token = await getToken();
        console.log('Token olindi');
        
        console.log('Video ma\'lumotlari yuklanmoqda...');
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
