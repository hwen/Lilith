const schedule = require('node-schedule');

const config = require('../config.template');
const utils = require('./utils');
const scheduleRules = require('./schedule');
const serv = require('./service');

module.exports = bot => {
  const sendMesToGroups = mes => {
    config.groups.forEach(group => {
      bot('send_group_msg', {
        group_id: group,
        message: mes,
      }).catch(utils.handleErr);
    });
  };
  const likeWho = () => {
    const times = 1;
    config.likeUsers.forEach(async user => {
      console.log(`【like】 ${user} => ${times}`);
      try {
        await bot('send_like', {
          user_id: Number(user),
          times: times,
        });
      } catch (err) {
        if (err.retcode === -99) {
          return console.log(`【send_like 错误】非专业版没有权限...`);
        }
        utils.handleErr(err);
      }
    });
  };

  const dailyMesForGroup = async () => {
    const mes = await serv.yiyan();
    sendMesToGroups(
      `现在时间：${utils.formatDate('YYYY/MM/DD HH:mm:ss')}\n${
        mes.hitokoto
      }\n${utils.randomMes(config.favorites)}`
    );
    console.log(
      `现在时间：${utils.formatDate('YYYY/MM/DD HH:mm:ss')}\n${mes.hitokoto}`
    );
  };

  const mangaJobs = (mangaList = []) => {
    mangaList.forEach(async manga => {
      try {
        const resp = await serv[manga]();
        const lastUpdate = Date.now() - resp.last_updatetime * 1000;
        const formated = (lastUpdate / (1000 * 60 * 60)).toFixed(1);
        if (formated < 1.5) {
          // prettier-ignore
          let news = `【${resp.title}】${utils.get(resp.chapters[0], 'data[0].chapter_title')}更新啦！！\n`;
          // prettier-ignore
          news += `更新时间：${utils.formatDate('YYYY/MM/DD HH:mm', resp.last_updatetime * 1000)}\n`;
          news += `订阅数：${resp.subscribe_num}\n`;
          news += `评论数：${resp.comment.comment_count}\n\n`;
          news += `=== 最新评论 ===\n`;
          news += `${utils.get(resp.comment, 'latest_comment[0].content')}\n`;
          news += `by ${utils.get(resp.comment, 'latest_comment[0].nickname')}`;

          sendMesToGroups(news);
        } else {
          console.log(
            `【${utils.formatDate('YYYY/MM/DD HH:mm:ss')}】 ${
              resp.title
            } 没有更新...`
          );
        }
      } catch (err) {
        console.log('[dmzj] err');
        console.log('===== err =====');
        console.log(err);
      }
    });
  };

  // 每日报时
  scheduleRules.forEach(rule => {
    let job = schedule.scheduleJob(rule, () => {
      dailyMesForGroup();
      likeWho();
    });
  });

  // 检查漫画是否更新
  const checkManga = schedule.scheduleJob('30 * * * *', async () => {
    mangaJobs(['luchen', 'ayanashi']);
  });

  // 重启时，立即检查一次
  mangaJobs(['luchen', 'ayanashi']);
  // dailyMesForGroup();
  // likeWho();
  // job end
};
