import DEFAULT_LANG from './settings/DEFAULT_LANG'

export default {
  app: {
    lang: DEFAULT_LANG,
    enableDnD: true
  },
  ui: {
    expanded: [],
    active: null,
    editing: null,
    adding: null,
    movingChild: null,
    buttonsShown: null,
    dragging: null
  },
  user: {
    authenticationFailed: false,
    authenticationError: false,
    registrationFailed: false,
    registrationError: false,
    signOutFailed: false,
    loggedIn: true,
    username: '',
    rootNode: null
  }
}
