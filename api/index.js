const SUPPORTED_PLATFORMS = [
    'instagram.com', 'facebook.com', 'fb.watch', 'pinterest.com', 'pin.it',
    'twitter.com', 'x.com', 'snapchat.com', 'tiktok.com', 'threads.net',
    'linkedin.com', 'tumblr.com', 'twitch.tv', 'vimeo.com', 'vk.com', 'vk.ru',
    'soundcloud.com', 'reddit.com', 't.me', 'telegram.org'
];

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    res.status(200).json({
        message: 'All in One Downloader API',
        note: 'Vercel Serverless Functions',
        endpoints: {
            GET: '/download?url=YOUR_VIDEO_URL',
            POST: '/download (body: {url: YOUR_VIDEO_URL})'
        },
        supported_platforms: SUPPORTED_PLATFORMS,
        examples: {
            instagram: '/download?url=https://www.instagram.com/reel/DU7_NcEE8Jp/',
            tiktok: '/download?url=https://www.tiktok.com/@user/video/123456',
            twitter: '/download?url=https://twitter.com/user/status/123456',
            facebook: '/download?url=https://www.facebook.com/watch?v=123456'
        },
        github: 'https://github.com/UzbekApis/AIO'
    });
};
