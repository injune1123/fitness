import React, {Component} from "react";
import { View, Text } from "react-native";
import { Ionicons}  from '@expo/vector-icons';
import AddEntry from './components/AddEntry.js'

export default class App extends Component {


  render(){
    return (
      <View>
        <AddEntry/>
      </View>
    );
  }
}
