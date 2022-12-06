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
          <div class="col-lg-3 col-md-3 col-sm-4 ">
            <ElButton v-if="confirmFilterSearch" @click="handleFilterSearch">确认更改测试</ElButton>
            <ElButton v-if="confirmFilterSearch" @click="cancelFilterSearch">取消更改测试</ElButton>
            <div class="sticko__child colored-block">
              <!-- 单个筛选单元 -->
              <div 
                class="colored-block"
                v-for="(item, index) in worksFilterList" 
                :key="index" 
                :ref="setWorksFilterDOM"
              >
                <!-- 筛选块标题 -->
                <div 
                  class="colored-block-title clearfix" 
                  @click="handleWorksGroupSearch(worksFilterDOM[index], index)"
                >
                  <div class="colored-block-title-context">{{item.title}}</div>
                  <i class="iconfont icon-arrowup colored-block-icon"></i>
                </div>
                <!-- 折叠栏 -->
                <div class="colored-block-content">
                  <!-- 过滤块 -->
                  <div class="filter-block">
                    <div class="accordion-content">
                      <ElCheckboxGroup 
                        v-model="worksFilterList[index].selectedArray" 
                        @change="handleChange(index)"
                      >
                        <ul class="rlist expand__list">
                          <li v-for="labelItem in worksFilterList[index].objectArray">
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
                      <span> {{searchStore.sortType}}</span>
                      <i class="iconfont icon-arrowup"></i>
                    </button>
                    <div class="sort-dropdown">
                      <ul class="rlist">
                        <li 
                          v-for="item in worksSortTypeArray"
                          @click="handleWorksSortSearch(item)"
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
                <li class="result-item" v-for="(item, index) in searchDataList">
                  <!-- <WorksResCard :item="item"/> -->
                  <div class="result-item-card clearfix">
                    <div class="result-item__citation">
                      <div class="citation-heading">research-article</div>
                      <!-- <div class="citation-date">May 20</div> -->
                      <div class="citation-date">{{item.publication_date}}</div>
                    </div>
                    <div class="result-item__content">
                      <!-- 论文的标题 -->
                      <h5 class="card-title" @click="jumpToPaperPage(item.id.slice(21))">
                        <!-- TODO 需要加跳转到论文详情+匹配高亮 -->
                        <span>
                          <!-- <a href="/doi/10.1145/3293353.3293383">HSD-<span onclick="highlight()" class="single_highlight_class">CNN</span>: Hierarchically self decomposing <span onclick="highlight()" class="single_highlight_class">CNN</span> architecture using class specific filter sensitivity analysis</a> -->
                          {{item.display_name.replace(/<\/?i>/ig, "")}}
                        </span>
                      </h5>
                      <!-- 论文的作者列表 -->
                      <ul class="card-author-list">
                        <li v-for="(author, authorIndex) in item.authorships">
                          <!-- 跳转到对应的作者主页 -->
                          <a @click="jumpToAuthorPage(author.author.id 
                            ? author.author.id.slice(21)
                            : '')"
                          >
                            <img class="author-avator"  src="https://dl.acm.org/pb-assets/icons/DOs/default-profile-1543932446943.svg" />
                            <span>{{author.author.display_name}}</span>
                          </a>
                          <span>, </span>
                        </li>
                      </ul>
                      <!-- 论文的信息：来源（期刊会议）host_venue、发行日期、类型、doi网址 -->
                      <div class="card-simple-info">
                        <!-- 跳转到对应的host_venue主页 -->
                        <span 
                          class="epub-section__title" 
                          v-if="item.host_venue"
                          @click="jumpToVenuePage(item.host_venue.id 
                            ? item.host_venue.id.slice(21)
                            : '')"
                        >
                          {{item.host_venue.display_name}}
                        </span>
                        <!-- 这里由于伪元素位置的影响，必须span里面嵌套一个span -->
                        <span class="dot-separator">
                          <span>{{item.publication_date}},&nbsp;&nbsp;</span>
                          <span>{{item.type}}</span>
                        </span>
                        <span class="dot-separator" v-if="item.doi">
                          <a style="vertical-align: middle;" :href="item.doi">{{item.doi}}</a>
                        </span>
                      </div>
                      <!-- 论文的内容摘要 -->
                      <div class="card-abstract">
                        <p>{{item.abstract}}</p>
                      </div>
                      <!-- 论文的领域concepts气泡展示，这里只截取前11个 -->
                      <div class="card-concepts clearfix">
                        <div 
                          class="card-concepts-wrap" 
                          v-for="(concept, conceptIndex) in item.concepts.slice(0, 11)"
                          @click="jumpToConceptPage(concept.id.slice(21))"
                        >
                          <i class="iconfont icon-menu"></i>
                          <div class="card-concept-context">{{concept.display_name}}</div>
                        </div>
                      </div>
                      
                      <!-- 论文底部简略信息和快捷操作 -->
                      <div class="card-footer clearfix">
                        <!-- 论文底部简略信息 -->
                        <div class="card-footer-left">
                          <ul class="rlist--inline">
                            <li class="metric-holder">
                              <ul class="rlist--inline">
                                <!-- 引用数量 -->
                                <li>
                                  <span class="citation">
                                    <i class="iconfont icon-quotes" style="font-size: 1.1rem"></i>
                                    <span>{{item.cited_by_count}}</span>
                                  </span>
                                </li>
                                <!-- 下载数量 -->
                                <li>
                                  <span class="metric">
                                    <i class="iconfont icon-Rise" style="font-size: 1.3rem"></i>
                                    <span>195</span>
                                  </span>
                                </li>
                              </ul>
                            </li>
                          </ul>
                        </div>
                        <!-- 论文底部快捷操作 -->
                        <div class="card-footer-right">
                          <ul class="rlist--inline" style="float: left;">
                            <!-- TODO 导出bibtex等引用格式 -->
                            <li>
                              <div class="card-tool-btn">
                                <i class="iconfont icon-quotes" style="font-size: 1.1rem;"></i>
                                <span class="card-btn-hint">
                                  <span class="card-btn-hint-arrow"></span>
                                  Export Citation
                                </span>
                              </div>
                            </li>
                            <!-- TODO 添加收藏夹的浮窗 -->
                            <li>
                              <div class="card-tool-btn">
                                <i class="iconfont icon-folderplus-fill"></i>
                                <!-- <i class="iconfont icon-folder-add-fill"></i> -->
                                <span class="card-btn-hint">
                                  <span class="card-btn-hint-arrow"></span>
                                  Add to Favor
                                </span>
                              </div>
                            </li>
                          </ul>
                          <ul 
                            class="rlist--inline dot-separator" 
                            style="float: right;"
                            v-if="(item.open_access.is_oa === 1 || item.host_venue.id || item.doi)"
                          >
                            <!-- 
                              跳转到PDF在线预览的网页
                              open_access.is_oa
                              -1  表示没有PDF
                              0   表示有人已经提交PDF但是正在审核
                              1   表示有PDF且审核通过
                             -->
                            <li v-if="(item.open_access.is_oa === 1)">
                              <div 
                                class="card-tool-btn pdf-btn" 
                                @click="jumpToPDFOnlinePage(item.open_access.oa_url)"
                              >
                                <i class="iconfont icon-pdf1" style="font-size: 0.9rem;"></i>
                                <span class="card-btn-hint">
                                  <span class="card-btn-hint-arrow"></span>
                                  View PDF online
                                </span>
                              </div>
                            </li>
                            <!-- 
                              跳转到论文源网页的超链接
                                有论文所属机构的id（URL）时，跳转到对应URL
                                没有时，跳转到 doi
                             -->
                            <li v-if="(item.host_venue.id || item.doi)">
                              <div 
                                class="card-tool-btn web-btn" 
                                @click="jumpToWorkSourceWeb(
                                  item.host_venue.id 
                                  ? item.host_venue.id
                                  : item.doi
                                )"
                              >
                                <i class="iconfont icon-signal-source" style="font-size: 1.3rem;"></i>
                                <span class="card-btn-hint">
                                  <span class="card-btn-hint-arrow"></span>
                                  Get Access to Source Web
                                </span>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>

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
  测试备注，cnn和cnn21 搜索的结果是大于15个、等于4个
  用于测试页面布局。
  整体的搜索应对刷新的逻辑是：
    刷新页面以后，依然按照用户设定的 searchType searchText pageSize sortType 进行一次搜索
    但是过滤条件对象重置为空，不向后端传递。
    即“保留 搜索实体类型、搜索文本、用户选定的每页数据尺寸、用户选定的排序方式；取消 用户设置的筛选条件”
 -->
