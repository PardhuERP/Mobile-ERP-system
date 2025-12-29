/* ==========================
   CONFIG
========================== */
const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const ORDERS_SHEET = "orders";

const company = (localStorage.getItem("company") || "").toLowerCase();

/* ==========================
   FETCH ORDERS
========================== */
fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${ORDERS_SHEET}&t=${Date.now()}`)
.then(res => res.text())
.then(text => {

  const json = JSON.parse(
    text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1)
  );

  const daily = {};
  const monthly = {};

  json.table.rows.forEach(r=>{
    if(!r.c) return;

    const date = r.c[1]?.v;
    const rowCompany = (r.c[3]?.v || "").toLowerCase();
    const total = Number(r.c[7]?.v || 0);
    const paid = Number(r.c[8]?.v || 0);
    const balance = Number(r.c[9]?.v || 0);

    if(rowCompany !== company) return;

    const dayKey = date;
    const monthKey = date?.substring(0,7); // YYYY-MM

    if(!daily[dayKey]){
      daily[dayKey] = {orders:0,sales:0,paid:0,balance:0};
    }

    if(!monthly[monthKey]){
      monthly[monthKey] = {orders:0,sales:0,paid:0,balance:0};
    }

    daily[dayKey].orders++;
    daily[dayKey].sales += total;
    daily[dayKey].paid += paid;
    daily[dayKey].balance += balance;

    monthly[monthKey].orders++;
    monthly[monthKey].sales += total;
    monthly[monthKey].paid += paid;
    monthly[monthKey].balance += balance;
  });

  let html = "<h3>Daily Reports</h3>";

  Object.keys(daily).forEach(d=>{
    const r = daily[d];
    html += `
      <div class="report">
        <b>Date:</b> ${d}<br>
        Orders: ${r.orders}<br>
        Sales: ₹${r.sales}<br>
        Paid: ₹${r.paid}<br>
        Balance: ₹${r.balance}
      </div>
    `;
  });

  html += "<h3>Monthly Reports</h3>";

  Object.keys(monthly).forEach(m=>{
    const r = monthly[m];
    html += `
      <div class="report">
        <b>Month:</b> ${m}<br>
        Orders: ${r.orders}<br>
        Sales: ₹${r.sales}<br>
        Paid: ₹${r.paid}<br>
        Balance: ₹${r.balance}
      </div>
    `;
  });

  document.getElementById("reportList").innerHTML =
    html || "No reports";

})
.catch(()=>{
  document.getElementById("reportList").innerText =
    "Error loading reports";
});
