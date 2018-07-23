import Route from '@ember/routing/route';

export default Route.extend({
  titleToken(model) {
    var order = model.order.get('identifier');
    return this.get('l10n').t(`Placed Order -${order}`);
  },

  model(params) {
    return {
      order: this.store.findRecord('order', params.order_id, {
        include: 'attendees,tickets,event'
      }),
      // braintreeClientToken: this.store.queryRecord('get-client-token', {})
    };
  },

  afterModel(model) {
    if (model.order.get('status') === 'expired') {
      this.transitionTo('orders.expired', model.order.get('identifier'));
    } else if (model.order.get('status') === 'completed') {
      this.transitionTo('orders.view', model.order.get('identifier'));
    } else if (model.order.get('status') === 'pending') {
      this.transitionTo('orders.new', model.order.get('identifier'));
    }
  }
});
