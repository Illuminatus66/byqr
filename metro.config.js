const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    assetExts: [defaultConfig.resolver.assetExts, 'obj', 'mtl', 'gltf', 'glb', 'bin', 'png', 'jpg'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
