// Independent master volumes. Existing per-sound balances remain unchanged.
(()=>{
 const clamp=v=>Math.max(0,Math.min(1,Number(v)||0));
 let saved={};try{saved=JSON.parse(localStorage.getItem('torreblanca-audio')||'{}')}catch{}
 const levels={music:saved.music===undefined?1:clamp(saved.music),effects:saved.effects===undefined?1:clamp(saved.effects),vibration:saved.vibration===true};
 const media=new Set(),buses=new Map(),nativeVolume=Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype,'volume');
 function category(clip){return /selection|seleccion|los-pisos-rojos-theme|pelea-jefe/i.test(clip.src)?'music':'effects'}
 function track(clip){
  if(media.has(clip))return clip;
  let base=nativeVolume.get.call(clip);
  Object.defineProperty(clip,'volume',{configurable:true,get:()=>base,set:value=>{base=clamp(value);nativeVolume.set.call(clip,base*levels[category(clip)])}});
  clip.applyMasterVolume=()=>nativeVolume.set.call(clip,base*levels[category(clip)]);
  media.add(clip);clip.applyMasterVolume();return clip;
 }
 const NativeAudio=window.Audio;
 window.Audio=function(...args){return track(new NativeAudio(...args))};window.Audio.prototype=NativeAudio.prototype;
 const nativePlay=HTMLMediaElement.prototype.play;
 HTMLMediaElement.prototype.play=function(...args){track(this).applyMasterVolume();return nativePlay.apply(this,args)};
 function output(context,type){
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
 window.gameAudioSettings={output,set,levels,isOpen:false,setVibration,vibrateImpact,vibrationSupported};
 const style=document.createElement('style');style.textContent=`#audioToggle{position:fixed;left:50%;bottom:calc(8px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:10001;min-width:44px;min-height:44px;border:1px solid #ffffff55;border-radius:10px;background:#101727cc;color:white;font:16px Arial;touch-action:manipulation}#audioPanel{position:fixed;inset:0;z-index:10002;background:#000a;display:grid;place-items:center}#audioPanel[hidden]{display:none}#audioPanel section{box-sizing:border-box;width:min(340px,90vw);max-height:90dvh;overflow:auto;background:#142033;border:1px solid #ffffff55;border-radius:14px;padding:22px;color:white;font:16px Arial}#audioPanel h2{margin:0 0 20px;font-size:20px}#audioPanel label{display:block;margin:18px 0}#audioPanel input{display:block;width:100%;height:38px;accent-color:#df3838;touch-action:pan-x}#audioPanel button{width:100%;padding:13px;border-radius:8px;border:0;color:white;background:#344961;font-size:16px}`;
 document.head.append(style);
 const toggle=document.createElement('button');toggle.id='audioToggle';toggle.textContent='Sonido';toggle.setAttribute('aria-label','Ajustar música y efectos');
 const panel=document.createElement('div');panel.id='audioPanel';panel.hidden=true;panel.innerHTML='<section role="dialog" aria-modal="true" aria-labelledby="audioHeading"><h2 id="audioHeading">Sonido</h2><label>Música <output id="musicPercent"></output><input id="musicVolume" type="range" min="0" max="100" aria-label="Volumen de música"></label><label>Efectos <output id="effectsPercent"></output><input id="effectsVolume" type="range" min="0" max="100" aria-label="Volumen de efectos"></label><button id="audioClose">Volver</button></section>';
 document.body.append(toggle,panel);
 panel.querySelector('#audioHeading').textContent='Sonido y vibración';
 panel.querySelector('#audioClose').insertAdjacentHTML('beforebegin','<label style="display:flex;align-items:center;gap:12px"><input id="vibrationEnabled" type="checkbox" style="width:26px;height:26px;margin:0"> Vibración al golpear</label><small id="vibrationHelp" style="display:block;margin-bottom:16px"></small>');
 const vibrationToggle=panel.querySelector('#vibrationEnabled');vibrationToggle.checked=levels.vibration;vibrationToggle.disabled=!vibrationSupported;
 panel.querySelector('#vibrationHelp').textContent=vibrationSupported?'Vibración breve en los impactos.':'Este navegador no admite vibración.';
 vibrationToggle.onchange=()=>{setVibration(vibrationToggle.checked);if(vibrationToggle.checked)vibrateImpact()};
 for(const type of ['music','effects']){const slider=panel.querySelector('#'+type+'Volume'),label=panel.querySelector('#'+type+'Percent');slider.value=Math.round(levels[type]*100);label.textContent=slider.value+' %';slider.oninput=()=>{set(type,slider.value/100);label.textContent=slider.value+' %'}}
 function show(open){panel.hidden=!open;window.gameAudioSettings.isOpen=open;window.dispatchEvent(new CustomEvent('audio-panel-change'));(open?panel.querySelector('#musicVolume'):toggle).focus()}
 toggle.onclick=e=>{e.stopPropagation();show(true)};panel.querySelector('#audioClose').onclick=()=>show(false);
 for(const type of ['pointerdown','pointerup','touchstart','touchend','click']){toggle.addEventListener(type,e=>e.stopPropagation());panel.addEventListener(type,e=>e.stopPropagation())}
 document.addEventListener('keydown',e=>{if(!window.gameAudioSettings.isOpen)return;if(e.key==='Escape')show(false);e.stopImmediatePropagation()},true);
})();
