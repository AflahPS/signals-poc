import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { AddOutlined, RestartAltOutlined, SearchOutlined } from '@mui/icons-material';
import { StationsAutocomplete } from './StationsAutoComplete';
import { IPostPopulated, IStation } from '../models';
import { PostCard } from './PostCard';
import { AddStationModal } from './AddStationModal';
import { getPosts } from '../services';
import { AddPostModal } from './AddPostModal';

export const Home = () => {
  const [station, setStation] = useState<IStation | undefined>();
  const [posts, setPosts] = useState<IPostPopulated[]>([]);
  const [stationModalOpen, setStationModalOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [postPage, setPostPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(false);

  const postsInit = useCallback(
    async (stationId: string) => {
      try {
        setLoading(true);
        const { data, error, message } = await getPosts<IPostPopulated>({
          sortBy: 'createdAt:desc',
          station: stationId,
          populate: 'lastChangeBy',
          page: postPage,
          limit: 10,
          // populate: 'createdBy',
        });
        if (!data || error) {
          console.log(message);
          // eslint-disable-next-line no-alert
          alert(message);
          setLoading(false);
          return;
        }
        const { results, totalResults } = data || {};
        if (results !== undefined) setPosts(results);
        setTotalPosts(totalResults);
        setLoading(false);
      } catch (err) {
        setLoading(true);
        console.error(err);
      }
    },
    [postPage]
  );

  useEffect(() => {
    if (station) postsInit(station.id);
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
            setStationModalOpen(true);
          }}
        >
          Reset
        </Button>
      </Box>
      {station && (
        <Stack spacing={2} width="100%" minHeight="25vh" py={2} px={1}>
          <Stack width="100%" direction="row" justifyContent="space-between">
            <TextField
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
            />
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
                  <PostCard post={el} />
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
        open={postModalOpen}
        handleClose={(refetch) => {
          if (refetch) postsInit(station?.id as string);
          setPostModalOpen(false);
        }}
      />
    </Stack>
  );
};
