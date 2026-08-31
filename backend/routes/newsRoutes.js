const express = require("express");
const axios = require("axios");

const router = express.Router();

// ==================================================
// CIVIC ISSUE KEYWORDS
// ==================================================

const civicKeywords = [
  "pothole",
  "potholes",
  "bad road",
  "damaged road",
  "road damage",
  "road repair",
  "broken road",

  "garbage",
  "waste management",
  "garbage dumping",
  "illegal dumping",
  "waste dumping",
  "trash",

  "water shortage",
  "water crisis",
  "water supply",
  "drinking water",
  "water problem",

  "drainage problem",
  "drainage",
  "sewage",
  "sewer",
  "waterlogging",
  "water logging",

  "street light",
  "street lights",
  "streetlight",
  "streetlights",

  "civic issue",
  "civic problem",
  "civic complaint",

  "municipal problem",
  "municipal complaint",

  "sanitation problem",
  "poor sanitation",

  "public infrastructure",
  "infrastructure damage",

  "illegal construction",

  "air pollution",
  "water pollution",
  "noise pollution",

  "flooded road",
  "urban flooding",
];

// ==================================================
// WORDS TO EXCLUDE
// ==================================================

const excludedKeywords = [
  "cricket",
  "football",
  "ipl",
  "movie",
  "film",
  "bollywood",
  "celebrity",
  "actor",
  "actress",
  "election campaign",
  "stock market",
  "crypto",
];

// ==================================================
// CHECK IF NEWS IS A CIVIC ISSUE
// ==================================================

const isCivicIssue = (article) => {
  const text = `
    ${article.title || ""}
    ${article.description || ""}
    ${article.content || ""}
  `.toLowerCase();

  const hasCivicKeyword =
    civicKeywords.some((keyword) =>
      text.includes(keyword.toLowerCase())
    );

  const hasExcludedKeyword =
    excludedKeywords.some((keyword) =>
      text.includes(keyword.toLowerCase())
    );

  return (
    hasCivicKeyword &&
    !hasExcludedKeyword
  );
};

// ==================================================
// GET CIVIC ISSUE NEWS
// ==================================================

router.get("/", async (req, res) => {
  try {
    if (!process.env.NEWS_API_KEY) {
      return res.status(500).json({
        success: false,
        message:
          "NEWS_API_KEY is missing in .env file.",
      });
    }

    console.log(
      "Fetching civic issue news..."
    );

    // ==================================================
    // LAST 7 DAYS
    // ==================================================

    const today = new Date();

    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(
      today.getDate() - 7
    );

    const fromDate =
      sevenDaysAgo
        .toISOString()
        .split("T")[0];

    // ==================================================
    // SEARCH CIVIC PROBLEMS
    // ==================================================

    const response = await axios.get(
      "https://newsapi.org/v2/everything",
      {
        params: {
          q: `
            pothole
            OR garbage
            OR "water shortage"
            OR drainage
            OR sewage
            OR "street light"
            OR "civic complaint"
            OR "civic issue"
            OR "road damage"
            OR sanitation
            OR waterlogging
            OR pollution
          `,

          from: fromDate,

          language: "en",

          sortBy: "publishedAt",

          pageSize: 100,

          apiKey:
            process.env.NEWS_API_KEY,
        },

        timeout: 20000,
      }
    );

    const articles =
      response.data.articles || [];

    // ==================================================
    // FILTER ONLY CIVIC ISSUES
    // ==================================================

    const civicNews =
      articles.filter(isCivicIssue);

    // ==================================================
    // REMOVE DUPLICATES
    // ==================================================

    const uniqueNews = [];

    const titles = new Set();

    civicNews.forEach((article) => {
      const title =
        article.title?.toLowerCase();

      if (
        title &&
        !titles.has(title)
      ) {
        titles.add(title);

        uniqueNews.push(article);
      }
    });

    // ==================================================
    // FORMAT NEWS
    // ==================================================

    const formattedNews =
      uniqueNews.map(
        (article, index) => ({
          id: index + 1,

          title:
            article.title ||
            "No title available",

          description:
            article.description ||
            "No description available.",

          image:
            article.urlToImage ||
            "",

          url:
            article.url ||
            "",

          source:
            article.source?.name ||
            "Unknown Source",

          publishedAt:
            article.publishedAt,
        })
      );

    console.log(
      `Total API news: ${articles.length}`
    );

    console.log(
      `Civic issue news: ${formattedNews.length}`
    );

    return res.status(200).json({
      success: true,

      totalResults:
        formattedNews.length,

      news:
        formattedNews,
    });

  } catch (error) {

    console.error(
      "Civic News Error:",
      error.response?.data ||
      error.message
    );

    return res.status(
      error.response?.status || 500
    ).json({
      success: false,

      message:
        error.response?.data?.message ||
        "Unable to fetch civic issue news.",
    });
  }
});

module.exports = router;