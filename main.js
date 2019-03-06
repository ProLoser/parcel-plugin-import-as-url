const Bundler = require('parcel-bundler');

const main = (bundler) => {
    bundler.addAssetType("as-url", require.resolve("./AsURLAsset.js"));
};

module.exports = main;
