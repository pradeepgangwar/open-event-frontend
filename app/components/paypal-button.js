import paypal from 'npm:paypal-checkout';
import client from 'npm:braintree-web/client';
import paypalCheckout from 'npm:braintree-web/paypal-checkout';
import Component from '@ember/component';

export default Component.extend({

  async didInsertElement() {
    this._super(...arguments);
    let order = this.get('order');
    let clientToken;
    try {
      let response = await this.get('loader').load('/get-client-token');
      clientToken = response.client_token;
      console.log(clientToken);

    } catch (error) {
      this.get('notify').error(this.get('l10n').t(error.message));
    }
    console.log(order.amount);
    paypal.Button.render({
      braintree: {
        client,
        paypalCheckout
      },
      client: {
        sandbox: clientToken
      },
      env    : 'sandbox',
      // commit : true,

      payment(data, actions) {
        return actions.payment.create({
          payment: {
            transactions: [
              {
                amount: { total: '0.01', currency: 'USD' }
              }
            ]
          }
        });
      },
      onAuthorize(payload) {
        console.log(payload);
      }

    }, this.elementId);
  }
});
