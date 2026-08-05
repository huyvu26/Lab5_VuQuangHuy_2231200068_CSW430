module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((@)?react-native|@react-native-async-storage|@react-navigation|react-native-popup-menu|@react-native-vector-icons)/)',
  ],
};
