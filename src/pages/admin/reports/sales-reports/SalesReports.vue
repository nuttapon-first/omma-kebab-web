<template>
  <div class="markup-tables flex">
    <va-card>
      <va-card-title>{{ 'Sales Report' }}</va-card-title>
      <va-card-content>
        <div class="row">
          <div class="flex">
            <va-date-input v-model="dateRange" :label="'เลือกช่วงเวลา'" mode="range" clearable />
          </div>
          <div class="flex">
            <va-button class="mr-2 mb-2" icon-right="search" @click="getTransactions"> {{ 'ค้นหา' }}</va-button>
          </div>
          <div class="flex custom-right">
            <va-button class="mr-2 mb-2" color="success" @click="showCreateModel">
              {{ 'Create New Transaction' }}
            </va-button>
          </div>
        </div>
        <div class="table-wrapper">
          <div v-if="isLoading" class="flex">
            <div class="d-flex justify--center">
              <div>
                <va-progress-circle indeterminate />
              </div>
            </div>
          </div>
          <table v-else class="va-table va-table--striped va-table--hoverable">
            <thead>
              <tr>
                <th>วันที่</th>
                <th>สาขา</th>
                <th>รายการ</th>
                <th>Add</th>
                <th>ราคา</th>
                <th>จำนวน</th>
                <th>ราคารวม</th>
                <th>Fee</th>
                <th>Vat</th>
                <th>ส่วนลด</th>
                <th>ยอดขาย</th>
                <th>ต้นทุนรวม</th>
                <th>กำไรรวม</th>
                <th>อัตราส่วนกำไร</th>
                <th>ช่องทางการจ่ายเงิน</th>
                <th>ช่องทางการขาย</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="transaction in salesReport.rows" :key="transaction.id">
                <td>{{ formatDate(transaction.createdAt) }}</td>
                <td>{{ transaction.branch }}</td>
                <td>{{ transaction.menuName }}</td>
                <td>{{ transaction.addOn }}</td>
                <td>{{ transaction.transactionPrice }}</td>
                <td>{{ transaction.transactionUnit }}</td>
                <td>{{ transaction.transactionPrice * transaction.transactionUnit || null }}</td>
                <td>{{ transaction.fee }}</td>
                <td>{{ transaction.vat }}</td>
                <td>{{ transaction.discount }}</td>
                <td>{{ transaction.totalPrice }}</td>
                <td>{{ transaction.totalCost }}</td>
                <td>
                  <va-badge :text="transaction.totalProfit" :color="getPriceColor(transaction.totalProfit)" />
                </td>
                <td>
                  <va-badge
                    :text="`${transaction.totalProfitPercent.toFixed(2)}%`"
                    :color="getPriceColor(transaction.totalProfitPercent)"
                  />
                </td>
                <td>{{ transaction.paymentChannel }}</td>
                <td>{{ transaction.channel }}</td>
                <!-- <td>
                  <va-badge :text="user.status" :color="getStatusColor(user.status)" />
                </td> -->
              </tr>
            </tbody>

            <!-- <tfoot>
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th>สรุป</th>
                <th></th>
                <th>{{ salesReport.summaryAmount }}</th>
                <th></th>
                <th>{{ salesReport.summaryFee }}</th>
                <th>{{ salesReport.summaryVat }}</th>
                <th></th>
                <th>{{ salesReport.summarySales }}</th>
                <th>{{ salesReport.summaryCost }}</th>
                <th>{{ salesReport.summaryProfit }}</th>
                <th>{{ salesReport.avgProfitPercent }} %</th>
                <th></th>
                <th></th>
              </tr>
            </tfoot> -->
          </table>
          <br />
        </div>
      </va-card-content>
      <div v-if="totalRows > 0" class="row justify--center">
        <!-- <va-pagination
          v-model="page"
          :total="totalRows"
          :page-size="pageSize"
          :update:v-model="getTransactions()"
        /> -->
        <vue-awesome-paginate
          :total-items="totalRows"
          :items-per-page="pageSize"
          :current-page="page"
          :on-click="onClickHandler"
        />
      </div>
      <br />
    </va-card>
  </div>

  <VueSidePanel v-model="isShowCreateModel" lock-scroll no-close width="700px">
    <div class="form-elements">
      <div class="flex md12">
        <va-card>
          <va-card-title>{{ 'Edit new menu' }}</va-card-title>
          <va-card-content>
            <br /><br /><br />
            <div class="flex md12">
              <va-date-input v-model="createdAt" :label="'วันที่'" hidden />
            </div>
            <br />
            <div class="flex md12">
              <va-select
                v-model="createTransactionData.menuId"
                :label="'MENU'"
                text-by="menuName"
                :options="menuData"
                value-by="id"
              />
            </div>
            <br />
            <div class="flex md12">
              <va-select v-model="createTransactionData.branch" :label="'branch'" :options="branchData" />
            </div>
            <br />
            <div class="flex md12">
              <va-select v-model="createTransactionData.channel" :label="'channel'" :options="channelData" />
            </div>
            <br />
            <div class="flex md12">
              <va-input v-model.number="createTransactionData.transactionPrice" :label="'price'" @keypress="isNumber" />
            </div>
            <br />
            <div class="flex md12">
              <va-input v-model.number="createTransactionData.transactionUnit" :label="'unit'" @keypress="isNumber" />
            </div>
            <br />
            <div class="flex md12">
              <va-input v-model.number="createTransactionData.discount" :label="'discount'" @keypress="isNumber" />
            </div>
            <br />
            <div class="flex md12">
              <va-select
                v-model="createTransactionData.paymentChannel"
                :label="'payment channel'"
                :options="paymentChannel"
              />
            </div>
            <br />
            <div class="my-5">
              <va-divider />
            </div>
            <div class="row">
              <div class="flex md1">{{ 'Add on' }}</div>
              <div class="flex md6">
                <va-button class="mr-2 mb-2" size="small" color="success" @click="addAddOn">{{ '+' }} </va-button>
              </div>
            </div>

            <div v-for="(addOn, index) in createTransactionData.addOns" :key="addOn.stockId">
              <div class="row">
                <div class="flex md5">
                  <va-select
                    v-model="addOn.stockId"
                    :label="'select stock'"
                    text-by="ingredient"
                    :options="stockData"
                    value-by="id"
                  />
                </div>
                &nbsp;&nbsp;&nbsp;
                <div class="flex md5">
                  <va-input v-model.number="addOn.amount" :label="'Ingredient Amount'" @keypress="isNumber" />
                </div>
                &nbsp;&nbsp;&nbsp;
                <div class="flex md1">
                  <va-button
                    size="small"
                    color="danger"
                    class="mr-2 mb-2"
                    icon="glyphicon-minus"
                    @click="deleteAddOn(index)"
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
                <va-button class="mr-2 mb-2" color="secondary" @click="cancelCreateTransaction">
                  {{ 'Cancel' }}
                </va-button>
              </div>
              <div class="flex sm2">
                <va-button class="mr-2 mb-2" color="primary" @click="createTransaction">
                  {{ 'Create' }}
                </va-button>
              </div>
            </div>
          </va-card-content>
        </va-card>
      </div>
    </div>
  </VueSidePanel>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  // import { useI18n } from 'vue-i18n'
  import { createTransactionAPI, getTransactionList } from './salesReport.api'
  import moment from 'moment'
  import { getMenuList } from '../../menus/menu.api'
  import { getStockList } from '../../stocks/stock.api'
  // const { t } = useI18n()
  export default defineComponent({
    name: 'SalesReport',
    data() {
      return {
        isLoading: false,
        page: 1,
        pageSize: 10,
        totalRows: 0,
        salesReport: {} as any,
        dateRange: { start: moment().startOf('d'), end: moment().endOf('d') },
        isShowCreateModel: false,
        menuData: [] as any,
        stockData: [] as any,
        createTransactionData: {
          transactionType: 'sales',
        } as any,
        createdAt: new Date(),
        branchData: ['Ommakebab 1', 'Ommakebab 2'],
        channelData: ['frontend', 'lineman_30', 'lineman_09', 'other'],
        paymentChannel: ['cash', 'ktb', 'scb', 'other'],
      }
    },

    async mounted() {
      await this.getTransactions()
    },

    methods: {
      async getTransactions() {
        try {
          this.isLoading = true
          const query: any = {
            start_date: moment(this.dateRange.start).format('YYYYMMDDHHmmss'),
            end_date: moment(this.dateRange.end).endOf('d').format('YYYYMMDDHHmmss'),
            page: this.page,
            page_size: this.pageSize,
            sort: 'created_at',
            sortDesc: true,
          }
          const data = await getTransactionList(query)
          this.isLoading = false
          this.salesReport = data.transactions
          this.totalRows = data.transactions.total_rows
          // this.pageSize = data.transactions.limit
        } catch (err) {
          this.isLoading = false
          this.notification('Get Transactions', 'failure', 'error')
          throw err
        }
      },
      formatDate: function (date: string) {
        if (date) return moment(date).format('DD-MM-YYYY HH:mm:ss')
        else return null
      },
      getPriceColor(price: number) {
        return price > 0 ? 'success' : 'danger'
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
      async showCreateModel() {
        try {
          const data = await getMenuList()
          this.menuData = data.menus
          const StockData = await getStockList()
          this.stockData = StockData.stocks
          this.isShowCreateModel = true
        } catch (err) {
          this.notification('Get Stock/Menu List', 'failure', 'error')
        }
      },
      addAddOn() {
        if (!this.createTransactionData.addOns) this.createTransactionData.addOns = [] as any
        this.createTransactionData.addOns.push({
          stockId: 0,
          amount: 0,
        })
      },
      deleteAddOn(index: number) {
        this.createTransactionData.addOns.splice(index, 1)
      },
      cancelCreateTransaction() {
        this.createTransactionData = {} as any
        this.isShowCreateModel = false
      },
      async createTransaction() {
        try {
          this.createTransactionData.createdAt = moment(this.createdAt).valueOf()
          await createTransactionAPI(this.createTransactionData)
          this.isShowCreateModel = false
          await this.getTransactions()
          this.notification('Add Transactions', 'success', 'success')
        } catch (err) {
          this.isShowCreateModel = false
          this.notification('Create Transactions', 'failure', 'error')
        }
      },
      notification(title: string, text: string, type: string) {
        this.$notify({
          title: title,
          text: text,
          type: type,
        })
      },
      async onClickHandler(page: number) {
        this.page = page
        await this.getTransactions()
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

  .custom-right {
    position: absolute;
    right: 0;
  }

  .pagination-container {
    display: flex;
    column-gap: 10px;
  }

  .paginate-buttons {
    height: 40px;
    width: 40px;
    border-radius: 20px;
    cursor: pointer;
    background-color: rgb(242, 242, 242);
    border: 1px solid rgb(217, 217, 217);
    color: black;
  }

  .paginate-buttons:hover {
    background-color: #d8d8d8;
  }

  .active-page {
    background-color: #3498db;
    border: 1px solid #3498db;
    color: white;
  }

  .active-page:hover {
    background-color: #2988c8;
  }
</style>
