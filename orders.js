const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "orders";
const API_URL =
"https://script.google.com/macros/s/AKfycbzrwM8NxpGcgTpX0UUoElfs94U-CGHnFiL7S2zWtkWwGq2p2GqAbRlPOWfnpEo7hBbHFw/exec";

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
.then(res=>res.text())
.then(text=>{
  const json = JSON.parse(
    text.substring(text.indexOf("{"), text.lastIndexOf("}")+1)
  );

  let html="";

  json.table.rows.forEach(r=>{
    if(!r.c) return;

    const orderId  = r.c[0]?.v || "";
    const date     = formatDate(r.c[1]?.v);
    const customer = r.c[2]?.v || "";
    const product  = r.c[4]?.v || "";
    const qty      = Number(r.c[6]?.v||0);
    const total    = Number(r.c[7]?.v||0);
    const paid     = Number(r.c[8]?.v||0);
    const balance  = Number(r.c[9]?.v||0);

    const status = String(r.c[12]?.v||"pending").toLowerCase();

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

        <span class="badge ${status}">${status.toUpperCase()}</span>

        <div class="actions">
          <button class="edit" onclick="editOrder('${orderId}')">Edit</button>
          <button class="cancel" onclick="cancelOrder('${orderId}')">Cancel</button>
        </div>
      </div>
    `;
  });

  document.getElementById("orderList").innerHTML =
    html || "No orders found";
})
.catch(err=>{
  console.error(err);
  document.getElementById("orderList").innerText="Error loading orders";
});

/* ===== ACTIONS ===== */

function editOrder(orderId){
  const qty = prompt("New Quantity?");
  const paid = prompt("New Paid Amount?");
  const status = prompt("Status (pending/completed)?","pending");

  if(!qty || !paid) return;

  const form = new URLSearchParams();
  form.append("action","update");
  form.append("order_id",orderId);
  form.append("qty",qty);
  form.append("paid",paid);
  form.append("status",status);

  fetch(API_URL,{ method:"POST", body:form })
  .then(r=>r.json())
  .then(res=>{
    alert(res.success ? "Order updated" : res.error);
    location.reload();
  });
}

function cancelOrder(orderId){
  if(!confirm("Cancel this order?")) return;

  const form = new URLSearchParams();
  form.append("action","cancel");
  form.append("order_id",orderId);

  fetch(API_URL,{ method:"POST", body:form })
  .then(r=>r.json())
  .then(res=>{
    alert(res.success ? "Order cancelled" : res.error);
    location.reload();
  });
}
