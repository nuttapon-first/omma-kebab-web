export interface IAddStock {
  id: number
  ingredient: string
  stockAmount: number
}

export interface IStock {
  id: number
  CreatedAt: string
  UpdatedAt: string
  ingredient: string
  stockCost: number
  stockAmount: number
}
export interface ICreateStock {
  ingredient: string
  stockCost: number
  stockAmount: number
}
