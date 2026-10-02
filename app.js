const hierarchy = [
  {
    key: "substation", label: "变电站", table: "substation", icon: "⌂", count: 204, description: "电网中的变电站及其基础属性", columns: ["name", "code", "voltage", "area", "status"],
    rows: [
      ["Jeddah North Substation", "JED-NTH-001", "380kV", "Saudi Arabia · Jeddah North", "运行"], ["Jeddah Industrial Substation", "JED-IND-002", "132kV", "Saudi Arabia · Industrial City", "运行"], ["Jeddah South Substation", "JED-STH-005", "380kV", "Saudi Arabia · Jeddah South", "运行"], ["Jeddah Airport Substation", "JED-AIR-006", "132kV", "Saudi Arabia · Airport", "维护中"], ["Jeddah Central Substation", "JED-CTL-007", "132kV", "Saudi Arabia · Central", "运行"]
    ]
  },
  { key: "busbar", label: "母线", table: "bussection", icon: "═", count: 178, description: "变电站内的母线及母线段连接关系", columns: ["name", "code", "substation", "voltage", "status"], rows: [["Jeddah North 380kV Busbar A", "BUS-JED-N01", "Jeddah North Substation", "380kV", "运行"], ["Jeddah North 380kV Busbar B", "BUS-JED-N02", "Jeddah North Substation", "380kV", "运行"], ["Jeddah Industrial 132kV Busbar", "BUS-JED-I01", "Jeddah Industrial Substation", "132kV", "运行"], ["Jeddah Central 132kV Busbar", "BUS-JED-C06", "Jeddah Central Substation", "132kV", "检修"]] },
  { key: "bay", label: "间隔", table: "bay", icon: "▦", count: 406, description: "变电站内的间隔和连接关系", columns: ["name", "code", "substation", "type", "status"], rows: [["Jeddah North Transformer Bay 1", "BAY-JED-N01", "Jeddah North Substation", "主变间隔", "运行"], ["Jeddah North 132kV Line Bay", "BAY-JED-N02", "Jeddah North Substation", "线路间隔", "运行"], ["Jeddah Industrial Transformer Bay 2", "BAY-JED-I02", "Jeddah Industrial Substation", "主变间隔", "运行"], ["Jeddah Central Bus Coupler Bay", "BAY-JED-C06", "Jeddah Central Substation", "母联间隔", "检修"]] },
  { key: "feeder", label: "馈线", table: "feeder", icon: "⌁", count: 812, description: "从变电站出发的馈线及线路信息", columns: ["name", "code", "bay", "voltage", "status"], rows: [["Jeddah North 132kV Feeder 1", "FDR-JED-N01", "Jeddah North Transformer Bay 1", "132kV", "运行"], ["Jeddah North 132kV Feeder 2", "FDR-JED-N02", "Jeddah North Transformer Bay 1", "132kV", "运行"], ["Jeddah Industrial West Feeder", "FDR-JED-I08", "Jeddah Industrial Transformer Bay 2", "132kV", "运行"], ["Jeddah Central Airport Feeder", "FDR-JED-C11", "Jeddah Central Bus Coupler Bay", "33kV", "停运"]] },
  { key: "equipment", label: "设备", table: "equipment", icon: "▣", count: 1284, description: "电网一次、二次设备及其台账", columns: ["name", "code", "type", "feeder", "status"], rows: [["Jeddah North Power Transformer 1", "EQ-JED-N001", "变压器", "Jeddah North 132kV Feeder 1", "运行"], ["Jeddah North Incomer Breaker 1", "EQ-JED-N031", "断路器", "Jeddah North 132kV Feeder 1", "运行"], ["Jeddah Industrial Line Disconnector", "EQ-JED-I122", "隔离开关", "Jeddah Industrial West Feeder", "运行"], ["Jeddah Central Bus Coupler Breaker", "EQ-JED-C237", "断路器", "Jeddah Central Airport Feeder", "检修"]] },
  { key: "signal", label: "信号", table: "signal", icon: "◌", count: 9240, description: "设备遥信、遥测和告警信号", columns: ["name", "code", "equipment", "signalType", "status"], rows: [["Transformer HV Side Status", "SIG-JED-N001", "Jeddah North Power Transformer 1", "遥信", "正常"], ["Transformer Active Power", "SIG-JED-N002", "Jeddah North Power Transformer 1", "遥测", "正常"], ["Incomer Breaker Open Position", "SIG-JED-N031", "Jeddah North Incomer Breaker 1", "遥信", "正常"], ["Feeder Overcurrent Alarm", "SIG-JED-I122", "Jeddah Industrial Line Disconnector", "告警", "关注"]] }
];

