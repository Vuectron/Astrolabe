import lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import { remote } from 'electron'

const userDataDir = remote.app.getPath('userData')

const adapter = new FileSync(path.join(userDataDir, '/dataStore.json'))
const db = lowdb(adapter)

export default class {
  constructor () {
    this.db = null
  }

  createOrReadDatabase (dbs) {
    let hasUsers = db.has('users').value()
    let hasRepos = db.has('repos').value()
    let hasLangGroup = db.has('langGroup').value()

    if (hasUsers && hasRepos && hasLangGroup) {
      db._users = db.get('users')
      db._repos = db.get('repos')
      db._langGroup = db.get('langGroup')
      db._tags = db.get('tags')

      return db
    } else {
      try {
        // Set some defaults (required if your JSON file is empty)
        db.defaults({ users: [], repos: [], langGroup: [], tags: [] }).write()

        db._users = db.get('users')
        db._repos = db.get('repos')
        db._langGroup = db.get('langGroup')
        db._tags = db.get('tags')

        return db
      } catch (err) {
        console.log(err)
      }
    }
  }

  init () {
    if (this.db) {
      return this.db
    }
    this.db = this.createOrReadDatabase(['users', 'repos', 'langGroup', 'tags'])
    return this.db
  }
}
