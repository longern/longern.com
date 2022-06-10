import { defaultTheme, defineUserConfig } from "vuepress";
import { sitemapPlugin } from "vuepress-plugin-sitemap2";

import { hyblogPlugin } from "vuepress-plugin-hyblog";

const homepageSidebar = [
  {
    text: "GitHub",
    link: "https://github.com/longern",
  },
  {
    text: "Links",
    link: "/links",
  },
];

export default defineUserConfig({
  title: "Longern's Blog",

  plugins: [
    hyblogPlugin({ homepageSidebar }),
    sitemapPlugin({
      hostname: "https://blog.longern.com",
    }),
  ],

  theme: defaultTheme({
    logo: "/assets/img/avatar.png",
  }),
});
