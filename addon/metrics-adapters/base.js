import { assert } from '@ember/debug';
import { guidFor } from '@ember/object/internals';
import { typeOf } from '@ember/utils';
import { registerDestructor } from '@ember/destroyable';
import { setOwner } from '@ember/application';

function makeToString(ret) {
  return () => ret;
}

export default class BaseAdapter {
  static supportsFastBoot = false;

  metrics = null;

  constructor(config = null, owner = null) {
    this.config = config;
    setOwner(this, owner);
    this.init();
    registerDestructor(this, () => this.willDestroy());
  }

  init() {
    assert(`[ember-metrics] ${this.toString()} must implement the init hook!`);
  }

  willDestroy() {
    assert(
      `[ember-metrics] ${this.toString()} must implement the willDestroy hook!`
    );
  }

  toString() {
    const hasToStringExtension = typeOf(this.toStringExtension) === 'function';
    const extension = hasToStringExtension
      ? ':' + this.toStringExtension()
      : '';
    const ret = `ember-metrics@metrics-adapter:${extension}:${guidFor(this)}`;

    this.toString = makeToString(ret);
    return ret;
  }

  identify() {}
  trackEvent() {}
  trackPage() {}
  alias() {}
}
