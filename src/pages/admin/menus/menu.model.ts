export interface ICreateMenu {
  menuName: string
  menuNameTH: string
  menuCost: number
  menuType: string
  menuUnit: number
  menuRecipe: [IMenuRecipe]
}

interface IMenuRecipe {
  stockId: number
  ingredientAmount: number
}

export interface IEditMenu extends ICreateMenu {
  id: number
  deletedRecipeIds: [string]
}
