/* ================= CONFIG ================= */
const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "orders";

/* ================= READ SESSION (NO REDECLARE) ================= */
const userRole   = localStorage.getItem("role");
const company    = (localStorage.getItem("company") || "").toLowerCase();
const modulesRaw = (localStorage.getItem("modules") || "").toLowerCase();

/* ================= CREATE ORDER BUTTON ================= */
const actionBox = document.getElementById("orderActions");
if (actionBox && (modulesRaw === "all" || modulesRaw.includes("orders"))) {
  actionBox.innerHTML = `
    <button onclick="location.href='orders-create.html'">
      ➕ Create Order
    </button>
  `;
}

/* ================= DATE FORMAT ================= */
function formatDate(v){
  if(!v) return "";
  if(typeof v === "string") return v;
  if(v.getFullYear){
    return `${v.getFullYear()}-${String(v.getMonth()+1).padStart(2,"0")}-${String(v.getDate()).padStart(2,"0")}`;
  }
  return "";
}

/* ================= LOAD ORDERS ================= */
fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&t=${Date.now()}`)
.then(res => res.text())
.then(text => {

  const json = JSON.parse(
    text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1)
  );

  let html = "";

  json.table.rows.forEach(r => {
    if(!r.c) return;

    /*
    A order_id
    B date
    C customer
    D company
    E product
    F product_id
    G qty
    H total
    I paid
    J balance
    K payment_mode
    L order_type
    M status
    N created_by
    O last_updated
    */

    const orderId   = r.c[0]?.v || "";
    const date      = formatDate(r.c[1]?.v);
    const customer  = r.c[2]?.v || "";
    const rowCompany= (r.c[3]?.v || "").toLowerCase();
    const product   = r.c[4]?.v || "";
    const qty       = Number(r.c[6]?.v || 0);
    const total     = Number(r.c[7]?.v || 0);
    const paid      = Number(r.c[8]?.v || 0);
    const balance   = Number(r.c[9]?.v || 0);
    const status    = String(r.c[12]?.v || "pending").toLowerCase();

    // Staff/admin: only own company | Super: all
    if(userRole !== "super" && rowCompany !== company) return;

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
