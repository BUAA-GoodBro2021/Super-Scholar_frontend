<template>
  <div class="paper-list-wrap">
    <ul class="search-result__list">
      <!-- 单个搜索结果卡片 -->
      <li class="result-item" v-for="(item, index) in paperList">
        <div class="result-item-checkbox-container"></div>
        <div class="result-item-card clearfix">
          <div class="result-item__content">
            <!-- 论文的标题 -->
            <h5 class="card-title">
              <!-- TODO 需要加跳转到论文详情+匹配高亮 -->
              <span>
                <!-- <a href="/doi/10.1145/3293353.3293383">HSD-<span onclick="highlight()" class="single_highlight_class">CNN</span>: Hierarchically self decomposing <span onclick="highlight()" class="single_highlight_class">CNN</span> architecture using class specific filter sensitivity analysis</a> -->
                {{ item.display_name }}
              </span>
            </h5>
            <!-- 论文的作者列表 -->
            <ul class="card-author-list">
              <li v-for="(author, authorIndex) in item.authorships">
                <!-- 跳转到对应的作者主页 -->
                <a @click="toOpenAlexAuthorPage(author.author.id.slice(21))">
                  <img
                    class="author-avator"
                    src="https://dl.acm.org/pb-assets/icons/DOs/default-profile-1543932446943.svg"
                  />
                  <span>{{ author.author.display_name }}</span>
                </a>
                <span>, </span>
              </li>
            </ul>
            <!-- 论文的简要信息 -->
            <div class="card-simple-info">
              <!-- TODO 跳转到对应的institution主页 -->
              <span class="epub-section__title">
                {{ item.host_venue.display_name }}
              </span>
              <!-- 这里由于伪元素位置的影响，必须span里面嵌套一个span -->
              <span class="dot-separator">
                <span>{{ item.publication_date }},&nbsp;&nbsp;</span>
                <span>{{ item.type }}</span>
              </span>
              <span class="dot-separator" v-if="item.doi">
                <a style="vertical-align: middle" :href="item.doi">{{
                  item.doi
                }}</a>
              </span>
            </div>
            <!-- 论文的内容摘要 -->
            <div class="card-abstract">
              <p>{{ item.abstract }}</p>
            </div>
            <!-- 论文的领域concepts气泡展示，这里只截取前11个 -->
            <div class="card-concepts clearfix">
              <div
                class="card-concepts-wrap"
                v-for="(concept, conceptIndex) in item.concepts.slice(0, 11)"
                @click="handleConceptBubbleClick(concept)"
              >
                <i class="iconfont icon-menu"></i>
                <div class="card-concept-context">
                  {{ concept.display_name }}
                </div>
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
                          <i
                            class="iconfont icon-quotes"
                            style="font-size: 1.1rem"
                          ></i>
                          <span>{{ item.cited_by_count }}</span>
                        </span>
                      </li>
                      <!-- 下载数量 -->
                      <li>
                        <span class="metric">
                          <i
                            class="iconfont icon-Rise"
                            style="font-size: 1.3rem"
                          ></i>
                          <span>195</span>
                        </span>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <!-- 论文底部快捷操作 -->
              <div class="card-footer-right">
                <ul class="rlist--inline" style="float: left">
                  <!-- TODO 导出bibtex等引用格式 -->
                  <li>
                    <div class="card-tool-btn">
                      <i
                        class="iconfont icon-quotes"
                        style="font-size: 1.1rem"
                      ></i>
                      <span class="card-btn-hint">
                        <span class="card-btn-hint-arrow"></span>
                        导出引用格式
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
                        添加到收藏夹
                      </span>
                    </div>
                  </li>
                </ul>
                <ul class="rlist--inline dot-separator" style="float: right">
                  <!-- TODO 添加跳转到PDF在线预览的窗口 -->
                  <li>
                    <div class="card-tool-btn pdf-btn">
                      <i
                        class="iconfont icon-pdf1"
                        style="font-size: 0.9rem"
                      ></i>
                      <span class="card-btn-hint">
                        <span class="card-btn-hint-arrow"></span>
                        在线阅读PDF
                      </span>
                    </div>
                  </li>
                  <!-- TODO 添加跳转到论文源网页的超链接 -->
                  <li>
                    <div class="card-tool-btn web-btn">
                      <i
                        class="iconfont icon-signal-source"
                        style="font-size: 1.3rem"
                      ></i>
                      <span class="card-btn-hint">
                        <span class="card-btn-hint-arrow"></span>
                        源网页
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
    <div class="pagination-wrap">
      <el-pagination
        layout="prev, pager, next"
        :total="pageTotalSize"
        @current-change="changePage"
        v-model:current-page="pageCurrent"
        hide-on-single-page
        :page-sizes="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
      />
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from "vue";
const emit = defineEmits(["changePage"]);
const pageCurrent = ref(1);
const props = defineProps({
  paperList: Object,
  pageTotalSize: Number,
});

