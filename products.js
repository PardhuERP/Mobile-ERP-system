const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "products";

fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&t=${Date.now()}`)
.then(res => res.text())
.then(text => {

  const json = JSON.parse(
    text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1)
  );

  let html = "";

  json.table.rows.forEach(r => {
    if(!r.c) return;

    const productId      = r.c[0]?.v || "";
    const name           = r.c[1]?.v || "";
    const description    = r.c[2]?.v || "";
    const hsn            = r.c[3]?.v || "";
    const unit           = r.c[4]?.v || "";
    const purchasePrice  = r.c[5]?.v || 0;
    const salesPrice     = r.c[6]?.v || 0;
    const gst            = r.c[7]?.v || 0;
    const statusRaw      = r.c[8]?.v || "inactive";

    const status = String(statusRaw).toLowerCase() === "active"
      ? "active"
      : "inactive";

    html += `
      <div class="product">
        <b>${name}</b><br><br>

        Product ID: ${productId}<br>
        HSN Code: ${hsn}<br>
        Unit: ${unit}<br>
        Purchase Price: ₹${purchasePrice}<br>
        Sales Price: ₹${salesPrice}<br>
        GST: ${gst}%<br><br>

        <span class="badge ${status}">
          ${status.toUpperCase()}
        </span>
      </div>
    `;
  });

  document.getElementById("productList").innerHTML =
    html || "No products found";

})
.catch(err=>{
  console.error("PRODUCT LOAD ERROR:", err);
  document.getElementById("productList").innerText =
    "Error loading products";
});
