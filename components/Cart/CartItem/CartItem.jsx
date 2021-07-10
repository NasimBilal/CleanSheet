import React from 'react';
import {Card, CardActionArea, CardContent, Typography,CardActions, Button} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
      maxWidth: 345,
      margin: 20 ,
    },
    quantity: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 10,
    },
    action: {
        display: 'flex',
        flexDirection: 'column'
    }
});

function CartItem({item, handleCartQty, handleRemove}) {
    const classes = useStyles();
    return (
        <div>
            <Card className={classes.root}>
                <CardActionArea>
                    <div className="card-image">
                        <img src={item.media.source} alt="" />
                    </div>
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="h2">
                            {item.name}
                        </Typography>
                        <Typography gutterBottom variant="h7" component="h2">
                            {item.price.formatted_with_symbol}
                        </Typography>
                    </CardContent>    
                </CardActionArea>
                <CardActions className={classes.action}>
                    <div className={classes.quantity}>
                        <Button type="button" size="small" onClick={()=> handleCartQty(item.id, item.quantity - 1)}>-</Button>
                        <Typography gutterBottom variant="h7" component="h2">
                            {item.quantity}
                        </Typography>
                        <Button type="button" size="small" onClick={()=> handleCartQty(item.id, item.quantity + 1)}>+</Button>
                    </div>
                    <Button type="button" color="secondary" variant="contained" onClick={()=>handleRemove(item.id)}>Remove from Cart</Button>
                </CardActions>
            </Card>
        </div>
    )
}

export default CartItem
