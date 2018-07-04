import Dep from './dep';

class Observer {
    constructor(val) {
        this.value = val;

        Object.defineProperty(val, '__ob__', {
            value: val,
            enumerable: true,
            writable: true,
            configurable: true
        });

        if (Array.isArray(val)) {
            this.observeArray(val);
        } else {
            this.walk(val);
        }
    }

    walk(obj) {
        Object.keys(obj).forEach(k => {
            defineReactive(obj, k, obj[k]);
        });
    }

    observeArray() {}
}

export const observe = (val) => {
    if (Object.prototype.toString.call(val) !== '[object Object]') {
        return;
    }

    return val.hasOwnProperty('__ob__') ? val.__ob__ : new Observer(val);
}

export const defineReactive = (obj, key, val) => {
    const dep = new Dep();
    const property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && !property.configurable) {
        return;
    }

    const getter = property.get;
    const setter = property.set;
    const childOb = observe(val);
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            const value = getter ? getter.call(obj) : val;
            if (Dep.target) {
                dep.depend();
                if (childOb) {
                    childOb.dep.depend();
                }
            }

            return value;
        },
        set: function reactiveSetter(newVal) {
            const value = getter ? getter.call(obj) : val;
            if (value === newVal) {
                return;
            }

            if (setter) {
                setter.call(obj, newVal);
            } else {
                val = newVal;
            }

            observe(obj[key]);
            dep.notify();
        }
    })
};