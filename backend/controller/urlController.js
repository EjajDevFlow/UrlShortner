const { nanoid } = require("nanoid");
const URL = require("../model/url.js");

async function handelGenerateNewShortURL(req, res) {
    const body = req.body; 

    if (!body.url) {
        return res.status(400).json({ error: "Url is required" });
    }

    const shortId = nanoid(6);

    await URL.create({
        shortId: shortId,
        redirectUrl: body.url,
        visitHistory: []
    });

    return res.status(201).json({ id: shortId });
}


async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });

    if (!result) {
        return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory
    });
}

module.exports = { handelGenerateNewShortURL, handleGetAnalytics };
