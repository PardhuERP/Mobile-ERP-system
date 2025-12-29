const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "orders";
const role = localStorage.getItem("role");

function formatDate(v){
  if(!v) return "";
  if(typeof v === "string") return v;
  if(v.getFullYear){
    return v.getFullYear()+"-"+String(v.getMonth()+1).padStart(2,"0")+"-"+String(v.getDate()).padStart(2,"0");
  }
  return "";
}

fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`)
.then(res => res.text())
.then(text => {
  const json = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}")+1));
  let html = "";

  json.table.rows.forEach(r=>{
    if(!r.c) return;

    const orderId  = r.c[0]?.v || "";
    const date     = formatDate(r.c[1]?.v);
    const customer = r.c[2]?.v || "";
    const product  = r.c[4]?.v || "";
    const qty      = r.c[6]?.v || 0;
    const total    = r.c[7]?.v || 0;
    const paid     = r.c[8]?.v || 0;
    const balance  = r.c[9]?.v || 0;
    const status   = String(r.c[12]?.v || "pending").toLowerCase();

    let actions = "";
    if(role === "admin" || role === "super"){
      actions = `
        <div class="actions">
          <button onclick="editOrder('${orderId}')">Edit</button>
          <button onclick="cancelOrder('${orderId}')">Cancel</button>
        </div>
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
        Balance: ₹${balance}<br>
        <span class="badge ${status}">${status.toUpperCase()}</span>
        ${actions}
      </div>
    `;
  });

  document.getElementById("orderList").innerHTML = html || "No orders";
})
.catch(err=>{
  console.error(err);
  document.getElementById("orderList").innerText = "Error loading orders";
});

function editOrder(id){
  if(role !== "admin" && role !== "super"){
    alert("Permission denied");
    return;
  }
  alert("Edit order: " + id);
}

function cancelOrder(id){
  if(role !== "admin" && role !== "super"){
    alert("Permission denied");
    return;
  }
  alert("Cancel order: " + id);
}
