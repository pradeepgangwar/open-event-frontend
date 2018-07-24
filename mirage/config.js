import ENV from 'open-event-frontend/config/environment';

export default function() {
  this.passthrough();
  this.passthrough(`${ENV.APP.apiHost}/**`);
  this.passthrough(`${ENV.sentry.server}/**`);
  this.passthrough('https://www.paypal.com/**');
  this.passthrough('https://api.sandbox.braintreegateway.com:443/**');
  this.passthrough('https://origin-analytics-sand.sandbox.braintree-api.com/**');
}
