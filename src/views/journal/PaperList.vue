<!-- <template>
    <div class="document-list-wrap" v-loading="loading">
        <el-table :data="paperList" @sort-change="sortChange">
            <el-table-column prop="display_name" label="标题">
                <template #default="scope">
                    <div class="authors_wrap" v-html="scope.row.display_name">
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="authorships" label="第一作者" width="100px" align="center">
                <template #default="scope">
                    <div class="authors_wrap">
                        <span class="document_authors" v-for="(item, index) in scope.row.authorships" :key="index">
                            <span v-if="item.author_position=='first'">{{item.author.display_name}}</span>
                        </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="publication_date" label="日期" width="120px" sortable="custom" align="center" />
            <el-table-column prop="cited_by_count" label="引用" sortable="custom" width="100px" align="center"/>
        </el-table>
        <el-pagination layout="prev, pager, next" :total="total" :current-page="page" :page-size="25" @current-change="pageChange"/>
    </div>
</template> -->
<template>
    <div class="paper-list-wrap">
        <div class="pagination-wrap">
          <el-pagination
            layout="prev, pager, next"
            :total="pageTotalSize <= 10000 ? pageTotalSize : 10000"
            @current-change="changePage"
            v-model:current-page="pageCurrent"
            hide-on-single-page
            :page-sizes="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
          />
        </div>
        <ul>
            <!-- 单个搜索结果卡片 -->
            <li class="result-item" v-for="(item, index) in paperList">
                <WorksResCard :item="item" />
            </li>
        </ul>
  
      <div class="pagination-wrap">
        <el-pagination
          layout="prev, pager, next"
          :total="pageTotalSize <= 10000 ? pageTotalSize : 10000"
          @current-change="changePage"
          v-model:current-page="pageCurrent"
          hide-on-single-page
          :page-sizes="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
        />
      </div>
    </div>
  </template>
<script setup>
import { Search } from "../../api/search";
const props = defineProps({
    filter: Object,
})

const paperList = ref()
const loading = ref(true)
const page = ref(1)
const total = ref(1)
const sortBy = ref("")
const sortSeq = ref("")
const { proxy, ctx } = getCurrentInstance()
const _this = ctx
emit:[
    "IKnowTotal"
]

function updateData(){
    loading.value = true
    const req = {
            "entity_type": "works",
            "params": {
                filter: props.filter,
                page: page.value,
                per_page: 25,
                sort:{
                    
                }
            }
        }
    if(sortBy.value.length != 0){
        req.params.sort[sortBy.value] = sortSeq.value
    }
    Search.getSearchDataList(
        req
    ).then((res)=>{
        paperList.value = res.data.list_of_data[0].results
        loading.value = false
        total.value = res.data.list_of_data[0].meta.count
        _this.$emit("IKnowTotal",total.value)
    })
}

onMounted(() => {
    updateData()  
})

function sortChange(info){
    console.log(info)
    if(info.order == null){
        sortBy.value = ""
        sortSeq.value = ""
    }else{
        sortBy.value = info.prop
        sortSeq.value = info.order == 'ascending' ? 'asc' : 'desc'
    }
    updateData()
}
function pageChange(a){
    page.value = a
    updateData()
}
</script>
<style scoped>


</style>