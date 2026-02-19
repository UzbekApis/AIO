# All in One Downloader API

Instagram, TikTok, Facebook va boshqa 15+ platformadan video yuklab olish uchun API.

## 🚀 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/UzbekApis/AIO)

## 📦 O'rnatish

```bash
npm install
```

## 🛠️ Local Development

```bash
npm run dev
```

## 🌐 Deploy

```bash
npm run deploy
```

## 📖 Foydalanish

### GET so'rovi
```bash
curl "https://your-domain.vercel.app/download?url=https://www.instagram.com/reel/DU7_NcEE8Jp/"
```

### POST so'rovi
```bash
curl -X POST https://your-domain.vercel.app/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.instagram.com/reel/DU7_NcEE8Jp/"}'
```

### JavaScript
```javascript
const response = await fetch('https://your-domain.vercel.app/download?url=' + encodeURIComponent(videoUrl));
const data = await response.json();

if (data.success) {
    console.log(data.data);
}
```

## ✅ Qo'llab-quvvatlanadigan platformalar

- 📷 Instagram (Reels, Posts, Stories, IGTV)
- 📘 Facebook (Videos, Watch)
- 📌 Pinterest (Pins, Videos)
- 🐦 Twitter / X (Videos, GIFs)
- 👻 Snapchat (Stories, Spotlight)
- 🎵 TikTok (Videos)
- 🧵 Threads (Videos)
- 💼 LinkedIn (Videos, Posts)
- 📝 Tumblr (Videos, GIFs)
- 🎮 Twitch (Clips, VODs)
- 🎥 Vimeo (Videos)
- 🌐 VK (Videos)
- 🎧 SoundCloud (Audio)
- 🤖 Reddit (Videos, GIFs)
- ✈️ Telegram (Videos)

## 📝 API Response

### Success
```json
{
  "success": true,
  "data": {
    "medias": [
      {
        "url": "https://...",
        "quality": "720p",
        "extension": "mp4"
      }
    ],
    "title": "Video title",
    "thumbnail": "https://...",
    "duration": "00:30"
  }
}
```

### Error
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🔧 Environment Variables

Vercel da environment variables kerak emas, lekin rate limiting uchun qo'shishingiz mumkin.

## ⚠️ Limitations

- Vercel Serverless Functions 10 soniya timeout
- Cloudflare himoyasi bo'lgan saytlar ishlamasligi mumkin
- Rate limiting yo'q (o'zingiz qo'shing)

## 📄 License

MIT

## 🤝 Contributing

Pull requests are welcome!

## 📧 Contact

GitHub: [@UzbekApis](https://github.com/UzbekApis)
