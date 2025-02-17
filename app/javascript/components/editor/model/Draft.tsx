/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeObservable, observable } from 'mobx'

export default class Draft {
  key: Date
  json: any
  apiId: number
  apiUserId: number
  conceptId: string
  revisionId: number
  associatedCollectionId: string
  errors: any

  constructor() {
    this.key = new Date()
    this.json = {}
    this.apiId = -1
    this.apiUserId = -1
    this.conceptId = null
    this.revisionId = -1
    this.associatedCollectionId = null
    this.errors = {}
    makeObservable(this, {
      json: observable, apiId: observable, apiUserId: observable, conceptId: observable, revisionId: observable, associatedCollectionId: observable, errors: observable
    })
  }
}
