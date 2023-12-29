/** @type {import('next').NextConfig} */
const prod = process.env.NODE_ENV === "production";

const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching,
  disable: prod ? true : false,
});

const nextConfig = {
  experimental: {
    serverActions: true,
  },
  typescript: {
    ignoreBuildErrors: true,
    output: "export",
  },
  daisyui: {
    themes: false,
  },
};

module.exports = nextConfig
