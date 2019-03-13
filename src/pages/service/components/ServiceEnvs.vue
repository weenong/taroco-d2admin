<template>
    <div>
        <el-alert
          :title="'activeProfiles:' + activeProfiles"
          type="success"
          style="margin-bottom:15px">
        </el-alert>
        <el-row :gutter="10">
            <el-col :span="24">
                <el-collapse accordion>
                    <el-collapse-item class="box-card" v-for="item in propertySources" :key="instanceId + '-' + item.name">
                        <template slot="title">
                          <h3>
                            {{item.name}}
                          </h3>
                        </template>
                        <div v-for="(value, name) in item.properties" :key="name" class="item">
                            <span>{{name}}</span>
                            <span class="value">{{value.value}}</span>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </el-col>
        </el-row>
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
      envs: {},
      activeProfiles: '',
      propertySources: []
    }
  },
  created () {
    this.query()
  },
  methods: {
    query () {
      const url = '/taroco-admin/api/applications/' + this.instanceId + '/env'
      request({
        url: url,
        method: 'get'
      })
        .then((res) => {
          this.envs = res.data
          this.activeProfiles = this.envs.activeProfiles[0]
          this.propertySources = this.envs.propertySources
        })
    }
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
