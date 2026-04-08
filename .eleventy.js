module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/BerriBlue_favicon.png");

  eleventyConfig.addFilter("urlencode", val => encodeURIComponent(val));

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
