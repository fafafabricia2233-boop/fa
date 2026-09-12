import React,{useEffect,useState} from 'react';
import {AbsoluteFill,OffthreadVideo,Sequence,staticFile,useCurrentFrame,interpolate,delayRender,continueRender,cancelRender} from 'remotion';
import plan from './plan.json';
import cues from './cues.json';
import {fontData} from './fonts';

const NH={gold:'#C9A24A',navy:'#0B2436',white:'#F7F3EA'};
const FontLoader:React.FC=()=>{
 const [handle]=useState(()=>delayRender('Fontes da composição New Hair'));
 useEffect(()=>{
  Promise.all([
   new FontFace('NHMont',Uint8Array.from(atob(fontData.mont),c=>c.charCodeAt(0)),{weight:'100 900'}).load(),
   new FontFace('NHSerif',Uint8Array.from(atob(fontData.serif),c=>c.charCodeAt(0)),{weight:'300 700'}).load(),
  ]).then(fonts=>{fonts.forEach(f=>(document.fonts as unknown as {add:(f:FontFace)=>void}).add(f));continueRender(handle)}).catch(cancelRender);
  return ()=>continueRender(handle);
 },[handle]);
 return null;
};
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const lerp=(f:number,x:number[],y:number[])=>interpolate(f,x,y,{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const brolls=plan.brolls.map(b=>({...b,from:b.fromFrame}));

const Base:React.FC<{i:number;duration:number;src:string}>=({i,duration,src})=>{
 const local=useCurrentFrame();
 const global=plan.clips[i].start+local;
 const zoomProgress=clamp((local-plan.zoomFrame)/15);
 const easedZoom=zoomProgress*zoomProgress*(3-2*zoomProgress);
 const scale=i===plan.zoomClip?1.02+.10*easedZoom:plan.closeClips.includes(i)?1.08:1;
 const origin=i>0?'50% 80%':'50% 42%';
 const band=brolls.find(b=>b.mode==='band'&&global>=b.from&&global<b.from+b.duration);
 return <AbsoluteFill style={{overflow:'hidden'}}><OffthreadVideo src={staticFile(src)} muted style={{width:'100%',height:'100%',objectFit:'cover',transform:`translateY(${band?240:i===0?plan.titleShift:0}px) scale(${scale})`,transformOrigin:origin}}/></AbsoluteFill>;
};
const Broll:React.FC<{b:typeof brolls[number]}>=({b})=>{
 const f=useCurrentFrame();
 const fade=lerp(f,[0,3,b.duration-3,b.duration],[0,1,1,0]);
 return <div style={{position:'absolute',top:0,left:0,width:1080,height:b.mode==='band'?760:1920,overflow:'hidden',opacity:fade,maskImage:b.mode==='band'?'linear-gradient(to bottom,black 0%,black 82%,transparent 100%)':undefined,WebkitMaskImage:b.mode==='band'?'linear-gradient(to bottom,black 0%,black 82%,transparent 100%)':undefined}}><OffthreadVideo src={staticFile(b.src)} muted style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:b.position}}/></div>;
};
const Typed:React.FC<{text:string;start:number;end:number;size:number;gold?:boolean;kicker?:boolean}>=({text,start,end,size,gold,kicker})=>{
 const f=useCurrentFrame();const n=Math.round(lerp(f,[start*30,end*30],[0,text.length]));
 const typing=f>=start*30&&f<end*30;
 return <div style={{fontFamily:'NHMont',fontWeight:gold||kicker?500:300,fontSize:size,color:gold?NH.gold:NH.white,letterSpacing:kicker?4:2.4,lineHeight:1,marginBottom:4,textShadow:'0 2px 18px rgba(11,36,54,0.9)',textAlign:'center'}}><span style={{display:'inline-block',position:'relative',whiteSpace:'pre'}}><span style={{visibility:'hidden'}}>{text}</span><span style={{position:'absolute',top:0,left:0,whiteSpace:'pre'}}>{text.slice(0,n)}<span style={{display:'inline-block',height:size*.82,width:3,marginLeft:8,background:NH.gold,verticalAlign:'middle',visibility:typing&&Math.floor(f/5)%2===0?'visible':'hidden'}}/></span></span></div>;
};
const Film:React.FC=()=>{
 const f=useCurrentFrame();const q=f-(plan.hookEnd-7);
 if(q<0||q>6)return null;
 const colors=['rgba(255,181,127,0.18)','rgba(255,205,152,0.75)','#fffbd6','#ffffdf','#321923','#020203','#000'];
 return <AbsoluteFill style={{background:colors[q],overflow:'hidden'}}>
  {q<5&&<><div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,rgba(217,72,54,.7),transparent 35%,rgba(255,246,176,.5) 75%,rgba(255,255,235,.8))',opacity:q===0?.2:.8}}/>
  <div style={{position:'absolute',left:24,top:-300+q*95,width:115,height:2500,filter:'blur(4px)',opacity:q===4?.8:.30}}>{Array.from({length:12}).map((_,i)=><div key={i} style={{height:108,width:94,background:q===4?'#120007':'#ba774f',marginBottom:78,borderRadius:12}}/>)}</div></>}
 </AbsoluteFill>;
};

