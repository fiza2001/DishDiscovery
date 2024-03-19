import { createClient } from 'contentful-management';

export const client = createClient({
  accessToken: process.env.CONTENT_MANAGEMENT_API,
});
