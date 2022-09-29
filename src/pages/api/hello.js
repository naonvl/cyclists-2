export default async function handler(req, res) {
  const response = fetch(
    `https://${shopOrigin}/admin/metafields.json`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shopifyToken,
      },
    },
  );
  res.status(response.status).end();
}
