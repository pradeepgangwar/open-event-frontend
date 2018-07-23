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
      env: 'sandbox',

      commit: true,

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

  /*
  *
  *  BRAINTREE DOCS
  *
  */

    // Be sure to have PayPal's checkout.js library loaded on your page.

    // Create a client.
    // client.create({
    //   authorization: clientToken
    // }).then(clientInstance => {
    //   // Create a PayPal Checkout component.
    //   return paypalCheckout.create({
    //     client: clientInstance
    //   });
    // }).then(paypalCheckoutInstance => {
    //   // Set up PayPal with the checkout.js library
    //   paypal.Button.render({
    //     env    : 'sandbox', // Or 'sandbox'
    //     commit : true, // This will add the transaction amount to the PayPal button

    //     payment() {
    //       return paypalCheckoutInstance.createPayment({
    //         flow                    : 'checkout', // Required
    //         amount                  : 10.00, // Required
    //         currency                : 'USD', // Required
    //         enableShippingAddress   : true,
    //         shippingAddressEditable : false,
    //         shippingAddressOverride : {
    //           recipientName : 'Scruff McGruff',
    //           line1         : '1234 Main St.',
    //           line2         : 'Unit 1',
    //           city          : 'Chicago',
    //           countryCode   : 'US',
    //           postalCode    : '60652',
    //           state         : 'IL',
    //           phone         : '123.456.7890'
    //         }
    //       });
    //     },

    //     onAuthorize(data, actions) {
    //       return paypalCheckoutInstance.tokenizePayment(data)
    //         .then(payload => {
    //           // Submit `payload.nonce` to your server
    //           console.log(payload);
    //         });
    //     },

    //     onCancel(data) {
    //       console.log('checkout.js payment cancelled', JSON.stringify(data, 0, 2));
    //     },

    //     onError(err) {
    //       console.error('checkout.js error', err);
    //     }
    //   }, this.elementId);
    // }).then(() => {
    //   // The PayPal button will be rendered in an html element with the id
    //   // `paypal-button`. This function will be called when the PayPal button
    //   // is set up and ready to be used.
    // }).catch(err => {
    //   console.log(err);
    //   // Handle component creation error
    // });

  }
});
