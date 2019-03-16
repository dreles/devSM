import React, { Component } from 'react';
import {BrowserRouter, Route} from 'react-router-dom'; 
import Login from './components/auth/Login';
import Register from './components/auth/Register'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './components/Landing'; 
import './App.css';

class App extends Component {
  render() {
    return (
    <BrowserRouter>
      <div>
        <Navbar/>
		<Route exact path='/' component={Landing}></Route>
		<div className="container">
			<Route exact path='/register' component={Register}></Route>
			<Route exact path='/login' component={Login}></Route>
		</div>
        <Footer/>
      </div>
    </BrowserRouter> 
    );
  }
}

export default App;
