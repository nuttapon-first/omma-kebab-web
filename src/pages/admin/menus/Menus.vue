<template>
  <div class="markup-tables flex">
    <va-card>
      <va-card-content>
        <va-button class="mr-2 mb-2" color="success" @click="showCreateModel">
          {{ 'Create New Menu' }}
        </va-button>
      </va-card-content>
      <va-card-title>{{ 'Menus' }}</va-card-title>
      <va-card-content>
        <div v-if="isLoading" class="flex">
          <div class="d-flex justify--center">
            <div>
              <va-progress-circle indeterminate />
            </div>
          </div>
        </div>
        <div v-else class="table-wrapper">
          <table class="va-table va-table--striped va-table--hoverable">
            <thead>
              <tr>
                <th>ID</th>
                <th>ชื่อ</th>
                <th>ชื่อไทย</th>
                <th>จำนวนหน่วย</th>
                <th>ต้นทุน</th>
                <th>ประเภท</th>
                <th>สร้างวันที่</th>
                <th>อัพเดทล่าสุด</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="menu in menuData" :key="menu.id">
                <td>{{ menu.id }}</td>
                <td>{{ menu.menuName }}</td>
                <td>{{ menu.menuNameTH }}</td>
                <td>{{ menu.menuUnit }}</td>
                <td>{{ menu.menuCost }}</td>
                <td>{{ menu.menuType }}</td>
                <td>{{ formatDate(menu.CreatedAt) }}</td>
                <td>{{ formatDate(menu.UpdatedAt) }}</td>
                <td>
                  <va-button
                    size="small"
                    color="primary"
                    class="mr-2 mb-2"
                    outline
                    icon="delete"
                    @click="showEditModel(menu)"
                    >{{ 'แก้ไข' }}</va-button
                  >
                  <va-button
                    size="small"
                    color="danger"
                    class="mr-2 mb-2"
                    outline
                    icon="delete"
                    @click="deleteMenu(menu.id)"
                    >{{ 'ลบ' }}</va-button
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </va-card-content>
    </va-card>
  </div>

  <!--//Modals-->
  <VueSidePanel v-model="isShowCreateModel" lock-scroll width="700px">
    <div class="form-elements">
      <div class="flex md12">
        <va-card>
          <va-card-title>{{ 'Create new menu' }}</va-card-title>
          <va-card-content>
            <br /><br /><br />
            <div class="flex md12">
              <va-input v-model="newMenuData.menuName" :label="'Name'" />
            </div>
            <br />
            <div class="flex md12">
              <va-input v-model="newMenuData.menuNameTH" :label="'NameTH'" />
            </div>
            <br />
            <div class="flex md12">
              <va-input v-model.number="newMenuData.menuCost" :label="'Cost'" @keypress="isNumber" />
            </div>
            <br />
            <div class="flex md12">
              <va-select v-model="newMenuData.menuType" :label="'Menu Type'" :options="menuType" />
            </div>
            <br />
            <div class="flex md12">
              <va-input v-model.number="newMenuData.menuUnit" :label="'Menu Unit'" @keypress="isNumber" />
            </div>
            <br />
            <div class="my-5">
              <va-divider />
            </div>
            <div class="row">
              <div class="flex md1">{{ 'recipe' }}</div>
              <div class="flex md6">
                <va-button class="mr-2 mb-2" size="small" color="success" @click="addRecipe">{{ '+' }} </va-button>
              </div>
            </div>

            <div v-for="(recipe, index) in menuRecipe" :key="recipe.stock.id">
              <div class="row">
                <div class="flex md5">
                  <va-select
                    v-model="recipe.stock"
                    :label="'select stock'"
                    text-by="ingredient"
                    track-by="id"
                    :options="stockData"
                  />
                </div>
                &nbsp;&nbsp;&nbsp;
                <div class="flex md5">
                  <va-input
                    v-model.number="recipe.ingredientAmount"
                    :label="'Ingredient Amount'"
                    @keypress="isNumber"
                  />
                </div>
                &nbsp;&nbsp;&nbsp;
                <div class="flex md1">
                  <va-button
                    size="small"
                    color="danger"
                    class="mr-2 mb-2"
                    icon="glyphicon-minus"
                    @click="removeRecipe(index)"
                  ></va-button>
                </div>
                <div class="flex md12"><br /></div>
              </div>
            </div>

            <div class="my-5">
              <va-divider />
            </div>
            <div class="row justify--center">
              <div class="flex sm2">
                <va-button class="mr-2 mb-2" color="secondary" @click="cancelCreateNewMenu">
                  {{ 'Cancel' }}
                </va-button>
              </div>
              <div class="flex sm2">
                <va-button class="mr-2 mb-2" color="primary" @click="create">
                  {{ 'Create' }}
                </va-button>
              </div>
            </div>
          </va-card-content>
        </va-card>
      </div>
    </div>
  </VueSidePanel>

  <VueSidePanel v-model="isShowEditModel" lock-scroll no-close width="700px">
    <div class="form-elements">
      <div class="flex md12">
        <va-card>
          <va-card-title>{{ 'Edit new menu' }}</va-card-title>
          <va-card-content>
            <br /><br /><br />
            <div class="flex md12">
              <va-input v-model="editMenuData.menuName" :label="'Name'" />
            </div>
            <br />
            <div class="flex md12">
              <va-input v-model="editMenuData.menuNameTH" :label="'NameTH'" />
            </div>
            <br />
            <div class="flex md12">
              <va-input v-model.number="editMenuData.menuCost" :label="'Cost'" @keypress="isNumber" />
            </div>
            <br />
            <div class="flex md12">
              <va-select v-model="editMenuData.menuType" :label="'Menu Type'" :options="menuType" />
            </div>
            <br />
            <div class="flex md12">
              <va-input v-model.number="editMenuData.menuUnit" :label="'Menu Unit'" @keypress="isNumber" />
            </div>
            <br />
            <div class="my-5">
              <va-divider />
            </div>
            <div class="row">
              <div class="flex md1">{{ 'recipe' }}</div>
              <div class="flex md6">
                <va-button class="mr-2 mb-2" size="small" color="success" @click="addNewRecipe">{{ '+' }} </va-button>
              </div>
            </div>

            <div v-for="(recipe, index) in editMenuData.menuRecipe" :key="recipe.stockId">
              <div class="row">
                <div class="flex md5">
                  <va-select
                    v-model="recipe.stockId"
                    :label="'select stock'"
                    text-by="ingredient"
                    :options="stockData"
                    value-by="id"
                  />
                </div>
                &nbsp;&nbsp;&nbsp;
                <div class="flex md5">
                  <va-input
                    v-model.number="recipe.ingredientAmount"
                    :label="'Ingredient Amount'"
                    @keypress="isNumber"
                  />
                </div>
                &nbsp;&nbsp;&nbsp;
                <div class="flex md1">
                  <va-button
                    size="small"
                    color="danger"
                    class="mr-2 mb-2"
                    icon="glyphicon-minus"
                    @click="deleteRecipe(index, recipe)"
                  ></va-button>
                </div>
                <div class="flex md12"><br /></div>
              </div>
            </div>

            <div class="my-5">
              <va-divider />
            </div>
            <div class="row justify--center">
              <div class="flex sm2">
                <va-button class="mr-2 mb-2" color="secondary" @click="cancelEditMenu">
                  {{ 'Cancel' }}
                </va-button>
              </div>
              <div class="flex sm2">
                <va-button class="mr-2 mb-2" color="primary" @click="edit">
                  {{ 'Edit' }}
                </va-button>
              </div>
            </div>
          </va-card-content>
        </va-card>
      </div>
    </div>
  </VueSidePanel>
