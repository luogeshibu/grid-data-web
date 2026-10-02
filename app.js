const assets = [
  { name: "上海南桥变电站", id: "SUB-SH-0241", type: "变电站", icon: "⌁", location: "上海 · 奉贤区", status: "正常运行", statusClass: "online", updated: "刚刚" },
  { name: "苏州工业园区风电场", id: "WND-JS-0087", type: "风力发电", icon: "≋", location: "江苏 · 苏州", status: "正常运行", statusClass: "online", updated: "2 分钟前" },
  { name: "浙江北仑光伏基地", id: "PV-ZJ-0312", type: "光伏电站", icon: "☼", location: "浙江 · 宁波", status: "正常运行", statusClass: "online", updated: "4 分钟前" },
  { name: "合肥东郊输电线路", id: "LIN-AH-1026", type: "输电线路", icon: "⌁", location: "安徽 · 合肥", status: "维护中", statusClass: "maintenance", updated: "12 分钟前" },
  { name: "无锡新区变电站", id: "SUB-JS-0168", type: "变电站", icon: "⌁", location: "江苏 · 无锡", status: "正常运行", statusClass: "online", updated: "18 分钟前" },
  { name: "宁波港储能中心", id: "ESS-ZJ-0045", type: "储能设施", icon: "▣", location: "浙江 · 宁波", status: "离线", statusClass: "offline", updated: "26 分钟前" },
  { name: "南京江北燃气电站", id: "GAS-JS-0091", type: "燃气电站", icon: "⌁", location: "江苏 · 南京", status: "正常运行", statusClass: "online", updated: "31 分钟前" },
  { name: "杭州西郊输电线路", id: "LIN-ZJ-0742", type: "输电线路", icon: "⌁", location: "浙江 · 杭州", status: "正常运行", statusClass: "online", updated: "36 分钟前" }
];

const tableBody = document.querySelector("#assetTableBody");
const searchInput = document.querySelector("#searchInput");
const emptyState = document.querySelector("#emptyState");
const resultCount = document.querySelector("#resultCount");
let activeStatus = "全部";
let sortKey = null;
let sortDirection = 1;

function renderTable() {
  const query = searchInput.value.trim().toLowerCase();
  let filtered = assets.filter((asset) => {
    const matchesQuery = [asset.name, asset.id, asset.type, asset.location].join(" ").toLowerCase().includes(query);
    const matchesStatus = activeStatus === "全部" || asset.status === activeStatus;
    return matchesQuery && matchesStatus;
  });
  if (sortKey) filtered.sort((a, b) => String(a[sortKey]).localeCompare(String(b[sortKey]), "zh") * sortDirection);

  tableBody.innerHTML = filtered.slice(0, 6).map((asset) => `
    <tr>
      <td class="check-cell"><input type="checkbox" aria-label="选择 ${asset.name}" /></td>
      <td><div class="asset-name"><span class="asset-icon ${asset.type === "光伏电站" ? "solar" : asset.type === "变电站" ? "station" : ""}">${asset.icon}</span><span class="asset-copy"><span>${asset.name}</span><span class="asset-id">${asset.id}</span></span></div></td>
      <td>${asset.type}</td><td>${asset.location}</td><td><span class="status-pill ${asset.statusClass}">${asset.status}</span></td><td>${asset.updated}</td><td><button class="row-menu" aria-label="${asset.name} 更多操作">•••</button></td>
    </tr>`).join("");
  emptyState.hidden = filtered.length !== 0;
  resultCount.textContent = filtered.length ? `显示 1–${Math.min(filtered.length, 6)} 条，共 ${filtered.length} 条匹配资产` : "没有匹配的资产";
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

searchInput.addEventListener("input", renderTable);
document.querySelectorAll("th[data-sort]").forEach((header) => header.addEventListener("click", () => {
  const key = header.dataset.sort;
  sortDirection = sortKey === key ? sortDirection * -1 : 1;
  sortKey = key;
  renderTable();
}));

document.querySelector("#statusFilter").addEventListener("click", (event) => {
  activeStatus = activeStatus === "全部" ? "正常运行" : activeStatus === "正常运行" ? "维护中" : activeStatus === "维护中" ? "离线" : "全部";
  event.currentTarget.innerHTML = `状态：${activeStatus} <span>⌄</span>`;
  renderTable();
});

document.querySelector("#typeFilter").addEventListener("click", () => showToast("资产类型筛选已准备就绪"));
document.querySelector("#refreshData").addEventListener("click", (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  button.innerHTML = "↻ <span>同步中...</span>";
  window.setTimeout(() => { button.disabled = false; button.innerHTML = "↻ <span>刷新数据</span>"; showToast("资产数据已更新"); }, 700);
});
document.querySelector("#newReport").addEventListener("click", () => showToast("新建报表功能即将上线"));
document.querySelector("#exportButton").addEventListener("click", () => {
  const header = "资产名称,资产编号,资产类型,所属区域,运行状态,最后更新";
  const rows = assets.map((asset) => [asset.name, asset.id, asset.type, asset.location, asset.status, asset.updated].join(","));
  const blob = new Blob(["\ufeff" + [header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob); link.download = "grid-data-assets.csv"; link.click(); URL.revokeObjectURL(link.href);
  showToast("资产数据已导出");
});
document.querySelector("#selectAll").addEventListener("change", (event) => document.querySelectorAll("#assetTableBody input[type=checkbox]").forEach((checkbox) => { checkbox.checked = event.target.checked; }));
document.querySelector("#themeToggle").addEventListener("click", () => { document.body.classList.toggle("dark"); showToast(document.body.classList.contains("dark") ? "已切换至深色模式" : "已切换至浅色模式"); });
document.querySelector("#mobileMenu").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("open"));
document.querySelectorAll(".nav-item").forEach((item) => item.addEventListener("click", () => document.querySelector("#sidebar").classList.remove("open")));
document.querySelectorAll(".page-button:not(:disabled)").forEach((button) => button.addEventListener("click", () => { document.querySelectorAll(".page-button").forEach((page) => page.classList.remove("active")); if (/^\d+$/.test(button.textContent)) button.classList.add("active"); showToast("演示页面仅展示第一页数据"); }));
renderTable();
