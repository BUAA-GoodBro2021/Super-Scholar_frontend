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
            <div class="hidden-sm hidden-xs">
              <div class="sticko__child">
                <div class="colored-block">
                  <div class="colored-block">
                    <div class="colored-block-title clearfix">
                      <h4 class="colored-block-title-context">People</h4>
                    </div>
                    <div class="colored-block-content">
                      <div class="filter-list">
                        <div class="filter-block accordion">
                          <!-- 展开标题 -->
                          <a class="filter-block-control accordion__control">
                            <h4 class="filter-block-title">Names</h4>
                            <i class="expand-icon"></i>
                          </a>
                          <!-- 折叠栏 -->
                          <div class="accordion-content">
                            <!-- TODO -->
                          </div>
                        </div>
                        <div class="filter-block">Institutions</div>
                        <div class="filter-block">Authors</div>
                        <div class="filter-block">Editors</div>
                      </div>
                      <div class="end-dash"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 右侧结果/排序部分 -->
          <div class="col-lg-9 col-md-9 col-sm-8 " style="border: 1px solid black;">
            <div class="search-result">
              <div class="search-result__info">
                <div class="search-num-info">
                  <span class="left-border-span"></span>
                  <div class="search-num-info-detail">
                    <!-- <span class="hitlength">21,469</span> -->
                    <span class="hitlength">{{totalSearchResNum}}</span>
                    <span> Results</span>
                    <span> for: </span>
                  </div>
                </div>
              </div>
              <div class="search-result__tabs"></div>
              <!-- 随着滚动 sticky 在header下方的筛选栏 -->
              <div class="search-result__sort clearfix">
                <div class="search-result__sort-right">
                  <!-- <div class="per-page">per page: </div> -->
                  <div class="sort-type" ref="sortDropdownTarget">
                    <button class="sort-type-btn" @click="expandSortDropdown">
                      <b>Sort Type: </b>
                      <!-- <span> Relevance</span> -->
                      <span> {{searchStore.sortType}}</span>
                      <i class="iconfont icon-arrowup"></i>
                    </button>
                    <div class="sort-dropdown">
                      <ul class="sort-dropdown-ul">
                        <li 
                          v-for="item in dropdownSortTypeArray"
                          @click="handleDropdownClick(item)"
                        >
                          {{item}}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 搜索结果主体 -->
              <ul class="search-result__list">
                <!-- 单个搜索结果卡片 -->
                <li class="result-item" v-for="(item, index) in searchDataList">
                  <div class="result-item-checkbox-container"></div>
                  <div class="result-item-card clearfix">
                    <div class="result-item__citation">
                      <div class="citation-heading">research-article</div>
                      <!-- <div class="citation-date">May 20</div> -->
                      <div class="citation-date">{{item.publication_date}}</div>
                    </div>
                    <div class="result-item__content">
                      <!-- 论文的标题 -->
                      <h5 class="card-title">
                        <!-- TODO 需要加跳转到论文详情+匹配高亮 -->
                        <span>
                          <!-- <a href="/doi/10.1145/3293353.3293383">HSD-<span onclick="highlight()" class="single_highlight_class">CNN</span>: Hierarchically self decomposing <span onclick="highlight()" class="single_highlight_class">CNN</span> architecture using class specific filter sensitivity analysis</a> -->
                          {{item.display_name}}
                        </span>
                      </h5>
                      <!-- 论文的作者列表 -->
                      <ul class="card-author-list">
                        <li v-for="(author, authorIndex) in item.authorships">
                          <!-- TODO 跳转到对应的作者主页 -->
                          <a href="#">
                            <img
                              class="author-avator"  
                              src="https://dl.acm.org/pb-assets/icons/DOs/default-profile-1543932446943.svg"
                            />
                            <!-- { "id": "https://openalex.org/A2473549963", "display_name": "Ross Girshick", "orcid": null } -->
                            <span>{{author.author.display_name}}</span>
                          </a>
                          <span>, </span>
                        </li>
                      </ul>
                      <!-- 论文的简要信息 -->
                      <div class="card-simple-info">
                        <a href="/doi/proceedings/10.1145/3293353" >
                          <span class="epub-section__title">
                            ICVGIP 2018: Proceedings of the 11th Indian Conference on Computer Vision, Graphics and Image Processing
                          </span>
                        </a>
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
                          @click="handleConceptBubbleClick(concept)"
                        >
                          <i class="iconfont icon-menu"></i>
                          <div class="card-concept-context">{{concept.display_name}}</div>
                        </div>
                      </div>
                      
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
                          <ul class="rlist--inline dot-separator" style="float: right;">
                            <!-- TODO 添加跳转到PDF在线预览的窗口 -->
                            <li>
                              <div class="card-tool-btn pdf-btn">
                                <i class="iconfont icon-pdf1" style="font-size: 0.9rem;"></i>
                                <span class="card-btn-hint">
                                  <span class="card-btn-hint-arrow"></span>
                                  View PDF online
                                </span>
                              </div>
                            </li>
                            <!-- TODO 添加跳转到论文源网页的超链接 -->
                            <li>
                              <div class="card-tool-btn web-btn">
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

              <div class="search-result__list">xxxxxxxxxxxxx</div>
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
</script>

