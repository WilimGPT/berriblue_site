module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/BerriBlue_favicon.png");

  eleventyConfig.addFilter("urlencode", val => encodeURIComponent(val));
  eleventyConfig.addFilter("slug", val =>
    (val || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  );

  // Format a number as e.g. "1 500" with space thousands separator, no decimal
  eleventyConfig.addFilter("euroPrice", price => {
    if (price == null) return "";
    const formatted = Math.round(Number(price)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return "€" + formatted;
  });

  // artworks-for-sale.json has a hyphen which Nunjucks can't reference directly
  eleventyConfig.addGlobalData("artworksForSale", () =>
    JSON.parse(require("fs").readFileSync("./src/_data/artworks-for-sale.json", "utf8"))
  );

  // for_sale_default_order.json — expose for staging page sort
  eleventyConfig.addGlobalData("for_sale_default_order", () =>
    JSON.parse(require("fs").readFileSync("./src/_data/for_sale_default_order.json", "utf8"))
  );

  // shipping-regions.json — expose for checkout page
  eleventyConfig.addGlobalData("shippingRegions", () =>
    JSON.parse(require("fs").readFileSync("./src/_data/shipping-regions.json", "utf8"))
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
