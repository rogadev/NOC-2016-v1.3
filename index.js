const fs = require('fs')

const rawData = require('./stage3.json')

const codes = new Set(rawData.map((x) => x.code))

const output = []

for (const code of codes) {
  const newGroup = {
    code,
    title: rawData.find((x) => x.code === code).title,
    examples: rawData
      .filter((x) => x.code === code)
      .filter(
        (x) => x.type === 'Illustrative example(s)' || x.type === 'All examples'
      )
      .map((x) => x.desc.trim()),
    duties: rawData
      .filter((x) => x.code === code)
      .filter((x) => x.type === 'Main duties')
      .map((x) => x.desc.trim()),
    requirements: rawData
      .filter((x) => x.code === code)
      .filter((x) => x.type === 'Employment requirements')
      .map((x) => x.desc.trim()),
  }
  output.push(newGroup)
}

fs.writeFileSync('./stage4.json', JSON.stringify(output, null, 2))
