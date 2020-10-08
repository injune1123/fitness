import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native';
import { getMetricMetaInfo, timeToString, getDailyRemainderValue } from '../utils/helpers'
import DateHeader from './DateHeader'
import FitnessSlider from './FitnessSlider'
import Steppers from './Steppers'
import { Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton'
import { submitEntry, removeEntry } from '../utils/api'
import { connect } from 'react-redux'
import { addEntry } from '../actions'
import { white, purple } from '../utils/colors'
function SubmitBtn ({ onPress }) {
  return (
    <TouchableOpacity
      style={Platform.OS === 'ios'? styles.iosSumbitBtn : styles.androidSubmitBtn}
      onPress={onPress}>
      <Text style={styles.submitBtnText}>SUBMIT</Text>
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
        <View style={styles.center}>
          <Ionicons
            name={ Platform.OS ==="ios"? 'ios-happy' : 'md-happy'}
            size={100}
          />
          <Text>You already logged your information for today</Text>
          <TextButton style={{padding: 10}}onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <DateHeader date={(new Date()).toLocaleDateString()}/>
        {Object.keys(metaInfo).map((key)=>{
          const { getIcon, type, ...rest } = metaInfo[key]
          const value = this.state[key]
          return (
            <View key={key} style={styles.row}>
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
            </View>
          )
        })}
        <SubmitBtn onPress={this.submit} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  center:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30,
    marginLeft: 30
  },
  row:{
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },

  container:{
    flex: 1,
    padding: 20,
    backgroundColor: white
  },

  iosSumbitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 2,
    height: 45,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center'
  }
})

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
