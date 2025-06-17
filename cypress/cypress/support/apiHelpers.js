// cypress/support/apiHelpers.js
// Centralized API helpers for Juice Shop API flows

// Use Cypress config for baseUrl
const apiUrl = Cypress.config('baseUrl');

export function registerUser(user) {
  return cy.request('POST', `${apiUrl}/api/Users/`, {
    email: user.email,
    password: user.password,
    passwordRepeat: user.password,
    securityQuestion: { id: 1, question: 'Your eldest siblings middle name?' },
    securityAnswer: 'test',
  });
}

export function loginUser(user) {
  return cy.request('POST', `${apiUrl}/rest/user/login`, {
    email: user.email,
    password: user.password,
  });
}

export function getProducts(token) {
  return cy.request({
    method: 'GET',
    url: `${apiUrl}/api/Products`,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function addToBasket(token, productId, basketId) {
  return cy.request({
    method: 'POST',
    url: `${apiUrl}/api/BasketItems/`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: { ProductId: productId, BasketId: String(basketId), quantity: 1 },
  });
}

export function placeOrder(token, basketId) {
  return cy.request({
    method: 'POST',
    url: `${apiUrl}/rest/order`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: { BasketId: basketId },
  });
}

export function getBasket(token, basketId) {
  return cy.request({
    method: 'GET',
    url: `${apiUrl}/rest/basket/${basketId}`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/json, text/plain, */*',
    },
  });
}

export function getAddresses(token) {
  return cy.request({
    method: 'GET',
    url: `${apiUrl}/api/Addresss`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/json, text/plain, */*',
    },
  });
}

export function getDeliveryMethods(token) {
  return cy.request({
    method: 'GET',
    url: `${apiUrl}/api/Deliverys`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/json, text/plain, */*',
    },
  });
}

export function getCards(token) {
  return cy.request({
    method: 'GET',
    url: `${apiUrl}/api/Cards`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/json, text/plain, */*',
    },
  });
}

export function checkoutBasket(token, basketId, addressId, deliveryMethodId, paymentId) {
  return cy.request({
    method: 'POST',
    url: `${apiUrl}/rest/basket/${basketId}/checkout`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: {
      couponData: 'bnVsbA==',
      orderDetails: {
        paymentId: String(paymentId),
        addressId: String(addressId),
        deliveryMethodId: String(deliveryMethodId)
      }
    },
  });
}

// Modular helpers for Cypress API E2E test

export function loginAsAdmin() {
  const user = { email: 'admin@juice-sh.op', password: 'admin123' };
  return loginUser(user).then((loginRes) => {
    expect(loginRes.status).to.eq(200);
    expect(loginRes.body).to.have.nested.property('authentication.token');
    const token = loginRes.body.authentication.token;
    const basketId = loginRes.body.authentication.bid;
    expect(basketId).to.exist;
    cy.log(`[helper] Got admin token: ${token}`);
    cy.log(`[helper] Got admin basketId: ${basketId}`);
    return { token, basketId };
  });
}

export function loginOnlyAsAdmin() {
  const user = { email: 'admin@juice-sh.op', password: 'admin123' };
  return loginUser(user).then((loginRes) => {
    expect(loginRes.status).to.eq(200);
    expect(loginRes.body).to.have.nested.property('authentication.token');
    const token = loginRes.body.authentication.token;
    const basketId = loginRes.body.authentication.bid;
    expect(basketId).to.exist;
    cy.log(`[helper] Got admin token: ${token}`);
    cy.log(`[helper] Got admin basketId: ${basketId}`);
    return cy.wrap({ token, basketId }); // FIX: wrap the return value for Cypress chaining
  });
}

export function fetchFirstProductId(token) {
  return getProducts(token).then((productsRes) => {
    expect(productsRes.status).to.eq(200);
    expect(productsRes.body.data).to.be.an('array').and.not.be.empty;
    const productId = productsRes.body.data[0].id;
    cy.log(`[helper] Got productId: ${productId}`);
    return cy.wrap(productId);
  });
}

export function addProductToBasketHelper(token, productId, basketId) {
  return addToBasket(token, productId, basketId).then((basketRes) => {
    expect(basketRes.isOkStatusCode).to.be.true;
    expect(basketRes.body.data).to.have.property('id');
    cy.log(`[helper] addToBasket response body: ${JSON.stringify(basketRes.body)}`);
  });
}

export function fetchFirstAddressId(token) {
  return getAddresses(token).then((addressRes) => {
    expect(addressRes.status).to.eq(200);
    expect(addressRes.body.data).to.be.an('array').and.not.be.empty;
    const addressId = addressRes.body.data[0].id;
    cy.log(`[helper] Using addressId: ${addressId}`);
    return cy.wrap(addressId);
  });
}

export function fetchFirstDeliveryMethodId(token) {
  return getDeliveryMethods(token).then((deliveryRes) => {
    expect(deliveryRes.status).to.eq(200);
    expect(deliveryRes.body.data).to.be.an('array').and.not.be.empty;
    const deliveryMethodId = deliveryRes.body.data[0].id;
    cy.log(`[helper] Using deliveryMethodId: ${deliveryMethodId}`);
    return cy.wrap(deliveryMethodId);
  });
}

export function fetchFirstPaymentId(token) {
  return getCards(token).then((cardRes) => {
    expect(cardRes.status).to.eq(200);
    expect(cardRes.body.data).to.be.an('array').and.not.be.empty;
    const paymentId = cardRes.body.data[0].id;
    cy.log(`[helper] Using paymentId: ${paymentId}`);
    return cy.wrap(paymentId);
  });
}

export function placeOrderWithAllDetails(token, basketId, addressId, deliveryMethodId, paymentId) {
  return checkoutBasket(token, basketId, addressId, deliveryMethodId, paymentId).then((orderRes) => {
    cy.log(`[helper] checkoutBasket response status: ${orderRes.status}`);
    cy.log(`[helper] checkoutBasket response body: ${JSON.stringify(orderRes.body)}`);
    expect(orderRes.isOkStatusCode).to.be.true;
    expect(orderRes.body).to.have.property('orderConfirmation');
  });
}

export function validateBasketIsEmpty(token, basketId) {
  return getBasket(token, basketId).then((basketAfterOrderRes) => {
    cy.log(`[helper] basketAfterOrder response: ${JSON.stringify(basketAfterOrderRes.body)}`);
    expect(basketAfterOrderRes.status).to.eq(200);
    expect(basketAfterOrderRes.body.data).to.have.property('id');
    expect(basketAfterOrderRes.body.data.Products).to.be.an('array').and.have.length(0);
  });
}

export function addProductToBasketIfEmpty(token, productId, basketId) {
  return getBasket(token, basketId).then((basketRes) => {
    cy.log(`[helper] Current basket: ${JSON.stringify(basketRes.body)}`);
    expect(basketRes.status).to.eq(200);
    expect(basketRes.body.data).to.have.property('id');
    if (Array.isArray(basketRes.body.data.Products) && basketRes.body.data.Products.length === 0) {
      cy.log(`[helper] Basket is empty, adding productId ${productId}`);
      return addToBasket(token, productId, basketId).then((addRes) => {
        cy.log(`[helper] addToBasket response status: ${addRes.status}`);
        expect(addRes.isOkStatusCode).to.be.true;
        expect(addRes.body.data).to.have.property('id');
        cy.log(`[helper] addToBasket response body: ${JSON.stringify(addRes.body)}`);
      });
    } else {
      cy.log(`[helper] Basket already has products, skipping add.`);
      expect(Array.isArray(basketRes.body.data.Products)).to.be.true;
      return cy.wrap(null);
    }
  });
}
