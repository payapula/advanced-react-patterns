// State Reducer
// http://localhost:3000/isolated/exercise/05.js

import React from 'react'
import {Switch} from '../switch'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn?.(...args))

const TOGGLE = 'toggle'
const RESET = 'reset'

function toggleReducer(state, {type, initialState}) {
  switch (type) {
    case TOGGLE: {
      return {on: !state.on}
    }
    case RESET: {
      return initialState
    }
    default: {
      throw new Error(`Unsupported type: ${type}`)
    }
  }
}

// 🐨 add a new option called `reducer` that defaults to `toggleReducer`
function useToggle({initialOn = false, reducer = toggleReducer} = {}) {
  const {current: initialState} = React.useRef({on: initialOn})
  // 🐨 instead of passing `toggleReducer` here, pass the `reducer` that's
  // provided as an option
  // ... and that's it! Don't forget to check the 💯 extra credit!
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const {on} = state

  const toggle = () => dispatch({type: TOGGLE})
  const reset = () => dispatch({type: RESET, initialState})

  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  function getResetterProps({onClick, ...props} = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}

function App() {
  const [timesClicked, setTimesClicked] = React.useState(0)
  //const clickedTooMuch = timesClicked >= 4

  //console.log('Clicked Too Much => ' + clickedTooMuch)

  function toggleStateReducer(state, action) {
    if (action.type === TOGGLE && timesClicked >= 4) {
      return {on: state.on}
    }
    return toggleReducer(state, action)
    // switch (action.type) {
    //   case 'toggle': {
    //     console.log('Clicked reducer Too Much => ' + clickedTooMuch)

    //     if (clickedTooMuch) {
    //       return {on: state.on}
    //     }
    //     return {on: !state.on}
    //   }
    //   case 'reset': {
    //     return {on: false}
    //   }
    //   default: {
    //     throw new Error(`Unsupported type: ${action.type}`)
    //   }
    // }
  }

  const {on, getTogglerProps, getResetterProps} = useToggle({
    reducer: toggleStateReducer,
  })

  return (
    <div>
      <Switch
        {...getTogglerProps({
          disabled: timesClicked >= 4,
          on: on,
          onClick: () => setTimesClicked(count => count + 1),
        })}
      />
      {timesClicked >= 4 ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : timesClicked > 0 ? (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      ) : null}
      <button {...getResetterProps({onClick: () => setTimesClicked(0)})}>
        Reset
      </button>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
