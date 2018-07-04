import { observe } from './observer';
import Watcher from './watcher';

var data = {
    a: 1,
    b: {
        b1: 2
    }
};

observe(data);

new Watcher(data, 'a', () => {
    console.log('watcher a');
});

setTimeout(() => {
    console.log('set data.a equals 2');
    data.a = 2;
}, 2000);