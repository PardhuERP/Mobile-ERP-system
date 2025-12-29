const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "orders";

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

  json.table.rows.forEach(r => {
    if(!r.c) return;

    const orderId  = r.c[0]?.v || "";
    const date     = formatDate(r.c[1]?.v);
    const customer = r.c[2]?.v || "";
    const product  = r.c[4]?.v || "";
    const qty      = Number(r.c[6]?.v || 0);
    const total    = Number(r.c[7]?.v || 0);
    const paid     = Number(r.c[8]?.v || 0);
    const balance  = Number(r.c[9]?.v || 0);

    const status =
      String(r.c[12]?.v || "pending").toLowerCase();

    html += `
  <div class="order">
    <div class="order-header">
      <div class="order-id">Order #${orderId}</div>
      <div class="order-date">${date}</div>
    </div>

    <div class="order-row">
      <span>Customer</span><span>${customer}</span>
    </div>
    <div class="order-row">
      <span>Product</span><span>${product}</span>
    </div>
    <div class="order-row">
      <span>Qty</span><span>${qty}</span>
    </div>
    <div class="order-row">
      <span>Total</span><span>₹${total}</span>
    </div>
    <div class="order-row">
      <span>Paid</span><span>₹${paid}</span>
    </div>
    <div class="order-row">
      <span>Balance</span><span>₹${balance}</span>
    </div>

    <span class="badge ${status}">
      ${status.toUpperCase()}
    </span>
  </div>
`;
  });

  document.getElementById("orderList").innerHTML =
    html || "No orders found";

})
.catch(err=>{
  console.error("ORDERS LOAD ERROR:", err);
  document.getElementById("orderList").innerText =
    "Error loading orders";
});
