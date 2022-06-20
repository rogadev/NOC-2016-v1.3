const fs = require('fs')

const program_list = require('./input/programs_raw.json')
const program_areas = require('./input/program_area.json')

const output = []

const credentialIgnoreList = [
  'non-credit',
  'graduate',
  'post-degree',
  'transfer',
  'advanced',
]

for (const program of program_list) {
  // Format each program credential for evaluation.
  const credential = program.credential.toLowerCase().trim()
  // Evaluate each credential to ensure they are not credentials we are ignoring for the purpose of this JSON list.
  if (
    credential === '' ||
    credentialIgnoreList.some((ignoredKeyword) => {
      return credential.includes(ignoredKeyword)
    })
  ) {
    // Skip this program if we are meant to ignore it - don't add it to our output.
    continue
  }
  // Otherwise, we have a good program to evaluate.
  const newProgram = {}

  // Title
  newProgram.title = program.title
  // NID
  newProgram.nid = Number(program.nid)
  // Duration & Credential
  const credentialItems = program.credential.trim().split(' ')
  newProgram.duration =
    credentialItems.length > 1 ? credentialItems[0] + "'s" : null
  newProgram.credential =
    credentialItems.length > 1 ? credentialItems[1] : program.credential
  // Program Area
  const programTitle =
    program_areas.find((area) => area.nid === program.program_area)?.title ??
    'Unknown'
  newProgram.program_area = {
    nid: Number(program.program_area),
    title: programTitle,
  }
  // VIU Search Keywords
  newProgram.viu_search_keywords = program.field_viu_search_keywords
  // NOC Search Keywords
  newProgram.noc_search_keywords = []

  // For each good, formatted program, add it to our output list of formatted programs.
  output.push(newProgram)
}

fs.writeFileSync('./programs.json', JSON.stringify(output, null, 2))
