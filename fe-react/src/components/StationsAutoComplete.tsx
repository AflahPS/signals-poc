import {
  Autocomplete,
  TextField,
  CircularProgress,
  debounce,
} from '@mui/material';
import React, {
  useCallback,
  useState,
  useEffect,
  FC,
  SyntheticEvent,
} from 'react';
import { IStation } from '../models';
import { getStations } from '../services';

interface Props {
  // eslint-disable-next-line no-unused-vars
  onChange: (_: IStation) => void;
  value?: IStation;
  disableLabel?: boolean;
  placeholder?: string;
}

export const StationsAutocomplete: FC<Props> = ({
  onChange,
  value,
  disableLabel,
  placeholder,
}) => {
  const [stationsLoading, setStationsLoading] = useState<boolean>(false);
  const [stationsDropdownOpen, setStationsDropdownOpen] =
    useState<boolean>(false);
  const [stations, setStations] = useState<IStation[]>([]);
  const [stationSearch, setStationSearch] = useState('');

  const stationsInit = useCallback(async (search: string) => {
    try {
      setStationsLoading(true);
      const { data, error, message } = await getStations({
        limit: 10,
        search: search || undefined,
        sortBy: '-createdAt',
      });
      if (error) {
        console.log(message);
        // eslint-disable-next-line no-alert
        alert(message);
        setStationsLoading(false);
        return;
      }
      if (data?.results !== undefined) {
        setStations(data?.results);
      }
      setStationsLoading(false);
    } catch (error) {
      console.log(error);
      setStationsLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedStationsInit = useCallback(
    debounce((search: string) => stationsInit(search), 300),
    [stationsInit]
  );

  useEffect(() => {
    if (stationSearch.trim()) {
      debouncedStationsInit(stationSearch);
    }
    return () => {
      debouncedStationsInit.clear();
    };
  }, [stationSearch, debouncedStationsInit]);

  const handleChange = useCallback(
    (_: SyntheticEvent, val: IStation | null) => {
      if (val) onChange(val);
    },
    [onChange]
  );

  return (
    <Autocomplete
      disablePortal
      id="station-autocomplete"
      options={stations.map((station) => ({ ...station, key: station.id }))}
      fullWidth
      isOptionEqualToValue={(_option, _value) => _option?.id === _value?.id}
      size="small"
      open={stationsDropdownOpen}
      onOpen={useCallback(() => {
        setStationsDropdownOpen(true);
        if (!stations?.length) stationsInit(stationSearch);
      }, [stations?.length, stationsInit, stationSearch])}
      onClose={() => {
        setStationsDropdownOpen(false);
      }}
      value={value}
      onChange={handleChange}
      getOptionLabel={(option) => option.name || ''}
      renderInput={(params) => (
        <TextField
          {...params}
          onChange={(e) => {
            setStationSearch(e.target.value);
          }}
          label={disableLabel ? undefined : 'Station'}
          placeholder={placeholder ? placeholder : undefined}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {stationsLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};
