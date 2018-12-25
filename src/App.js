import React, { Component } from 'react';
import { Chart } from "react-google-charts";
import { Input } from 'antd';
import axios from 'axios';

const Search = Input.Search;

const style = {
    marginTop : '10%',
     marginLeft : '40%'

}
class App extends Component {

 state = {
        data: [['Stock Symbol', 'Price']],
        stockSymbols: new Set(),
        interval:{}
    }

  componentDidMount() {
    if(this.state.stockSymbols.length !== 0){
      this.interval = setInterval(() => {
        const stockSymbols = this.state.stockSymbols;
        this.setState({
                      data: [['Stock Symbol', 'Price']],
                      stockSymbols: new Set()
                  });
         for (const stockSymbol of stockSymbols.values()) {
            this.handleSubmit(stockSymbol);
         }
      }, 5000);
    }
  }
  componentWillUnmount() {
    console.log("componentWillUnmount")
    clearInterval(this.state.interval);
  }

  handleSubmit = (value) => {
    if(!this.state.stockSymbols.has(value.toUpperCase())){
     axios.get(
            `/1.0/stock/${value}/price/`
          )
          .then(res => {
            const data2 = [value.toUpperCase(), res.data];
            const data3 = [];
            for (var index = 0; index < this.state.data.length; index++) {
                  data3.push(this.state.data[index]);
              }
            data3.push(data2);
            this.setState({
                  data: data3,
                  stockSymbols: new Set(this.state.stockSymbols.add(value.toUpperCase()))
              });
      });
    }
  }

  render() {
    return (
      <div>
        <div style={style}>
          <Search
            placeholder="Stock Symbol"
            enterButton="Add"
            size="large"
            onSearch={value => this.handleSubmit(value)}
          />
        </div>
        <Chart chartType="BarChart" 
        options={{
          title: 'Stock Prices',
          hAxis: {
            title: 'Price',
            minValue: 0,
          },
          vAxis: {
            title: 'Stock Symbol'
          },
        }}
        width="100%" height="400px" data={this.state.data} />
      </div>
    );
  }
}

export default App;
