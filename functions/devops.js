const fs = require('fs');
const env = process.argv.find(v => v.indexOf('--env=') > -1).split('=')[1];
const inv = env === 'uat' ? 'prod' : 'uat'; // inv == inverse

console.log('checking configs & certs');

if(!fs.existsSync(`./functions/.runtimeconfig ${inv}.json`)) {
  console.log(`\nrenaming config to ${inv}`);
  fs.renameSync('./functions/.runtimeconfig.json', `./functions/.runtimeconfig ${inv}.json`);
  console.log(`renaming ${env} to config`);
  fs.renameSync(`./functions/.runtimeconfig ${env}.json`, './functions/.runtimeconfig.json');
}

if(!fs.existsSync(`./functions/certs/cert ${inv}.json`)) {
  console.log(`\nrenaming cert to ${inv}`);
  fs.renameSync('./functions/certs/cert.json', `./functions/certs/cert ${inv}.json`);
  console.log(`renaming ${env} to cert`);
  fs.renameSync(`./functions/certs/cert ${env}.json`, './functions/certs/cert.json');
}

console.log('\ndone!');

// -------------

// this goes in top-level package.json's scripts section
// "func-serve-uat": "node ./functions/devops.js --cmd=serve --env=uat",
// "func-serve-prod": "node ./functions/devops.js --cmd=serve --env=prod",
// "func-deploy-uat": "node ./functions/devops.js --cmd=deploy --env=uat",
// "func-deploy-prod": "node ./functions/devops.js --cmd=deploy --env=prod"

// const fs = require('fs');
// const cmd = process.argv.find(v => v.indexOf('--cmd=') > -1).split('=')[1];
// const env = process.argv.find(v => v.indexOf('--env=') > -1).split('=')[1];

// if(cmd === 'serve' && env === 'uat') {

//   console.log('checking configs & certs');

//   if(!fs.existsSync('./functions/.runtimeconfig prod.json')) {
//     console.log('\nrenaming config to prod');
//     fs.renameSync('./functions/.runtimeconfig.json', './functions/.runtimeconfig prod.json');
//     console.log('renaming uat to config');
//     fs.renameSync('./functions/.runtimeconfig uat.json', './functions/.runtimeconfig.json');
//   }

//   if(!fs.existsSync('./functions/certs/cert prod.json')) {
//     console.log('\nrenaming cert to prod');
//     fs.renameSync('./functions/certs/cert.json', './functions/certs/cert prod.json');
//     console.log('renaming uat to cert');
//     fs.renameSync('./functions/certs/cert uat.json', './functions/certs/cert.json');
//   }

//   // TODO: when ctrl+c-ing, it doesn't properly kill the server, so the port stays in use and throws an error next time you run it. if
//   // you wanna be a champ and get this problem fixed, you'd be a real doll. in the meantime this file will be used only to rename files
//   // console.log('\nserving local emulator in uat [ firebase emulators:start --only functions ]');
//   // execa('firebase', ['emulators:start', '--only', 'functions']).stdout.pipe(process.stdout)

//   console.log('\ndone!');
  
// } else if(cmd === 'serve' && env === 'prod') {
//   console.log('serving prod');
// } else if(cmd === 'deploy' && env === 'uat') {
//   console.log('deploying uat');
// } else if(cmd === 'deploy' && env === 'prod') {
//   console.log('deploying prod');
// }
