process.env.TZ = 'Asia/Tokyo'; // Set timezone to Japan Time

const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to check time
app.use((req, res, next) => {
    const currentHour = new Date().getHours();

    // Block access between 6 AM - 6 PM
    if (currentHour >= 18 && currentHour < 6) {
        res.sendFile(path.join(__dirname, 'public/closed.html')); // Serve "closed.html"
    } else {
        next(); // Continue if outside restricted hours
    }
});

// Game configuration stored server-side
function getGame(game) {
    const games = {
   "taco1": { id: "1110044171", maxPlayer: 8 },
        "taco2": { id: "1110114426", maxPlayer: 8 },
        "taco3": { id: "1110115133", maxPlayer: 8 },
        "minecraftcreative1": { id: "1112191591", maxPlayer: 10 },
        "minecraftcreative2": { id: "1112196866", maxPlayer: 10 },
        "minecraftsurvival1": { id: "1112195433", maxPlayer: 10 },
        "minecraftsurvival2": { id: "1112196236", maxPlayer: 10 },
        "terraria": { id: "1110150944", maxPlayer: 8 },
        "appelonline": { id: "1111153267", maxPlayer: 2 },
        "mmellee": { id: "1111154392", minPlayer: 2, maxPlayer: 10 },
        "simprpg": { id: "1111612005", minPlayer: 2, maxPlayer: 6 },
        "tag1": { id: "1110047228", minPlayer: 2, maxPlayer: 5 },
        "tag2": { id: "1112600204", minPlayer: 2, maxPlayer: 5 },
        "rush": { id: "1110082316" },
        "memory": { id: "1110082136" },
        "phantom": { id: "1110101171" },
        "scratchy2": { id: "1110102127" },
        "geometry": { id: "1110115588" },
        "ballphy": { id: "1110116765" },
        "mario": { id: "1110136854" },
        "evan": { id: "1111611933" },
        "gettingover": { id: "1111640053" },
        "plantvszombie": { id: "1111668077" },
        "magiccat1": { id: "1111673953" },
        "magiccat2": { id: "1111673729" },
        "extremeparking": { id: "1112081449" },
        "paperminecraft": { id: "1112518406" },
        "tetris": { id: "1112587686" }
    };

    const defaultImg = "https://wallpapers.com/images/featured/blank-white-7sn5o1woonmklx1h.jpg";

    if (games[game]) {
        const data = games[game];
        return {
            embedSrc: `https://turbowarp.org/${data.id}/embed?cloud_host=wss://tide-pushy-consonant.glitch.me`,
            maxPlayer: data.maxPlayer || null,
            minPlayer: data.minPlayer || null,
            imgSrcTouch: defaultImg
        };
    } else {
        return null;
    }
}

// API endpoint to get game configuration
app.get('/api/get-game', (req, res) => {
    const game = req.query.game;
    const config = getGame(game);

    if (config) {
        res.json(config); // Send JSON response to the client
    } else {
        res.status(404).json({ error: "Game not found" });
    }
});

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Default route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
