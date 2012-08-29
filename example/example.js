var pushup = require('../index.js')
  , getProps = require('../lib/getProps.js')

var p = pushup(getProps())

p.on('entry', function (entry) {
  entry.on('progress', function (prog) {
    console.log('%s %d',  entry.name, prog.percent)
  })
})

p.on('error', function (err) {
  console.error(err)
})

p.on('response', function (res) {
  res.on('end', function () {
    console.log('OK')
  })
})
