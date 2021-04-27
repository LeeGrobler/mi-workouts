const functions = require('firebase-functions');
const admin = require('firebase-admin');
const _ = require('lodash');
const moment = require('moment');
const { verifyCaptcha, createContact, getSupportAddresses, compileHtml, sendEmail } = require('./service');

// NB: remember to update this according to which env you're deploying to!
admin.initializeApp({ credential: admin.credential.cert(require('./certs/cert.json')) });

/*
  WORKING WITH ENVS:
  - by default, commands will run against UAT (mi-workouts-uat-3b892)
  - to specify project against which to run a command, add "--project=alias" to the command
  - to permanently set the project against which to run a command (so you don't have to use --project flag) run "firebase use alias"
  - available aliases can be found in /.firebaserc
  - recommendation: when starting development, run "firebase use alias" then when deploying deploy current project without flag, before deploying other project with flag

  - currently there's no way to automatically switch between prod and uat cert and runtimeconfig on serve/deploy, so you'll have to do that yourself.
*/

exports.contact = functions.region('europe-west2').https.onCall(async ({ name, email, message, token }, { auth }) => {
  if(name && email && message && token) {
    const timestamp = new moment();
    const ref = timestamp.format('YYMMDDHHmmss');
    
    try {
      await verifyCaptcha(token);
      await createContact({ ref, timestamp, email: { name, email, message }, auth });
      const supportAddresses = await getSupportAddresses();

      // sends emails to support
      const adminEmail = await compileHtml('contact_admin', { name, ref, email, message, appName: functions.config().app.name });
      await Promise.all(supportAddresses.map(v => sendEmail({ from: 'noreply@codename-interns.com', to: v, subject: adminEmail.subject, html: adminEmail.html })));

      // sends email to client
      const clientEmail = await compileHtml('contact_client', { name, ref, appName: functions.config().app.name });
      await sendEmail({ from: functions.config().app.support_email, to: email, subject: clientEmail.subject, html: clientEmail.html });

      return { status: 'success', message: 'Thank you for your message. We will get back to you as soon as we can.' };
    } catch (err) {
      return { status: 'failed', message: `An error has occurred: "${err.message}".` };
    }
  } else return { status: 'failed', message: 'Not all required parameters have been set. Please enter your Name, Email Address and Message, and try again. If the problem persists, please reload the page and try again.' };
});

exports.validateRecaptcha = functions.region('europe-west2').https.onCall(async token => {
  try {
    if(token) return await verifyCaptcha(token);
    else return { status: 'failed', message: 'reCAPTCHA token not present.' };
  } catch (err) {
    return { status: 'failed', message: err.message };
  }
});

// exports.dailyTasks = functions.region('europe-west2').pubsub
// .schedule('every 24 hours 00:00').timeZone('Africa/Johannesburg')
// .onRun(async () => {
//   try {
//     const { users } = await admin.auth().listUsers();

//     await admin.auth().deleteUsers(users.reduce((s, v) => {
//       if(v.providerData.length <= 0) {
//         const lastRefresh = new moment(v.metadata.lastRefreshTime);
//         const duration = moment.duration(new moment().diff(lastRefresh));
//         if(duration.asDays() >= 30) s.push(v);
//       }
//       return s;
//     }, []));

//     return { status: 'success' };
//   } catch (err) {
//     console.log('dailyTasks err:', err);
//     return { status: 'failed', message: err.message };
//   }
// });
