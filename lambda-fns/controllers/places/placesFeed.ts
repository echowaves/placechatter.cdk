var AWS = require('aws-sdk')

import psql from '../../psql'

import { VALID } from '../../valid'

import * as dayjs from 'dayjs'

import { v4 as uuidv4 } from 'uuid'

export default async function main(lat: number, lon: number) {
  await psql.connect()

  const dbPlaces = (
    await psql.query(`
    SELECT
    *
    , 
    ST_Distance(ST_SetSRID(ST_MakePoint(${lon}, ${lat} ), 4326)::geography, "location"::geography)
      as "distance"
    FROM "Places"
    ORDER BY "distance"
    LIMIT 1000
    OFFSET 0
  `)
  ).rows
  await psql.clean()

  // const places = results.map((photo: any) => plainToClass(Photo, photo))
  const places = dbPlaces.map((place: any) => {
    return { place, photos: [] }
  })

  console.log({ places })

  return {
    places,
    // batch,
    // noMoreData,
  }
}
