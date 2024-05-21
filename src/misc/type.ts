export interface BaseEntity {
  id: string
}

export interface Category extends BaseEntity {
  name: string
  image: string
}

export interface CategoryCreateDto {
  name: string
}

export interface CategoryUpdateDto {
  name: string
}

export type Product = {
  id: number
  title: string
  price: number
  description: string
  images: string[]
  creationAt: string
  updatedAt: string
  category: Category
}

export type CreateProductInput = {
  title: string
  price: number
  description: string
  categoryId: number
}

export type CreateProductRequest = CreateProductInput & {
  images: string[]
}

export type UserTextInput = {
  name: string
  email: string
  password: string
}

export type UserRegister = {
  name: string
  email: string
  password: string
  avatar: string
}

export type User = UserRegister & {
  role: 'customer' | 'admin'
  id: number
}

export type UserInfo = {
  id: number
  role: 'customer' | 'admin'
  name: string
  email: string
  avatar: string
}

export type UserAuthToken = {
  access_token: string
  refresh_token: string
}

export type UserLoginRequest = {
  email: string
  password: string
}

export type CartItem = {
  productId: number
  quantity: number
}

export type Cart = {
  item: CartItem
  totalQuantity: number
}

export type UpdateProductInput = {
  title: string
  price: number
}

export type UpdateProductRequest = UpdateProductInput & { id: number }

export type QueryFilters =
  | 'title'
  | 'price_min'
  | 'price_max'
  | 'categoryId'
  | 'offset'
  | 'limit'

export type QueryParam = {
  type: QueryFilters
  value: string
}

export type QueryParams = QueryParam[]

export type GoogleLoginResponse = {
  email: string

  family_name: string
  given_name: string
  id: string
  locale: string
  name: string
  picture: string
  verified_email: Boolean
}

export type Feedback = {
  handleError: (err: any) => void
  handleSuccess: (message: string) => void
}

export type FileResponse = {
  originalname: string
  filename: string
  location: string
}
