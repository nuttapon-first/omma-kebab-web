<template>
  <div v-if="isLoading" class="flex">
    <div class="d-flex justify--center">
      <div>
        <va-progress-circle indeterminate />
      </div>
    </div>
  </div>
  <div v-else class="row">
    <div class="flex xl12 xs12">
      <!-- <div class="row">
        <div v-for="(info, idx) in infoTiles" :key="idx" class="flex xs12 sm4">
          <va-card class="mb-4" :color="info.color">
            <va-card-content>
              <p class="display-2" style="color: white">{{ info.value }}</p>
              <p style="color: white">{{ t('dashboard.info.' + info.text) }}</p>
            </va-card-content>
          </va-card>
        </div>
      </div> -->

      <div class="row">
        <div class="flex xs12 md12">
          <va-card>
            <va-card-content>
              <div class="row">
                <div class="flex">
                  <va-date-input v-model="dateRange" :label="'เลือกช่วงเวลา'" mode="range" clearable />
                </div>
                <div class="flex">
                  <va-button class="mr-2 mb-2" icon-right="search" @click="getDashboardData"> {{ 'ค้นหา' }}</va-button>
                </div>
              </div>
            </va-card-content>
          </va-card>
        </div>
        <div class="flex xs12 md3">
          <va-card color="info">
            <va-card-content>
              <p class="display-2" style="color: white">{{ dashboardData.totalIncome }} บาท</p>
              <p class="no-wrap" style="color: white">{{ 'ยอดขายทั้งหมด' }}</p>
            </va-card-content>
          </va-card>
        </div>
        <div class="flex xs12 md3">
          <va-card color="danger">
            <va-card-content>
              <p class="display-2" style="color: white">
                {{ dashboardData.totalCost ? dashboardData.totalCost.toFixed(2) : 0 }} บาท
              </p>
              <p class="no-wrap" style="color: white">{{ 'ต้นทุนทั้งหมด' }}</p>
            </va-card-content>
          </va-card>
        </div>
        <div class="flex xs12 md3">
          <va-card color="success">
            <va-card-content>
              <p class="display-2" style="color: white">
                {{
                  dashboardData.totalProfit
                    ? dashboardData.totalProfit > 0
                      ? '+ ' + dashboardData.totalProfit.toFixed(2)
                      : dashboardData.totalProfit.toFixed(2)
                    : 0
                }}
                บาท
              </p>
              <p class="no-wrap" style="color: white">{{ 'กำไรทั้งหมด' }}</p>
            </va-card-content>
          </va-card>
        </div>
        <div class="flex xs12 md3">
          <va-card :color="'#9670D1'">
            <va-card-content>
              <p class="display-2" style="color: white">
                {{ dashboardData.totalExpense ? dashboardData.totalExpense : 0 }}
                บาท
              </p>
              <p class="no-wrap" style="color: white">{{ 'ค่าใช้จ่ายอื่นๆ' }}</p>
            </va-card-content>
          </va-card>
        </div>
        <!-- <div class="flex xs12 md3">
          <va-card color="toxic">
            <va-card-content>
              <p class="display-2" style="color: white">
                {{
                  dashboardData.totalProfitPercent
                    ? dashboardData.totalProfitPercent > 0
                      ? '+' + dashboardData.totalProfitPercent.toFixed(2)
                      : dashboardData.totalProfitPercent.toFixed(2)
                    : 0
                }}
                %
              </p>
              <p class="no-wrap" style="color: white">{{ 'คิดเป็น %' }}</p>
            </va-card-content>
          </va-card>
        </div> -->

        <div v-for="detail in dashboardData.incomeDetails" :key="detail.channel" class="flex md6">
          <va-card>
            <va-card-title>{{ detail.channel }}</va-card-title>
            <va-card-content>
              <div class="row row-separated">
                <p class="display-5 text--center flex md6">{{ 'ยอดขาย' }}</p>
                <p class="display-2 text--center flex md6" :style="{ color: '#3597DA' }">{{ detail.income }}</p>
              </div>
              <div class="row row-separated">
                <p class="display-5 text--center flex md6">{{ 'ต้นทุน' }}</p>
                <p class="display-2 text--center flex md6" :style="{ color: '#EC2F29' }">
                  {{ detail.cost ? detail.cost.toFixed(2) : 0 }}
                </p>
              </div>
              <div class="row row-separated">
                <p class="display-5 text--center flex md6">{{ 'กำไร' }}</p>
                <p class="display-2 text--center flex md6" :style="{ color: '#5ADA35' }">
                  {{ detail.profit ? detail.profit.toFixed(2) : 0 }}
                </p>
              </div>
            </va-card-content>
          </va-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import moment from 'moment'
  import { defineComponent } from 'vue'
  import { getDashboard } from './dashboard.api'

  export default defineComponent({
    name: 'SalesReport',
    data() {
      return {
        isLoading: false,
        dateRange: { start: moment().startOf('d'), end: moment().endOf('d') },
        dashboardData: {} as any,
      }
    },

    async mounted() {
      await this.getDashboardData()
    },

    methods: {
      async getDashboardData() {
        try {
          this.isLoading = true
          const query: any = {
            start_date: moment(this.dateRange.start).format('YYYYMMDDHHmmss'),
            end_date: moment(this.dateRange.end).endOf('d').format('YYYYMMDDHHmmss'),
          }
          const data = await getDashboard(query)
          this.isLoading = false
          this.dashboardData = data.dashboard
        } catch (err) {
          this.isLoading = false
          this.notification('Get Dashboard', 'failure', 'error')
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

<style lang="scss" scoped>
  .display-2 {
    margin: 0;
    line-height: 1;
  }

  .row-separated {
    .flex + .flex {
      border-left: 1px solid var(--va-background);
    }
  }

  .rich-theme-card-text {
    line-height: 1.5;
  }

  .gallery-carousel {
    width: 80vw;
    max-width: 100%;

    @media all and (max-width: 576px) {
      width: 100%;
    }
  }
</style>
