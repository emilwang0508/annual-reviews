const PENDING = 'pending',
      FULFILLED = 'fulfilled',
      REJECTED = 'rejected';
    
class MyPromise {
    FULFILLED_CALLBACK_QUEUE = [];
    REJECTED_CALLBACK_QUEUE = [];
    _status = PENDING;
    /**
     * 
     * @param {*} executor 
     */
    constructor (executor) {
        // 初始状态为pending
        this.status = PENDING;
        this.value = null;
        this.reason = null;

        try {
            executor(this.resolve.bind(this), this.reject.bind(this))
        } catch (e) {
            this.reject(e)
        }
    }

    get status () {
        return this._status;
    }

    set status (newStatus) {
        this._status = newStatus;
        switch (newStatus) {
            case FULFILLED: {
                this.FULFILLED_CALLBACK_QUEUE.forEach(callback => {
                    callback(this.value)
                })
                break;
            }
            case REJECTED: {
                this.REJECTED_CALLBACK_QUEUE.forEach(callback => {
                    callback(this.reason)
                })
                break;
            }
        }
    }

    resolve (value) {
        // 判断状态，只有pending状态才可以变成 fulfilled
        if (this.status === PENDING) {
            this.value = value;
            this.status = FULFILLED;
        }
    }

    reject (reason) {
        if (this.status === PENDING){
            this.reason = reason;
            this.status = REJECTED; 
        }

    }

    then(onFulfilled, onRejected) {
        const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
            return value;
        }

        const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => {
            throw reason;
        }

        // .then的返回值整体是一个promise
        const promise2 = new MyPromise((resolve, reject) => {
            // 6.2 onFulfilled
            const fulfilledMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = realOnFulfilled(this.value)
                        this.resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            }  
            const rejectedMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = realOnFulfilled(this.reason)
                        this.resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            }

            // 当调用.then的时候，不同的状态，调用不同的回调
            switch (this.status) {
                case FULFILLED: {
                    fulfilledMicrotask()
                    break;
                }
                case REJECTED: {
                    rejectedMicrotask()
                    break; 
                }
                case PENDING: {
                    this.FULFILLED_CALLBACK_QUEUE.push(realOnFulfilled);
                    this.REJECTED_CALLBACK_QUEUE.push(realOnRejected);
                    break;
                }
            }
        })
        return promise2
    }

    catch (onRejected) {
        return this.then(null, onRejected)
    }

    resolvePromise (promise2, x, resolve, reject) {
        if (promise2 === x) {
            return reject(new TypeError('The promise and the return value are the same'))
        }

        if (x instanceof MyPromise) {
            // 如果x是Promise，那么让新的promise接收x的状态
            // 如果继续执行x，如果执行的时候又拿到一个y，那么继续解析
            queueMicrotask(() => {
                x.then((y) => {
                    this.resolvePromise(promise2, y, resolve, reject)
                }, reject)
            })
        } else if (typeof x === 'object' || this.isFunction(x)) {
            if (x === null) {
                return resolve(x);
            }

            let then = null
            try {
                // 取x.then赋值给then
                then = x.then
            } catch (e) {
                return reject(e)
            }
            if (this.isFunction(then)) {
                let called = false;
                try {
                    then.call(
                        x,
                        (y) => {
                            if (called) return;
                            called = true;
                            this.resolvePromise(promise2, y, resolve, reject)
                        },
                        (r) => {
                            if (called) return;
                            called = true;
                            reject(r)
                        }
                    )
                } catch (e) {
                    if (called) return;
                    reject(e)  
                }
            } else {
                resolve(x)
            }
        } else {
            resolve(x)
        }
    }

    isFunction (value) {
        return typeof value === 'function'
    }

    static resolve(value) {
        if (value instanceof MyPromise) {
            return value;
        }
        return new MyPromise((resolve) => {
            resolve(value)
        })
    }
    static reject(reason) {
        return new MyPromise((resolve, reject) => {
            reject(reason)
        })
    }
    static race(promiseList) {
        return new MyPromise((resolve, reject) => {
            const length = promiseList.length;

            if (length === 0) {
                return resolve()
            } else {
                for (let i = 0; i < length; i++) {
                    MyPromise.resolve(promiseList[i]).then(
                        (value) => {
                            return resolve(value)
                        },
                        (reason) => {
                            return reject(reason)
                        }
                    )
                }
            }
        })
    }
    all () {

    }
}

// const test = new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//         resolve(111)      
//     }, 1000);
// }).then(value => {
//     console.log(value)
// }).catch(err => {
//     console(err++)
// })

const test1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(111)      
    }, 1000);
})
const test2 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(222)      
    }, 2000);
})
const test3 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(333)      
    }, 2001);
})
MyPromise.race([test1, test2, test3]).then( value =>
    console.log(value)
)