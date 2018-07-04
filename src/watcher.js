import { pushTarget, popTarget } from './dep';

export default class Watcher {
    constructor(vm, exp, cb) {
        this.vm = vm;
        this.expression = exp;
        this.cb = cb;
        this.value = this.get();
    }

    get() {
        pushTarget(this);
        const value = this.vm[this.expression];
        popTarget();
        return value;
    }

    update() {
        const oldVal = this.value;
        const newVal = this.get();
        this.value = newVal;
        this.cb.call(this.vm, newVal, oldVal);
    }
}