<script setup>
import SearchInput from '../../components/SearchInput/Search.vue';
import { Search } from '../../api/search';
import { useSearchStore } from '../../stores/search.js';
import { ElNotification } from "element-plus";
import { onMounted, ref } from 'vue';

const searchStore = useSearchStore();
// 搜索结果数据列表
const searchDataList = ref([]);
// 搜索结果总数
var totalSearchResNum = ref(0);

// 搜索类型下拉栏DOM
const sortDropdownTarget = ref(null);
const expandSortDropdown = () => {
  sortDropdownTarget.value.classList.contains('js--open') 
    ? sortDropdownTarget.value.classList.remove('js--open')
    : sortDropdownTarget.value.classList.add('js--open')
}
// 初始化默认删去 Relevant
const dropdownSortTypeArray = ref(sortTypeArray.filter(
  (sortType) => sortType !== searchStore.sortType
));

const handleDropdownClick = async (newSortType) => {
  // 点击以后立即收起下拉栏
  expandSortDropdown();
  searchStore.setSortType(newSortType);
  dropdownSortTypeArray.value = sortTypeArray.filter(
    (sortType) => sortType !== searchStore.sortType
  );
  console.log(searchStore.sortType, searchStore.searchInputText, searchStore.searchType);
  // 确保搜索文本不为空
  if (searchStore.searchInputText) {
    var res = null;
    switch (newSortType) {
      case "Relevance":
        res = await Search.getSearchDataList({
          "entity_type": searchStore.searchType,
          "params": {
            "search" : searchStore.searchInputText,
            "page": 1,
            "per_page": 15
          }
        })
        break;
      case "Earliest":
        res = await Search.getSearchDataList({
          "entity_type": searchStore.searchType,
          "params": {
            "search" : searchStore.searchInputText,
            "sort": {
              // "display_name" : "asc",
              "publication_date": "asc"
            },
            "page": 1,
            "per_page": 15
          }
        })
        break;
      case "Latest":
        res = await Search.getSearchDataList({
          "entity_type": searchStore.searchType,
          "params": {
            "search" : searchStore.searchInputText,
            "sort": {
              // "display_name" : "asc",
              "publication_date": "desc"
            },
            "page": 1,
            "per_page": 15
          }
        })
        break;
      case "Cited":
        res = await Search.getSearchDataList({
          "entity_type": searchStore.searchType,
          "params": {
            "search" : searchStore.searchInputText,
            "sort": {
              "cited_by_count": "desc",
            },
            "page": 1,
            "per_page": 15
          }
        })
        break;
      default:
        console.error("排序类型有误！");
        break;
    }
    if (res) {
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
    }
  }
}


/**
 * 核心搜索函数
 * @param {String} searchText 搜索文本
 * @param {String} searchEntityType 搜索实体类
 */
const handleFinalSearch = (searchText, searchEntityType) => {
  console.log(searchText, searchEntityType);
  Search.getSearchDataList({
    "entity_type": searchEntityType,
    "params": {
        "search" : searchText,
        "page": 1,
        "per_page": 15
    }
  })
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
}

const handleConceptBubbleClick = (conceptEntity) => {
  ElNotification({
    title: "待开发",
    message: conceptEntity,
    type: "warning",
    duration: 3000
  })
}

</script>

<style scoped>
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
  background-color: rgb(228 228 231);
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

.hidden-sm {
  display: block;
}
.hidden-xs {
  display: block;
}
.sticko__child {
  overflow-x: hidden;
}

.colored-block {
  /* 20px */
  margin-bottom: 1.25rem;
}
.colored-block-title {
  background-color: #f0f0f0;
  padding: .875rem 0;
}
.colored-block-title-context {
  border-left: .5rem solid;
  padding-left: .5rem;
  border-color: #1975ae;
  margin: 0;
  font-style: italic;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.125rem;
}

.colored-block-content {
  position: relative;
  padding: 16px;
  background-color: #fafafa;
}
.end-dash{
  width: 1.125rem;
  height: .25rem;
  background: #000;
  position: absolute;
  bottom: 0;
  right: 1rem;
}

