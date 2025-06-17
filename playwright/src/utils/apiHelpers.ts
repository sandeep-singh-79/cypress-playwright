// src/utils/apiHelpers.ts
import { APIRequestContext } from '@playwright/test';
import logger from './logger';

export function getTestUser() {
  // Generate a unique email for each test run
  const unique = Date.now();
  return {
    email: `testuser_${unique}@example.com`,
    password: 'TestPassword123!'
  };
}

export async function registerUser(request: APIRequestContext, user: { email: string; password: string }) {
  logger.info(`[registerUser] Registering user: ${user.email}`);
  const res = await request.post('/api/Users/', {
    data: {
      email: user.email,
      password: user.password,
      passwordRepeat: user.password,
      securityQuestion: { id: 1, question: 'Your eldest siblings middle name?', createdAt: new Date(), updatedAt: new Date() },
      securityAnswer: 'test',
    },
  });
  logger.info(`[registerUser] Status: ${res.status()} | Content-Type: ${res.headers()['content-type']}`);
  if (!res.ok()) {
    throw new Error(`[registerUser] Failed: ${res.status()} ${await res.text()}`);
  }
  return res;
}

export async function loginUser(request: APIRequestContext, user: { email: string; password: string }) {
  logger.info(`[loginUser] Logging in user: ${user.email}`);
  const res = await request.post('/rest/user/login', {
    data: {
      email: user.email,
      password: user.password,
    },
  });
  logger.info(`[loginUser] Status: ${res.status()} | Content-Type: ${res.headers()['content-type']}`);
  if (!res.ok()) {
    throw new Error(`[loginUser] Failed: ${res.status()} ${await res.text()}`);
  }
  return res;
}

export async function getProducts(request: APIRequestContext, headers: Record<string, string> = {}) {
  logger.info(`[getProducts] Fetching products with headers: ${JSON.stringify(headers)}`);
  const res = await request.get('/api/Products', { headers });
  logger.info(`[getProducts] Status: ${res.status()} | Content-Type: ${res.headers()['content-type']}`);
  if (!res.ok()) {
    throw new Error(`[getProducts] Failed: ${res.status()} ${await res.text()}`);
  }
  const contentType = res.headers()['content-type'] || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`[getProducts] Expected JSON but got: ${contentType}\n${await res.text()}`);
  }
  return (await res.json()).data;
}

export async function getBasket(request: APIRequestContext, basketId: number | string, token: string) {
  logger.info(`[getBasket] Fetching basket with id: ${basketId}`);
  const res = await request.get(`/rest/basket/${basketId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json, text/plain, */*',
      // Optionally add more headers if needed
    },
  });
  logger.info(`[getBasket] Status: ${res.status()} | Content-Type: ${res.headers()['content-type']}`);
  if (!res.ok()) {
    throw new Error(`[getBasket] Failed: ${res.status()} ${await res.text()}`);
  }
  const contentType = res.headers()['content-type'] || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`[getBasket] Expected JSON but got: ${contentType}\n${await res.text()}`);
  }
  return (await res.json()).data;
}

export async function addToBasket(request: APIRequestContext, productId: number, basketId: string | number, token: string) {
  logger.info(`[addToBasket] Adding product ${productId} to basket ${basketId}`);
  const res = await request.post('/api/BasketItems/', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    data: { ProductId: productId, BasketId: String(basketId), quantity: 1 },
  });
  logger.info(`[addToBasket] Status: ${res.status()} | Content-Type: ${res.headers()['content-type']}`);
  if (!res.ok()) {
    throw new Error(`[addToBasket] Failed: ${res.status()} ${await res.text()}`);
  }
  return res;
}

export async function placeOrder(request: APIRequestContext, basketId: string | number, token: string) {
  logger.info(`[placeOrder] Placing order for basket ${basketId}`);
  const res = await request.post('/rest/order', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    },
    data: { BasketId: basketId },
  });
  logger.info(`[placeOrder] Status: ${res.status()} | Content-Type: ${res.headers()['content-type']}`);
  if (!res.ok()) {
    throw new Error(`[placeOrder] Failed: ${res.status()} ${await res.text()}`);
  }
  return res;
}

export async function getAddresses(request: APIRequestContext, token: string) {
  logger.info(`[getAddresses] Fetching addresses`);
  const res = await request.get('/api/Addresss', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json, text/plain, */*',
    },
  });
  logger.info(`[getAddresses] Status: ${res.status()} | Content-Type: ${res.headers()['content-type']}`);
  if (!res.ok()) {
    throw new Error(`[getAddresses] Failed: ${res.status()} ${await res.text()}`);
  }
  return (await res.json()).data;
}

export async function getDeliveryMethods(request: APIRequestContext, token: string) {
  logger.info(`[getDeliveryMethods] Fetching delivery methods`);
  const res = await request.get('/api/Deliverys', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json, text/plain, */*',
    },
  });
  logger.info(`[getDeliveryMethods] Status: ${res.status()} | Content-Type: ${res.headers()['content-type']}`);
  if (!res.ok()) {
    throw new Error(`[getDeliveryMethods] Failed: ${res.status()} ${await res.text()}`);
  }
  return (await res.json()).data;
}

export async function getCards(request: APIRequestContext, token: string) {
  logger.info(`[getCards] Fetching cards`);
  const res = await request.get('/api/Cards', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json, text/plain, */*',
    },
  });
  logger.info(`[getCards] Status: ${res.status()} | Content-Type: ${res.headers()['content-type']}`);
  if (!res.ok()) {
    throw new Error(`[getCards] Failed: ${res.status()} ${await res.text()}`);
  }
  return (await res.json()).data;
}

export async function checkoutBasket(request: APIRequestContext, basketId: string | number, token: string, addressId: string|number, deliveryMethodId: string|number, paymentId: string|number) {
  logger.info(`[checkoutBasket] Placing order for basket ${basketId} with addressId ${addressId}, deliveryMethodId ${deliveryMethodId}, paymentId ${paymentId}`);
  const res = await request.post(`/rest/basket/${basketId}/checkout`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    },
    data: {
      couponData: 'bnVsbA==',
      orderDetails: {
        paymentId: String(paymentId),
        addressId: String(addressId),
        deliveryMethodId: String(deliveryMethodId)
      }
    },
  });
  logger.info(`[checkoutBasket] Status: ${res.status()} | Content-Type: ${res.headers()['content-type']}`);
  if (!res.ok()) {
    throw new Error(`[checkoutBasket] Failed: ${res.status()} ${await res.text()}`);
  }
  return res;
}
