import paypal from 'npm:paypal-checkout';
import client from 'npm:braintree-web/client';
import paypalCheckout from 'npm:braintree-web/paypal-checkout';
import Component from '@ember/component';

export default Component.extend({

  async didInsertElement() {
    this._super(...arguments);
    let order = this.get('order');
    let loader = this.get('loader');
    let clientToken;
    try {
      let response = await loader.load('/get-client-token');
      clientToken = response.client_token;
    } catch (error) {
      this.get('notify').error(this.get('l10n').t(error.message));
    }
    paypal.Button.render({
      braintree: {
        client,
        paypalCheckout
      },
      client: {
        sandbox: clientToken
      },
      env: 'sandbox',

      commit: true,

      payment(data, actions) {
        return actions.payment.create({
          payment: {
            transactions: [{
              amount:
              {
                total    : order.amount,
                currency : 'USD'
              }
            }]
          }
        });
      },
      onAuthorize(data, actions) {
        return actions.payment.tokenize()
          .then(async data => {
            let payload = {
              'data': {
                'attributes': {
                  'stripe' : null,
                  'paypal' : data.nonce
                },
                'type': 'charge'
              }
            };
            return await loader.post(`orders/${order.id}/charge`, payload);
          });
      }

    }, this.elementId);

  }
});