const state = { selected: "substation", search: "", expanded: new Set(["substation"]), page: 1 };
const main = document.querySelector(".main-content");
const sidebarNav = document.querySelectorAll(".nav-item");
sidebarNav.forEach((item) => { item.classList.remove("active"); if (item.textContent.includes("数据目录")) item.classList.add("active"); });

main.innerHTML = `
  <header class="topbar"><button class="mobile-menu icon-button" id="mobileMenu" aria-label="打开导航">☰</button><div class="breadcrumbs"><span>工作台</span><b>/</b><strong>Oracle 数据目录</strong></div><div class="topbar-actions"><button class="icon-button notification-button" aria-label="通知"><span class="notification-dot"></span>♢</button><button class="icon-button theme-toggle" id="themeToggle" aria-label="切换主题">☼</button><span class="topbar-divider"></span><span class="date-label">数据源：Oracle · DBI</span></div></header>
  <section class="content-wrapper directory-wrapper" id="directory">
    <div class="page-heading"><div><p class="eyebrow">ORACLE DATA CATALOG <span class="live-dot"></span> CONNECTED</p><h1>数据层级目录 <span class="wave">✦</span></h1><p class="heading-subtitle">按电网模型层级浏览 Oracle 数据表和关联记录。</p></div><div class="connection-state"><span class="connection-dot"></span><span>已连接</span><b>Oracle / REALTIME</b></div></div>
    <div class="directory-stats"><div><span>数据表</span><strong>24</strong><small>张</small></div><div><span>层级节点</span><strong>6</strong><small>类</small></div><div><span>总记录数</span><strong>12,924</strong><small>条</small></div><div><span>最后同步</span><strong>10:42</strong><small>今天</small></div></div>
    <section class="directory-panel panel"><aside class="tree-panel"><div class="tree-heading"><div><h2>吉达电网模型</h2><p>JEDDAH GRID MODEL</p></div><button class="icon-button" id="collapseTree" aria-label="收起目录">‹</button></div><label class="directory-search"><span>⌕</span><input id="treeSearch" type="search" placeholder="搜索目录..." /></label><div class="tree-root"><span class="root-icon">◎</span><div><strong>吉达电网</strong><small>SAUDI ARABIA / PUBLIC</small></div><span class="root-status"></span></div><div class="tree-list" id="treeList"></div><div class="tree-footer"><span class="sync-dot"></span><span>目录已同步</span><span>10:42:16</span></div></aside><div class="records-panel"><div class="records-heading"><div><div class="record-title"><span class="record-icon" id="recordIcon">⌂</span><div><h2 id="recordTitle">变电站</h2><p id="recordDescription">电网中的变电站及其基础属性</p></div></div></div><div class="record-actions"><button class="secondary-button" id="refreshRecords">↻ <span>刷新</span></button><button class="secondary-button" id="exportRecords">⇩ <span>导出</span></button><button class="icon-button more-button" aria-label="更多操作">•••</button></div></div><div class="path-bar"><span>PUBLIC</span><b>/</b><span>JEDDAH_GRID</span><b>/</b><strong id="tablePath">substation</strong><em id="recordTotal">204 条记录</em></div><div class="record-toolbar"><label class="search-box"><span>⌕</span><input id="recordSearch" type="search" placeholder="搜索当前表中的记录..." /></label><button class="filter-button" id="columnFilter">列筛选 <span>⌄</span></button><button class="filter-button" id="viewMode">☷ <span>表格视图</span></button></div><div class="record-table-wrap"><table class="record-table"><thead id="recordHead"></thead><tbody id="recordBody"></tbody></table><div class="empty-state" id="recordEmpty" hidden>没有找到匹配记录</div></div><div class="table-footer"><span id="recordCount">显示 1–5 条，共 204 条记录</span><div class="pagination"><button class="page-button" disabled>‹</button><button class="page-button active">1</button><button class="page-button">2</button><button class="page-button">3</button><span>...</span><button class="page-button">›</button></div></div></div></section>
    <div class="hierarchy-hint"><span>层级关系</span><div class="hierarchy-flow"><span>变电站</span><b>→</b><span>母线</span><b>/</b><span>间隔</span><b>→</b><span>馈线</span><b>→</b><span>设备</span><b>→</b><span>信号</span></div><small>点击左侧节点查看对应 Oracle 表</small></div>
  </section><footer class="footer-note">Oracle 数据每 5 分钟自动同步一次 <span>·</span> 连接状态正常</footer><div class="toast" id="toast" role="status"></div>`;

