// assets/charts.js for resume-reverse-engineering-guide
// 4 ECharts charts:
//  (A) 功能模块分布图
//  (B) 模板六大系列分布
//  (C) 代码占比分析
//  (D) 渲染管线流程图
(function () {
  var style = getComputedStyle(document.documentElement);
  var accent  = style.getPropertyValue('--accent').trim()  || '#4338ca';
  var accent2 = style.getPropertyValue('--accent2').trim() || '#c026d3';
  var ink     = style.getPropertyValue('--ink').trim()     || '#0b1220';
  var muted   = style.getPropertyValue('--muted').trim()   || '#475569';
  var rule    = style.getPropertyValue('--rule').trim()    || 'rgba(99,102,241,0.18)';
  var bg2     = style.getPropertyValue('--bg2').trim()     || 'rgba(255,255,255,0.78)';
  var ok      = style.getPropertyValue('--ok').trim()      || '#059669';
  var warn    = style.getPropertyValue('--warn').trim()    || '#b45309';
  var danger  = style.getPropertyValue('--danger').trim()  || '#b91c1c';

  // ========================================================================
  // (A) 功能模块分布图 — 4大类120+子项
  // ========================================================================
  var chA = document.getElementById('chart-features');
  if (chA && typeof echarts !== 'undefined') {
    chA = echarts.init(chA, null, {renderer:'svg'});
    chA.setOption({
      animation:false,
      title:{ text:'功能全景 4 大类：120+ 子项分布', left:'center', top:6,
        textStyle:{ fontSize:14, fontWeight:700, color:ink } },
      tooltip:{ trigger:'item', formatter:'{b}: {c} 项 ({d}%)' },
      legend:{ bottom:2, textStyle:{fontSize:11,color:muted} },
      series:[{
        type:'pie', radius:['30%','65%'], center:['50%','50%'],
        avoidLabelOverlap:true,
        label:{ show:true, fontSize:12, fontWeight:600, color:ink,
          formatter:'{b}\n{c} 项' },
        emphasis:{ label:{fontSize:14,fontWeight:'bold'} },
        itemStyle:{ borderRadius:6, borderColor:bg2, borderWidth:2 },
        data:[
          { value:47, name:'内容编辑', itemStyle:{ color:accent } },
          { value:34, name:'视觉定制', itemStyle:{ color:accent2 } },
          { value:21, name:'效率协作', itemStyle:{ color:ok } },
          { value:18, name:'导出分享', itemStyle:{ color:warn } }
        ]
      }]
    });
    window.addEventListener('resize', function(){ chA.resize(); });
  }

  // ========================================================================
  // (B) 模板六大系列分布
  // ========================================================================
  var chB = document.getElementById('chart-templates');
  if (chB && typeof echarts !== 'undefined') {
    chB = echarts.init(chB, null, {renderer:'svg'});
    chB.setOption({
      animation:false,
      title:{ text:'31 套模板 · 6 大系列', left:'center', top:6,
        textStyle:{ fontSize:14, fontWeight:700, color:ink } },
      tooltip:{ trigger:'axis', axisPointer:{type:'shadow'} },
      legend:{ bottom:2, textStyle:{fontSize:11,color:muted} },
      grid:{ left:60, right:30, top:48, bottom:40 },
      xAxis:{ type:'category',
        data:['分栏系列','新风格','横幅系列','卡片系列','简约系列','深色系列'],
        axisLabel:{ color:ink, fontSize:11.5, fontWeight:600, interval:0 }
      },
      yAxis:{ type:'value', name:'模板数量',
        nameTextStyle:{color:muted,fontSize:11}, axisLabel:{color:muted,fontSize:11},
        splitLine:{lineStyle:{color:rule}}
      },
      series:[{
        type:'bar', barWidth:32,
        itemStyle:{ color:accent, borderRadius:[6,6,0,0] },
        label:{ show:true, position:'top', color:ink, fontSize:13, fontWeight:700 },
        data:[9,6,4,4,7,1]
      }]
    });
    window.addEventListener('resize', function(){ chB.resize(); });
  }

  // ========================================================================
  // (C) 代码占比分析
  // ========================================================================
  var chC = document.getElementById('chart-code-composition');
  if (chC && typeof echarts !== 'undefined') {
    chC = echarts.init(chC, null, {renderer:'svg'});
    chC.setOption({
      animation:false,
      title:{ text:'单文件 12MB 构成分析', left:'center', top:6,
        textStyle:{ fontSize:14, fontWeight:700, color:ink } },
      tooltip:{ trigger:'item', formatter:'{b}: {c}MB ({d}%)' },
      legend:{ bottom:2, textStyle:{fontSize:11,color:muted} },
      series:[{
        type:'pie', radius:['20%','60%'], center:['50%','50%'],
        label:{ show:true, fontSize:11, fontWeight:600, color:ink,
          formatter:'{b}\n{c}MB' },
        itemStyle:{ borderRadius:4, borderColor:bg2, borderWidth:2 },
        data:[
          { value:4.3, name:'FontAwesome 字体', itemStyle:{ color:'#6366f1' } },
          { value:3.8, name:'主脚本逻辑', itemStyle:{ color:accent } },
          { value:2.1, name:'html2canvas + jsPDF', itemStyle:{ color:accent2 } },
          { value:1.2, name:'CSS 样式', itemStyle:{ color:ok } },
          { value:0.5, name:'HTML 结构', itemStyle:{ color:warn } },
          { value:0.1, name:'素材图片', itemStyle:{ color:'#f59e0b' } }
        ]
      }]
    });
    window.addEventListener('resize', function(){ chC.resize(); });
  }

  // ========================================================================
  // (D) 渲染管线 6 步流程图（横向柱状表示每步相对耗时）
  // ========================================================================
  var chD = document.getElementById('chart-pipeline');
  if (chD && typeof echarts !== 'undefined') {
    chD = echarts.init(chD, null, {renderer:'svg'});
    chD.setOption({
      animation:false,
      title:{ text:'核心渲染流水线 · 6 步执行时序与相对耗时', left:'center', top:6,
        textStyle:{ fontSize:14, fontWeight:700, color:ink } },
      tooltip:{ trigger:'axis', axisPointer:{type:'shadow'} },
      grid:{ left:100, right:30, top:48, bottom:20 },
      xAxis:{ type:'value', name:'相对耗时 (ms)',
        nameTextStyle:{color:muted,fontSize:11}, axisLabel:{color:muted,fontSize:11},
        splitLine:{lineStyle:{color:rule}}
      },
      yAxis:{ type:'category', inverse:true,
        data:['应用主题CSS变量','设置纸张字号','模板HTML拼装','数据注入+转义','头像渲染','分页切割'],
        axisLabel:{ color:ink, fontSize:11.5, fontWeight:600 }
      },
      series:[{
        type:'bar', barWidth:22,
        label:{ show:true, position:'right', color:ink, fontSize:11, fontWeight:600,
          formatter:function(p){ return p.value + 'ms'; } },
        itemStyle:{ color:accent, borderRadius:[0,6,6,0] },
        data:[2, 1, 15, 8, 25, 10]
      }]
    });
    window.addEventListener('resize', function(){ chD.resize(); });
  }

})();