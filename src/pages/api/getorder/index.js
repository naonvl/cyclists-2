// eslint-disable-next-line import/no-anonymous-default-export
export default async (_req, res) => {
  let resdata
  const response = await fetch('https://cyclists-com.myshopify.com/admin/api/2022-10/orders.json?status=any', {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": "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"
    }
  })
  const data = await response.json()
  res.status(response.status).json(data);
}
