process.env.TZ = 'Asia/Tokyo'; // Set timezone to Japan Time

const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

app.use(session({
    secret: '7cb122ba7ae25028dc4258db1a91c98398471ead4ceb1265874a703f6eaa6b1f85a8d968bb3927bcf320812a27cb38a2ef57a73e7c33817f3eaed78e5b4b7ca5',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));


// Middleware to check access
app.use((req, res, next) => {
    const isBlockedTime = () => {
        const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' });
        const time = new Date(now);
        const hour = time.getHours();   // JST Hour
        const minute = time.getMinutes(); // JST Minute

        // Block access between 6 AM - 6 PM JST
        return (hour > 18 && hour < 6) || (hour === 18 && minute <= 30);
    };

    // Check if the session is already blocked
    if (req.session.blocked) {
        return res.sendFile(path.join(__dirname, 'public/closed.html'));
    }

    // Re-evaluate time restrictions
    if (isBlockedTime()) {
        req.session.blocked = true; // Set session as blocked
        return res.sendFile(path.join(__dirname, 'public/closed.html'));
    }

    next();
});

app.use((req, res, next) => {
    const checkAccess = () => {
   const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' });
    const time = new Date(now);
    const hour = time.getHours();   // JST Hour
    const minute = time.getMinutes(); // JST Minute

    // Block access from 6 PM to 6 AM, and from 11 AM to 2 PM
    const blockedTime = (
        (hour >= 18 || hour < 6) || // 6 PM to 6 AM
        (hour >= 11 && hour < 14)   // 11 AM to 2 PM
    );

    return blockedTime;
    };

    // Send status for periodic checks
    if (req.path === '/check-access') {
        return res.json({ accessAllowed: !checkAccess() });
    }

    if (checkAccess()) {
        res.sendFile(path.join(__dirname, 'public/closed.html')); // Serve "closed.html"
    } else {
        next();
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
