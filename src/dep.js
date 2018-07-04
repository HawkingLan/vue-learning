export default class Dep {
    constructor() {
        this.subs = [];
    }

    depend() {
        this.subs.push(Dep.target);
    }

    notify() {
        this.subs.forEach(sub => {
            sub.update();
        });
    }
}

Dep.target = null;
const targetStack = [];

export const pushTarget = (watcher) => {
    if (Dep.target) {
        targetStack.push(Dep.target);
    }
    Dep.target = watcher;
};

export const popTarget = () => {
    Dep.target = targetStack.pop();
}