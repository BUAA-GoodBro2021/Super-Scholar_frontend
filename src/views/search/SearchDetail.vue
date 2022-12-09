<template>
  <!-- 搜索详情页的总体页面 -->
  <div class="search-detail-container clearfix">
    <!-- 上部分，用户放置搜索框 -->
    <div class="search-area">
      <div class="search-area-handler">
        <SearchInput 
          @final-search="handleFinalSearch"
          class="search-input"
        />
      </div>
    </div>
    <!-- 主体部分，左侧用于放置搜索筛选，右侧用于存放搜索结果 -->
    <div class="result-area">
      <div class="result-content clearfix">
        <div class="row clearfix">
          <!-- 左侧筛选部分 -->
          <div class="col-lg-3 col-md-3 col-sm-4" style="border: 1px solid black;">
            <ElButton v-if="confirmFilterSearch" @click="handleAllTypeFilterSearch">确认更改测试</ElButton>
            <ElButton v-if="confirmFilterSearch" @click="cancelFilterSearch">取消更改测试</ElButton>
            <div class="sticko__child colored-block">
              <!-- 
                AllTypeFilterList[searchStore.searchType] 即当前搜索的实体类型对应的筛选列表
                该div包裹的是 单个筛选单元
                item 是 当前实体类型对应的 筛选列表 中的单个筛选单元，
                index 是该筛选单元在 当前实体类型对应的 筛选列表 中的数组索引下标
               -->
              <div 
                class="colored-block"
                v-for="(item, index) in AllTypeFilterList[searchStore.searchType]" 
                :key="index" 
                :ref="setFilterUnitDOM"
              >
                <!-- 筛选块标题 -->
                <div 
                  class="colored-block-title clearfix" 
                  @click="handleAllTypeGroupSearch(filterUnitDOM[index], index)"
                >
                  <div class="colored-block-title-context">{{item.title}}</div>
                  <i class="iconfont icon-arrowup colored-block-icon"></i>
                </div>
                <!-- 折叠栏 -->
                <div class="colored-block-content">
                  <!-- 过滤块 -->
                  <div class="filter-block">
                    <div class="accordion-content">
                      <!-- 这里第一个[]是属性键值，第二个[]才是数组索引 -->
                      <ElCheckboxGroup 
                        v-model="AllTypeFilterList[searchStore.searchType][index].selectedArray" 
                        @change="handleChange(index)"
                      >
                        <ul class="rlist expand__list">
                          <li v-for="labelItem in AllTypeFilterList[searchStore.searchType][index].objectArray">
                            <!-- 
                              VERY IMPORTANT 
                              这里 label属性 代表选中时，添加进入 ElCheckboxGroup 的v-model绑定的数组的值
                              我们选择 labelItem 代表的这项（实际上是根据labelItem.key_display_name选择）
                              实际上是把 labelItem.key 添加进入了对应的数组
                             -->
                            <ElCheckbox :label="labelItem.key">
                              <span class="chose-label">{{labelItem.key_display_name}}</span>&nbsp;&nbsp;
                              <span class="chose-num">({{labelItem.count}})</span>
                            </ElCheckbox>
                          </li>
                        </ul>
                      </ElCheckboxGroup>
                    </div>
                  </div>
                  <!-- 底部色块 -->
                  <div class="end-dash"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- 右侧结果/排序部分 -->
          <div class="col-lg-9 col-md-9 col-sm-8 " style="border: 1px solid black;">
            <div class="search-result">
              <!-- 搜索结果顶部信息 -->
              <div class="search-result__info">
                <div class="search-num-info">
                  <span class="left-border-span"></span>
                  <div class="search-num-info-detail">
                    <span class="hitlength">{{totalSearchResNum}}</span>
                    <span> Results</span>
                    <span> for: </span>
                  </div>
                  <div v-if="(totalSearchResNum > 10000)">
                    由于搜索结果数量超过10,000，出于实用性考虑，下面的列表只会展示相关度排序的前10,000条
                  </div>
                </div>
              </div>
              <div class="search-result__tabs"></div>
              <!-- 随着滚动 sticky 在header下方的筛选栏 -->
              <div class="search-result__sort clearfix">
                <div class="search-result__sort-right">
                  <!-- 每页尺寸 -->
                  <div class="per-page">
                    <span class="per-page-label">Per Page: </span>
                    <ul class="rlist--inline">
                      <li 
                        class="page-size-chose" 
                        v-for="(size, index) in pageSizeArray"
                        @click="handlePageSizeChangeSearch(index)"
                        :ref="setPageSizeDom"
                      >
                        {{size}}
                      </li>
                    </ul>
                  </div>
                  <!-- 排序类型 -->
                  <div class="sort-type" ref="sortDropdownTarget">
                    <button class="sort-type-btn" @click="expandSortDropdown">
                      <b>Sort Type: </b>
                      <span> {{ searchStore.sortType }}</span>
                      <i class="iconfont icon-arrowup"></i>
                    </button>
                    <div class="sort-dropdown">
                      <ul class="rlist">
                        <li 
                          v-for="item in remainSortTypeArray"
                          @click="handleAllTypeSortSearch(item)"
                        >
                          {{item}}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 搜索结果主体 -->
              <ul class="rlist">
                <!-- 单个搜索结果卡片 -->
                <li class="result-item" v-for="item in searchDataList">
                  <component :is="searchResCard[searchStore.searchType]" :item="item" />
                </li>
              </ul>
              <!-- 分页器，由于分页只能取到前1万条数据，这里做一个限制 -->
              <div class="search-result__pagination">
                <div class="pagination-container">
                  <ElPagination
                    hide-on-single-page
                    v-model:current-page="searchResPageIndex"
                    v-model:page-size="searchResPageSize"
                    :total="(totalSearchResNum > 10000 
                      ? 10000 
                      : totalSearchResNum)"
                    layout="prev, pager, next, jumper"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- 
