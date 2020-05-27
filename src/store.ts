import Vue from 'vue'
import Vuex from 'vuex'
// importing interfaces:
/* eslint-disable no-unused-vars */
import IUser from './components/IUser'
/* eslint-enable no-unused-vars */
import Counter from './Counter'
import users_ from './users'

const users = <IUser[]>users_
const collator = new Intl.Collator()

Vue.use( Vuex )

const messageIdCounter = new Counter()

export default new Vuex.Store( {
  state: {
    users: [],
    messages: [],
    sessionUserNickname: null,
    usersIsLoaded: false,
  },
  getters: {
    GET_USER_BY_NICKNAME: state => ( nickname: string ) => state.users.find(
      user => user.nickname == nickname
    ),
    GET_USERS: ( state ): IUser[] => {
      return state.users.sort(
        ( a, b ) => collator.compare( a.nickname, b.nickname )
      )
    },
    GET_NICKNAMES: ( state ): string[] => {
      return state.users.map( ( user ) => user.nickname ).sort(
        ( a, b ) => collator.compare( a, b )
      )
    },
    GET_SESSION_USER_NICKNAME: ( state ) => {
      if ( !state.sessionUserNickname ) {
        return null
      }
      const index = state.users.findIndex( ( user ) => user.nickname == state.sessionUserNickname )
      return state.users[index].nickname
    },
    GET_USERS_IS_LOADED: ( state ) => {
      return state.usersIsLoaded
    },
    GET_MESSAGE_BY_ID: ( state ) => ( id: number ) => state.messages.find( message => message.id == id ),
    GET_ALL_CORRESPONDENCE: state => state.messages,
  },
  mutations: {
    ADD_USER: ( state, user ) => {
      state.users.push( user )
    },
    UPDATE_USER: ( state, user ) => {
      const index_ = state.users.findIndex( user_ => user_.nickname == user.nickname )
      state.users[index_] = user
    },
    ADD_MESSAGE: ( state, message ) => {
      message.id = messageIdCounter.counter
      state.messages.push( message )
    },
    SET_SESSION_USER_NICKNAME: ( state, nickname ) => {
      if ( !nickname ) {
        const index = state.users.findIndex( ( user ) => user.nickname == state.sessionUserNickname )
        state.users = [
          ...state.users.slice( 0, index ),
          ...( ( index != state.users.length - 1 ) ? state.users.slice( index + 1 ) : [] ),
        ]
        console.log( 'state.users: ', state.users )
      }
      state.sessionUserNickname = nickname
    },
    LOAD_USERS: ( state ) => {
      if ( state.usersIsLoaded ) {
        return
      }
      state.users = users
      state.usersIsLoaded = true
    },
  },
  actions: {
    LOAD_USERS: ( { commit } ) => {
      commit( 'LOAD_USERS' )
    },
    ADD_MESSAGE: ( { commit }, message ) => {
      commit( 'ADD_MESSAGE', message )
    },
    ADD_USER: ( { commit }, user ) => {
      commit( 'ADD_USER', user )
    },
    UPDATE_USER: ( { commit }, user ) => {
      commit( 'UPDATE_USER', user )
    },
    SET_SESSION_USER_NICKNAME: ( { commit }, nickname ) => {
      commit( 'SET_SESSION_USER_NICKNAME', nickname )
    },
    CLEAR_SESSION_USER_NICKNAME: ( { commit } ) => {
      commit( 'SET_SESSION_USER_NICKNAME', null )
    },
  },
} )
