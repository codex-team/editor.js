
module.exports = function (crypto, password, keyLen, ivLen) {
  keyLen = keyLen/8;
  ivLen = ivLen || 0;
  var ki = 0;
  var ii = 0;
  var key = new Buffer(keyLen);
  var iv = new Buffer(ivLen);
  var addmd = 0;
  var md, md_buf;
  var i;
  while (true) {
    md = crypto.createHash('md5');
    if(addmd++ > 0) {
       md.update(md_buf);
    }
    md.update(password);
    md_buf = md.digest();
    i = 0;
    if(keyLen > 0) {
      while(true) {
        if(keyLen === 0) {
          break;
        }
        if(i === md_buf.length) {
          break;
        }
        key[ki++] = md_buf[i];
        keyLen--;
        i++;
       }
    }
    if(ivLen > 0 && i !== md_buf.length) {
      while(true) {
        if(ivLen === 0) {
          break;
        }
        if(i === md_buf.length) {
          break;
        }
       iv[ii++] = md_buf[i];
       ivLen--;
       i++;
     }
   }
   if(keyLen === 0 && ivLen === 0) {
      break;
    }
  }
  for(i=0;i<md_buf.length;i++) {
    md_buf[i] = 0;
  }
  return {
    key: key,
    iv: iv
  };
};