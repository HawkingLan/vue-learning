class Observer {
    constructor(val) {
        this.value = val;
        this.dep = new Dep();

        Object.defineProperty(val, '__ob__', {
            value: val,
            enumerable: false,
            writable: true,
            configurable: true
        });

        this.walk(val);
    }

    walk(obj) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key]);
        });
    }
}

function observe(value) {
    let _toString = Object.prototype.toString;
    if (_toString.call(value) !== '[object Object]') {
        return;
    }

    if (Object.prototype.hasOwnProperty.call(value, '__ob__') && value.__ob__ instanceof Observer) {
        return value.__ob__;
    } else {
        return new Observer(value);
    }
}

function defineReactive(obj, key, val) {
    let dep = new Dep();
    let childOb = observe(val);
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function() {
            dep.depend();
            return val;
        },
        set: function(newVal) {
            if (val === newVal) {
                return;
            }

            val = newVal;
            observe(newVal);
            dep.notify();
        }
    })
}

let uid = 0;

class Dep {
    constructor() {
        this.id = uid++;
        this.subs = [];
    }

    addSub(sub) {
        this.subs.push(sub);   
    }

    depend() {
        this.addSub(Dep.target);
    }

    notify() {
        this.subs.forEach(sub => {
            sub.update();
        });
    }
}

Dep.target = null;
const targetStack = [];

function pushTarget(watcher) {
    if (Dep.target) targetStack.push(Dep.target); 
    Dep.target = watcher;
}

class Watcher {
    constructor(exp, cb) {
        this.expression = exp;
        this.cb = cb;
        pushTarget(this);
        this.value = data[exp];
    }

    update() {
        return this.cb(this.value);
    }
}

var data = {
    a: 1,
    b: {
        b1: 2
    }
};

observe(data);

new Watcher('a', () => {
    console.log('watcher a');
});

setTimeout(() => {
    data.a = 2;
    console.log('set data.a equals 2');
}, 2000);