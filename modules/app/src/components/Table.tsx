import React from 'react'
import { AppController } from '../logic/app-controller'
import { BirdDataRow } from '@modules/core'

export function Table() {
  const results: BirdDataRow[] = AppController.instance.useQueryResult()
  const stringified = JSON.stringify(results, null, 2)
  return (
    <div>
      {stringified}
    </div>
  )
}
