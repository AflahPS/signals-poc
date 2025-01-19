import { Close } from '@mui/icons-material';
import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Typography,
  Stack,
  IconButton,
  Divider,
  TextField,
  Button,
  useTheme,
  Autocomplete,
  Grid,
  Badge,
} from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { IPost, IStation } from '../models';
import { createPost, editPost } from '../services';
import { globalSx, Signals } from '../config';

interface Props {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  handleClose: (refetch?: boolean) => void;
  selectedStation: IStation;
  post?: IPost;
}

export const AddPostModal: FC<Props> = ({
  open,
  handleClose,
  post,
  selectedStation,
}) => {
  const theme = useTheme();

  const [name, setName] = useState('');
  const [availableSignals, setAvailableSignals] = useState<string[]>([]);
  const [activeSignal, setActiveSignal] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const isEdit = !!post?.id;

  const resetStates = () => {
    setLoading(false);
    setName('');
    setActiveSignal('');
    setAvailableSignals([]);
    setErrorMessage('');
  };

  useEffect(() => {
    if (post?.id) {
      setName(post.name);
      setAvailableSignals(post.availableSignals);
      setActiveSignal(post.activeSignal);
    } else {
      resetStates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  const handleSave = async () => {
    try {
      if (!name.trim()) {
        setErrorMessage('Please enter a valid name !');
        return;
      }
      if (!activeSignal.trim() || !availableSignals.includes(activeSignal)) {
        setErrorMessage('Please select a valid active signal !');
        return;
      }
      setLoading(true);
      const payload = {
        name,
        availableSignals,
        activeSignal,
        station: selectedStation.id,
      };
      console.log({ payload });
      const { data, error, message } = isEdit
        ? await editPost(post.id, payload)
        : await createPost(payload);
      if (!data && error) {
        setErrorMessage(message!);
        setLoading(false);
        return;
      }
      // eslint-disable-next-line no-alert
      alert(`Successfully ${isEdit ? 'edited the' : 'created a new'} post!`);
      setLoading(false);
      handleClose(true);
      resetStates();
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => handleClose()}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={globalSx.modalContainer}
          bgcolor={theme.palette.background.default}
        >
          <Stack sx={globalSx.modalContainerStack}>
            <Typography variant="h4" sx={globalSx.titleStyles}>
              {isEdit ? 'Update Post' : 'Add Post'}
            </Typography>
            <IconButton onClick={() => handleClose()}>
              <Close />
            </IconButton>
          </Stack>
          <Divider variant="fullWidth" />
          <Stack
            gap="20px"
            alignItems="center"
            width="100%"
            py="16px"
            component="form"
            onSubmit={(e) => e.preventDefault()}
          >
            <Stack gap="6px" width="100%">
              <Typography
                variant="subtitle1"
                sx={globalSx.inputLabel}
                color={theme.palette.text.primary}
              >
                Name*
              </Typography>
              <TextField
                required
                fullWidth
                type="text"
                value={name}
                onChange={(e) => {
                  setErrorMessage('');
                  setName(e.target.value);
                }}
                placeholder="Enter name"
                size="small"
              />
            </Stack>
            <Stack gap="6px" width="100%">
              <Typography
                variant="subtitle1"
                sx={globalSx.inputLabel}
                color={theme.palette.text.primary}
              >
                Available Signals*
              </Typography>
              <Autocomplete
                multiple
                id="tags-outlined"
                options={Object.keys(Signals)}
                // getOptionLabel={(option) => option.title}
                filterSelectedOptions
                onChange={(_, values) => setAvailableSignals(values)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Available Signals"
                    placeholder="Search by color..."
                  />
                )}
              />
            </Stack>
            <Grid container>
              {availableSignals?.map((el) => (
                <Badge key={el} overlap="circular" badgeContent="">
                  <Box
                    component="span"
                    onClick={() => {
                      setActiveSignal(el);
                    }}
                    sx={{
                      borderRadius: '50%',
                      bgcolor: Signals[el as keyof typeof Signals],
                      width: 40,
                      height: 40,
                    }}
                  />
                </Badge>
              ))}
            </Grid>
            <Stack gap="10px" width="100%" direction="row" pt="12px">
              <Button
                variant="contained"
                sx={globalSx.buttonStyles}
                type="submit"
                onClick={() => handleSave()}
                disabled={loading}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                sx={globalSx.buttonStyles}
                color="secondary"
                onClick={() => handleClose()}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
          <Box width="100%">
            <Typography variant="body2" color="orangered" textAlign="left">
              {errorMessage}
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
