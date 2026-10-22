const $=id=>document.getElementById(id);
const WEEKS=["Introduction, History & Definitions","Bird's-Eye View of a VR System","Geometry of Virtual Worlds","Light & Optics","Human Eye & Vision","Visual Perception & Depth","Visual Rendering","Audio, Other Senses & Sickness","Tracking","Interaction & Locomotion","Evaluation & Applications","AR/MR/XR & Frontiers"];
WEEKS.forEach((n,i)=>$("wk").add(new Option(`Week ${i+1}: ${n}`,i+1)));
$("wk").add(new Option("All weeks (full mock exam)","0"),0);$("wk").value="0";
let L=[],i=0,score=0,done=false,log=[];
const shuf=a=>{a=a.slice();for(let k=a.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[a[k],a[j]]=[a[j],a[k]]}return a};
function start(){
 const w=+$("wk").value,c=$("cnt").value;
 let pool=QUESTIONS.filter(q=>!w||q[0]===w);
 L=shuf(pool);if(c!=="all")L=L.slice(0,+c);
 i=0;score=0;log=[];["home","end"].forEach(x=>$(x).classList.add("hide"));$("quiz").classList.remove("hide");show();
}
function home(){$("end").classList.add("hide");$("home").classList.remove("hide")}
function show(){
 done=false;const[w,q,o]=L[i];
 $("wtag").textContent=`Week ${w}`;$("prog").textContent=`Question ${i+1} of ${L.length}`;
 $("fill").style.width=(i/L.length*100)+"%";$("q").textContent=`${i+1}. ${q}`;
 $("sc").textContent=`Score: ${score}`;$("exp").classList.add("hide");$("next").classList.add("hide");
 $("opts").innerHTML="";
 L[i].opts=shuf(o.map((t,k)=>({t,ok:k===0})));
 L[i].opts.forEach((op,k)=>{const b=document.createElement("button");b.className="opt";
  b.textContent=String.fromCharCode(65+k)+".  "+op.t;b.onclick=()=>pick(k);$("opts").appendChild(b)});
}
function pick(k){
 if(done)return;done=true;const q=L[i],bs=$("opts").children,right=q.opts[k].ok;
 if(right)score++;
 q.opts.forEach((op,j)=>{bs[j].disabled=true;if(op.ok)bs[j].classList.add("ok");else if(j===k)bs[j].classList.add("no")});
 const ans=q.opts.find(o=>o.ok).t;
 $("exp").innerHTML=`<b>${right?"✅ Correct!":"❌ Incorrect."}</b> Correct answer: <b>${ans}</b><br>${q[3]}`;
 $("exp").classList.remove("hide");$("sc").textContent=`Score: ${score}`;
 log.push({q:q[1],ok:right,ans,pick:q.opts[k].t});
 $("next").textContent=i===L.length-1?"Finish":"Next →";$("next").classList.remove("hide");
}
function next(){if(++i<L.length)show();else finish()}
function finish(){
 $("quiz").classList.add("hide");$("end").classList.remove("hide");
 const p=Math.round(score/L.length*100);
 $("final").textContent=`${score} / ${L.length} (${p}%)`;
 $("msg").textContent=p>=75?"Excellent – you're exam ready!":p>=50?"Good, revise the missed topics.":"Keep practising – review the explanations below.";
 const miss=log.filter(x=>!x.ok);
 $("review").innerHTML=miss.length?"<h3>Review your mistakes</h3>"+miss.map(x=>`<p><b>${x.q}</b><br><span style="color:var(--no)">Your answer: ${x.pick}</span><br><span style="color:var(--ok)">Correct: ${x.ans}</span></p>`).join(""):"<p>🎉 Perfect score!</p>";
}
