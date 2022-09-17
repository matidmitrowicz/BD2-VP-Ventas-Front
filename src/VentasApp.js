import React, { Component } from "react";
import "./index.css";

export default class VentasApp extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.calcularMonto = this.calcularMonto.bind(this);
    this.confirmarCompra = this.confirmarCompra.bind(this);
    this.changeClientID = this.changeClientID.bind(this);

    this.state = {
      clientID: 1,
      form: {
        productList: [],
        creditCard: "",
      },
      productos: [],
      tarjetas: [],
      promociones: [],
      mensaje: "",
      monto: "",
      ventas: [],
      result: "",
    };
  }

  changeClientID(e) {
    this.setState(() => ({
      clientID: e.target.value,
    }));
  }

  handleSelect(e) {
    this.setState((state) => ({
      form: {
        ...state.form,
        productList: Array.from(
          e.target.selectedOptions,
          (element) => element.value
        ),
      },
    }));
  }

  handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;

    this.setState((state) => ({
      form: {
        ...state.form,
        [name]: value,
      },
    }));
  }

  handleSubmit(e) {
    e.preventDefault();

    let action = e.target.value;
    console.log(action);
  }

  listarProductos() {
    fetch("http://localhost:1234/productos")
      .then((resp) => resp.json())
      .then((json) => {
        this.setState({
          productos: json.productos,
          result: json.result,
        });
      });
  }

  listarTarjetasCliente() {
    fetch("http://localhost:1234/tarjetas/1")
      .then((resp) => resp.json())
      .then((json) => {
        this.setState({
          tarjetas: json.tarjetas,
          result: json.result,
        });
      });
  }

  // tarjetasCliente(inputValue) {
  //   fetch("http://localhost:1234/tarjetas/" + inputValue)
  //     .then((resp) => resp.json())
  //     .then((json) => {
  //       if (json.result === "error") {
  //         this.setState({
  //           mensaje: "No existe el cliente con ID: " + inputValue,
  //           tarjetas: [],
  //         });
  //         return;
  //       }
  //       this.setState({
  //         tarjetas: json.tarjetas,
  //         result: json.result,
  //         mensaje: "",
  //       });
  //     });
  // }

  listarDescuentos() {
    fetch("http://localhost:1234/descuentos")
      .then((resp) => resp.json())
      .then((json) => {
        this.setState({
          promociones: json.promociones,
          result: json.result,
        });
      });
  }

  listarVentas() {
    fetch("http://localhost:1234/ventas")
      .then((resp) => resp.json())
      .then((json) => {
        this.setState({
          ventas: json.ventas,
        });
      });
  }

  componentDidMount() {
    this.listarProductos();
    this.listarTarjetasCliente();
    this.listarDescuentos();
    this.listarVentas();
  }

  componentDidUpdate() {
    // if (this.state.clientID !== "0") {
    //   this.tarjetasCliente(this.state.clientID);
    // }
  }

  calcularMonto(e) {
    e.preventDefault();
    fetch("http://localhost:1234/monto", {
      method: "POST",
      body: JSON.stringify({
        cliente: this.state.clientID,
        productosVendidos: this.state.form.productList,
        tarjeta: this.state.form.creditCard,
      }),
    })
      .then((resp) => resp.json())
      .then((json) => {
        console.log(json);
        this.setState({
          result: json.result,
          mensaje: json.message,
          monto: json.monto,
        });
      });
  }

  confirmarCompra(e) {
    e.preventDefault();
    fetch("http://localhost:1234/compra", {
      method: "POST",
      body: JSON.stringify({
        cliente: this.state.clientID,
        productosVendidos: this.state.form.productList,
        tarjeta: this.state.form.creditCard,
      }),
    })
      .then((resp) => resp.json())
      .then((json) => {
        console.log(json);
        this.setState({
          result: json.result,
          mensaje: json.message,
          monto: "",
        });
      });
  }

  render() {
    return (
      <div id="VentaApp">
        <div className="Venta">
          <form>
            <h4>Seleccione productos:</h4>
            <select
              name="productList"
              multiple={true}
              value={this.state.form.productList}
              onChange={this.handleSelect}
            >
              {this.state.productos.map((product) => (
                // Enviar codigo en vez de id
                <option key={product.idProducto} value={product.idProducto}>
                  {product.descripcion +
                    " , " +
                    product.marca +
                    " $ " +
                    product.precio}
                </option>
              ))}
            </select>
            {/* <div>
              <label>Cliente ID:</label>
              <input
                type="text"
                name="ClientID"
                placeholder="1"
                onChange={this.changeClientID}
              />
            </div> */}
            <h4> Seleccione una tarjeta:</h4>
            <select
              name="creditCard"
              defaultValue=""
              onChange={this.handleChange}
            >
              <option value="" disabled>
                Seleccione una tarjeta
              </option>
              {this.state.tarjetas.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.entidadBancaria}
                </option>
              ))}
            </select>
            <br />
            <div className="buttonBox">
              <button onClick={this.calcularMonto} type="submit">
                Calcular Monto
              </button>
              <button onClick={this.confirmarCompra} type="submit">
                Abonar compra
              </button>
            </div>
          </form>
        </div>

        <div className="promociones">
          <h4>Descuentos Activos:</h4>
          <table id="tablacss">
            <thead>
              <tr>
                <td>Fecha Inicio</td>
                <td>Fecha Fin</td>
                <td>Descuento en</td>
                <td>Porcentaje</td>
              </tr>
            </thead>
            <tbody>
              {this.state.promociones.map((promo) => (
                <tr>
                  <th>{promo.fechaInicio}</th>
                  <th>{promo.fechaFin}</th>
                  <th>{promo.tipoDescuento}</th>
                  <th>{promo.descuento * 100}%</th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="message-buttonBox">
          <p className={this.state.result}>
            {this.state.mensaje} {this.state.monto}
          </p>
        </div>
        <div className="ventas">
          <h4>Ventas</h4>
          <table id="tablacss">
            <thead>
              <tr>
                <td>Fecha</td>
                <td>Total</td>
                <td>Tarjeta</td>
                <td>Productos comprados</td>
                <td>Venta N°</td>
              </tr>
            </thead>
            <tbody>
              {this.state.ventas.map((venta) => (
                <tr>
                  <th>{venta.fecha}</th>
                  <th>{venta.total}</th>
                  <th>{venta.tarjeta}</th>
                  <th>
                    {venta.productos.map((prodVendido) => (
                      <>
                        <p>
                          {prodVendido.descripcion +
                            " " +
                            prodVendido.marca +
                            " - $" +
                            prodVendido.precio}
                        </p>
                      </>
                    ))}
                  </th>
                  <th>{venta.id}</th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