整体的搜索应对刷新的逻辑是：
  刷新页面以后，依然按照用户设定的 searchType searchText pageSize sortType 进行一次搜索
  但是过滤条件对象重置为空，不向后端传递。pageIndex 重置为 1。即：
  “保留 搜索实体类型、搜索文本、用户选定的每页数据尺寸、用户选定的排序方式；
  取消 用户设置的筛选条件；重置当前页索引是 1”
 -->
<script>
const allEntitySortType = {
  "works": ["Relevance", "Earliest", "Latest", "Cited"],
  "authors": ["Relevance", "More Works", "Less Works", "Cited"],
  "venues": ["Relevance", "More Works", "Less Works", "Cited"],
  "institutions": ["Relevance", "More Works", "Less Works", "Cited"],
  "concepts": ["Relevance", "More Works", "Less Works", "Cited"],
};
const pageSizeArray = [5, 10, 20];
</script>

<script setup>
import SearchInput from '../../components/SearchInput/Search.vue';
import { Search } from '../../api/search';
import { useSearchStore } from '../../stores/search.js';
import { ElButton, ElCheckbox, ElCheckboxGroup, ElNotification, ElPagination } from "element-plus";
import { onMounted, reactive, ref, shallowRef, watch } from 'vue';
import WorksResCard from './WorksResCard.vue';
import AuthorsResCard from './AuthorsResCard.vue';
import InstitutionsResCard from './InstitutionsResCard.vue';


onMounted(() => {
  // 默认选中 index = 1 的 每页10条
  // chosePageSize(1);
  chosePageSize(0);
  // 触发一次搜索
  handleFinalSearch(searchStore.searchInputText, searchStore.searchType);
});
// 和动态组件配合，实现在搜索实体不同时，返回不同的卡片类型
const searchResCard = shallowRef({
  "works": WorksResCard,
  "authors": AuthorsResCard,
  "venues": "",
  "institutions": InstitutionsResCard,
  "concepts": "",
});

const searchStore = useSearchStore();
// 搜索结果数据列表
const searchDataList = ref([]);
// 搜索结果总数
var totalSearchResNum = ref(0);
/**
 * 当前需要的搜索结果是第几页。
 * 注意，除了“页数更改搜索”外，“过滤搜索”、“排序搜索”、“页尺寸更改搜索”都会重置当前页数为第1页。
 * “分组搜索” 和 页数、页尺寸无关。
 */
const searchResPageIndex =  ref(1);
// 搜索结果每一页的尺寸
const searchResPageSize = ref(10);
/**
 * “页数更改搜索”的防止误触逻辑锁
 * 因为除了“页数更改搜索”外，“过滤搜索”、“排序搜索”、“页尺寸更改搜索”都会重置当前页数为第1页
 * “分组搜索” 和 页数、页尺寸无关
 * 对当前页数的重置在原来页数不为1时会触发对于 searchResPageIndex 的监听
 * 在这些搜索触发时，不应该触发“页数更改搜索”
 */
const pageIndexChangeSearchLock = ref(false);
/**
 * 页数坐标发生改变时，触发搜索函数
 * “页数更改搜索”
 */
const handlePageIndexChangeSearch = () => {
  var data = {
    "entity_type": searchStore.searchType,  // 理论上来说这里只能是 works
    "params": {
      "filter": buildAllTypeFilterKey(),
      "page": searchResPageIndex.value,
      "per_page": searchResPageSize.value,
      "search" : searchStore.searchInputText,
      "sort": buildSortKey(),
    }
  };
  console.log("页数更改触发搜索，前端发出的请求体");
  console.log(data);
  Search.getSearchDataList(data)
  .then((res) => {
    if (res.data.result === 1) {
      searchDataList.value = res.data.list_of_data[0].results;
      totalSearchResNum.value = res.data.list_of_data[0].meta.count;
      console.log(searchDataList);
      ElNotification({
        title: "恭喜您",
        message: `搜索成功，用时 ${res.data.list_of_data[0].meta.db_response_time_ms / 1000} s`,
        type: "success",
        duration: 3000
      });
    }
  })
  .catch((err) => {
    console.log(err);
  })
};
watch(
  searchResPageIndex,
  () => {
    // 注意这里可能原来的页数就是1，因此即使是其他搜索重置为1，也不一定会触发watch
    // 但是当原来页数不为1时，这里watch的上锁逻辑就是必要的，避免重复触发搜索
    console.log("页数发生了变化");
    // 确保不是由其他搜索触发的页数变化
    if (pageIndexChangeSearchLock.value === false) {
      console.log("触发 页数更改搜索")
      handlePageIndexChangeSearch();
    }
  }
);


