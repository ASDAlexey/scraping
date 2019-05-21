const request = require("request-promise");
const cheerio = require("cheerio");

const URL = "https://www.imdb.com/title/tt0944947/?ref_=vi_close";

(async () => {
  const response = await request(URL);
  const $ = cheerio.load(response);

  const title = $("div.title_wrapper>h1").text();
  const rating = $("span[itemprop='ratingValue']").text();
  console.log(title, rating);
})();
