import React, { useEffect, useState } from 'react';
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
import { ethers } from 'ethers';
import { BigNumber } from 'ethers/lib/ethers';
import {
  COLOR_PRIMARY,
  COLOR_PRIMARY_OPACITY,
  CONTRACT_ABI_BRIDGE,
  CONTRACT_ABI_BUSD,
  CONTRACT_ADDRESS,
  CONTRACT_ADDRESS_BRIDGE,
  CONTRACT_ADDRESS_BUSD,
  ERROR,
  FONT_FAMILY_PRIMARY,
  FONT_FAMILY_SECONDARY,
  FONT_SIZE_BODY1_DESKTOP,
  FONT_SIZE_BODY1_MOBILE,
  FONT_SIZE_H4_DESKTOP,
  FONT_SIZE_H4_MOBILE,
  FONT_SIZE_H5_DESKTOP,
  FONT_SIZE_H5_MOBILE,
  FONT_SIZE_H6_DESKTOP,
  FONT_SIZE_H6_MOBILE,
  HARD_CAP,
  INIT_BUSD_CONTRACT,
  INIT_BUY_PRICE,
  INIT_EXCHANGE_RATE,
  INIT_MAX_BUY_PRICE,
  INIT_MIN_BUY_PRICE,
  INIT_SOLD_AMOUNT,
  MESSAGE_BALANCE_NOT_ENOUGH,
  MESSAGE_BIGGER_THAN_MAX_PRICE,
  MESSAGE_ERROR,
  MESSAGE_OVERFLOW,
  MESSAGE_SMALLER_THAN_MIN_PRICE,
  MESSAGE_TRANSACTION_REJECTED,
  MESSAGE_TRANSACTION_SUCCESS,
  NAME_FROM_CRYPTO,
  NAME_TO_CRYPTO,
  SUCCESS,
  WARNING
} from '../utils/constants';
import {
  ExchangeTextField,
  PrimaryButton,
  PrimaryLinearProgressbar
} from '../components/styledComponents';
import useWallet from '../hooks/useWallet';
import useAlertMessage from '../hooks/useAlertMessage';
import useLoading from '../hooks/useLoading';
import { thousandsSeparators } from '../utils/functions';

/* --------------------------------------------------------------------------- */

const REGEX_NUMBER_VALID = /^[0-9]*\.?[0-9]*$/;

/* --------------------------------------------------------------------------- */

