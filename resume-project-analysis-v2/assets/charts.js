// assets/charts.js for resume-project-analysis-v2
// 4 ECharts charts:
//  (A) code-composition pie
//  (B) feature-categories bar
//  (C) theme-contrast bar (WCAG AA)
//  (D) template-density scatter (info-density vs visual-decoration)
(function () {
  var style = getComputedStyle(document.documentElement);
  var accent  = style.getPropertyValue('--accent').trim()  || '#2563eb';
  var accent2 = style.getPropertyValue('--accent2').trim() || '#7c3aed';
  var ink     = style.getPropertyValue('--ink').trim()     || '#0f172a';
  var muted   = style.getPropertyValue('--muted').trim()   || '#64748b';
  var rule    = style.getPropertyValue('--rule').trim()    || '#e2e8f0';
  var bg2     = style.getPropertyValue('--bg2').trim()     || '#ffffff';

  // -------- A: code composition pie --------
  var chA = echarts.init(document.getElementById('chart-code-composition'), null, {renderer:'svg'});
  var pieData = [
    { value:4.30, name:'FontAwesome 6.5 字体 base64 (3 套 woff2+ttf)' },
    { value:2.00, name:'主逻辑脚本 (~4.7MB 代码)' },
    { value:1.40, name:'html2canvas.js (~1.4MB DOM截屏)' },
    { value:0.88, name:'jsPDF + html2pdf wrapper (~0.9MB PDF编码)' },
    { value:0.55, name:'FontAwesome all.min.css + 3 墨水素材 base64' },
    { value:1.20, name:'CSS 样式 (31模板 x 22头像 x 颜色变量) + HTML骨架' },
    { value:1.67, name:'其他（重复冗余/注释/数据结构定义）' }
  ];
  chA.setOption({
    animation:false,
    title:{ text:'12 MB 单文件构成', left:'center', top:6, textStyle:{ fontSize:15, fontWeight:700, color:ink } },
    tooltip:{ trigger:'item', formatter:'{b}<br/>{c} MB ({d}%)' },
    legend:{ bottom:4, textStyle:{ fontSize:11, color:muted }, type:'scroll' },
    color:[ accent, accent2, '#10b981', '#f59e0b', '#ef4444', muted, '#06b6d4', '#ec4899' ],
    series:[{
      name:'构成', type:'pie', radius:['38%','70%'], center:['50%','52%'], avoidLabelOverlap:true,
      itemStyle:{ borderColor:bg2, borderWidth:2, borderRadius:4 },
      label:{ fontSize:11, color:ink, formatter:'{b}\n{d}%' },
      labelLine:{ length:8, length2:8 },
      data: pieData
    }]
  });
  window.addEventListener('resize', function(){ chA.resize(); });

  // -------- B: feature categories bar --------
  var chB = echarts.init(document.getElementById('chart-feature-categories'), null, {renderer:'svg'});
  chB.setOption({
    animation:false,
    title:{ text:'功能全景：4 大类 x 子功能数量', left:'center', top:6, textStyle:{ fontSize:15, fontWeight:700, color:ink } },
    tooltip:{ trigger:'axis', axisPointer:{type:'shadow'} },
    grid:{ left:110, right:30, top:52, bottom:28 },
    xAxis:{ type:'value', name:'子功能项数', nameTextStyle:{color:muted, fontSize:11}, axisLabel:{color:muted,fontSize:11}, splitLine:{lineStyle:{color:rule}} },
    yAxis:{ type:'category',
      data:[
        'D 效率与协作',
        'C 导出与分享',
        'B 视觉定制',
        'A 内容编辑'
      ],
      axisLabel:{ color:ink, fontSize:12, fontWeight:600 }
    },
    series:[{
      type:'bar', barWidth:20,
      itemStyle:{ borderRadius:[0,8,8,0],
        color:{ type:'linear', x:0,y:0,x2:1,y2:0,
          colorStops:[{offset:0,color:accent2},{offset:1,color:accent}] }
      },
      label:{ show:true, position:'right', fontSize:12, fontWeight:700, color:accent,
        formatter:function(p){return p.value + ' 项';} },
      data:[ { value:21 }, { value:18 }, { value:34 }, { value:47 } ]
    }]
  });
  window.addEventListener('resize', function(){ chB.resize(); });

  // -------- C: theme contrast bar (WCAG AA 4.5:1 line) --------
  var themes = [
    { name:'梦幻紫',  text:'#1f2937', bg:'#ffffff', primary:'#7c3aed' },
    { name:'深海蓝',  text:'#1f2937', bg:'#ffffff', primary:'#2563eb' },
    { name:'玫瑰粉',  text:'#1f2937', bg:'#ffffff', primary:'#db2777' },
    { name:'薄荷绿',  text:'#1f2937', bg:'#ffffff', primary:'#059669' },
    { name:'活力橙',  text:'#1f2937', bg:'#ffffff', primary:'#ea580c' },
    { name:'极光蓝',  text:'#1f2937', bg:'#ffffff', primary:'#0891b2' },
    { name:'星空紫',  text:'#1f2937', bg:'#ffffff', primary:'#6366f1' }
  ];
  function lum(h) {
    h = h.replace('#','');
    var r = parseInt(h.substring(0,2),16)/255;
    var g = parseInt(h.substring(2,4),16)/255;
    var b = parseInt(h.substring(4,6),16)/255;
    function ch(c){ return c<=0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); }
    return 0.2126*ch(r) + 0.7152*ch(g) + 0.0722*ch(b);
  }
  function contrastRatio(hex1, hex2) {
    var l1 = lum(hex1), l2 = lum(hex2);
    var L1 = Math.max(l1,l2), L2 = Math.min(l1,l2);
    return (L1+0.05)/(L2+0.05);
  }
  var chC = echarts.init(document.getElementById('chart-theme-contrast'), null, {renderer:'svg'});
  var textData = [];
  var primData = [];
  var aaLine = [];
  for (var i=0; i<themes.length; i++) {
    textData.push( +contrastRatio(themes[i].text, themes[i].bg).toFixed(2) );
    primData.push( +contrastRatio(themes[i].primary, themes[i].bg).toFixed(2) );
    aaLine.push(4.5);
  }
  chC.setOption({
    animation:false,
    title:{ text:'7 主题色 正文/标题 vs 白底 对比率 (WCAG AA >= 4.5:1)', left:'center', top:6,
      textStyle:{ fontSize:14, fontWeight:700, color:ink } },
    legend:{ data:['正文 #1f2937 vs 白底','主色 vs 白底'], bottom:4, textStyle:{color:muted,fontSize:11} },
    tooltip:{ trigger:'axis', axisPointer:{type:'shadow'}, formatter:function(ps){
      var out = ps[0].axisValue + '<br/>';
      for (var j=0; j<ps.length; j++) {
        out += ps[j].marker + ps[j].seriesName + ': <b>' + ps[j].value.toFixed(2) + ':1</b><br/>';
      }
      out += '<span style="color:'+muted+'">合格线 4.5:1 (WCAG AA)</span>';
      return out;
    }},
    grid:{ left:52, right:24, top:44, bottom:44 },
    xAxis:{ type:'category', data:themes.map(function(t){return t.name;}),
      axisLabel:{ color:ink, fontSize:11, rotate:0 } },
    yAxis:{ type:'value', name:'对比率', nameTextStyle:{color:muted,fontSize:11},
      axisLabel:{ color:muted, fontSize:11, formatter:'{value}:1' },
      splitLine:{ lineStyle:{color:rule}}, min:0, max:22 },
    series:[
      { name:'正文 #1f2937 vs 白底', type:'bar', barWidth:16,
        itemStyle:{ color:'#475569', borderRadius:[4,4,0,0] },
        label:{ show:true, position:'top', formatter:function(p){return p.value.toFixed(1)+':1';}, color:muted, fontSize:10, fontWeight:600 },
        data: textData },
      { name:'主色 vs 白底', type:'bar', barWidth:16,
        itemStyle:{ color:accent, borderRadius:[4,4,0,0] },
        label:{ show:true, position:'top', formatter:function(p){return p.value.toFixed(1)+':1';}, color:accent, fontSize:10, fontWeight:700 },
        data: primData },
      { name:'WCAG AA 合格线 4.5:1', type:'line', lineStyle:{ color:'#dc2626', type:'dashed', width:2 },
        symbol:'none', z:100,
        label:{ show:true, formatter:'AA 4.5:1', position:'insideEndTop', color:'#dc2626', fontSize:11, fontWeight:700 },
        data: aaLine }
    ]
  });
  window.addEventListener('resize', function(){ chC.resize(); });

  // -------- D: template density scatter --------
  var tmplPoints = [
    {name:'classic 经典左右分栏',       x:8.0, y:2.5, cat:'分栏'},
    {name:'elegant 左侧窄栏',           x:8.5, y:2.0, cat:'分栏'},
    {name:'professional 左侧宽栏',       x:7.5, y:4.0, cat:'分栏'},
    {name:'business-pro 商务精英',       x:7.0, y:5.5, cat:'分栏'},
    {name:'split 左右等分',              x:7.5, y:3.0, cat:'分栏'},
    {name:'light-shadow 光影侧栏',       x:7.0, y:8.5, cat:'分栏'},
    {name:'terracotta 陶土暖色',         x:7.0, y:6.5, cat:'分栏'},
    {name:'swiss 瑞士风',                x:9.0, y:1.5, cat:'简约'},
    {name:'clean 简约清爽',              x:9.0, y:1.0, cat:'简约'},
    {name:'champion-blue 冠军蓝横幅',     x:7.5, y:7.5, cat:'横幅'},
    {name:'lucky-red 鸿运红横幅',        x:7.5, y:7.5, cat:'横幅'},
    {name:'timeline 时间轴',             x:7.0, y:5.0, cat:'时间轴'},
    {name:'timeline-pro 专业时间轴',      x:6.5, y:6.0, cat:'时间轴'},
    {name:'aurora 极光动效',             x:5.5, y:9.5, cat:'动效'}
  ];
  var catColor = { '分栏':accent, '简约':muted, '横幅':'#f59e0b', '时间轴':'#10b981', '动效':accent2 };
  // Build series explicitly (not inline concat) for JS parser compatibility
  var seriesD = [];
  // 3 markArea first (colored background regions)
  seriesD.push({
    type:'scatter', name:'适合 技术理工岗', symbolSize:0, silent:true,
    markArea:{ silent:true, itemStyle:{ color:'rgba(37,99,235,0.06)' },
      data:[ [{coord:[7.5,0]},{coord:[10,5.5]}] ]
    },
    data:[]
  });
  seriesD.push({
    type:'scatter', name:'适合 创意设计市场岗', symbolSize:0, silent:true,
    markArea:{ silent:true, itemStyle:{ color:'rgba(124,58,237,0.06)' },
      data:[ [{coord:[4,5]},{coord:[7.5,10]}] ]
    },
    data:[]
  });
  seriesD.push({
    type:'scatter', name:'适合 咨询金融商务岗', symbolSize:0, silent:true,
    markArea:{ silent:true, itemStyle:{ color:'rgba(245,158,11,0.06)' },
      data:[ [{coord:[6.5,3]},{coord:[9,7]}] ]
    },
    data:[]
  });
  // Group by category
  var byCat = {};
  for (var k=0; k<tmplPoints.length; k++) {
    var pt = tmplPoints[k];
    if (!byCat[pt.cat]) byCat[pt.cat] = [];
    byCat[pt.cat].push(pt);
  }
  var catKeys = Object.keys(byCat);
  for (var m=0; m<catKeys.length; m++) {
    var cat = catKeys[m];
    var arr = byCat[cat];
    var scatterData = [];
    for (var n=0; n<arr.length; n++) {
      scatterData.push({ value:[arr[n].x, arr[n].y], name:arr[n].name });
    }
    function mkLabel(catName) {
      return function(p) {
        return p.data.name.replace(/ .*/, '');
      };
    }
    seriesD.push({
      name:cat, type:'scatter',
      symbolSize: function(v){ return 12 + v[0]*0.6 + v[1]*0.8; },
      itemStyle:{ color: catColor[cat], opacity:0.85, borderColor:'#ffffff', borderWidth:1.5 },
      label:{ show:true, formatter: mkLabel(cat),
        position:'top', fontSize:10, color:ink, fontWeight:600 },
      data: scatterData
    });
  }
  var chD = echarts.init(document.getElementById('chart-template-density'), null, {renderer:'svg'});
  chD.setOption({
    animation:false,
    title:{ text:'14 代表模板：信息密度 vs 视觉装饰度（岗位适配参考）', left:'center', top:6, textStyle:{fontSize:14,fontWeight:700,color:ink} },
    legend:{ bottom:4, textStyle:{fontSize:11, color:muted} },
    tooltip:{ formatter:function(p){
      if (p.seriesType==='scatter' && p.data && p.data.name) {
        return p.data.name+'<br/>信息密度: '+p.value[0]+' / 10<br/>视觉装饰: '+p.value[1]+' / 10';
      }
      return p.seriesName;
    }},
    grid:{ left:60, right:30, top:44, bottom:44 },
    xAxis:{ type:'value', name:'信息密度', min:4, max:10,
      nameTextStyle:{color:muted,fontSize:11}, axisLabel:{color:muted,fontSize:11}, splitLine:{lineStyle:{color:rule}} },
    yAxis:{ type:'value', name:'视觉装饰度', min:0, max:10,
      nameTextStyle:{color:muted,fontSize:11}, axisLabel:{color:muted,fontSize:11}, splitLine:{lineStyle:{color:rule}} },
    series: seriesD
  });
  window.addEventListener('resize', function(){ chD.resize(); });

  // ========================================================================
  // (E) 22919 行代码构成分布（行数饼）§10.1
  // ========================================================================
  var chE = document.getElementById('chart-code-line-dist');
  if (chE) {
    chE = echarts.init(chE, null, {renderer:'svg'});
    chE.setOption({
      animation:false,
      title:{ text:'22919 行代码构成（按行数，非文件大小）', left:'center', top:6, textStyle:{fontSize:14,fontWeight:700,color:ink} },
      tooltip:{ trigger:'item', formatter:'{b}<br/>{c} 行 ({d}%)' },
      legend:{ bottom:4, textStyle:{fontSize:11,color:muted} },
      color:[ accent, accent2, '#10b981', '#f59e0b', '#6b7280', '#ec4899' ],
      series:[{
        name:'行数构成', type:'pie', radius:['40%','72%'], center:['50%','52%'],
        itemStyle:{ borderColor:bg2, borderWidth:2, borderRadius:4 },
        label:{ fontSize:11, color:ink, formatter:'{b}\n{c}行 ({d}%)' },
        labelLine:{ length:8, length2:8 },
        data:[
          { value:17867, name:'JS 逻辑代码' },
          { value:2789,  name:'CSS 样式代码' },
          { value:1136,  name:'空行' },
          { value:1105,  name:'JS 注释（含块注释）' },
          { value:16,    name:'HTML 骨架' },
          { value:6,     name:'HTML 注释' }
        ]
      }]
    });
    window.addEventListener('resize', function(){ chE.resize(); });
  }

  // ========================================================================
  // (F) 164 函数长度分布柱状 §10.2
  // ========================================================================
  var chF = document.getElementById('chart-func-length');
  if (chF) {
    chF = echarts.init(chF, null, {renderer:'svg'});
    chF.setOption({
      animation:false,
      title:{ text:'164 函数长度分布（71% ≤ 20 行，6 个 ≥ 100 行需重构）', left:'center', top:6, textStyle:{fontSize:14,fontWeight:700,color:ink} },
      tooltip:{ trigger:'axis', axisPointer:{type:'shadow'}, formatter:function(p){
        p = p[0]; return p.name+' 档：'+p.value+' 个函数<br/>占比：'+(p.value/164*100).toFixed(1)+'%';
      }},
      grid:{ left:60, right:30, top:52, bottom:40 },
      xAxis:{ type:'category',
        data:['0~20 行','20~50 行','50~100 行','100~200 行','200~500 行','≥ 500 行'],
        axisLabel:{ color:ink, fontSize:11, fontWeight:600 }
      },
      yAxis:{ type:'value', name:'函数数量', nameTextStyle:{color:muted,fontSize:11}, axisLabel:{color:muted,fontSize:11}, splitLine:{lineStyle:{color:rule}} },
      series:[{
        name:'函数数', type:'bar', barWidth:'60%',
        itemStyle:{
          color: function(p){
            var cs = [ '#10b981','#22c55e','#f59e0b','#ef4444','#dc2626','#991b1b' ];
            return cs[p.dataIndex];
          },
          borderRadius:[6,6,0,0]
        },
        label:{ show:true, position:'top',
          formatter:function(p){ return p.value + ' 个 ('+(p.value/164*100).toFixed(0)+'%)'; },
          color:ink, fontSize:11, fontWeight:700
        },
        data:[ 116, 34, 8, 4, 2, 0 ]
      }]
    });
    window.addEventListener('resize', function(){ chF.resize(); });
  }

  // ========================================================================
  // (G) 存储占用风险对比条 §10.3
  // ========================================================================
  var chG = document.getElementById('chart-storage-risk');
  if (chG) {
    chG = echarts.init(chG, null, {renderer:'svg'});
    chG.setOption({
      animation:false,
      title:{ text:'localStorage 5MB 配额 · 3 场景占用对比（红线是配额）', left:'center', top:6, textStyle:{fontSize:14,fontWeight:700,color:ink} },
      tooltip:{ trigger:'axis', axisPointer:{type:'shadow'}, formatter:function(p){
        var s = '';
        for (var i=0;i<p.length;i++){
          if (p[i].seriesType==='bar') s += p[i].marker + p[i].seriesName + '：' + p[i].value + ' KB (' + (p[i].value/5120*100).toFixed(1) + '%)<br/>';
          else s += p[i].marker + p[i].seriesName + '：' + p[i].value + ' KB<br/>';
        }
        return s;
      }},
      legend:{ bottom:4, textStyle:{fontSize:11,color:muted} },
      grid:{ left:120, right:40, top:52, bottom:52 },
      xAxis:{ type:'value', name:'KB ( 5MB = 5120 KB = 红线位置 )', max:7600,
        nameTextStyle:{color:muted,fontSize:11}, axisLabel:{color:muted,fontSize:11}, splitLine:{lineStyle:{color:rule}},
        markLine:{ silent:true, data:[{xAxis:5120, lineStyle:{color:'#dc2626', width:2, type:'dashed'}, label:{formatter:'5MB 配额 5120 KB', color:'#dc2626'}}] }
      },
      yAxis:{ type:'category',
        data:['😌 安全：默认 D + 撤销栈 30 条（无头像）',
              '😰 紧张：D 含 1 张压缩头像 250KB + 撤销',
              '💥 爆仓：D 高清头像 800KB + 横幅 800KB + 撤销'],
        axisLabel:{ color:ink, fontSize:11.5, fontWeight:600, width:200, overflow:'truncate' }
      },
      series:[
        { name:'纯文本数据 D', type:'bar', stack:'s', itemStyle:{color:'#93c5fd',borderRadius:[0,0,0,0]},
          data:[ 200, 200, 200 ], barWidth:30 },
        { name:'撤销栈 30 条 × 20KB', type:'bar', stack:'s', itemStyle:{color:accent},
          data:[ 600, 600, 600 ] },
        { name:'D.avatar 头像 base64', type:'bar', stack:'s', itemStyle:{color:accent2},
          data:[ 0, 250, 800 ] },
        { name:'D.headerImage 横幅等其他', type:'bar', stack:'s', itemStyle:{color:'#f97316',borderRadius:[0,6,6,0]},
          data:[ 0, 0, 800 ] },
        { name:'5MB 配额线', type:'scatter', symbolSize:0, silent:true,
          markLine:{ silent:true, symbol:'none',
            lineStyle:{color:'#dc2626', width:2.5, type:'solid'},
            label:{ formatter:'5MB = 5120 KB (爆仓 = 超过它)', position:'end', color:'#dc2626', fontWeight:700, fontSize:11.5 },
            data:[{ xAxis:5120 }]
          },
          data:[]
        }
      ]
    });
    window.addEventListener('resize', function(){ chG.resize(); });
  }

  // ========================================================================
  // (H) v1→v5 演进决策时间线（甘特式条形图）§11
  // ========================================================================
  var chH = document.getElementById('chart-evolution-timeline');
  if (chH) {
    chH = echarts.init(chH, null, {renderer:'svg'});
    // 条形：阶段（纵） × 关键事件在阶段内的开始-结束位置百分比
    var stageColors = {
      'v1.0~v2.0 MVP 阶段':'#93c5fd',
      'v3.0 设计膨胀期':'#fcd34d',
      'v4.0 架构稳定期':'#86efac',
      'v5.0 工程化完善期':accent2
    };
    chH.setOption({
      animation:false,
      title:{ text:'v1.0 ~ v5.0 技术决策时间线（4 阶段 × 关键分叉点，绿=事后回头看正确，红=踩坑欠债）',
        left:'center', top:6, textStyle:{fontSize:13,fontWeight:700,color:ink} },
      tooltip:{ trigger:'axis', axisPointer:{type:'shadow'},
        formatter:function(p){
          p = p[0];
          if (!p || !p.data || !p.data.name) return '';
          return '<b>'+p.data.stage+'</b> · '+p.data.name+'<br/>' +
                 '决策内容：'+p.data.decision+'<br/>' +
                 '事后评价：'+p.data.verdict+'<br/>' +
                 '阶段位置：'+(p.value[0]*1).toFixed(0)+'% → '+(p.value[1]*1).toFixed(0)+'%';
        }
      },
      grid:{ left:190, right:30, top:52, bottom:40 },
      xAxis:{ type:'value', min:0, max:100,
        name:'阶段内进度（%）', nameTextStyle:{color:muted,fontSize:11},
        axisLabel:{ color:muted, fontSize:11, formatter:'{value}%' }, splitLine:{lineStyle:{color:rule}}
      },
      yAxis:{ type:'category',
        data:['v5.0 工程化完善期','v4.0 架构稳定期','v3.0 设计膨胀期','v1.0~v2.0 MVP 阶段'],
        axisLabel:{ color:ink, fontSize:12, fontWeight:700 }
      },
      series:[{
        name:'阶段底色', type:'custom', renderItem:function(params, api){
          var y = api.coord([0, api.value(1)]);
          var y2 = api.coord([0, api.value(1)-0.5]);
          var width = api.coord([100,0])[0] - api.coord([0,0])[0];
          return {
            type:'rect',
            shape:{ x:api.coord([0,0])[0], y:y2[1] + 4, width:width, height:Math.max(20, y[1]-y2[1]-8) },
            style:{ fill:stageColors[api.value(2)] || rule, opacity:0.22 }
          };
        },
        encode:{ y:1 },
        data:[
          { value:[0, 0, 'v1.0~v2.0 MVP 阶段'] },
          { value:[0, 1, 'v3.0 设计膨胀期'] },
          { value:[0, 2, 'v4.0 架构稳定期'] },
          { value:[0, 3, 'v5.0 工程化完善期'] }
        ],
        z:0
      },{
        name:'关键决策', type:'custom',
        renderItem:function(params, api){
          var x1 = api.coord([api.value(0), api.value(2)])[0];
          var x2 = api.coord([api.value(1), api.value(2)])[0];
          var y  = api.coord([0, api.value(2)-0.5])[1];
          var h  = 14;
          var ok = api.value(3) == 1;
          return {
            type:'rect',
            shape:{ x:x1, y:y - h/2, width:Math.max(8, x2-x1), height:h },
            style:{ fill: ok ? '#10b981' : '#ef4444', stroke:'#fff', lineWidth:1.5, opacity:0.88, borderRadius:3 }
          };
        },
        encode:{ x:[0,1], y:2 },
        label:{ show:true, position:'right', color:ink, fontSize:10.5, fontWeight:600,
          formatter:function(p){ return p.data.name; }
        },
        data:[
          // y = 0 → v1.0~v2.0
          { value:[2,22,0,1], name:'✅ 单文件 index.html', stage:'v1.0~v2.0', decision:'不选 Vite/React/npm，双击就能用', verdict:'完全正确，1 号护城河' },
          { value:[28,48,0,1], name:'✅ html2canvas + jsPDF', stage:'v1.0~v2.0', decision:'不选 Puppeteer（毁离线）', verdict:'正确，后续 onclone 管线的基础' },
          { value:[52,72,0,0], name:'❌ img width/height=100%', stage:'v1.0~v2.0', decision:'头像用 img，wrap 没强制方', verdict:'踩坑 → 产生 DF-001~DF-003 变形' },
          { value:[78,98,0,0], name:'❌ FA/Google CDN 外链', stage:'v1.0~v2.0', decision:'想当然以为有网', verdict:'打脸 → 产生 FF-004 离线白屏' },

          // y = 1 → v3.0
          { value:[2,20,1,1], name:'✅ 31 模板 × 22 头像', stage:'v3.0 设计膨胀期', decision:'用户要「选就完了」', verdict:'方向对，但实现方式错' },
          { value:[24,44,1,0], name:'❌ 31 模板 CSS 复制粘贴', stage:'v3.0 设计膨胀期', decision:'赶时间，不抽公共 class', verdict:'欠债 → 改一处 ×31 维护成本' },
          { value:[50,70,1,0], name:'❌ PDF.save() 黑盒', stage:'v3.0 设计膨胀期', decision:'不读文档，省事', verdict:'欠债 → DF-004/DF-005 导出变形' },
          { value:[76,96,1,0], name:'❌ MAX_HISTORY=200', stage:'v3.0 设计膨胀期', decision:'想做「无限撤销」', verdict:'欠债 → DF-001 爆仓 5MB' },

          // y = 2 → v4.0（架构稳定期，全绿）
          { value:[2,22,2,1], name:'✅ 头像三层强制方形', stage:'v4.0 架构稳定期', decision:'wrap→face 1:1→bg-div cover', verdict:'彻底根治头像变形 3 个缺陷' },
          { value:[26,46,2,1], name:'✅ 零 CDN 全内联 base64', stage:'v4.0 架构稳定期', decision:'FA 6.5 woff2+ttf 全内联', verdict:'代价=12MB，永远可用赢了' },
          { value:[50,66,2,1], name:'✅ 撤销栈跳 base64', stage:'v4.0 架构稳定期', decision:'30 条 + pushUndoState 不存头像', verdict:'根治 DF-003，丢「切头像撤销」可接受' },
          { value:[70,98,2,1], name:'✅ PDF onclone 12 段管线', stage:'v4.0 架构稳定期', decision:'弃 save() → onclone + blob 三层兜底', verdict:'PDF 导出三大缺陷一次根治' },

          // y = 3 → v5.0
          { value:[2,18,3,1], name:'✅ 泼墨/糊/横线修复', stage:'v5.0 工程化完善期', decision:'FX-14/15/16 专项回归', verdict:'可用度从 80% → 95%' },
          { value:[24,48,3,1], name:'✅ 5 维简历评分 + 雷达', stage:'v5.0 工程化完善期', decision:'手写 Canvas 雷达不引 ECharts', verdict:'不增体积 + 差异化亮点' },
          { value:[54,72,3,1], name:'✅ TXT 启发式导入', stage:'v5.0 工程化完善期', decision:'正则解析 10 模块，不完美但可用', verdict:'大幅降低空白起填门槛' },
          { value:[78,98,3,0], name:'⚠️ 6 件事仍欠着', stage:'v5.0 工程化完善期', decision:'爆仓try/catch/AI/移动端/DOCX/超长函数', verdict:'→ §6 L2/L3 下一步' }
        ]
      }]
    });
    window.addEventListener('resize', function(){ chH.resize(); });
  }

})();
