const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "products";

function formatDate(v){
  if(!v) return "";
  if(typeof v === "string") return v;
  if(v.getFullYear){
    return `${v.getFullYear()}-${String(v.getMonth()+1).padStart(2,"0")}-${String(v.getDate()).padStart(2,"0")}`;
  }
  return "";
}

fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&t=${Date.now()}`)
.then(res => res.text())
.then(text => {

  const json = JSON.parse(
    text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1)
  );

  let html = "";

  json.table.rows.forEach((r, i) => {
    if(!r.c || i === 0) return; // skip header

    const productId   = r.c[0]?.v ?? "";
    const name        = r.c[1]?.v ?? "";
    const desc        = r.c[2]?.v ?? "";
    const hsn         = r.c[3]?.v ?? "";
    const unit        = r.c[4]?.v ?? "";
    const buyPrice    = Number(r.c[5]?.v ?? 0);
    const salePrice   = Number(r.c[6]?.v ?? 0);
    const gst         = Number(r.c[7]?.v ?? 0);
    const stock       = Number(r.c[11]?.v ?? 0);
    const category    = r.c[12]?.v ?? "";
    const activeRaw   = String(r.c[13]?.v ?? "no").toLowerCase();

    const statusClass = activeRaw === "yes" ? "active" : "inactive";
    const statusText  = activeRaw === "yes" ? "ACTIVE" : "INACTIVE";

    html += `
      <div class="product">
        <b>${name}</b><br>
        <small>${desc}</small><br><br>

        Product ID: ${productId}<br>
        Category: ${category}<br>
        HSN: ${hsn}<br>
        Unit: ${unit}<br><br>

        Purchase: ₹${buyPrice}<br>
        Sales: ₹${salePrice}<br>
        GST: ${gst}%<br>
        Stock: ${stock}<br><br>

        <span class="badge ${statusClass}">
          ${statusText}
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