export const NewHairPilot:React.FC=()=>{
 const frame=useCurrentFrame();const t=frame/30;
 const titleOpacity=lerp(frame,[plan.hookEnd-14,plan.hookEnd-7],[1,0]);
 const active=frame<plan.endCard;
 const titleScrim=lerp(frame,[0,10,plan.hookEnd-14,plan.hookEnd-7],[0,1,1,0]);
 const lowerScrim=lerp(frame,[0,12,plan.endCard-5,plan.endCard],[0,1,1,0]);
 const cue=cues.find(c=>t>=c.start&&t<c.end);
 return <AbsoluteFill style={{backgroundColor:NH.navy}}>
  <FontLoader/>
  {plan.clips.map((c,i)=><Sequence key={i} from={c.start} durationInFrames={c.duration}><Base i={i} duration={c.duration} src={c.src}/></Sequence>)}
  {brolls.map((b,i)=><Sequence key={`b${i}`} from={b.from} durationInFrames={b.duration}><Broll b={b}/></Sequence>)}
  <Sequence from={plan.endCard} durationInFrames={plan.duration-plan.endCard}><OffthreadVideo src={staticFile('logo_h264.mp4')} muted style={{width:'100%',height:'100%',objectFit:'cover'}}/></Sequence>
  {active&&<>
   <div style={{position:'absolute',top:0,left:0,width:'100%',height:520,opacity:titleScrim,background:'linear-gradient(to bottom,rgba(11,36,54,.52) 0%,rgba(11,36,54,.62) 55%,rgba(11,36,54,.62) 73%,rgba(11,36,54,0) 100%)'}}/>
   <AbsoluteFill style={{opacity:lowerScrim,background:'linear-gradient(to top,rgba(11,36,54,.62) 0%,rgba(11,36,54,0) 45%)'}}/>
   {frame<plan.hookEnd&&<div style={{position:'absolute',top:plan.titleTop,width:'100%',boxSizing:'border-box',padding:'0 90px',textAlign:'center',opacity:titleOpacity}}>
    <Typed text={plan.title[0]} start={.15} end={.85} size={48}/>
    <Typed text={plan.title[1]} start={.88} end={1.4} size={72} gold/>
    <div style={{height:1.5,width:lerp(frame,[.88*30,1.4*30],[0,64]),background:NH.gold,opacity:.75,margin:'6px auto 0'}}/>
   </div>}
   {cue&&frame>=plan.hookEnd&&<div style={{position:'absolute',bottom:plan.captionBottom,width:'100%',boxSizing:'border-box',padding:'0 100px',display:'flex',flexDirection:'column',gap:8,alignItems:'center',opacity:Math.min(clamp((t-cue.start)/.10),clamp((cue.end-t)/.10)),transform:`translateY(${10*(1-clamp((t-cue.start)/.2))}px)`}}>
    {cue.lines.map((line,i)=><div key={i} style={{fontFamily:line.serif?'NHSerif':'NHMont',fontWeight:line.gold?500:300,fontSize:line.size,letterSpacing:line.serif?1:2.2,color:line.gold?NH.gold:NH.white,textAlign:'center',lineHeight:1.35,textShadow:'0 1px 16px rgba(11,36,54,.85)'}}>{line.text}</div>)}
   </div>}
   <div style={{position:'absolute',bottom:plan.sealBottom,width:'100%',textAlign:'center',fontFamily:'NHMont',fontWeight:300,fontSize:20,letterSpacing:1.2,color:NH.white,opacity:lerp(frame,[30,48,plan.endCard-12,plan.endCard-2],[0,.6,.6,0])}}>Procedimento realizado por médico · a New Hair realiza a instrumentação</div>
  </>}
  <Film/>
 </AbsoluteFill>;
};
