const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET = "orders";

fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET}`)
.then(r=>r.text())
.then(t=>{
  const j=JSON.parse(t.substring(t.indexOf("{"),t.lastIndexOf("}")+1));
  let html="";
  j.table.rows.forEach(r=>{
    if(!r.c) return;
    const id=String(r.c[0]?.v||"");
    const date=r.c[1]?.v||"";
    const cust=r.c[2]?.v||"";
    const prod=r.c[4]?.v||"";
    const qty=r.c[6]?.v||0;
    const total=r.c[7]?.v||0;
    const paid=r.c[8]?.v||0;
    const bal=r.c[9]?.v||0;
    const status=String(r.c[12]?.v||"pending").toLowerCase();

    html+=`
      <div class="order">
        <b>Order #${id}</b><br>
        ${date}<br><br>
        Customer: ${cust}<br>
        Product: ${prod}<br>
        Qty: ${qty}<br>
        Total: ₹${total}<br>
        Paid: ₹${paid}<br>
        Balance: ₹${bal}<br>
        <span class="badge ${status}">${status}</span>
      </div>`;
  });
  document.getElementById("orderList").innerHTML=html||"No orders";
})
.catch(e=>{
  console.error(e);
  document.getElementById("orderList").innerText="Error loading orders";
});
