const path = require('path');
exports.get404 = (req, res, next) => {
  res.sendFile(path.join(path.dirname(process.mainModule.filename), 'views','404.html'));
};
