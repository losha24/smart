const skPool = [
    {n:"נהיגה", c:5000}, {n:"נשק", c:12000}, {n:"חובש", c:18000}, {n:"ניהול", c:35000}, {n:"JS", c:50000}, 
    {n:"כלכלה", c:85000}, {n:"שיווק", c:120000}, {n:"סייבר", c:250000}, {n:"נדלן", c:500000}, {n:"טיס", c:1200000}
];

const jobs = [
    {n:"שליח", p:450, t:4, s:null}, {n:"מאבטח", p:1400, t:10, s:"נשק"}, {n:"חובש", p:2200, t:12, s:"חובש"},
    {n:"מנהל משמרת", p:4000, t:15, s:"ניהול"}, {n:"מתכנת", p:12000, t:30, s:"JS"}, {n:"אנליסט", p:25000, t:40, s:"כלכלה"},
    {n:"איש סייבר", p:45000, t:50, s:"סייבר"}, {n:"סוחר נדלן", p:80000, t:60, s:"נדלן"}, {n:"טייס", p:150000, t:90, s:"טיס"}, {n:"יזם", p:500000, t:120, s:"ניהול"}
];

function drawWork(c) {
    c.innerHTML = `<div class="card"><div class="xpbar"><div id="wb"></div></div><small>מהירות נסיעה: x${carSpeed.toFixed(1)}</small></div><div class="grid-2"></div>`;
    jobs.forEach(j => {
        const has = !j.s || skills.includes(j.s);
        c.querySelector(".grid-2").innerHTML += `<div class="card" style="opacity:${has?1:0.6}"><b>${j.n}</b><br>
        <button class="action" onclick="startWork(${j.p},${j.t})" ${!has||working?'disabled':''}>${has?j.p+'₪':'חסר '+j.s}</button></div>`;
    });
}

function startWork(p, t) {
    if(working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    const actualTime = t / carSpeed; // הזמן מתקצר לפי מהירות הרכב
    let i = setInterval(() => {
        s += 0.1; if(bar) bar.style.width = (s/actualTime*100) + "%";
        if(s >= actualTime) {
            clearInterval(i); working = false; money += p; totalEarned += p; passive += (p*0.0005);
            showMsg(`הרווחת ${p}₪!`); updateUI(); openTab('work');
        }
    }, 100);
}

function learn(n, c) { if(money>=c && !skills.includes(n)) { money-=c; skills.push(n); passive += (c*0.001); showMsg(`למדת ${n}`); updateUI(); openTab('skills'); } }
