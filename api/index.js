import express from 'express';
import { ApifyClient } from 'apify-client';
import 'dotenv/config';

// Initialize the ApifyClient with API token
const client = new ApifyClient({
    token: process.env.API,
});

// Prepare Actor input
const input = {
    "hashtags": [
        "fyp"
    ],
    "resultsPerPage": 100,
    "profiles": [
        "therock",
        "nasa"
    ],
    "profileScrapeSections": [
        "videos"
    ],
    "profileSorting": "latest",
    "excludePinnedPosts": false,
    "oldestPostDateUnified": "2024-01-01",
    "newestPostDate": "2024-12-31",
    "mostDiggs": 1000000,
    "leastDiggs": 1000,
    "maxFollowersPerProfile": 0,
    "maxFollowingPerProfile": 0,
    "searchQueries": [
        "funny cats",
        "dance challenge"
    ],
    "searchSection": "",
    "maxProfilesPerQuery": 10,
    "searchSorting": "0",
    "searchDatePosted": "0",
    "postURLs": [
        "https://www.tiktok.com/@therock/video/7123456789012345678"
    ],
    "scrapeRelatedVideos": false,
    "shouldDownloadVideos": false,
    "shouldDownloadCovers": false,
    "shouldDownloadSlideshowImages": false,
    "shouldDownloadAvatars": false,
    "shouldDownloadMusicCovers": false,
    "videoKvStoreIdOrName": "tiktok-videos",
    "downloadSubtitlesOptions": "NEVER_DOWNLOAD_SUBTITLES",
    "commentsPerPost": 0,
    "maxRepliesPerComment": 0,
    "proxyCountryCode": "None"
};

(async () => {
    // Run the Actor and wait for it to finish
    const run = await client.actor("GdWCkxBtKWOsKjdch").call(input);

    // Fetch and print Actor results from the run's dataset (if any)
    console.log('Results from dataset');
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    items.forEach((item) => {
        console.dir(item);
    });
})();