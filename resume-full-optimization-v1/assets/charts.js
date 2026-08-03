// assets/charts.js for resume-full-optimization-v1
// 3 ECharts charts:
//  (A) CC 优化前后对比柱状（3 大函数合计 -90.5%）
//  (B) TOP10 函数 CC + 行数散点（右上角核弹区）
//  (C) 剩余 8 项优化 ROI 散点（气泡 = 风险度）
(function () {
  var style = getComputedStyle(document.documentElement);
  var accent  = style.getPropertyValue('--accent').trim()  || '#2563eb';
  var accent2 = style.getPropertyValue('--accent2').trim() || '#7c3aed';
  var ink     = style.getPropertyValue('--ink').trim()     || '#0f172a';
  var muted   = style.getPropertyValue('--muted').trim()   || '#64748b';
  var rule    = style.getPropertyValue('--rule').trim()    || '#e2e8f0';
  var bg2     = style.getPropertyValue('--bg2').trim()     || '#ffffff';
  var ok      = style.getPropertyValue('--ok').trim()      || '#059669';
  var warn    = style.getPropertyValue('--warn').trim()    || '#d97706';
  var danger  = style.getPropertyValue('--danger').trim()  || '#dc2626';

  // ========================================================================
  // (A) 三大重灾区函数 CC 优化前后对比
  // ========================================================================
  var chA = document.getElementById('chart-cc-compare');
  if (chA && typeof echarts !== 'undefined') {
    chA = echarts.init(chA, null, {renderer:'svg'});
    chA.setOption({
      animation:false,
      title:{ text:'3 大核心函数 CC 优化前后对比（合计 -237，-90.5%）', left:'center', top:6,
        textStyle:{ fontSize:14, fontWeight:700, color:ink } },
      tooltip:{ trigger:'axis', axisPointer:{type:'shadow'}, formatter:function(ps){
        var out = ps[0].axisValue + '<br/>';
        for (var i=0;i<ps.length;i++){
          var delta = '';
          if (i===1 && ps[0]) {
            var d = ps[1].value - ps[0].value;
            var pct = ps[0].value > 0 ? (d/ps[0].value*100).toFixed(0) : 0;
            delta = ' <span style="color:'+ok+';">('+(d>0?'+':'')+d+' / '+(d>0?'+':'')+pct+'%)</span>';
          }
          out += ps[i].marker + ps[i].seriesName + ': <b>' + ps[i].value + '</b>' + delta + '<br/>';
        }
        return out;
      }},
      legend:{ data:['优化前 v5.0 CC','优化后 v5.1 CC'], bottom:2, textStyle:{fontSize:11,color:muted} },
      grid:{ left:60, right:30, top:52, bottom:40 },
      xAxis:{ type:'category',
        data:['analyzeResume\n(简历评分)','generateProfessionalTips\n(建议生成)','buildTXT\n(纯文本导出)'],
        axisLabel:{ color:ink, fontSize:11.5, fontWeight:600, interval:0, lineHeight:14 }
      },
      yAxis:{ type:'value', name:'圈复杂度 CC（越低越好）',
        nameTextStyle:{color:muted,fontSize:11}, axisLabel:{color:muted,fontSize:11},
        splitLine:{lineStyle:{color:rule}}
      },
      series:[
        { name:'优化前 v5.0 CC', type:'bar', barWidth:26,
          itemStyle:{ color: danger, borderRadius:[6,6,0,0] },
          label:{ show:true, position:'top', color:danger, fontSize:13, fontWeight:700,
            formatter:function(p){return 'CC '+p.value;} },
          data:[ 121, 73, 68 ]
        },
        { name:'优化后 v5.1 CC', type:'bar', barWidth:26,
          itemStyle:{ color: ok, borderRadius:[6,6,0,0] },
          label:{ show:true, position:'top', color:ok, fontSize:13, fontWeight:700,
            formatter:function(p){return 'CC '+p.value;} },
          data:[ 20, 2, 3 ]
        }
      ]
    });
    window.addEventListener('resize', function(){ chA.resize(); });
  }

  // ========================================================================
  // (B) TOP10 函数 CC + 行数散点（右上角 applyCustomStyle / exportPDF 核弹区）
  // ========================================================================
  var chB = document.getElementById('chart-top10-scatter');
  if (chB && typeof echarts !== 'undefined') {
    chB = echarts.init(chB, null, {renderer:'svg'});
    // 数据：name, x=行数 LOC, y=圈复杂度 CC, risk=1低/2中/3高/4核弹
    var top10 = [
      { name:'applyCustomStyle 模板渲染',  x:1187, y:289, risk:4, note:'31×CSS 分支瀑布，核弹 #1' },
      { name:'exportPDF PDF 导出管线',     x:1337, y:72,  risk:3, note:'onclone 12 段 + blob 三层兜底' },
      { name:'parseTXTResume TXT 导入解析',x:620,  y:70,  risk:2, note:'正则瀑布 ×10 模块' },
      { name:'fillOccData 职业数据填充',   x:490,  y:54,  risk:1, note:'if/else 职业 ×6 模板 ×6' },
      { name:'splitPages 自动分页',        x:310,  y:21,  risk:2, note:'6 级递归切割' },
      { name:'applyCustomColor 主题色',    x:270,  y:18,  risk:1, note:'变量写入 + 反色计算' },
      { name:'patternLayer 装饰层',        x:260,  y:15,  risk:1, note:'SVG/渐变图案生成' },
      { name:'renderEditor 编辑器渲染',    x:250,  y:14,  risk:1, note:'字段 × 组件分派' },
      { name:'rich() 富文本清洗',          x:230,  y:26,  risk:1, note:'标签栈 + 属性白名单' },
      { name:'saveData 存储封装',          x:150,  y:12,  risk:1, note:'压缩 + base64 + 容量检查' }
    ];
    var riskColor = { 1:ok, 2:warn, 3:danger, 4:'#7f1d1d' };
    var riskSize  = { 1:16, 2:24, 3:36, 4:56 };
    var riskLabel = { 1:'低风险', 2:'中风险', 3:'高风险', 4:'核弹级' };

    // 按风险分组输出 series（保证图例）
    var byRisk = {};
    for (var i=0;i<top10.length;i++){
      var r = top10[i].risk;
      if (!byRisk[r]) byRisk[r]=[];
      byRisk[r].push(top10[i]);
    }
    var seriesB = [];
    // 核弹区背景
    seriesB.push({
      type:'scatter', name:'核弹区（必须 v6.0）', symbolSize:0, silent:true,
      markArea:{ silent:true, itemStyle:{ color:'rgba(220,38,38,0.08)' },
        data:[ [{coord:[900,150]},{coord:[1500,320]}] ]
      },
      data:[]
    });
    // 高风险区背景
    seriesB.push({
      type:'scatter', name:'高风险区（v5.3）', symbolSize:0, silent:true,
      markArea:{ silent:true, itemStyle:{ color:'rgba(217,119,6,0.08)' },
        data:[ [{coord:[400,50]},{coord:[1500,150]}] ]
      },
      data:[]
    });
    // CC 安全线
    seriesB.push({
      type:'scatter', name:'CC 安全线 ≤ 20', symbolSize:0, silent:true,
      markLine:{ silent:true, symbol:'none',
        lineStyle:{ color:ok, width:1.5, type:'dashed' },
        label:{ formatter:'CC 红线 = 20', position:'insideEndTop', color:ok, fontSize:11, fontWeight:600 },
        data:[{ yAxis:20 }]
      },
      data:[]
    });

    var riskKeys = Object.keys(byRisk).sort();
    for (var k=0;k<riskKeys.length;k++){
      var rk = +riskKeys[k];
      var arr = byRisk[rk];
      var points = [];
      for (var j=0;j<arr.length;j++){
        points.push({ value:[arr[j].x, arr[j].y], name:arr[j].name, note:arr[j].note, r:rk });
      }
      seriesB.push({
        name: riskLabel[rk], type:'scatter',
        symbolSize: function(v, p){ return riskSize[p.data.r] || 18; },
        itemStyle:{ color: riskColor[rk], opacity:0.82, borderColor:bg2, borderWidth:2 },
        label:{ show:true, position:'top', fontSize:11, color:ink, fontWeight:600,
          formatter:function(p){ return p.data.name; }
        },
        data: points
      });
    }

    chB.setOption({
      animation:false,
      title:{ text:'TOP10 函数：行数 × 圈复杂度散点（右上 = 高复杂度 × 超长，重构核弹）',
        left:'center', top:6, textStyle:{fontSize:13,fontWeight:700,color:ink} },
      legend:{ bottom:2, textStyle:{fontSize:11,color:muted} },
      tooltip:{ formatter:function(p){
        if (!p.data || !p.data.name) return p.seriesName;
        return '<b>'+p.data.name+'</b><br/>行数 LOC: <b>'+p.value[0]+'</b><br/>圈复杂度 CC: <b>'+p.value[1]+'</b><br/>风险: <b style="color:'+(riskColor[p.data.r]||muted)+'">'+(riskLabel[p.data.r]||'')+'</b><br/><span style="color:'+muted+'">'+p.data.note+'</span>';
      }},
      grid:{ left:70, right:30, top:48, bottom:48 },
      xAxis:{ type:'value', name:'函数行数 LOC（越长越难维护）', min:0, max:1500,
        nameTextStyle:{color:muted,fontSize:11}, axisLabel:{color:muted,fontSize:11}, splitLine:{lineStyle:{color:rule}}
      },
      yAxis:{ type:'value', name:'圈复杂度 CC（分支越多越难测）', min:0, max:320,
        nameTextStyle:{color:muted,fontSize:11}, axisLabel:{color:muted,fontSize:11}, splitLine:{lineStyle:{color:rule}}
      },
      series: seriesB
    });
    window.addEventListener('resize', function(){ chB.resize(); });
  }

  // ========================================================================
  // (C) 剩余 8 项优化 ROI 散点：x=工时 h，y=收益分 0-100，气泡大小=风险度
  // ========================================================================
  var chC = document.getElementById('chart-roi');
  if (chC && typeof echarts !== 'undefined') {
    chC = echarts.init(chC, null, {renderer:'svg'});
    // ver: v5.2 / v5.3 / v6.0
    var tasks = [
      { id:'#1', ver:'v5.2', name:'fillOccData CC54 数据化',        hours:2,  benefit:70, roi:35.0, risk:1, core:'OCC_TEMPLATES 数组随机 pick' },
      { id:'#2', ver:'v5.2', name:'rich() 26 拆 3 子函数',         hours:3,  benefit:65, roi:21.7, risk:1, core:'Escape / TagStack / CleanAttrs' },
      { id:'#3', ver:'v5.2', name:'splitPages CC21 拆 6 级切割',     hours:4,  benefit:80, roi:20.0, risk:2, core:'cutXxx(clone,cursor) 小函数链' },
      { id:'#4', ver:'v5.2', name:'DF-001 升级 IndexedDB 降级',     hours:6,  benefit:95, roi:15.8, risk:2, core:'idb-keyval 内联；失败自动存 IDB' },
      { id:'#1', ver:'v5.3', name:'parseTXTResume CC70 分派表',     hours:5,  benefit:75, roi:15.0, risk:2, core:'PARSER_RULES = [{re,handler}]' },
      { id:'#2', ver:'v5.3', name:'exportPDF CC72 拆 4 文件',       hours:8,  benefit:85, roi:10.6, risk:3, core:'onclone 12 段 / blob 兜底 模块' },
      { id:'#1', ver:'v6.0', name:'applyCustomStyle CC289 分派表',  hours:24, benefit:100,roi:4.2,  risk:4, core:'STYLE_BUILDERS × 31 模板复制 buildTXT 模式' },
      { id:'#2', ver:'v6.0', name:'真 DOCX 导出（替换伪 .doc）',    hours:48, benefit:90, roi:1.9,  risk:3, core:'docxtemplater + PizZip base64 打包' },
      { id:'#3', ver:'v6.0', name:'拆 Vite + Vue 模块化',           hours:168,benefit:80, roi:0.5,  risk:3, core:'保留 index.html 作为离线 fallback' }
    ];
    var riskBubble = { 1:22, 2:38, 3:60, 4:90 };
    var verColor  = { 'v5.2':ok, 'v5.3':accent, 'v6.0':accent2 };
    var riskLabel = { 1:'低', 2:'中', 3:'高', 4:'核弹' };

    var byVer = {};
    for (var t=0;t<tasks.length;t++){
      var v = tasks[t].ver;
      if (!byVer[v]) byVer[v]=[];
      byVer[v].push(tasks[t]);
    }

    var seriesC = [];
    // ROI 斜线（ROI = 10 斜线：y = 10x）
    seriesC.push({
      type:'line', name:'ROI = 10 斜线（线上=划算）',
      symbol:'none', lineStyle:{ color:warn, width:1.5, type:'dashed' },
      data:[[0,0],[10,100]], z:1, silent:true
    });
    // ROI = 20 斜线
    seriesC.push({
      type:'line', name:'ROI = 20 斜线（极佳）',
      symbol:'none', lineStyle:{ color:ok, width:1.5, type:'dashed' },
      data:[[0,0],[5,100]], z:1, silent:true
    });

    var verKeys = Object.keys(byVer).sort();
    for (var vk=0;vk<verKeys.length;vk++){
      var ver = verKeys[vk];
      var arr = byVer[ver];
      var pts = [];
      for (var u=0;u<arr.length;u++){
        pts.push({
          value:[arr[u].hours, arr[u].benefit],
          name:arr[u].ver+' '+arr[u].id+' '+arr[u].name,
          id:arr[u].id, ver:arr[u].ver, roi:arr[u].roi, risk:arr[u].risk, core:arr[u].core, full:arr[u].name
        });
      }
      seriesC.push({
        name: ver+'（共 '+arr.length+' 项）', type:'scatter', z:5,
        symbolSize: function(v, p){ return riskBubble[p.data.risk] || 20; },
        itemStyle:{ color: verColor[ver], opacity:0.78, borderColor:bg2, borderWidth:2 },
        label:{ show:true, position:'top', fontSize:10.5, color:ink, fontWeight:600,
          formatter:function(p){ return p.data.ver+' '+p.data.id+'\nROI '+p.data.roi; },
          lineHeight:14, align:'center'
        },
        data: pts
      });
    }

    chC.setOption({
      animation:false,
      title:{ text:'剩余 9 项优化 ROI 散点：气泡越大=风险越高，斜线上方=越划算',
        left:'center', top:6, textStyle:{fontSize:13,fontWeight:700,color:ink} },
      legend:{ bottom:2, textStyle:{fontSize:11,color:muted} },
      tooltip:{ formatter:function(p){
        if (!p.data || !p.data.ver) return p.seriesName;
        return '<b>'+p.data.name+'</b><br/>'+
               '收益分: <b style="color:'+ok+'">'+p.value[1]+'</b> / 100<br/>'+
               '预估工时: <b>'+p.value[0]+' h</b><br/>'+
               'ROI: <b style="color:'+accent+'">'+p.data.roi+'</b><br/>'+
               '风险: <b>'+(riskLabel[p.data.risk]||'')+'</b><br/>'+
               '<span style="color:'+muted+'">做法：'+p.data.core+'</span>';
      }},
      grid:{ left:60, right:30, top:48, bottom:48 },
      xAxis:{ type:'value', name:'预估工时（小时）→ 越小越先做', min:0, max:180,
        nameTextStyle:{color:muted,fontSize:11}, axisLabel:{color:muted,fontSize:11}, splitLine:{lineStyle:{color:rule}}
      },
      yAxis:{ type:'value', name:'收益分 0-100（越高越值）', min:0, max:110,
        nameTextStyle:{color:muted,fontSize:11}, axisLabel:{color:muted,fontSize:11}, splitLine:{lineStyle:{color:rule}}
      },
      series: seriesC
    });
    window.addEventListener('resize', function(){ chC.resize(); });
  }

})();