// #region 每页数据量尺寸相关 -----------------------------------------------------------------------
/**
 * 切换每页的数据量尺寸的DOM
 * 这里是为了呈现出选中时不一样的样式
 */
const pageSizeDom = ref([]);
const setPageSizeDom = (DOMElement) => {
  pageSizeDom.value.push(DOMElement);
};
// 更新页面尺寸 + 更改样式
const chosePageSize = (sizeIndex) => {
  searchResPageSize.value = pageSizeArray[sizeIndex];
  for(let i = 0; i < pageSizeArray.length; i++) {
    pageSizeDom.value[i].classList.remove("current");
  }
  pageSizeDom.value[sizeIndex].classList.add("current");
}
/**
 * 每页的数据尺寸发生改变时，触发搜索函数
 * @param {number} sizeIndex 新的尺寸在数组中的索引
 */
const handlePageSizeChangeSearch = (sizeIndex) => {
  chosePageSize(sizeIndex);
  // 上锁，避免触发“页数更改搜索”
  pageIndexChangeSearchLock.value = true;
  // 重置当前页数为第1页
  searchResPageIndex.value = 1;
  var data = {
    "entity_type": searchStore.searchType,
    "params": {
      "filter": buildAllTypeFilterKey(),
      "page": searchResPageIndex.value,
      "per_page": searchResPageSize.value,
      "search" : searchStore.searchInputText,
      "sort": buildSortKey(),
    }
  };
  console.log("页尺寸更改触发搜索，前端发出的请求体");
  console.log(data);
  Search.getSearchDataList(data)
  .then((res) => {
    if (res.data.result === 1) {
      searchDataList.value = res.data.list_of_data[0].results;
      totalSearchResNum.value = res.data.list_of_data[0].meta.count;
      console.log(searchDataList);
      ElNotification({
        title: "恭喜您",
        message: `搜索成功，用时 ${res.data.list_of_data[0].meta.db_response_time_ms / 1000} s`,
        type: "success",
        duration: 3000
      });
      // 解锁，可以触发“页数更改搜索”
      pageIndexChangeSearchLock.value = false;
    }
  })
  .catch((err) => {
    console.log(err);
    // 解锁，可以触发“页数更改搜索”
    pageIndexChangeSearchLock.value = false; 
  })
};
// #endregion 每页数据量尺寸相关 --------------------------------------------------------------------


// #region ！！过滤区域 -----------------------------------------------------------------------
/**
 * 过滤器下拉栏DOM
 * 这里由于 ref 是动态绑定在 AllTypeFilterList[searchStore.searchType] 上的
 * 所以不需要分开，一个就足够了
 */
const filterUnitDOM = ref([]);
const setFilterUnitDOM = (DOMElement) => {
  filterUnitDOM.value.push(DOMElement);
};
/**
 * 五大实体的 过滤器筛选数据列表。
 */
const AllTypeFilterList = reactive({
  "works": [
    {
      group: "publication_year",
      title: "发表年份 Publication Year",
      objectArray: [],
      stringArray: [],
      selectedArray: []
    },
    {
      group: "host_venue.id",
      title: "文献来源 Host Venue",
      objectArray: [],
      stringArray: [],
      selectedArray: []
    },
    {
      // 可以不带有 authorships
      group: "authorships.author.id",
      title: "作者 Author",
      objectArray: [],
      stringArray: [],
      selectedArray: []
    },
    {
      group: "authorships.institutions.id",
      title: "机构 Institution",
      objectArray: [],
      stringArray: [],
      selectedArray: []
    },
    {
      group: "authorships.institutions.country_code",
      title: "机构所属国家 Country",
      objectArray: [],
      stringArray: [],
      selectedArray: []
    },
    {
      group: "authorships.institutions.type",
      title: "机构类型 Institution Type",
      objectArray: [],
      stringArray: [],
      selectedArray: []
    },
    {
      group: "concepts.id",
      title: "文献领域 Concept",
      objectArray: [],
      stringArray: [],
      selectedArray: []
    },
  ],
  "authors": [
    {
      group: "last_known_institution.id",
      title: "机构 Institution",
      objectArray: [],
      stringArray: [],
      selectedArray: []
    },
    {
      group: "last_known_institution.country_code",
      title: "机构所属国家 Country",
      objectArray: [],
      stringArray: [],
      selectedArray: []
    },
    {
      group: "last_known_institution.id",
      title: "机构类型 Institution Type",
      objectArray: [],
      stringArray: [],
      selectedArray: []
    },
    {
      group: "x_concepts.id",
      title: "领域 Concept",
      objectArray: [],
      stringArray: [],
      selectedArray: []
    },
  ],
  "venues": [
    {
      group: "issn",
      title: "ISSN版本号 ISSN",
      objectArray: [],
      stringArray: [],
      selectedArray: []
    },
    {
      group: "x_concepts.id",
      title: "领域 Concept",
      objectArray: [],
      stringArray: [],
      selectedArray: []
    },
  ],
  "institutions": [
    {
      group: "country_code",
      title: "机构所属国家 Country",
      objectArray: [],
      stringArray: [],
      selectedArray: []
    },
    {
      group: "type",
      title: "机构类型 Institution Type",
      objectArray: [],
      stringArray: [],
      selectedArray: []
    },
    {
      group: "x_concepts.id",
      title: "领域 Concept",
      objectArray: [],
      stringArray: [],
      selectedArray: []
    },
  ],
  "concepts": [
    {
      group: "ancestors.id",
      title: "父级概念 Ancestors Concept",
      objectArray: [],
      stringArray: [],
      selectedArray: []
    },
    {
      group: "level",
      title: "概念层级 Concept Level",
      objectArray: [],
      stringArray: [],
      selectedArray: []
    },
  ],
});

