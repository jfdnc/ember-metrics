import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

let sandbox, config;

module('google-tag-manager adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    sandbox = sinon.createSandbox();
    config = {
      id: 'GTM-XXXX',
    };
  });

  hooks.afterEach(function () {
    sandbox.restore();
  });

  test('#trackEvent returns the correct response shape', function (assert) {
    const adapterClass = this.owner.factoryFor(
      'ember-metrics@metrics-adapter:google-tag-manager'
    ).class;
    const adapter = new adapterClass(config, this.owner);
    sandbox.stub(window, 'dataLayer').value({ push() {} });

    const result = adapter.trackEvent({
      event: 'click-button',
      category: 'button',
      action: 'click',
      label: 'nav buttons',
      value: 4,
    });
    const expectedResult = {
      event: 'click-button',
      eventCategory: 'button',
      eventAction: 'click',
      eventLabel: 'nav buttons',
      eventValue: 4,
    };

    assert.deepEqual(
      result,
      expectedResult,
      'it sends the correct response shape'
    );
  });

  test('#trackPage returns the correct response shape', function (assert) {
    const adapterClass = this.owner.factoryFor(
      'ember-metrics@metrics-adapter:google-tag-manager'
    ).class;
    const adapter = new adapterClass(config, this.owner);
    sandbox.stub(window, 'dataLayer').value({ push() {} });

    const result = adapter.trackPage({
      url: '/my-overridden-page?id=1',
      title: 'my overridden page',
    });
    const expectedResult = {
      event: 'pageview',
      url: '/my-overridden-page?id=1',
      title: 'my overridden page',
    };

    assert.deepEqual(
      result,
      expectedResult,
      'it sends the correct response shape'
    );
  });

  test('#trackPage accepts a custom dataLayer name', function (assert) {
    const customConfig = config;
    customConfig['dataLayer'] = 'customDataLayer';

    const adapterClass = this.owner.factoryFor(
      'ember-metrics@metrics-adapter:google-tag-manager'
    ).class;
    const adapter = new adapterClass(customConfig, this.owner);

    sandbox.stub(window, 'customDataLayer').value({ push() {} });

    const result = adapter.trackPage({
      url: '/my-overridden-page?id=1',
      title: 'my overridden page',
    });

    const expectedResult = {
      event: 'pageview',
      url: '/my-overridden-page?id=1',
      title: 'my overridden page',
    };

    assert.deepEqual(
      result,
      expectedResult,
      'it sends the correct response shape'
    );
  });

  test('#trackPage accepts custom `keyNames` and returns the correct response shape', function (assert) {
    const adapterClass = this.owner.factoryFor(
      'ember-metrics@metrics-adapter:google-tag-manager'
    ).class;
    const adapter = new adapterClass(config, this.owner);
    sandbox.stub(window, 'dataLayer').value({ push() {} });

    const result = adapter.trackPage({
      event: 'VirtualPageView',
      VirtualPageUrl: '/my-overridden-page?id=1',
      VirtualTitle: 'my overridden page',
    });

    const expectedResult = {
      event: 'VirtualPageView',
      VirtualPageUrl: '/my-overridden-page?id=1',
      VirtualTitle: 'my overridden page',
    };

    assert.deepEqual(
      result,
      expectedResult,
      'it sends the correct response shape'
    );
  });
});
