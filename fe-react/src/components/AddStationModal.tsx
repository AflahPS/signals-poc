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
} from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { IStation } from '../models';
import { createStation, editStation } from '../services';
import { globalSx } from '../config';

interface Props {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  handleClose: (refetch?: boolean) => void;
  station?: IStation;
}

export const AddStationModal: FC<Props> = ({ open, handleClose, station }) => {
  const theme = useTheme();

  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const isEdit = !!station?.id;

  const resetStates = () => {
    setLoading(false);
    setName('');
    setErrorMessage('');
  };

  useEffect(() => {
    if (station?.id) {
      setName(station.name);
    } else {
      resetStates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [station]);

  const handleSave = async () => {
    try {
      if (!name.trim()) {
        setErrorMessage('Please enter a valid name !');
        return;
      }
      setLoading(true);
      const payload = {
        name,
      };
      console.log({ payload });
      const { data, error, message } = isEdit
        ? await editStation(station.id, payload)
        : await createStation(payload);
      if (!data && error) {
        setErrorMessage(message!);
        setLoading(false);
        return;
      }
      // eslint-disable-next-line no-alert
      alert(`Successfully ${isEdit ? 'edited the' : 'created a new'} station!`);
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
              {isEdit ? 'Update Station' : 'Add Station'}
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
