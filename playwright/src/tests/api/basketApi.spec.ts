// src/tests/api/basketApi.spec.ts
import { test, expect, APIRequestContext } from '@playwright/test';
import { registerUser, loginUser, getProducts, getBasket, addToBasket, getAddresses, getDeliveryMethods, getCards, checkoutBasket } from '../../utils/apiHelpers';
import logger from '../../utils/logger';

// Helper to register and login user
async function registerAndLogin(request: APIRequestContext, user: { email: string; password: string }) {
  logger.info(`[registerAndLogin] Registering user: ${user.email}`);
  const registerRes = await registerUser(request, user);
  expect(registerRes.ok()).toBeTruthy();
  const registerBody = await registerRes.json();
  expect(registerBody).toHaveProperty('status', 'success');
  logger.info(`[registerAndLogin] Logging in user: ${user.email}`);
  const loginRes = await loginUser(request, user);
  expect(loginRes.ok()).toBeTruthy();
  const loginBody = await loginRes.json();
  expect(loginBody).toHaveProperty('authentication.token');
  logger.info(`[registerAndLogin] Got token: ${loginBody.authentication.token}`);
  return loginBody;
}

// Helper to login user only (no registration)
async function loginOnly(request: APIRequestContext, user: { email: string; password: string }) {
  logger.info(`[loginOnly] Logging in user: ${user.email}`);
  const loginRes = await loginUser(request, user);
  expect(loginRes.ok()).toBeTruthy();
  const loginBody = await loginRes.json();
  expect(loginBody).toHaveProperty('authentication.token');
  logger.info(`[loginOnly] Got token: ${loginBody.authentication.token}`);
  return loginBody;
}

// Helper to fetch products and basketId
async function fetchProductsAndBasketId(request: APIRequestContext, token: string, loginBody: any) {
  logger.info(`[fetchProductsAndBasketId] Fetching products`);
  const products = await getProducts(request, { Authorization: `Bearer ${token}` });
  expect(Array.isArray(products)).toBeTruthy();
  expect(products.length).toBeGreaterThan(0);
  expect(products[0]).toHaveProperty('id');
  logger.info(`[fetchProductsAndBasketId] Got products: ${JSON.stringify(products)}`);
  const productId = products[0].id;
  const basketId = loginBody.authentication?.bid;
  logger.info(`[fetchProductsAndBasketId] Extracted basketId: ${basketId}`);
  expect(basketId).toBeTruthy();
  return { productId, basketId };
}

// Helper to add product to basket
async function addProductToBasket(request: APIRequestContext, productId: number, basketId: string | number, token: string) {
  logger.info(`[addProductToBasket] Adding productId ${productId} to basketId ${basketId}`);
  const basketRes = await addToBasket(request, productId, basketId, token);
  logger.info(`[addProductToBasket] addToBasket response status: ${basketRes.status()}`);
  expect(basketRes.ok()).toBeTruthy();
  const basketBody = await basketRes.json();
  logger.info(`[addProductToBasket] addToBasket response body: ${JSON.stringify(basketBody)}`);
  expect(basketBody.data).toHaveProperty('id');
}

// Helper to add product to basket only if basket is empty
async function addProductToBasketIfEmpty(request: APIRequestContext, productId: number, basketId: string | number, token: string) {
  logger.info(`[addProductToBasketIfEmpty] Fetching basket before adding product`);
  const basket = await getBasket(request, basketId, token);
  logger.info(`[addProductToBasketIfEmpty] Current basket: ${JSON.stringify(basket)}`);
  expect(basket).toHaveProperty('id');
  if (Array.isArray(basket.Products) && basket.Products.length === 0) {
    logger.info(`[addProductToBasketIfEmpty] Basket is empty, adding productId ${productId}`);
    const basketRes = await addToBasket(request, productId, basketId, token);
    logger.info(`[addProductToBasketIfEmpty] addToBasket response status: ${basketRes.status()}`);
    expect(basketRes.ok()).toBeTruthy();
    const basketBody = await basketRes.json();
    logger.info(`[addProductToBasketIfEmpty] addToBasket response body: ${JSON.stringify(basketBody)}`);
    expect(basketBody.data).toHaveProperty('id');
  } else {
    logger.info(`[addProductToBasketIfEmpty] Basket already has products, skipping add.`);
    expect(Array.isArray(basket.Products)).toBeTruthy();
  }
}