/**
 * 展开/收起过滤单元的下拉栏
 * 并触发 “分组搜索”
 * @param {HTMLElement} filterDOM 当前搜索筛选列表中的 某个过滤单元对应的DOM
 * @param {Number} index 过滤单元DOM在整个DOM数组中的位置，也是过滤单元在 当前搜索筛选列表 中的位置
 */
const handleAllTypeGroupSearch = (filterDOM, index) => {
  // 注意这里传入的不是 ref 包裹的DOM元素，而是在模板中自动解析以后的value，直接就是HTMLDOM
  if (filterDOM.classList.contains('js--open')) {
    filterDOM.classList.remove('js--open');   // 收起
  } else {
    var data = {
      "entity_type": searchStore.searchType,
      "params": {
        "filter": buildAllTypeFilterKey(),
        // 具体到当前搜索类型对应的筛选列表的某个筛选单元的标题
        "group_by": AllTypeFilterList[searchStore.searchType][index].group,
        "page": 1,
        "per_page": searchResPageSize.value,
        "search" : searchStore.searchInputText,
        "sort": buildSortKey(),
      }
    };
    console.log("分组搜索，前端发出的请求体");
    console.log(data);
    Search.getGroupDataList(data)
    .then((res) => {
      if (res.data.result === 1) {
        let groupArray = res.data.groups_of_data.group_by;
        AllTypeFilterList[searchStore.searchType][index].objectArray = groupArray;
        // 这是每个筛选单元要呈现在页面中的 选项文本
        AllTypeFilterList[searchStore.searchType][index].stringArray = groupArray.map(item => item.key_display_name);
      }
      filterDOM.classList.add('js--open');  // 获取数据成功才执行“展开”
    })
    .catch((err) => {
      console.log(err);
    })    
  }
};

// 出现“确认”“取消”勾选的过滤器的按钮
const confirmFilterSearch = ref(false);
const handleChange = (index) => {
  console.log("过滤项目在改变");
  console.log(AllTypeFilterList[searchStore.searchType][index].selectedArray);
  confirmFilterSearch.value = true;
};
/**
 * 遍历所有的works筛选字段。
 * 将用户已经勾选的条目构建出 filter 字段
 * (对象类型)以便于发送给后端
 * @return 一个对象
 */
const buildAllTypeFilterKey = () => {
  var filter = {};
  // 得到当前筛选单元列表
  const currentFilterList = AllTypeFilterList[searchStore.searchType];
  var filterListLength = currentFilterList.length;

  for (let i = 0; i < filterListLength; i++) {
    // 利用 [] 给对象创建一个键字段，
    // 这里使用的是 静态数据中的group字段，即构造出后端需要的 filter 对象中的键值
    const groupKey = currentFilterList[i].group;
    filter[groupKey] = "";
    // 遍历每一个筛选单元中， 代表“选中”的 label 数组
    for(let j = 0; j < currentFilterList[i].selectedArray.length; j++) {
      filter[groupKey] += currentFilterList[i].selectedArray[j] + "|";
    }
    // 去掉最后一个 '|' 字符
    filter[groupKey] = filter[groupKey].slice(0, -1);
  }
  return filter;
};
/**
 * 确定要进行 “带有搜索筛选字段” 的 搜索
 */
const handleAllTypeFilterSearch = () => {
  // 收起两个按钮
  confirmFilterSearch.value = false;
  // 上锁，避免触发“页数更改搜索”
  pageIndexChangeSearchLock.value = true;
  // 重置当前页数为第1页
  searchResPageIndex.value = 1;
  // 收起所有的筛选单元
  for(let i = 0; i < 7; i++) {
    if (filterUnitDOM.value[i].classList.contains('js--open')) {
      filterUnitDOM.value[i].classList.remove('js--open');
    }
  }
  var data = {
    "entity_type": searchStore.searchType,
    "params": {
      "filter": buildAllTypeFilterKey(),
      "page": 1,
      "per_page": searchResPageSize.value,
      "search" : searchStore.searchInputText,
      "sort": buildSortKey(),
    }
  };
  console.log("用户筛选搜索，前端发出的请求体");
  console.log(data);
  Search.getSearchDataList(data)
  .then((res) => {
    if (res.data.result === 1) {
      searchDataList.value = res.data.list_of_data[0].results;
      totalSearchResNum.value = res.data.list_of_data[0].meta.count;
      // console.log(searchDataList);
      ElNotification({
        title: "恭喜您",
        message: `搜索成功，用时 ${res.data.list_of_data[0].meta.db_response_time_ms / 1000} s`,
        type: "success",
        duration: 3000
      });
      // 解锁，可以触发“页数更改搜索”
      pageIndexChangeSearchLock.value = false;
    }
  })
  .catch((err) => {
    console.log(err);
    // 解锁，可以触发“页数更改搜索”
    pageIndexChangeSearchLock.value = false;
  })
};
/**
 * 取消要进行 “带有搜索筛选字段” 的 搜索
 * 并清空所有已经勾选的筛选条目
 */
