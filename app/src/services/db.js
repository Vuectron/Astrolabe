import DS from './ds'
let ds = new DS()
let connect = ds.init()
let user = connect.user
let repo = connect.repo
let langGroup = connect.langGroup

export default {
  // users.db CRUD
  addUser (userData, callback) {
    userData._id = userData.id
    user.insert(userData, (err, docs) => {
      if (err) {}
      return callback(docs)
    })
  },
  updateUser (userData) {
    user.update({_id: userData.id}, {$set: userData}, (err, num) => {
      if (err) {}
    })
  },
  findOneUser (id) {
    return new Promise((resolve, reject) => {
      user.findOne({_id: id}, (err, doc) => {
        if (err) {}
        return resolve(doc)
      })
    })
  },
  // repos.db CRUD
  addRepo (repoData, callback) {
    repo.insert(repoData, (err, docs) => {
      if (err) {}
      return callback(docs)
    })
  },
  updateRepo (repoData) {
    repo.update({_id: repoData._id}, {$set: repoData}, (err, num) => {
      if (err) {}
    })
  },
  findOneRepo (id) {
    return new Promise((resolve, reject) => {
      repo.findOne({_id: id}, (err, doc) => {
        if (err) {}
        return resolve(doc)
      })
    })
  },
  fetchAllRepos () {
    return new Promise((resolve, reject) => {
      repo.find({}).sort({repo_idx: 1}).exec((err, docs) => {
        if (err) {}
        return resolve(docs)
      })
    })
  },
  fetchLazyRepos (limit) {
    return new Promise((resolve, reject) => {
      repo.find({}).sort({repo_idx: 1}).skip(0).limit(limit).exec((err, docs) => {
        if (err) {}
        return resolve(docs)
      })
    })
  },
  removeRepo (id) {
    return new Promise((resolve, reject) => {
      repo.remove({_id: id}, {}, (err, numRemoved) => {
        if (err) {}
      })
    })
  },
  // langGroup.db CRUD
  countLangGroup (lang) {
    return new Promise((resolve, reject) => {
      repo.count({language: lang}, (err, count) => {
        if (err) {}
        return resolve(count)
      })
    })
  },
  addLangGroup (langData, callback) {
    langGroup.insert(langData, (err, docs) => {
      if (err) {}
      return callback(docs)
    })
  },
  updateLangGroup (langGroupData) {
    langGroup.update({_id: langGroupData._id}, {$set: langGroupData}, (err, num) => {
      if (err) {}
    })
  },
  findOneLangGroup (id) {
    return new Promise((resolve, reject) => {
      langGroup.findOne({_id: id}, (err, doc) => {
        if (err) {}
        return resolve(doc)
      })
    })
  },
  fetchLangGroup () {
    return new Promise((resolve, reject) => {
      langGroup.find({}, (err, docs) => {
        if (err) {}
        return resolve(docs)
      })
    })
  },
  removeLangGroup () {
    return new Promise((resolve, reject) => {
      langGroup.remove({}, { multi: true }, (err, numRemoved) => {
        if (err) {}
      })
    })
  }
}
