module.exports.DEFAULT_POINT = 1;

module.exports.LOG_TABLE_NAME = process.env.LOG_TABLE_NAME;
module.exports.MAX_POINT_PER_DAY = process.env.MAX_POINT_PER_DAY;
module.exports.REACT_SYMBOL = process.env.REACT_SYMBOL;
module.exports.REACT_NEGATIVE_SYMBOL = process.env.REACT_NEGATIVE_SYMBOL;
module.exports.REWARD_SYMBOL = process.env.REWARD_SYMBOL || 'candy';
module.exports.REWARD_NAME = process.env.REWARD_NAME || 'candy';
module.exports.REWARD_PLURAL = process.env.REWARD_PLURAL || 'candies';

// slack
module.exports.VERIFICATION_TOKEN = process.env.VERIFICATION_TOKEN;

module.exports.LIQUID_VALUES = {
  CUSTOMER_CENTRIC: ['customer centric', 'customer', 'centric'],
  UNITED: ['united'],
  IMPACTFUL: ['impactful'],
  INNOVATIVE: ['innovative'],
};

module.exports.VALUE_SYMBOL_LIST = [
  'heart_eyes',
  'value_b',
  'value_c',
  'value_d',
];
