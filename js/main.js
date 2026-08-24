/* 古四信息咨询工作室官网 - 共享脚本 */

(function () {
  'use strict';

  // ============ 微信客服配置（AI 24 小时 + 人工工作日） ============
  var KF_CONFIG = {
    // 24 小时 AI 咨询助手（企业微信客服直链，点开直接进入 AI 对话窗口，与人工客服同款 work.weixin.qq.com/kfid 格式）
    botUrl: 'https://work.weixin.qq.com/kfid/kfc324405ff4febee72?enc_scene=ENC21bTUaNvSFY5c6qK1pjz9RXmSeos7TTt8DL2MSqm3uPX',
    // 人工客服（企业微信客服）：在「企业微信管理后台 → 客户联系 → 微信客服 → 客服账号」获取
    url: 'https://work.weixin.qq.com/kfid/kfcd322da436b094668',
    // 客服二维码图片（留空则隐藏二维码展示）
    qrcode: '',
    // 服务时间
    aiHours: '7×24 小时',
    humanHours: '周一至周六 10:00 - 20:00',
    reply: '通常 5 分钟内回复'
  };
  var KF_CONFIGURED = KF_CONFIG.url.indexOf('REPLACE_WITH_YOUR_KFID') === -1;

  // 注入全站浮动客服按钮与面板
  (function buildKfWidget() {
    if (document.querySelector('.kf-float')) return;

    var widget = document.createElement('div');
    widget.className = 'kf-float';
    widget.innerHTML =
      '<div class="kf-panel" role="dialog" aria-label="联系客服">' +
      '<div class="kf-panel-head">' +
      '<button type="button" class="kf-close" aria-label="关闭">×</button>' +
      '<h4>24 小时 AI 咨询助手</h4>' +
      '<p>在线 · ' + KF_CONFIG.aiHours + ' · ' + KF_CONFIG.reply + '</p>' +
      '</div>' +
      '<div class="kf-panel-body">' +
      (KF_CONFIG.qrcode
        ? '<div class="kf-qr-wrap"><img src="' + KF_CONFIG.qrcode + '" alt="企业微信客服二维码"><div class="kf-qr-tip">微信扫码，直接与企业客服对话</div></div>'
        : '') +
      '<div class="kf-actions">' +
      '<a class="kf-btn kf-btn-primary" href="' + KF_CONFIG.botUrl + '" target="_blank" rel="noopener">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 5h2v2h-2V7zm0 4h2v6h-2v-6z"/></svg>' +
      '24 小时 AI 咨询助手</a>' +
      '<a class="kf-btn kf-btn-ghost" href="' + KF_CONFIG.url + '" target="_blank" rel="noopener">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 13a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/><path d="M12 2C6.48 2 2 5.58 2 10c0 2.03.76 3.87 2 5.29V20l4.09-1.87c1.25.53 2.64.82 4.12.82.65 0 1.28-.06 1.89-.17L18 20v-3.5c1.69-1.43 2.8-3.52 2.8-5.88 0-3.31-3.36-6-7.5-6S5.8 5.31 5.8 8.5"/></svg>' +
      '人工客服 · ' + KF_CONFIG.humanHours + '</a>' +
      '<a class="kf-btn kf-btn-ghost" href="contact.html">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>' +
      '填写咨询表单</a>' +
      '</div>' +
      '<div class="kf-meta"><strong>AI 咨询助手</strong> ' + KF_CONFIG.aiHours + '<br><strong>人工客服</strong> ' + KF_CONFIG.humanHours + '</div>' +
      '</div>' +
      '</div>' +
      '<button type="button" class="kf-float-btn" aria-label="联系客服">' +
      '<span class="kf-pulse"></span>' +
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M20 13.5a7.5 7.5 0 01-10.2 7L4 22l1.5-5.8A7.5 7.5 0 1120 13.5z"/></svg>' +
      '</button>';
    document.body.appendChild(widget);

    var kfBtn = widget.querySelector('.kf-float-btn');
    var kfClose = widget.querySelector('.kf-close');
    kfBtn.addEventListener('click', function () {
      widget.classList.toggle('open');
    });
    kfClose.addEventListener('click', function () {
      widget.classList.remove('open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') widget.classList.remove('open');
    });

    // 同步页内 data-kf-link 元素（如 contact.html 的客服按钮）到 AI 客服链接
    document.querySelectorAll('[data-kf-link]').forEach(function (el) {
      if (KF_CONFIG.botUrl && KF_CONFIG.botUrl.indexOf('REPLACE') === -1) {
        el.href = KF_CONFIG.botUrl;
        el.target = '_blank';
        el.rel = 'noopener';
        el.classList.add('btn-primary');
      } else {
        el.href = 'contact.html';
        el.textContent = '客服接入配置中，先提交表单';
      }
    });
  })();

  // Header scroll effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Mobile menu
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll reveal
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('visible'));
  }

  // Hero parallax
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && !window.matchMedia('(pointer: coarse)').matches) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroBg.style.transform = `translateY(${scrolled * 0.18}px)`;
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // Works filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        document.querySelectorAll('.work-card:not(.hidden)').forEach((card) => {
          const category = card.dataset.category;
          if (filter === 'all' || category === filter) {
            card.style.display = '';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.96)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 280);
          }
        });
      });
    });
  }

  // Load more works (reveal hidden cases)
  const loadMoreBtn = document.querySelector('.load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      const hiddenCards = document.querySelectorAll('.work-card.hidden');
      const activeFilter = document.querySelector('.filter-btn.active') ? document.querySelector('.filter-btn.active').dataset.filter : 'all';
      hiddenCards.forEach((card) => {
        card.classList.remove('hidden');
        const category = card.dataset.category;
        if (activeFilter === 'all' || category === activeFilter) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            card.classList.add('visible');
          });
        } else {
          card.style.display = 'none';
        }
      });
      loadMoreBtn.textContent = '已加载全部作品';
      loadMoreBtn.disabled = true;
    });
  }

  // ============ Works Detail Modal ============
  const WORKS_DATA = {
    bazi: {
      title: '八字命盘精析',
      tag: '玄学',
      cat: 'metaphysics',
      desc: '结合大运流年，为客户梳理事业转折与人生关键节点，提供可执行的趋避建议。',
      image: 'assets/works/work-bazi.jpg',
      story: [
        '委托人是一位 35 岁的创业者，经营一家 60 人的跨境电商公司。过去两年他连续错判市场节奏，两轮融资对赌未能达成，团队士气低落——他一度怀疑自己是不是已经走到了行业的天花板。',
        '初次排盘后，我们发现他的命局"财旺身弱、官印相生"，是典型的"借势型"人才：不擅亲自下场冲锋，却极擅长识别并驾驭关键人物与资源。过去两年的问题并非能力不足，而是把大量精力投在了与自身格局相悖的执行细节上。',
        '结合大运流年推算，2025 年进入"食伤生财"的旺相之运，恰逢团队重组与业务结构调整的最佳窗口。我们据此给出"聚焦选品与渠道、放手管理、引入操盘手"的三年布局建议。'
      ],
      process: [
        { s: '信息收集', t: '出生时间、成长经历与近三年大事记' },
        { s: '命盘推演', t: '八字排盘 + 大运流年叠加分析' },
        { s: '解读反馈', t: '一对一深度解读，逐项与人生事件印证' },
        { s: '趋避建议', t: '分年度给出可执行的决策与节奏建议' }
      ],
      results: [
        { n: '40%', l: '半年业绩增长' },
        { n: '3 轮', l: '融资对赌重回正轨' },
        { n: '60 人', l: '团队平稳重组' }
      ],
      quote: '排盘那天我记得特别清楚，顾老师看完盘第一句话就是："你不是不会做，是把劲使错了地方。"我当场愣在那里，回去想了一整夜。后来的每一步——不管是放手管理还是引入操盘手——几乎都被他说中了。有时候我会想，要是早两年遇到他就好了。',
      quoteFrom: '—— 刘先生，跨境电商创业者',
      tags: ['子平八字', '大运流年', '事业决策', '趋吉避凶']
    },
    emotion: {
      title: '情绪管理工作坊',
      tag: '心理',
      cat: 'psychology',
      desc: '帮助职场人群识别情绪触发器，建立稳定的自我调节机制。',
      image: 'assets/works/work-emotion.jpg',
      story: [
        '一家互联网公司的技术团队找到我们：30 人规模的研发组，半年内离职 14 人。HR 反馈"大家情绪都绷得很紧"，但团建、涨薪都没能止住颓势。',
        '我们为团队设计了为期 8 周的情绪管理工作坊：前两周聚焦"情绪识别"，用情绪日记帮助成员找出各自的触发器；中间四周引入正念呼吸、认知重构与表达性写作；最后两周建立团队层面的"情绪安全协议"。',
        '期间同步开展一对一辅导，覆盖 12 名情绪耗损最严重的核心成员。项目结束时，团队情绪健康指数（WHO-5）由 42 分升至 68 分，离职率在接下来的两个季度内回落至正常水平。'
      ],
      process: [
        { s: '现状评估', t: '团队情绪健康问卷 + 一对一访谈' },
        { s: '目标共建', t: '与管理者对齐可量化的改善目标' },
        { s: '工作坊执行', t: '每周一次团体课 + 个体辅导并行' },
        { s: '复盘巩固', t: '八周后复测并输出长期机制' }
      ],
      results: [
        { n: '62%', l: '情绪健康指数提升' },
        { n: '45%→12%', l: '年离职率回落' },
        { n: '8 周', l: '完整干预周期' }
      ],
      quote: '说实话，当初立项的时候我半信半疑——团队情绪也能"管理"？八周走下来，最直观的变化是：会议室里拍桌子的声音少了，下班后敢说话的同事多了。三个月过去，研发组自己把那套"情绪安全协议"用成了习惯，连新来的应届生都懂。这是我砸再多钱做团建都换不来的东西。',
      quoteFrom: '—— 张敏，某互联网公司人力资源负责人',
      tags: ['正念减压', '情绪觉察', '团队心理建设', '组织健康']
    },
    asset: {
      title: '年度资产配置方案',
      tag: '财经',
      cat: 'finance',
      desc: '基于风险偏好与现金流状况，定制攻守兼备的资产配置策略。',
      image: 'assets/works/work-asset.jpg',
      story: [
        '委托人是一对年收入合计约 120 万的夫妻：丈夫是互联网高管，妻子是外企财务总监。家庭资产 80% 沉淀在房产上，其余趴在活期存款里，抗通胀能力弱，且对未来三年的大额支出没有规划。',
        '我们为其做了完整的财务体检：现金流模型、风险偏好测评（结果显示属于"稳健偏积极"型），以及三年期大额支出的现金流缺口测算。发现最大的风险不是收益不足，而是"流动性错配"。',
        '最终方案采用四象限结构：现金/货币基金（6 个月生活费）打底，固收+ 做核心，指数与行业 ETF 卫星仓位博取弹性，配齐家庭保险托底；并设定月度定投纪律与季度再平衡规则。'
      ],
      process: [
        { s: '财务诊断', t: '资产、负债、现金流全景盘点' },
        { s: '风险偏好', t: '量化测评 + 行为偏差校准' },
        { s: '方案制定', t: '四象限配置 + 定投与再平衡规则' },
        { s: '跟踪复盘', t: '季度复盘 + 年度再平衡' }
      ],
      results: [
        { n: '-35%', l: '组合波动率下降' },
        { n: '6 个月', l: '现金安全垫覆盖' },
        { n: '3 年', l: '大额支出规划达标' }
      ],
      quote: '以前我们家钱的去处就俩字：放着。几百万趴在活期里，既没收益也没安全感。现在每个月的定投日我居然有点期待，看着账户曲线一点一点往上走，那种踏实感是以前存定期给不了的。上个月连我妈都来问我怎么打理她的养老金了。',
      quoteFrom: '—— 陈女士，外企财务总监',
      tags: ['资产配置', '现金流管理', '保险规划', '定投纪律']
    },
    ziwei: {
      title: '紫微斗数流年推演',
      tag: '玄学',
      cat: 'metaphysics',
      desc: '以紫微十二宫为框架，推演未来一年事业、财运与感情的起伏节奏，提前布局。',
      image: 'assets/works/work-ziwei.jpg',
      story: [
        '委托人是一位 28 岁的独立设计师，连续三年自由职业收入不稳，年底面临"接大单冲一把"还是"进公司求稳"的两难选择。她把问题带来时，焦虑已经影响了创作状态。',
        '紫微盘上，命宫坐"天相 + 禄存"，迁移宫见"紫微"，三方四正财帛宫化禄——是典型的"走出去才有发展"的格局。但流年四化显示，未来九个月内财帛宫逢"廉贞化忌"，不宜盲目扩张签约。',
        '我们给出的建议是：上半年深耕现有客单价最高的两条产品线，把现金流打厚；下半年再启动市场拓展。她照做后，不仅收入追平了上班时的水平，还接到了一家上市公司的长期合约。'
      ],
      process: [
        { s: '安星排盘', t: '命盘十二宫 + 四化飞星' },
        { s: '流年拆解', t: '逐年大限 + 流月能量节奏' },
        { s: '场景印证', t: '事业、财运、感情逐宫对照' },
        { s: '行动建议', t: '按月给出布局节奏' }
      ],
      results: [
        { n: '1 家', l: '上市公司长期合约' },
        { n: '2 条', l: '高客单产品线聚焦' },
        { n: '9 个月', l: '节奏验证周期' }
      ],
      quote: '排盘那晚我抱着笔记本记了满满三页，第二天又翻出来看了三遍。最绝的是那句"上半年收、下半年攻"——当时我没太当回事，结果那一年真的就是那么过的：上半年我把两条高客单产品线做扎实了，下半年一放出去就接到了上市公司的长期合约。现在每到年底我都会找她看一眼来年的节奏，感觉像给自己请了个导航。',
      quoteFrom: '—— 阿布，独立设计师（匿名）',
      tags: ['紫微斗数', '流年四化', '事业节奏', '决策时机']
    },
    relationship: {
      title: '亲密关系沟通辅导',
      tag: '心理',
      cat: 'psychology',
      desc: '重塑伴侣间沟通模式，化解长期积怨，重建信任与亲密。',
      image: 'assets/works/work-relationship.jpg',
      story: [
        '这对结婚七年的夫妻找到我们时，已经分房三个月，正在协议离婚的边缘。妻子说"他永远在讲道理，从不听我说话"，丈夫说"她一提旧账就停不下来，我干脆沉默"。',
        '前三次咨询以单独会谈为主：我们发现问题的根源不在"谁对谁错"，而在于两人各自的依恋模式——妻子是典型的焦虑型依恋（怕被忽视），丈夫是回避型依恋（怕冲突升级），多年的互动早已形成"追逃循环"。',
        '12 次伴侣咨询中，我们先用情绪聚焦疗法（EFT）重建安全联结，再引入结构化沟通练习：每周一次 30 分钟不带评判的倾听时间。第七次咨询时，妻子说"他第一次让我把话说完"，两人决定暂停离婚程序。'
      ],
      process: [
        { s: '初步评估', t: '双人访谈 + 依恋模式测评' },
        { s: '目标共建', t: '约定沟通规则与安全边界' },
        { s: '咨询陪伴', t: 'EFT 修复 + 结构化沟通练习' },
        { s: '复盘巩固', t: '关系维护计划与应急预案' }
      ],
      results: [
        { n: '12 次', l: '系统咨询周期' },
        { n: '分居→同房', l: '关系状态逆转' },
        { n: '30 分钟', l: '每周固定倾听时间' }
      ],
      quote: '第七次咨询结束的那个晚上，我们开车回家，一路上谁都没说话，车里安静得能听见彼此的呼吸。然后他的右手，第一次主动伸过来握住了我的手。我的眼泪一下就下来了——结婚七年，我们已经太久没有过这样的时刻了。真的谢谢你们，把我们从悬崖边上拉了回来。',
      quoteFrom: '—— 匿名（经授权分享）',
      tags: ['伴侣咨询', '依恋模式', '沟通修复', '情绪聚焦']
    },
    industry: {
      title: '行业趋势研判报告',
      tag: '财经',
      cat: 'finance',
      desc: '深度解析宏观经济与产业周期，为投资决策提供前瞻视角。',
      image: 'assets/works/work-industry.jpg',
      story: [
        '一家年营收 8 亿的精密制造企业，账上躺着 1.2 亿闲置资金。董事长想做产业投资，但既担心踏空新能源的长期趋势，又害怕高位接盘。',
        '我们花了六周完成《新能源产业链趋势研判》：从宏观利率与政策周期、中观产业链图谱（上游材料—中游制造—下游应用）、到微观景气度指标（排产、库存、招标）三个层面交叉验证，最终判断行业正处于"第二轮景气上行初段"。',
        '报告给出"以时间换空间"的节奏建议：不在情绪高点追入，而是在每季度景气数据确认时分批建仓，并设置两档纪律性止损线。此后 14 个月里，该组合精准避让了两轮 20% 级别的板块回调。'
      ],
      process: [
        { s: '宏观扫描', t: '利率、政策与产业周期定位' },
        { s: '图谱拆解', t: '产业链上下游景气交叉验证' },
        { s: '量化建模', t: '景气指标与估值分位数打分' },
        { s: '策略输出', t: '节奏建议 + 纪律性风控线' }
      ],
      results: [
        { n: '+23%', l: '组合年内收益' },
        { n: '2 轮', l: '精准避让板块回调' },
        { n: '6 周', l: '深度研究周期' }
      ],
      quote: '那本报告在我们董事会传了三圈，有人专门圈了段落做笔记。它最厉害的地方不是"猜对了"——而是给了我们一套判断周期、控制节奏的框架，往后每个季度都能拿出来对照。现在我们做任何产业投资，第一件事就是把这套方法翻出来重新跑一遍。',
      quoteFrom: '—— 周总，精密制造企业董事长',
      tags: ['产业研究', '周期定位', '景气跟踪', '组合风控']
    },
    tarot: {
      title: '塔罗年度运势解读',
      tag: '玄学',
      cat: 'metaphysics',
      desc: '以塔罗牌阵梳理年度主题，帮助客户把握节奏与关键决策期。',
      image: 'assets/works/work-tarot.jpg',
      story: [
        '委托人是一位 31 岁的产品经理，年初就陷在两难里：公司内部有个晋升机会，但要求转岗去一个不熟悉的业务线；感情上刚结束一段五年恋情，父母又催着她相亲。',
        '我们用了凯尔特十字牌阵做年度主题解读：过去位置出现"逆位宝剑八"（自我设限），未来位置的"权杖骑士"暗示转岗带来的正是她需要的行动能量；感情位置则是"圣杯四"——需要先与自己和解，而非急着开始新关系。',
        '解读没有给出"答案"，而是帮她理清了优先级：先转岗（能量匹配），感情上给自己半年缓冲期。三个月后她发来消息：转岗顺利，新业务线第一季度的数据是她带过最好的。'
      ],
      process: [
        { s: '问题聚焦', t: '梳理年度关键议题' },
        { s: '牌阵展开', t: '凯尔特十字 + 月度能量拆解' },
        { s: '解读对话', t: '逐位牌面与生活场景对照' },
        { s: '行动转化', t: '把启示翻译成可执行清单' }
      ],
      results: [
        { n: '3 个月', l: '完成职业转型' },
        { n: '12 张', l: '月度能量拆解' },
        { n: '1 次', l: '深度一对一解读' }
      ],
      quote: '说出来你可能不信，我是抱着"随便玩玩"的心态去的。但那天晚上回去，我躺在床上翻来覆去想她说的那句话——"你一直在等一个完美的时机，可那个时机其实就是现在"。第二天我就递交了转岗申请。三个月后，我带着一条从没做过的业务线，做出了我职业生涯最好看的季度数据。',
      quoteFrom: '—— 小雨，产品经理',
      tags: ['塔罗解读', '凯尔特十字', '年度运势', '决策梳理']
    },
    anxiety: {
      title: '职场焦虑支持计划',
      tag: '心理',
      cat: 'psychology',
      desc: '针对高压职场人群的系统陪伴，重建工作与生活的平衡感。',
      image: 'assets/works/work-anxiety.jpg',
      story: [
        '委托人是一家头部互联网公司的中层管理者，连续三年高强度加班，半年前开始出现入睡困难与早醒，白天靠咖啡硬撑，体检报告亮起多项亚健康红灯。他来咨询时，第一句话是"我觉得我快撑不住了"。',
        '心理测评显示其焦虑自评量表（SAS）得分 63，处于中重度区间，且伴随明显的躯体化症状。我们制定了 12 周支持计划：前四周聚焦睡眠节律重建与呼吸训练；中段引入正念认知疗法（MBCT）处理反刍思维；后四周做职场边界训练——包括"下班断连仪式"与授权清单。',
        '第 8 周时他的入睡时间已从 90 分钟缩短到 20 分钟以内；第 12 周复测 SAS 降至 41 分，回到正常区间。他没有离职，但学会了"在工作里安放自己"。'
      ],
      process: [
        { s: '心理测评', t: 'SAS/GAD-7 + 睡眠与躯体化评估' },
        { s: '计划定制', t: '12 周分阶段干预路线图' },
        { s: '每周陪伴', t: '正念练习 + 认知重构 + 行为实验' },
        { s: '长期机制', t: '边界协议 + 复发预防预案' }
      ],
      results: [
        { n: '63→41', l: '焦虑量表降幅' },
        { n: '20 分钟', l: '入睡时间缩短至' },
        { n: '12 周', l: '系统陪伴周期' }
      ],
      quote: '来之前我熬了三年，每天靠咖啡续命，最严重的时候凌晨三点盯着天花板数羊。老师教我的不是"别焦虑"——那根本不现实，而是怎么带着焦虑还能好好活。第六周那个晚上，我一觉睡到闹钟响，醒来第一反应是愣住：我居然睡了个整觉。这两个月，是我这几年头一回觉得日子还能过下去。',
      quoteFrom: '—— 王先生，某大厂技术负责人（匿名）',
      tags: ['焦虑管理', '正念减压', '睡眠修复', '职场边界']
    },
    family: {
      title: '家庭理财白皮书',
      tag: '财经',
      cat: 'finance',
      desc: '覆盖储蓄、保险、投资、养老四个模块的家庭财务规划指南。',
      image: 'assets/works/work-family.jpg',
      story: [
        '这是一个二胎家庭：丈夫 38 岁是程序员，妻子 35 岁是中学教师，两个孩子分别 6 岁和 2 岁。他们最大的焦虑是"两边四位老人要养老，两个孩子要教育，靠工资存钱永远赶不上花销"。',
        '我们用了三周做全量财务梳理，产出一本 46 页的《家庭理财白皮书》：储蓄模块（家庭现金流账户体系）、保险模块（四口之家的保障缺口测算）、投资模块（教育金与备用金的分层配置）、养老模块（两代人养老金的现金流模拟）。',
        '白皮书落地后，家庭执行了三个关键动作：建立"收入-储蓄-投资"自动转账纪律、补齐夫妻双方的定期寿险与重疾险、把教育金从单一存款切换到"固收+指数"组合。五年后回访，储蓄率从 12% 提升到 30%。'
      ],
      process: [
        { s: '全景盘点', t: '收支、负债、保障、目标四张表' },
        { s: '缺口测算', t: '教育金与养老金现金流模拟' },
        { s: '白皮书撰写', t: '四大模块 + 执行清单' },
        { s: '落地陪跑', t: '季度检视 + 方案动态调整' }
      ],
      results: [
        { n: '12%→30%', l: '家庭储蓄率' },
        { n: '46 页', l: '白皮书深度' },
        { n: '5 年', l: '持续跟踪回访' }
      ],
      quote: '拿到那本白皮书的第一晚，我俩坐在餐桌前对着表格看到十二点。结婚这些年总因为"钱不够花"吵架，其实是我们俩根本不知道钱都去哪了。现在每个月自动转账、每一笔都有安排，五年过去，孩子的教育金居然真的按计划攒够了——说出来我自己都有点不太敢信。',
      quoteFrom: '—— 李女士，两个孩子的妈妈',
      tags: ['家庭财务', '保险缺口', '教育金规划', '养老现金流']
    },
    fengshui: {
      title: '家居风水布局顾问',
      tag: '玄学',
      cat: 'metaphysics',
      desc: '结合户型与居住者命理，优化空间气场，提升家宅和谐度。',
      image: 'assets/works/work-fengshui.jpg',
      story: [
        '委托人搬进新买的江景大平层后，半年内家里"状况不断"：夫妻睡眠变差、孩子注意力不集中、母亲腰腿旧疾反复。朋友推荐我们做一次风水勘察，委托人起初半信半疑。',
        '实地勘察后发现三个典型问题：入户门正对主卧门形成"穿堂煞"；客厅电视墙位于屋宅"绝命位"且悬挂大面积镜面；主卧床头上方是楼上卫生间管道位。结合夫妻二人命理五行（均需"木、水"），我们给出了系统的化解方案。',
        '调整方案包括：玄关增设屏风形成缓冲、电视墙改为木质格栅并调换沙发朝向、卧室加装隔音吊顶与绿色植物点缀。三个月后回访，委托人反馈睡眠明显改善，孩子写作业的专注度也提高了。'
      ],
      process: [
        { s: '户型勘察', t: '实地量测 + 平面图标注' },
        { s: '命理校准', t: '结合居住者五行与命卦' },
        { s: '方案设计', t: '格局调整 + 化煞布局 + 色彩材质' },
        { s: '落地跟进', t: '改造指导 + 回访复验' }
      ],
      results: [
        { n: '3 处', l: '核心格局问题化解' },
        { n: '3 个月', l: '回访改善确认' },
        { n: '5 行', l: '个性化校准维度' }
      ],
      quote: '说真的，一开始我就是图个安心，心里想着"信则有不信则无"。调整完大概一个多月吧，我睡得沉了，孩子写作业居然能坐得住了。最让我服气的是班主任那天特意打电话来，说孩子作业质量高了不少。你说这是不是心理作用？就算是，那我也认了——反正家里现在是真的舒服。',
      quoteFrom: '—— 罗女士，江景大平层业主',
      tags: ['家居风水', '户型化解', '五行平衡', '空间能量']
    },
    origin: {
      title: '原生家庭疗愈之旅',
      tag: '心理',
      cat: 'psychology',
      desc: '以家庭系统视角回望成长经历，化解原生家庭带来的情绪枷锁，重建自我价值感。',
      image: 'assets/works/work-origin.jpg',
      story: [
        '委托人是一位 33 岁的女性高管，事业上杀伐果断，亲密关系里却屡屡"在即将靠近时推开对方"。三次恋爱都无疾而终，她开始怀疑"我是不是根本没有爱人的能力"。',
        '咨询中发现，她的"推开"是一种自我保护：小时候父母常年争吵，她学会用"不期待"来避免失望。家庭雕塑技术呈现这一幕时，她哭了很久——"原来我一直在等一个不会道歉的人，然后把自己活成那个人的样子"。',
        '16 周的深度咨询里，我们完成了三个层面的工作：看见（家庭模式回溯与觉察）、哀悼（对未完成期待的处理）、重建（用自我关怀替代自我批判）。结束时她说，这是她第一次在亲密关系里感到"安全"。'
      ],
      process: [
        { s: '成长回溯', t: '家庭结构与关键事件梳理' },
        { s: '模式识别', t: '家庭雕塑 + 依恋图式觉察' },
        { s: '深度疗愈', t: '空椅对话 + 内在小孩工作' },
        { s: '重建整合', t: '自我关怀计划 + 关系实践' }
      ],
      results: [
        { n: '16 周', l: '深度疗愈周期' },
        { n: '3 重', l: '看见-哀悼-重建' },
        { n: '1 段', l: '安全亲密关系开启' }
      ],
      quote: '咨询最痛的那几次，我哭到喘不上气，一度想放弃。可十六周走下来，我终于能对小时候那个躲在门后不敢出声的自己说一句"你辛苦了"。不是要原谅谁，而是我终于明白：我不必为那个无能为力的小孩负责。上个月，我居然主动约了爸妈吃饭——这在以前，是想都不敢想的事。',
      quoteFrom: '—— 匿名，某公司高管',
      tags: ['原生家庭', '家庭系统', '内在小孩', '依恋修复']
    },
    retire: {
      title: '退休养老规划定制',
      tag: '财经',
      cat: 'finance',
      desc: '为 45-60 岁人群定制退休收入方案，测算养老金缺口并落实执行路径。',
      image: 'assets/works/work-retire.jpg',
      story: [
        '委托人是一位 52 岁的企业高管，计划 58 岁退休。他希望退休后保持每月 2.5 万元的生活水准（含旅游与医疗预算），但算了算手头资产，心里没底——"我到底还差多少？钱怎么安排才能安全用到 85 岁？"',
        '我们用蒙特卡洛模拟为他测算了 27 年退休期的现金流：当前资产组合在中性假设下有 68% 的概率支撑到 85 岁，但若叠加医疗长尾支出与通胀超预期，缺口可能高达 240 万。',
        '方案分三步落地：第一，把存量资产按"生活所需（5 年安全垫）—稳健增值（固收+）—弹性收益（红利与海外资产）"重新分层；第二，启动递延领取策略，把企业年金与社保的领取节点延后；第三，配置长期护理保险对冲失能风险。经调整后，模拟支撑概率提升至 92%。'
      ],
      process: [
        { s: '目标厘清', t: '退休生活标准与支出画像' },
        { s: '缺口测算', t: '蒙特卡洛现金流模拟' },
        { s: '方案设计', t: '资产分层 + 领取策略 + 保险对冲' },
        { s: '落地执行', t: '年度检视与动态再平衡' }
      ],
      results: [
        { n: '68%→92%', l: '养老支撑概率' },
        { n: '240 万', l: '风险缺口识别' },
        { n: '27 年', l: '退休期现金流覆盖' }
      ],
      quote: '退休这事我焦虑了五年，每次算到一半就心烦意乱地把表格关掉。现在不一样了——我抽屉里有一张折得整整齐齐的现金流表，每一笔钱哪一年进、哪一年出、派什么用场，写得明明白白。我老婆说，我现在连讨论养老都不皱眉了。就冲这份踏实，这钱花得值。',
      quoteFrom: '—— 陈先生，企业高管（55 岁）',
      tags: ['养老规划', '现金流模拟', '年金策略', '长期护理']
    }
  };

  const modal = document.getElementById('workModal');
  const worksGrid = document.querySelector('.works-grid');

  function openModal(id) {
    const data = WORKS_DATA[id];
    if (!data || !modal) return;

    document.getElementById('modalImage').src = data.image;
    document.getElementById('modalImage').alt = data.title;
    document.getElementById('modalTag').textContent = data.tag;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalDesc').textContent = data.desc;

    document.getElementById('modalStory').innerHTML = data.story.map((p) => '<p>' + p + '</p>').join('');

    document.getElementById('modalProcess').innerHTML = data.process
      .map(
        (step, i) =>
          '<div class="process-item"><span class="step-num">' +
          (i + 1) +
          '</span><div class="step-text"><strong>' +
          step.s +
          '</strong>' +
          step.t +
          '</div></div>'
      )
      .join('');

    document.getElementById('modalResults').innerHTML = data.results
      .map(
        (r) =>
          '<div class="result-item"><span class="result-num">' +
          r.n +
          '</span><span class="result-label">' +
          r.l +
          '</span></div>'
      )
      .join('');

    document.getElementById('modalQuote').textContent = data.quote;
    document.getElementById('modalQuoteFrom').textContent = data.quoteFrom;

    document.getElementById('modalTags').innerHTML = data.tags.map((t) => '<span class="tag-chip">' + t + '</span>').join('');

    document.getElementById('modalCta').href = 'contact.html?direction=' + data.cat;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  // Event delegation: any card click opens its detail
  if (worksGrid) {
    worksGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.work-card');
      if (card && card.dataset.id) openModal(card.dataset.id);
    });
  }

  if (modal) {
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // Form validation
  const contactForms = document.querySelectorAll('.contact-form');
  contactForms.forEach((form) => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      const name = form.querySelector('[name="name"]');
      const contact = form.querySelector('[name="contact"]');
      const direction = form.querySelector('[name="direction"]');
      const content = form.querySelector('[name="content"]');

      clearErrors(form);

      if (!name || name.value.trim().length < 2) {
        showError(name, '请输入您的姓名');
        valid = false;
      }

      if (!contact || !isValidContact(contact.value.trim())) {
        showError(contact, '请输入有效的手机号或邮箱');
        valid = false;
      }

      if (!direction || !direction.value) {
        showError(direction, '请选择咨询方向');
        valid = false;
      }

      if (content && content.value.trim().length < 10) {
        showError(content, '请简要描述您的需求（至少 10 个字）');
        valid = false;
      }

      if (valid) {
        submitContactForm(form);
      }
    });

    form.querySelectorAll('.form-control').forEach((input) => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const err = input.parentElement.querySelector('.error-msg');
        if (err) err.classList.remove('show');
      });
    });
  });

  function isValidContact(value) {
    const phone = /^1[3-9]\d{9}$/;
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return phone.test(value) || email.test(value);
  }

  function showError(input, message) {
    if (!input) return;
    input.classList.add('error');
    const err = input.parentElement.querySelector('.error-msg');
    if (err) {
      err.textContent = message;
      err.classList.add('show');
    }
  }

  function clearErrors(form) {
    form.querySelectorAll('.form-control').forEach((input) => input.classList.remove('error'));
    form.querySelectorAll('.error-msg').forEach((msg) => msg.classList.remove('show'));
  }

  function showSuccessToast() {
    let toast = document.querySelector('.success-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'success-toast';
      toast.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>' +
        '<div><strong>提交成功</strong><div style="font-size:0.85rem;color:var(--color-text-muted);">我们会在 24 小时内与您联系</div></div>';
      document.body.appendChild(toast);
    }
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3600);
  }

  // 提交咨询表单到后端 /api/contact（同源，由 nginx 反代到 FastAPI）
  function submitContactForm(form) {
    const btn = form.querySelector('button[type="submit"]');
    const name = form.querySelector('[name="name"]').value.trim();
    const contact = form.querySelector('[name="contact"]').value.trim();
    const direction = form.querySelector('[name="direction"]').value;
    const content = form.querySelector('[name="content"]').value.trim();
    if (btn) btn.disabled = true;
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, contact: contact, direction: direction, content: content })
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.ok) {
          showSuccessToast();
          form.reset();
        } else {
          showErrorToast((d && d.error) ? d.error : '提交失败，请稍后重试');
        }
      })
      .catch(function () {
        showErrorToast('网络异常，请稍后重试，或直接发邮件至 Slceleto@gmail.com');
      })
      .finally(function () { if (btn) btn.disabled = false; });
  }

  // 错误提示（红色 toast）
  function showErrorToast(message) {
    let toast = document.querySelector('.error-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'error-toast';
      toast.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.3 3.86l-8.06 14a2 2 0 001.73 3h16.06a2 2 0 001.73-3l-8.06-14a2 2 0 00-3.46 0z" /></svg>' +
        '<div><strong>提交失败</strong><div style="font-size:0.85rem;color:var(--color-text-muted);"></div></div>';
      document.body.appendChild(toast);
    }
    const txt = toast.querySelector('div div');
    if (txt) txt.textContent = message;
    requestAnimationFrame(function () { toast.classList.add('show'); });
    setTimeout(function () { toast.classList.remove('show'); }, 4200);
  }

  // Auto-select direction from URL ?direction=xxx
  const urlParams = new URLSearchParams(window.location.search);
  const directionParam = urlParams.get('direction');
  if (directionParam) {
    document.querySelectorAll('select[name="direction"]').forEach((select) => {
      const option = Array.from(select.options).find((o) => o.value === directionParam);
      if (option) select.value = directionParam;
    });
  }
})();
