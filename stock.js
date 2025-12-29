/* ==========================
   CONFIG
========================== */
const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const STOCK_SHEET = "stock";
const ORDERS_SHEET = "orders";

const company = (localStorage.getItem("company") || "").toLowerCase();

/* ==========================
   FETCH BOTH SHEETS
========================== */
Promise.all([
  fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${STOCK_SHEET}`).then(r=>r.text()),
  fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${ORDERS_SHEET}`).then(r=>r.text())
])
.then(([stockText, orderText]) => {

  const stockJson = JSON.parse(stockText.substring(stockText.indexOf('{'), stockText.lastIndexOf('}')+1));
  const orderJson = JSON.parse(orderText.substring(orderText.indexOf('{'), orderText.lastIndexOf('}')+1));

  const stockMap = {};
  const deductedMap = {};

  /* ==========================
     READ STOCK
  ========================== */
  stockJson.table.rows.forEach(r=>{
    if(!r.c) return;
    const pid = r.c[0]?.v;
    const qty = Number(r.c[1]?.v || 0);
    stockMap[pid] = qty;
  });

  /* ==========================
     PROCESS PAID ORDERS
  ========================== */
  orderJson.table.rows.forEach(r=>{
    if(!r.c) return;

    const orderCompany = (r.c[3]?.v || "").toLowerCase();
    const productId = r.c[5]?.v;
    const qty = Number(r.c[6]?.v || 0);
    const status = (r.c[12]?.v || "").toLowerCase();

    if(orderCompany !== company) return;
    if(status !== "paid") return;

    if(!deductedMap[productId]){
      deductedMap[productId] = 0;
    }

    deductedMap[productId] += qty;
  });

  /* ==========================
     FINAL STOCK CALCULATION
  ========================== */
  let html = "";

  Object.keys(stockMap).forEach(pid=>{
    const original = stockMap[pid];
    const used = deductedMap[pid] || 0;
    const remaining = Math.max(0, original - used);

    html += `
      <div class="product">
        <b>Product ID:</b> ${pid}<br>
        <b>Available Qty:</b> ${remaining}<br>
        <small>Used: ${used}</small>
      </div>
    `;
  });

  document.getElementById("stockList").innerHTML =
    html || "No stock data";

})
.catch(err=>{
  console.error(err);
  document.getElementById("stockList").innerText = "Error loading stock";
});
