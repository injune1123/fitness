import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { getMetricMetaInfo, timeToString, getDailyRemainderValue } from '../utils/helpers'
import DateHeader from './DateHeader'
import FitnessSlider from './FitnessSlider'
import Steppers from './Steppers'
import { Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton'
import { submitEntry, removeEntry } from '../utils/api'
import { connect } from 'react-redux'
import { addEntry } from '../actions'

function SubmitBtn ({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}>
      <Text>SUBMIT</Text>
    </TouchableOpacity>
  )
}

class AddEntry extends Component {
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
    this.props.dispatch(addEntry({
      [key]: entry
    }))
    // clear state
    this.setState(() => ({ run: 0, bike: 0, swim: 0, sleep: 0, eat: 0 }))

    // Navigate to home

    // Save to "DB"(It's not a real db, but asyncstorage,
    // which can be considered as Mobile version of local storage)
    submitEntry({key, entry})
    // Clear local notification
  }

  increment = (metric) =>{
    const {max, step} = getMetricMetaInfo(metric)

    this.setState((state)=>{
      const count = state[metric] + step
      return {
        ...state,
        [metric] : count > max ? max : count
      }

    })
  }
  decrement = (metric) =>{
    const {step} = getMetricMetaInfo(metric)

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

  reset = () =>{
    const key = timeToString()

    // Update Redux
    this.props.dispatch(addEntry({
      [key]: getDailyRemainderValue()
    }))
    // Route to Home

    // Update "DB"(It's not a real db, but asyncstorage,
    // which can be considered as Mobile version of local storage)
    removeEntry(key)
  }
  render() {
    const metaInfo = getMetricMetaInfo()

    if (this.props.alreadyLogged) {
      return (
        <View>
          <Ionicons
            name='ios-happy'
            size={100}
          />
          <Text>You already logged your information for today</Text>
          <TextButton onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      )
    }
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

function mapStateToProps (state) {
  const key = timeToString()

  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    // when typeof state[key].today === 'undefined'
    // state[key]'s value is the return value of the getDailyRemainderValue function
    // which is { today: "👋 Don't forget to log your data today!"}
  }
}

export default connect(mapStateToProps)(AddEntry)
