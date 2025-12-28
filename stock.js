/* =========================
   STOCK – SMART ERP VERSION
========================= */

const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";

const STOCK_SHEET = "stock";
const PRODUCT_SHEET = "Products";

async function fetchSheet(sheetName) {
  const url =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}&t=${Date.now()}`;
  const res = await fetch(url);
  const text = await res.text();
  return JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
}

(async () => {
  try {
    const stockJson = await fetchSheet(STOCK_SHEET);
    const productJson = await fetchSheet(PRODUCT_SHEET);

    // Build product lookup
    const productMap = {};
    productJson.table.rows.forEach(r => {
      if (!r.c) return;
      productMap[r.c[0]?.v] = {
        name: r.c[1]?.v || "Unknown",
        category: r.c[4]?.v || "-"
      };
    });

    let html = "";

json.table.rows.forEach((r, index) => {
  if(index === 0 || !r.c) return;

  const productId = r.c[0]?.v || "-";
  const qty = r.c[1]?.v || 0;
  const updated = r.c[2]?.v || "-";

  html += `
    <div class="stock-item">
      <b>Product ID:</b> ${productId}<br>
      <b>Available Qty:</b> ${qty}<br>
      <b>Updated:</b> ${updated}
    </div>
  `;
});

document.getElementById("stockList").innerHTML =
  html || "No stock data";
