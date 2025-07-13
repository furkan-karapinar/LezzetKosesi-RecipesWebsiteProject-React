// utils.js
module.exports = {
  encodeId: (id) => { /*Buffer.from(id.toString()).toString('base64')*/ return id },
  decodeId: (str) => {
    try {
      return /*parseInt(Buffer.from(str, 'base64').toString()); */ str;
    } catch {
      return null;
    }
  }
};
