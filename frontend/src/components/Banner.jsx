import { React } from 'react'
import { Paper, Typography } from '@mui/material'
import background from '../images/background.jpeg'

const Banner = () => {
  const stylesPaper = {
    height: '300px',
    backgroundImage: `url(${background})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center;',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: '100%'
  }

  return (
    <Paper sx={ stylesPaper }>
      <Typography gutterBottom variant="h2" component="div" color='white' style={{ textShadow: '#000 1px 0 20px, #000 1px 0 15px' }}>
        <b>{'Let\'s Take Off!'}</b>
      </Typography>
    </Paper>
  )
}

export default Banner;
