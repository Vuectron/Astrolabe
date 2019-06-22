import DataStore from './dataStore'
let ds = new DataStore()
let db = ds.init()

const { _users, _repos, _langGroup } = db

console.log(_langGroup)

export default {
  // user db crud
  async addUser (data) {
    data._id = data.id
    const res = await _users.push(data).write()
    return res
  },
  async removeUser (id) {
    const res = await _users.remove({ id }).write()
    return res
  },
  async updateUser (data) {
    const { id } = data
    const res = await _users.find({ id }).assign(data).write()
    return res
  },
  async findOneUser (id) {
    const res = await _users.find({ _id: id }).value()
    return res
  },
  // repos db crud
  async addRepo (data) {
    const res = await _repos.push(data).write()
    return res
  },
  async removeRepo (id) {
    const res = await _repos.remove({ id }).write()
    return res
  },
  async updateRepo (data) {
    const { id } = data
    const res = await _repos.find({ id }).assign(data).write()
    return res
  },
  async findOneRepo (id) {
    const res = await _repos.find({ _id: id }).value()
    return res
  },
  async fetchAllRepos () {
    const res = await _repos.value()
    return res
  },
  // langGroup db crud
  async addLangGroup (data) {
    const res = await _langGroup.push(data).write()
    return res
  },
  async removeLangGroup (lang) {
    const res = await _langGroup.remove({ lang }).write()
    return res
  },
  async updateLangGroup (data) {
    const { lang } = data
    const res = await _langGroup.find({ lang }).assign(data).write()
    return res
  },
  async findOneLangGroup (lang) {
    const res = await _langGroup.find({ lang }).value()
    return res
  },
  async fetchLangGroup () {
    const res = await _langGroup.value()
    return res
  }
}
