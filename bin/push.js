// push - push latest commit to S3

var show = require('../lib/show.js')
  , pushup = require('../index.js')

module.exports = push

function push (props, repo) {
  show(repo)
    .pipe(pushup(props))
    .pipe(process.stdout)
}
