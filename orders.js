const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "orders";

function formatDate(v){
  if(!v) return "";
  if(typeof v === "string") return v;
  if(v.getFullYear){
    const y = v.getFullYear();
    const m = String(v.getMonth()+1).padStart(2,"0");
    const d = String(v.getDate()).padStart(2,"0");
    return `${y}-${m}-${d}`;
  }
  return "";
}

fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&t=${Date.now()}`)
.then(res => res.text())
.then(text => {

  const json = JSON.parse(
    text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1)
  );

  /* ===== MAP HEADERS TO INDEX ===== */
  const headers = json.table.cols.map(c => c.label.toLowerCase());
  const idx = name => headers.indexOf(name);

  let html = "";

  json.table.rows.forEach(r => {
    if(!r.c) return;

    const orderId  = r.c[idx("order_id")]?.v || "";
    const date     = formatDate(r.c[idx("date")]?.v);
    const customer = r.c[idx("customer")]?.v || "";
    const product  = r.c[idx("product")]?.v || "";
    const qty      = Number(r.c[idx("qty")]?.v || 0);
    const total    = Number(r.c[idx("total")]?.v || 0);
    const paid     = Number(r.c[idx("paid")]?.v || 0);
    const balance  = Number(r.c[idx("balance")]?.v || 0);

    const statusRaw = r.c[idx("status")]?.v;
    const status = statusRaw ? String(statusRaw).toLowerCase() : "pending";

    html += `
      <div class="order">
        <b>Order #${orderId}</b><br>
        <small>${date}</small><br><br>

        Customer: ${customer}<br>
        Product: ${product}<br>
        Qty: ${qty}<br>
        Total: ₹${total}<br>
        Paid: ₹${paid}<br>
        Balance: ₹${balance}<br>

        <span class="badge ${status}">
          ${status.toUpperCase()}
        </span>
      </div>
    `;
  });

  document.getElementById("orderList").innerHTML =
    html || "No orders found";

})
.catch(err => {
  console.error("ORDERS LOAD ERROR:", err);
  document.getElementById("orderList").innerText =
    "Error loading orders";
});
