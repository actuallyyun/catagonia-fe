import { stringify } from 'querystring'
import {
  cleanImageUrl,
  constructQueryUrl,
  generateRandomImage,
  urlParser,
  setParams,
  API_URL
} from './utils'
import { QueryParams, QueryParam } from '../misc/type'

describe('clean image url', () => {
  test('should return original url', () => {
    const url = 'https://placeimg.com/640/480/any?r=0.591926261873231'
    expect(cleanImageUrl(url)).toBe(url)
  })
  test('should return cleaned url', () => {
    const url = '["https://placeimg.com/640/480/any?r=0.591926261873231"]'
    expect(cleanImageUrl(url)).toBe(
      'https://placeimg.com/640/480/any?r=0.591926261873231'
    )
  })
  test('should return null', () => {
    const url1 = ''
    expect(cleanImageUrl(url1)).toBe(null)
    const url2 = 'somerandomstring'
    expect(cleanImageUrl(url2)).toBe(null)
  })
  test('pass irregular string should return cleaned url', () => {
    const url = '["https://i.imgur.com/OKn1KFI.jpeg"'
    expect(cleanImageUrl(url)).toBe('https://i.imgur.com/OKn1KFI.jpeg')
  })
  test('url starts with " and ends with ]"', () => {
    const url = '"https://i.imgur.com/Z9oKRVJ.jpeg"]'
    expect(cleanImageUrl(url)).toBe('https://i.imgur.com/Z9oKRVJ.jpeg')
  })
})

describe('generate random image', () => {
  test('should return valid image url', () => {
    const res = generateRandomImage()
    expect(res.slice(0, 5)).toBe('https')
    expect(res.includes('id')).toBeTruthy()
  })
})

describe('contruct query url', () => {
  test('pass null should return empty string', () => {
    const res = constructQueryUrl(null)
    expect(res).toEqual('')
  })
  test('pass one param should return correct string', () => {
    const res = constructQueryUrl([
      {
        type: 'startingAfter',
        value: '0'
      }
    ])
    expect(res).toEqual('startingAfter=0&')
  })
  test('pass two param should return correct string', () => {
    const res = constructQueryUrl([
      {
        type: 'startingAfter',
        value: '0'
      },
      {
        type: 'limit',
        value: '12'
      }
    ])
    expect(res).toEqual('startingAfter=0&limit=12&')
  })
})

test('url parser', () => {
  expect(
    stringify(
      urlParser(
        `${API_URL}/products/?price_min=100&price_max=1000&startingAfter=10&limit=10`
      )
    )
  ).toBe(
    stringify({
      startingAfter: '10',
      limit: '10'
    })
  )
})
describe('setParams', () => {
  test('should push param to empty prev', () => {
    const prev: QueryParams = []
    const param: QueryParam = { type: 'searchKey', value: 'apple' }
    const res = setParams(prev, param)
    expect(res[0]).toMatchObject(param)
  })
  test('should not add duplicated param type', () => {
    const prev: QueryParams = [
      { type: 'searchKey', value: 'apple' },
      { type: 'startingAfter', value: '5' }
    ]
    const param: QueryParam = { type: 'searchKey', value: 'orange' }
    const res = setParams(prev, param)
    expect(res[0]).toMatchObject(param)
    expect(res[1]).toMatchObject({ type: 'startingAfter', value: '5' })
  })
  test('should  add new param type', () => {
    const prev: QueryParams = [
      { type: 'searchKey', value: 'apple' },
      { type: 'startingAfter', value: '5' }
    ]
    const param: QueryParam = { type: 'limit', value: '10' }
    const res = setParams(prev, param)
    expect(res[1]).toMatchObject({ type: 'startingAfter', value: '5' })
    expect(res[2]).toMatchObject(param)
  })
})
