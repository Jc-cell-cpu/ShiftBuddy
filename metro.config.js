// const { getDefaultConfig } = require("expo/metro-config");

// const config = getDefaultConfig(__dirname);

// config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");
// config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
// config.resolver.sourceExts.push("svg");

// config.resolver.alias = {
//   "@": __dirname,
// };

// module.exports = config;

const { getDefaultConfig } = require("expo/metro-config");

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
    "@": __dirname,
  };

  return config;
})();
