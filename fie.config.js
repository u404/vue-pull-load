"use strict"

module.exports = {
  toolkit: "fie-toolkit-comp",

  toolkitConfig: {
    group: "node"
  },

  pages: {
    index: {
      entry: 'example/main.js',
      template: 'example/index.html',
      filename: 'index.html',
      chunks: ['index']
    }
  }
}
