const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "employees";

const API_URL =
`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&t=${Date.now()}`;

async function login(){
  const u = document.getElementById("user").value.trim().toLowerCase();
  const p = document.getElementById("pin").value.trim();
  const err = document.getElementById("err");

  err.style.display = "none";

  try{
    const res = await fetch(API_URL);
    const text = await res.text();
    const json = JSON.parse(
      text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1)
    );

    for(const r of json.table.rows){
      if(!r.c) continue;

      const username = (r.c[0]?.v || "").toString().trim().toLowerCase();
      const pin = (r.c[1]?.v || "").toString().trim();
      const role = (r.c[2]?.v || "").toString().trim().toLowerCase();
      const company = (r.c[3]?.v || "").toString().trim();
      const modules = (r.c[4]?.v || "").toString().trim().toLowerCase();
      const status = (r.c[5]?.v || "").toString().trim().toLowerCase();

      if(status !== "active") continue;

      if(username === u && pin === p){
        localStorage.setItem("user", username);
        localStorage.setItem("role", role);
        localStorage.setItem("company", company);
        localStorage.setItem("modules", modules);
        window.location.href = "dashboard.html";
        return;
      }
    }

    err.style.display = "block";

  }catch(e){
    console.error(e);
    err.style.display = "block";
  }
}
