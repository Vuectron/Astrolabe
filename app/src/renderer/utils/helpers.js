import { parse } from 'url'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import { remote } from 'electron'
import Constants from './constants'

const {BrowserWindow, dialog} = remote

// import marked, { Renderer } from 'marked'

// // Create your custom renderer.
// const renderer = new Renderer();
//
// renderer.code = (code, language) => {
//   // Check whether the given language is valid for highlight.js.
//   const validLang = !!(language && hljs.getLanguage(language));
//   // Highlight only if the language is valid.
//   const highlighted = validLang ? hljs.highlight(language, code).value : code;
//   // Render the highlighted code with `hljs` class.
//   return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
// };
//
// marked.setOptions({
//   renderer,
//   gfm: true,
//   tables: true,
//   breaks: false,
//   pedantic: false,
//   sanitize: true,
//   smartLists: true,
//   smartypants: false,
//   highlight: function(code) {
//     return hljs.highlightAuto(code).value;
//   }
// })

export const getEnterpriseAccountToken = (hostname, accounts) => {
  return accounts
    .find(obj => obj.get('hostname') === hostname)
    .get('token')
}

export const generateGitHubAPIUrl = (hostname) => {
  const isEnterprise = hostname !== Constants.DEFAULT_AUTH_OPTIONS.hostname
  return isEnterprise ? `https://${hostname}/api/v3/` : `https://api.${hostname}/`
}

export const generateGitHubWebUrl = (url) => {
  const { hostname } = parse(url)
  const isEnterprise = hostname !== `api.${Constants.DEFAULT_AUTH_OPTIONS.hostname}`

  let newUrl = isEnterprise
    ? url.replace(`${hostname}/api/v3/repos`, hostname)
    : url.replace('api.github.com/repos', 'www.github.com')

  if (newUrl.indexOf('/pulls/') !== -1) {
    newUrl = newUrl.replace('/pulls/', '/pull/')
  }

  if (newUrl.indexOf('/releases/') !== -1) {
    newUrl = newUrl.replace('/repos', '')
    newUrl = newUrl.substr(0, newUrl.lastIndexOf('/'))
  }

  return newUrl
}

export const authGithub = (authOptions = Constants.DEFAULT_AUTH_OPTIONS, dispatch) => {
  // Build the OAuth consent page URL
  const authWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: true,
    webPreferences: {
      devTools: true,
      nodeIntegration: false
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
        .then(() => { dispatch('getUser') })    // If get token successful, proceed to get user from github
        .then(() => { dispatch('getRepos') })   // If get user successful, proceed to get repos from github
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

  authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
    handleCallback(newUrl)
  })
}

export const isUserEitherLoggedIn = (auth) => {
  return auth.get('token') !== null || auth.get('enterpriseAccounts').size > 0
}

export const md = () => {
  return new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    langPrefix: 'lang-',
    highlight: (code, language) => {
      // Check whether the given language is valid for highlight.js.
      const validLang = !!(language && hljs.getLanguage(language))
      // Highlight only if the language is valid.
      const highlighted = validLang ? hljs.highlight(language, code).value : code
      // Render the highlighted code with `hljs` class.
      return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`
    }
  })
}
