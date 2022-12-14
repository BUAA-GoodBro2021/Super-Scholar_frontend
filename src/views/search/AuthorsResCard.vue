<template>
  <div class="result-item-card clearfix">
    <div class="result-item__citation">
      <div class="citation-heading">research-author</div>
    </div>
    <div class="author-card-avator">
      <img src="https://dl.acm.org/pb-assets/icons/DOs/default-profile-1543932446943.svg"/>
    </div>
    <div class="result-item__content">
      <!-- 作者的名字 -->
      <h5
        class="card-title"
        @click="jumpToAuthorPage(item.id
          ? item.id.slice(21)
          : '')"
      >
        <!-- TODO 需要加匹配高亮 -->
        <span 
          v-if="item.display_name !== null"
          v-html="highlightText(item.display_name.replace(/<\/?i>/ig, ''))">
        </span>
        <span v-else>
          [Author Name Unknown]
        </span>
      </h5>

      <!-- 
        作者的主要信息：所在机构、机构所在的国家、机构的类型、ocid网址
        这里 last_known_institution 字段可能整个为空
       -->
      <div class="card-simple-info">
        <!-- 跳转到对应的 机构institution 主页 -->
        <span
          v-if="item.last_known_institution?.display_name"
          class="epub-section__title"
          @click="jumpToInstitutionPage(item.last_known_institution.id
            ? item.last_known_institution.id.slice(21)
            : '')"
        >
          {{ item.last_known_institution?.display_name }}
        </span>
        <span v-else class="epub-section__title">
          Independent Reseacher
        </span>
        <!-- 这里由于伪元素位置的影响，必须span里面嵌套一个span -->
        <span class="dot-separator" v-if="item.last_known_institution?.country_code || item.last_known_institution?.type">
          <span>{{ item.last_known_institution?.country_code }},&nbsp;&nbsp;</span>
          <span>{{ item.last_known_institution?.type }}</span>
        </span>
        <!-- 
          orcid 一个字符串，是世界通用的唯一ID号，但是由于在OpenAlex中覆盖较低，
            所以只是作为外部链接
         -->
        <span class="dot-separator" v-if="item.orcid">
          <a style="vertical-align: middle;" :href="item.orcid">{{ item.orcid }}</a>
        </span>
      </div>

      <!-- 作者常涉及的领域concepts气泡展示，这里只截取前11个 -->
      <div class="card-concepts clearfix">
        <!-- 跳转到对应的concept主页 -->
        <div
          class="card-concepts-wrap"
          v-for="concept in item.x_concepts?.slice(0, 11)"
          @click="jumpToConceptPage(concept.id?.slice(21))"
        >
          <i class="iconfont icon-menu"></i>
          <div class="card-concept-context">{{ concept.display_name }}</div>
        </div>
      </div>

      <!-- 作者底部简略信息和快捷操作 -->
      <div class="card-footer clearfix">
        <!-- 作者底部简略信息（已经完成） -->
        <div class="card-footer-left">
          <ul class="rlist--inline">
            <li class="metric-holder">
              <ul class="rlist--inline">
                <!-- 该作者的论文被引用的总数量 -->
                <li>
                  <span class="citation">
                    <i class="iconfont icon-quotes" style="font-size: 1.1rem"></i>
                    <span>{{ toThousands(item.cited_by_count) }}</span>
                  </span>
                </li>
                <!-- 该作者的论文的总数量 -->
                <li>
                  <span class="metric">
                    <i class="iconfont icon-paper" style="font-size: 1rem"></i>
                    <span>{{ toThousands(item.works_count) }}</span>
                  </span>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <!-- 作者底部快捷操作（可能取消） -->
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
                <span class="card-btn-hint">
                  <span class="card-btn-hint-arrow"></span>
                  Add to Favor
                </span>
              </div>
            </li>
          </ul>
          <!-- <ul class="rlist--inline dot-separator" style="float: right;"
            v-if="(item.open_access.is_oa === 1 || item.host_venue.id || item.doi)">
            <li v-if="(item.open_access.is_oa === 1)">
              <div class="card-tool-btn pdf-btn" @click="jumpToPDFOnlinePage(item.open_access.oa_url)">
                <i class="iconfont icon-pdf1" style="font-size: 0.9rem;"></i>
                <span class="card-btn-hint">
                  <span class="card-btn-hint-arrow"></span>
                  View PDF online
                </span>
              </div>
            </li>

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
          </ul> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { highlightText, toThousands } from '../../utils/index.js';

const router = useRouter();
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

// #region 卡片内部交互函数

/**
 * 跳转到作者详情页
 * 每一个item.authorships[i].author.id用于跳转到作者详情页---A2164292938 √
 * @param {String} openAlexAuthorId 作者的openAlexId
 */
 const jumpToAuthorPage = (openAlexAuthorId) => {
  console.log(openAlexAuthorId);
  if (openAlexAuthorId) {
    const newPage = router.resolve({
      name: 'OpenAlexAuthorDetail',
      params: {tokenid: openAlexAuthorId},
    });
    window.open(newPage.href, '_blank');
  }
};

/**
 * 跳转到领域详情页
 * 每一个item.concept[i].id用于跳转到领域详情页-- C2778805511 √
 * @param {String} openAlexConceptId 论文领域的openAlexId
 */
 const jumpToConceptPage = (openAlexConceptId) => {
  console.log(openAlexConceptId);
  if (openAlexConceptId) {
    const newPage = router.resolve({
      name: 'ConceptDetail',
      params: {tokenid: openAlexConceptId},
    });
    window.open(newPage.href, '_blank');
  }
};

/**
 * 跳转到机构详情页
 * 每一个item.last_known_institution.id用于跳转到机构详情页-- I4200000001
 * @param {String} openAlexInstitutionId 论文领域的openAlexId
 */
 const jumpToInstitutionPage = (openAlexInstitutionId) => {
  console.log(openAlexInstitutionId);
  if (openAlexInstitutionId) {
    const newPage = router.resolve({
      name: 'InstitutionDetail',
      params: {institutionid: openAlexInstitutionId},
    });
    window.open(newPage.href, '_blank');
  }
};

// #endregion 卡片内部交互函数
</script>

<style scoped>
/* #region 通用样式 */
*{
  box-sizing: border-box;
  line-height: 1.4;
  word-wrap: break-word;
  text-size-adjust: 100%;
}

a,
a:hover,
a:focus {
  color: inherit;
  text-decoration: none;
  background-color: transparent;
}

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
/* #endregion 通用样式结束 */


.result-item-card {
  /* 30px */
  margin-left: 1.875rem;
  /* 15px */
  margin-top: .9375rem;
  padding: .9375rem;
  box-shadow: 0 0.3125rem 0.5rem rgb(0 0 0 / 10%);
  background: #fff;
  word-break: break-word;
  position: relative;
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

/* #region authors实体卡片独有的 */
.author-card-avator {
  display: none;
}
.author-card-avator img {
  width: 65px;
  height: 65px;
}
@media (min-width: 992px) {
  .author-card-avator {
    display: inline-block;
    /* 这里需要卡片最外层 result-item-card 开相对定位 */
    position: absolute;
    top: 50%;
    left: calc(8.75rem / 2);
    transform: translate(-50%, -50%);
  }
}
/* #endregion authors实体卡片独有的 */


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

</style>