.filter-block:not(:last-child) {
  margin-bottom: 0;
}
.filter-block {
  border-color: rgba(0,0,0,.12);
  padding: 0 .9375rem;
  margin-right: -.9375rem;
  margin-left: -.9375rem;
  border-bottom: .0625rem solid #ddd;
}
.filter-list .filter-block:first-child .accordion__control {
  margin-top: 0;
}
.filter-block.accordion .accordion__control {
  margin-bottom: .5rem;
}
.accordion__control {
  color: #6b6b6b;
  font-size: .875rem;
  font-weight: 500;
  display: block;
  width: 100%;
  cursor: pointer;
}
.filter-block-control {
  position: relative;
}

.accordion__control i{
  font-size: .5rem;
  font-family: icomoon!important;
  font-style: normal;
  font-variant: normal;
  font-weight: 900;
  -webkit-font-smoothing: antialiased;
  text-transform: none;
  line-height: 1;
  margin-top: .5rem;
  margin-left: .625rem;
  position: absolute;
  right: 0;
  top: 0;
  transition: transform .5s;
}
.filter-block-title {
  text-transform: none;
  color: #000;
  font-weight: 500;
  font-size: .875rem;
  /* 5px */
  padding-bottom: .3125rem;
  margin-top: 0;
  /* 7px */
  margin-bottom: .4375rem;
}
.expand-icon:before {
  content: "\e61c";
}

.accordion-content{
  padding: 0;
  background-color: #f0f0f0;
  width: 100%;
  clear: both;
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
}
@media (min-width: 768px) {
  .search-result__sort {
    position: sticky;
    background: white;
    /* transition: top .5s; */
    z-index: 555;
    /* top: 7.75rem; */
    top: 0;
    left: 0;
    /* 这里改为我们的header高度 */
    top: 64px; 
    margin: .625rem 0;
  }
  .search-result__sort-right {
    padding: .625rem 0;
  }
}
.search-result__sort-right .per-page {
  border-right: .0625rem solid #d9d9d9;
  padding-right: .3125rem;
  display: inline-block;
  font-size: .875rem;
}
.search-result__sort-right .sort-type {
  float: right;
  position: relative;
  padding: 0 .5rem;
  font-size: 1.875rem;
  font-family: "Microsoft YaHei", serif;
}
.search-result__sort-right .sort-type .sort-type-btn {
  display: inline-block;
  position: relative;
  width: 170px;
  padding: .3125rem 0 1.25rem;
  margin: 0;
  line-height: 1.15;
  box-sizing: border-box;
  cursor: pointer;
  background-color: transparent;
  border: none;
  /* font-style: italic; */
  font-size: 14px !important;
  text-transform: none;
}
.search-result__sort-right .sort-type .sort-type-btn b {
  color: black;
  font-weight: 600;
}
.search-result__sort-right .sort-type .sort-type-btn span {
  color: black;
  font-weight: 300 !important;
}
.search-result__sort-right .sort-type.js--open .sort-type-btn i{
  transform: rotate(180deg);
}
/* VERY IMPORTANT
ransform在行内元素不起作用，要给i加上display:inline-block的样式转为行内块元素。 */
.search-result__sort-right .sort-type .sort-type-btn i {
  display: inline-block;
  font-size: 1.625rem;
  /* font-size: .5rem; */
  margin-left: .3125rem;
  vertical-align: middle;
  padding-right: 0;
  transition: transform .5s;
}

.search-result__sort-right .sort-type.js--open .sort-dropdown {
  display: block;
}
.search-result__sort-right .sort-type .sort-dropdown {
  display: none;
  position: absolute;
  z-index: 9;
  text-align: left;
  top: 55px;
  width: 95%;
  padding: 0;
  background: #fff;
  /* border: .0625rem solid #d9d9d9; */
  border-top: .1875rem solid;
  font-size: 14px;
  min-width: 150px;
  right: 0;
  box-shadow: 0 0.125rem 0.625rem rgb(82 82 82 / 43%);
}
.search-result__sort-right .sort-type .sort-dropdown .sort-dropdown-ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.search-result__sort-right .sort-type .sort-dropdown .sort-dropdown-ul li{
  padding: .375rem .9375rem;
  display: block;
  cursor: pointer;
  background-color: transparent;
  /* font-style: italic; */
  font-weight: 300;
}
.search-result__sort-right .sort-type .sort-dropdown .sort-dropdown-ul li:hover {
  background-color: #d9d9d9;
}

/* #region 搜索列表和单个搜索卡片 */
.search-result__list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.search-result__list .result-item {
  width: 100%;
  display: inline-block;
  font-size: .875rem;
}

.result-item-checkbox-container {
  position: relative;
  top: 1.5625rem;
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
}
/* #endregion 卡片底部右侧快捷操作 */

/* #endregion 搜索列表和单个搜索卡片结束 */

/* #endregion 搜索结果区域结束 */

/* #region 响应式布局 */
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