const cancelFilterSearch = () => {
  confirmFilterSearch.value = false;
  // 得到当前筛选单元列表
  const currentFilterList = AllTypeFilterList[searchStore.searchType];
  var filterListLength = currentFilterList.length;
  // 清空所有选择
  for (let i = 0; i < filterListLength; i++) {
    currentFilterList[i].selectedArray = [];    
  }
};
// #endregion ！！过滤区域 -----------------------------------------------------------------------


// #region 数据结果排序类型相关 -----------------------------------------------------------------------
/**
 * 排序类型选择数组
 * 初始化默认删去当前搜索实体 在当前选中的 排序类型
 */
const remainSortTypeArray = ref(allEntitySortType[searchStore.searchType].filter(
  (sortType) => sortType !== searchStore.sortType
));

/**
 * 排序方式下拉栏DOM
 * 具体选项 由remainSortTypeArray 动态绑定，这里DOM只处理“展开”和“收起”
 */
const sortDropdownTarget = ref(null);
const expandSortDropdown = () => {
  sortDropdownTarget.value.classList.contains('js--open') 
    ? sortDropdownTarget.value.classList.remove('js--open')
    : sortDropdownTarget.value.classList.add('js--open')
};
/**
 * 根据用户选择的sort类型，构建出 sort 字段
 * (对象类型)以便于发送给后端
 * @return 一个对象
 */
const buildSortKey = () => {
  var sort = {};
  if (searchStore.searchType === "works") {
    // 这是因为有可能在sortType为 "More Works" "Less Works" 时切换到 works
    // 此时就要 重置 排序方式
    if (searchStore.sortType === "More Works" || searchStore.sortType === "Less Works") {
      searchStore.sortType = "Relevance";
    }
    switch (searchStore.sortType) {
      case "Relevance":
        break;
      case "Earliest":
        sort["publication_date"] = "asc";
        break;
      case "Latest":
        sort["publication_date"] = "desc";
        break;
      case "Cited":
        sort["cited_by_count"] = "desc";
        break;
    }
  } else {
    // 这是因为有可能在sortType为 "Earliest" "Latest" 时切换到 除了 works 以外的4大实体
    // 此时就要 重置 排序方式
    if (searchStore.sortType === "Earliest" || searchStore.sortType === "Latest") {
      searchStore.sortType = "Relevance";
    }
    switch (searchStore.sortType) {
      case "Relevance":
        break;
      case "More Works":
        sort["works_count"] = "desc";
        break;
      case "Less Works":
        sort["works_count"] = "asc";
        break;
      case "Cited":
        sort["cited_by_count"] = "desc";
        break;
    }
  }
  return sort;
};

/**
 * 切换搜索实体类型时
 * 1.排除 因搜索实体不同、合法的排序方式不同 而产生的非法情况
 * 2.更新排序方式数组备选项，排除当前选中的类型那一条
 * 3.触发 “点击一次按钮搜索”
 * 和左侧筛选栏不同，排序方式数组的数据 没有直接绑定 allEntitySortType[searchStore.searchType]
 * 所以需要 watch 来完成
 */
watch(
  () => searchStore.searchType,
  (newSearchType) => {
    if (newSearchType === "works") {
      // 这是因为有可能在sortType为 "More Works" "Less Works" 时切换到 works
      // 此时就要 重置 排序方式
      if (searchStore.sortType === "More Works" || searchStore.sortType === "Less Works") {
        searchStore.sortType = "Relevance";
      }
    } else {
      // 这是因为有可能在sortType为 "Earliest" "Latest" 时切换到 除了 works 以外的4大实体
      // 此时就要 重置 排序方式
      if (searchStore.sortType === "Earliest" || searchStore.sortType === "Latest") {
        searchStore.sortType = "Relevance";
      }
    }
    // 更新排序方式数组备选项，排除当前选中的类型那一条
    remainSortTypeArray.value = allEntitySortType[newSearchType].filter(
      (sortType) => sortType !== searchStore.sortType
    );
    handleFinalSearch(searchStore.searchInputText, searchStore.searchType);
  }
);

/**
 * 切换排序方式触发的搜索函数
 * @param {String} newSortType 排序类型
 */