</template>

<script set lang="ts">
  import { defineComponent } from 'vue'
  // import { useI18n } from 'vue-i18n'
  import { getMenuList, getMenuById, createMenu, deleteMenu, editMenu } from './menu.api'
  import moment from 'moment'
  import { ICreateMenu, IEditMenu } from './menu.model'
  import { getStockList } from '../stocks/stock.api'
  import { IStock } from '../stocks/stock.model'
  // import { IAddStock, IStock, ICreateStock } from './stock.model'
  // const { t } = useI18n()
  export default defineComponent({
    name: 'Stocks',
    data() {
      return {
        isLoading: false,
        menuData: [] as any,
        isShowEditModel: false,
        isShowCreateModel: false,
        selectStock: {} as any,
        addStockAmount: 0,
        menuType: ['kebab', 'burger'],
        stockData: {} as IStock,
        newMenuData: {} as ICreateMenu,
        menuRecipe: [] as any,
        editMenuData: {} as IEditMenu,
        deletedRecipeId: [] as any,
      }
    },

    async mounted() {
      await this.getMenuList()
      await this.getStocks()
    },

    methods: {
      async getMenuList() {
        this.isLoading = true
        try {
          const data = await getMenuList()
          this.isLoading = false
          this.menuData = data.menus
        } catch (err) {
          this.isLoading = false
          this.notification('Get Menu', 'failure', 'error')
          throw err
        }
      },
      async getStocks() {
        try {
          const data = await getStockList()
          this.stockData = data.stocks
        } catch (err) {
          this.notification('Get stock', 'failure', 'error')
          throw err
        }
      },
      isNumber(evt: any) {
        evt = evt ? evt : window.event
        var charCode = evt.which ? evt.which : evt.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
          evt.preventDefault()
        } else {
          return true
        }
      },
      getPriceColor(price: number) {
        return price > 0 ? 'success' : 'danger'
      },
      formatDate: function (date: string) {
        return moment(date).format('DD-MM-YYYY HH:mm:ss')
      },
      async showEditModel(menu: any) {
        await this.getMenuById(menu.id)
        this.isShowEditModel = true
      },
      showCreateModel() {
        this.isShowCreateModel = true
      },
      addRecipe() {
        if (!this.menuRecipe) this.menuRecipe = [] as any
        this.menuRecipe.push({
          stock: {},
          ingredientAmount: 0,
        })
      },
      removeRecipe(index: number) {
        this.menuRecipe.splice(index, 1)
      },
      addNewRecipe() {
        this.editMenuData.menuRecipe.push({
          stockId: 0,
          ingredientAmount: 0,
        })
      },
      deleteRecipe(index: number, recipe: any) {
        this.editMenuData.menuRecipe.splice(index, 1)
        if (recipe.id) this.deletedRecipeId.push(`${recipe.id}`)
      },
      async getMenuById(id: number) {
        try {
          const data = await getMenuById(id)
          this.editMenuData = data.menu
        } catch (err) {
          this.notification('Get Menu', 'failure', 'error')
          throw err
        }
      },
      // async add() {
      //   try {
      //     const payload: IAddStock = {
      //       id: this.selectStock.id,
      //       ingredient: this.selectStock.ingredient,
      //       stockAmount: this.addStockAmount,
      //     }
      //     const [err] = await addStock(payload)
      //     if (err) console.error(err)
      //     else await this.getStocks()
      //   } catch (err) {
      //     console.error(err)
      //     throw err
      //   }
      // },
      // cancelAddStock() {
      //   this.addStockAmount = 0
      //   this.selectStock = {} as any
      // },
      async create() {
        try {
          const recipes = this.menuRecipe.map((recipe: any) => {
            return {
              stockId: recipe.stock.id,
              ingredientAmount: recipe.ingredientAmount,
            }
          })
          this.newMenuData.menuRecipe = recipes
          await createMenu(this.newMenuData)
          await this.getMenuList()
          this.isShowCreateModel = false
          this.notification('Create Menu', 'success', 'success')
        } catch (err) {
          this.isShowCreateModel = false
          this.notification('Create Menu', 'failure', 'error')
          throw err
        }
      },
      cancelCreateNewMenu() {
        this.isShowCreateModel = false
        this.newMenuData = {} as ICreateMenu
        this.menuRecipe = [] as any
      },
      async edit() {
        try {
          this.editMenuData.deletedRecipeIds = this.deletedRecipeId
          await editMenu(this.editMenuData, this.editMenuData.id)
          await this.getMenuList()
          this.isShowEditModel = false
          this.deletedRecipeId = [] as any
          this.notification('Edit Menu', 'success', 'success')
        } catch (err) {
          this.isShowEditModel = false
          this.notification('Edit Menu', 'failure', 'error')
        }
      },
      cancelEditMenu() {
        this.isShowEditModel = false
        this.editMenuData = {} as IEditMenu
        this.deletedRecipeId = [] as any
      },
      async deleteMenu(menuId: number) {
        try {
          await deleteMenu(menuId)
          await this.getMenuList()
          this.notification('Delete Menu', 'success', 'success')
        } catch (err) {
          this.notification('Delete Menu', 'failure', 'error')
          throw err
        }
      },
      notification(title: string, text: string, type: string) {
        this.$notify({
          title: title,
          text: text,
          type: type,
        })
      },
    },
  })
</script>

<style lang="scss">
  .markup-tables {
    .table-wrapper {
      overflow: auto;
    }

    .va-table {
      width: 100%;
    }
  }
</style>
