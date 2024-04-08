const express = require("express");const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");
const cors = require("cors");
const JSZip = require("jszip");
const app = express();

app.use(cors());

app.get("/scrape", async (req, res) => {
  const { niche, city } = req.query;

  try {
    const results = await scrapeGoogleResults(niche, city);
    await exportToZip(results, res); // Export results to ZIP
  } catch (error) {
    console.error("Error scraping or exporting:", error);
    res.status(500).send("Internal Server Error");
  }
});

const scrapeGoogleResults = async (niche, city) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const searchQuery = `${niche} ${city} "business.site"`;

  const results = [];

  async function scrapePage() {
    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);

    $("div.g").each((index, element) => {
      const title = $(element).find("h3").text();
      const url = $(element).find("a").attr("href");
      results.push({ title, url });
    });
  }

  let currentPage = 1;
  let nextPageExists = true;

  while (nextPageExists && currentPage <= 5) {
    // Scraping up to 5 pages for demonstration, adjust as needed
    console.log(`Scraping page ${currentPage}`);
    await page.goto(
      `https://www.google.com/search?q=${encodeURIComponent(
        searchQuery
      )}&start=${(currentPage - 1) * 10}`
    );

    await scrapePage();

    // Check if there's a "Next" button
    nextPageExists = await page.evaluate(() => {
      const nextButton = document.querySelector("#pnnext");
      return nextButton !== null;
    });

    currentPage++;
  }

  await browser.close();

  return results;
};

const exportToZip = async (data, res) => {
  const zip = new JSZip();

  zip.file("google_results.json", JSON.stringify(data, null, 2));

  zip
    .generateAsync({ type: "nodebuffer" })
    .then((content) => {
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="google_results.zip"'
      );
      res.setHeader("Content-Type", "application/zip");
      res.status(200).send(content);
    })
    .catch((error) => {
      console.error("Error generating ZIP:", error);
      res.status(500).send("Internal Server Error");
    });
};

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
