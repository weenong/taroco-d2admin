<template>
  <el-row :gutter="10">
    <el-col :span="12">
      <el-card class="box-card">
        <div slot="header">
          <span>Info</span>
        </div>
        <div class="item-info" v-for="(values, key) in info" :key="'info-' + key">
          <div class="title">{{key}}</div>
          <table class="table">
            <tr v-for="(value, key) in values" :key="'info-value-' + key">
              <td class="key">{{key}}</td>
              <td class="value">{{value}}</td>
            </tr>
          </table>
        </div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card class="box-card">
        <div slot="header">
          <span>Health</span>
          <el-button style="float: right; padding: 3px 0;cursor: default" type="text">{{health.status}}</el-button>
        </div>
        <div class="item-info" v-for="(values, key) in health.details" :key="'health-' + key">
          <div class="title">{{key}}</div>
          <table class="table">
            <tr v-for="(value, key) in values" :key="'info-value-' + key">
              <td class="key">{{key}}</td>
              <td class="value">{{value}}</td>
            </tr>
          </table>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import request from '@/plugin/axios'
export default {
  name: 'ServiceInfo',
  props: {
    instanceId: {
      type: String
    }
  },
  data () {
    return {
      info: null,
      health: {
        status: '',
        details: {}
      }
    }
  },
  created () {
    this.queryInfo()
    this.queryHealth()
  },
  methods: {
    queryInfo () {
      const url = '/taroco-admin/api/applications/' + this.instanceId + '/info'
      request({
        url: url,
        method: 'get'
      })
        .then((res) => {
          this.info = res.data
        })
    },
    queryHealth () {
      const url = '/taroco-admin/api/applications/' + this.instanceId + '/health'
      request({
        url: url,
        method: 'get'
      })
        .then((res) => {
          this.health = res.data
        })
    }
  }
}
</script>
<style lang="scss" scoped>

    .box-card {
      margin-bottom: 10px;
      .item-info {
        margin-bottom: 10px;
        .title {
          margin-bottom: 10px;
          padding-bottom: 5px;
          border-bottom: 1px solid #ebeef5;
        }
        .table {
          width: 100%;
          padding-left: 10px;
          .key {
            display: -webkit-box;
            margin-bottom: 5px;
          }
          .value {
            width: 70%;
            color: #409EFF;
            margin-bottom: 5px;
          }
        }
      }
    }

    .item{
      font-size: 14px;
      margin-bottom: 5px;
      .value{
          float: right;
          margin-right: 10px;
      }
    }
</style>
