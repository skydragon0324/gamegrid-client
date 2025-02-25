/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  sentry: {
    hideSourceMaps: true,
  },
  images: {
    domains: [
      "tr.rbxcdn.com",
      "api.bloxflip.com",
      "blox.land",
      "rest-bf.blox.land",
      "cdn-bf.blox.land",
      "cdn.softswiss.net",
      "stage.gis-static.com",
      "staging.slotegrator.com",
      "cdn.s-studs.com",
      "media.discordapp.net",
      "lgg-staging.s3.amazonaws.com",
      "images1-focus-opensocial.googleusercontent.com",
      "lgg-staging.s3.us-east-1.amazonaws.com",
      "lootgg-prod.s3.us-east-2.amazonaws.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
};

module.exports = nextConfig;
