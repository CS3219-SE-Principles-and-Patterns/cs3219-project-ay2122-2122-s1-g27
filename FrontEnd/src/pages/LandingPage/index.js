import { Grid, Button, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { React } from 'react';
import { Link } from 'react-router-dom';
import LandingPageBanner from '../../assets/LandingPageBanner.png';

const Banner = styled('img')(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        height: '300px',
        width: '300px',
    },
    [theme.breakpoints.only('md')]: {
        height: '400px',
        width: '400px',
    },
    [theme.breakpoints.only('lg')]: {
        height: '500px',
        width: '500px',
    },
    [theme.breakpoints.only('xl')]: {
        height: '800px',
        width: '800px',
    },
}));

const TopSlogan = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    color: '#FDFDFD',
    [theme.breakpoints.down('sm')]: {
        paddingTop: '50px',
    },
}));

const LoginLink = styled(Link)({
    color: '#FDFDFD',
    textDecoration: 'none',
});

function LandingPage(props) {
    return (
        <Grid
            container
            sx={{ marginTop: '50px' }}
            justifyContent="space-around"
            alignItems="center"
        >
            <Grid item xs={12} sm={6}>
                <Description />
            </Grid>
            <Grid container justifyContent="center" item xs={12} sm={6}>
                <Image />
            </Grid>
        </Grid>
    );
}

function Description() {
    return (
        <Grid container justifyContent="center">
            <Grid item xs={12}>
                <TopSlogan align="center" variant="h4" component="div">
                    Goodbye interview anxiety.
                </TopSlogan>
            </Grid>
            <Grid item xs={12}>
                <Typography
                    align="center"
                    variant="h4"
                    component="div"
                    sx={{
                        fontWeight: 600,
                        color: '#FFE448',
                        paddingBottom: '50px',
                    }}
                >
                    Hello confidence.
                </Typography>
            </Grid>
            <Grid item xs={10}>
                <Typography
                    align="center"
                    variant="h6"
                    component="div"
                    sx={{ color: '#FDFDFD', paddingBottom: '30px' }}
                >
                    Join us now if you want to practice for coding interviews
                    together with friends, experts or noobs. We have them all.
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <Typography
                    align="center"
                    variant="h6"
                    component="div"
                    sx={{ color: '#FDFDFD' }}
                >
                    Built for engineers, by engineers.
                </Typography>
            </Grid>
            <Grid item xs={12} container justifyContent="center">
                <LoginLink to="/login">
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#7EA151',
                            width: '270px',
                            marginTop: '20px',
                            textTransform: 'none',
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            sx={{ color: '#FCFCFC', fontWeight: 600 }}
                        >
                            Join Now!
                        </Typography>
                    </Button>
                </LoginLink>
            </Grid>
        </Grid>
    );
}

function Image() {
    return <Banner src={LandingPageBanner} alt="landing-page-banner" />;
}
export default LandingPage;
