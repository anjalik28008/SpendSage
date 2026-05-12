"use client";
import { useState, useEffect } from "react";

const TOOLS = [
  { id:"cursor", name:"Cursor", cat:"coding", plans:[
    {id:"hobby",label:"Hobby",price:0},{id:"pro",label:"Pro",price:20},
    {id:"business",label:"Business",price:40},{id:"enterprise",label:"Enterprise",price:60}
  ]},
  { id:"github_copilot", name:"GitHub Copilot", cat:"coding", plans:[
    {id:"individual",label:"Individual",price:10},{id:"business",label:"Business",price:19},
    {id:"enterprise",label:"Enterprise",price:39}
  ]},
  { id:"claude", name:"Claude (Anthropic)", cat:"mixed", plans:[
    {id:"free",label:"Free",price:0},{id:"pro",label:"Pro",price:20},
    {id:"max5",label:"Max (5×)",price:100},{id:"max20",label:"Max (20×)",price:200},
    {id:"team",label:"Team",price:30},{id:"enterprise",label:"Enterprise",price:60},
    {id:"api",label:"API Direct",price:0}
  ]},
  { id:"chatgpt", name:"ChatGPT (OpenAI)", cat:"mixed", plans:[
    {id:"free",label:"Free",price:0},{id:"plus",label:"Plus",price:20},
    {id:"pro",label:"Pro",price:200},{id:"team",label:"Team",price:30},
    {id:"enterprise",label:"Enterprise",price:60},{id:"api",label:"API Direct",price:0}
  ]},
  { id:"anthropic_api", name:"Anthropic API", cat:"mixed", plans:[
    {id:"api",label:"API Direct (pay-as-you-go)",price:0}
  ]},
  { id:"openai_api", name:"OpenAI API", cat:"mixed", plans:[
    {id:"api",label:"API Direct (pay-as-you-go)",price:0}
  ]},
  { id:"gemini", name:"Gemini (Google)", cat:"mixed", plans:[
    {id:"free",label:"Free",price:0},{id:"advanced",label:"Advanced",price:19.99},
    {id:"business",label:"Business",price:22},{id:"api",label:"API Direct",price:0}
  ]},
  { id:"windsurf", name:"Windsurf", cat:"coding", plans:[
    {id:"free",label:"Free",price:0},{id:"pro",label:"Pro",price:15},{id:"teams",label:"Teams",price:35}
  ]},
];

const USE_CASES = [
  {id:"coding",label:"💻 Coding"},
  {id:"writing",label:"✍️ Writing"},
  {id:"data",label:"📊 Data"},
  {id:"research",label:"🔍 Research"},
  {id:"mixed",label:"🔀 Mixed"},
];

type Entry = { toolId:string; enabled:boolean; plan:string; seats:number; spend:number };
type AuditResult = { toolId:string; toolName:string; plan:string; monthlyActual:number; action:string; reason:string; saving:number };
type Audit = { results:AuditResult[]; totalSaving:number };

