// eslint-disable-next-line import/no-anonymous-default-export
export default async (_req, res) => {
  const response = await fetch('https://cyclists-com.myshopify.com/admin/api/2022-10/orders.json?status=any', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": "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"
    },
    body: _req.body
  })
  const data = await response.json()
  res.status(200).json(data);
}
