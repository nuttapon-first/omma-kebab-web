<template>
  <div class="markup-tables flex">
    <va-card>
      <va-card-title>{{ 'Expense Report' }}</va-card-title>
      <va-card-content>
        <div class="row">
          <div class="flex">
            <va-date-input v-model="dateRange" :label="'เลือกช่วงเวลา'" mode="range" clearable />
          </div>
          <div class="flex">
            <va-button class="mr-2 mb-2" icon-right="search" @click="getExpenses"> {{ 'ค้นหา' }}</va-button>
          </div>
          <div class="flex custom-right">
            <va-button class="mr-2 mb-2" color="success" @click="showCreateModel">
              {{ 'Create New Expense' }}
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
                <th>ราคา</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="transaction in expenseReport.transactions" :key="transaction.id">
                <td>{{ formatDate(transaction.createdAt) }}</td>
                <td>{{ transaction.branch }}</td>
                <td>{{ transaction.expenseDetail }}</td>
                <td>{{ transaction.expenseCost }}</td>
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
        </div>
      </va-card-content>
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
              <va-select v-model="createExpenseData.branch" :label="'branch'" :options="branchData" />
            </div>
            <br />
            <div class="flex md12">
              <va-input v-model="createExpenseData.expenseDetail" :label="'detail'" />
            </div>
            <br />
            <div class="flex md12">
              <va-input v-model.number="createExpenseData.expenseCost" :label="'cost'" @keypress="isNumber"/>
            </div>
            <br />
            <div class="my-5">
              <va-divider />
            </div>

            <div class="my-5">
              <va-divider />
            </div>
            <div class="row justify--center">
              <div class="flex sm2">
                <va-button class="mr-2 mb-2" color="secondary" @click="cancelCreateExpense">
                  {{ 'Cancel' }}
                </va-button>
              </div>
              <div class="flex sm2">
                <va-button class="mr-2 mb-2" color="primary" @click="createExpense">
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
  import { getExpenseList, createExpense } from './expenseReport.api'
  import moment from 'moment'
  export default defineComponent({
    name: 'SalesReport',
    data() {
      return {
        isLoading: false,
        expenseReport: {} as any,
        dateRange: { start: moment().startOf('d'), end: moment().endOf('d') },
        isShowCreateModel: false,
        createExpenseData: {
          transactionType: 'sales',
        } as any,
        createdAt: new Date(),
        branchData: ['Ommakebab 1', 'Ommakebab 2'],
      }
    },

    async mounted() {
      await this.getExpenses()
    },

    methods: {
      async getExpenses() {
        try {
          this.isLoading = true
          const query: any = {
            start_date: moment(this.dateRange.start).format('YYYYMMDDHHmmss'),
            end_date: moment(this.dateRange.end).endOf('d').format('YYYYMMDDHHmmss'),
          }
          const data = await getExpenseList(query)
          this.isLoading = false
          this.expenseReport = data.expenseReport
          console.log(data)
          if (this.expenseReport.transactions.length > 0) {
            this.expenseReport.transactions.push({
              branch: 'สรุป',
              expenseCost: data.expenseReport.summaryCost,
            })
          }
        } catch (err) {
          this.isLoading = false
          this.notification('Get Transactions', 'failure', 'error')
          throw err
        }
      },
      formatDate: function (date: string) {
        if (date) return moment(date).format('DD-MM-YYYY')
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
        this.isShowCreateModel = true
      },
      cancelCreateExpense() {
        this.createExpenseData = {} as any
        this.isShowCreateModel = false
      },
      async createExpense() {
        try {
          this.createExpenseData.createdAt = moment(this.createdAt).valueOf()
          await createExpense(this.createExpenseData)
          this.isShowCreateModel = false
          await this.getExpenses()
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
</style>
