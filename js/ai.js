/* 古四信息咨询工作室 - AI 体验模块脚本 */
(function () {
  'use strict';

  var page = document.body.dataset.page || '';

  /* ---------- 通用：加载动画工具 ---------- */
  function showLoading(box, text) {
    var loading = box.querySelector('.ai-loading');
    if (loading) {
      loading.classList.add('show');
      var label = loading.querySelector('.ai-thinking-text');
      if (label) label.textContent = text || 'AI 正在推演…';
    }
  }

  function hideLoading(box) {
    var loading = box.querySelector('.ai-loading');
    if (loading) loading.classList.remove('show');
  }

  function showResult(box) {
    var result = box.querySelector('.ai-result');
    if (result) {
      result.classList.remove('show');
      void result.offsetWidth;
      result.classList.add('show');
    }
  }

  /* ================= 命理卜术 ================= */
  if (page === 'metaphysics') {
    var GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    var ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    var GAN_WUXING = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水'];
    var ZHI_WUXING = ['水', '土', '木', '木', '土', '火', '火', '土', '金', '金', '土', '水'];
    var WUXING_COLORS = { 木: '#34d399', 火: '#f87171', 土: '#d9a441', 金: '#e2c98a', 水: '#38bdf8' };
    var WUXING_DESC = {
      木: { trait: '仁厚向上，生长力强，重视原则与长远规划，擅长开创与培育。', advice: '木主生发，适合在事业上持续深耕与拓展；遇事避免急躁，多听他人建议可化解固执。' },
      火: { trait: '热情主动，行动力强，富有感染力，天生的开拓者与表达者。', advice: '火主礼与明，精力充沛但需注意节奏，避免三分钟热度；合作中学会倾听可事半功倍。' },
      土: { trait: '沉稳包容，踏实守信，是可靠的执行者与资源整合者。', advice: '土主信与承载，适合长期经营与积累；多接触新鲜事物，可避免因保守错失机会。' },
      金: { trait: '果决刚毅，讲求效率，逻辑清晰，有强烈的原则与边界感。', advice: '金主义与决断，适合需要严谨判断的领域；柔化沟通方式，人际关系会更顺畅。' },
      水: { trait: '聪慧灵动，适应力强，善于洞察变化，极具创意与谋略。', advice: '水主智与流动，顺势而为是最大优势；确立稳定的方向感，可避免想法过多难以落地。' }
    };

    function jdn(y, m, d) {
      var a = Math.floor((14 - m) / 12);
      var yy = y + 4800 - a;
      var mm = m + 12 * a - 3;
      return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
    }

    function calcPillars(year, month, day, hour) {
      // 年柱
      var yearGan = (year - 4) % 10;
      var yearZhi = (year - 4) % 12;
      // 月柱（五虎遁）
      var monthZhi = (month + 1) % 12; // 正月起寅
      var monthGan = ((yearGan % 5) * 2 + monthZhi) % 10;
      // 日柱（儒略日）
      var dayIdx = (jdn(year, month, day) + 49) % 60;
      var dayGan = dayIdx % 10;
      var dayZhi = dayIdx % 12;
      // 时柱（五鼠遁）
      var hourZhi = Math.floor(((hour + 1) % 24) / 2) % 12;
      var hourGan = ((dayGan % 5) * 2 + hourZhi) % 10;
      return [
        { gan: yearGan, zhi: yearZhi },
        { gan: monthGan, zhi: monthZhi },
        { gan: dayGan, zhi: dayZhi },
        { gan: hourGan, zhi: hourZhi }
      ];
    }

    var baziForm = document.getElementById('baziForm');
    if (baziForm) {
      baziForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var box = baziForm.closest('.ai-tool');
        var year = parseInt(document.getElementById('bYear').value, 10);
        var month = parseInt(document.getElementById('bMonth').value, 10);
        var day = parseInt(document.getElementById('bDay').value, 10);
        var hour = parseInt(document.getElementById('bHour').value, 10);

        var result = box.querySelector('.ai-result');
        result.classList.remove('show');
        showLoading(box, '正在排盘推演四柱八字…');

        setTimeout(function () {
          hideLoading(box);

          var pillars = calcPillars(year, month, day, hour);
          var ganCount = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
          var zhiCount = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
          pillars.forEach(function (p) {
            ganCount[GAN_WUXING[p.gan]]++;
            zhiCount[ZHI_WUXING[p.zhi]]++;
          });
          var total = {
            木: ganCount['木'] + zhiCount['木'],
            火: ganCount['火'] + zhiCount['火'],
            土: ganCount['土'] + zhiCount['土'],
            金: ganCount['金'] + zhiCount['金'],
            水: ganCount['水'] + zhiCount['水']
          };
          var sum = total['木'] + total['火'] + total['土'] + total['金'] + total['水'];

          // 五行条
          var barsHtml = ['木', '火', '土', '金', '水'].map(function (w) {
            var pct = Math.round((total[w] / sum) * 100);
            return (
              '<div class="wuxing-item"><div class="wuxing-name">' + w + '</div>' +
              '<div class="wuxing-bar"><i style="background:' + WUXING_COLORS[w] + ';width:' + pct + '%"></i></div>' +
              '<div class="wuxing-val">' + pct + '%</div></div>'
            );
          }).join('');

          // 四柱文字
          var pillarHtml = pillars.map(function (p, i) {
            return '<strong>' + ['年柱', '月柱', '日柱', '时柱'][i] + '</strong>' + GAN[p.gan] + ZHI[p.zhi];
          }).join(' · ');

          // 日主与强弱（简化：按日干五行出现次数对比）
          var dayMaster = GAN[pillars[2].gan];
          var dayWx = GAN_WUXING[pillars[2].gan];
          var strongest = Object.keys(total).sort(function (a, b) { return total[b] - total[a]; })[0];
          var weakest = Object.keys(total).sort(function (a, b) { return total[a] - total[b]; })[0];
          var desc = WUXING_DESC[dayWx];

          result.innerHTML =
            '<div class="ai-result-head"><h4>八字五行推演结果</h4><span class="ai-result-badge">' +
            GAN[pillars[0].gan] + ZHI[pillars[0].zhi] + ' 年 · 日主 ' + dayMaster + '</span></div>' +
            '<div class="ai-text-block" style="margin-bottom:6px">' + pillarHtml + '</div>' +
            '<div class="wuxing-grid">' + barsHtml + '</div>' +
            '<div class="ai-section-title">日主「' + dayMaster + '」属' + dayWx + ' · ' + desc.trait + '</div>' +
            '<p class="ai-text-block">' + desc.advice + '</p>' +
            '<div class="ai-section-title">能量提示</div>' +
            '<p class="ai-text-block">命局中 <strong>' + strongest + '</strong> 气最旺（' + Math.round((total[strongest] / sum) * 100) + '%），<strong>' + weakest + '</strong> 气偏弱。' +
            (weakest === dayWx ? '日主五行偏弱，宜借旺神之势、顺势而为，重大决策前多征询稳健意见。' : '五行流通尚可，关键节点上' + strongest + '的推动力明显，可优先把握' + strongest + '相关的行业与方向。') + '</p>' +
            '<div class="ai-section-title">流年提示</div>' +
            '<p class="ai-text-block">本年度宜<strong>先稳后进</strong>：上半年侧重积累与梳理，下半年再行扩张；涉及合作与投资，建议结合专业咨询综合研判。</p>' +
            '<p class="ai-note">* 本推演基于简化四柱算法，仅供文化体验与娱乐参考，不构成专业命理或决策依据。</p>';

          showResult(box);
        }, 1600);
      });
    }

    /* ---- 塔罗抽牌 ---- */
    var MAJOR_ARCANA = [
      { n: 0, name: '愚者', up: '新的开始、勇气与自由，提示放下顾虑拥抱未知。', down: '冒进鲁莽、方向不明，需要先厘清目标再行动。' },
      { n: 1, name: '魔术师', up: '资源齐备、行动力强，正是把想法落地的时刻。', down: '能力被分散或准备不足，需聚焦核心优势。' },
      { n: 2, name: '女祭司', up: '直觉敏锐、静待时机，倾听内心与潜意识的声音。', down: '忽略内在信号，或信息不足导致误判。' },
      { n: 3, name: '皇后', up: '丰盛滋养、创造与关怀，宜经营关系与长期价值。', down: '过度付出或依赖，需重新平衡给予与索取。' },
      { n: 4, name: '皇帝', up: '秩序、权威与掌控力，适合确立规则与承担责任。', down: '控制过强、僵化固执，需要适度放手。' },
      { n: 5, name: '教皇', up: '传统、指引与师承，可从可靠渠道获得智慧支持。', down: '教条束缚或盲从权威，要敢于独立判断。' },
      { n: 6, name: '恋人', up: '联结、选择与和谐，重要关系或合作迎来关键节点。', down: '价值冲突、摇摆不定，需先与自己和解。' },
      { n: 7, name: '战车', up: '意志坚定、目标明确，以纪律推动胜利。', down: '方向失焦或动力不足，避免硬碰硬。' },
      { n: 8, name: '力量', up: '温柔而坚定的力量，以耐心与共情化解对抗。', down: '自我怀疑或情绪失控，先安顿内在再对外。' },
      { n: 9, name: '隐士', up: '内省、沉淀与求索，独处中孕育智慧。', down: '过度封闭或孤立，需适度打开自己。' },
      { n: 10, name: '命运之轮', up: '转机与周期，顺势而为将迎来上升。', down: '阻力与反复，是调整节奏的信号。' },
      { n: 11, name: '正义', up: '公正、平衡与因果，适合做权衡利弊的决策。', down: '失衡或偏颇，需要重新审视公平。' },
      { n: 12, name: '倒吊人', up: '换位思考、暂停与牺牲，换个角度看问题。', down: '无谓的拖延或牺牲，应及时止损。' },
      { n: 13, name: '死神', up: '结束与重生，放下旧模式才能迎来新阶段。', down: '抗拒改变、停滞不前，勇敢告别旧局。' },
      { n: 14, name: '节制', up: '调和、适度与耐心，节奏感是当下的关键。', down: '失衡或过度，需重新校准生活的配比。' },
      { n: 15, name: '恶魔', up: '执念、诱惑与束缚，看清欲望背后的真相。', down: '正在挣脱束缚，警惕旧习惯的回摆。' },
      { n: 16, name: '高塔', up: '突如其来的变革，打破旧有结构以重建。', down: '风险在酝酿，提前布局可化险为夷。' },
      { n: 17, name: '星星', up: '希望、疗愈与灵光，远方有值得奔赴的愿景。', down: '信心受挫，先恢复自我价值感。' },
      { n: 18, name: '月亮', up: '朦胧、不安与直觉，保持清醒分辨幻象。', down: '迷雾渐散，真相浮现，勇气回归。' },
      { n: 19, name: '太阳', up: '成功、活力与喜悦，成果即将被看见。', down: '短暂低谷，保持乐观继续向前。' },
      { n: 20, name: '审判', up: '觉醒、召唤与复盘，过去的努力迎来清算与升华。', down: '自我否定或逃避，接纳不完美才能成长。' },
      { n: 21, name: '世界', up: '圆满、完成与新循环，一个阶段画上句点。', down: '差一步完成，别在终点前松懈。' }
    ];
    var TAROT_POSITIONS = ['过去', '当下', '未来'];

    var tarotStage = document.getElementById('tarotStage');
    var tarotResult = document.getElementById('tarotResult');
    if (tarotStage) {
      var tarotBtn = document.getElementById('tarotDraw');
      tarotBtn.addEventListener('click', function () {
        tarotResult.classList.remove('show');
        // 洗牌
        var shuffled = MAJOR_ARCANA.slice();
        for (var i = shuffled.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var tmp = shuffled[i];
          shuffled[i] = shuffled[j];
          shuffled[j] = tmp;
        }
        var picks = shuffled.slice(0, 3).map(function (c) {
          return { card: c, reversed: Math.random() < 0.35 };
        });
        tarotStage.innerHTML = '';
        tarotStage.classList.add('shuffling');
        picks.forEach(function (pick, idx) {
          var slot = document.createElement('div');
          slot.className = 'tarot-slot';
          slot.innerHTML =
            '<div class="tarot-inner">' +
            '<div class="tarot-face tarot-back">塔罗</div>' +
            '<div class="tarot-face tarot-front' + (pick.reversed ? ' reversed' : '') + '">' +
            '<span class="tarot-num">' + (pick.card.n === 0 ? '〇' : pick.card.n) + '</span>' +
            '<span class="tarot-name">' + pick.card.name + '</span>' +
            '<span>' + TAROT_POSITIONS[idx] + '</span>' +
            '</div></div>';
          slot.addEventListener('click', function () {
            slot.classList.add('flipped');
            setTimeout(function () {
              var list = document.createElement('div');
              list.className = 'tarot-read';
              list.innerHTML =
                '<div class="ai-section-title">' + TAROT_POSITIONS[idx] + ' · ' + pick.card.name + (pick.reversed ? '（逆位）' : '（正位）') + '</div>' +
                '<p class="ai-text-block">' + (pick.reversed ? pick.card.down : pick.card.up) + '</p>';
              tarotResult.appendChild(list);
              tarotResult.classList.add('show');
            }, 450);
          });
          tarotStage.appendChild(slot);
        });
        setTimeout(function () {
          tarotStage.classList.remove('shuffling');
        }, 600);
      });
    }
  }

  /* ================= 心理咨询管理 ================= */
  if (page === 'psychology') {
    /* ---- 情绪自测量表 ---- */
    var QUIZ = [
      { q: '近两周，你是否常感到紧张、焦虑或烦躁？' },
      { q: '你是否难以停止或控制自己不去担心各种事情？' },
      { q: '你是否容易感到疲惫、精力难以恢复？' },
      { q: '你是否难以入睡、中途易醒或睡不踏实？' },
      { q: '你是否感觉注意力难以集中，做事效率下降？' },
      { q: '你是否变得容易急躁，对身边人失去耐心？' },
      { q: '你是否觉得情绪低落、对喜欢的事提不起兴趣？' }
    ];
    var QUIZ_OPTS = [
      { label: '完全没有', score: 0 },
      { label: '有几天', score: 1 },
      { label: '一半以上时间', score: 2 },
      { label: '几乎每天', score: 3 }
    ];

    var quizBox = document.getElementById('quizBox');
    if (quizBox) {
      var answers = new Array(QUIZ.length).fill(-1);
      var quizIdx = 0;
      var quizProgress = document.getElementById('quizProgress');
      var quizTitle = document.getElementById('quizTitle');
      var quizArea = document.getElementById('quizArea');

      function renderQuestion() {
        quizTitle.textContent = '第 ' + (quizIdx + 1) + ' / ' + QUIZ.length + ' 题';
        quizProgress.style.width = ((quizIdx / QUIZ.length) * 100) + '%';
        quizArea.innerHTML = '';
        var qEl = document.createElement('div');
        qEl.className = 'quiz-question';
        qEl.innerHTML =
          '<p class="quiz-qtext">' + (quizIdx + 1) + '. ' + QUIZ[quizIdx].q + '</p>' +
          '<div class="quiz-options">' +
          QUIZ_OPTS.map(function (opt, oi) {
            return '<button type="button" class="quiz-option" data-score="' + opt.score + '">' + opt.label + '</button>';
          }).join('') +
          '</div>';
        quizArea.appendChild(qEl);
        qEl.querySelectorAll('.quiz-option').forEach(function (btn) {
          btn.addEventListener('click', function () {
            qEl.querySelectorAll('.quiz-option').forEach(function (b) { b.classList.remove('selected'); });
            btn.classList.add('selected');
            answers[quizIdx] = parseInt(btn.dataset.score, 10);
            setTimeout(function () {
              quizIdx++;
              if (quizIdx < QUIZ.length) {
                renderQuestion();
              } else {
                finishQuiz();
              }
            }, 320);
          });
        });
      }

      function finishQuiz() {
        var total = answers.reduce(function (a, b) { return a + b; }, 0);
        var level, cls, advice;
        if (total <= 4) {
          level = '状态良好'; cls = 'low';
          advice = '你目前的情绪状态整体平稳，压力在可控范围。建议保持规律作息与适度运动，每周安排固定的放松时间，持续守护这份从容。';
        } else if (total <= 9) {
          level = '轻度压力'; cls = 'low';
          advice = '存在轻度情绪波动，多与工作节奏、生活变动有关。可以尝试每天 10 分钟正念呼吸，记录情绪日记观察触发点；若持续两周未缓解，欢迎预约专业咨询。';
        } else if (total <= 14) {
          level = '中度压力'; cls = 'mid';
          advice = '情绪负荷已较明显，睡眠与注意力可能受到影响。建议暂停高强度安排，主动寻求支持——与信任的人倾诉，或预约一次专业咨询做系统评估与调节。';
        } else {
          level = '压力偏高'; cls = 'high';
          advice = '你的压力信号较为强烈，请务必重视。强烈建议尽快预约心理咨询进行专业评估，同时保证充足睡眠、减少咖啡因摄入；你不是一个人在面对，我们愿意陪你一起走这段路。';
        }
        quizArea.innerHTML = '';
        var quizResult = quizBox.querySelector('.ai-result');
        quizResult.innerHTML =
          '<div class="ai-result-head"><h4>情绪状态评估结果</h4><span class="ai-result-badge">总分 ' + total + ' / ' + QUIZ.length * 3 + '</span></div>' +
          '<span class="result-level ' + cls + '">' + level + '</span>' +
          '<p class="ai-text-block">' + advice + '</p>' +
          '<div class="ai-section-title">专业支持入口</div>' +
          '<div class="ai-chips"><span class="tag-chip">情绪管理</span><span class="tag-chip">正念减压</span><span class="tag-chip">睡眠修复</span><span class="tag-chip">一对一咨询</span></div>' +
          '<div class="modal-cta" style="margin-top:18px"><a href="contact.html?direction=psychology" class="btn btn-primary">预约心理咨询</a>' +
          '<button type="button" class="btn btn-outline" onclick="location.reload()">重新测评</button></div>';
        quizResult.classList.add('show');
      }

      quizArea.innerHTML = '';
      quizTitle.textContent = '第 1 / ' + QUIZ.length + ' 题';
      renderQuestion();
    }

    /* ---- 呼吸放松引导（4-4 节律） ---- */
    var breathBtn = document.getElementById('breathBtn');
    if (breathBtn) {
      var breathTimer = null;
      var phase = 0; // 0 吸气 1 呼气
      var rounds = 0;
      var breathing = false;
      var breathLabel = document.getElementById('breathLabel');
      var breathCount = document.getElementById('breathCount');
      var breathSteps = document.querySelectorAll('.breath-step');
      var circleWrap = document.getElementById('breathCircle');

      function tick() {
        if (phase === 0) {
          breathLabel.textContent = '吸气';
          breathSteps[0].classList.add('active');
          breathSteps[1].classList.remove('active');
          breathTimer = setTimeout(function () {
            phase = 1;
            tick();
          }, 4000);
        } else {
          breathLabel.textContent = '呼气';
          breathSteps[1].classList.add('active');
          breathSteps[0].classList.remove('active');
          rounds++;
          breathCount.textContent = '已完成 ' + rounds + ' 次呼吸';
          breathTimer = setTimeout(function () {
            phase = 0;
            tick();
          }, 4000);
        }
      }

      breathBtn.addEventListener('click', function () {
        if (!breathing) {
          breathing = true;
          breathBtn.textContent = '停止引导';
          breathBtn.classList.add('ai-btn-ghost');
          circleWrap.classList.add('breathing');
          phase = 0;
          rounds = 0;
          breathCount.textContent = '跟随圆环节奏，从吸气开始';
          tick();
        } else {
          breathing = false;
          clearTimeout(breathTimer);
          breathBtn.textContent = '开始呼吸引导';
          breathBtn.classList.remove('ai-btn-ghost');
          circleWrap.classList.remove('breathing');
          breathLabel.textContent = '准备';
          breathSteps.forEach(function (s) { s.classList.remove('active'); });
          breathCount.textContent = '';
        }
      });
    }

    /* ---- 情绪日记分析 ---- */
    var diaryBtn = document.getElementById('diaryBtn');
    if (diaryBtn) {
      var POS_WORDS = ['开心', '高兴', '快乐', '幸福', '满足', '轻松', '期待', '喜悦', '温暖', '安心', '感激', '自豪', '平静', '充满', '顺利', '喜欢', '热爱', '希望', '有劲', '舒服'];
      var NEG_WORDS = ['焦虑', '紧张', '难过', '沮丧', '生气', '愤怒', '疲惫', '烦躁', '不安', '孤独', '压力', '崩溃', '失望', '害怕', '担心', '委屈', '迷茫', '低落', '郁闷', '难受', '失眠', '累'];

      diaryBtn.addEventListener('click', function () {
        var text = document.getElementById('diaryText').value.trim();
        var diaryResult = document.getElementById('diaryResult');
        if (text.length < 10) {
          diaryResult.classList.remove('show');
          diaryResult.innerHTML = '<p class="ai-text-block">请先写下至少 10 个字的情绪记录，AI 才能为你分析。</p>';
          diaryResult.classList.add('show');
          return;
        }
        var pos = 0, neg = 0, matched = [];
        POS_WORDS.forEach(function (w) { if (text.indexOf(w) > -1) { pos++; matched.push(w); } });
        NEG_WORDS.forEach(function (w) { if (text.indexOf(w) > -1) { neg++; matched.push(w); } });
        var total = pos + neg;
        var ratio = total === 0 ? 0 : Math.round(((pos - neg) / total) * 100);
        var mood = ratio > 15 ? '偏积极' : ratio < -15 ? '偏消极' : '平稳';
        var moodCls = ratio > 15 ? 'low' : ratio < -15 ? 'high' : 'mid';
        var advice =
          ratio > 15
            ? '文字里透出明显的积极能量，记得把这份好状态分享给身边重要的人，它会被放大。'
            : ratio < -15
              ? '今天的情绪比较沉重，辛苦了。请给自己留一点喘息空间——一次热水澡、一段散步或一次倾诉都可以；若连续多日如此，欢迎预约专业咨询。'
              : '今天的情绪整体平稳，有起伏但都在可承受范围。坚持记录，你会逐渐看清自己情绪的规律与触发点。';
        diaryResult.classList.remove('show');
        diaryResult.innerHTML =
          '<div class="ai-result-head"><h4>情绪日记分析</h4><span class="ai-result-badge">识别 ' + total + ' 个情绪词</span></div>' +
          '<span class="result-level ' + moodCls + '">今日情绪倾向：' + mood + '</span>' +
          '<div class="diary-metrics">' +
          '<div class="diary-metric"><span class="dm-num">' + pos + '</span><span class="dm-label">积极词</span></div>' +
          '<div class="diary-metric"><span class="dm-num">' + neg + '</span><span class="dm-label">消极词</span></div>' +
          '<div class="diary-metric"><span class="dm-num">' + (ratio > 0 ? '+' : '') + ratio + '%</span><span class="dm-label">情绪指数</span></div>' +
          '</div>' +
          '<p class="ai-text-block" style="margin-top:16px">' + advice + '</p>' +
          (matched.length ? '<div class="ai-section-title">识别到的关键词</div><div class="ai-chips">' + matched.map(function (w) { return '<span class="tag-chip">' + w + '</span>'; }).join('') + '</div>' : '') +
          '<p class="ai-note">* 分析基于通用情感词库的简单匹配，仅供自我觉察参考。</p>';
        diaryResult.classList.add('show');
      });
    }
  }

  /* ================= 财金分析平台 ================= */
  if (page === 'finance') {
    /* ---- 复利计算器 ---- */
    var compoundForm = document.getElementById('compoundForm');
    if (compoundForm) {
      compoundForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var box = compoundForm.closest('.ai-tool');
        var principal = parseFloat(document.getElementById('cPrincipal').value) || 0;
        var rate = parseFloat(document.getElementById('cRate').value) || 0;
        var years = parseInt(document.getElementById('cYears').value, 10) || 1;
        var monthly = parseFloat(document.getElementById('cMonthly').value) || 0;

        var result = box.querySelector('.ai-result');
        result.classList.remove('show');
        showLoading(box, 'AI 正在模拟复利增长曲线…');

        setTimeout(function () {
          hideLoading(box);
          var data = [];
          var totalInvest = principal;
          var cur = principal;
          var r = rate / 100 / 12;
          for (var y = 0; y <= years; y++) {
            if (y > 0) {
              for (var m = 0; m < 12; m++) {
                cur = cur * (1 + r) + monthly;
              }
              totalInvest += monthly * 12;
            }
            data.push({ y: y, v: Math.round(cur) });
          }
          var finalVal = data[data.length - 1].v;
          var gain = finalVal - totalInvest;
          var gainPct = totalInvest > 0 ? Math.round((gain / totalInvest) * 100) : 0;

          // SVG 折线图
          var W = 640, H = 200, pad = 30;
          var maxV = Math.max.apply(null, data.map(function (d) { return d.v; }));
          var minV = Math.min.apply(null, data.map(function (d) { return d.v; }));
          var span = maxV - minV || 1;
          var pts = data.map(function (d) {
            var x = pad + (d.y / years) * (W - pad * 2);
            var y = H - pad - ((d.v - minV) / span) * (H - pad * 2);
            return x.toFixed(1) + ',' + y.toFixed(1);
          });
          var polyline = pts.join(' ');
          var area = 'M' + pad + ',' + (H - pad) + ' L' + pts.join(' L') + ' L' + (W - pad) + ',' + (H - pad) + ' Z';

          var chartHtml =
            '<div class="chart-box"><svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
            '<defs><linearGradient id="gainGrad" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0%" stop-color="rgba(13,148,136,0.35)"/><stop offset="100%" stop-color="rgba(13,148,136,0.02)"/>' +
            '</linearGradient></defs>' +
            '<path d="' + area + '" fill="url(#gainGrad)"/>' +
            '<polyline points="' + polyline + '" fill="none" stroke="#2dd4bf" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>' +
            '<circle cx="' + pts[pts.length - 1].split(',')[0] + '" cy="' + pts[pts.length - 1].split(',')[1] + '" r="4" fill="#d9a441"/>' +
            '</svg></div>';

          result.innerHTML =
            '<div class="ai-result-head"><h4>复利增长模拟</h4><span class="ai-result-badge">' + years + ' 年 · 年化 ' + rate + '%</span></div>' +
            '<div class="metric-grid">' +
            '<div class="metric-item"><span class="metric-num">¥' + formatNum(finalVal) + '</span><span class="metric-label">终值</span></div>' +
            '<div class="metric-item"><span class="metric-num">¥' + formatNum(totalInvest) + '</span><span class="metric-label">累计投入</span></div>' +
            '<div class="metric-item"><span class="metric-num">+¥' + formatNum(gain) + ' (' + gainPct + '%)</span><span class="metric-label">复利收益</span></div>' +
            '</div>' +
            chartHtml +
            '<p class="ai-text-block" style="margin-top:16px">按年化 ' + rate + '% 计算，' + years + ' 年后你的资产预计增值至 <strong>¥' + formatNum(finalVal) + '</strong>，其中复利带来的收益约 <strong>¥' + formatNum(gain) + '</strong>。时间与纪律，是普通人最可靠的杠杆。</p>' +
            '<p class="ai-note">* 模拟基于固定年化利率假设，未考虑税费与市场波动，实际收益可能不同，不构成投资建议。</p>';

          showResult(box);
        }, 1400);
      });
    }

    function formatNum(n) {
      if (n >= 100000000) return (n / 100000000).toFixed(2) + ' 亿';
      if (n >= 10000) return (n / 10000).toFixed(1) + ' 万';
      return n.toLocaleString();
    }

    /* ---- 风险偏好测评 ---- */
    var RISK_QUIZ = [
      { q: '如果一笔投资在 1 个月内下跌 10%，你会？', opts: ['立即赎回止损', '持有观察一段时间', '趁低补仓', '加大投入等待反弹'] },
      { q: '你的投资经验更接近？', opts: ['几乎没有', '只有存款理财', '买过基金股票', '有多年投资经验'] },
      { q: '你希望这笔钱在多长时间内派上用场？', opts: ['1 年内', '1-3 年', '3-5 年', '5 年以上'] },
      { q: '面对"高收益高风险"的机会，你通常？', opts: ['完全回避', '少量尝试', '适度参与', '积极配置'] },
      { q: '你更认可哪种投资哲学？', opts: ['保本第一', '稳健增值', '平衡配置', '追求超额收益'] },
      { q: '当你获得一笔意外之财，你更可能？', opts: ['存起来', '买理财', '配置基金股票', '寻找进取型机会'] },
      { q: '你能接受的最大年度亏损幅度？', opts: ['5% 以内', '10% 左右', '20% 左右', '30% 以上'] },
      { q: '投资前，你通常如何做决策？', opts: ['随缘', '听朋友建议', '自己做简单研究', '结合专业分析'] }
    ];

    var riskBox = document.getElementById('riskBox');
    if (riskBox) {
      var riskAnswers = new Array(RISK_QUIZ.length).fill(-1);
      var riskIdx = 0;
      var riskArea = document.getElementById('riskArea');
      var riskProgress = document.getElementById('riskProgress');
      var riskTitle = document.getElementById('riskTitle');

      function renderRisk() {
        riskTitle.textContent = '第 ' + (riskIdx + 1) + ' / ' + RISK_QUIZ.length + ' 题';
        riskProgress.style.width = ((riskIdx / RISK_QUIZ.length) * 100) + '%';
        riskArea.innerHTML = '';
        var qEl = document.createElement('div');
        qEl.className = 'quiz-question';
        qEl.innerHTML =
          '<p class="quiz-qtext">' + (riskIdx + 1) + '. ' + RISK_QUIZ[riskIdx].q + '</p>' +
          '<div class="quiz-options">' +
          RISK_QUIZ[riskIdx].opts.map(function (opt, oi) {
            return '<button type="button" class="quiz-option" data-score="' + (oi + 1) + '">' + opt + '</button>';
          }).join('') +
          '</div>';
        riskArea.appendChild(qEl);
        qEl.querySelectorAll('.quiz-option').forEach(function (btn) {
          btn.addEventListener('click', function () {
            qEl.querySelectorAll('.quiz-option').forEach(function (b) { b.classList.remove('selected'); });
            btn.classList.add('selected');
            riskAnswers[riskIdx] = parseInt(btn.dataset.score, 10);
            setTimeout(function () {
              riskIdx++;
              if (riskIdx < RISK_QUIZ.length) renderRisk();
              else finishRisk();
            }, 300);
          });
        });
      }

      function finishRisk() {
        var total = riskAnswers.reduce(function (a, b) { return a + b; }, 0);
        var type, cls, alloc;
        if (total <= 14) { type = '保守型'; cls = 'low'; alloc = '现金 30% · 固收 55% · 权益 10% · 其他 5%'; }
        else if (total <= 21) { type = '稳健型'; cls = 'low'; alloc = '现金 20% · 固收 45% · 权益 30% · 其他 5%'; }
        else if (total <= 27) { type = '平衡型'; cls = 'mid'; alloc = '现金 12% · 固收 33% · 权益 50% · 其他 5%'; }
        else { type = '进取型'; cls = 'high'; alloc = '现金 8% · 固收 22% · 权益 62% · 其他 8%'; }

        riskArea.innerHTML = '';
        var riskResult = riskBox.querySelector('.ai-result');
        riskResult.innerHTML =
          '<div class="ai-result-head"><h4>风险偏好测评结果</h4><span class="ai-result-badge">得分 ' + total + ' / ' + RISK_QUIZ.length * 4 + '</span></div>' +
          '<span class="result-level ' + cls + '">' + type + '</span>' +
          '<p class="ai-text-block">你的风险承受画像偏向<strong>' + type + '</strong>。建议参考如下大类配置基准：<strong>' + alloc + '</strong>。配置只是起点，还需结合现金流与目标期限动态调整。</p>' +
          '<div class="ai-section-title">下一步建议</div>' +
          '<p class="ai-text-block">将测评结果带入下方「资产配置模拟器」，输入你的可投资资产，即可生成可视化配置方案。</p>' +
          '<div class="modal-cta" style="margin-top:18px"><button type="button" class="btn btn-primary" onclick="document.getElementById(\'riskResult2\').scrollIntoView({behavior:\'smooth\'})">去配置资产</button>' +
          '<button type="button" class="btn btn-outline" onclick="location.reload()">重新测评</button></div>';
        riskResult.classList.add('show');
      }

      riskTitle.textContent = '第 1 / ' + RISK_QUIZ.length + ' 题';
      renderRisk();
    }

    /* ---- 资产配置模拟器 ---- */
    var allocForm = document.getElementById('allocForm');
    if (allocForm) {
      allocForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var box = allocForm.closest('.ai-tool');
        var amount = parseFloat(document.getElementById('aAmount').value) || 0;
        var type = document.getElementById('aType').value;

        var profile = {
          conservative: { name: '保守型', cash: 0.3, fixed: 0.55, equity: 0.1, other: 0.05, range: '3.0% - 5.0%' },
          steady: { name: '稳健型', cash: 0.2, fixed: 0.45, equity: 0.3, other: 0.05, range: '4.5% - 7.5%' },
          balanced: { name: '平衡型', cash: 0.12, fixed: 0.33, equity: 0.5, other: 0.05, range: '6.0% - 10.5%' },
          aggressive: { name: '进取型', cash: 0.08, fixed: 0.22, equity: 0.62, other: 0.08, range: '8.0% - 14.0%' }
        }[type];

        var result = box.querySelector('.ai-result');
        result.classList.remove('show');
        showLoading(box, 'AI 正在生成资产配置方案…');

        setTimeout(function () {
          hideLoading(box);
          var segs = [
            { label: '现金/货币', pct: profile.cash, color: '#38bdf8' },
            { label: '固收/债券', pct: profile.fixed, color: '#d9a441' },
            { label: '权益/指数', pct: profile.equity, color: '#2dd4bf' },
            { label: '黄金/其他', pct: profile.other, color: '#a78bfa' }
          ];
          // 环形图
          var R = 70, C = 2 * Math.PI * R;
          var off = 0;
          var donut = segs.map(function (s) {
            var dash = (s.pct * C).toFixed(1);
            var html =
              '<circle r="' + R + '" cx="100" cy="100" fill="none" stroke="' + s.color + '" stroke-width="22" ' +
              'stroke-dasharray="' + dash + ' ' + (C - parseFloat(dash)).toFixed(1) + '" stroke-dashoffset="' + (-off).toFixed(1) + '" ' +
              'transform="rotate(-90 100 100)" stroke-linecap="butt" opacity="0.92"/>';
            off += parseFloat(dash);
            return html;
          }).join('');

          result.innerHTML =
            '<div class="ai-result-head"><h4>' + profile.name + '资产配置方案</h4><span class="ai-result-badge">预期年化 ' + profile.range + '</span></div>' +
            '<div class="config-layout">' +
            '<div class="chart-box" style="background:transparent;border:none"><svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="max-width:210px;margin:0 auto">' +
            donut +
            '<text x="100" y="96" text-anchor="middle" fill="#dbe4f0" font-size="13" font-family="Noto Serif SC,serif">' + profile.name + '</text>' +
            '<text x="100" y="114" text-anchor="middle" fill="#94a3b8" font-size="9">¥' + formatNum(amount) + '</text>' +
            '</svg></div>' +
            '<div class="config-legend">' +
            segs.map(function (s) {
              return '<div class="config-legend-item"><span class="cl-dot" style="background:' + s.color + '"></span><span>' + s.label + '</span>' +
                '<span class="cl-pct">' + Math.round(s.pct * 100) + '% · ¥' + formatNum(amount * s.pct) + '</span></div>';
            }).join('') +
            '</div></div>' +
            '<p class="ai-text-block" style="margin-top:18px">按「' + profile.name + '」画像，' + formatNum(amount) + ' 元可分四层管理：' +
            '现金层保障 6-12 个月流动性，固收层提供稳定票息，权益层追求长期增值，黄金等另类资产对冲尾部风险。建议每季度检视、每年再平衡一次。</p>' +
            '<p class="ai-note">* 本方案为通用配置基准演示，不构成个性化投资建议；重大决策请咨询持牌专业机构。</p>';

          showResult(box);
        }, 1400);
      });
    }
  }
})();
