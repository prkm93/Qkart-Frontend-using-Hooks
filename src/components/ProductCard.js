import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  
  const { name, image , cost, rating, category } = product;

  return (
    <Card className="card">
      <CardMedia
        component="img"
        height="140"
        image={image}
        alt={`${category}-${name}`}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
        {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <p>${cost}</p>
          <Rating name="read-only" value={rating} readOnly/>
        </Typography>
      </CardContent>
      <CardActions className="card-actions">
        <Button variant="contained" className="card-button" onClick={handleAddToCart}>
          <span className="add-to-cart-icon"><AddShoppingCartOutlined/></span>ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
