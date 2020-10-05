import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { getMetricMetaInfo, timeToString } from '../utils/helpers'
import DateHeader from './DateHeader'
import FitnessSlider from './FitnessSlider'
import Steppers from './Steppers'

function SubmitBtn ({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}>
      <Text>SUBMIT</Text>
    </TouchableOpacity>
  )
}

export default class AddEntry extends Component {
  constructor (props){
    super(props)
    this.state = {
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0
    }
  }

  submit = () => {
    const key = timeToString()
    const entry = this.state

    // Update Redux

    // clear state
    this.setState(() => ({ run: 0, bike: 0, swim: 0, sleep: 0, eat: 0 }))

    // Navigate to home

    // Save to "DB"

    // Clear local notification
  }

  increment = (metric) =>{
    const {max, step} = getMetricMetaInfo(metirc)

    this.setState((state)=>{
      const count = state[metric] + step
      return {
        ...state,
        [metric] : count > max ? max : count
      }

    })
  }
  decrement = (metric) =>{
    const {step} = getMetricMetaInfo(metirc)

    this.setState((state)=>{
      const count = state[metric] - step
      return {
        ...state,
        [metric] : count < 0 ? 0 : count
      }
    })
  }
  slide = (metric , value) => {
    this.setState(()=>({
      [metric] : value
    }))
  }
  render() {
    const metaInfo = getMetricMetaInfo()
    return (
      <View>
        <DateHeader date={(new Date()).toLocaleDateString()}/>
        {Object.keys(metaInfo).map((key)=>{
          const { getIcon, type, ...rest } = metaInfo[key]
          const value = this.state[key]
          return (
            <View key={key}>
              {getIcon()}
              {type==='slider'
                ? <FitnessSlider
                    value={value}
                    onChange={(value) => this.slide(key,value)}
                    {...rest}
                  />
               : <Steppers
                    value={value}
                    onIncrement={() => this.increment(key)}
                    onDecrement={() => this.decrement(key)}
                />
              }
              <SubmitBtn onPress={this.submit} />
            </View>
          )
        })}
      </View>
    )
  }
}
