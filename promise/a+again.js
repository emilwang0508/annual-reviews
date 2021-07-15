const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
    FULFILLED_CALLBACK_QUEUE = []
    REJECTED_CALLBACK_QUEUE = []
    _status = PENDING
    /**
     * 
     * @param {Function} executor 
     */
    constructor (executor) {
        // 初始状态为pending
        this.status = PENDING
        this.value = null
        this.reason = null

        try {
            executor(this.resolve.bind(this), this.reject.bind(this))
        } catch (e) {
            this.reject(e)
        }
    }
    get status () {
        return this._status
    }

    set status (newStatus) {
        this._status = newStatus
        switch (newStatus) {
            case FULFILLED:
                this.FULFILLED_CALLBACK_QUEUE.forEach(callback => {
                    callback(this.value)
                })
                break;
            case REJECTED:
                this.REJECTED_CALLBACK_QUEUE.forEach(callback => {
                    callback(this.reason)
                })
                break;
        }
    }
    
    resolve (value) {
        if (this.status === PENDING) {
            this.value = value
            this.status = FULFILLED
        }
    }

    reject (reason) {
        if (this.status === PENDING) {
            this.reason = reason
            this.status = REJECTED
        }
    }

    then (onFulfilled, onRejected) {
        const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => {return value}

        const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => {throw reason}

        const promise2 = new MyPromise((resolve, reject) => {
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
                        const x = realOnRejected(this.reason)
                        this.resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })

            }
            switch(this.status) {
                case FULFILLED:
                    fulfilledMicrotask()
                    break
                case REJECTED:
                    rejectedMicrotask()
                    break;
                case PENDING:
                    this.FULFILLED_CALLBACK_QUEUE.push(realOnFulfilled)
                    this.REJECTED_CALLBACK_QUEUE.push(realOnRejected)
                    break;
            }
        })

        return promise2
    }
    
    catch (onRejected) {
        return this.then(null, onRejected)
    }

    resolvePromise (promise2, x, resolve, reject) {
        if (promise2 === x) {
            return reject(new TypeError('The promise and the return value as the same'))
        }

        if (x instanceof MyPromise) {
            // 如果x是promise，那么让新的promise接手x的状态
            // 继续执行x.如果执行的时候又拿到一个Y，那么继续解析y
            queueMicrotask(() => {
                x.then((y) => {
                    this.resolvePromise(promise2, y, resolve, reject)
                }, reject)
            })
        } else if (typeof x === 'object' || this.isFunction(x)) {
            if (x == null) {
                return resolve(x)
            }
            let then = null

            try {
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
                            if(called) return
                            called = true
                            this.resolvePromise(promise2, y, resolve, reject)
                        },
                        (r) => {
                            if (called) return
                            called = true
                            reject(r)
                        }
                    )
                } catch (e) {
                    if (called) return
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

    static resolve (value) {
        if (value instanceof MyPromise) {
            return value
        }
        return new MyPromise((resolve,reject) => {
            resolve(value)
        })
    }

    static reject (reason) {
        return new MyPromise((resolve,reject) => {
            reject(reason)
        })
    }
    
    static race () {
        return new Promise((resolve, reject) => {
            const length = promiseList.length

            if (length === 0) {
                return resolve()
            } else {
                for (let i = 0; i < length;i++) {
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
}

const test = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        reject(111)      
    }, 1000);
}).then(value => {
    console.log(value)
}).catch(reason => {
    console.log(reason)
})