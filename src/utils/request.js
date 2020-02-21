
const fetch = require('node-fetch');

const send = (src, args, successFunc, failFunc) => {

  let invalid = false;

  fetch(src, args)
  .then(res => {

    if (res.status !== 200) {
      invalid = true;
    }
    return res.json();
  })
  .then(json => {

    if (invalid) {
      failFunc(json);
    }
    else {
      successFunc(json);
    }
  });
}

exports.send = send;