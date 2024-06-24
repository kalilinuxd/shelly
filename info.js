const fs = require('fs');
const path = require('path');

fs.rename('./cmds/shelly.zip', './shelly.zip', function(err) {
  if (err) throw err;
  console.log('File moved successfully');
});