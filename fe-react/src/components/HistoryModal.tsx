import {
  Modal,
  Backdrop,
  Fade,
  Box,
  useTheme,
  Typography,
  Badge,
  Stack,
  IconButton,
} from '@mui/material';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Close } from '@mui/icons-material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { IHistoryPopulated, IPostPopulated } from '../models';
import { getHistory } from '../services';
import { globalSx, Signals } from '../config';

interface Props {
  open: boolean;
  onClose: () => void;
  post: IPostPopulated;
}

export const HistoryModal: FC<Props> = ({ open, onClose, post }) => {
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [limit, setLimit] = useState(10);
  const [historyItems, setHistoryItems] = useState<IHistoryPopulated[]>([]);
  const [loading, setLoading] = useState(false);

  const historyInit = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error, message } = await getHistory<IHistoryPopulated>({
        sortBy: 'createdAt:desc',
        post: post?.id,
        page: page + 1,
        limit,
        populate: 'changedBy',
      });
      if (!data || error) {
        console.log(message);
        // eslint-disable-next-line no-alert
        alert(message);
        setLoading(false);
        return;
      }
      const { results, totalResults } = data || {};
      if (results !== undefined) setHistoryItems(results);
      setTotalItems(totalResults);
      setLoading(false);
    } catch (err) {
      setLoading(true);
      console.error(err);
    }
  }, [limit, page, post?.id]);

  const onPaginationModelChanged = useCallback(
    (m: GridPaginationModel) => {
      if (m.page !== page) setPage(m.page);
      if (m.pageSize !== limit) setLimit(m.pageSize);
    },
    [page, limit]
  );

  const columns: GridColDef<IHistoryPopulated>[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: '#',
        width: 80,
        renderCell: (params) => (
          <Badge overlap="circular" color="default" badgeContent="" hidden>
            <Box
              component="span"
              sx={{
                borderRadius: '50%',
                bgcolor: Signals[params.row.signal as keyof typeof Signals],
                border: '1px solid Highlight',
                width: 40,
                height: 40,
              }}
            />
          </Badge>
        ),
      },
      {
        field: 'signal',
        headerName: 'Signal',
        width: 120,
        renderCell: (params) => (
          <Stack justifyContent="center" width="100%" height="100%">
            <Typography variant="subtitle1">{params.row?.signal}</Typography>
          </Stack>
        ),
      },
      {
        field: 'changedBy',
        headerName: 'Updated By',
        width: 200,
        renderCell: (params) => (
          <Stack justifyContent="center" width="100%" height="100%">
            <Typography variant="subtitle1">
              {params.row?.changedBy?.name}
            </Typography>
          </Stack>
        ),
      },
      {
        field: 'updatedAt',
        headerName: 'Updated At',
        width: 300,
        renderCell: (params) => (
          <Stack justifyContent="center" width="100%" height="100%">
            <Typography variant="subtitle1">
              {dayjs(params.row?.createdAt).format('MMM D, YYYY h:mm A')}
            </Typography>
          </Stack>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    historyInit();
  }, [page, limit, historyInit]);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => onClose()}
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
              Signal Update History
            </Typography>
            <IconButton onClick={() => onClose()}>
              <Close />
            </IconButton>
          </Stack>
          <Stack mb={1}>
            <Box>
              <Typography component="span" variant="body1">
                Selected Post:{' '}
              </Typography>
              <Typography component="span" variant="h6">
                {post?.name}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography component="span" variant="body1">
                Active Signal:{' '}
              </Typography>
              <Badge overlap="circular" color="default" badgeContent="" hidden>
                <Box
                  component="span"
                  sx={{
                    borderRadius: '50%',
                    bgcolor:
                      Signals[post?.activeSignal as keyof typeof Signals],
                    border: '1px solid Highlight',
                    width: 20,
                    height: 20,
                  }}
                />
              </Badge>
            </Box>
          </Stack>
          <Box sx={globalSx.tableContainerSx}>
            <DataGrid
              rows={historyItems}
              columns={columns}
              getRowId={(row) => row?.id}
              disableRowSelectionOnClick
              loading={loading}
              rowHeight={52}
              columnHeaderHeight={44}
              rowCount={totalItems}
              rowSelection
              keepNonExistentRowsSelected
              pagination
              paginationMode="server"
              pageSizeOptions={[10, 25, 50, 100]}
              paginationModel={{ page, pageSize: limit }}
              onPaginationModelChange={onPaginationModelChanged}
              initialState={{
                pagination: {
                  paginationModel: {
                    page: 0,
                    pageSize: 10,
                  },
                },
              }}
              sx={globalSx.tableSx}
            />
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