function runAudit(entries:Entry[], teamSize:number, useCase:string):Audit {
  const results:AuditResult[] = [];
  let totalSaving = 0;
  for (const e of entries) {
    if (!e.enabled) continue;
    const tool = TOOLS.find(t=>t.id===e.toolId);
    const plan = tool?.plans.find(p=>p.id===e.plan);
    const monthlyActual = e.spend>0 ? e.spend : (plan?.price??0)*(e.seats||1);
    let action="optimal", reason="", saving=0;
    if (e.toolId==="cursor") {
      if (e.plan==="enterprise"&&teamSize<=5){action="downgrade";saving=e.seats*20;reason="Enterprise for ≤5 people is redundant — Business has identical AI at $40/seat, saving $20/seat/month.";}
      else if (e.plan==="business"&&teamSize<=2){action="downgrade";saving=e.seats*20;reason="Business plan for ≤2 users is unnecessary. Two Pro plans at $20/seat is cheaper.";}
      else if (e.plan==="pro"&&useCase!=="coding"){action="reconsider";saving=0;reason="Cursor is coding-optimised. For non-coding work, Claude Pro or ChatGPT Plus delivers broader value.";}
      else{reason="Cursor Pro is well-priced for a developer at this team size.";}
    } else if (e.toolId==="github_copilot") {
      if (e.plan==="enterprise"&&teamSize<=10){action="downgrade";saving=e.seats*20;reason="Enterprise adds audit logs not needed at this scale. Business at $19/seat saves $20/seat/month.";}
      else if (e.plan==="business"&&e.seats===1){action="downgrade";saving=9;reason="Solo Business plan costs $19/mo — Individual at $10/mo is identical for a single user.";}
      else if (useCase!=="coding"){action="reconsider";saving=monthlyActual;reason="Copilot is code-centric. For writing or research, ChatGPT Plus or Claude Pro provides more value.";}
      else{reason="GitHub Copilot is correctly sized for this team and use case.";}
    } else if (e.toolId==="claude") {
      if (e.plan==="max20"&&teamSize<=2){action="downgrade";saving=e.seats*100;reason="Max (20×) is overkill for small teams. Max (5×) covers 95% of workflows at half the cost.";}
      else if (e.plan==="team"&&teamSize<=2){action="downgrade";saving=e.seats*10;reason="Team plan at $30/seat — two Pro plans at $20 each is cheaper for very small teams.";}
      else if (e.plan==="enterprise"&&teamSize<=5){action="review";saving=e.seats*30;reason="Enterprise SSO and audit logs are overkill for ≤5 users. Team plan covers the core features.";}
      else{reason="Claude plan looks appropriate for this team size and use case.";}
    } else if (e.toolId==="chatgpt") {
      if (e.plan==="pro"){action="review";saving=180;reason="ChatGPT Pro ($200/mo) is only justified by daily o1 Pro usage. Plus at $20 covers 90% of workflows.";}
      else if (e.plan==="team"&&teamSize<=2){action="downgrade";saving=e.seats*10;reason="Two Plus plans at $20/seat is cheaper than Team pricing for very small groups.";}
      else{reason="ChatGPT plan appears well-matched to team size and use case.";}
    } else if (e.toolId==="gemini") {
      if (e.plan==="business"&&teamSize<=3){action="downgrade";saving=e.seats*2;reason="Gemini Business for ≤3 users — Advanced at $19.99/user is functionally identical.";}
      else{reason="Gemini plan looks appropriate for your team.";}
    } else if (e.toolId==="windsurf") {
      if (e.plan==="teams"&&teamSize<=3){action="downgrade";saving=e.seats*20;reason="Teams plan for ≤3 devs — individual Pro plans at $15/seat save $20/seat/month.";}
      else{reason="Windsurf plan is well-sized. Competitive vs Cursor Pro at $20/mo.";}
    } else if (e.toolId==="anthropic_api"||e.toolId==="openai_api") {
      if (monthlyActual>500&&teamSize<=10){action="review";saving=Math.round(monthlyActual*0.15);reason=`API spend of $${monthlyActual}/mo is above typical benchmarks. Audit model selection — smaller models can cut costs 60–80%.`;}
      else{reason="API spend looks reasonable for this team size.";}
    }
    if (!reason) reason="Spend looks appropriate for this configuration.";
    totalSaving+=Math.max(0,saving);
    results.push({toolId:e.toolId,toolName:tool?.name||e.toolId,plan:plan?.label||e.plan,monthlyActual,action,reason,saving:Math.max(0,saving)});
  }
  return {results,totalSaving};
}

function fallbackSummary(audit:Audit,teamSize:number,useCase:string):string {
  const n=audit.results.filter(r=>r.action!=="optimal").length;
  if (audit.totalSaving===0) return `Your ${teamSize}-person ${useCase} team's AI stack is well-calibrated with no significant overspend detected. Revisit this audit as your team grows.`;
  const top=audit.results.find(r=>r.saving>0);
  return `Your ${teamSize}-person ${useCase} team has $${audit.totalSaving}/month ($${audit.totalSaving*12}/year) in recoverable AI spend across ${n} tool${n!==1?"s":""} with actionable improvements. ${top?`The fastest win: ${top.toolName} — ${top.reason.split(".")[0]}.`:""} Start there.`;
}

