const CQHttp = require('cqhttp');
const schedule = require('node-schedule');

const config = require('../config.template');
const utils = require('./utils');
const scheduleRules = require('./schedule');
const serv = require('./service');

const bot = new CQHttp({
  apiRoot: config.host,
  accessToken: config.token,
  secret: config.secret,
});

bot.on('request', async ctx => {
  console.log('==== request =====');
  console.log(ctx);
});

bot.on('notice', async ctx => {
  if (ctx.notice_type === 'group_increase') {
    // 处理群成员添加事件
    const member = await bot('get_group_member_info', {
      group_id: ctx.group_id,
      user_id: ctx.user_id,
    });
    const groupInfo = await bot('_get_group_info', {
      group_id: ctx.group_id,
    });

    const name = member.nickname || '新人';
    const area = member.area ? `[${member.area}]` : '';
    bot('send_group_msg_async', {
      group_id: ctx.group_id,
      message: `欢迎 ${name}${area} 加入${groupInfo.group_name}～\n吾辈是${
        groupInfo.group_name
      }看板娘莉莉丝 Hi~ o(*￣▽￣*)ブ`,
    });
  }
  // 忽略其它事件
});

const sendMesToGroups = mes => {
  config.groups.forEach(group => {
    bot('send_group_msg_async', {
      group_id: group,
      message: mes,
    });
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

scheduleRules.forEach(rule => {
  let job = schedule.scheduleJob(rule, () => {
    dailyMesForGroup();
  });
});

var checkManga = schedule.scheduleJob('30 * * * *', async () => {
  try {
    const resp = await serv.checkLuChen();
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
      console.log(`【${utils.formatDate('YYYY/MM/DD HH:mm:ss')}】 没有更新...`);
    }
  } catch (err) {
    console.log('[dmzj] err');
    console.log('===== err =====');
    console.log(err);
  }
});

bot.listen(config.port, '127.0.0.1', () => {
  console.log(`======== listening ${config.port}========`);
  // prettier-ignore
  console.log(`【${utils.formatDate('YYYY/MM/DD HH:mm:ss')}】 Lilith 为你服务中 φ(゜▽゜*)♪`);
  // dailyMesForGroup();
});
