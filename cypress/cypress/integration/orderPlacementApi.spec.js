// cypress/integration/orderPlacementApi.spec.js
// End-to-end API test: register, login, fetch products, add to basket, place order, verify basket is empty

import {
  loginOnlyAsAdmin,
  fetchFirstProductId,
  addProductToBasketIfEmpty,
  fetchFirstAddressId,
  fetchFirstDeliveryMethodId,
  fetchFirstPaymentId,
  placeOrderWithAllDetails,
  validateBasketIsEmpty
} from '../support/apiHelpers';

describe('Basket & Order API (E2E)', () => {
  it('should login as admin, add product to basket, place order with all required details, and verify basket is empty', () => {
    loginOnlyAsAdmin()
      .then(({ token, basketId }) => {
        return fetchFirstProductId(token).then(productId => ({ token, basketId, productId }));
      })
      .then(({ token, basketId, productId }) => {
        return addProductToBasketIfEmpty(token, productId, basketId).then(() => ({ token, basketId }));
      })
      .then(({ token, basketId }) => {
        return fetchFirstAddressId(token).then(addressId => ({ token, basketId, addressId }));
      })
      .then(({ token, basketId, addressId }) => {
        return fetchFirstDeliveryMethodId(token).then(deliveryMethodId => ({ token, basketId, addressId, deliveryMethodId }));
      })
      .then(({ token, basketId, addressId, deliveryMethodId }) => {
        return fetchFirstPaymentId(token).then(paymentId => ({ token, basketId, addressId, deliveryMethodId, paymentId }));
      })
      .then(({ token, basketId, addressId, deliveryMethodId, paymentId }) => {
        return placeOrderWithAllDetails(token, basketId, addressId, deliveryMethodId, paymentId).then(() => ({ token, basketId }));
      })
      .then(({ token, basketId }) => {
        validateBasketIsEmpty(token, basketId);
      });
  });
});
