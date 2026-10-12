// Independent master volumes. Existing per-sound balances remain unchanged.
(()=>{
 const clamp=v=>Math.max(0,Math.min(1,Number(v)||0));
 let saved={};try{saved=JSON.parse(localStorage.getItem('torreblanca-audio')||'{}')}catch{}
 const levels={music:saved.music===undefined?1:clamp(saved.music),effects:saved.effects===undefined?1:clamp(saved.effects),vibration:saved.vibration===true};
 const media=new Set(),states=new WeakMap(),buses=new Map(),nativeVolume=Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype,'volume');
 let mediaContext=null;
 let globallyPaused=false;const pausedMusic=new Set(),pausedContexts=new Set();
 function category(clip){let src=clip.currentSrc||clip.src||'';try{src=decodeURIComponent(src)}catch{}return /selection|selecci[oó]n|los-pisos-rojos-theme|pelea-jefe/i.test(src)?'music':'effects'}
 function apply(clip){const state=states.get(clip);if(state.gain){nativeVolume.set.call(clip,1);state.gain.gain.setValueAtTime(state.base,mediaContext.currentTime)}else nativeVolume.set.call(clip,state.base*levels[state.type])}
 function route(clip){
  const state=states.get(clip);if(!mediaContext||state.source)return;
  // Local file previews retain native volume: file-origin media can be CORS-silenced
  // by MediaElementAudioSource. Published HTTP(S) uses gain nodes (also on iOS).
  if(window.location?.protocol==='file:')return;
  try{state.source=mediaContext.createMediaElementSource(clip);state.gain=mediaContext.createGain();state.source.connect(state.gain);state.gain.connect(output(mediaContext,state.type));apply(clip)}catch(e){state.source=null;state.gain=null;apply(clip)}
 }
 function unlockMedia(){
  if(globallyPaused)return;
  const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return;
  try{mediaContext??=new Context();if(mediaContext.state==='suspended')mediaContext.resume().catch(()=>{});media.forEach(route)}catch{}
 }
 function track(clip,type){
  let state=states.get(clip);
  if(state){if(type&&state.type!==type){state.type=type;if(state.gain){state.gain.disconnect();state.gain.connect(output(mediaContext,type))}apply(clip)}return clip}
  state={base:nativeVolume.get.call(clip),type:type||category(clip),source:null,gain:null};states.set(clip,state);
  Object.defineProperty(clip,'volume',{configurable:true,get:()=>state.base,set:value=>{state.base=clamp(value);apply(clip)}});
  clip.applyMasterVolume=()=>apply(clip);
  media.add(clip);route(clip);apply(clip);return clip;
 }
 const NativeAudio=window.Audio;
 window.Audio=function(...args){return track(new NativeAudio(...args))};window.Audio.prototype=NativeAudio.prototype;
 const nativePlay=HTMLMediaElement.prototype.play;
 HTMLMediaElement.prototype.play=function(...args){track(this);if(globallyPaused){if(states.get(this).type==='music')pausedMusic.add(this);return Promise.resolve()}unlockMedia();this.applyMasterVolume();return nativePlay.apply(this,args)};
 const nativeClone=HTMLMediaElement.prototype.cloneNode;
 HTMLMediaElement.prototype.cloneNode=function(...args){const clone=nativeClone.apply(this,args),state=states.get(this);if(state){track(clone,state.type);clone.volume=state.base}return clone};
 for(const event of ['pointerdown','touchend','keydown'])document.addEventListener(event,unlockMedia,{capture:true,passive:true});
 function output(context,type){
  if(globallyPaused){pausedContexts.add(context);if(context.state==='running')context.suspend().catch(()=>{})}
  let pair=buses.get(context);if(!pair){pair={};buses.set(context,pair)}
  if(!pair[type]){const gain=context.createGain();gain.gain.value=levels[type];gain.connect(context.destination);pair[type]=gain}
  return pair[type];
 }
 function set(type,value){levels[type]=clamp(value);media.forEach(clip=>clip.applyMasterVolume());for(const [context,pair] of buses)if(pair[type])pair[type].gain.setValueAtTime(levels[type],context.currentTime);try{localStorage.setItem('torreblanca-audio',JSON.stringify(levels))}catch{}}
 const vibrationSupported=typeof navigator.vibrate==='function';let lastVibration=-Infinity;
 function setVibration(enabled){levels.vibration=!!enabled;try{localStorage.setItem('torreblanca-audio',JSON.stringify(levels))}catch{}if(!enabled&&vibrationSupported)try{navigator.vibrate(0)}catch{}}
 function vibrateImpact(strength=1){
  if(!levels.vibration||!vibrationSupported)return;
  const now=performance.now();if(now-lastVibration<90)return;lastVibration=now;
  try{navigator.vibrate(strength>1?25:12)}catch{}
 }
 function pauseAll(){
  if(globallyPaused)return;globallyPaused=true;
  for(const clip of media){if(!clip.paused&&!clip.ended){if(states.get(clip).type==='music')pausedMusic.add(clip);clip.pause()}}
  for(const context of new Set([...buses.keys(),...(mediaContext?[mediaContext]:[])]))if(context.state==='running'){pausedContexts.add(context);context.suspend().catch(()=>{})}
  if(vibrationSupported)try{navigator.vibrate(0)}catch{}
 }
 function resumeAll(){
  if(!globallyPaused)return;globallyPaused=false;
  for(const context of pausedContexts)if(context.state==='suspended')context.resume().catch(()=>{});pausedContexts.clear();
  for(const clip of pausedMusic)clip.play().catch(()=>{});pausedMusic.clear();
 }
 window.gameAudioSettings={output,set,levels,track,isOpen:false,setVibration,vibrateImpact,vibrationSupported,pauseAll,resumeAll,get isPaused(){return globallyPaused}};
 const style=document.createElement('style');style.textContent=`#audioToggle{position:fixed;left:50%;bottom:calc(8px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:10001;min-width:44px;min-height:44px;border:1px solid #ffffff55;border-radius:10px;background:#101727cc;color:white;font:16px Arial;touch-action:manipulation}#audioPanel{position:fixed;inset:0;z-index:10002;background:#000a;display:grid;place-items:center}#audioPanel[hidden]{display:none}#audioPanel section{box-sizing:border-box;width:min(340px,90vw);max-height:90dvh;overflow:auto;background:#142033;border:1px solid #ffffff55;border-radius:14px;padding:22px;color:white;font:16px Arial}#audioPanel h2{margin:0 0 20px;font-size:20px}#audioPanel label{display:block;margin:18px 0}#audioPanel input{display:block;width:100%;height:38px;accent-color:#df3838;touch-action:pan-x}#audioPanel button{width:100%;padding:13px;border-radius:8px;border:0;color:white;background:#344961;font-size:16px}`;
 style.textContent+='#startScreen #audioToggle{position:absolute;left:auto;bottom:auto;transform:none;top:calc(12px + env(safe-area-inset-top));right:calc(12px + env(safe-area-inset-right));z-index:40}';
 document.head.append(style);
 const toggle=document.createElement('button');toggle.id='audioToggle';toggle.textContent='Sonido';toggle.setAttribute('aria-label','Ajustar música y efectos');
 const panel=document.createElement('div');panel.id='audioPanel';panel.hidden=true;panel.innerHTML='<section role="dialog" aria-modal="true" aria-labelledby="audioHeading"><h2 id="audioHeading">Sonido</h2><label>Música <output id="musicPercent"></output><input id="musicVolume" type="range" min="0" max="100" aria-label="Volumen de música"></label><label>Efectos <output id="effectsPercent"></output><input id="effectsVolume" type="range" min="0" max="100" aria-label="Volumen de efectos"></label><button id="audioClose">Volver</button></section>';
 // Only visible inside the main menu; away from the centered Press Start.
 document.getElementById('startScreen')?.append(toggle);
 document.body.append(panel);
 panel.querySelector('#audioHeading').textContent='Sonido y vibración';
 panel.querySelector('#audioClose').insertAdjacentHTML('beforebegin','<label style="display:flex;align-items:center;gap:12px"><input id="vibrationEnabled" type="checkbox" style="width:26px;height:26px;margin:0"> Vibración al golpear</label><small id="vibrationHelp" style="display:block;margin-bottom:16px"></small>');
 const vibrationToggle=panel.querySelector('#vibrationEnabled');vibrationToggle.checked=levels.vibration;vibrationToggle.disabled=!vibrationSupported;
 panel.querySelector('#vibrationHelp').textContent=vibrationSupported?'Vibración breve en los impactos.':'Este navegador no admite vibración.';
 vibrationToggle.onchange=()=>{setVibration(vibrationToggle.checked);if(vibrationToggle.checked)vibrateImpact()};
 for(const type of ['music','effects']){const slider=panel.querySelector('#'+type+'Volume'),label=panel.querySelector('#'+type+'Percent');slider.value=Math.round(levels[type]*100);label.textContent=slider.value+' %';slider.oninput=()=>{set(type,slider.value/100);label.textContent=slider.value+' %'}}
 function show(open){panel.hidden=!open;window.gameAudioSettings.isOpen=open;window.dispatchEvent(new CustomEvent('audio-panel-change'));if(open)panel.querySelector('#musicVolume').focus()}
 toggle.onclick=e=>{e.stopPropagation();show(true)};panel.querySelector('#audioClose').onclick=()=>show(false);
 for(const type of ['pointerdown','pointerup','touchstart','touchend','click']){toggle.addEventListener(type,e=>e.stopPropagation());panel.addEventListener(type,e=>e.stopPropagation())}
 document.addEventListener('keydown',e=>{if(!window.gameAudioSettings.isOpen)return;if(e.key==='Escape')show(false);e.stopImmediatePropagation()},true);
})();
