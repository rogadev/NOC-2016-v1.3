const { raw } = require('express')
const fs = require('fs')

const rawData = require('./stage4.json')

const output = []

rawData.forEach((i) => {
  const requirements = i.requirements
  const educationalRequirements = []
  const otherRequirements = []
  const experienceRequirements = []
  let doesRequireExperience = false

  requirements.forEach((req) => {
    if (requiresEducation(req)) {
      educationalRequirements.push(req)
    } else if (requiresExperience(req)) {
      experienceRequirements.push(req)
    } else {
      otherRequirements.push(req)
    }
    if (requiresExperience(req)) {
      doesRequireExperience = true
    }
  })

  const newGroup = {
    code: i.code,
    group: i.title,
    examples: i.examples,
    duties: i.duties,
    education: educationalRequirements,
    experience: experienceRequirements,
    requirements: otherRequirements,
    requires_experience: doesRequireExperience,
  }
  output.push(newGroup)
})

/**
 *
 */
function requiresEducation(rawPhrase) {
  const phrase = rawPhrase
    .toLowerCase()
    .replace(',', '')
    .replace('.', '')
    .trim()
  const keywords = [
    'diploma',
    'degree',
    'certificate',
    'certificates',
    'certification',
    'certified',
    'red seal',
    'apprenticeship program',
    'completion of college',
    'completion of a college',
    'completion of university',
    'completion of a university',
    'specific college training',
    'specific university training',
    'technical institution',
    'post-secondary',
    'secondary school',
  ]
  const absolutes = [
    'is required',
    'usually required',
    'may be required',
    'often required',
  ]
  return (
    keywords.some((keyword) => phrase.includes(keyword)) &&
    absolutes.some((key) => phrase.includes(key))
  )
}

/**
 * Determine if the given phrase contains a combination of keywords that suggests that experience either "is" or "is usually" required to obtain this role.
 * @param    {String}  rawPhrase  - The given phrase to evaluate.
 * @returns  {Boolean}            -True if phrase suggests that experience is required, else false.
 */

function requiresExperience(rawPhrase) {
  const phrase = rawPhrase
    .toLowerCase()
    .replace(',', '')
    .replace('.', '')
    .trim()
  const keywords = [
    'years of managerial experience',
    'years of experience',
    'experience in the type of work supervised is required',
    'year of experience',
  ]
  const absolutes = ['is required', 'usually required', 'often required']
  return (
    keywords.some((keyword) => phrase.includes(keyword)) &&
    absolutes.some((key) => phrase.includes(key))
  )
}

fs.writeFileSync('./stage5.json', JSON.stringify(output, null, 2))
