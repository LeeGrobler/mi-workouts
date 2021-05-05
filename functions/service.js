const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const md5 = require('crypto-js/md5');
const mailgun = require('mailgun-js')({
  apiKey: functions.config().mailgun.key,
  domain: functions.config().mailgun.url
});

module.exports = {
  verifyCaptcha: async captcha => {
    return new Promise(async (resolve, reject) => {
      try {

        const res = await axios({
          method: 'POST',
          url: functions.config().recaptcha.url,
          params: {
            secret: functions.config().recaptcha.key,
            response: captcha
          }
        });

        const data = res.data || {};
        if(!data.success) return reject({ message: 'Recaptcha response not valid' });
        return resolve(data);
      } catch(err) {
        functions.logger.error('verifyCaptcha err:', err);
        return reject({ message: err.response ? err.response.data : err.message });
      }
    });
  },

  createContact: async params => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await admin.firestore().collection('contacts').doc(params.ref).set({
          ...params.email,
          date_created: admin.firestore.Timestamp.fromDate(params.timestamp.toDate()),
          user: params.auth ? params.auth.uid : null,
          status: 'created'
        });

        return resolve(res);
      } catch (err) {
        functions.logger.error('createContact err:', err);
        return reject(err);
      }
    });
  },

  createPayment: async (params, auth) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await admin.firestore().collection('payments').add({
          description: params.item_name,
          amount: Number(params.amount),
          status: 'created',
          user: auth ? auth.uid : null,
          date_created: admin.firestore.Timestamp.fromDate(new moment().toDate()),
          date_updated: admin.firestore.Timestamp.fromDate(new moment().toDate()),
        });

        return resolve(res);
      } catch (err) {
        functions.logger.error('createPayment err:', err);
        return reject(err);
      }
    });
  },

  generatePaymentSignature: async params => {
    return new Promise(async (resolve, reject) => {
      try {
        const passphrase = functions.config().payfast && functions.config().payfast.passphrase;

        let output = '';
        Object.keys(params).forEach(v => {
          if(!!params[v]) output += `${v}=${encodeURIComponent(params[v].trim())}&`;
          else console.log('nothing for', v, params[v]);
        });

        if(output.endsWith('&')) output = output.substring(0, output.length - 1);
        if(passphrase) output += `&passphrase=${encodeURIComponent(functions.config().payfast.passphrase.trim())}`;
        output = output.split('%20').join('+');

        console.log('output:', output);

        return resolve(md5(output).toString());
      } catch (err) {
        functions.logger.error('generatePaymentSignature err:', err);
        return reject(err);
      }
    });
  },

  getSupportAddresses: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await admin.firestore().collection('support_contacts').where("active", "==", true).get();
        return resolve([...new Set([functions.config().app.support_email, ...res.docs.map(v => v.data().email)])]);
      } catch(err) {
        functions.logger.error('getSupportAddresses err:', err);
        return reject(err);
      }
    });
  },

  compileHtml: async (emailKey, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const template = await admin.firestore().collection('email_templates').doc(emailKey).get();
        if(template.data()) {
          let html = template.data().body;
          (html.match(/[^{\}]+(?=})/g) || []).forEach(v => { html = data[v] ? html.replace(`{${v}}`, data[v]) : html });
  
          let subject = template.data().subject;
          (subject.match(/[^{\}]+(?=})/g) || []).forEach(v => { subject = data[v] ? subject.replace(`{${v}}`, data[v]) : subject });
  
          return resolve({ subject, html });
        } else return reject({ message: 'Email template not found.' });
      } catch (err) {
        functions.logger.error('compileHtml err:', err);
        return reject({ message: err.message });
      }
    });
  },

  sendEmail: data => {
    return new Promise((resolve, reject) => {
      mailgun.messages().send(data, (err, body) => {
        if(err) return reject({ message: 'Unable to send email.' });
        else return resolve(body);
      });
    });
  },
}