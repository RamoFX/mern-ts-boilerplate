const ml = (...items) => items.join('\n')

const getParams = fn => {
  const fnRegex = {
    comments: /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
    arguments: /([^\s,]+)/g
  }

  const fnStr = fn
    .toString()
    .replace(fnRegex.comments, '')

  const fnArgs = fnStr
    .slice(
      fnStr.indexOf('(')+1,
      fnStr.indexOf(')')
    )
    .match(fnRegex.arguments)

  return fnArgs || []
}

// pass function in init()
// parameters as terminal arguments
// path in this context
const init = fn => {
  const args = {
    expected: getParams(fn),
    current: process.argv.slice(2)
  }

  if(args.expected.length == args.current.length) {

    fn.bind({path: process.env.PWD})(...args.current)

  } else {

    console.trace(ml(
      'Argument error.',
      `    Expected: ${ args.expected }`,
      `    Got: ${ args.current }\n`
    ))

  }
}



module.exports = {
  ml,
  getParams,
  init
}
