import directive from "./directive"

directive.install = function (Vue) {
  Vue.directive(directive.name, directive)
}

export default directive
