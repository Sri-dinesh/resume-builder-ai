import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/settings/"],
      },
    ],
    sitemap: "https://sparkcv.netlify.app/sitemap.xml",
  };
}
