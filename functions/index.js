const functions = require('firebase-functions');
const admin = require('firebase-admin');
const _ = require('lodash');
const moment = require('moment');
const { verifyCaptcha, createContact, createPayment, getSupportAddresses, compileHtml, sendEmail, generatePaymentSignature } = require('./service');

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

exports.generatePayment = functions.region('europe-west2').https.onCall(async (req, { auth }) => {
  try {
    await verifyCaptcha(req.token);

    const payment = await createPayment(req, auth);
    const payfastParams = _.pick(req, ['merchant_id', 'merchant_key', 'return_url', 'cancel_url', 'notify_url', 'name_first', 'name_last', 'email_address', 'm_payment_id', 'amount', 'item_name']);
    payfastParams.m_payment_id = payment.id;

    const hash = await generatePaymentSignature(payfastParams);
    return {
      status: 'success',
      response: { m_payment_id: payment.id, hash }
    };
  } catch (err) {
    functions.logger.error('generatePayment err:', err);
    return { status: 'failed', message: err.message };
  }
});

/*
  to run this locally:
  - start the emulator, as per normal: firbase emulators:start --only functions
  - in a new terminal, run ` firebase functions:shell `
  - once it starts up, enter the function name you want to run, e.g. ` dailyTasks(); `
*/

exports.dailyTasks = functions
.region('europe-west2')
.pubsub
.schedule('every day 00:00')
.timeZone('Africa/Johannesburg')
.onRun(async () => {
  try {
    functions.logger.log(`account deletion started: ${new moment().format('DD/MM/YYYY HH:mm:ss')}`);

    const { users } = await admin.auth().listUsers();
    const accounts = users.reduce((s, v) => {
      if(v.providerData.length === 0) {
        const lastRefresh = new moment(v.metadata.lastRefreshTime);
        const duration = moment.duration(new moment().diff(lastRefresh));
        if(duration.asDays() >= 30) s.push(v);
      }
      return s;
    }, []);

    functions.logger.log('deleting accounts:', accounts.map(v => v.uid));
    await admin.auth().deleteUsers(accounts);

    functions.logger.log(`account deletion completed: ${new moment().format('DD/MM/YYYY HH:mm:ss')}`);
    return { status: 'success' };
  } catch (err) {
    functions.logger.error('dailyTasks err:', err);
    return { status: 'failed', message: err.message };
  }
});
