export const NAME = 'history'

export const ADD = 'history/ADD'
export const MAX_ENTRIES = 'history/MAX_ENTRIES'

// Selectors
export const getHistory = (state) => state[NAME].history

function addHistoryHelper (state, newState) {
  let newHistory = [].concat(state.history)
  newHistory.unshift(newState)
  return Object.assign({}, state, { history: newHistory.slice(0, state.maxHistory) })
}

// Reducer
export default function (state = {history: [], maxHistory: 20}, action) {
  switch (action.type) {
    case ADD:
      return addHistoryHelper(state, action.state)
    case MAX_ENTRIES:
      return Object.assign({}, state, { maxHistory: action.maxHistory })
    default:
      return state
  }
}

// Actions
export const addHistory = (state) => {
  return {
    type: ADD,
    state: state
  }
}

export const setMaxHistory = (maxHistory) => {
  return {
    type: MAX_ENTRIES,
    maxHistory: maxHistory
  }
}
