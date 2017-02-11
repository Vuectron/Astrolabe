import jetpack from 'fs-jetpack'
import fs from 'fs'
import DataStore from 'nedb'
import { remote } from 'electron'

export default class {
  constructor () {
    this.db = null
    this.userDataDir = jetpack.cwd(remote.app.getPath('userData'))
  }

  createOrReadDatabase (dbname) {
    let haveUser = fs.existsSync(this.userDataDir.path(dbname.user))
    let haveRepo = fs.existsSync(this.userDataDir.path(dbname.repo))
    let haveLangGroup = fs.existsSync(this.userDataDir.path(dbname.langGroup))

    if (haveUser && haveRepo && haveLangGroup) {
      let userData = fs.readFileSync(this.userDataDir.path(dbname.user))
      let repoData = fs.readFileSync(this.userDataDir.path(dbname.repo))
      let langGroupData = fs.readFileSync(this.userDataDir.path(dbname.langGroup))

      let database = {}

      if (!userData && !repoData && !langGroupData) {
        return
      }

      database.user = new DataStore({
        filename: this.userDataDir.path(dbname.user),
        autoload: true
      })
      database.repo = new DataStore({
        filename: this.userDataDir.path(dbname.repo),
        autoload: true
      })
      database.langGroup = new DataStore({
        filename: this.userDataDir.path(dbname.langGroup),
        autoload: true
      })
      return database
    } else {
      try {
        this.userDataDir.write(dbname.user)
        this.userDataDir.write(dbname.repo)
        this.userDataDir.write(dbname.langGroup)

        let database = {}

        database.user = new DataStore({
          filename: this.userDataDir.path(dbname.user),
          autoload: true
        })
        database.repo = new DataStore({
          filename: this.userDataDir.path(dbname.repo),
          autoload: true
        })
        database.langGroup = new DataStore({
          filename: this.userDataDir.path(dbname.langGroup),
          autoload: true
        })
        return database
      } catch (e) {
        console.log(e)
      }
    }
  }

  init () {
    if (this.db) {
      return this.db
    }
    this.db = this.createOrReadDatabase({
      'user': 'users.db',
      'repo': 'repos.db',
      'langGroup': 'lang_group.db'
    })
    return this.db
  }
}
