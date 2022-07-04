import React, { useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Container,
  Stack,
  Typography,
  Grid,
  Icon as MuiIcon
} from '@mui/material';
import { Icon } from '@iconify/react';
import {
  COLOR_PRIMARY,
  COLOR_PRIMARY_OPACITY,
  FONT_FAMILY_PRIMARY,
  FONT_FAMILY_SECONDARY
} from './utils/constants';
import {
  ExchangeTextField,
  PrimaryButton,
  PrimaryLinearProgressbar
} from './components/styledComponents';

const REGEX_NUMBER_VALID = /^[0-9]*\.?[0-9]*$/;

function App() {
  const [busd, setBusd] = useState(0);

  const handleBusd = (value) => {
    console.log(value.match(REGEX_NUMBER_VALID));
    if (value.match(REGEX_NUMBER_VALID)) {
      setBusd(value);
    }
  };
  return (
    <Container maxWidth="lg">
      <Stack sx={{ minHeight: '100vh' }} justifyContent="center" alignItems="center" spacing={5}>
        {/* Logo */}
        <Stack direction="row" justifyContent="center">
          <Box
            component="img"
            src="assets/images/logo.png"
            width={100}
            alt=""
          />
        </Stack>

        <Card
          sx={{
            width: '100%',
            minHeight: '70vh',
            boxShadow: '0px 2px 15px -1px rgb(0 0 0 / 20%), 0px 1px 10px 0px rgb(0 0 0 / 14%), 10px 1px 15px 0px rgb(0 0 0 / 12%)',
            p: 2
          }}
        >
          <Stack spacing={2} sx={{ minHeight: 'inherit' }}>
            {/* Title */}
            <CardHeader
              title="Private Sale"
              titleTypographyProps={{
                color: COLOR_PRIMARY,
                fontFamily: FONT_FAMILY_PRIMARY,
                variant: 'h4',
                fontWeight: 900,
              }}
              action={
                <PrimaryButton sx={{ fontSize: 16, fontWeight: 700 }} variant="contained">
                  Connect Wallet
                </PrimaryButton>
              }
            />
            <CardContent
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {/* Progress */}
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography
                    component="span"
                    variant="h5"
                    fontFamily={FONT_FAMILY_SECONDARY}
                    fontWeight={900}
                  >Sold: 9,081,576.95 ANI</Typography>
                  <Typography
                    component="span"
                    variant="h5"
                    fontFamily={FONT_FAMILY_SECONDARY}
                    fontWeight={900}
                  >Hard Cap: 20,000,000.00 ANI</Typography>
                </Stack>

                <PrimaryLinearProgressbar
                  variant="determinate"
                  value={40}
                />
              </Stack>

              <Box mt={4}>
                <Grid container spacing={2}>
                  {/* Current status */}
                  <Grid item xs={12} md={6}>
                    <Stack
                      p={3}
                      justifyContent="space-between"
                      spacing={3}
                      borderRadius="50px 0 50px 0"
                      bgcolor={COLOR_PRIMARY_OPACITY}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                          component="span"
                          variant="h5"
                          fontFamily={FONT_FAMILY_SECONDARY}
                          color={COLOR_PRIMARY}
                          fontWeight={900}
                        >Current Price: </Typography>
                        <Typography
                          component="span"
                          variant="h5"
                          fontFamily={FONT_FAMILY_SECONDARY}
                          fontWeight={900}
                        >0.0046 BUSD / ANI</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                          component="span"
                          variant="h5"
                          fontFamily={FONT_FAMILY_SECONDARY}
                          color={COLOR_PRIMARY}
                          fontWeight={900}
                        >Next Price: </Typography>
                        <Typography
                          component="span"
                          variant="h5"
                          fontFamily={FONT_FAMILY_SECONDARY}
                          fontWeight={900}
                        >0.0046 BUSD / ANI</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                          component="span"
                          variant="h5"
                          fontFamily={FONT_FAMILY_SECONDARY}
                          color={COLOR_PRIMARY}
                          fontWeight={900}
                        >In 0d 0h 13m 57s </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                          component="span"
                          variant="h5"
                          fontFamily={FONT_FAMILY_SECONDARY}
                          color={COLOR_PRIMARY}
                          fontWeight={900}
                        >Min Buy: </Typography>
                        <Typography
                          component="span"
                          variant="h5"
                          fontFamily={FONT_FAMILY_SECONDARY}
                          fontWeight={900}
                        >100.00 BUSD</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                          component="span"
                          variant="h5"
                          fontFamily={FONT_FAMILY_SECONDARY}
                          color={COLOR_PRIMARY}
                          fontWeight={900}
                        >Max Buy: </Typography>
                        <Typography
                          component="span"
                          variant="h5"
                          fontFamily={FONT_FAMILY_SECONDARY}
                          fontWeight={900}
                        >150.00 BUSD</Typography>
                      </Stack>
                    </Stack>
                  </Grid>

                  {/* Exchange */}
                  <Grid item xs={12} md={6}>
                    <Stack sx={{ height: '100%' }} justifyContent="space-between">
                      {/* BUSD */}
                      <Stack
                        spacing={1}
                        px={2}
                        py={1}
                        bgcolor={COLOR_PRIMARY_OPACITY}
                        borderRadius="0 20px 0 20px"
                      >
                        <Typography
                          component="span"
                          variant="h6"
                          color={COLOR_PRIMARY}
                          fontFamily={FONT_FAMILY_SECONDARY}
                          fontWeight={900}
                        >From</Typography>

                        <Box>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={8} md={8}>
                              <ExchangeTextField
                                name="busd"
                                value={busd}
                                onChange={(e) => handleBusd(e.target.value)}
                              />
                            </Grid>
                            <Grid item xs={4} md={4}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                                spacing={1}
                              >
                                <Box
                                  component="img"
                                  src="assets/images/busd.png"
                                  alt=""
                                  width={40}
                                />
                                <Typography
                                  component="span"
                                  variant="h6"
                                  fontWeight={900}
                                  fontFamily={FONT_FAMILY_SECONDARY}
                                >BUSD</Typography>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Box>
                      </Stack>

                      {/* Arrow */}
                      <Stack direction="row" justifyContent="center">
                        <MuiIcon sx={{ fontSize: 38, color: COLOR_PRIMARY, height: 'auto' }}>
                          <Icon icon="simple-icons:convertio" />
                        </MuiIcon>
                      </Stack>

                      {/* CCharge */}
                      <Stack
                        spacing={1}
                        px={2}
                        py={1}
                        bgcolor={COLOR_PRIMARY_OPACITY}
                        borderRadius="0 20px 0 20px"
                      >
                        <Typography
                          component="span"
                          variant="h6"
                          color={COLOR_PRIMARY}
                          fontFamily={FONT_FAMILY_SECONDARY}
                          fontWeight={900}
                        >To</Typography>

                        <Box>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={8} md={8}>
                              <Typography
                                component="span"
                                variant="h4"
                                fontFamily={FONT_FAMILY_SECONDARY}
                                fontWeight={900}
                              >0.00</Typography>
                            </Grid>
                            <Grid item xs={4} md={4}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                                spacing={1}
                              >
                                <Box
                                  component="img"
                                  src="assets/images/logo.png"
                                  alt=""
                                  width={40}
                                />
                                <Typography
                                  component="span"
                                  variant="h6"
                                  fontWeight={900}
                                  fontFamily={FONT_FAMILY_SECONDARY}
                                >CCharge</Typography>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Box>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>

              <Stack direction="row" justifyContent="center" mt={4}>
                <PrimaryButton sx={{ fontSize: 24, fontWeight: 900, px: 6 }} variant="contained">
                  Approve
                </PrimaryButton>
              </Stack>
            </CardContent>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}

export default App;
