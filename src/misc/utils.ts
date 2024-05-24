import { Product, QueryParams, QueryParam } from './type'

export const getCategories = (products: Product[]) => {
  return products
    .map((product) => product.category)
    .map((category) => {
      return {
        id: category.id,
        name: category.name,
        image: category.image
      }
    })
}

export const cleanImageUrl = (url: string) => {
  if (!url) {
    return null
  }
  if (url.slice(0, 5) === 'https') {
    return url
  }
  if (
    url.slice(0, 2) === '["' &&
    url.slice(url.length - 2, url.length) === '"]'
  ) {
    return url.slice(2, url.length - 2)
  }

  if (url.slice(0, 2) === '["' && url.slice(url.length - 1) === '"') {
    return url.slice(2, url.length - 1)
  }

  if (url.slice(0, 1) === '"' && url.slice(url.length - 2) === '"]') {
    return url.slice(1, url.length - 2)
  }

  return null
}
export const imageBaseUrl = ''
export const generateRandomImage = () => {
  const randomId = Math.floor(Math.random() * 200)
  return `https://picsum.photos/id/${randomId}/640/480`
}

export const constructQueryUrl = (param: QueryParams | null) => {
  const paramArray = param
    ? param.map((param) => `${param.type}=${param.value}&`)
    : ['']
  return paramArray.join('')
}

export const urlParser = (url: string) => {
  const params = url
    .split('?')[1]
    .split('&')
    .map((p) => p.split('='))
  return Object.fromEntries(params)
}

export const setParams = (
  prev: QueryParams,
  param: QueryParam
): QueryParams => {
  const types = prev.map((p) => p.type)
  if (types.includes(param.type)) {
    return prev.map((p) => {
      return p.type === param.type ? { ...p, value: param.value } : p
    })
  } else {
    return [...prev, param]
  }
}


export const API_URL = 'https://catagonia.azurewebsites.net/api/v1'