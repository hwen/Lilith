const axios = require('axios');

const yiyan = async () => {
  const url = 'https://v1.hitokoto.cn/';
  const resp = await axios.get(url);
  if (resp.data) {
    return resp.data;
  }
  return {
    hitokoto: 'quq 感觉电池怪怪的，到底发生了什么',
  };
};

module.exports = {
  yiyan,
};
