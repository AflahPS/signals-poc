import { Box, Button, Grid, Stack, TextField } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { StationsAutocomplete } from './StationsAutoComplete';
import { IPost, IStation } from '../models';
import { PostCard } from './PostCard';
import { AddStationModal } from './AddStationModal';
import { getPosts } from '../services';
import { AddPostModal } from './AddPostModal';

export const Home = () => {
  const [station, setStation] = useState<IStation | undefined>();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [stationModalOpen, setStationModalOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [postPage, setPostPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(false);

  const postsInit = useCallback(
    async (stationId: string) => {
      try {
        setLoading(true);
        const { data, error, message } = await getPosts({
          sortBy: 'createdAt:desc',
          station: stationId,
          // search: search.trim() || undefined,
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
          sx={{ textTransform: 'none', textWrap: 'nowrap' }}
          onClick={() => {
            setStationModalOpen(true);
          }}
        >
          Add Station
        </Button>
      </Box>
      <Box border="1px solid red" width="100%" minHeight="25vh">
        <Stack width="100%" direction="row" justifyContent="space-between">
          <TextField size="small" />
          <Button
            variant="contained"
            sx={{ textTransform: 'none', textWrap: 'nowrap' }}
            onClick={() => {
              setPostModalOpen(true);
            }}
          >
            Add Post
          </Button>
        </Stack>
        <Grid container>{posts?.map((el) => <PostCard key={el?.id} />)}</Grid>
      </Box>
      <AddStationModal
        open={stationModalOpen}
        handleClose={() => {
          setStationModalOpen(false);
        }}
      />
      <AddPostModal
        selectedStation={station!}
        open={postModalOpen}
        handleClose={() => {
          setPostModalOpen(false);
        }}
      />
    </Stack>
  );
};
