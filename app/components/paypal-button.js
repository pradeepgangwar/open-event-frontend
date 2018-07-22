import paypal from 'npm:paypal-checkout';
import client from 'npm:braintree-web/client';
import paypalCheckout from 'npm:braintree-web/paypal-checkout';
import Component from '@ember/component';

export default Component.extend({

  async didInsertElement() {
    this._super(...arguments);
    let order = this.get('order');
    let event = this.get('event');
    console.log(order.amount);
    paypal.Button.render({
      braintree: {
        client,
        paypalCheckout
      },
      client: {
        sandbox: this.get('data.clientToken')
      },
      env    : 'sandbox',
      commit : true,

      payment(data, actions) {
        return actions.braintree.create({
          flow                    : 'checkout', // Required
          amount                  : order.amount, // Required
          currency                : event.paymentCurrency, // Required
          enableShippingAddress   : true,
          shippingAddressEditable : false,
          shippingAddressOverride : {
            recipientName : 'Scruff McGruff',
            line1         : '1234 Main St.',
            line2         : 'Unit 1',
            city          : 'Chicago',
            countryCode   : 'US',
            postalCode    : '60652',
            state         : 'IL',
            phone         : '123.456.7890'
          }
        });
      },
      onAuthorize(payload) {
        // Submit `payload.nonce` to your server.
      }

    }, this.elementId);
  }
});
