import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const HomeView: React.FC = () => {
  return (
    <Container sx={{ mt: 5 }}>
      <Box
        sx={{
          textAlign: "center",
          backgroundColor: "#f8f9fa",
          p: 3,
          borderRadius: 2,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Our Shop!
        </Typography>
        <Typography variant="h5" component="p" gutterBottom>
          Discover amazing products and enjoy a seamless shopping experience.
        </Typography>
        <Box sx={{ my: 4 }}>
          <hr />
        </Box>
        <Typography variant="body1" component="p" gutterBottom>
          Explore our wide range of products and find exactly what you're
          looking for.
        </Typography>
        <Button
          component={RouterLink}
          to="/products"
          variant="contained"
          color="primary"
          size="large"
        >
          Start Shopping
        </Button>
      </Box>
    </Container>
  );
};

export default HomeView;