const handleAllTypeSortSearch = async (newSortType) => {
  // 点击以后立即收起下拉栏
  expandSortDropdown();
  // 上锁，避免触发“页数更改搜索”
  pageIndexChangeSearchLock.value = true;
  // 重置当前页数为第1页
  searchResPageIndex.value = 1;
  // 记录排序类型，并作持久化处理
  searchStore.setSortType(newSortType);
  
  // 更新排序方式数组备选项，排除当前选中的类型那一条
  remainSortTypeArray.value = allEntitySortType[searchStore.searchType].filter(
    (sortType) => sortType !== searchStore.sortType
  );
  console.log(searchStore.sortType, searchStore.searchInputText, searchStore.searchType);
  // 确保搜索文本不为空
  if (searchStore.searchInputText) {
    var data = {
      "entity_type": searchStore.searchType,
      "params": {
        "filter": buildAllTypeFilterKey(),
        "page": 1,
        "per_page": searchResPageSize.value,
        "search" : searchStore.searchInputText,
        "sort" : buildSortKey(),
      }
    }
    console.log("切换排序方式搜索，前端发出的请求体");
    console.log(data);
    Search.getSearchDataList(data)
    .then((res) => {
      if (res.data.result === 1) {
        searchDataList.value = res.data.list_of_data[0].results;
        totalSearchResNum.value = res.data.list_of_data[0].meta.count;
        // console.log(searchDataList);
        ElNotification({
          title: "恭喜您",
          message: `搜索成功，用时 ${res.data.list_of_data[0].meta.db_response_time_ms / 1000} s`,
          type: "success",
          duration: 3000
        });
        // 解锁，可以触发“页数更改搜索”
        pageIndexChangeSearchLock.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
      // 解锁，可以触发“页数更改搜索”
      pageIndexChangeSearchLock.value = false;
    })
  }
};
// #endregion 数据结果排序类型相关 --------------------------------------------------------------------


/**
 * 核心搜索函数。点击搜索按钮/刷新后触发的搜索函数
 * > 刷新页面以后，依然按照用户设定的 searchType searchText pageSize sortType 进行一次搜索
 * > 但是过滤条件对象重置为空，不向后端传递。pageIndex 重置为 1。即：
 * > “保留 搜索实体类型、搜索文本、用户选定的每页数据尺寸、用户选定的排序方式；
 * > 取消 用户设置的筛选条件；重置当前页索引是 1”
 * @param {String} searchText 搜索文本
 * @param {String} searchEntityType 搜索实体类
 */
const handleFinalSearch = (searchText, searchEntityType) => {
  console.log(searchText, searchEntityType);
  // 上锁，避免触发“页数更改搜索”
  pageIndexChangeSearchLock.value = true;
  // 重置当前页数为第1页
  searchResPageIndex.value = 1;
  // 清空所有筛选选择
  cancelFilterSearch();
  var data = {
    "entity_type": searchEntityType,
    "params": {
      "page": 1,
      "per_page": searchResPageSize.value,
      "search" : searchText,
      "sort" : buildSortKey(),
    }
  }
  Search.getSearchDataList(data)
  .then((res) => {
    if (res.data.result === 1) {
      // console.log(res.data.list_of_data);
      searchDataList.value = res.data.list_of_data[0].results;
      totalSearchResNum.value = res.data.list_of_data[0].meta.count;
      console.log(searchDataList);
      ElNotification({
        title: "恭喜您",
        message: `搜索成功，用时 ${res.data.list_of_data[0].meta.db_response_time_ms / 1000} s`,
        type: "success",
        duration: 3000
      });
      // 解锁，可以触发“页数更改搜索”
      pageIndexChangeSearchLock.value = false;
    }
  })
  .catch((err) => {
    ElNotification({
      title: "很遗憾",
      message: err.message,
      type: "error",
      duration: 3000
    });
    // 解锁，可以触发“页数更改搜索”
    pageIndexChangeSearchLock.value = false;
  })
};

</script>

<style scoped>
/* 这里的样式造成了在a标签中 图标i标签在hover时的变色 */
a, a:hover, a:focus {
  color: inherit;
  text-decoration: none;
  background-color: transparent;
}

/* 清除外边距折叠和高度塌陷 */
.clearfix::before,
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}

.rlist--inline {
  cursor: default;
  list-style: none;
  margin: 0;
  padding: 0;
}
.rlist--inline>li {
  display: inline-block;
}

.search-detail-container{
  box-sizing: border-box;
  /* background-color: rgb(228 228 231); */
  /* background-color: rgb(234, 234, 234); */
  background-color: rgb(255, 255, 255);
  font-family: Merriweather Sans,sans-serif;
  line-height: 1.4;
  word-wrap: break-word;
  /* 控制一些手机或平板设备上使用的文本溢出算法，使用一个百分数来确定文本放大程度。 */
  text-size-adjust: 100%;
}
/* #region 搜索区域 */
.search-area{
  background-color: rgb(147 197 253);
  width: 100%;
  padding: 10px 20px;
}
.search-area-handler {
  width: 100%;
  display: flex;
  align-items: center;
}
.search-area .search-input{
  max-width: 50%;
  margin: auto;
}

/* #endregion 搜索区域结束 */


/* #region 筛选条件区域 */
.result-area{
  min-height: 37.5rem;  /* 600px */
  padding-top: 0;
  margin-top: 1.25rem;  /* 20px */
  /* border: 1px solid black; */
  box-sizing: border-box;
}

.result-content {
  margin-right: auto;
  margin-left: auto;
  padding-left: 15px;
  padding-right: 15px;
  /* border: 1px solid yellow; */
}
.row {
  margin-left: -15px;
  margin-right: -15px;
}
.col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, 
.col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, 
.col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, 
.col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, 
.col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, 
.col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, 
.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, 
.col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12 {
  position: relative;
  min-height: 1px;
  padding-left: 15px;
  padding-right: 15px;
}

.sticko__child {
  overflow-x: hidden;
  /* border: 1px solid black; */
}

.colored-block {
  /* 20px */
  margin-bottom: 1.25rem;
  box-sizing: border-box;
}
.colored-block-title {
  background-color: #f0f0f0;
  padding: .875rem 0;
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
  /* border: 1px solid black; */
}
.colored-block-title-context {
  /* 下面三行创造 标题左边的黑色色块 */
  border-left: 8px solid;
  padding-left: 8px;
  border-color: #000000;
  margin: 0;
  font-size: 18px;
  line-height: 18px;
  font-family: 'Times New Roman', Times, "Microsoft YaHei", serif;
  font-weight: 600;
}

