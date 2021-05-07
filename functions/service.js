const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const md5 = require('crypto-js/md5');
const dns = require('dns');
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

  generatePaymentSignature: async (params, includeEmpty = false) => {
    return new Promise(async (resolve, reject) => {
      try {
        const passphrase = functions.config().payfast.passphrase;

        let output = '';
        Object.keys(params).forEach(v => {
          if((includeEmpty || (!includeEmpty && !!params[v])) && v !== 'signature' ) {
            output += `${v}=${encodeURIComponent(params[v].trim())}&`;
          }
        });

        if(output.endsWith('&')) output = output.substring(0, output.length - 1);
        if(passphrase) output += `&passphrase=${encodeURIComponent(functions.config().payfast.passphrase.trim())}`;
        output = output.split('%20').join('+');

        return resolve({
          output,
          hash: md5(output).toString()
        });
      } catch (err) {
        functions.logger.error('generatePaymentSignature err:', err);
        return reject(err);
      }
    });
  },

  completePayment: async req => {
    return new Promise(async (resolve, reject) => {
      try {
    
        const payment = await admin.firestore().collection('payments').doc(req.body.m_payment_id).get();
        if(!payment.exists) return resolve({ code: 404, status: 'failed', message: 'not found' });
    
        // compare payment hashes
        const sig = await module.exports.generatePaymentSignature(req.body, true);
        if(req.body.signature !== sig.hash) {
          await module.exports.updatePayment(payment, 'hash mismatch', req.body);
          return resolve({ code: 400, status: 'failed', message: 'hash mismatch' });
        }
    
        // confirm request sender
        const reqIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // i can see it's deprecated, but it's what's in the docs: https://developers.payfast.co.za/docs#step_4_confirm_payment
        const validPayfastHosts = ['www.payfast.co.za', 'sandbox.payfast.co.za', 'w1w.payfast.co.za', 'w2w.payfast.co.za'];
        let validIps = [];
    
        try {
          for(let key in validPayfastHosts) {
            const ips = await module.exports.ipLookup(validPayfastHosts[key]);
            validIps = [...validIps, ...ips];
          }
        } catch (err) {
          console.log('domain lookup err:', err);
        }
    
        validIps = [...new Set(validIps)];
        if(!validIps.includes(reqIp)) {
          await module.exports.updatePayment(payment, 'unknown sender', req.body);
          return resolve({ code: 400, status: 'failed', message: 'unknown sender' });
        }
    
        // compare amounts
        if(Math.abs(parseFloat(payment.data().amount) - parseFloat(req.body.amount_gross)) > 0.01) {
          await module.exports.updatePayment(payment, 'amount mismatch', req.body);
          return resolve({ code: 400, status: 'failed', message: 'amount mismatch' });
        }
    
        // validate received params against payfast
        const pfResult = await axios
        .post(`${functions.config().payfast.url}/eng/query/validate`, sig.output)
        .then(res => res.data).catch(err => {
          functions.logger.error('pfResult err:', err);
          return 'error';
        });

        if(!pfResult === 'VALID') {
          await module.exports.updatePayment(payment, 'confirmation unobtainable', req.body);
          return resolve({ code: 400, status: 'failed', message: 'confirmation unobtainable' });
        }

        // payment complete - update and return
        await module.exports.updatePayment(payment, req.body.payment_status.toLowerCase(), req.body);
        return resolve({ code: 200, status: 'success' });
      } catch (err) {
        functions.logger.error('completePayment err:', err);
        return reject(err);
      }
    });
  },

  updatePayment: (payment, status, payfastDump) => {
    return new Promise(async (resolve, reject) => {
      try {
        const paymentsRef = admin.firestore().collection('payments').doc(payment.id);

        await paymentsRef.update({
          ...payment.data(), status,
          date_updated: admin.firestore.Timestamp.fromDate(new moment().toDate()),
        });

        await paymentsRef.collection('payfast_dump').add(payfastDump);

        return resolve();
      } catch(err) {
        functions.logger.error('updatePayment err:', err);
        return reject(err);
      }
    });
  },

  ipLookup: domain => {
    return new Promise(async (resolve, reject) => {
      try {
        dns.lookup(domain, { all: true }, (err, addr, fam) => {
          if(err) return reject(err);
          return resolve(addr.map(v => v.address))
        });
      } catch(err) {
        functions.logger.error('ipLookup err:', err);
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