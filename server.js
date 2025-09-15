process.env.TZ = 'Asia/Tokyo'; // Set timezone to Japan Time

const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors'); // Import CORS

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: '*', // Allow only your domain
  methods: ['GET', 'POST'], // Allow GET and POST
  allowedHeaders: ['Content-Type']
}));

app.use(session({
    secret: '7cb122ba7ae25028dc4258db1a91c98398471ead4ceb1265874a703f6eaa6b1f85a8d968bb3927bcf320812a27cb38a2ef57a73e7c33817f3eaed78e5b4b7ca5',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use((req, res, next) => {
    const checkAccess = () => {
   const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' });
    const time = new Date(now);
    const hour = time.getHours();   // JST Hour
    const minute = time.getMinutes(); // JST Minute

const blockedTime = !(
  (hour >= 7 && hour < 11) //||  // Morning play time
 // (hour >= 14 && hour < 18)// || // Afternoon play time
  //(hour >= 19 && hour < 21)    // Evening play time
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
   "taco1": { id: "1110044171", maxPlayer: 8, gameName: "Taco Server 1" },
        "taco2": { id: "1110114426", maxPlayer: 8, gameName: "Taco Server 2"  },
        "taco3": { id: "1110115133", maxPlayer: 8, gameName: "Taco Server 3"  },
        "minecraftcreative1": { id: "1112191591", maxPlayer: 10, gameName: "Minecraft Creative Server 1"  },
        "minecraftcreative2": { id: "1112196866", maxPlayer: 10, gameName: "Minecraft Creative Server 2"   },
        "minecraftsurvival1": { id: "1112195433", maxPlayer: 10, gameName: "Minecraft Survival Server 1"   },
        "minecraftsurvival2": { id: "1112196236", maxPlayer: 10, gameName: "Minecraft Survival Server 2"  },
        "terraria": { id: "1110150944", maxPlayer: 8, gameName: "Terraria Server 1"   },
        "appelonline": { id: "1111153267", maxPlayer: 2, gameName: "Appel Online"   },
        "mmellee": { id: "1111154392", minPlayer: 2, maxPlayer: 10 , gameName: "Monster Melee"  },
        "simprpg": { id: "1111612005", minPlayer: 2, maxPlayer: 6 , gameName: "Simple RPG"  },
        "tag1": { id: "1110047228", minPlayer: 2, maxPlayer: 5, gameName: "Tag Server 1"   },
        "tag2": { id: "1112600204", minPlayer: 2, maxPlayer: 5, gameName: "Tag Server 2"   },
        "rush": { id: "1110082316", gameName: "Rush"   },
        "memory": { id: "1110082136", gameName: "Memory Match"   },
        "phantom": { id: "1110101171" , gameName: "Phantom"  },
        "scratchy2": { id: "1110102127", gameName: "Scratchy Adventure 2"   },
        "geometry": { id: "1110115588" , gameName: "Geometry Dash"  },
        "ballphy": { id: "1110116765" , gameName: "Ball Physics"  },
        "mario": { id: "1110136854", gameName: "Super Mario 3"   },
        "evan": { id: "1111611933" , gameName: "Evanescent"  },
        "gettingover": { id: "1111640053", gameName: "Getting Over"   },
        "plantvszombie": { id: "1111668077", gameName: "Plants Vs Zombies"   },
        "magiccat1": { id: "1111673953", gameName: "Magic Cat 1"   },
        "magiccat2": { id: "1111673729", gameName: "Magic Cat 2"   },
        "extremeparking": { id: "1112081449", gameName: "Extreme Parking"   },
        "paperminecraft": { id: "1112518406", gameName: "Paper Minecraft"   },
        "tetris": { id: "1112587686", gameName: "Tetris"   }
    };

    const defaultImg = "https://wallpapers.com/images/featured/blank-white-7sn5o1woonmklx1h.jpg";

    if (games[game]) {
        const data = games[game];
        return {
            embedSrc: `https://turbowarp.org/${data.id}/embed?cloud_host=wss://tide-pushy-consonant.glitch.me/`,
            maxPlayer: data.maxPlayer || null,
            minPlayer: data.minPlayer || null,
            imgSrcTouch: defaultImg,
            games: data.gameName
        };
    } else {
        return null;
    }
}

// ✅ Fix CORS for API responses
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

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
