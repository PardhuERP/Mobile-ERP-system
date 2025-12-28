const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";

const PRODUCTS_SHEET = "products";
const STOCK_SHEET = "stock";

/* Fetch both sheets */
Promise.all([
  fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${PRODUCTS_SHEET}`)
    .then(r => r.text()),
  fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${STOCK_SHEET}`)
    .then(r => r.text())
])
.then(([pText, sText]) => {

  const productsJSON = JSON.parse(
    pText.substring(pText.indexOf('{'), pText.lastIndexOf('}') + 1)
  );
  const stockJSON = JSON.parse(
    sText.substring(sText.indexOf('{'), sText.lastIndexOf('}') + 1)
  );

  /* Build product map */
  const productMap = {};
  productsJSON.table.rows.forEach(r => {
    if(!r.c) return;
    productMap[r.c[0].v] = {
      name: r.c[1].v,
      category: r.c[4].v,
      active: (r.c[5].v || "").toLowerCase()
    };
  });

  let html = "";

  stockJSON.table.rows.forEach(r => {
    if(!r.c) return;

    const productId = r.c[0]?.v;
    const qty = r.c[1]?.v;
    const updated = r.c[2]?.v;

    const product = productMap[productId];
    if(!product || product.active !== "yes") return;

    html += `
      <div class="stock">
        <b>${product.name}</b><br>
        Category: ${product.category}<br>
        Available Qty: ${qty}<br>
        <span class="small">Updated: ${updated}</span>
      </div>
    `;
  });

  document.getElementById("stockList").innerHTML =
    html || "No stock data available";

})
.catch(() => {
  document.getElementById("stockList").innerText =
    "Error loading stock data";
});
