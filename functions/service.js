const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
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
        console.log('verifyCaptcha err:', err);
        return reject({ message: err.response ? err.response.data : err.message });
      }
    });
  },

  createContact: async params => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          ...params.email,
          timestamp: admin.firestore.Timestamp.fromDate(params.timestamp.toDate()),
          user: params.auth ? params.auth.uid : null,
          status: 'created'
        };
  
        const res = await admin.firestore().collection('contacts').doc(params.ref).set(data);
        return resolve(res);
      } catch (err) {
        console.log('createContact err:', err);
        return reject({ message: err.message });
      }
    });
  },

  getSupportAddresses: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await admin.firestore().collection('support_contacts').where("active", "==", true).get();
        return resolve([...new Set([functions.config().app.support_email, ...res.docs.map(v => v.data().email)])]);
      } catch(err) {
        console.log('getSupportAddresses err:', err);
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
        console.log('compileHtml err:', err);
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