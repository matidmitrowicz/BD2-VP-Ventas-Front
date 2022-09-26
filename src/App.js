import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import VentasApp from "./VentasApp";
import EditProduct from "./EditProduct";

// https://mui.com/material-ui/getting-started/installation/

export default class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<VentasApp />} />
          <Route path="/edit" element={<EditProduct />} />
        </Routes>
      </Router>
    );
  }
}
