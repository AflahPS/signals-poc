import { Box, Button, CircularProgress, Grid, Stack } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { AddOutlined, RestartAltOutlined } from '@mui/icons-material';
import { io } from 'socket.io-client';
import { StationsAutocomplete } from './StationsAutoComplete';
import { IPostPopulated, IStation, PostSocketResponse } from '../models';
import { PostCard } from './PostCard';
import { AddStationModal } from './AddStationModal';
import { deletePost, getPosts } from '../services';
import { AddPostModal } from './AddPostModal';
import { baseURL } from '../config';
import { HistoryModal } from './HistoryModal';

export const Home = () => {
  const [station, setStation] = useState<IStation | undefined>();
  const [posts, setPosts] = useState<IPostPopulated[]>([]);
  const [selectedPost, setSelectedPost] = useState<IPostPopulated>();
  const [selectedHistoryPost, setSelectedHistoryPost] =
    useState<IPostPopulated>();
  const [stationModalOpen, setStationModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const postsInit = useCallback(async (stationId: string) => {
    try {
      setLoading(true);
      const { data, error, message } = await getPosts<IPostPopulated>({
        sortBy: 'createdAt:desc',
        station: stationId,
        page: 1,
        limit: 9999,
      });
      if (!data || error) {
        console.log(message);
        // eslint-disable-next-line no-alert
        alert(message);
        setLoading(false);
        return;
      }
      const { results } = data || {};
      if (results !== undefined) setPosts(results);
      setLoading(false);
    } catch (err) {
      setLoading(true);
      console.error(err);
    }
  }, []);

  const handleDeleteClick = useCallback(async (id: string) => {
    try {
      // eslint-disable-next-line no-restricted-globals, no-alert
      const isConfirm = confirm('Are you sure you want to delete this visit?');
      if (!isConfirm) return;
      setLoading(true);
      const { data, error, message } = await deletePost(id);
      if (!data && error) {
        setLoading(false);
        // eslint-disable-next-line no-alert
        alert(message);
        return;
      }
      setLoading(false);
      setPosts((prev) => prev.filter((el) => el.id !== id));
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, []);

  const handleUpdateClick = useCallback(async (post: IPostPopulated) => {
    setSelectedPost(post);
    setPostModalOpen(true);
  }, []);

  const handleHistoryClick = useCallback(async (post: IPostPopulated) => {
    setSelectedHistoryPost(post);
    setHistoryModalOpen(true);
  }, []);

  const handleSignalUpdate = useCallback(() => {
    postsInit(station?.id as string);
  }, [postsInit, station?.id]);

  useEffect(() => {
    if (station) postsInit(station.id);
  }, [station, postsInit]);

  useEffect(() => {
    if (!station) return;
    const socket = io(baseURL?.split('/v')[0]);
    socket.emit('joinStation', station.id);

    socket.on('postUpdated', (res: PostSocketResponse) => {
      const { operationType, post: updatedPost } = res;

      if (operationType === 'delete') {
        setPosts((prev) => prev.filter((p) => p.id !== updatedPost?.id));
      }

      if (operationType === 'insert') {
        if (updatedPost.activeSignal === 'red') {
          setPosts((prev) => [updatedPost, ...prev]);
        } else setPosts((prev) => [...prev, updatedPost]);
      }

      if (operationType === 'update') {
        postsInit(station?.id as string);
      }
    });

    return () => {
      socket.emit('leaveStationRoom', station.id);
      socket.off('postUpdated');
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [station]);

  return (
    <Stack component="main" width="lg" minHeight="50vh" py={3} gap={3}>
      <Box display="flex" width="100%" gap={3} justifyContent="space-between">
        <StationsAutocomplete
          onChange={setStation}
          value={station}
          placeholder="Search stations..."
        />
        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          sx={{ textTransform: 'none', textWrap: 'nowrap' }}
          onClick={() => {
            setStationModalOpen(true);
          }}
        >
          Add Station
        </Button>
        <Button
          variant="contained"
          startIcon={<RestartAltOutlined />}
          sx={{ textTransform: 'none', textWrap: 'nowrap' }}
          onClick={() => {
            setStation(undefined);
            setPosts([]);
          }}
        >
          Reset
        </Button>
      </Box>
      {station && (
        <Stack
          spacing={2}
          width="100%"
          minHeight="25vh"
          py={2}
          px={1}
          border="1px solid lightgrey"
          borderRadius="6px"
        >
          <Stack width="100%" direction="row" justifyContent="space-between">
            {/* <TextField
              size="small"
              fullWidth
              sx={{ width: '50%' }}
              placeholder="Search post by name..."
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchOutlined />{' '}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            /> */}
            <Box />
            <Button
              variant="contained"
              startIcon={<AddOutlined />}
              sx={{ textTransform: 'none', textWrap: 'nowrap' }}
              onClick={() => {
                setPostModalOpen(true);
              }}
            >
              Add Post
            </Button>
          </Stack>
          <Grid
            container
            width="100%"
            height="100%"
            gap={5}
            alignItems="stretch"
          >
            {loading ? (
              <Grid item container justifyContent="center" alignItems="center">
                <CircularProgress />
              </Grid>
            ) : (
              posts?.map((el) => (
                <Grid
                  item
                  width="30%"
                  key={el?.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <PostCard
                    post={el}
                    onDelete={() => {
                      handleDeleteClick(el.id);
                    }}
                    onUpdate={() => {
                      handleUpdateClick(el);
                    }}
                    onHistoryClick={() => {
                      handleHistoryClick(el);
                    }}
                    onSignalUpdate={handleSignalUpdate}
                  />
                </Grid>
              ))
            )}
          </Grid>
        </Stack>
      )}
      <AddStationModal
        open={stationModalOpen}
        handleClose={() => {
          setStationModalOpen(false);
        }}
      />
      <AddPostModal
        selectedStation={station!}
        post={selectedPost!}
        open={postModalOpen}
        onClose={(refetch) => {
          if (refetch) postsInit(station?.id as string);
          setSelectedPost(undefined);
          setPostModalOpen(false);
        }}
      />
      <HistoryModal
        open={historyModalOpen}
        onClose={() => {
          setSelectedHistoryPost(undefined);
          setHistoryModalOpen(false);
        }}
        post={selectedHistoryPost!}
      />
    </Stack>
  );
};
