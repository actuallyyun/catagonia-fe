import authApi from './auth'
import productApi from './product'
import {
  mockServer as server,
  mockProductsPaged,
  mockProducts
} from '../tests/mockServer'
import store from '../app/store'
import { QueryFilters, QueryParams, CreateProductRequest } from '../misc/type'

// Enable API mocking before tests.
beforeAll(() => server.listen())

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

describe('getAllProducts endpoint', () => {
  test('default param should return all mock products', async () => {
    const payload = await store
      .dispatch(productApi.endpoints.getAllProducts.initiate(null))
      .unwrap()
    expect(payload).toMatchObject(mockProductsPaged)
  })
  test('with pagination params should return paged result', async () => {
    const offset: QueryFilters = 'offset'
    const limit: QueryFilters = 'limit'
    const param = [
      { type: offset, value: '1' },
      { type: limit, value: '2' }
    ]
    const payload = await store
      .dispatch(productApi.endpoints.getAllProducts.initiate(param))
      .unwrap()
    const res = mockProductsPaged.slice(2, 4)
    expect(payload).toMatchObject(res)
  })
  test('with title param should return filtered products', async () => {
    const type: QueryFilters = 'title'
    const param = [{ type: type, value: 'juegos' }]
    const payload = await store
      .dispatch(productApi.endpoints.getAllProducts.initiate(param))
      .unwrap()
    const res = mockProductsPaged.filter((p) =>
      p.title.toLowerCase().includes(param[0].value.toLowerCase())
    )
    expect(payload).toMatchObject(res)
  })
  test('with title and pagination param should return filtered paged result', async () => {
    const title: QueryFilters = 'title'
    const offset: QueryFilters = 'offset'
    const limit: QueryFilters = 'limit'
    const param: QueryParams = [
      { type: title, value: 'o' },
      { type: offset, value: '1' },
      { type: limit, value: '2' }
    ]
    const payload = await store
      .dispatch(productApi.endpoints.getAllProducts.initiate(param))
      .unwrap()
    const res = mockProductsPaged
      .filter((p) => p.title.toLowerCase().includes('o'))
      .slice(2, 4)
    expect(payload).toMatchObject(res)
  })
})

describe('getSingleProduct', () => {
  test('return correct product by id', async () => {
    const payload = await store
      .dispatch(productApi.endpoints.getSingleProduct.initiate('2'))
      .unwrap()

    expect(payload).toMatchObject(mockProducts[1])
  })
  test('return null if not found', async () => {
    const payload = await store
      .dispatch(productApi.endpoints.getSingleProduct.initiate('200'))
      .unwrap()
    expect(payload).toBe(null)
  })
})

describe('updateProduct', () => {
  test('update product correctly', async () => {
    const req = { title: 'product1-updated', price: 100, id: '1' }
    const payload = await store
      .dispatch(productApi.endpoints.updateProduct.initiate(req))
      .unwrap()
    expect(payload.title).toEqual(req.title)
    expect(payload.price).toEqual(req.price)
  })
  test('product not found is not updated', async () => {
    const req = { title: 'product1-updated', price: 100, id: '100' }
    const payload = await store.dispatch(
      productApi.endpoints.updateProduct.initiate(req)
    )
    expect(payload).toMatchObject({ error: { status: 404, data: null } })
  })
})
describe('deleteProduct', () => {
  test('delete successfuly', async () => {
    const payload = await store
      .dispatch(productApi.endpoints.deleteProduct.initiate('1'))
      .unwrap()
    expect(payload).toBeTruthy()
  })
  test('not found', async () => {
    const payload = await store.dispatch(
      productApi.endpoints.deleteProduct.initiate('100')
    )
    expect(payload).toMatchObject({ error: { status: 404, data: null } })
  })
})

describe('creatProduct', () => {
  test('creat product successfully', async () => {
    const req: CreateProductRequest = {
      title: 'New Product',
      price: 10,
      inventory: 100,
      description: 'A description',
      categoryId: '1',
      images: ['https://placeimg.com/640/480/any']
    }
    const payload = await store
      .dispatch(productApi.endpoints.createProduct.initiate(req))
      .unwrap()

    expect(payload.title).toEqual(req.title)
    expect(payload.price).toEqual(req.price)
  })
})

describe('getProductByCategory', () => {
  test('no extra param should return default categories', async () => {
    const param = { categoryId: '1', sortBy: '' }
    const payload = await store
      .dispatch(productApi.endpoints.getProductsByCategory.initiate(param))
      .unwrap()
    const expected = mockProductsPaged.filter((p) => p.category.id === '1')
    expect(payload).toMatchObject(expected)
  })
  test('pass ascending should return  categories in ascending order', async () => {
    const param = { categoryId: '1', sortBy: 'ascending' }
    const payload = await store
      .dispatch(productApi.endpoints.getProductsByCategory.initiate(param))
      .unwrap()
    const expected = mockProductsPaged
      .filter((p) => p.category.id === '1')
      .sort((a, b) => a.price - b.price)
    expect(payload).toMatchObject(expected)
  })
  test('pass descending should return  categories in descending order', async () => {
    const param = { categoryId: '1', sortBy: 'descending' }
    const payload = await store
      .dispatch(productApi.endpoints.getProductsByCategory.initiate(param))
      .unwrap()
    const expected = mockProductsPaged
      .filter((p) => p.category.id === '1')
      .sort((a, b) => b.price - a.price)
    expect(payload).toMatchObject(expected)
  })
})