const changePage = () => {
  emit("changePage", pageCurrent.value);
};
</script>

<style scoped>
.paper-list-wrap {
  width: 100%;
  position: relative;
}

.pagination-wrap {
  margin-top: 5%;
  bottom: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 36px;
}

.search-result__list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.search-result__list .result-item {
  width: 100%;
  display: inline-block;
  font-size: 0.875rem;
}
.result-item-checkbox-container {
  position: relative;
  top: 1.5625rem;
}
.result-item-card {
  /* 30px */
  margin-left: 1.875rem;
  /* 15px */
  margin-top: 0.9375rem;
  padding: 0.9375rem;
  box-shadow: 0 0.3125rem 0.5rem rgb(0 0 0 / 10%);
  background: #fff;
  word-break: break-word;
}

.result-item__content {
  display: inline-block;
}
@media (min-width: 992px) {
  .result-item__content {
    width: 95%;
    float: right;
  }
}

.card-title {
  color: #0077c2;
  font-weight: 500;
  /* font-family: Merriweather,serif; */
  font-family: "Times New Roman", Times, "Microsoft YaHei", serif;
  font-size: 1.25rem;
  margin-bottom: 0.625rem;
}

.card-author-list {
  list-style: none;
  height: auto;
  padding: 0;
  margin: 0 0 0.625rem;
  color: #6b6b6b;
  font-size: 0.875rem;
}
.card-author-list > li:not(:last-child) {
  margin-right: 0.3125rem;
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
  transition: all 0.2s ease-in-out;
}
img {
  max-width: 100%;
  border-style: none;
}
.author-avator {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.3125rem;
  box-sizing: content-box;
  vertical-align: middle;
  padding-right: 0;
  border-radius: 50%;
  object-fit: cover;
  object-position: top;
}
.card-simple-info {
  color: #6b6b6b;
  margin: 0.625rem 0;
  box-sizing: border-box;
}
.card-simple-info span {
  display: inline-block;
  vertical-align: middle;
}
.card-simple-info .epub-section__title {
  font-size: 14px;
  box-sizing: border-box;
  cursor: pointer;
}

.card-abstract {
  height: auto;
  margin: 0.9rem 0;
  font-size: 1rem;
  font-family: "Times New Roman", Times, "Microsoft YaHei", serif;
  /* FIXME 下面四行一起用可以实现多行溢出文本用省略号 "..." 代替，保证不超过一行 */
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

.card-concepts {
  height: auto;
  margin-bottom: 0.8rem;
}

.card-concepts .card-concepts-wrap {
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
.card-concepts .card-concepts-wrap i {
  display: inline-block;
  margin-right: 3px;
}
.card-concepts .card-concepts-wrap .card-concept-context {
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
.rlist--inline > li {
  display: inline-block;
}

/* #region 卡片底部左侧简略信息 */
.card-footer-left {
  float: left;
}
.card-footer-left li {
  /* 6px */
  padding-right: 0.375rem;
}
.card-footer-left > ul > li {
  vertical-align: text-top;
}
@media (min-width: 533px) {
  .card-footer-left > ul > li {
    border-right: 0.0625rem solid #d9d9d9;
    margin-right: 0.4375rem;
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
.card-footer-left li i {
  padding-right: 0.375rem;
  vertical-align: sub;
  transition: transform 0.5s;
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
.card-footer-right .rlist--inline li .card-tool-btn i {
  vertical-align: middle;
  padding-right: 0;
}

.card-footer-right .rlist--inline li:hover .card-tool-btn .card-btn-hint {
  display: inline-block;
}

.card-footer-right .rlist--inline li .card-tool-btn .card-btn-hint {
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
.card-footer-right
  .rlist--inline
  li:hover
  .card-tool-btn
  .card-btn-hint
  .card-btn-hint-arrow {
  display: inline-block;
}
.card-footer-right
  .rlist--inline
  li
  .card-tool-btn
  .card-btn-hint
  .card-btn-hint-arrow {
  display: none;
  width: 0;
  height: 0;
  border: 0.625rem solid #6b6b6b;
  transform: rotate(45deg);
  position: absolute;
  top: -0.1875rem;
  left: calc(50% - 0.625rem);
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

.clearfix::before,
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
</style>
