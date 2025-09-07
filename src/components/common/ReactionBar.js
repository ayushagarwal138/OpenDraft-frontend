import React from 'react';
import { Box, Chip, Tooltip } from '@mui/material';

const DEFAULT_EMOJIS = ['👍','❤️','😂','👏','🔥','🎉'];

const ReactionBar = ({ type, id, reactions = {}, onReact, userId, disabled }) => {
  const toCount = (value) => Array.isArray(value) ? value.length : Number(value) || 0;
  const didUserReact = (value) => Array.isArray(value) && userId ? value.includes(userId) : false;

  const handleReact = (emoji) => {
    if (disabled) return;
    const userReacted = didUserReact(reactions[emoji]);
    onReact && onReact(emoji, !userReacted);
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
      {DEFAULT_EMOJIS.map((emoji) => {
        const count = toCount(reactions[emoji]);
        const userReacted = didUserReact(reactions[emoji]);
        return (
          <Tooltip key={emoji} title={userReacted ? 'Remove reaction' : 'React'}>
            <Chip
              label={
                <span style={{ fontSize: 18 }}>
                  {emoji} {count > 0 && <span style={{ fontWeight: 600, marginLeft: 2 }}>{count}</span>}
                </span>
              }
              color={userReacted ? 'primary' : 'default'}
              variant={userReacted ? 'filled' : 'outlined'}
              onClick={() => handleReact(emoji)}
              disabled={disabled}
              sx={{ cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 18 }}
            />
          </Tooltip>
        );
      })}
    </Box>
  );
};

export default ReactionBar;