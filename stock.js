/* ===============================
   PARDHU ERP – STOCK MODULE
   READ ONLY (AUTO CALCULATED)
================================ */

const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "stock";

/* ===== FETCH STOCK DATA ===== */
fetch(
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&t=${Date.now()}`
)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(
      text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1)
    );

    let html = "";

    json.table.rows.forEach(r => {
      if (!r.c) return;

      /*
        stock sheet columns:
        A = product_id
        B = opening_stock
        C = sold_qty
        D = available_qty
        E = last_updated
      */

      const productId = r.c[0]?.v ?? "-";
      const opening   = r.c[1]?.v ?? 0;
      const sold      = r.c[2]?.v ?? 0;
      const available = r.c[3]?.v ?? 0;
      const updated   = r.c[4]?.v ?? "-";

      html += `
        <div class="product">
          <b>Product ID:</b> ${productId}<br>
          Opening Stock: ${opening}<br>
          Sold Qty: ${sold}<br>
          <b>Available Qty:</b> ${available}<br>
          <small>Updated: ${updated}</small>
        </div>
      `;
    });

    document.getElementById("stockList").innerHTML =
      html || "No stock data available";

  })
  .catch(err => {
    console.error(err);
    document.getElementById("stockList").innerText =
      "Error loading stock data";
  });
