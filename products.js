const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "products";

fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&t=${Date.now()}`)
.then(res => res.text())
.then(text => {

  const json = JSON.parse(
    text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1)
  );

  let html = "";

  json.table.rows.forEach(r=>{
    if(!r.c) return;

    const status = (r.c[8]?.v || "").toLowerCase();
    if(status !== "active") return;

    html += `
      <div class="product">
        <div><span class="label">Product</span><br>
        <span class="value">${r.c[1]?.v || ""}</span></div><br>

        <div><span class="label">HSN</span> : ${r.c[3]?.v || "-"}</div>
        <div><span class="label">Unit</span> : ${r.c[4]?.v || "-"}</div>
        <div><span class="label">Purchase</span> : ₹${r.c[5]?.v || 0}</div>
        <div><span class="label">Sales</span> : ₹${r.c[6]?.v || 0}</div>
        <div><span class="label">GST</span> : ${r.c[7]?.v || 0}%</div>
      </div>
    `;
  });

  document.getElementById("productList").innerHTML =
    html || "No active products";

})
.catch(()=>{
  document.getElementById("productList").innerText =
    "Error loading products";
});