.colored-block.js--open .colored-block-icon {
  transform: rotate(360deg);
}
.colored-block-icon {
  position: absolute;
  z-index: 3;
  top: 10px;
  right: 12px;
  font-size: 18px;
  transition: transform .5s;
  transform: rotate(180deg);
  /* box-sizing: border-box;
  border: 1px solid black; */
}

.colored-block-content {
  /* display: none; */
  /* max-height: 0; */
  /* height: 0; */
  overflow: hidden;
  position: relative;
  /* padding: 0 16px; */
  padding: 0 8px;
  background-color: #fafafa;
  box-sizing: border-box;
  transition: all .5s;
}
.end-dash{
  /* display: none; */
  width: 1.125rem;
  height: .25rem;
  background: #000;
  position: absolute;
  /* bottom: 0; */
  bottom: 1px;
  right: 1rem;
}

.colored-block.js--open .colored-block-content .filter-block {
  /* display: block; */
  max-height: 237px;
  overflow-y: auto;
}
/* 
  VERY IMPORTANT
  妙手偶得，通过负数外边距、正数内边距，
  可以创造出一个隐藏滚动条的水平侧空间
*/
.filter-block {
  /* display: none; */
  max-height: 0;
  overflow: hidden;
  border-color: rgba(0,0,0,.12);
  border-bottom: .0625rem solid #ddd;
  padding: 0 .9375rem;
  margin-right: -.9375rem;
  margin-left: -.9375rem;
  transition: all .5s;
}
.filter-block:not(:last-child) {
  margin-bottom: 0;
}

/* ::-webkit-scrollbar 滚动条整体部分，可以设置宽度之类的 */
.filter-block::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
/* ::-webkit-scrollbar-corner 边角 */
.filter-block::-webkit-scrollbar-corner {
  background-color: initial;
}
/* ::-webkit-scrollbar-thumb 滚动条里面可以拖动的那个 */
.filter-block::-webkit-scrollbar-thumb {
  background-color: #e4e4e7 !important;
  border-radius: 5px;
}
/* ::-webkit-scrollbar-track 外层轨道 */
.filter-block::-webkit-scrollbar-track {
  background-color: transparent !important;
}


.accordion-content{
  padding: 0;
  background-color: #f0f0f0;
  width: 100%;
  clear: both;
}
.expand__list {
  font-size: .75rem;
  font-weight: 600;
  color: #454545;
}
/* 这里取消了左右边框 */
.expand__list li {
  box-sizing: border-box;
  margin: 0 -.9375rem;
  background-color: #fff;
  padding: 13px 15px;
  line-height: 14px;
  /* border: 1px solid rgba(0,0,0,.07); */
  border-top: 1px solid rgba(0,0,0,.12);
  /* border-top-color: rgba(0,0,0,.12); */
  border-bottom: none;
}
.expand__list li .chose-label {
  display: inline-block;
  vertical-align: middle;
  /* 至关重要，这里不设置宽一些会导致字段在垂直方向上显示不全 */
  line-height: 1.125rem;
  white-space: nowrap;
  max-width: 12rem;
  overflow: hidden; 
  text-overflow: ellipsis;
}
.expand__list li .chose-num {
  display: inline-block;
  vertical-align: middle;
  line-height: 1.125rem;
}
@media (max-width: 768px) {
  /* 在半屏适配下，增大文本显示的最大宽度 */
  .expand__list li .chose-label {
    max-width: 38rem;
  }
}
/* #endregion 筛选条件区域结束 */

/* #region 搜索结果区域 */
.search-result__info {
  font-weight: 300;
  font-style: italic;
  margin-bottom: 2.1875rem;
  /* 10px */
  margin-top: .625rem;
  background-color: white;
}
.search-result__info .search-num-info {
  font-size: 1.125rem;
}
.left-border-span {
  border-left: .5rem solid #000;
  padding-left: .375rem;
}
.search-result__info .left-border-span {
  border-color: #ebc34a;
  display: inline-block;
    /* height: 18px; */
  height: 1.125rem;
  margin-top: .25rem;
  position: absolute;
}
.search-num-info-detail {
  display: inline-block;
  padding-left: 1rem;
  position: relative;
}
.search-num-info-detail .hitlength{
  font-weight: 600;
}
.search-result {
  overflow: visible;
}


.search-result__sort {
  border-bottom: .0625rem solid #d9d9d9;
  font-size: .875rem;
}
.search-result__sort .search-result__sort-right {
  float: right;
  font-family: 'Times New Roman', Times, "Microsoft YaHei", serif;
}
@media (min-width: 768px) {
  .search-result__sort {
    position: sticky;
    background: white;
    /* transition: top .5s; */
    z-index: 555;
    left: 0;
    /* 这里改为我们的header高度-1 */
    top: 63px; 
    margin: .625rem 0;
  }
  .search-result__sort-right {
    padding: .625rem 0;
  }
}
/* #region 每页数据的数量 */
.search-result__sort-right .per-page {
  border-right: .0625rem solid #d9d9d9;
  padding-right: .3125rem;
  display: inline-block;
  box-sizing: border-box;
  font-size: 16px;
  /* border: 1px solid black; */
}
.search-result__sort-right .per-page .per-page-label {
  padding: .3125rem 0;
  display: inline-block;
  box-sizing: border-box;
  font-weight: 600;
}
.search-result__sort-right .per-page ul {
  float: right;
  font-weight: 400;
}
.search-result__sort-right .per-page ul .page-size-chose.current {
  font-weight: 600;
}
.search-result__sort-right .per-page ul .page-size-chose {
  padding: .3125rem;
  box-sizing: border-box;
  cursor: pointer;
}
/* #endregion 每页数据的数量 */

