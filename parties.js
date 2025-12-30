const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "parties";

fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&t=${Date.now()}`)
.then(res => res.text())
.then(text => {

  const json = JSON.parse(
    text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1)
  );

  let html = "";

  json.table.rows.forEach(r => {
    if(!r.c) return;

    const id     = r.c[0]?.v || "";
    const name   = r.c[1]?.v || "";
    const type   = r.c[2]?.v || "";
    const phone  = r.c[3]?.v || "";
    const email  = r.c[4]?.v || "";
    const bal    = Number(r.c[7]?.v || 0);
    const status = String(r.c[8]?.v || "active").toLowerCase();

    html += `
      <div class="party">
        <b>${name}</b><br><br>

        Party ID: ${id}<br>
        Type: ${type}<br>
        Phone: ${phone}<br>
        Balance: ₹${bal}<br><br>

        <span class="badge ${status}">
          ${status.toUpperCase()}
        </span>
      </div>
    `;
  });

  document.getElementById("partyList").innerHTML =
    html || "No parties found";

})
.catch(err=>{
  console.error("PARTY LOAD ERROR:", err);
  document.getElementById("partyList").innerText =
    "Error loading parties";
});
