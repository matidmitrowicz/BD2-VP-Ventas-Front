import React, { Component } from "react";
import "./index.css";

export default class EditProduct extends Component {
  constructor(props) {
    super(props);

    this.editarProducto = this.editarProducto.bind(this);
    this.handleChangeProducto = this.handleChangeProducto.bind(this);

    this.state = {
      result: "",
      message: "",
      producto: {
        idProducto: "",
        codigo: "",
        marca: "",
        descripcion: "",
        precio: "",
        categoria: [],
        version: "",
      },
      categorias: [],
    };
  }

  handleChangeProducto(e) {
    let name = e.target.name;
    let value = e.target.value;

    this.setState((state) => ({
      producto: {
        ...state.producto,
        [name]: value,
      },
    }));
  }

  productoModificable() {
    fetch("http://localhost:1234/updateProducto")
      .then((resp) => resp.json())
      .then((json) => {
        this.setState({
          producto: json.producto,
          categorias: json.categorias,
        });
      });
  }
  componentDidMount() {
    this.productoModificable();
  }

  editarProducto(e) {
    e.preventDefault();
    fetch("http://localhost:1234/productUpdate", {
      method: "POST",
      body: JSON.stringify({
        idProducto: this.state.producto.idProducto,
        codigo: this.state.producto.codigo,
        marca: this.state.producto.marca,
        descripcion: this.state.producto.descripcion,
        precio: this.state.producto.precio,
        categoria: this.state.producto.categoria.idCategoria,
        version: this.state.producto.version,
      }),
    })
      .then((resp) => resp.json())
      .then((json) => {
        console.log(json);
        this.setState({
          result: json.result,
          message: json.message,
        });
      });
  }

  render() {
    return (
      <div id="VentaApp" className="updateProducto">
        <h2>Edicion de producto</h2>
        <form id="formupdate">
          <input
            type="hidden"
            readOnly
            name="idProducto"
            value={this.state.producto.idProducto}
          ></input>
          <label>Código</label>
          <input
            type="text"
            contentEditable={false}
            readOnly
            name="codigo"
            value={this.state.producto.codigo}
          ></input>
          <label>Descripcion</label>
          <input
            type="text"
            value={this.state.producto.descripcion}
            id="descripcion"
            name="descripcion"
            onChange={this.handleChangeProducto}
          ></input>
          <label>Precio</label>
          <input
            type="text"
            defaultValue={this.state.producto.precio}
            name="precio"
            onChange={this.handleChangeProducto}
          ></input>
          <label>Marca</label>
          <input
            type="text"
            defaultValue={this.state.producto.marca}
            name="marca"
            onChange={this.handleChangeProducto}
          ></input>
          <label></label>
          <label> Categoría </label>
          <select
            name="categoria"
            defaultValue={this.state.producto.categoria.idCategoria}
            onChange={this.handleChangeProducto}
          >
            {this.state.categorias.map((categoria) => (
              <option key={categoria.idCategoria} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
          <input
            type="hidden"
            name="version"
            value={this.state.producto.version}
          ></input>
          <div>
            <button onClick={this.editarProducto} type="submit">
              Actualizar
            </button>
          </div>
        </form>
        <div className="message-buttonBox">
          <p className={this.state.result}>{this.state.message}</p>
        </div>
      </div>
    );
  }
}
