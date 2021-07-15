const template = require('babel-template')
const tmp = template('var b = 1')
modules.exports = function ({
    types: t
}) {
    return {
        visitor: {
            VariableDeclaration(path, state) {
                // 找到AST节点
                const node = path.node

                if (t.isVariableDeclaration(node, {
                    kind: 'const'
                })) {
                    node.kind = 'let'
                    const inertNode = temp()
                    path.insertBefore(inertNode)

                }
            }
        }
    }
}