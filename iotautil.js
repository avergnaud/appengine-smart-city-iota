// Require the use of IOTA library
const Iota = require("@iota/core");
const Converter = require("@iota/converter");
//const remoteCurl = require('@iota/curl-remote')
require("dotenv").config();

// Create a new instance of the IOTA class object.
// Use 'provider' variable to specify which Full Node to talk to
const iota = Iota.composeAPI({
  provider: "https://nodes.thetangle.org:443"
});

// Patch the current IOTA instance
//remoteCurl(iota, `https://powbox.testnet.iota.org`, 500)

const seed = process.env.SEED;

// Call the 'getNodeInfo call to check that the node is working
/*
iota.getNodeInfo()
    .then(info => console.log(info))
    .catch(err => {})
*/

const address =
  "GHLEMUXUIYJK9SKXOUMNEKZBRDHZVFUURXOYMQQODSWEGYRROOGGILVYTGTCCLOYDCETCKHUT9LRXJMMD";

  module.exports = {
    send: function (name) {
      // whatever
      //const tag = name;
      const tag = Converter.asciiToTrytes("catamania")

      const message = Converter.asciiToTrytes(name)
      console.log("message trytes " + message)
      
      const transfers = [
        {
          value: 0,
          address: address,
          message: message,
          tag: tag
        }
      ];
      
      return iota
        .prepareTransfers(seed, transfers)
        .then(trytes => iota.sendTrytes(trytes, 3, 14));

        /*
        .then(bundle => {
          console.log(bundle);
        })
        .catch(err => {
          console.log(err);
        });
        */
    }
  };


