import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Box,
  useTheme,
  Badge,
  Grid,
} from '@mui/material';
import { MoreVertOutlined } from '@mui/icons-material';
import dayjs from 'dayjs';
import React, { FC, useCallback, useState } from 'react';
import { IPostPopulated } from '../models';
import { Signals } from '../config';
import { editPost } from '../services';

interface Props {
  post: IPostPopulated;
  onDelete: () => void;
  onUpdate: () => void;
  onHistoryClick: () => void;
  // eslint-disable-next-line no-unused-vars
  onSignalUpdate: (post: IPostPopulated, _: string) => void;
}

export const PostCard: FC<Props> = ({
  post,
  onDelete,
  onUpdate,
  onSignalUpdate,
  onHistoryClick,
}) => {
  const { activeSignal, availableSignals, name, lastChangeAt, lastChangeBy } =
    post;
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDelete = () => {
    onDelete();
    setAnchorEl(null);
  };

  const handleUpdate = () => {
    onUpdate();
    setAnchorEl(null);
  };

  const handleHistory = () => {
    onHistoryClick();
    setAnchorEl(null);
  };

  const handleSignalUpdate = useCallback(
    async (newSignal: string) => {
      if (activeSignal === newSignal) return;
      // eslint-disable-next-line no-restricted-globals, no-alert
      const isConfirm = confirm(
        `This will update the signal from "${activeSignal}" to "${newSignal}", Are you sure to proceed ?`
      );
      if (!isConfirm) return;
      const { data, error, message } = await editPost(post.id, {
        activeSignal: newSignal,
      });
      if (!data && error) {
        // eslint-disable-next-line no-alert
        alert(message);
        return;
      }
      onSignalUpdate(post, newSignal);
    },
    [activeSignal, onSignalUpdate, post]
  );

  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        py: 2,
        px: 1,

        boxShadow:
          activeSignal === 'red' ? '0 0 15px rgba(255, 0, 0, 0.8)' : 'none', // Conditional glow
        border:
          activeSignal === 'red'
            ? '1px solid rgba(255, 0, 0, 1)'
            : '1px solid #e0e0e0', // Red border for active red signal
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': {
          boxShadow:
            activeSignal === 'red'
              ? '0 0 25px rgba(255, 0, 0, 1)'
              : '0 0 10px rgba(0, 0, 0, 0.2)', // Enhance glow on hover if red
        },
      }}
      elevation={3}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid lightgrey',
          borderRadius: '4px',
          pl: 2,
        }}
      >
        <Typography sx={{ color: 'text.primary', fontSize: 16 }}>
          {name}
        </Typography>
        <IconButton onClick={handleMoreClick}>
          <MoreVertOutlined />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => {
            setAnchorEl(null);
          }}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={() => handleUpdate()}>Edit</MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
            }}
          >
            Clone
          </MenuItem>
          <MenuItem onClick={() => handleDelete()}>Delete</MenuItem>
        </Menu>
      </Box>

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              component="span"
              sx={{
                borderRadius: '50%',
                bgcolor: Signals[activeSignal as keyof typeof Signals],
                border: '1px solid Highlight',
                width: 80,
                height: 80,
              }}
            />
            <Stack>
              <Typography variant="caption" color={theme.palette.text.primary}>
                Recent Update
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {dayjs(lastChangeAt).format('MMM D, YYYY h:mm A')}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {lastChangeBy?.name}
              </Typography>
            </Stack>
          </Stack>
          <Grid container spacing={2}>
            {availableSignals?.map((el) => (
              <Grid item key={el}>
                <Badge
                  overlap="circular"
                  color={activeSignal === el ? 'success' : 'default'}
                  badgeContent={activeSignal === el ? 'active' : ''}
                  hidden={activeSignal !== el}
                >
                  <Box
                    component="span"
                    onClick={() => handleSignalUpdate(el)}
                    sx={{
                      borderRadius: '50%',
                      bgcolor: Signals[el as keyof typeof Signals],
                      border: '1px solid Highlight',
                      width: 40,
                      height: 40,
                      cursor: 'pointer',
                    }}
                  />
                </Badge>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </CardContent>
      <CardActions>
        <Stack justifyContent="center" width="100%">
          <Button
            size="small"
            onClick={() => handleHistory()}
            sx={{ textTransform: 'none' }}
          >
            See History
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
};
