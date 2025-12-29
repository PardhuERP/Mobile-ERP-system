const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "orders";

const role = localStorage.getItem("role"); // safe here (only once)

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

    const statusRaw = r.c[12]?.v;
    const status = statusRaw ? String(statusRaw).toLowerCase() : "pending";

    /* ===== ADMIN / SUPER CONTROLS ===== */
    let adminButtons = "";
    if(role === "admin" || role === "super"){
      adminButtons = `
        <button style="margin-top:6px;background:#ff9800"
          onclick="editOrder('${orderId}')">
          ✏ Edit
        </button>

        <button style="margin-top:6px;background:#f44336"
          onclick="cancelOrder('${orderId}')">
          ❌ Cancel
        </button>
      `;
    }

    html += `
      <div class="order">
        <b>Order #${orderId}</b><br>
        <small>${date}</small><br><br>

        Customer: ${customer}<br>
        Product: ${product}<br>
        Qty: ${qty}<br>
        Total: ₹${total}<br>
        Paid: ₹${paid}<br>
        Balance: ₹${balance}<br><br>

        <span class="badge ${status}">
          ${status.toUpperCase()}
        </span>

        <button style="margin-top:10px;background:#25d366"
          onclick="printInvoice('${orderId}')">
          🧾 Print Invoice
        </button>

        ${adminButtons}
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

/* ===== ACTIONS ===== */

function printInvoice(orderId){
  window.open(`invoice.html?order_id=${orderId}`,"_blank");
}

function editOrder(orderId){
  location.href = `orders-edit.html?order_id=${orderId}`;
}

function cancelOrder(orderId){
  if(!confirm("Cancel this order?")) return;

  alert(
    "Cancel API step next.\nOrder ID: " + orderId
  );
}
