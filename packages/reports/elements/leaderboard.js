const { REWARD_PLURAL } = require('@guyveut/shared/consts');
const convertToWord = require('@guyveut/shared/numToWords');

module.exports = {
  openLeaderboard: (context) => {
    const leaderboard = {
      view: {
        type: 'modal',
        title: {
          type: 'plain_text',
          text: "Guy Veut's Reports",
        },
        callback_id: 'guyveut',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: context.timerange + "'s leaderboard",
              emoji: true,
            },
          },
          {
            type: 'divider',
          },
        ],
      },
    };
    for (var i = 0; i < context.users.length; i++) {
      var user = context.users[i][0];
      var value = context.users[i][1];
      leaderboard.view.blocks.push({
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text:
              ':' +
              convertToWord(i + 1) +
              ': *<@' +
              user +
              '>* : ' +
              value +
              ' ' +
              REWARD_PLURAL +
              '.',
          },
        ],
      });
    }
    leaderboard.view.blocks.push({
      type: 'divider',
    });
    var actions_block = {
      type: 'actions',
      elements: [],
    };
    let timeranges = ['Daily', 'Weekly', 'Monthly'];
    for (const timerange of timeranges) {
      if (timerange != context.timerange) {
        actions_block.elements.push({
          type: 'button',
          text: {
            type: 'plain_text',
            text: timerange + "'s leaderboard",
          },
          style: 'primary',
          value: timerange,
          action_id: timerange,
        });
      }
    }
    leaderboard.view.blocks.push(actions_block);
    return leaderboard;
  },
};