// Helper to fetch address and delivery
async function fetchAddressAndDelivery(request: APIRequestContext, token: string) {
  logger.info(`[fetchAddressAndDelivery] Fetching addresses`);
  const addresses = await getAddresses(request, token);
  expect(Array.isArray(addresses)).toBeTruthy();
  expect(addresses.length).toBeGreaterThan(0);
  const addressId = addresses[0].id;
  logger.info(`[fetchAddressAndDelivery] Using addressId: ${addressId}`);
  logger.info(`[fetchAddressAndDelivery] Fetching delivery methods`);
  const deliveryMethods = await getDeliveryMethods(request, token);
  expect(Array.isArray(deliveryMethods)).toBeTruthy();
  expect(deliveryMethods.length).toBeGreaterThan(0);
  const deliveryMethodId = deliveryMethods[0].id;
  logger.info(`[fetchAddressAndDelivery] Using deliveryMethodId: ${deliveryMethodId}`);
  return { addressId, deliveryMethodId };
}

// Helper to fetch card and place order
async function fetchCardAndPlaceOrder(request: APIRequestContext, basketId: string | number, token: string, addressId: string | number, deliveryMethodId: string | number) {
  logger.info(`[fetchCardAndPlaceOrder] Fetching cards`);
  const cards = await getCards(request, token);
  expect(Array.isArray(cards)).toBeTruthy();
  expect(cards.length).toBeGreaterThan(0);
  const paymentId = cards[0].id;
  logger.info(`[fetchCardAndPlaceOrder] Using paymentId: ${paymentId}`);
  logger.info(`[fetchCardAndPlaceOrder] Placing order for basketId ${basketId}`);
  const orderRes = await checkoutBasket(request, basketId, token, addressId, deliveryMethodId, paymentId);
  logger.info(`[fetchCardAndPlaceOrder] checkoutBasket response status: ${orderRes.status()}`);
  expect(orderRes.ok()).toBeTruthy();
  const orderBody = await orderRes.json();
  logger.info(`[fetchCardAndPlaceOrder] checkoutBasket response body: ${JSON.stringify(orderBody)}`);
  expect(orderBody).toHaveProperty('orderConfirmation');
}

// Helper to validate basket after order
async function validateBasketAfterOrder(request: APIRequestContext, basketId: string | number, token: string) {
  logger.info(`[validateBasketAfterOrder] Fetching basket after order for basketId ${basketId}`);
  const basketAfterOrder = await getBasket(request, basketId, token);
  logger.info(`[validateBasketAfterOrder] basketAfterOrder response: ${JSON.stringify(basketAfterOrder)}`);
  expect(basketAfterOrder).toHaveProperty('id');
  expect(Array.isArray(basketAfterOrder.Products)).toBeTruthy();
  expect(basketAfterOrder.Products.length).toBe(0);
}

test.describe('Basket & Order API', () => {
  test('should login as admin, add product to basket, and place an order', async ({ request }) => {
    const user = { email: 'admin@juice-sh.op', password: 'admin123' };
    const loginBody = await loginOnly(request, user);
    const token = loginBody.authentication.token;
    const { productId, basketId } = await fetchProductsAndBasketId(request, token, loginBody);
    await addProductToBasketIfEmpty(request, productId, basketId, token);
    const { addressId, deliveryMethodId } = await fetchAddressAndDelivery(request, token);
    await fetchCardAndPlaceOrder(request, basketId, token, addressId, deliveryMethodId);
    await validateBasketAfterOrder(request, basketId, token);
  });
});
