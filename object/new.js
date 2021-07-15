// 1. 一个继承自Player.prototype的新对象p1/p2被创建.
// 2. p1.__proto__ === Player.prototype, p1.__proto__指向Player.prototype
// 3. 将this指向新创建的实例对象
// 4. 返回新对象
//    1. 如果构造函数没有显示的返回值，那么会返回this
//    2. 如果构造函数有显示的返回值，是基本类型，number，string，boolean，那么还是返回this
//    3. 如果构造函数有显示的返回值，是引用对象，此时返回引用对象

function Player (name) {
    this.name = name
}

function objectFactory() {
    let _object = new Object();
    let _constructor = [].shift.call(arguments)

    _object.__proto__ = _constructor.prototype

    let resultObj = _constructor.apply(_object, arguments) // ['鲁班']
    return typeof resultObj === 'object' ? resultObj :_object
}

const p1 = objectFactory(Player, '鲁班')
console.log(p1)