function currentNode() { return hierarchy.find((node) => node.key === state.selected); }
function showToast(message) { const toast = document.querySelector("#toast"); toast.textContent = message; toast.classList.add("show"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200); }
function statusClass(value) { const text = String(value ?? "").toLowerCase(); if (["运行", "正常", "online", "1"].includes(text)) return "online"; if (["维护中", "检修", "关注", "maintenance"].includes(text)) return "maintenance"; return "offline"; }

function renderTree() {
  const query = document.querySelector("#treeSearch").value.trim().toLowerCase();
  const visible = hierarchy.filter((node) => `${node.label} ${node.table}`.toLowerCase().includes(query));
  document.querySelector("#treeList").innerHTML = visible.map((node, index) => `
    <div class="tree-node-wrap"><button class="tree-node ${node.key === state.selected ? "selected" : ""}" data-node="${node.key}"><span class="tree-chevron">${state.expanded.has(node.key) ? "⌄" : "›"}</span><span class="tree-node-icon ${node.key}">${node.icon}</span><span class="tree-node-copy"><strong>${node.label}</strong><small>${node.table}</small></span><span class="tree-count">${node.count.toLocaleString()}</span></button>${node.key === state.selected && state.expanded.has(node.key) ? `<div class="tree-children"><span class="tree-child active">${node.table}<em>${node.count.toLocaleString()}</em></span><span class="tree-child">${node.table}_metadata<em>—</em></span></div>` : ""}</div>`).join("");
  document.querySelectorAll(".tree-node").forEach((button) => button.addEventListener("click", () => { const key = button.dataset.node; if (state.selected === key) { state.expanded.has(key) ? state.expanded.delete(key) : state.expanded.add(key); } else { state.selected = key; state.expanded.add(key); state.page = 1; } renderTree(); renderRecords(); }));
}

function renderRecords() {
  const node = currentNode();
  document.querySelector("#recordIcon").textContent = node.icon; document.querySelector("#recordTitle").textContent = node.label; document.querySelector("#recordDescription").textContent = node.description; document.querySelector("#tablePath").textContent = node.table; document.querySelector("#recordTotal").textContent = `${node.count.toLocaleString()} 条记录`;
  const labelMap = { name: "名称", code: "编码", voltage: "电压等级", area: "所属区域", status: "状态", substation: "所属变电站", type: "类型", bay: "所属间隔", feeder: "所属馈线", signalType: "信号类型", equipment: "所属设备" };
  document.querySelector("#recordHead").innerHTML = `<tr><th class="check-cell"><input id="selectRecords" type="checkbox" aria-label="选择全部记录" /></th>${node.columns.map((column) => `<th>${labelMap[column]} <span class="sort-mark">↕</span></th>`).join("")}<th></th></tr>`;
  const query = document.querySelector("#recordSearch").value.trim().toLowerCase();
  const rows = node.rows.filter((row) => row.join(" ").toLowerCase().includes(query));
  document.querySelector("#recordBody").innerHTML = rows.map((row, rowIndex) => `<tr><td class="check-cell"><input type="checkbox" aria-label="选择第 ${rowIndex + 1} 条记录" /></td>${row.map((cell, index) => index === 0 ? `<td><div class="record-name"><span class="mini-record-icon">${node.icon}</span><div><strong>${cell}</strong><small>${row[1]}</small></div></div></td>` : index === row.length - 1 ? `<td><span class="status-pill ${statusClass(cell)}">${cell}</span></td>` : `<td>${cell}</td>`).join("")}<td><button class="row-menu" aria-label="更多操作">•••</button></td></tr>`).join("");
  document.querySelector("#recordEmpty").hidden = rows.length !== 0; document.querySelector("#recordCount").textContent = rows.length ? `显示 1–${rows.length} 条，共 ${node.count.toLocaleString()} 条记录` : "没有匹配记录";
}

