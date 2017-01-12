/**
 * Digits.
 * @const
 */
var DIGITS = '0123456789';

/**
 * Generates random int within the range [min, max]
 * @param min the minimum value for the generated number
 * @param max the maximum value for the generated number
 * @returns random int number
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get random element from array or string.
 * @param {Array|string} arr source
 * @returns array element or string character
 */
function randomElement(arr) {
    return arr[randomInt(0, arr.length -1)];
}

/**
 * Returns a random string of digits with length 'len'.
 * The string will be with random numbers of count 'len' - 2, and the last
 * two digits will be a check sum using the "ISO 7064 Mod 97,10" algorithm.
 * In order to verify it the formula is:
 * (num_to_check % 97) == 1
 * @param len the length.
 */
function randomDigitString(len) {
    var ret = '';
    var randomLen = len - 2;
    while (randomLen--) {
        ret += this.randomElement(DIGITS);
    }
    var num = parseInt(ret);
    var verifyNumber = (98 - (num * 100) % 97) % 97;
    return num.toString()
        + (verifyNumber < 10 ? '0' : '') // adds leading zero if single digit
        + verifyNumber.toString();
}
