#!/usr/bin/env node
const Now = require('now-client')
const minimist = require('minimist')
const path = require('path')
const os = require('os')
const chalk = require('chalk')

const getTeamId = () => {
  try {
    const configPath = path.join(os.homedir(), '.now.json')
    const currentTeam = require(configPath).currentTeam || {}
    if (currentTeam.id) {
      console.log(`${chalk.gray('Using team')} ${chalk.bold(currentTeam.name)}`)
    }
    return currentTeam.id || null
  } catch (err) {
    return null
  }
}

function main(token, teamId, deploymentName) {
  const now = new Now(token, teamId || getTeamId())

  return Promise.all([
    now.getAliases(),
    now.getDeployments()
  ]).then(([aliases, deployments]) =>
    deployments.filter(deploy =>
      !aliases.find(alias =>
        alias.deploymentId === deploy.uid
      ) && (
        !deploymentName || deploymentName === deploy.name
      )
    )
  ).then(noAliasDeployments => {
    if (noAliasDeployments.length === 0) {
      return Promise.resolve(noAliasDeployments)
    }

    console.log('\nDeleting:')
    noAliasDeployments.forEach(deploy => console.log(`${chalk.gray(deploy.uid)}\t${chalk.gray(deploy.state)}\t${deploy.url}`))

    const uidsToDelete = noAliasDeployments.map(deploy => now.deleteDeployment(deploy.uid))
    return Promise
      .all(uidsToDelete)
      .then(() => Promise.resolve(noAliasDeployments))
  })
}

const argv = minimist(process.argv.slice(2), {
  alias: {
    t: 'token',
    n: 'name',
    tm: 'team',
  },
})

main(argv.t, argv.tm, argv.n)
  .then(res => console.log(`\nDeleted ${chalk.bold(res.length)} deployments`))
  .catch(e => console.error(e))
