const knex = require('../db')

class Theatre {
  constructor({ id = null, name = null, address = null } = {}) {
    this._id = id
    this.name = name
    this.address = address
    this._removed = false
    this._valid = true
    if (!this.name || !this.address) this._valid = false
  }

  get id() {
    return this._id
  }

  set id(val) {
    throw new Error('Cannot set id')
  }

  get removed() {
    return this._removed
  }

  set removed(val) {
    throw new Error('Use .destroy to remove')
  }

  get valid() {
    return this._valid
  }

  set valid(val) {
    throw new Error('Cannot set validity')
  }

  static all() {
    return knex('theatres')
      .then(theatres => {
        return theatres.map(theatre => {
          return new Theatre(theatre)
        })
      })
  }

  static find(id) {
    return knex('theatres')
      .where({ id })
      .first()
      .then(theatre => {
        return new Theatre(theatre)
      })
  }

  save() {
    if (!this.name || !this.address) return Promise.reject(new Error('Missing vital data'))

    if (this.id) {
      return knex('theatres')
        .update({ name: this.name, address: this.address })
        .then(() => {
          return this
        })
    }

    return knex('theatres')
      .insert({ name: this.name, address: this.address })
      .then(() => {
        return this
      })
  }

  destroy() {
    return knex('theatres')
    .where({id : this.id})
    .del()
    .then( () => {
      this._removed = true
      return this
    })
  }

}

module.exports = Theatre
