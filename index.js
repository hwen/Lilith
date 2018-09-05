const CQHttp = require('cqhttp');
const config = require('./config.template');

const bot = new CQHttp({
  apiRoot: config.host,
  accessToken: config.token,
  secret: config.secret,
});

const randomMes = arr => {
  return arr[(Math.random() * arr.length) % arr.length];
};

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

// bot.on('message', ctx => {
//   console.log(ctx);
// });

bot.listen(9991, '127.0.0.1', () => {
  console.log('listening 9991');
});
