import { Button, styled, LinearProgress, linearProgressClasses, TextField } from '@mui/material';
import { grey } from '@mui/material/colors';
import { COLOR_PRIMARY, COLOR_WHITE, FONT_FAMILY_SECONDARY } from "../utils/constants";

export const PrimaryButton = styled(Button)`
  font-family: ${FONT_FAMILY_SECONDARY};
  background-color: ${COLOR_PRIMARY};
  color: ${COLOR_WHITE};
  text-transform: none;
  :hover {
    background-color: ${COLOR_PRIMARY};
  } 
`;

export const PrimaryLinearProgressbar = styled(LinearProgress)({
  height: 20,
  borderRadius: 10,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: grey[400],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 10,
    backgroundColor: COLOR_PRIMARY,
  },
});

export const ExchangeTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: 'black',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'none',
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: COLOR_WHITE,
    fontFamily: FONT_FAMILY_SECONDARY,
    fontWeight: 900,
    border: 'none',
    borderRadius: 20,
    '& fieldset': {
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0, 0, 0, 0)',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
  },
  '& .MuiOutlinedInput-input': {
    fontSize: 24,
    padding: 10
  },
  '& .MuiOutlinedInput-input::placeholder': {
    fontWeight: 900
  },
  '& .MuiFormHelperText-root': {
    margin: '10px 0px'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 0, 0, 0)'
  }
});