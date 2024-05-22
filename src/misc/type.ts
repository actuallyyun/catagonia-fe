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
  categoryId: number
  inventory: number
}

export type CreateProductRequest = CreateProductInput & {
  images: string[]
}

export type UserTextInput = {
  firstname: string
  lastname: string
  email: string
  password: string
}

export type UserRegister = {
  firstname: string
  lastname: string
  email: string
  password: string
  avatar: string
}

export type User = UserRegister & {
  role: 'user' | 'admin'
  id: string
}

export type UserInfo = {
  id: string
  role: 'user' | 'admin'
  firstname: string
  lastname: string
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
  firstname: string
  lastname: string
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