/* #region 当前排序的类型 */
.search-result__sort-right .sort-type {
  float: right;
  position: relative;
  padding: 0 .5rem;
  /* font-size: 1.875rem; */
  /* font-family: "Microsoft YaHei", serif; */
}
.search-result__sort-right .sort-type .sort-type-btn {
  display: inline-block;
  position: relative;
  width: 200px;
  /* width: auto; */
  /* padding: .3125rem 0 1.25rem; */
  /* 这里主要是调整 Sort Type 和 Per Page 差不多高 */
  padding: 2px 0 0;
  margin: 0;
  line-height: 1.15;
  box-sizing: border-box;
  cursor: pointer;
  background-color: transparent;
  border: none;
  font-size: 14px;
  text-transform: none;
}
.search-result__sort-right .sort-type .sort-type-btn b {
  font-size: 16px;
  font-family: 'Times New Roman', Times, "Microsoft YaHei", serif;
  color: black;
  font-weight: 600;
}
.search-result__sort-right .sort-type .sort-type-btn span {
  font-size: 16px;
  font-family: 'Times New Roman', Times, "Microsoft YaHei", serif;
  color: black;
  font-weight: 300 !important;
}
.search-result__sort-right .sort-type.js--open .sort-type-btn i{
  transform: rotate(360deg);
}
/* 
  VERY IMPORTANT
  transform 对于行内元素不起作用，
  要给i加上display:inline-block的样式转为行内块元素。 
*/
.search-result__sort-right .sort-type .sort-type-btn i {
  display: inline-block;
  font-size: 1.625rem;
  /* font-size: .5rem; */
  margin-left: .3125rem;
  vertical-align: middle;
  padding-right: 0;
  transition: transform .5s;
  transform: rotate(180deg)
}

.search-result__sort-right .sort-type.js--open .sort-dropdown {
  display: block;
}
.search-result__sort-right .sort-type .sort-dropdown {
  display: none;
  position: absolute;
  right: 0;
  z-index: 9;
  text-align: left;
  width: 95%;
  padding: 0;
  background: #fff;
  /* border: .0625rem solid #d9d9d9; */
  border-top: .1875rem solid;
  font-size: 14px;
  min-width: 150px;
  box-shadow: 0 0.125rem 0.625rem rgb(82 82 82 / 43%);
  font-family: "Microsoft YaHei", serif;
}
@media (min-width: 768px) {
  .sort-dropdown {
    /* top: 55px; */
    top: 40px;
  }
}

.rlist {
  list-style: none;
  padding: 0;
  margin: 0;
}
.search-result__sort-right .sort-type .sort-dropdown .rlist li{
  padding: .375rem .9375rem;
  display: block;
  cursor: pointer;
  background-color: transparent;
  /* font-style: italic; */
  font-weight: 300;
}
.search-result__sort-right .sort-type .sort-dropdown .rlist li:hover {
  background-color: #d9d9d9;
}

/* #endregion 当前排序的类型 */

.result-item {
  width: 100%;
  display: inline-block;
  font-size: .875rem;
}



.search-result__pagination {
  margin-bottom: 1.875rem;
  margin-top: 1.25rem;
  text-align: center;
  font-size: 14px;
  box-sizing: border-box;
}
.search-result__pagination .pagination-container {
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  /* border: 1px solid black; */
  padding: 0 auto;
  position: relative;
}

div.el-pagination {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}


/* #endregion 搜索结果区域结束 */

/* #region 响应式布局 */
/* 75rem = 1200px */
@media screen and (max-height: 75rem) {
  .filter-block-title {
    max-width: 9.375rem;
  }
}

@media (min-width: 1200px) {
  .result-content{
    max-width: 1310px;
    width: 100%;
  }
  .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, 
  .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12 {
    float: left;
  }
  .col-lg-3 {
    width: 25%;
  }
  .col-lg-9 {
    width: 75%;
  }
}
@media (min-width: 992px) and (max-width: 1200px) {
  .result-content{
    width: 960px;
  }
  .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, 
  .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12 {
    float: left;
  }
  .col-md-3 {
    width: 25%;
  }
  .col-md-9 {
    width: 75%;
  }
}
@media (min-width: 768px) and (max-width: 992px) {
  .result-content{
    width: 736px;
  }
  .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, 
  .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12 {
    float: left;
  }
  .col-sm-4 {
    width: 33.33333%;
  }
  .col-sm-8 {
    width: 66.66667%;
  }
}
@media (min-width: 532px) and (max-width: 768px) {
  .result-content{
    width: 100%;
  }
  .search-result__info {
    margin-top: 0;
  }
}
  /* #endregion 响应式布局结束 */

</style>