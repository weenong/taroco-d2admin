<template>
    <div>
      <el-form :model="search">
        <el-form-item label="">
          <el-select v-model="search.metric" clearable filterable @change="metricChange" multiple style="width:100%" placeholder="请选择指标,支持多选,最多选择10个" :multiple-limit="10">
            <el-option v-for="item in metrics" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-card class="box-card" v-for="(select, si) in selected" :key="'selected.' + si">
        <div slot="header">
          <span>{{select.name}}</span>
          <template v-for="(meas, index) in select.measurements">
            <span style="float:right;margin-right:5px" :key="'select.measurements.' + index">{{meas.statistic}}: {{meas.value}}/{{select.baseUnit}}</span>
          </template>
        </div>
        <template v-for="(item, index) in select.availableTags">
          <span :key="'select.availableTags.' + index">
            <el-tag type="success" v-for="(t, i) in item.values" :key="'select.tags.' + i" style="margin-right: 10px;margin-bottom:10px" hit>
              <el-tooltip :content="commonValue" placement="top">
                <span @mouseover="showValue(select.name, item.tag, t)">{{item.tag}}:{{t}}</span>
              </el-tooltip>
            </el-tag>
          </span>
        </template>
      </el-card>
    </div>
</template>

<script>
import request from '@/plugin/axios'
export default {
  props: {
    instanceId: {
      type: String
    }
  },
  data () {
    return {
      metrics: [],
      search: {
        metric: []
      },
      selected: [],
      commonValue: ''
    }
  },
  methods: {
    queryMetrics () {
      const url = '/taroco-admin/api/applications/' + this.instanceId + '/metrics'
      request({
        url: url,
        method: 'get'
      })
        .then((res) => {
          let data = res.data
          this.metrics = data.names
        })
    },
    metricChange(val) {
      this.selected = []
      if (val.length > 0) {
        val.forEach(name => {
          const url = '/taroco-admin/api/applications/' + this.instanceId + '/metrics/' + name
          request({
            url: url,
            method: 'get'
          })
            .then((res) => {
              this.selected.push(res.data)
            })
        })
      }
    },
    showValue(name, tag, val) {
      const url = '/taroco-admin/api/applications/' + this.instanceId + '/metrics/' + name + "?tag=" + tag + ":" + val
      request({
        url: url,
        method: 'get'
      })
        .then((res) => {
          let data = res.data
          this.commonValue = data.measurements[0].statistic +': ' + data.measurements[0].value + (data.baseUnit ? '/' + data.baseUnit : '')
        })
    }
  },
  mounted () {
    this.queryMetrics()
  }
}
</script>
<style lang="scss" scoped>

    .box-card {
        margin-bottom: 10px;
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
