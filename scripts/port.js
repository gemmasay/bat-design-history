/*
  Usage:
  * Put images into `app/images/directory-name`
  * Name them with 01-, 02- prefixes

  Run:
  node scripts/port.js find-teacher-training/name-of-directory-holding-images
*/

// Dependencies
const fs = require('fs')
const { execSync } = require('child_process')
const TurndownService = require('turndown')

// Arguments
const directoryName = process.argv.slice(-1)[0]
warnIfNoArguments()

const deepestDirectory = directoryName.split('/').pop()
const postDirectory = `app/posts/${directoryName}`.replace('/' + deepestDirectory, '')

// Get current template
const current = fs.readFileSync(`../bat-design-history/app/views/${directoryName}/index.html`, 'utf8')

// Get date from Git log for now
// const date = execSync(`cd ../bat-design-history; git log --date=short app/views/${directoryName}/ | grep 'Date' | tail -1`).toString().replace('Date: ', '').trim()
// const date = execSync(`cd ../search-and-compare-prototype; git log --date=short app/views/history/${deepestDirectory}/ | grep 'Date' | tail -1`).toString().replace('Date: ', '').trim()
const date = execSync(`cd ../manage-courses-prototype; git log --date=short app/views/history/${deepestDirectory}/ | grep 'Date' | tail -1`).toString().replace('Date: ', '').trim()

// Get title
const title = current.match(/title\s=\s'(.+)' %}/)[1]
// const title = "Alpha version 4"

// Get screenshots
let screenshots = current.match(/text: '.+',\s?id: '.+'/g)

if (screenshots) {
  screenshots = screenshots.map(item => {
    const matches = item.match(/text: '(.+)',\s?id: '(.+)'/)

    return {
      title: matches[1],
      src: matches[2]
    }
  })
} else {
  screenshots = []
}


// Convert content into markdown
var turndownService = new TurndownService({ headingStyle: 'atx' })
const markdown = turndownService.turndown(current)

// Run
function start () {
  makeDirectories()
  generatePage()
}

function warnIfNoArguments (title) {
  // TODO: Use a better check for an argument
  if (directoryName.startsWith('/Users')) {
    console.log('No arguments set')
    console.log('Please set a title: `node scripts/screenshot.js "Title of page"`')
  }
}

function makeDirectories () {
  if (!fs.existsSync(postDirectory)) {
    fs.mkdirSync(postDirectory)
  }
}

function generatePage () {
  var template = ''
  const templateStart = `---
title: ${title}
description:
tags:
---

${markdown}

{% from "screenshots/macro.njk" import appScreenshots with context %}
{{ appScreenshots({
  items: [`

  const templateEnd = `
  ]
}) }}
`

  screenshots.forEach(function (item, index) {
    template += `${index > 0 ? ', ' : ''}
    {
      text: "${item.title}",
      img: { src: "${item.src}.png" }
    }`
  })

  const filename = `${postDirectory}/${date}-${deepestDirectory}.md`

  fs.writeFile(
    filename,
    templateStart + template + templateEnd,
    function (err) {
      if (err) {
        console.error(err)
      }
      console.log(`Page generated: ${filename}`)
    }
  )
}

start()
