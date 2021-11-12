import { later } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import FacebookPixel from 'ember-metrics/metrics-adapters/facebook-pixel';

let config, fbq, subject;

async function waitForScripts() {
  return new Promise((resolve) => {
    function init() {
      const fbqSpy = sinon.spy(window, 'fbq');
      return resolve(fbqSpy);
    }

    (function wait() {
      // check for the generic script
      if (window.fbq.instance) {
        // now check for the custom script
        // it may have already loaded and
        // registering a listener will never fire
        if (window.fbq.instance.configsLoaded[config.id]) {
          return init();
        } else {
          later(wait, 10);
        }
      } else {
        // generic script hasn't run yet
        later(wait, 10);
      }
    })();
  });
}

module('facebook-pixel adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(async function () {
    config = {
      id: '1234567890',
      dataProcessingOptions: {
        method: ['LDU'],
        country: 1,
        state: 1000,
      },
    };

    subject = new FacebookPixel(config);

    fbq = await waitForScripts();
  });

  hooks.afterEach(function () {
    fbq.restore();
  });

  test('#trackEvent calls `fbq.track` with the right arguments', function (assert) {
    subject.trackEvent({ event: 'Search', opt1: 'bar', opt2: 'baz' });
    assert.ok(
      fbq.calledWith('track', 'Search', { opt1: 'bar', opt2: 'baz' }),
      'it sends the correct arguments and options'
    );
  });

  test('#trackPage calls `fbq.track` with the right arguments', function (assert) {
    subject.trackPage({ page: '/my-page', title: 'My Title' });
    assert.ok(
      fbq.calledWith('track', 'PageView', {
        page: '/my-page',
        title: 'My Title',
      }),
      'it sends the correct arguments and options'
    );
  });

  test('#init calls `fbq` with dataProcessingOptions', function (assert) {
    let { dataProcessingOptions, dataProcessingCountry, dataProcessingState } =
      fbq.instance.pluginConfig._configStore.dataProcessingOptions.global;

    assert.equal(
      dataProcessingOptions,
      'LDU',
      'it sends the correct Data Processing Options'
    );

    assert.equal(
      dataProcessingCountry,
      1,
      'it sends the correct Data Processing Country'
    );

    assert.equal(
      dataProcessingState,
      1000,
      'it sends the correct Data Processing State'
    );
  });
});
