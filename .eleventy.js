module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");

  eleventyConfig.addFilter("urlencode", val => encodeURIComponent(val));

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
