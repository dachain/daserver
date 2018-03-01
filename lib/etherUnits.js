'use strict';
var BigNumber = require('bignumber.js');
/*
https://github.com/ethereumproject/Peridot/blob/master/public/js/etherUnits.js
* https://github.com/ethereumproject/Peridot
* */
var etherUnits = function() {}
etherUnits.unitMap = {
    'wei': '1',
    'kwei': '1000',
    'ada': '1000',
    'femtoether': '1000',
    'mwei': '1000000',
    'babbage': '1000000',
    'picoether': '1000000',
    'gwei': '1000000000',
    'shannon': '1000000000',
    'nanoether': '1000000000',
    'nano': '1000000000',
    'szabo': '1000000000000',
    'microether': '1000000000000',
    'micro': '1000000000000',
    'finney': '1000000000000000',
    'milliether': '1000000000000000',
    'milli': '1000000000000000',
    'ether': '1000000000000000000',
    'kether': '1000000000000000000000',
    'grand': '1000000000000000000000',
    'einstein': '1000000000000000000000',
    'mether': '1000000000000000000000000',
    'gether': '1000000000000000000000000000',
    'tether': '1000000000000000000000000000000'
};
etherUnits.getValueOfUnit = function(unit) {
    unit = unit ? unit.toLowerCase() : 'ether';
    var unitValue = this.unitMap[unit];
    if (unitValue === undefined) {
        throw new Error(globalFuncs.errorMsgs[4] + JSON.stringify(this.unitMap, null, 2));
    }
    return new BigNumber(unitValue, 10);
}
etherUnits.fiatToWei = function(number, pricePerEther) {
    var returnValue = new BigNumber(String(number)).div(pricePerEther).times(this.getValueOfUnit('ether')).round(0);
    return returnValue.toString(10);
}

etherUnits.toFiat = function(number, unit, multi) {
    var returnValue = new BigNumber(this.toEther(number, unit)).times(multi).round(5);
    return returnValue.toString(10);
}

etherUnits.toEther = function(number, unit) {
    var returnValue = new BigNumber(this.toWei(number, unit)).div(this.getValueOfUnit('ether'));
    return returnValue.toString(10);
}

etherUnits.toWei = function(number, unit) {
    var returnValue = new BigNumber(String(number)).times(this.getValueOfUnit(unit));
    return returnValue.toString(10);
}


module.exports = etherUnits;

//===============
//==https://github.com/ethereumproject/Peridot/blob/master/public/js/web3utils.js
/**
 * Checks if the given string is strictly an address
 *
 * @method isStrictAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
 */
var isStrictAddress = function (address) {
    return /^0x[0-9a-f]{40}$/i.test(address);
};

/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
 */
var isAddress = function (address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        // Otherwise check each case
        return false;
    }
};

var isTransaction = function (tx) {
    if (!/^(0x)?[0-9a-f]{64}$/i.test(tx)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{64}$/.test(tx) || /^(0x)?[0-9A-F]{64}$/.test(tx)) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        // Otherwise check each case
        return false;
    }
};