import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import Cart from "./Cart";
import {generateCartItemsFrom} from "./Cart";
import ProductCard from "./ProductCard";
import "./Products.css";



const Products = () => {

  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const isLoggedIn = localStorage.getItem('token');
  let timeout;

  useEffect(() => {
    
    const onLoadHandler = async () => {
      await performAPICall();
      if (isLoggedIn) {
        await fetchCart(isLoggedIn);
      }
    }

    onLoadHandler();
  }, [])

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(`${config.endpoint}/products`);

      if (response.status === 200) {
        setAllProducts(response.data);
    
      }
      setLoading(false);

    } catch (err) {

      const { response } = err;
      setLoading(false);

      if (response) {
        if (response.status === 404) {
          displayMessage("Something went wrong. Check again.", "error");
        } 
      } else {
        displayMessage("Something went wrong. Check the backend console for more details", "error");
      }
    }
  };

    /**
   * 
   * @param {string} msg
   * Error message to be passed 
   * @param {string} errVariant
   * Type of error message(success, failure, warning) 
   * @returns {function}
   */
  const displayMessage = (msg, errVariant) => {
    return enqueueSnackbar(msg, { variant: errVariant });
  }

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
  
      const response = await axios.get(`${config.endpoint}/products/search?value=${text.toLowerCase()}`);
      if (response.status === 200) {
        setAllProducts(response.data);
      }

    } catch (err) {
      const { response } = err;
  
      if (response) {
        if (response.status === 404) {
          setAllProducts(response.data);
        }
      } else {
        displayMessage("Something went wrong. Check the backend console for more details", "error");
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (e, debounceTimeout) => {
    let searchText = e.target.value;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      performSearch(searchText);
    }, debounceTimeout);
  
  }


  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
        'Authorization': `Bearer ${token}` 
        }
      });

      if (response.status === 200) {

        setCartItems(response.data); 

      }

    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    const product = items.find(item => item.productId === productId);
    return product ? true: false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {variant: "warning"});
    } else if (isItemInCart(items, productId) && options) {
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.", {variant: "warning"});
    } else {
      try {
  
        const response = await axios.post(`${config.endpoint}/cart`, {
          productId,
          qty
        }, {
          headers: {
          'Authorization': `Bearer ${token}` 
          }
        })
        if (response.status === 200) {
            setCartItems(response.data); // this is to ensure additional API call isn't made as it leads to failing test case for adding, removing, add btn to cart , functionality.
        }
      } catch (err) {
        console.log(err);
      }
    }

  };

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField 
          className="search search-desktop"
          size="small"
          InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          )
          }}
          name="search"
          placeholder="Search for items/categories"
          onChange={(e) => debounceSearch(e, 500)}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ), 
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => debounceSearch(e, 300)()}
      />
      {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={isLoggedIn ? 9 : 12}>
            <Grid container spacing={{ xs: 2, md: 2 }}>
              <Grid item className="product-grid">
                <Box className="hero">
                  <p className="hero-heading">
                    India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                    to your door step
                  </p>
                </Box>
              </Grid>
              {
                loading ? 
                <Grid item className="loading">
                  <CircularProgress/>
                  <span className="loading-text">Loading Products</span>
                </Grid>
                : Array.isArray(allProducts) && allProducts.length ?
                  allProducts.map((item) => {
                    return (
                    <Grid item xs={6} sm={6} md={3} key={item._id}>
                      <ProductCard product={item} handleAddToCart={() => addToCart(isLoggedIn, cartItems, allProducts, item._id, 1, true)}/>
                    </Grid>
                    );
                  })
                :
                  <Grid item className="loading">
                    <SentimentDissatisfied/>
                    <span className="loading-text">No products found</span>
                  </Grid>
              }
            </Grid>
          </Grid> 
         {
           isLoggedIn 
           && 
           <Grid item xs={12} sm={12} md={3} className="cart-grid">
            <Cart 
              products={allProducts} 
              items={generateCartItemsFrom(cartItems,allProducts)} 
              handleQuantity={addToCart}
              isReadOnly={false}
            />
           </Grid>
         }
        </Grid>
       </Box>
      <Footer />
    </div>
  );
};

export default Products;
