const path = require('path')
const solc = require('solc')
const fs = require('fs-extra')

/**
 * Define paths
 */
const buildPath = path.resolve(__dirname, 'build')
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol')
const source = fs.readFileSync(campaignPath, 'utf-8')

/**
 * Remove build folder
 */
fs.removeSync(buildPath)


/**
 * Compile contracts
 */
const output = solc.compile(source, 1).contracts

/**
 * Ensure that the build folder is created again
 */
fs.ensureDirSync(buildPath)

/**
 * Loop through each contract and output it as a json
 */
for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, `${contract.replace(':', '')}.json`),
    output[contract]
  )
}