document.querySelector("#treeSearch").addEventListener("input", renderTree);
document.querySelector("#recordSearch").addEventListener("input", renderRecords);
document.querySelector("#refreshRecords").addEventListener("click", () => { showToast("正在刷新 Oracle 数据"); loadLiveData(); });
document.querySelector("#columnFilter").addEventListener("click", () => showToast("列筛选功能已准备就绪"));
document.querySelector("#viewMode").addEventListener("click", () => showToast("当前已是表格视图"));
document.querySelector("#exportRecords").addEventListener("click", () => { const node = currentNode(); const csv = [node.columns.join(","), ...node.rows.map((row) => row.join(","))].join("\n"); const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" })); link.download = `${node.table}.csv`; link.click(); URL.revokeObjectURL(link.href); showToast(`${node.label}数据已导出`); });
document.querySelector("#collapseTree").addEventListener("click", () => { document.querySelector(".directory-panel").classList.toggle("tree-collapsed"); });
document.querySelector("#themeToggle").addEventListener("click", () => { document.body.classList.toggle("dark"); showToast(document.body.classList.contains("dark") ? "已切换至深色模式" : "已切换至浅色模式"); });
document.querySelector("#mobileMenu").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("open"));
document.querySelectorAll(".nav-item").forEach((item) => item.addEventListener("click", () => document.querySelector("#sidebar").classList.remove("open")));
renderTree(); renderRecords();

const API_ROOT = window.GRID_DATA_API || (window.location.protocol === "file:" ? "http://127.0.0.1:8899/api/v1" : "/api/v1");
const PROFILE_ID = new URLSearchParams(window.location.search).get("profile") || "jeddah";
const endpointByNode = { substation: "substations", busbar: "busbars", bay: "bays", feeder: "feeders", equipment: "equipment", signal: "signals" };

function liveStatus(value, runState) { if (value === null || value === undefined || value === "") return runState === null || runState === undefined || runState === "" ? "未配置" : String(runState); return String(value); }
function mapLiveItem(node, item) {
  const status = liveStatus(item.status, item.run_state);
  const values = { name: item.name ?? "—", code: item.code ?? item.source_id ?? "—", voltage: item.voltage ?? "—", area: item.area ?? "—", status, substation: item.substation ?? "—", bay: item.bay ?? "—", feeder: item.feeder ?? "—", equipment: item.equipment ?? item.owner_name ?? "—", type: item.type ?? item.entity_type ?? "—", signalType: item.signal_type ?? "—" };
  return node.columns.map((column) => values[column]);
}
function setConnectionState(connected) {
  const stateBox = document.querySelector(".connection-state");
  if (!stateBox) return;
  stateBox.innerHTML = `<span class="connection-dot"></span><span>${connected ? "已连接" : "演示数据"}</span><b>${connected ? `Oracle / ${PROFILE_ID.toUpperCase()}` : "API 未启动"}</b>`;
}
async function loadLiveData() {
  try {
    const profileResponse = await fetch(`${API_ROOT}/profiles`);
    if (!profileResponse.ok) throw new Error(`profiles ${profileResponse.status}`);
    const profiles = await profileResponse.json();
    if (!profiles.some((profile) => profile.id === PROFILE_ID)) throw new Error(`profile ${PROFILE_ID} not found`);
    await Promise.all(hierarchy.map(async (node) => {
      const response = await fetch(`${API_ROOT}/${PROFILE_ID}/${endpointByNode[node.key]}?offset=0&limit=200`);
      if (!response.ok) throw new Error(`${node.key} ${response.status}`);
      const payload = await response.json();
      node.rows = (payload.items || []).map((item) => mapLiveItem(node, item));
      node.count = payload.meta?.total ?? node.rows.length;
    }));
    setConnectionState(true); renderTree(); renderRecords(); showToast(`已读取 ${PROFILE_ID} 的 Oracle 数据`);
  } catch (error) {
    setConnectionState(false); showToast("后端未启动，当前显示演示数据");
    console.info("Grid Data API unavailable; demo data remains active.", error);
  }
}
loadLiveData();
