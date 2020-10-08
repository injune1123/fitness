import React, {Component} from "react";
import { View } from "react-native";
import AddEntry from "./components/AddEntry.js";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from './reducers';

export default class App extends Component {


  render(){
    return (
      <Provider store={createStore(reducer)}>
        <View style={{flex: 1}}>
          <AddEntry/>
        </View>
      </Provider>
    );
  }
}