export default function Home() {
  const {
    currentAccount,
    connectWallet,
    disconnectWallet,
    contract,
    signer
  } = useWallet();
  const { openAlert } = useAlertMessage();
  const { openLoading, closeLoading } = useLoading();

  const [busdContract, setBusdContract] = useState(INIT_BUSD_CONTRACT);
  const [bridgeContract, setBridgeContract] = useState(INIT_BUSD_CONTRACT);
  const [buyPrice, setBuyPrice] = useState(INIT_BUY_PRICE);
  const [rate, setRate] = useState(INIT_EXCHANGE_RATE);
  const [minBuyPrice, setMinBuyPrice] = useState(INIT_MIN_BUY_PRICE);
  const [maxBuyPrice, setMaxBuyPrice] = useState(INIT_MAX_BUY_PRICE);
  const [soldAmount, setSoldAmount] = useState(INIT_SOLD_AMOUNT);

  //  Set the amount of busd to buy token
  const handleBuyPrice = (value) => {
    if (value.match(REGEX_NUMBER_VALID)) {
      setBuyPrice(value);
    }
  };

  //  Buy token
  const handleApprove = async () => {
    try {
      if (soldAmount + Number(buyPrice) > HARD_CAP) {
        return openAlert({
          severity: WARNING,
          message: `${MESSAGE_OVERFLOW} ${(HARD_CAP - soldAmount).toFixed(3)} ${NAME_FROM_CRYPTO} max.`
        });
      }
      if (Number(buyPrice) < minBuyPrice) {
        return openAlert({
          severity: WARNING,
          message: MESSAGE_SMALLER_THAN_MIN_PRICE
        });
      }
      if (Number(buyPrice) > maxBuyPrice) {
        return openAlert({
          severity: WARNING,
          message: MESSAGE_BIGGER_THAN_MAX_PRICE
        });
      }
      // await contract.buyTokens({ value: ethers.utils.parseEther(buyPrice) });
      openLoading();

      // const transaction = await busdContract.transfer(
      //   CONTRACT_ADDRESS,
      //   ethers.utils.parseEther(buyPrice),
      //   { from: currentAccount }
      // );

      const approveTransaction = await busdContract.approve(
        CONTRACT_ADDRESS_BRIDGE,
        ethers.utils.parseEther(buyPrice)
      );

      await approveTransaction.wait();

      const transaction = await bridgeContract.presale(
        CONTRACT_ADDRESS,
        ethers.utils.parseEther(buyPrice)
      );
      await transaction.wait();

      let balanceOfContract = await busdContract.balanceOf(CONTRACT_ADDRESS);
      setSoldAmount(parseInt(balanceOfContract._hex) / 10 ** 18);

      closeLoading();

      return openAlert({
        severity: SUCCESS,
        message: MESSAGE_TRANSACTION_SUCCESS
      });

    } catch (error) {
      closeLoading();
      if (error.code === 4001) {
        return openAlert({
          severity: ERROR,
          message: MESSAGE_TRANSACTION_REJECTED
        });
      } else if (error.code === -32603) {
        return openAlert({
          severity: ERROR,
          message: MESSAGE_BALANCE_NOT_ENOUGH
        });
      }
      return openAlert({
        severity: ERROR,
        message: MESSAGE_ERROR
      });
    }
  };

  // Disconnect wallet
  const handleDisconnectWallet = () => {
    setBusdContract(INIT_BUSD_CONTRACT);
    setBuyPrice(INIT_BUY_PRICE);
    setRate(INIT_EXCHANGE_RATE);
    setMinBuyPrice(INIT_MIN_BUY_PRICE);
    setMaxBuyPrice(INIT_MAX_BUY_PRICE);
    setSoldAmount(INIT_SOLD_AMOUNT);

    disconnectWallet();
  };

  //  Fetch the exchange rate, min buy price and max buy price
  useEffect(() => {
    if (currentAccount) {
      if (contract) {
        (async () => {
          try {
            openLoading();
            let _busdContract = new ethers.Contract(
              CONTRACT_ADDRESS_BUSD,
              CONTRACT_ABI_BUSD,
              signer
            );
            let _bridgeContract = new ethers.Contract(
              CONTRACT_ADDRESS_BRIDGE,
              CONTRACT_ABI_BRIDGE,
              signer
            );

            setBusdContract(_busdContract);
            setBridgeContract(_bridgeContract);

            let balanceOfContract = await _busdContract.balanceOf(CONTRACT_ADDRESS);
            
            setSoldAmount(parseInt(balanceOfContract._hex) / 10 ** 18);

            closeLoading();
          } catch (error) {
            closeLoading();
          }
        })();
      }
    }
  }, [currentAccount]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack sx={{ minHeight: '94vh' }} justifyContent="center" alignItems="center" spacing={5}>
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
                fontSize: { xs: FONT_SIZE_H4_MOBILE, md: FONT_SIZE_H4_DESKTOP },
                fontWeight: 900,
              }}
              action={
                currentAccount ? (
                  <PrimaryButton
                    sx={{
                      fontSize: { xs: FONT_SIZE_BODY1_MOBILE, md: FONT_SIZE_BODY1_DESKTOP },
                      fontWeight: 700
                    }}
                    variant="contained"
                    onClick={handleDisconnectWallet}
                  >
                    {currentAccount.slice(0, 10)}...{currentAccount.slice(-5)}
                  </PrimaryButton>
                ) : (
                  <PrimaryButton
                    sx={{
                      fontSize: { xs: FONT_SIZE_BODY1_MOBILE, md: FONT_SIZE_BODY1_DESKTOP },
                      fontWeight: 700
                    }}
                    variant="contained"
                    onClick={() => connectWallet()}
                  >
                    Connect Wallet
                  </PrimaryButton>
                )

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
                    fontSize={{ xs: FONT_SIZE_BODY1_MOBILE, md: FONT_SIZE_H6_DESKTOP }}
                    fontFamily={FONT_FAMILY_SECONDARY}
                    fontWeight={900}
                  >
                    Sold:&nbsp;
                    {
                      soldAmount >= 0 && (
                        `${thousandsSeparators(Number(soldAmount.toFixed(2)))} ${NAME_FROM_CRYPTO}`
                      )
                    }

                  </Typography>
                  <Typography
                    component="span"
                    fontSize={{ xs: FONT_SIZE_BODY1_MOBILE, md: FONT_SIZE_H6_DESKTOP }}
                    fontFamily={FONT_FAMILY_SECONDARY}
                    fontWeight={900}
                  >Hard Cap: {thousandsSeparators(HARD_CAP)} {NAME_FROM_CRYPTO}</Typography>
                </Stack>

                <PrimaryLinearProgressbar
                  variant="determinate"
                  value={soldAmount >= 0 ? (soldAmount / HARD_CAP) * 100 : 0}
                />
              </Stack>

              <Box mt={4}>
                <Grid container spacing={2} alignItems="stretch">
                  {/* Prices */}
                  <Grid item xs={12} md={6}>
                    <Stack
                      px={3}
                      justifyContent="center"
                      spacing={3}
                      borderRadius="50px 0 50px 0"
                      bgcolor={COLOR_PRIMARY_OPACITY}
                      sx={{ height: '100%' }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                          component="span"
                          fontSize={{ xs: FONT_SIZE_H5_MOBILE, md: FONT_SIZE_H5_DESKTOP }}
                          fontFamily={FONT_FAMILY_SECONDARY}
                          color={COLOR_PRIMARY}
                          fontWeight={900}
                        >Price: </Typography>
                        {
                          rate > 0 && (
                            <Typography
                              component="span"
                              fontSize={{ xs: FONT_SIZE_H5_MOBILE, md: FONT_SIZE_H5_DESKTOP }}
                              fontFamily={FONT_FAMILY_SECONDARY}
                              fontWeight={900}
                            >{1 / rate} {NAME_FROM_CRYPTO} / {NAME_TO_CRYPTO}</Typography>
                          )
                        }

                      </Stack>
                      {/* <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                          component="span"
                          fontSize={{ xs: FONT_SIZE_H5_MOBILE, md: FONT_SIZE_H5_DESKTOP }}
                          fontFamily={FONT_FAMILY_SECONDARY}
                          color={COLOR_PRIMARY}
                          fontWeight={900}
                        >Next Price: </Typography>
                        <Typography
                          component="span"
                          fontSize={{ xs: FONT_SIZE_H5_MOBILE, md: FONT_SIZE_H5_DESKTOP }}
                          fontFamily={FONT_FAMILY_SECONDARY}
                          fontWeight={900}
                        >0.0046 {NAME_FROM_CRYPTO} / {NAME_TO_CRYPTO}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                          component="span"
                          fontSize={{ xs: FONT_SIZE_H5_MOBILE, md: FONT_SIZE_H5_DESKTOP }}
                          fontFamily={FONT_FAMILY_SECONDARY}
                          color={COLOR_PRIMARY}
                          fontWeight={900}
                        >In 0d 0h 13m 57s </Typography>
                      </Stack> */}
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                          component="span"
                          fontSize={{ xs: FONT_SIZE_H5_MOBILE, md: FONT_SIZE_H5_DESKTOP }}
                          fontFamily={FONT_FAMILY_SECONDARY}
                          color={COLOR_PRIMARY}
                          fontWeight={900}
                        >Min Buy: </Typography>
                        {
                          minBuyPrice >= 0 && (
                            <Typography
                              component="span"
                              fontSize={{ xs: FONT_SIZE_H5_MOBILE, md: FONT_SIZE_H5_DESKTOP }}
                              fontFamily={FONT_FAMILY_SECONDARY}
                              fontWeight={900}
                            >{minBuyPrice} {NAME_FROM_CRYPTO}</Typography>
                          )
                        }
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                          component="span"
                          fontSize={{ xs: FONT_SIZE_H5_MOBILE, md: FONT_SIZE_H5_DESKTOP }}
                          fontFamily={FONT_FAMILY_SECONDARY}
                          color={COLOR_PRIMARY}
                          fontWeight={900}
                        >Max Buy: </Typography>
                        {
                          maxBuyPrice >= 0 && (
                            <Typography
                              component="span"
                              fontSize={{ xs: FONT_SIZE_H5_MOBILE, md: FONT_SIZE_H5_DESKTOP }}
                              fontFamily={FONT_FAMILY_SECONDARY}
                              fontWeight={900}
                            >{thousandsSeparators(maxBuyPrice)} {NAME_FROM_CRYPTO}</Typography>
                          )
                        }
                      </Stack>
                    </Stack>
                  </Grid>

                  {/* Exchange */}
                  <Grid item xs={12} md={6}>
                    <Stack sx={{ height: '100%' }} justifyContent="center" spacing={2}>
                      {/* From */}
                      <Stack
                        spacing={1}
                        px={2}
                        py={1}
                        bgcolor={COLOR_PRIMARY_OPACITY}
                        borderRadius="0 20px 0 20px"
                      >
                        <Typography
                          component="span"
                          fontSize={{ xs: FONT_SIZE_H6_MOBILE, md: FONT_SIZE_H6_DESKTOP }}
                          color={COLOR_PRIMARY}
                          fontFamily={FONT_FAMILY_SECONDARY}
                          fontWeight={900}
                        >From</Typography>

                        <Box>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={8} md={8}>
                              <ExchangeTextField
                                name="from-crypto"
                                value={buyPrice}
                                onChange={(e) => handleBuyPrice(e.target.value)}
                                disabled={!currentAccount}
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
                                  src="assets/images/from-crypto.png"
                                  alt=""
                                  width={{ xs: 20, md: 40 }}
                                />
                                <Typography
                                  component="span"
                                  fontSize={{ xs: FONT_SIZE_H6_MOBILE, md: FONT_SIZE_H6_DESKTOP }}
                                  fontWeight={900}
                                  fontFamily={FONT_FAMILY_SECONDARY}
                                >{NAME_FROM_CRYPTO}</Typography>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Box>
                      </Stack>

                      {/* Arrow */}
                      <Stack direction="row" justifyContent="center">
                        <MuiIcon sx={{ fontSize: { xs: 24, md: 38 }, color: COLOR_PRIMARY, height: 'auto' }}>
                          <Icon icon="simple-icons:convertio" />
                        </MuiIcon>
                      </Stack>

                      {/* To */}
                      <Stack
                        spacing={1}
                        px={2}
                        py={1}
                        bgcolor={COLOR_PRIMARY_OPACITY}
                        borderRadius="0 20px 0 20px"
                      >
                        <Typography
                          component="span"
                          fontSize={{ xs: FONT_SIZE_H6_MOBILE, md: FONT_SIZE_H6_DESKTOP }}
                          color={COLOR_PRIMARY}
                          fontFamily={FONT_FAMILY_SECONDARY}
                          fontWeight={900}
                        >To</Typography>

                        <Box>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={8} md={8}>
                              <Typography
                                component="span"
                                fontSize={{ xs: FONT_SIZE_H4_MOBILE, md: FONT_SIZE_H4_DESKTOP }}
                                fontFamily={FONT_FAMILY_SECONDARY}
                                fontWeight={900}
                              >{rate * Number(buyPrice)}</Typography>
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
                                  width={{ xs: 20, md: 40 }}
                                />
                                <Typography
                                  component="span"
                                  fontSize={{ xs: FONT_SIZE_H6_MOBILE, md: FONT_SIZE_H6_DESKTOP }}
                                  fontWeight={900}
                                  fontFamily={FONT_FAMILY_SECONDARY}
                                >{NAME_TO_CRYPTO}</Typography>
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
                <PrimaryButton
                  sx={{
                    fontSize: { xs: FONT_SIZE_H4_MOBILE, md: FONT_SIZE_H4_MOBILE },
                    fontWeight: 900,
                    px: 6
                  }}
                  variant="contained"
                  onClick={handleApprove}
                  disabled={!currentAccount || soldAmount >= HARD_CAP}
                >
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