import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('<%= friendlyTestDescription %>', function(hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function(assert) {
    let adapter = this.owner.factoryFor('metrics-adapter:<%= dasherizedModuleName %>').create({
      config: {
        // TODO: Add adapter config
      },
    });
    assert.ok(adapter);
  });
});
