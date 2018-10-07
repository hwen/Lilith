const axios = require('axios');
const utils = require('./utils');
const dmzjHeaders = {
  Accept: `*/*`,
  'Accept-Encoding': 'br, gzip, deflate',
  'Accept-Language': 'zh-Hans-CN;q=1',
  'User-Agent': 'Platform/2.5.5(iPhone;iOS 11.4.1; Scale/3.00)',
};

const yiyan = async () => {
  /**
   * a - 动画
   * b - 漫画
   * c - game
   * d - 小说
   * e - 原创
   */
  const type = utils.randomMes(['a', 'b', 'c']);
  const url = `https://v1.hitokoto.cn/?c=${type}`;
  const resp = await axios.get(url);
  if (resp.data) {
    return resp.data;
  }
  return {
    hitokoto: 'quq 感觉电池怪怪的，到底发生了什么',
  };
};

const luchen = async () => {
  const url =
    'https://v3api.dmzj.com/comic/42604.json?channel=ios&version=2.5.5';
  const resp = await axios.get(url, {
    header: dmzjHeaders,
  });

  return resp.data;
};

const ayanashi = async () => {
  const url =
    'https://v3api.dmzj.com/comic/45941.json?channel=ios&version=2.5.5';
  const resp = await axios.get(url, {
    header: dmzjHeaders,
  });

  return resp.data;
};

module.exports = {
  yiyan,
  luchen,
  ayanashi,
};
