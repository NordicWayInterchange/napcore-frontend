const withTM = require('next-transpile-modules')([
  '@mui/x-data-grid',
]);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  reactStrictMode: true,
  // other config options here if needed
});

module.exports = nextConfig;
