<template>
  <div class="markup-tables flex">
    <va-card>
      <va-card-content>
        <va-button class="mr-2 mb-2" color="success" @click="showCreateModel">
          {{ 'Create New Stock' }}
        </va-button>
        <va-button class="mr-2 mb-2" color="warning" @click="showAddModel">
          {{ 'Add Stock' }}
        </va-button>
      </va-card-content>
      <va-card-title>{{ 'Stocks' }}</va-card-title>
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
                <th>ต้นทุนต่อหน่วย</th>
                <th>จำนวนหน่วย</th>
                <th>สร้างวันที่</th>
                <th>อัพเดทล่าสุด</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="stock in stockData" :key="stock.id">
                <td>{{ stock.id }}</td>
                <td>{{ stock.ingredient }}</td>
                <td>{{ stock.stockCost }}</td>
                <td>{{ stock.stockAmount }}</td>
                <td>{{ formatDate(stock.CreatedAt) }}</td>
                <td>{{ formatDate(stock.UpdatedAt) }}</td>
                <td>
                  <va-button
                    size="small"
                    color="danger"
                    class="mr-2 mb-2"
                    outline
                    icon="delete"
                    @click="deleteStock(stock.id)"
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
  <va-modal
    v-model="isShowAddModel"
    :title="'Add stock'"
    :ok-text="'add'"
    :cancel-text="'cancel'"
    blur
    size="large"
    @ok="add"
    @cancel="cancelAddStock"
  >
    <va-card-content>
      <form>
        <div class="row">
          <div class="flex">
            <va-select
              v-model="selectStock"
              :label="'select stock'"
              text-by="ingredient"
              track-by="id"
              :options="stockData"
            />
          </div>
          <div class="flex">
            <va-input v-model.number="addStockAmount" placeholder="Stock amount" />
          </div>
        </div>
      </form>
    </va-card-content>
  </va-modal>

  <va-modal
    v-model="isShowCreateModel"
    :title="'Create stock'"
    :ok-text="'create'"
    :cancel-text="'cancel'"
    blur
    size="large"
    @ok="create"
    @cancel="cancelCreateStock"
  >
    <va-card-content>
      <form>
        <div class="row">
          <div class="flex">
            <va-input v-model="newStockData.ingredient" placeholder="Stock Name" />
          </div>
          <div class="flex">
            <va-input v-model.number="newStockData.stockCost" placeholder="Stock Cost" />
          </div>
          <div class="flex">
            <va-input v-model.number="newStockData.stockAmount" placeholder="Stock Amount" />
          </div>
        </div>
      </form>
    </va-card-content>
  </va-modal>
</template>

<script set lang="ts">
  import { defineComponent } from 'vue'
  // import { useI18n } from 'vue-i18n'
  import { getStockList, addStock, createStock, deleteStock } from './stock.api'
  import moment from 'moment'
  import { IAddStock, IStock, ICreateStock } from './stock.model'
  // const { t } = useI18n()
  export default defineComponent({
    name: 'Stocks',
    data() {
      return {
        isLoading: false,
        stockData: [] as any,
        isShowAddModel: false,
        isShowCreateModel: false,
        selectStock: {} as IStock,
        addStockAmount: 0,
        newStockData: {} as ICreateStock,
      }
    },

    async mounted() {
      await this.getStocks()
    },

    methods: {
      async getStocks() {
        this.isLoading = true
        try {
          const data = await getStockList()
          this.isLoading = false
          this.stockData = data.stocks
        } catch (err) {
          this.isLoading = false
          this.notification('Get Stock', 'failure', 'error')
          throw err
        }
      },
      getPriceColor(price: number) {
        return price > 0 ? 'success' : 'danger'
      },
      formatDate: function (date: string) {
        return moment(date).format('DD-MM-YYYY HH:mm:ss')
      },
      showAddModel() {
        this.isShowAddModel = true
      },
      showCreateModel() {
        this.isShowCreateModel = true
      },
      async add() {
        try {
          const payload: IAddStock = {
            id: this.selectStock.id,
            ingredient: this.selectStock.ingredient,
            stockAmount: this.addStockAmount,
          }
          await addStock(payload)
          await this.getStocks()
          this.notification('Add Stock', 'success', 'success')
        } catch (err) {
          this.notification('Add Stock', 'failure', 'error')
          throw err
        }
      },
      cancelAddStock() {
        this.addStockAmount = 0
        this.selectStock = {} as any
      },
      async create() {
        try {
          await createStock(this.newStockData)
          await this.getStocks()
          this.notification('Create Stock', 'success', 'success')
        } catch (err) {
          this.notification('Create Stock', 'failure', 'error')
          throw err
        }
      },
      cancelCreateStock() {
        this.newStockData = {} as ICreateStock
      },
      async deleteStock(stockId: number) {
        try {
          await deleteStock(stockId)
          await this.getStocks()
          this.notification('Delete Stock', 'success', 'success')
        } catch (err) {
          this.notification('Delete Stock', 'failure', 'error')
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