export default function SpendSage() {
  const [step,setStep]=useState("setup");
  const [teamSize,setTeamSize]=useState(8);
  const [useCase,setUseCase]=useState("mixed");
  const [companyName,setCompanyName]=useState("");
  const [entries,setEntries]=useState<Entry[]>(TOOLS.map(t=>({toolId:t.id,enabled:false,plan:t.plans[0].id,seats:1,spend:0})));
  const [audit,setAudit]=useState<Audit|null>(null);
  const [summary,setSummary]=useState("");
  const [summaryLoading,setSummaryLoading]=useState(false);
  const [email,setEmail]=useState("");
  const [captured,setCaptured]=useState(false);
  const [copied,setCopied]=useState(false);
  const shareId=useState(()=>Math.random().toString(36).slice(2,10))[0];

  useEffect(()=>{
    try{const s=localStorage.getItem("spendsage");if(s){const d=JSON.parse(s);setTeamSize(d.teamSize||8);setUseCase(d.useCase||"mixed");setCompanyName(d.companyName||"");setEntries(d.entries||entries);}}catch(e){}
  },[]);

  function save(ts:number,uc:string,cn:string,en:Entry[]){
    try{localStorage.setItem("spendsage",JSON.stringify({teamSize:ts,useCase:uc,companyName:cn,entries:en}));}catch(e){}
  }

  function toggleTool(toolId:string){
    const next=entries.map(e=>e.toolId===toolId?{...e,enabled:!e.enabled}:e);
    setEntries(next);save(teamSize,useCase,companyName,next);
  }
  function updateEntry(toolId:string,field:string,value:string|number){
    const next=entries.map(e=>e.toolId===toolId?{...e,[field]:value}:e);
    setEntries(next);save(teamSize,useCase,companyName,next);
  }

  const totalSpend=entries.filter(e=>e.enabled).reduce((s,e)=>{
    const tool=TOOLS.find(t=>t.id===e.toolId);
    const plan=tool?.plans.find(p=>p.id===e.plan);
    return s+(e.spend>0?e.spend:(plan?.price??0)*(e.seats||1));
  },0);

  async function generateSummary(a:Audit){
    setSummaryLoading(true);
    const top=a.results.find(r=>r.saving>0);
    const prompt=`You are a concise AI spend advisor. Write a 90-100 word personalized audit summary for a ${teamSize}-person ${useCase} team. Total monthly savings: $${a.totalSaving}. ${top?`Biggest opportunity: ${top.toolName} — ${top.reason} (saves $${top.saving}/month).`:"Spend is well-optimized."} Rules: address as "your team"; cite dollar amounts; no bullets; end with one concrete next step. No preamble.`;
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:300,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      const text=data?.content?.[0]?.text;
      setSummary(text&&text.length>30?text:fallbackSummary(a,teamSize,useCase));
    }catch(e){setSummary(fallbackSummary(a,teamSize,useCase));}
    setSummaryLoading(false);
  }

  const BADGES:Record<string,{cls:string;icon:string;label:string}>={
    optimal:{cls:"bg-green-50 text-green-700 border border-green-200",icon:"✓",label:"Optimal"},
    downgrade:{cls:"bg-yellow-50 text-yellow-700 border border-yellow-200",icon:"↓",label:"Downgrade"},
    consider:{cls:"bg-blue-50 text-blue-700 border border-blue-200",icon:"→",label:"Consider"},
    reconsider:{cls:"bg-purple-50 text-purple-700 border border-purple-200",icon:"⚑",label:"Reconsider"},
    review:{cls:"bg-red-50 text-red-700 border border-red-200",icon:"!",label:"Review"},
  };

  const BORDER:Record<string,string>={optimal:"border-green-200",downgrade:"border-yellow-300",consider:"border-blue-200",reconsider:"border-purple-200",review:"border-red-200"};

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">◈</div>
              <span className="font-extrabold text-lg text-slate-800 tracking-tight">SpendSage</span>
              <span className="text-xs text-slate-400">by Credex</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Free AI spend audit — 2 minutes, no login</p>
          </div>
          <div className="flex gap-1.5">
            {["setup","tools","audit"].map((s,i)=>(
              <div key={s} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${step===s?"bg-indigo-600 text-white":["setup","tools","audit"].indexOf(step)>i?"bg-green-100 text-green-700":"bg-slate-100 text-slate-400"}`}>
                <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px]">{["setup","tools","audit"].indexOf(step)>i?"✓":i+1}</span>
                {s.charAt(0).toUpperCase()+s.slice(1)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* SETUP */}
        {step==="setup"&&(
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-1">Tell us about your team</h1>
            <p className="text-sm text-slate-500 mb-6">We use team size and use case to calibrate the audit accurately.</p>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Company / Team name</label>
                  <input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" placeholder="Acme Inc." value={companyName} onChange={e=>{setCompanyName(e.target.value);save(teamSize,useCase,e.target.value,entries);}}/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Team size</label>
                  <input type="number" min={1} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" value={teamSize} onChange={e=>{setTeamSize(Number(e.target.value)||1);save(Number(e.target.value)||1,useCase,companyName,entries);}}/>
                </div>
              </div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">Primary use case</label>
              <div className="flex flex-wrap gap-2">
                {USE_CASES.map(uc=>(
                  <button key={uc.id} onClick={()=>{setUseCase(uc.id);save(teamSize,uc.id,companyName,entries);}} className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${useCase===uc.id?"border-indigo-400 bg-indigo-50 text-indigo-700":"border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}>{uc.label}</button>
                ))}
              </div>
            </div>
            <button onClick={()=>setStep("tools")} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200">Continue → Select Tools</button>
          </div>
        )}

        {/* TOOLS */}
        {step==="tools"&&(
          <div>
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Your AI tool stack</h1>
              <button onClick={()=>setStep("setup")} className="text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-all">← Back</button>
            </div>
            <p className="text-sm text-slate-500 mb-5">Toggle tools your team pays for and fill in plan details.</p>
            {TOOLS.map(tool=>{
              const entry=entries.find(e=>e.toolId===tool.id);
              const on=entry?.enabled||false;
              return(
                <div key={tool.id} className={`bg-white border rounded-2xl p-4 mb-2.5 transition-all ${on?"border-indigo-300 shadow-sm":"border-slate-200 opacity-60"}`}>
                  <div className="flex items-start gap-3">
                    <button onClick={()=>toggleTool(tool.id)} className={`w-10 h-5 rounded-full relative transition-colors flex-shrink-0 mt-0.5 ${on?"bg-indigo-600":"bg-slate-200"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${on?"left-5":"left-0.5"}`}/>
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800">{tool.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold">{tool.cat}</span>
                      </div>
                      {on&&entry&&(
                        <div className="grid grid-cols-3 gap-2 mt-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Plan</label>
                            <select className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-400" value={entry.plan} onChange={e=>updateEntry(tool.id,"plan",e.target.value)}>
                              {tool.plans.map(p=><option key={p.id} value={p.id}>{p.label}{p.price>0?` — $${p.price}/mo`:""}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Seats</label>
                            <input type="number" min={1} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-400" value={entry.seats} onChange={e=>updateEntry(tool.id,"seats",Number(e.target.value))}/>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Monthly $</label>
                            <input type="number" min={0} placeholder="Auto" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-400" value={entry.spend||""} onChange={e=>updateEntry(tool.id,"spend",Number(e.target.value))}/>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {entries.filter(e=>e.enabled).length>0?(
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between mt-2 flex-wrap gap-3">
                <div>
                  <span className="text-sm text-slate-500">Monthly total: </span>
                  <span className="text-xl font-extrabold text-slate-800">${totalSpend.toLocaleString()}</span>
                  <span className="text-sm text-slate-400 ml-1">/ ${(totalSpend*12).toLocaleString()} yr</span>
                </div>
                <button onClick={()=>{const a=runAudit(entries,teamSize,useCase);setAudit(a);setSummary("");setStep("audit");generateSummary(a);}} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all hover:-translate-y-0.5">Run Audit →</button>
              </div>
            ):(
              <div className="text-center py-8 text-slate-400 text-sm">Toggle at least one tool above to continue ↑</div>
            )}
          </div>
        )}

        {/* AUDIT */}
        {step==="audit"&&audit&&(
          <div>
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">{companyName?`${companyName}'s Audit`:"Your AI Audit"}</h1>
              <button onClick={()=>setStep("tools")} className="text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg">← Adjust</button>
            </div>

            {/* Hero */}
            <div className={`rounded-2xl p-7 mb-5 text-white ${audit.totalSaving>0?"bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-700":"bg-gradient-to-br from-green-900 via-green-800 to-green-700"}`}>
              {audit.totalSaving>0?(
                <>
                  <div className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Potential monthly savings</div>
                  <div className="text-5xl font-black tracking-tight leading-none">${audit.totalSaving.toLocaleString()}<span className="text-xl font-normal opacity-60">/mo</span></div>
                  <div className="text-lg opacity-75 mt-1 mb-4">${(audit.totalSaving*12).toLocaleString()} annually</div>
                  <div className="flex gap-5 flex-wrap text-sm opacity-80 mb-3">
                    <span>Current: <strong>${totalSpend}/mo</strong></span>
                    <span>Savings: <strong>{Math.round((audit.totalSaving/Math.max(1,totalSpend))*100)}%</strong></span>
                    <span>Team: <strong>{teamSize} people</strong></span>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white/70 rounded-full" style={{width:`${Math.min(100,Math.round((audit.totalSaving/Math.max(1,totalSpend))*100))}%`}}/>
                  </div>
                  {audit.totalSaving>500&&(
                    <div className="mt-4 p-3 bg-white/10 rounded-xl text-sm border border-white/15">
                      💡 <strong>Credex can help capture this savings</strong> — discounted AI credits from companies that overforecast. <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" className="text-indigo-300 font-bold hover:underline">Book a free consultation →</a>
                    </div>
                  )}
                </>
              ):(
                <>
                  <div className="text-2xl font-bold mb-2">✓ You&apos;re spending well</div>
                  <div className="text-sm opacity-80">Your AI stack is optimised for a {teamSize}-person {useCase} team. No significant overspend detected.</div>
                </>
              )}
            </div>

            {/* Summary */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-4 border-l-4 border-l-indigo-500">
              <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">✦ AI-generated summary</div>
              {summaryLoading?<div className="text-sm text-slate-400 italic animate-pulse">Generating your personalised summary…</div>:<p className="text-sm text-slate-600 leading-relaxed">{summary}</p>}
            </div>

            {/* Breakdown */}
            <h2 className="text-base font-extrabold text-slate-800 mb-3">Tool-by-tool breakdown</h2>
            {audit.results.map(r=>{
              const b=BADGES[r.action]||BADGES.optimal;
              const bc=BORDER[r.action]||"border-slate-200";
              return(
                <div key={r.toolId} className={`bg-white border ${bc} border-l-4 rounded-2xl p-4 mb-2.5`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="font-bold text-slate-800">{r.toolName}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${b.cls}`}>{b.icon} {b.label}</span>
                        <span className="text-xs text-slate-400">{r.plan}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{r.reason}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[10px] text-slate-400 mb-0.5">Current</div>
                      <div className="text-base font-extrabold text-slate-800">${r.monthlyActual}/mo</div>
                      {r.saving>0&&<div className="text-xs font-bold text-green-600">↓ save ${r.saving}/mo</div>}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Share */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3 mb-3">
              <div className="text-xs font-bold text-slate-500 mb-2">Share this audit</div>
              <div className="flex gap-2">
                <input readOnly className="flex-1 text-xs font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none" value={`https://spendsage.credex.rocks/audit/${shareId}`}/>
                <button onClick={()=>{navigator.clipboard?.writeText(`https://spendsage.credex.rocks/audit/${shareId}`).catch(()=>{});setCopied(true);setTimeout(()=>setCopied(false),2500);}} className="text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 px-3 py-2 rounded-lg transition-all">{copied?"✓ Copied!":"Copy"}</button>
              </div>
              <div className="text-[10px] text-slate-400 mt-1.5">Company name and email stripped. Tools and savings numbers only.</div>
            </div>

            {/* Lead capture */}
            {!captured?(
              <div className={`rounded-xl p-5 border ${audit.totalSaving>500?"bg-purple-50 border-purple-200":"bg-sky-50 border-sky-200"}`}>
                <div className="font-bold text-slate-800 mb-1">{audit.totalSaving>500?"📋 Get your full report + talk to a Credex advisor":"🔔 Get notified when new optimisations apply"}</div>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">{audit.totalSaving>500?`We'll send your full audit and connect you with a Credex advisor to help capture that $${(audit.totalSaving*12).toLocaleString()}/year in savings.`:"We'll ping you when pricing changes or better options emerge for your stack."}</p>
                <div className="flex gap-2">
                  <input type="email" placeholder="you@company.com" className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 bg-white" value={email} onChange={e=>setEmail(e.target.value)}/>
                  <button onClick={()=>{if(email.includes("@"))setCaptured(true);}} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap">{audit.totalSaving>500?"Book free call →":"Notify me →"}</button>
                </div>
                <div className="text-[10px] text-slate-400 mt-2">No spam. No cold calls. Just your report.</div>
              </div>
            ):(
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="text-2xl mb-2">✓</div>
                <div className="font-bold text-green-800">You&apos;re on the list</div>
                <div className="text-xs text-green-600 mt-1">Audit report sent to {email}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}