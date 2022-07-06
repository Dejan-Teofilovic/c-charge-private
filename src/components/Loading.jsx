import React from 'react';
import { CircularProgress, DialogContent } from '@mui/material';
import useLoading from '../hooks/useLoading';
import { COLOR_PRIMARY } from '../utils/constants';
import { CustomDialog } from './styledComponents';

export default function Loading() {
  const { isLoading } = useLoading();
  return (
    <CustomDialog open={isLoading}>
      <DialogContent sx={{ bgcolor: 'rgba(0, 0, 0, 0)' }}>
        <CircularProgress sx={{ color: COLOR_PRIMARY }} />
      </DialogContent>
    </CustomDialog>
  );
}