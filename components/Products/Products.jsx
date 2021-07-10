import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Card, CardActionArea, Typography, Button, CardContent, CardActions, IconButton} from '@material-ui/core'
import FavoriteIcon from '@material-ui/icons/Favorite';
import './products.css';

const useStyles = makeStyles({
    root: {
      maxWidth: 345,
      margin: 20 ,
    },
});

function Products({product, onAddToCart}) {
  const classes = useStyles();
  return (
    <div className="products">
      {
        product.map((object)=>(
          <Card className={classes.root}>
          <CardActionArea>
            <div className="card-image">
              <img 
                src={object.media.source} 
                alt="" 
              />
            </div>
            
            <CardContent>
              <Typography gutterBottom variant="h6" component="h2">
                {object.name}
              </Typography>
              <Typography gutterBottom variant="h7" component="h4">
                {object.price.formatted_with_symbol}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
              <Button size="small" color="primary" onClick={()=>onAddToCart(object.id, 1)}>
                Add to Cart
              </Button>
          </CardActions>
        </Card>
        ))
      }

    </div>


  )
}

export default Products

 