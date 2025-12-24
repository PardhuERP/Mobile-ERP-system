/* =========================
   STOCK – DATA LOADER
   Sheet columns:
   A: product_id
   B: qty_available
   C: last_updated
========================= */

const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "stock";

const API_URL =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&t=${Date.now()}`;

fetch(API_URL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(
      text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1)
    );

    let html = "";

    json.table.rows.forEach(r => {
      if (!r.c) return;

      const productId = r.c[0]?.v || "-";
      const qty = r.c[1]?.v || 0;
      const updated = r.c[2]?.v || "-";

      html += `
        <div class="stock">
          <b>Product ID:</b> ${productId}<br>
          <b>Available Qty:</b> ${qty}<br>
          <b>Last Updated:</b> ${updated}
        </div>
      `;
    });

    document.getElementById("stockList").innerHTML =
      html || "No stock data found";

  })
  .catch(err => {
    console.error(err);
    document.getElementById("stockList").innerText =
      "Error loading stock data";
  });
