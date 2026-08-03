// assets/charts.js for resume-code-optimization-analysis
// 5 ECharts charts:
//  (A) code-composition pie (12MB)
//  (B) function-complexity scatter (CC vs lines)
//  (C) CC before/after bar
//  (D) ROI scatter (hours vs benefit vs risk)
//  (E) function length distribution
(function () {
  var style = getComputedStyle(document.documentElement);
  var accent  = style.getPropertyValue('--accent').trim()  || '#4338ca';
  var accent2 = style.getPropertyValue('--accent2').trim() || '#c026d3';
  var ink     = style.getPropertyValue('--ink').trim()     || '#0b1220';
  var muted   = style.getPropertyValue('--muted').trim()   || '#475569';
  var rule    = style.getPropertyValue('--rule').trim()    || 'rgba(99,102,241,0.18)';
  var bg2     = style.getPropertyValue('--bg2').trim()     || 'rgba(255,255,255,0.78)';

  // -------- (A) Code composition pie --------
  var chA = echarts.init(document.getElementById('chart-code-composition'), null, {renderer:'svg'});
  chA.setOption({
    animation:false,
    title:{ text:'12 MB 单文件构成明细', left:'center', top:6, textStyle:{ fontSize:15, fontWeight:700, color:ink } },
    tooltip:{ trigger:'item', formatter:'{b}<br/>{c} MB ({d}%)' },
    legend:{ bottom:4, textStyle:{ fontSize:11, color:muted }, type:'scroll' },
    color:[ accent, accent2, '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#8b5cf6' ],
    series:[{
      name:'构成', type:'pie', radius:['38%','70%'], center:['50%','52%'], avoidLabelOverlap:true,
      itemStyle:{ borderColor:bg2, borderWidth:2, borderRadius:4 },
      label:{ fontSize:11, color:ink, formatter:'{b}\n{d}%' },
      labelLine:{ length:8, length2:8 },
      data:[
        { value:4.30, name:'FontAwesome 6.5 字体 base64' },
        { value:4.70, name:'主逻辑脚本 (HTML+CSS+JS)' },
        { value:1.40, name:'html2canvas.js (~1.4MB DOM截屏)' },
        { value:0.70, name:'jsPDF + html2pdf wrapper' },
        { value:2.00, name:'CSS 样式 (31模板+22头像+7色)' },
        { value:0.80, name:'HTML 骨架' },
        { value:0.10, name:'其他 (注释/数据定义)' }
      ]
    }]
  });
  window.addEventListener('resize', function(){ chA.resize(); });

  // -------- (B) Function complexity scatter (CC x lines) --------
  var top20Funcs = [
    { name:'applyCustomStyle', cc:289, lines:1187 },
    { name:'exportPDF', cc:72, lines:1337 },
    { name:'parseTXTResume', cc:70, lines:620 },
    { name:'renderTemplate', cc:48, lines:412 },
    { name:'applyAvatarStyle', cc:36, lines:285 },
    { name:'updatePreview', cc:31, lines:198 },
    { name:'handleUndoRedo', cc:28, lines:176 },
    { name:'buildPDFPipeline', cc:26, lines:310 },
    { name:'generateRadarChart', cc:24, lines:155 },
    { name:'parseDOCX', cc:22, lines:132 },
    { name:'applyColorTheme', cc:20, lines:118 },
    { name:'exportImage', cc:19, lines:204 },
    { name:'validateForm', cc:18, lines:87 },
    { name:'initEditor', cc:17, lines:156 },
    { name:'handleResize', cc:16, lines:72 },
    { name:'renderSkillBar', cc:15, lines:64 },
    { name:'applyFontSettings', cc:14, lines:93 },
    { name:'toggleMobileMenu', cc:13, lines:48 },
    { name:'saveToLocalStorage', cc:12, lines:55 },
    { name:'loadTemplate', cc:11, lines:76 }
  ];
  var scatterData = [];
  var ccThreshold300 = []; var ccThreshold50 = []; var ccThreshold20 = [];
  for (var i=0; i<top20Funcs.length; i++) {
    var f = top20Funcs[i];
    scatterData.push({ value:[f.lines, f.cc], name:f.name });
  }

  var chB = echarts.init(document.getElementById('chart-function-complexity'), null, {renderer:'svg'});
  chB.setOption({
    animation:false,
    title:{ text:'TOP20 函数圈复杂度 x 行数分布', left:'center', top:6, textStyle:{ fontSize:15, fontWeight:700, color:ink } },
    tooltip:{ formatter:function(p){
      if (p.data && p.data.name) return '<b>'+p.data.name+'</b><br/>行数: '+p.value[0]+' | 圈复杂度: '+p.value[1];
      return '';
    }},
    legend:{ bottom:4, textStyle:{ fontSize:11, color:muted } },
    grid:{ left:60, right:30, top:44, bottom:44 },
    xAxis:{ type:'value', name:'函数行数 (lines)', min:0, max:1400,
      nameTextStyle:{color:muted,fontSize:11}, axisLabel:{color:muted,fontSize:11}, splitLine:{lineStyle:{color:rule}} },
    yAxis:{ type:'value', name:'圈复杂度 (CC)', min:0, max:320,
      nameTextStyle:{color:muted,fontSize:11}, axisLabel:{color:muted,fontSize:11}, splitLine:{lineStyle:{color:rule}} },
    series:[{
      type:'scatter', symbolSize:function(v){ return 8 + v[0]*0.015 + v[1]*0.04; },
      itemStyle:{ color:accent, opacity:0.85, borderColor:'#fff', borderWidth:1.5 },
      label:{ show:true, formatter:function(p){ return p.data.name.replace(/^(.{10}).*/,'$1...'); }, position:'top', fontSize:10, color:ink, fontWeight:600 },
      data: scatterData,
      markArea:{
        silent:true,
        data:[
          [{coord:[0,50]},{coord:[1400,300], itemStyle:{color:'rgba(239,68,68,0.12)'}}],
          [{coord:[0,20]},{coord:[1400,50], itemStyle:{color:'rgba(245,158,11,0.10)'}}]
        ]
      },
      markLine:{
        silent:true,
        data:[
          { yAxis:289, lineStyle:{color:'#dc2626',type:'dashed',width:1.5}, label:{formatter:'CC=289',color:'#dc2626',fontSize:10} },
          { yAxis:50, lineStyle:{color:'#f59e0b',type:'dashed',width:1}, label:{formatter:'CC=50 警戒线',color:'#f59e0b',fontSize:10} },
          { yAxis:10, lineStyle:{color:'#10b981',type:'dashed',width:1}, label:{formatter:'CC=10 健康线',color:'#10b981',fontSize:10} }
        ]
      }
    }]
  });
  window.addEventListener('resize', function(){ chB.resize(); });

  // -------- (C) CC before/after comparison bar --------
  var chC = echarts.init(document.getElementById('chart-cc-comparison'), null, {renderer:'svg'});
  chC.setOption({
    animation:false,
    title:{ text:'三大重灾区函数圈复杂度优化前后对比', left:'center', top:6, textStyle:{ fontSize:15, fontWeight:700, color:ink } },
    tooltip:{ trigger:'axis', axisPointer:{type:'shadow'}, formatter:function(ps){
      var s = ps[0].axisValue + '<br/>';
      for (var j=0;j<ps.length;j++) s += ps[j].marker + ps[j].seriesName + ': <b>' + ps[j].value + '</b><br/>';
      return s + '降幅: <b>' + ((ps[0].value - ps[1].value)/(ps[0].value||1)*100).toFixed(1) + '%</b>';
    }},
    legend:{ bottom:4, textStyle:{ fontSize:11, color:muted } },
    grid:{ left:60, right:40, top:44, bottom:44 },
    xAxis:{ type:'category', data:['applyCustomStyle','exportPDF','parseTXTResume'],
      axisLabel:{ color:ink, fontSize:12, fontWeight:600 } },
    yAxis:{ type:'value', name:'圈复杂度', min:0, max:320,
      nameTextStyle:{color:muted,fontSize:11}, axisLabel:{color:muted,fontSize:11}, splitLine:{lineStyle:{color:rule}} },
    series:[
      { name:'优化前', type:'bar', barWidth:24,
        itemStyle:{ color:'#ef4444', borderRadius:[4,4,0,0] },
        label:{ show:true, position:'top', formatter:function(p){return p.value;}, color:'#ef4444', fontSize:12, fontWeight:700 },
        data:[289, 72, 70] },
      { name:'优化后', type:'bar', barWidth:24,
        itemStyle:{ color:'#10b981', borderRadius:[4,4,0,0] },
        label:{ show:true, position:'top', formatter:function(p){return p.value;}, color:'#10b981', fontSize:12, fontWeight:700 },
        data:[12, 18, 15] }
    ]
  });
  window.addEventListener('resize', function(){ chC.resize(); });

  // -------- (D) ROI scatter --------
  var roiItems = [
    { name:'IndexedDB 降级方案', hours:8, benefit:95, risk:10, cat:'P0 存储' },
    { name:'dispatch table 重构', hours:24, benefit:80, risk:20, cat:'P1 重构' },
    { name:'PDF scale 策略优化', hours:12, benefit:70, risk:15, cat:'P1 性能' },
    { name:'CSS 公共样式提取', hours:16, benefit:60, risk:10, cat:'P2 维护' },
    { name:'虚拟列表渲染', hours:20, benefit:50, risk:25, cat:'P2 性能' },
    { name:'onclone 管线精简', hours:8, benefit:55, risk:12, cat:'P1 性能' },
    { name:'移动端适配完善', hours:16, benefit:75, risk:18, cat:'P1 体验' },
    { name:'撤销栈增量更新', hours:6, benefit:45, risk:8, cat:'P2 体验' },
    { name:'错误边界 Error Boundary', hours:10, benefit:50, risk:15, cat:'P1 健壮' },
    { name:'DOCX 真导出', hours:40, benefit:65, risk:30, cat:'L3 新增' },
    { name:'AI 简历优化接入', hours:32, benefit:85, risk:35, cat:'L3 新增' },
    { name:'Puppeteer PDF 导出', hours:24, benefit:60, risk:28, cat:'L3 新增' }
  ];
  var catColor2 = {
    'P0 存储':accent, 'P1 重构':accent2, 'P1 性能':'#10b981',
    'P2 维护':'#f59e0b', 'P2 性能':'#f59e0b', 'P2 体验':'#f59e0b',
    'P1 健壮':accent2, 'P1 体验':accent2, 'L3 新增':'#ef4444'
  };
  var byCat2 = {};
  for (var k=0; k<roiItems.length; k++) {
    var it = roiItems[k];
    if (!byCat2[it.cat]) byCat2[it.cat] = [];
    byCat2[it.cat].push(it);
  }
  var seriesD = [];
  var catKeys = Object.keys(byCat2);
  for (var m=0; m<catKeys.length; m++) {
    var cat = catKeys[m];
    var arr = byCat2[cat];
    var sdata = [];
    for (var n=0; n<arr.length; n++) {
      sdata.push({ value:[arr[n].hours, arr[n].benefit, arr[n].risk], name:arr[n].name });
    }
    seriesD.push({
      name:cat, type:'scatter',
      symbolSize: function(v){ return 10 + v[2]*0.25; },
      itemStyle:{ color: catColor2[cat], opacity:0.8, borderColor:'#fff', borderWidth:1.5 },
      label:{ show:true, formatter:function(p){return p.data.name.replace(/^(.{8}).*/,'$1...');}, position:'top', fontSize:10, color:ink, fontWeight:600 },
      data: sdata
    });
  }
  var chD = echarts.init(document.getElementById('chart-roi-scatter'), null, {renderer:'svg'});
  chD.setOption({
    animation:false,
    title:{ text:'优化策略 ROI 评估: 工时(h) x 收益(分) x 风险(气泡大小)', left:'center', top:6, textStyle:{fontSize:14,fontWeight:700,color:ink} },
    legend:{ bottom:4, textStyle:{fontSize:11, color:muted} },
    tooltip:{ formatter:function(p){
      if (p.seriesType==='scatter' && p.data && p.data.name) {
        return '<b>'+p.data.name+'</b><br/>工时: '+p.value[0]+'h<br/>收益: '+p.value[1]+'/100<br/>风险: '+p.value[2]+'/100';
      }
      return p.seriesName;
    }},
    grid:{ left:60, right:30, top:44, bottom:44 },
    xAxis:{ type:'value', name:'工时 (小时)', min:0, max:50,
      nameTextStyle:{color:muted,fontSize:11}, axisLabel:{color:muted,fontSize:11}, splitLine:{lineStyle:{color:rule}} },
    yAxis:{ type:'value', name:'收益评分 (0-100)', min:0, max:100,
      nameTextStyle:{color:muted,fontSize:11}, axisLabel:{color:muted,fontSize:11}, splitLine:{lineStyle:{color:rule}} },
    series: seriesD
  });
  window.addEventListener('resize', function(){ chD.resize(); });

  // -------- (E) Function length distribution bar (appendix) --------
  var chE = document.getElementById('chart-func-length-dist');
  if (chE) {
    chE = echarts.init(chE, null, {renderer:'svg'});
    chE.setOption({
      animation:false,
      title:{ text:'164 函数长度分布 (71% <= 20 行, 6 个 >= 100 行需重构)', left:'center', top:6, textStyle:{fontSize:14,fontWeight:700,color:ink} },
      tooltip:{ trigger:'axis', axisPointer:{type:'shadow'}, formatter:function(p){
        p = p[0]; return p.name+' 档: '+p.value+' 个函数<br/>占比: '+(p.value/164*100).toFixed(1)+'%';
      }},
      grid:{ left:60, right:30, top:52, bottom:40 },
      xAxis:{ type:'category',
        data:['0~20 行','20~50 行','50~100 行','100~200 行','200~500 行','>= 500 行'],
        axisLabel:{ color:ink, fontSize:11, fontWeight:600 }
      },
      yAxis:{ type:'value', name:'函数数量', nameTextStyle:{color:muted,fontSize:11}, axisLabel:{color:muted,fontSize:11}, splitLine:{lineStyle:{color:rule}} },
      series:[{
        name:'函数数', type:'bar', barWidth:'60%',
        itemStyle:{
          color: function(p){
            var cs = ['#10b981','#22c55e','#f59e0b','#ef4444','#dc2626','#991b1b'];
            return cs[p.dataIndex];
          },
          borderRadius:[6,6,0,0]
        },
        label:{ show:true, position:'top',
          formatter:function(p){ return p.value+' 个 ('+(p.value/164*100).toFixed(0)+'%)'; },
          color:ink, fontSize:11, fontWeight:700
        },
        data:[116, 34, 8, 4, 2, 0]
      }]
    });
    window.addEventListener('resize', function(){ chE.resize(); });
  }
})();