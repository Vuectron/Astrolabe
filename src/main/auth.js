import { remote } from 'electron'
import Constants from './constants'

const { BrowserWindow, dialog } = remote

export const authGithub = (authOptions = Constants.DEFAULT_AUTH_OPTIONS, dispatch) => {
  // Build the OAuth content page URL
  const authWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: true,
    webPreferences: {
      devTools: true
    }
  })

  const githubUrl = `https://${authOptions.hostname}/login/oauth/authorize?`
  const authUrl = `${githubUrl}client_id=${authOptions.clientId}&scope=${Constants.AUTH_SCOPE}`

  authWindow.loadURL(authUrl)

  const handleCallback = (url) => {
    const rawCode = /code=([^&]*)/.exec(url) || null
    const code = (rawCode && rawCode.length > 1) ? rawCode[1] : null
    const error = /\?error=(.+)$/.exec(url)

    if (code || error) {
      // Close the browser if code found or error
      authWindow.destroy()
    }

    // If there is a code, proceed to get token from github
    if (code) {
      dispatch('getToken', {authOptions, code})
        .then(() => {})
        .then(() => { dispatch('getUser') }) // If get token successful, proceed to get user from github
        .then(() => { dispatch('getRepos') }) // If get user successful, proceed to get repos from github
    } else if (error) {
      alert('Oops! Something went wrong and we couldn\'t ' +
        'log you in using Github. Please try again.')
    }
  }

  // If "Done" button is pressed, hide "Loading"
  authWindow.on('close', () => {
    authWindow.destroy()
  })

  authWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    if (validatedURL.includes(authOptions.hostname)) {
      authWindow.destroy()

      dialog.showErrorBox(
        'Invalid Hostname',
        `Could not load https://${authOptions.hostname}/.`
      )
    }
  })

  authWindow.webContents.on('will-navigate', (event, url) => {
    handleCallback(url)
  })

  authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
    handleCallback(newUrl)
  })

  // const filter = {
  //   urls: ['https://*.github.com/*', '*://electron.github.io']
  // }

  // session.defaultSession.webRequest.onBeforeRequest(filter, ({url}) => {
  //   console.log(url)
  //   handleCallback(url)
  // })
}
