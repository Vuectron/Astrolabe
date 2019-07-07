import _ from 'lodash'
import DataStore from './dataStore'
let ds = new DataStore()
let db = ds.init()

const { _users, _repos, _langGroup, _tags } = db

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
  async updateRepoTags (id, tags) {
    const res = await _repos.find({ _id: id }).set('_tags', tags).write()
    return res
  },
  async findOneRepo (id) {
    const res = await _repos.find({ _id: id }).value()
    return res
  },
  async fetchAllRepos () {
    const res = await _repos.cloneDeep().value()
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
  async fetchAllLangGroup () {
    const res = await _langGroup.value()
    return res
  },
  // repos db crud
  async addTag (tag) {
    const res = await _tags.push(tag).write()
    return res
  },
  async setTags (newTags) {
    const localTags = await this.fetchAllTags()
    // async remote tags
    if (localTags) {
      // update remote tags to local tags
      localTags.forEach(tag => {
        const idx = newTags.findIndex(v => v.id === tag.id)
        if (idx !== -1) {
          const tag = newTags[idx]
          _tags.find({ id: tag.id }).assign(tag).write()
        }
      })
      // create remote tags to local tags
      newTags.forEach(tag => {
        const idx = localTags.findIndex(v => v.id === tag.id)
        if (idx === -1) {
          _tags.push(tag).write()
        }
      })
    } else {
      await db.set('tags', newTags).write()
    }
    const allTags = await this.fetchAllTags()
    return allTags
  },
  async setTagCount (id, tags) {
    const allRepos = await this.fetchAllRepos()
    const allTags = await this.fetchAllTags()
    const allReposTags = allRepos
      .filter(v => v.hasOwnProperty('_tags'))
      .map(v => v._tags)
      .reduce((a, b) => a.concat(b), [])
    const reposCount = _.countBy(allReposTags, 'id')
    console.log(reposCount)
    allTags.forEach(tag => {
      // const localTag = _tags.find({ id: tag.id }).value()
      const count = reposCount[tag.id]
      _tags.find({ id: tag.id })
        .set('count', count)
        .write()
    })
    const newTags = await this.fetchAllTags()
    return newTags
  },
  async fetchAllTags () {
    const res = _tags.cloneDeep().value()
    return res
  }
}
