const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const { Parser } = require("json2csv");

const URLS = [
  "https://www.imdb.com/title/tt0944947/?ref_=vi_close",
  "https://www.imdb.com/title/tt4283088/"
];

(async () => {
  const moviesData = [];
  for (let movie of URLS) {
    const response = await request({
      url: movie,
      headers: {
        Host: "www.imdb.com",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:66.0) Gecko/20100101 Firefox/66.0",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": 1,
        "Cache-Control": "max-age=0",
        TE: "Trailers"
      },
      gzip: true
    });
    const $ = cheerio.load(response);

    const title = $("div.title_wrapper>h1")
      .text()
      .trim();
    const rating = $("span[itemprop='ratingValue']")
      .text()
      .trim();
    const poster = $(".poster img")
      .attr("src")
      .trim();
    const totalRatings = $(".imdbRating > a > .small")
      .text()
      .trim();
    const releaseDate = $("a[title='See more release dates']")
      .text()
      .trim();
    const genres = $(".title_wrapper a[href^='/search/title?genre']")
      .map((i, el) => $(el).text())
      .get();

    moviesData.push({
      title,
      rating,
      poster,
      totalRatings,
      releaseDate,
      genres
    });
  }
  // fs.writeFileSync("./data.json", JSON.stringify(moviesData), "utf-8");
  // const fields = ["title", "rating"];
  // const parser = new Parser({ fields });
  const parser = new Parser();
  const csv = parser.parse(moviesData);
  fs.writeFileSync("./data.csv", csv, "utf-8");

  console.log(csv);
})();