<script>
const sortTypeArray = ["Relevance", "Earliest", "Latest", "Cited"];
const pageSizeArray = [5, 10, 20];
</script>

<script setup>
import SearchInput from '../../components/SearchInput/Search.vue';
import { Search } from '../../api/search';
import { useSearchStore } from '../../stores/search.js';
import { ElButton, ElCheckbox, ElCheckboxGroup, ElNotification, ElPagination } from "element-plus";
import { onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import WorksResCard from './WorksResCard.vue';

const router = useRouter();
const searchStore = useSearchStore();
// 搜索结果数据列表
const searchDataList = ref([]);
// 搜索结果总数
var totalSearchResNum = ref(0);
// 当前需要的搜索结果是第几页，‘
// 注意，除了“页数更改搜索”外，“过滤搜索”、“排序搜索”都会重置当前页数为第1页
// “分组搜索” 和 页数、页尺寸无关
// “页尺寸更改搜索” 不会重置当前页数
const searchResPageIndex =  ref(1);
// 搜索结果每一页的尺寸
const searchResPageSize = ref(10);
// 因为除了“页数更改搜索”外，“过滤搜索”、“排序搜索”都会重置当前页数为第1页
// 触发了对于 searchResPageIndex 的监听
// “分组搜索” 和 页数、页尺寸无关
// 所以在这些搜索触发时，不应该触发“页数更改搜索”
const pageIndexChangeSearchLock = ref(false);
/**
 * 页数坐标发生改变时，触发搜索函数
 */
const handlePageIndexChangeSearch = () => {
  var data = {
    "entity_type": searchStore.searchType,  // 理论上来说这里只能是 works
    "params": {
      "filter": buildWorksFilterKey(),
      "page": searchResPageIndex.value,
      "per_page": searchResPageSize.value,
      "search" : searchStore.searchInputText,
      "sort": buildWorksSortKey(searchStore.sortType),
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
onMounted(() => {
  // 默认选中 index = 1 的 每页10条
  chosePageSize(1);
})
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
    "entity_type": searchStore.searchType,  // 理论上来说这里只能是 works
    "params": {
      "filter": buildWorksFilterKey(),
      "page": searchResPageIndex.value,
      "per_page": searchResPageSize.value,
      "search" : searchStore.searchInputText,
      "sort": buildWorksSortKey(searchStore.sortType),
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


// #region ！！过滤区域 -----------------------------------------------------------------------
// 过滤器下拉栏DOM
const worksFilterDOM = ref([]);
const setWorksFilterDOM = (DOMElement) => {
  worksFilterDOM.value.push(DOMElement);
};

// 过滤器筛选数据列表。创造一个对象数组。这个数组有7个对象元素，每个对象有5个属性：
const worksFilterList = reactive([
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
]);

/**
 * 展开/收起过滤单元的下拉栏
 * 并触发 “分组搜索”
 * @param {HTMLElement} filterDOM 对应的过滤单元的DOM
 * @param {Number} index 过滤单元在整个DOM数组中的位置
 */
const handleWorksGroupSearch = (filterDOM, index) => {
  // 注意这里传入的不是 ref 包裹的DOM元素，而是在模板中自动解析以后的value，直接就是HTMLDOM
  if (filterDOM.classList.contains('js--open')) {
    filterDOM.classList.remove('js--open');   // 收起
  } else {
    var data = {
      "entity_type": searchStore.searchType,  // 理论上来说这里只能是 works
      "params": {
        "filter": buildWorksFilterKey(),
        "group_by": worksFilterList[index].group,
        "page": 1,
        "per_page": searchResPageSize.value,
        "search" : searchStore.searchInputText,
        "sort": buildWorksSortKey(searchStore.sortType),
      }
    };
    console.log("分组搜索，前端发出的请求体");
    console.log(data);
    Search.getGroupDataList(data)
    .then((res) => {
      // console.log(res.data);
      if (res.data.result === 1) {
        let groupArray = res.data.groups_of_data.group_by;
        worksFilterList[index].objectArray = groupArray;
        worksFilterList[index].stringArray = groupArray.map(item => item.key_display_name);
        // console.log(worksFilterList[index].objectArray);
        // console.log(worksFilterList[index].stringArray);
      }
      filterDOM.classList.add('js--open');  // 展开
    })
    .catch((err) => {
      console.log(err);
    })    
  }
};

// 出现“确认”“取消”勾选的过滤器的按钮
const confirmFilterSearch = ref(false);
const handleChange = (index) => {
  // console.log(worksFilterList[index].selectedArray);
  confirmFilterSearch.value = true;
};
/**
 * 遍历所有的works筛选字段。
 * 将用户已经勾选的条目构建出 filter 字段
 * (对象类型)以便于发送给后端
 * @return 一个对象
 */
const buildWorksFilterKey = () => {
  var filter = {};
  for (let i = 0; i < 7; i++) {
    // 利用 [] 给对象创建一个键字段
    filter[worksFilterList[i].group] = "";
    // 遍历每一个筛选单元中， 代表“选中”的 label 数组
    for(let j = 0; j < worksFilterList[i].selectedArray.length; j++) {
      filter[worksFilterList[i].group] += worksFilterList[i].selectedArray[j] + "|";
    }
    // 去掉最后一个 '|' 字符
    filter[worksFilterList[i].group] = filter[worksFilterList[i].group].slice(0, -1);
  }
  return filter;
};
/**
 * 确定要进行 “带有搜索筛选字段” 的 搜索
 */
const handleFilterSearch = () => {
  // 收起两个按钮
  confirmFilterSearch.value = false;
  // 上锁，避免触发“页数更改搜索”
  pageIndexChangeSearchLock.value = true;
  // 重置当前页数为第1页
  searchResPageIndex.value = 1;
  // 收起所有的筛选单元
  for(let i = 0; i < 7; i++) {
    if (worksFilterDOM.value[i].classList.contains('js--open')) {
      worksFilterDOM.value[i].classList.remove('js--open');
    }
  }
  var data = {
    "entity_type": searchStore.searchType,  // 理论上来说这里只能是 works
    "params": {
      "filter": buildWorksFilterKey(),
      "page": 1,
      "per_page": searchResPageSize.value,
      "search" : searchStore.searchInputText,
      "sort": buildWorksSortKey(searchStore.sortType),
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
  // 清空所有选择
  for (let i = 0; i < 7; i++) {
    worksFilterList[i].selectedArray = [];    
  }
};
// #endregion ！！过滤区域 -----------------------------------------------------------------------


// #region 右侧函数

// 排序方式下拉栏DOM
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
const buildWorksSortKey = (worksSortType) => {
  var sort = {};
  switch (worksSortType) {
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
  return sort;
};

// 初始化默认删去当前选中的排序类型
const worksSortTypeArray = ref(sortTypeArray.filter(
  (sortType) => sortType !== searchStore.sortType
));
/**
 * 切换排序方式触发的搜索函数
 * @param {String} newSortType 排序类型
 */
const handleWorksSortSearch = async (newSortType) => {
  // 点击以后立即收起下拉栏
  expandSortDropdown();
  // 上锁，避免触发“页数更改搜索”
  pageIndexChangeSearchLock.value = true;
  // 重置当前页数为第1页
  searchResPageIndex.value = 1;
  // 记录排序类型，并作持久化处理
  searchStore.setSortType(newSortType);
  // 实现下拉栏中排除当前选中的选项
  worksSortTypeArray.value = sortTypeArray.filter(
    (sortType) => sortType !== searchStore.sortType
  );
  console.log(searchStore.sortType, searchStore.searchInputText, searchStore.searchType);
  // 确保搜索文本不为空
  if (searchStore.searchInputText) {
    var data = {
      "entity_type": searchStore.searchType,
      "params": {
        "filter": buildWorksFilterKey(),
        "page": 1,
        "per_page": searchResPageSize.value,
        "search" : searchStore.searchInputText,
        "sort" : buildWorksSortKey(searchStore.sortType),
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

/**
 * 核心搜索函数
 * TODO 这里需要综合各个实体的 filter/sort 字段构造函数
 * @param {String} searchText 搜索文本
 * @param {String} searchEntityType 搜索实体类
 */
const handleFinalSearch = (searchText, searchEntityType) => {
  console.log(searchText, searchEntityType);
  var data = {
    "entity_type": searchEntityType,
    "params": {
      "page": 1,
      "per_page": searchResPageSize.value,
      "search" : searchText,
    }
  }
  Search.getSearchDataList(data)
  .then((res) => {
    // console.log(res);
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
    }
  })
  .catch((err) => {
    ElNotification({
      title: "很遗憾",
      message: err.message,
      type: "error",
      duration: 3000
    })
  })
};

// #region 卡片内部交互函数
/**
 * 跳转到论文详情页
 * item.id用于跳转到论文详情页---W2171852244 √
 * @param {String} openAlexPaperId 论文的openAlexId
 */
const jumpToPaperPage = (openAlexPaperId) => {
  // console.log(openAlexPaperId);
  router.push({
    name: "PaperDetail",
    params: {paperid: openAlexPaperId}
  });
}
/**
 * 跳转到作者详情页
 * 每一个item.authorships[i].author.id用于跳转到作者详情页---A2164292938 √
 * @param {String} openAlexAuthorId 作者的openAlexId
 */
const jumpToAuthorPage = (openAlexAuthorId) => {
  // console.log(openAlexAuthorId);
  if (openAlexAuthorId) {
    router.push({
      name: 'OpenAlexAuthorDetail',
      params: {tokenid: openAlexAuthorId}
    });
  }
};
/**
 * 跳转到期刊详情页
 * item.host_venue.id用于跳转到期刊-- V1983995261 √
 * （这个可能host_venue整个为空，也可能只有这个字段为空）
 * @param {String} openAlexVenueId 作为论文来源的期刊/会议的openAlexId
 */
const jumpToVenuePage = (openAlexVenueId) => {
  console.log(openAlexVenueId);
  if (openAlexVenueId) {
    // router.push({
    //   name: '',
    //   params: {tokenid: openAlexAuthorId}
    // });
  }
};
/**
 * 跳转到领域详情页
 * 每一个item.concept[i].id用于跳转到领域详情页-- C2778805511 √
 * @param {String} openAlexConceptId 论文领域的openAlexId
 */
const jumpToConceptPage = (openAlexConceptId) => {
  console.log(openAlexConceptId);
  router.push({
    name: 'ConceptDetail',
    params: {tokenid: openAlexConceptId}
  });
};
/**
 * 跳转到PDF在线预览网页
 * @param {String[URL]} pdfURL PDF在线预览网页
 */
const jumpToPDFOnlinePage = (pdfURL) => {
  // console.log(pdfURL);
  window.location.href = pdfURL;
};
/**
 * 跳转到论文源网址
 * @param {String[URL]} webURL 论文源网址
 */
const jumpToWorkSourceWeb = (webURL) => {
  // console.log(webURL);
  window.location.href = webURL;
};

// #endregion 卡片内部交互函数




// #endregion 右侧函数
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
.search-detail-container{
  box-sizing: border-box;
  /* background-color: rgb(228 228 231); */
  background-color: rgb(234, 234, 234);
  /* background-color: rgb(255, 255, 255); */
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
  min-height: .0625rem; /* 1px */
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
  border-radius: 10px;
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
.expand__list li {
  box-sizing: border-box;
  margin: 0 -.9375rem;
  background-color: #fff;
  padding: 13px 15px;
  line-height: 14px;
  border: 1px solid rgba(0,0,0,.07);
  border-top-color: rgba(0,0,0,.12);
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
  width: 175px;
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

/* #region 搜索列表和单个搜索卡片 */
.result-item {
  width: 100%;
  display: inline-block;
  font-size: .875rem;
}

.result-item-card {
  /* 30px */
  margin-left: 1.875rem;
  /* 15px */
  margin-top: .9375rem;
  padding: .9375rem;
  box-shadow: 0 0.3125rem 0.5rem rgb(0 0 0 / 10%);
  background: #fff;
  word-break: break-word;
}
.result-item__citation {
  vertical-align: top;
  /* 12px */
  font-size: .75rem;
  text-transform: uppercase;
}
@media (min-width: 768px) {
  .result-item__citation {
    width: 8.75rem;
    display: inline-block;
    margin-bottom: 0;
  }
}
.citation-heading{
  margin-top: .25rem;
  margin-right: .625rem;
  font-weight: 600;
}
.citation-date {
  display: inline-block;
  color: #757575;
  margin-bottom: .25rem;
  font-size: .75rem;
  font-weight: 400;
  text-transform: capitalize;
}
.result-item__content {
  display: inline-block;
}
@media (min-width: 992px) {
  .result-item__content {
    width: calc(100% - 8.75rem);
    float: right;
  }
}

.card-title {
  color: #0077c2;
  font-weight: 500;
  /* font-family: Merriweather,serif; */
  font-family: 'Times New Roman', Times, "Microsoft YaHei", serif;
  font-size: 1.25rem;
  margin-bottom: .625rem;
  cursor: pointer;
}

.card-author-list {
  list-style: none;
  height: auto;
  padding: 0;
  margin: 0 0 .625rem;
  color: #6b6b6b;
  font-size: .875rem;
}
.card-author-list > li:not(:last-child) {
  margin-right: .3125rem;
} 
.card-author-list > li {
  display: inline-block;
  line-height: 2rem;
}
.card-author-list a {
  text-decoration: underline;
  color: inherit;
  cursor: pointer;
  background-color: transparent;
}
.card-author-list img {
  filter: grayscale(100%);
  transition: all .2s ease-in-out;
}
img {
  max-width: 100%;
  border-style: none;
}
.author-avator {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: .3125rem;
  box-sizing: content-box;
  vertical-align: middle;
  padding-right: 0;
  border-radius: 50%;
  object-fit: cover;
  object-position: top;
}
.card-simple-info {
  color: #6b6b6b;
  margin: .625rem 0;
  box-sizing: border-box;
}
.card-simple-info span{
  display: inline-block;
  vertical-align: middle;
}
.card-simple-info .epub-section__title{
  font-size: 14px;
  box-sizing: border-box;
  cursor: pointer;
}

.card-abstract {
  height: auto;
  margin: 0.9rem 0;
  font-size: 1rem;
  font-family: 'Times New Roman', Times, "Microsoft YaHei", serif;
  /* FIXME 下面四行一起用可以实现多行溢出文本用省略号 "..." 代替，保证不超过一行 */
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

.card-concepts {
  height: auto;
  margin-bottom: .8rem;
}

.card-concepts .card-concepts-wrap{
  float: left;
  margin-right: 10px;
  margin-bottom: 5px;
  padding: 3px 5px;
  box-sizing: border-box;
  border: 1.6px solid black;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}
.card-concepts .card-concepts-wrap i{
  display: inline-block;
  margin-right: 3px;
}
.card-concepts .card-concepts-wrap .card-concept-context{
  display: inline-block;
  text-transform: capitalize;
}


.card-footer {
  height: auto;
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

/* #region 卡片底部左侧简略信息 */
.card-footer-left {
  float: left;
}
.card-footer-left li {
  /* 6px */
  padding-right: .375rem;
}
.card-footer-left > ul > li {
  vertical-align: text-top;
}
@media (min-width: 533px) {
  .card-footer-left > ul > li {
    border-right: .0625rem solid #d9d9d9;
    margin-right: .4375rem;
  }
}

.metric-holder {
  outline: none;
  position: relative;
  display: inline-block;
  font-weight: 600;
}
.card-footer-left .citation {
  color: #0077c2;
}
.card-footer-left .metric {
  color: #651fff;
}
.card-footer-left li i{
  padding-right: .375rem;
  vertical-align: sub;
  transition: transform .5s;
}

/* #endregion 卡片底部左侧简略信息结束 */

/* #region 卡片底部右侧快捷操作 */
.card-footer-right {
  float: right;
}
/**
  这里因为上面规定了 .rlist--inline li 元素是 display:inline-block;
  vertical-align 用来指定行内元素（inline）或表格单元格（table-cell）元素的垂直对齐方式。
*/
.card-footer-right .rlist--inline li {
  vertical-align: middle;
  position: relative;
}

/* #region 单个底部工具按钮+下拉栏 */
.card-footer-right .rlist--inline li .card-tool-btn:hover {
  background-color: #d7d7d7;
  cursor: pointer;
}
.card-footer-right .rlist--inline li .card-tool-btn {
  position: relative;
  display: inline-block;
  /* 32px */
  width: 2rem;
  height: 2rem;
  line-height: 1.75rem;
  padding: 0;
  margin: 0 3px;
  font-size: 17px;
  border-radius: 2px;
  color: #6b6b6b;
  background: #f0f0f0;

  display: inline-block;
  white-space: nowrap;
  text-align: center;
  vertical-align: middle;
}

.card-footer-right .rlist--inline li .card-tool-btn.pdf-btn:hover {
  /* background-color: #d44848; */
  background-color: #e34444;
}
.card-footer-right .rlist--inline li .card-tool-btn.pdf-btn {
  background-color: #d40c03;
  color: white;
}
.card-footer-right .rlist--inline li .card-tool-btn.web-btn:hover {
  background-color: #319ddf;
}
.card-footer-right .rlist--inline li .card-tool-btn.web-btn {
  background-color: #0077c2;
  color: white;
}
.card-footer-right .rlist--inline li .card-tool-btn i{
  vertical-align: middle;
  padding-right: 0;
}

.card-footer-right .rlist--inline li:hover .card-tool-btn .card-btn-hint{
  display: inline-block;
}
.card-footer-right .rlist--inline li .card-tool-btn .card-btn-hint{
  display: none;
  position: absolute;
  top: calc(2rem + 0.8rem);
  left: 50%;
  transform: translate(-50%, 0);
  background: #6b6b6b;
  padding: 10px 15px;
  color: #fff;
  border-radius: 3px;
  font-size: 14px;
  line-height: 20px;
  z-index: 9020;
  max-width: 300px;
}
/* 
经典的利用 宽度高度为0，边框宽度不为0，形成三角形
*/
.card-footer-right .rlist--inline li:hover .card-tool-btn .card-btn-hint .card-btn-hint-arrow{
  display: inline-block;
}
.card-footer-right .rlist--inline li .card-tool-btn .card-btn-hint .card-btn-hint-arrow{
  display: none;
  width: 0;
  height: 0;
  border: .625rem solid #6b6b6b;
  transform: rotate(45deg);
  position: absolute;
  top: -.1875rem;
  left: calc(50% - .625rem);
  z-index: -1;
}
/* #endregion 单个底部工具按钮+下拉栏 结束 */

.dot-separator::before {
  color: #6b6b6b;
  content: "•";
  padding-right: 5px;
  padding-left: 5px;
  font-weight: 600;
  font-size: 19px;
  vertical-align: middle;
  box-sizing: border-box;
}
/* #endregion 卡片底部右侧快捷操作 */

/* #endregion 搜索列表和单个搜索卡片结束 */

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