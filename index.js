#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var xml = require('xmldom')
var concat = require('concat-stream')
var arrayify = require('arrayify')
var slugify = require('to-slug-case')

var DOMParser = xml.DOMParser
var XMLSerializer = xml.XMLSerializer
var file = process.argv[2]

if (!fs.existsSync(file)) {
  console.error('Usage: grf <path-to-svg>')
  process.exit(1)
}

fs.createReadStream(file).pipe(concat(function(xml) {
  var parser = new DOMParser
  var serializer = new XMLSerializer
  var svg = parser.parseFromString(xml.toString(), 'text/xml')
  var anchor = svg.getElementsByTagName('svg')[0]
  var nodes = arrayify(anchor.childNodes)
  var groups = []

  // Empty out SVG, saving the groups.
  nodes.forEach(function(node) {
    if (/g/i.test(node.nodeName)) {
      groups.push(node.cloneNode(true))
    }
    anchor.removeChild(node)
  })

  groups.forEach(function(group, i) {
    var name = slugify(group.getAttribute('id') || ('group-' + i))
    var filepath = path.join(process.cwd(), name + '.svg')
    var style = group.getAttribute('style')

    if (style) {
      group.setAttribute('style',
        style.replace(/display:\s*none;?/i, '').trim()
      )
    }

    anchor.appendChild(group)
    fs.writeFileSync(filepath, serializer.serializeToString(svg))
    anchor.removeChild(group)
  })

  process.exit(0)
}))
