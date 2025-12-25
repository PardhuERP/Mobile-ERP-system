/* =========================
   REPORTS – SMART VERSION
   Source: orders sheet
========================= */

const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "orders";

const API_URL =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&t=${Date.now()}`;

fetch(API_URL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(
      text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1)
    );

    let totalOrders = 0;
    let totalSales = 0;
    let totalPaid = 0;
    let totalBalance = 0;

    json.table.rows.forEach(r => {
      if (!r.c) return;

      // Columns:
      // A order_id | B date | C customer | D product
      // E qty | F total | G paid | H balance | I status

      totalOrders += 1;
      totalSales += Number(r.c[5]?.v || 0);
      totalPaid += Number(r.c[6]?.v || 0);
      totalBalance += Number(r.c[7]?.v || 0);
    });

    document.getElementById("reportData").innerHTML = `
      <div class="card">
        Total Orders<br>
        <span class="value">${totalOrders}</span>
      </div>

      <div class="card">
        Total Sales<br>
        <span class="value">₹${totalSales}</span>
      </div>

      <div class="card">
        Total Paid<br>
        <span class="value">₹${totalPaid}</span>
      </div>

      <div class="card">
        Total Balance<br>
        <span class="value">₹${totalBalance}</span>
      </div>
    `;
  })
  .catch(err => {
    console.error(err);
    document.getElementById("reportData").innerText =
      "Error loading reports";
  });
