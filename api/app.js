import express from 'express';
import { ApifyClient } from 'apify-client';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from "url";

const app = express();
//app.use(cors()); //allow all origins
app.use(cors({
  origin: 'https://quicktok-grab.onrender.com' 
}));
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));

//route
app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "../public/index.html"));
});
// Initialize the ApifyClient with API token
const client = new ApifyClient({
    token: process.env.API,
});

app.get('/tiktok/download', async (req, res) => {
    try {
        const videoUrl = req.query.url; // Use ?url= in Postman
        if (!videoUrl) {
            return res.status(400).json({ success: false, error: "Missing url parameter" });
        }
       // Prepare Actor input
const input = {
  postURLs: [videoUrl],
  shouldDownloadVideos: true
};


    // Run the Actor and wait for it to finish
    const run = await client.actor("GdWCkxBtKWOsKjdch").call(input);

    // Fetch and print Actor results from the run's dataset (if any)
    console.log('Results from dataset');
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
     items.forEach((item) => {
        console.dir(item);
    });
    

    // Check if API returned an error object
    const firstItem = items[0];

    if(firstItem.errorCode === 'INVALID_URLS'){
       return res.status(400).json({ success: false, data: firstItem.errorCode });

    }
    
    const videos = items.map(item => ({
            id: item.id,
            url: item.videoMeta,
            text: item.text
    }));
    console.log(videos);

    res.status(200).json({ success: true, data: videos });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));