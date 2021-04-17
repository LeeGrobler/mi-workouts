let emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
let passwordRegex = new RegExp('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s).{8,128}') // no spaces, 1 X Uppercase, 1 X lower, 1 X Number, 8 characters;

if(process.env.NODE_ENV === 'development') passwordRegex = new RegExp('^.{6,}$');

export default {
  email: [
    v => !!v || 'Please enter your email',
    v => emailRegex.test(v) || 'Please enter a valid email',
  ],
  password: [
    v => !!v || 'Please enter your password',
    v => passwordRegex.test(v) || 'Please include the following in your password: 1 uppercase character, 1 lowercase character, 1 number, 8 characters minimum',
  ],
  resetPass1: (v1, v2) => [
    !!v1 || 'Please enter a new password',
    passwordRegex.test(v1) || 'Please include the following in your password: 1 uppercase character, 1 lowercase character, 1 number, 8 characters minimum'
  ],
  resetPass2: (v1, v2) => [
    !!v1 || 'Please enter a new password',
    passwordRegex.test(v1) || 'Please include the following in your password: 1 uppercase character, 1 lowercase character, 1 number, 8 characters minimum',
    (!v1 || !v2) || (v1 === v2) || 'Passwords do not match',
  ],
  required: val => [v => !!v || `Please enter a ${val}.`],
};
