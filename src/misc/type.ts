export interface BaseEntity {
  id: string
}

export interface TimeStamp {
  createdAt: string
  updatedAt: string
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

export interface ImageReadDto {
  id: string
  imageUrl: string
}

export type Product = {
  id: string
  title: string
  price: number
  description: string
  images: ImageReadDto[]
  creationAt: string
  updatedAt: string
  category: Category
  rating: number
  inventory: number
  reviews: ReviewReadDto[]
}

export type CreateProductInput = {
  title: string
  price: number
  description: string
  categoryId: string
  inventory: number
}

export type CreateProductRequest = CreateProductInput & {
  images: string[]
}

export type UserTextInput = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export type UserRegister = {
  firstName: string
  lastName: string
  email: string
  password: string
  avatar: string
}

export type User = UserRegister & {
  role: 0 | 1
  id: string
}

// 0 is user, 1 admin.temperary solution because be responds with 0/1 instead of 'user'/'admin'
export type UserInfo = {
  id: string
  role: 1 | 0
  firstName: string
  lastName: string
  email: string
  avatar: string
}

export type UserAuthToken = {
  accessToken: string
  refreshToken: string
}

export type UserLoginRequest = {
  email: string
  password: string
}

export type CartItem = {
  productId: string
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

export type UpdateProductRequest = UpdateProductInput & { id: string }

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

enum OrderStatus {
  Created,
  Processing,
  Completed,
  Cancelled
}

export type OrderItem = {
  orderId: string
  product: Product
  quantity: number
  price: number
}

export type Address = {
  id: string
  userId: string
  firstName: string
  lastName: string
  addressLine: string
  postalCode: string
  country: string
  phoneNumber: string
}

export type AddressCreateDto = {
  firstName: string
  lastName: string
  addressLine: string
  postalCode: string
  country: string
  phoneNumber: string
}


export interface OrderReadDto extends TimeStamp {
  id: string
  userId: string
  status: OrderStatus
  items: OrderItem[]
  address: Address
}

export interface ReviewReadDto extends BaseEntity, TimeStamp {
  user: UserInfo
  isAnonymous: boolean
  content: string
  rating: number
}
