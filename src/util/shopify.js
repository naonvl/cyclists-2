import { default as fetch } from 'node-fetch';

export const postToShopify = async ({ query, variables = {} }) => {
  try {
    const result = await fetch('https://cyclists-com.myshopify.com/admin/api/2022-10/orders.json?status=any', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': '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',
      },
      body: JSON.stringify({ query, variables }),
    }).then((res) => res.json());

    if (result.errors) {
      console.log({ errors: result.errors });
    } else if (!result || !result.data) {
      console.log({ result });
      return 'No results found.';
    }

    return result.data;
  } catch (error) {
    console.log(error);
  }
};
