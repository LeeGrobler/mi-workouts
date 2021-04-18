const execa = require('execa');
const listr = require('listr');

const cmd = process.argv.find(v => v.indexOf('--cmd=') > -1).split('=')[1];
const env = process.argv.find(v => v.indexOf('--env=') > -1).split('=')[1];

if(cmd === 'serve' && env === 'uat') {
  console.log('serving uat');
} else if(cmd === 'serve' && env === 'prod') {
  console.log('serving prod');
} else if(cmd === 'deploy' && env === 'uat') {
  console.log('deploying uat');
} else if(cmd === 'deploy' && env === 'prod') {
  console.log('deploying prod');
}
