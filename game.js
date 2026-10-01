
const canvas=document.getElementById('c'),ctx=canvas.getContext('2d');
// La partida usa sus propios gestos táctiles: nunca debe ampliar la página.
document.addEventListener('dblclick',event=>event.preventDefault(),{capture:true,passive:false});
['touchstart','touchmove','touchend'].forEach(type=>document.addEventListener(type,event=>{if(event.touches.length>1||event.changedTouches.length>1)event.preventDefault()},{capture:true,passive:false}));
['gesturestart','gesturechange','gestureend'].forEach(type=>document.addEventListener(type,event=>event.preventDefault(),{capture:true,passive:false}));
const castaData={'idle1':'assets/characters/casta/idle1.png','idle2':'assets/characters/casta/idle2.png','idle3':'assets/characters/casta/idle3.png','idle4':'assets/characters/casta/idle4.png','idle5':'assets/characters/casta/idle5.png','walk1':'assets/characters/casta/walk1.png','walk2':'assets/characters/casta/walk2.png','walk3':'assets/characters/casta/walk3.png','walk4':'assets/characters/casta/walk4.png','walk5':'assets/characters/casta/walk5.png','walk6':'assets/characters/casta/walk6.png','punch':'assets/characters/casta/punch.png','kick':'assets/characters/casta/kick.png','crouch':'assets/characters/casta/crouch.png','jump':'assets/characters/casta/jump.png','airKick':'assets/characters/casta/air-kick.png','airRecover':'assets/characters/casta/air-recover.png'};
function imgFromData(src){const im=new Image();im.src=src;return im;}
const casta={idle:imgFromData(castaData.idle1),walk:[castaData.walk1,'assets/characters/casta/walk-transition-a.png','assets/characters/casta/walk-center.png','assets/characters/casta/walk-transition-b.png','assets/characters/casta/walk-opposite.png','assets/characters/casta/walk-transition-b.png','assets/characters/casta/walk-center.png','assets/characters/casta/walk-transition-a.png'].map(imgFromData),punch:imgFromData(castaData.punch),kick:imgFromData(castaData.kick),crouch:imgFromData(castaData.crouch),jump:imgFromData(castaData.jump),airKick:imgFromData(castaData.airKick),airRecover:imgFromData(castaData.airRecover),hit:imgFromData('assets/characters/casta/hit.png'),down:imgFromData('assets/characters/casta/down.png')};
const pulido={idle:imgFromData('assets/characters/pulido/idle.png'),walk:['assets/characters/pulido/walk1.png','assets/characters/pulido/walk-transition-a.png','assets/characters/pulido/walk-center-test.png','assets/characters/pulido/walk-transition-b.png','assets/characters/pulido/walk2.png','assets/characters/pulido/walk-transition-b.png','assets/characters/pulido/walk-center-test.png','assets/characters/pulido/walk-transition-a.png'].map(src=>imgFromData(src)),punch:imgFromData('assets/characters/pulido/punch.png'),kick:imgFromData('assets/characters/pulido/kick.png'),crouch:imgFromData('assets/characters/pulido/crouch.png'),jump:imgFromData('assets/characters/pulido/jump.png'),airKick:imgFromData('assets/characters/pulido/air-kick.png'),airRecover:imgFromData('assets/characters/pulido/air-recover.png'),hit:imgFromData('assets/characters/pulido/hit.png'),down:imgFromData('assets/characters/pulido/down.png')};
const salviData={f1:'assets/characters/salvi/f1.png',f2:'assets/characters/salvi/f2.png',walkCenter:'assets/characters/salvi/walk-center.png',walkOpposite:'assets/characters/salvi/walk-opposite.png',f8:'assets/characters/salvi/f8.png',f9:'assets/characters/salvi/f9.png',f10:'assets/characters/salvi/f10.png',f11:'assets/characters/salvi/f11.png',f12:'assets/characters/salvi/f12.png',f13:'assets/characters/salvi/f13.png'};
const salvi={
  idle:imgFromData(salviData.f1),
  walk:[salviData.f2,'assets/characters/salvi/walk-transition-a.png',salviData.walkCenter,'assets/characters/salvi/walk-transition-b.png',salviData.walkOpposite,'assets/characters/salvi/walk-transition-b.png',salviData.walkCenter,'assets/characters/salvi/walk-transition-a.png'].map(imgFromData),
  punch:imgFromData(salviData.f13),
  kick:imgFromData(salviData.f9),
  crouch:imgFromData(salviData.f10),
  jump:imgFromData(salviData.f11),
  airKick:imgFromData(salviData.f12),
  airRecover:imgFromData(salviData.f8),
  hit:imgFromData('assets/characters/salvi/hit.png'),
  down:imgFromData('assets/characters/salvi/down.png')
};
const cajaman={idle:imgFromData('assets/characters/cajaman/idle.png'),walk:['assets/characters/cajaman/walk1.png','assets/characters/cajaman/walk-transition-a.png','assets/characters/cajaman/walk-center.png','assets/characters/cajaman/walk-transition-b.png','assets/characters/cajaman/walk-opposite.png','assets/characters/cajaman/walk-transition-b.png','assets/characters/cajaman/walk-center.png','assets/characters/cajaman/walk-transition-a.png'].map(src=>imgFromData(src)),punch:imgFromData('assets/characters/cajaman/punch.png'),kick:imgFromData('assets/characters/cajaman/kick.png'),crouch:imgFromData('assets/characters/cajaman/crouch.png'),jump:imgFromData('assets/characters/cajaman/jump.png'),airKick:imgFromData('assets/characters/cajaman/air-kick.png'),airRecover:imgFromData('assets/characters/cajaman/air-recover.png'),hit:imgFromData('assets/characters/cajaman/hit.png'),down:imgFromData('assets/characters/cajaman/down.png')};
const pako={idle:imgFromData('assets/characters/pako/idle.png'),walk:['assets/characters/pako/walk1.png','assets/characters/pako/walk-transition-a.png','assets/characters/pako/walk-center.png','assets/characters/pako/walk-transition-b.png','assets/characters/pako/walk-opposite.png','assets/characters/pako/walk-transition-b.png','assets/characters/pako/walk-center.png','assets/characters/pako/walk-transition-a.png'].map(src=>imgFromData(src)),punch:imgFromData('assets/characters/pako/punch.png'),kick:imgFromData('assets/characters/pako/kick.png'),crouch:imgFromData('assets/characters/pako/crouch.png'),jump:imgFromData('assets/characters/pako/jump.png'),airKick:imgFromData('assets/characters/pako/air-kick.png'),airRecover:imgFromData('assets/characters/pako/air-recover.png'),hit:imgFromData('assets/characters/pako/hit.png'),down:imgFromData('assets/characters/pako/down.png')};
const metalero={idle:imgFromData('assets/enemies/metalero/idle.png'),walk:['assets/enemies/metalero/walk1.png','assets/enemies/metalero/walk-transition-a.png','assets/enemies/metalero/walk2-final.png','assets/enemies/metalero/walk-transition-b.png','assets/enemies/metalero/walk3.png','assets/enemies/metalero/walk-transition-b.png','assets/enemies/metalero/walk2-final.png','assets/enemies/metalero/walk-transition-a.png'].map(src=>imgFromData(src)),punch:[imgFromData('assets/enemies/metalero/punch1.png'),imgFromData('assets/enemies/metalero/punch2.png')],guard:imgFromData('assets/enemies/metalero/guard.png'),hit:imgFromData('assets/enemies/metalero/hit.png'),down:imgFromData('assets/enemies/metalero/down.png')};
const yonki2={idle:imgFromData('assets/enemies/yonki2/idle.png'),walk:['assets/enemies/yonki2/walk1.png','assets/enemies/yonki2/walk-transition-a.png','assets/enemies/yonki2/walk2.png','assets/enemies/yonki2/walk-transition-b.png','assets/enemies/yonki2/walk3.png','assets/enemies/yonki2/walk-transition-b.png','assets/enemies/yonki2/walk2.png','assets/enemies/yonki2/walk-transition-a.png'].map(src=>imgFromData(src)),punch:imgFromData('assets/enemies/yonki2/punch.png'),guard:imgFromData('assets/enemies/yonki2/guard.png'),hit:imgFromData('assets/enemies/yonki2/hit.png'),down:imgFromData('assets/enemies/yonki2/down.png')};
// Segunda variante: chándal rojo oscuro y pantalón negro, sin alterar ninguna pose.
function yonkiRojoPalette(source){const result=new Image();const recolor=()=>{const sheet=document.createElement('canvas');sheet.width=source.width;sheet.height=source.height;const paint=sheet.getContext('2d');paint.drawImage(source,0,0);const pixels=paint.getImageData(0,0,sheet.width,sheet.height),d=pixels.data;for(let i=0;i<d.length;i+=4){const r=d[i],g=d[i+1],b=d[i+2],a=d[i+3];if(!a)continue;const y=Math.floor(i/4/sheet.width),sat=Math.max(r,g,b)-Math.min(r,g,b);const teal=b>r+18&&g>r+8&&sat>34;const purple=b>g+16&&r>g+6&&sat>32;if(!teal&&!purple)continue;const light=Math.round(r*.22+g*.56+b*.22);if(y>sheet.height*.48){d[i]=Math.max(9,Math.round(light*.34));d[i+1]=Math.max(10,Math.round(light*.36));d[i+2]=Math.max(13,Math.round(light*.41))}else{d[i]=Math.min(255,42+Math.round(light*.92));d[i+1]=Math.max(12,Math.round(light*.19));d[i+2]=Math.max(13,Math.round(light*.18))}}paint.putImageData(pixels,0,0);result.src=sheet.toDataURL('image/png')};if(source.complete)recolor();else source.addEventListener('load',recolor,{once:true});return result}
const yonki2Rojo={idle:yonkiRojoPalette(yonki2.idle),walk:yonki2.walk.map(yonkiRojoPalette),punch:yonkiRojoPalette(yonki2.punch),guard:yonkiRojoPalette(yonki2.guard),hit:yonkiRojoPalette(yonki2.hit),down:yonkiRojoPalette(yonki2.down)};
const yonki3={idle:imgFromData('assets/enemies/yonki3/idle.png'),walk:['assets/enemies/yonki3/walk1.png','assets/enemies/yonki3/walk-transition-a.png','assets/enemies/yonki3/walk2.png','assets/enemies/yonki3/walk-transition-b.png','assets/enemies/yonki3/walk3.png','assets/enemies/yonki3/walk-transition-b.png','assets/enemies/yonki3/walk2.png','assets/enemies/yonki3/walk-transition-a.png'].map(src=>imgFromData(src)),punch:imgFromData('assets/enemies/yonki3/punch.png'),guard:imgFromData('assets/enemies/yonki3/guard.png'),hit:imgFromData('assets/enemies/yonki3/hit.png'),down:imgFromData('assets/enemies/yonki3/down.png')};
const yonki3Nike={idle:imgFromData('assets/enemies/yonki3-nike-rojo/idle.png'),walk:['assets/enemies/yonki3-nike-rojo/walk1.png','assets/enemies/yonki3-nike-rojo/walk-transition-a.png','assets/enemies/yonki3-nike-rojo/walk2.png','assets/enemies/yonki3-nike-rojo/walk-transition-b.png','assets/enemies/yonki3-nike-rojo/walk3.png','assets/enemies/yonki3-nike-rojo/walk-transition-b.png','assets/enemies/yonki3-nike-rojo/walk2.png','assets/enemies/yonki3-nike-rojo/walk-transition-a.png'].map(src=>imgFromData(src)),punch:imgFromData('assets/enemies/yonki3-nike-rojo/punch.png'),guard:imgFromData('assets/enemies/yonki3-nike-rojo/guard.png'),hit:imgFromData('assets/enemies/yonki3-nike-rojo/hit.png'),down:imgFromData('assets/enemies/yonki3-nike-rojo/down.png')};
const kani2={idle:imgFromData('assets/enemies/kani2/idle.png'),walk:['assets/enemies/kani2/walk1.png','assets/enemies/kani2/walk-transition-a.png','assets/enemies/kani2/walk2.png','assets/enemies/kani2/walk-transition-b.png','assets/enemies/kani2/walk3.png','assets/enemies/kani2/walk-transition-b.png','assets/enemies/kani2/walk2.png','assets/enemies/kani2/walk-transition-a.png'].map(src=>imgFromData(src)),punch:imgFromData('assets/enemies/kani2/punch.png'),guard:imgFromData('assets/enemies/kani2/guard.png'),hit:imgFromData('assets/enemies/kani2/hit.png'),down:imgFromData('assets/enemies/kani2/down.png')};
const heavy={idle:imgFromData('assets/enemies/heavy/idle.png'),walk:['assets/enemies/heavy/walk1.png','assets/enemies/heavy/walk-transition-a.png','assets/enemies/heavy/walk-transition-b.png','assets/enemies/heavy/walk3.png','assets/enemies/heavy/walk-transition-b.png','assets/enemies/heavy/walk-transition-a.png'].map(src=>imgFromData(src)),punch:imgFromData('assets/enemies/heavy/punch.png'),guard:imgFromData('assets/enemies/heavy/guard.png'),hit:imgFromData('assets/enemies/heavy/hit.png'),down:imgFromData('assets/enemies/heavy/down.png')};
// Variante de paleta: conserva cada píxel de pose, borde y transparencia del Yonki 3.
function yonkiRubioPalette(source){const result=new Image();const recolor=()=>{const sheet=document.createElement('canvas');sheet.width=source.width;sheet.height=source.height;const paint=sheet.getContext('2d');paint.drawImage(source,0,0);const pixels=paint.getImageData(0,0,sheet.width,sheet.height),d=pixels.data;for(let i=0;i<d.length;i+=4){const r=d[i],g=d[i+1],b=d[i+2],a=d[i+3];if(!a)continue;const y=Math.floor(i/4/sheet.width);const blueDenim=y>sheet.height*.40&&b>r+12&&b>g+4&&g>r*.86;if(blueDenim){const light=Math.round(r*.26+g*.52+b*.22);d[i]=Math.max(10,Math.round(light*.38));d[i+1]=Math.max(11,Math.round(light*.40));d[i+2]=Math.max(13,Math.round(light*.45));continue}const warmHair=y<sheet.height*.43&&r>g*1.13&&g>b*1.04&&r<150&&g<115&&b<100;if(warmHair){const light=Math.round(r*.30+g*.52+b*.18);d[i]=Math.min(255,46+Math.round(light*1.34));d[i+1]=Math.min(255,27+Math.round(light*1.02));d[i+2]=Math.max(8,Math.round(light*.42))}}paint.putImageData(pixels,0,0);result.src=sheet.toDataURL('image/png')};if(source.complete)recolor();else source.addEventListener('load',recolor,{once:true});return result}
const yonki3Rubio={idle:yonkiRubioPalette(yonki3.idle),walk:yonki3.walk.map(yonkiRubioPalette),punch:yonkiRubioPalette(yonki3.punch),guard:yonkiRubioPalette(yonki3.guard),hit:yonkiRubioPalette(yonki3.hit),down:yonkiRubioPalette(yonki3.down)};
const jefePisosRojos={idle:imgFromData('assets/enemies/jefe-pisos-rojos/idle.png'),push:['assets/enemies/jefe-pisos-rojos/push-cart.png','assets/enemies/jefe-pisos-rojos/push-cart-step-b.png'].map(src=>imgFromData(src)),walk:['assets/enemies/jefe-pisos-rojos/walk1.png','assets/enemies/jefe-pisos-rojos/walk-transition-a.png','assets/enemies/jefe-pisos-rojos/walk2.png','assets/enemies/jefe-pisos-rojos/walk-transition-b.png','assets/enemies/jefe-pisos-rojos/walk3.png','assets/enemies/jefe-pisos-rojos/walk-transition-b.png','assets/enemies/jefe-pisos-rojos/walk2.png','assets/enemies/jefe-pisos-rojos/walk-transition-a.png'].map(src=>imgFromData(src)),punch:imgFromData('assets/enemies/jefe-pisos-rojos/punch.png'),guard:imgFromData('assets/enemies/jefe-pisos-rojos/guard.png'),drinkRaise:imgFromData('assets/enemies/jefe-pisos-rojos/drink-raise.png'),drink:imgFromData('assets/enemies/jefe-pisos-rojos/drink.png'),hit:imgFromData('assets/enemies/jefe-pisos-rojos/hit.png'),down:imgFromData('assets/enemies/jefe-pisos-rojos/down.png')};
let selectedCharacter='rafa';

const bg=new Image(), idleImg=new Image(), jumpImg=new Image(), punchImg=new Image(), kickImg=new Image(), airKickImg=new Image(), airRecoverImg=new Image(), crouchImg=new Image(), rafaHitImg=new Image(), rafaDownImg=new Image(), rafaSpecialWindup=new Image(),rafaSpecialKickA=new Image(),rafaSpecialKickB=new Image(), rafaWalkCenter=new Image(), walkImgs=Array.from({length:6},()=>new Image());
let backgroundBayCleaned=false;
function removeStartingBlueBay(){if(backgroundBayCleaned||!bg.complete)return;backgroundBayCleaned=true;const sheet=document.createElement('canvas');sheet.width=bg.width;sheet.height=bg.height;const paint=sheet.getContext('2d');paint.drawImage(bg,0,0);paint.drawImage(bg,1700,195,500,65,0,195,500,65);bg.src=sheet.toDataURL('image/png');}
bg.addEventListener('load',removeStartingBlueBay);
const carImg=new Image(),scrapCartImg=new Image(),stageClearImg=new Image();
const selectionMusic=new Audio('assets/audio/seleccion-personaje.mp3');
selectionMusic.loop=true;
selectionMusic.volume=.48;
const phaseMusic=new Audio('assets/audio/los-pisos-rojos-theme.wav?v=3');
phaseMusic.preload='auto';
phaseMusic.loop=true;
phaseMusic.volume=.42;
const phaseMusicAlt=new Audio('assets/audio/los-pisos-rojos-theme.wav?v=3');
phaseMusicAlt.preload='auto';
phaseMusicAlt.loop=true;
phaseMusicAlt.volume=.42;
let activePhaseMusic=phaseMusic,phaseMusicStarted=false,phaseLoopContext=null,phaseLoopSource=null,phaseLoopRequest=0;
function stopPhaseMusic(){phaseMusicStarted=false;phaseLoopRequest++;if(phaseLoopSource){try{phaseLoopSource.stop()}catch{}phaseLoopSource=null}[phaseMusic,phaseMusicAlt].forEach(clip=>{clip.pause();clip.currentTime=0;clip.volume=.42})}
async function startPhaseMusic(){stopPhaseMusic();const request=phaseLoopRequest;try{phaseLoopContext??=new (window.AudioContext||window.webkitAudioContext)();if(phaseLoopContext.state==='suspended')await phaseLoopContext.resume();const response=await fetch('assets/audio/los-pisos-rojos-theme.wav?v=3'),buffer=await phaseLoopContext.decodeAudioData(await response.arrayBuffer());if(request!==phaseLoopRequest)return;const source=phaseLoopContext.createBufferSource(),gain=phaseLoopContext.createGain();source.buffer=buffer;source.loop=true;source.loopStart=0;source.loopEnd=buffer.duration;gain.gain.value=.42;source.connect(gain);gain.connect(phaseLoopContext.destination);phaseLoopSource=source;phaseMusicStarted=true;source.start()}catch{if(request!==phaseLoopRequest)return;activePhaseMusic=phaseMusic;phaseMusicStarted=true;phaseMusic.loop=true;phaseMusic.play().catch(()=>{})}}
const punchImpactSfx=[new Audio('assets/audio/punch-impact.mp3'),new Audio('assets/audio/punch-impact-alt.mp3')];
const punchBlockSfx=new Audio('assets/audio/punch-blocked.mp3');
const knockoutSfx=[new Audio('assets/audio/knockout-2.mp3')];
const stageClearCheer=new Audio('assets/audio/stage-clear-cheer.mp3');
const distantShoutSfx=new Audio('assets/audio/distant-shout.wav');
const pressStartSfx=new Audio('assets/audio/press-start.mp3');
punchImpactSfx.forEach(sound=>{sound.preload='auto';sound.volume=.20});
punchBlockSfx.preload='auto';
punchBlockSfx.volume=.48;
knockoutSfx.forEach(sound=>{sound.preload='auto';sound.volume=.05});
stageClearCheer.preload='auto';
stageClearCheer.volume=.45;
// Se oye bajo y ligeramente ralentizado para que parezca venir de fuera de la escena.
distantShoutSfx.preload='auto';
distantShoutSfx.volume=.12;
distantShoutSfx.playbackRate=.92;
pressStartSfx.preload='auto';
pressStartSfx.volume=.42;
let punchImpactIndex=0,knockoutIndex=0,distantShout={active:false,elapsed:0};
function playClip(source){source.pause();source.currentTime=0;source.play().catch(()=>{})}
function playPunchImpactSfx(){playClip(punchImpactSfx[punchImpactIndex++%punchImpactSfx.length])}
function playPunchBlockSfx(){playClip(punchBlockSfx)}
function playKnockoutSfx(){playClip(knockoutSfx[knockoutIndex++%knockoutSfx.length])}
function playDistantShout(delay=0){const play=()=>{const audio=sfxContext(),buffer=distantShoutBuffer;if(audio&&buffer){const source=audio.createBufferSource(),gain=audio.createGain();source.buffer=buffer;source.playbackRate.value=.86;gain.gain.value=.10;source.connect(gain);gain.connect(audio.destination);source.start()}else{const clip=distantShoutSfx.cloneNode();clip.volume=.10;clip.playbackRate=.86;clip.play().catch(()=>{})}distantShout={active:true,elapsed:0}};if(delay>0)setTimeout(play,delay);else play()}
function startStageClear(){stopPhaseMusic();stageClear={active:true,elapsed:0,finished:false,endingElapsed:0};stageClearCheer.pause();stageClearCheer.currentTime=0;stageClearCheer.volume=.45;stageClearCheer.play().catch(()=>{})}
function playCarArrivalSound(){try{const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return;const audio=new AudioContext(),now=audio.currentTime,osc=audio.createOscillator(),filter=audio.createBiquadFilter(),gain=audio.createGain();osc.type='sawtooth';osc.frequency.setValueAtTime(92,now);osc.frequency.exponentialRampToValueAtTime(46,now+1.35);filter.type='lowpass';filter.frequency.setValueAtTime(330,now);filter.Q.value=1.8;gain.gain.setValueAtTime(.001,now);gain.gain.exponentialRampToValueAtTime(.075,now+.09);gain.gain.exponentialRampToValueAtTime(.001,now+1.45);osc.connect(filter);filter.connect(gain);gain.connect(audio.destination);osc.start(now);osc.stop(now+1.47);setTimeout(()=>audio.close(),1800)}catch{}}
let sfxAudio;
function sfxContext(){try{const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return null;sfxAudio??=new AudioContext();if(sfxAudio.state==='suspended')sfxAudio.resume();return sfxAudio}catch{return null}}
let combatImpactBuffers=[],distantShoutBuffer=null,combatImpactWarmup=null;
function warmCombatImpactSfx(){if(combatImpactWarmup)return combatImpactWarmup;const audio=sfxContext();if(!audio)return Promise.resolve();combatImpactWarmup=Promise.all(['assets/audio/punch-impact.mp3','assets/audio/punch-impact-alt.mp3','assets/audio/distant-shout.wav'].map(url=>fetch(url).then(response=>response.arrayBuffer()).then(bytes=>audio.decodeAudioData(bytes)))).then(buffers=>{combatImpactBuffers=buffers.slice(0,2);distantShoutBuffer=buffers[2]}).catch(()=>{combatImpactBuffers=[];distantShoutBuffer=null});return combatImpactWarmup}
const playPunchImpactSfxFallback=playPunchImpactSfx;playPunchImpactSfx=function(){const audio=sfxContext(),buffer=combatImpactBuffers[punchImpactIndex++%Math.max(1,combatImpactBuffers.length)];if(!audio||!buffer){playPunchImpactSfxFallback();return}const source=audio.createBufferSource(),gain=audio.createGain();source.buffer=buffer;gain.gain.value=.20;source.connect(gain);gain.connect(audio.destination);source.start()}
function playStartSfx(){const clip=pressStartSfx.cloneNode();clip.volume=pressStartSfx.volume;clip.play().catch(()=>{});return clip}
function playHitSfx(){const audio=sfxContext();if(!audio)return;const now=audio.currentTime,osc=audio.createOscillator(),gain=audio.createGain();osc.type='triangle';osc.frequency.setValueAtTime(175,now);osc.frequency.exponentialRampToValueAtTime(62,now+.075);gain.gain.setValueAtTime(.001,now);gain.gain.exponentialRampToValueAtTime(.13,now+.008);gain.gain.exponentialRampToValueAtTime(.001,now+.09);osc.connect(gain);gain.connect(audio.destination);osc.start(now);osc.stop(now+.1)}
function playKnockSfx(){const audio=sfxContext();if(!audio)return;const now=audio.currentTime,osc=audio.createOscillator(),filter=audio.createBiquadFilter(),gain=audio.createGain();osc.type='sawtooth';osc.frequency.setValueAtTime(175,now);osc.frequency.exponentialRampToValueAtTime(76,now+.38);filter.type='lowpass';filter.frequency.value=620;gain.gain.setValueAtTime(.001,now);gain.gain.exponentialRampToValueAtTime(.075,now+.035);gain.gain.exponentialRampToValueAtTime(.001,now+.42);osc.connect(filter);filter.connect(gain);gain.connect(audio.destination);osc.start(now);osc.stop(now+.44)}
bg.src='assets/backgrounds/fase1-los-pisos-rojos-extended.png'; carImg.src='assets/vehicles/nissan-serena.png'; scrapCartImg.src='assets/props/carro-chatarra.png'; stageClearImg.src='assets/ui/stage-clear.png'; idleImg.src='assets/characters/rafa-king/idle.png'; jumpImg.src='assets/characters/rafa-king/jump.png'; punchImg.src='assets/characters/rafa-king/punch.png'; kickImg.src='assets/characters/rafa-king/kick.png';
airKickImg.src='assets/characters/rafa-king/air-kick.png';
airRecoverImg.src='assets/characters/rafa-king/air-recover.png';
rafaSpecialWindup.src='assets/characters/rafa-king/special-spin-windup.png';
rafaSpecialKickA.src='assets/characters/rafa-king/special-spin-kick-a.png';
rafaSpecialKickB.src='assets/characters/rafa-king/special-spin-kick-b.png';
crouchImg.src='assets/characters/rafa-king/crouch.png';
rafaHitImg.src='assets/characters/rafa-king/hit.png';
rafaDownImg.src='assets/characters/rafa-king/down.png';
walkImgs[0].src='assets/characters/rafa-king/walk1.png';
walkImgs[1].src='assets/characters/rafa-king/walk2.png';
walkImgs[2].src='assets/characters/rafa-king/walk3.png';
walkImgs[3].src='assets/characters/rafa-king/walk4.png';
walkImgs[4].src='assets/characters/rafa-king/walk5.png';
walkImgs[5].src='assets/characters/rafa-king/walk6.png';
rafaWalkCenter.src='assets/characters/rafa-king/walk-center-test.png';
const rafaWalkOpposite=imgFromData('assets/characters/rafa-king/walk-opposite.png');
const rafaWalkTransitionA=imgFromData('assets/characters/rafa-king/walk-transition-a.png');
const rafaWalkTransitionB=imgFromData('assets/characters/rafa-king/walk-transition-b.png');
const rafaWalkCycle=[
  walkImgs[0],rafaWalkTransitionA,rafaWalkCenter,rafaWalkTransitionB,
  rafaWalkOpposite,rafaWalkTransitionB,rafaWalkCenter,rafaWalkTransitionA
];
let W=0,H=0,cam=0,worldW=5198,facing=1,pixelRatio=1;
let introPhase='none',introClock=0,introCarX=-700,introWheelAngle=0,introDoorOpen=0;
// La plaza azul ocupa x=59..461 en el fondo: el coche queda centrado sobre ella.
const introCarParkX=60;
const keys={}; let zPressed=false, xPressed=false,specialPressed=false, comboHeld=false,comboPressed=false; let state='idle', attackTimer=0,crouchTimer=0,jumpActive=false,jumpT=0,jumpY=0,jumpKick=false,jumpRecover=false,walkFrame=0,walkClock=0,walkDistance=0,comparisonMode=false,playerAttackLanded=false,playerHitTimer=0,playerDead=false,playerKnocked=false,playerKnockTimer=0,playerComboHits=0,playerComboTimer=0,playerComboSource=null,invincible=false,rafaSpecialMeter=0,rafaSpecialAttack=null;
// Pulido: fases temporizadas sobre los sprites aprobados, sin cambiar ningún PNG.
const pulidoAttackTiming={punch:{windup:80,impact:45,hold:70,recover:100},kick:{windup:100,impact:55,hold:85,recover:120}};
let pulidoAttack=null,pulidoHitStopMs=0;
let impactFlash={active:false,elapsed:0,x:0,y:0,direction:1,strength:1};
// Solo la cadencia visual de caminar de los enemigos: 23 % y luego otro 20 % más rápida, sin variar su velocidad real.
const enemyWalkFrameStride=9/(1.23*1.20);
const player={x:180,y:0,hp:100,maxHp:100};
const enemy={x:1160,y:0,facing:-1,state:'idle',walkDistance:0,walkFrame:0,attackTimer:0,hp:96,maxHp:96,hitTimer:0,comboHits:0,comboTimer:0,knocked:false,knockTimer:0,dead:false,deadTimer:0,hidden:true,active:false,attackLanded:false,name:'NUMETALERO'};
const yonki={x:1510,y:0,facing:-1,state:'idle',walkDistance:0,walkFrame:0,attackTimer:0,hp:84,maxHp:84,hitTimer:0,comboHits:0,comboTimer:0,knocked:false,knockTimer:0,dead:false,deadTimer:0,hidden:true,active:false,attackLanded:false,name:'CABESA'};
const yonkiRojo={x:1690,y:0,facing:-1,state:'idle',walkDistance:0,walkFrame:0,attackTimer:0,hp:84,maxHp:84,hitTimer:0,comboHits:0,comboTimer:0,knocked:false,knockTimer:0,dead:false,deadTimer:0,hidden:true,active:false,attackLanded:false,name:'MIGUE',variant:true};
const yonkiTres={x:1870,y:0,facing:-1,state:'idle',walkDistance:0,walkFrame:0,attackTimer:0,hp:92,maxHp:92,hitTimer:0,comboHits:0,comboTimer:0,knocked:false,knockTimer:0,dead:false,deadTimer:0,hidden:true,active:false,attackLanded:false,name:'JUANILLO'};
const yonkiTresRubio={x:2200,y:0,facing:-1,state:'idle',walkDistance:0,walkFrame:0,attackTimer:0,hp:92,maxHp:92,hitTimer:0,comboHits:0,comboTimer:0,knocked:false,knockTimer:0,dead:false,deadTimer:0,hidden:true,active:false,attackLanded:false,name:'CANIJO',variant:true};
const yonkiTresNike={x:2050,y:0,facing:-1,state:'idle',walkDistance:0,walkFrame:0,attackTimer:0,hp:92,maxHp:92,hitTimer:0,comboHits:0,comboTimer:0,knocked:false,knockTimer:0,dead:false,deadTimer:0,hidden:true,active:false,attackLanded:false,name:'ER CRISTIAN'};
const kani2Enemy={x:2230,y:0,facing:-1,state:'idle',walkDistance:0,walkFrame:0,attackTimer:0,hp:92,maxHp:92,hitTimer:0,comboHits:0,comboTimer:0,knocked:false,knockTimer:0,dead:false,deadTimer:0,hidden:true,active:false,attackLanded:false,name:'DOMINGO'};
const heavyEnemy={x:2380,y:0,facing:-1,state:'idle',walkDistance:0,walkFrame:0,attackTimer:0,hp:138,maxHp:138,hitTimer:0,comboHits:0,comboTimer:0,knocked:false,knockTimer:0,dead:false,deadTimer:0,hidden:true,active:false,attackLanded:false,name:'HEAVY'};
const jefe={x:worldW-260,y:0,facing:-1,state:'idle',walkDistance:0,walkFrame:0,attackTimer:0,engaged:false,drinkTimer:0,drinkCooldown:480,hp:300,maxHp:300,hitTimer:0,comboHits:0,comboTimer:0,knocked:false,knockTimer:0,dead:false,deadTimer:0,hidden:true,active:false,attackLanded:false,name:'SA BOSS'};
const phaseWaves=[{trigger:650,barrier:1280},{trigger:1770,barrier:2580},{trigger:2910,barrier:3880},{trigger:4040,barrier:4630}];
const normalActors=[enemy,yonki,yonkiRojo,yonkiTres,yonkiTresRubio,yonkiTresNike,kani2Enemy,heavyEnemy];
const waveRosters=[[yonki,yonkiTres,yonkiRojo],[yonkiTresNike,yonkiTresRubio,enemy],[yonkiRojo,heavyEnemy,yonkiTres,yonki],[kani2Enemy,yonkiTresNike,yonkiTresRubio,yonkiRojo]];
const waveEntryPlans=[
 {delays:[0,60,126],sides:[1,1,-1],roles:['pressure','support','flanker']},
 {delays:[0,48,108],sides:[-1,1,1],roles:['flanker','pressure','pressure']},
 {delays:[0,66,132,204],sides:[1,-1,1,-1],roles:['flanker','pressure','support','pressure']},
 {delays:[0,48,102,168],sides:[-1,1,-1,1],roles:['pressure','flanker','pressure','support']}
];
let activeWave=-1,nextWave=0,bossActivated=false,activeWaveActors=[],phaseCameraLock=null;
let bossCart={active:false,phase:'none',x:0,y:0,vx:0,hit:false,throwerX:0};
let stageClear={active:false,elapsed:0,finished:false};
let continueCue={active:false,shown:false,elapsed:0};
let phaseTime=250,timeExpired=false,advancePrompt=false;
// Compatibilidad con la partida ya iniciada: no muestra ninguna escena de jefe.
let bossIntroActive=false;
const bossIntroScreen={classList:{remove(){}}};
const startScreen=document.getElementById('startScreen');
const startArt=document.querySelector('.startImage img'),startArtSource=startArt.getAttribute('src');
const startButtonFocusStyle=document.createElement('style');
startButtonFocusStyle.textContent='#startButton:focus{outline:none!important}';
document.head.append(startButtonFocusStyle);
const startPromptLayer=new Image();
startPromptLayer.className='startPromptLayer';
document.querySelector('.startImage').append(startPromptLayer);
const startPromptStyle=document.createElement('style');
startPromptStyle.textContent='.startPromptLayer{position:absolute;inset:0;width:100%;height:100%;object-fit:fill;pointer-events:none;animation:pressStartFade 1s ease-in-out infinite alternate}.starting .startPromptLayer{animation:none;opacity:1}@keyframes pressStartFade{from{opacity:1}to{opacity:0}}';
document.head.append(startPromptStyle);
let startPromptVariants=null;
function prepareStartArt(){const source=new Image();source.onload=()=>{const base=document.createElement('canvas'),normal=document.createElement('canvas'),gold=document.createElement('canvas');[base,normal,gold].forEach(sheet=>{sheet.width=source.naturalWidth;sheet.height=source.naturalHeight;sheet.getContext('2d').drawImage(source,0,0)});const basePaint=base.getContext('2d'),normalPaint=normal.getContext('2d'),goldPaint=gold.getContext('2d'),basePixels=basePaint.getImageData(0,0,base.width,base.height),normalPixels=normalPaint.getImageData(0,0,normal.width,normal.height),goldPixels=goldPaint.getImageData(0,0,gold.width,gold.height),baseData=basePixels.data,normalData=normalPixels.data,goldData=goldPixels.data,left=Math.floor(base.width*.34),right=Math.ceil(base.width*.66),top=Math.floor(base.height*.76),bottom=Math.ceil(base.height*.89);for(let y=0;y<base.height;y++)for(let x=0;x<base.width;x++){const i=(y*base.width+x)*4,inPrompt=x>=left&&x<right&&y>=top&&y<bottom,r=baseData[i],g=baseData[i+1],b=baseData[i+2],a=baseData[i+3],light=(r+g+b)/3,letter=inPrompt&&a>20&&light>125&&Math.max(r,g,b)-Math.min(r,g,b)<120;if(letter){baseData[i+3]=0;goldData[i]=Math.min(255,110+light*.78);goldData[i+1]=Math.min(220,68+light*.58);goldData[i+2]=Math.max(12,Math.round(light*.16))}else{normalData[i+3]=0;goldData[i+3]=0}}basePaint.putImageData(basePixels,0,0);normalPaint.putImageData(normalPixels,0,0);goldPaint.putImageData(goldPixels,0,0);startPromptVariants={base:base.toDataURL('image/png'),normal:normal.toDataURL('image/png'),gold:gold.toDataURL('image/png')};startArt.src=startPromptVariants.base;startPromptLayer.src=startPromptVariants.normal};source.src=startArtSource}
function showStartPromptGold(){if(startPromptVariants)startPromptLayer.src=startPromptVariants.gold}
prepareStartArt();
const mapScreen=document.getElementById('mapScreen');
const mapImage=mapScreen.querySelector('.mapImage');
mapImage.querySelector('img').src='assets/ui/mapa-torreblanca-fase1-sin-trazo.png';
const mapDistrictTorreblanca=document.createElement('div');
mapDistrictTorreblanca.className='mapDistrict mapDistrictTorreblanca';
mapDistrictTorreblanca.setAttribute('aria-hidden','true');
const mapDistrictPisos=document.createElement('div');
mapDistrictPisos.className='mapDistrict mapDistrictPisos';
mapDistrictPisos.setAttribute('aria-hidden','true');
mapImage.append(mapDistrictTorreblanca,mapDistrictPisos);
const mapTitle=document.createElement('div');
mapTitle.textContent='LOS PISOS ROJOS';
mapTitle.setAttribute('aria-hidden','true');
mapTitle.style.cssText='position:absolute;left:54.7%;top:64.3%;transform:translate(-50%,-50%);font:700 clamp(18px,2.15vw,34px) monospace;letter-spacing:.08em;color:#fff3ca;white-space:nowrap;text-shadow:0 0 4px #061020,0 0 9px #061020,0 0 15px #061020;pointer-events:none;z-index:2';
mapScreen.querySelector('.mapImage').append(mapTitle);
let mapTimer=0;
const rouletteOrder=['cajaman','casta','pako','pulido','rafa','salvi'];
const rouletteNames={cajaman:'CAJAMAN',casta:'CASTA',pako:'PAKO',pulido:'PULIDO',rafa:'RAFA KING',salvi:'SALVI'};
const rouletteCarousel=document.getElementById('rouletteCarousel');
const rouletteCards=Array.from(document.querySelectorAll('.rouletteCard'));
let rouletteIndex=4;
let rouletteRotation=-rouletteIndex*60;
function startScreenActive(){return startScreen.style.display!=='none';}
function mapScreenActive(){return mapScreen.style.display==='flex';}
function selectionScreenActive(){return document.getElementById('selectScreen').style.display!=='none';}
function updateRoulette(){rouletteCarousel.style.transform=`rotateY(${rouletteRotation}deg)`;rouletteCards.forEach(card=>card.classList.toggle('active',card.dataset.character===rouletteOrder[rouletteIndex]));}
function moveRoulette(direction){rouletteIndex=(rouletteIndex+direction+rouletteOrder.length)%rouletteOrder.length;rouletteRotation-=direction*60;updateRoulette();}
function selectRouletteCharacter(){selectCharacter(rouletteOrder[rouletteIndex]);}
function requestGameFullscreen(){const root=document.documentElement;if(!document.fullscreenElement&&root.requestFullscreen)root.requestFullscreen({navigationUI:'hide'}).catch(()=>{});}
function beginGame(){if(!startScreenActive()||startScreen.classList.contains('starting'))return;document.getElementById('startButton').blur();requestGameFullscreen();warmCombatImpactSfx();startScreen.classList.add('starting');showStartPromptGold();playStartSfx();setTimeout(()=>{startScreen.style.display='none';selectionMusic.currentTime=0;selectionMusic.play().catch(()=>{})},2000);}
function beginPhaseIntro(){if(!mapScreenActive())return;clearTimeout(mapTimer);mapScreen.style.display='none';selectionMusic.pause();selectionMusic.currentTime=0;startPhaseMusic();startIntro();}
function showMapScreen(){mapScreen.style.display='flex';if(Number.isFinite(selectionMusic.mapResumeTime))selectionMusic.currentTime=selectionMusic.mapResumeTime;selectionMusic.play().catch(()=>{});clearTimeout(mapTimer);mapTimer=setTimeout(beginPhaseIntro,4000);}
document.getElementById('startButton').onclick=beginGame;
startScreen.addEventListener('click',beginGame);
document.getElementById('mapButton').onclick=beginPhaseIntro;
mapScreen.addEventListener('click',beginPhaseIntro);
rouletteCards.forEach(card=>card.onclick=()=>{const index=rouletteOrder.indexOf(card.dataset.character);if(index===rouletteIndex){selectRouletteCharacter();return;}let distance=index-rouletteIndex;if(distance>rouletteOrder.length/2)distance-=rouletteOrder.length;if(distance<-rouletteOrder.length/2)distance+=rouletteOrder.length;rouletteIndex=index;rouletteRotation-=distance*60;updateRoulette();});
updateRoulette();
function resize(){pixelRatio=Math.max(1,window.devicePixelRatio||1);W=canvas.clientWidth;H=canvas.clientHeight;canvas.width=Math.round(W*pixelRatio);canvas.height=Math.round(H*pixelRatio);ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);}
addEventListener('resize',resize); resize();
function mobileGameplayScale(value){return value}
// La versión final está pensada para móvil. Aplicamos esta misma composición en
// ordenador para que la previsualización local coincida con el teléfono.
function mobileLayout(){return true}
function applyViewportTransform(){const zoom=.8192;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);const edgeBlend=Math.min(1,cam/(W*.32||1),Math.max(0,(worldW-W-cam)/(W*.32||1)));const anchorX=W*(.28*edgeBlend),anchorY=H*.72;ctx.setTransform(pixelRatio*zoom,0,0,pixelRatio*zoom,pixelRatio*anchorX*(1-zoom),pixelRatio*anchorY*(1-zoom));}
function laneTop(){return H*.735}
function laneBottom(){
 // Convert the visible bottom edge to world coordinates under the viewport zoom.
 const zoom=.8192,offsetY=H*.72*(1-zoom);
 return (H-offsetY-3)/zoom;
}
function groundY(){return H*.735} // Unión del bordillo con el asfalto.
player.y=laneBottom();
addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();
  if(startScreenActive()){e.preventDefault();e.startScreenHandled=true;beginGame();return;}
  if(mapScreenActive()){e.preventDefault();e.mapScreenHandled=true;beginPhaseIntro();return;}
  if(selectionScreenActive()){if(k==='arrowleft'||k==='a'){e.preventDefault();moveRoulette(-1);return;}if(k==='arrowright'||k==='d'){e.preventDefault();moveRoulette(1);return;}if(k==='z'||e.key==='Enter'||e.key===' '){e.preventDefault();selectRouletteCharacter();return;}e.preventDefault();return;}
  if(k==='i'){invincible=!invincible;if(invincible&&(playerDead||playerKnocked)){playerDead=false;playerKnocked=false;player.hp=player.maxHp;state='idle';}e.preventDefault();return;}
  if(playerDead){if(k==='r'){selectCharacter(selectedCharacter);}e.preventDefault();return;}
  if(k==='o'&&document.getElementById('selectScreen').style.display==='none'&&!introRunning()){comparisonMode=!comparisonMode;return;}
  if(!keys[k]){ if(k==='z')zPressed=true; if(k==='x')xPressed=true; if(k==='c'&&specialAvailable())specialPressed=true; if(k==='v')specialPressed=true; }
  keys[k]=true;
  if(keys['z']&&keys['x']&&!comboHeld&&!specialPressed){comboPressed=true;comboHeld=true;}
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key))e.preventDefault();
  if((k==='c'||e.key===' ')&&!jumpActive&&!introRunning()&&!rafaSpecialAttack&&!pulidoSpecialAttack&&!specialPressed){jumpActive=true;jumpT=0;jumpY=0;jumpKick=false;state='jump';}
});
addEventListener('keyup',e=>{
  const k=e.key.toLowerCase(); keys[k]=false;
  if(!keys['z']||!keys['x']) comboHeld=false;
});
function drawBackground(){
  const scale=Math.max(H/bg.height,W/bg.width*0.62);
  const mobileSceneryScale=mobileLayout()?2.35:1;
  const ih=bg.height*scale*mobileSceneryScale;
  // En móvil se acerca solo el decorado, anclado a la calle: los personajes mantienen su escala actual.
  const iw=worldW*mobileSceneryScale;
  const ox=-cam+W*.5*(1-mobileSceneryScale),oy=H*.72*(1-mobileSceneryScale);
  ctx.drawImage(bg,ox,oy,iw,ih);
}
function carMetrics(){const width=400;return {width,height:width*carImg.height/carImg.width};}
function introRunning(){return introPhase==='arrival'||introPhase==='doors'||introPhase==='exit';}
function updateCamera(){if(introRunning()){cam=0;return}if(phaseCameraLock!==null){cam=phaseCameraLock;return}cam+=(player.x-cam-W*.28)*.08;cam=Math.max(0,Math.min(worldW-W,cam));}
function carBlocksAt(x,y){if(introPhase!=='done')return false;const car=carMetrics(),bottom=H*.84,top=bottom-car.height;const padding=16;return x+padding>introCarParkX&&x-padding<introCarParkX+car.width&&y+padding>top&&y-padding<bottom;}
function resolveWorldCollision(previousX,previousY){const movedX=player.x,movedY=player.y;if(carBlocksAt(movedX,previousY))player.x=previousX;if(carBlocksAt(previousX,movedY))player.y=previousY;if(carBlocksAt(player.x,player.y)){player.x=previousX;player.y=previousY;}player.y=Math.max(laneTop(),Math.min(laneBottom(),player.y));}
function startIntro(){const car=carMetrics();playCarArrivalSound();introPhase='arrival';introClock=0;introCarX=-car.width-30;introWheelAngle=0;introDoorOpen=0;player.x=introCarParkX+car.width*.64;player.y=laneBottom();state='idle';}
function updateIntro(dt){const elapsed=dt/60,car=carMetrics();if(introPhase==='arrival'){introClock+=elapsed;introWheelAngle+=dt*.09;const p=Math.min(1,introClock/1.45),ease=1-Math.pow(1-p,3);introCarX=(-car.width-30)+(introCarParkX+car.width+30)*ease;if(p>=1){introCarX=introCarParkX;introPhase='doors';introClock=0;}}
 else if(introPhase==='doors'){introClock+=elapsed;introDoorOpen=Math.min(1,introClock/.55);if(introDoorOpen>=1){introPhase='exit';introClock=0;player.x=introCarParkX+car.width*.64;facing=1;state='jump';jumpY=0;walkFrame=0;walkClock=0;}}
 else if(introPhase==='exit'){introClock+=elapsed;const p=Math.min(1,introClock/.82);introDoorOpen=Math.max(0,1-p*1.2);player.x=introCarParkX+car.width*(.64+.52*p);if(p<.42){state='jump';jumpY=-Math.sin((p/.42)*Math.PI)*H*.052}else{state='walk';jumpY=0;walkClock+=dt*16.67;if(walkClock>=150){walkClock-=150;walkFrame=(walkFrame+1)%currentSet().walk.length;}}if(p>=1){introPhase='done';introDoorOpen=0;jumpY=0;state='idle';walkClock=0;walkFrame=0;zPressed=false;xPressed=false;comboPressed=false;}}
 updateCamera();}
function drawCarWheel(cx,cy,r,angle){ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);ctx.fillStyle='#090b0e';ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#87909a';ctx.lineWidth=Math.max(2,r*.12);ctx.beginPath();ctx.arc(0,0,r*.62,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#d4d8dd';ctx.lineWidth=Math.max(1,r*.08);for(let i=0;i<5;i++){ctx.rotate(Math.PI*2/5);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(r*.55,0);ctx.stroke();}ctx.fillStyle='#20262d';ctx.beginPath();ctx.arc(0,0,r*.19,0,Math.PI*2);ctx.fill();ctx.restore();}
function drawCarPassengers(x,y,w,h){const people=[['rafa',idleImg],['casta',casta.idle],['pulido',pulido.idle],['salvi',salvi.idle],['cajaman',cajaman.idle],['pako',pako.idle]].filter(([name])=>name!==selectedCharacter).map(([,img])=>img);ctx.save();ctx.beginPath();ctx.rect(x+w*.530,y+h*.225,w*.192,h*.222);ctx.rect(x+w*.742,y+h*.245,w*.170,h*.202);ctx.clip();people.slice(0,4).forEach((img,index)=>{if(!img.complete)return;const height=h*.29,width=height*img.width/img.height,cx=x+w*(.565+index*.095),base=y+h*.462;ctx.save();ctx.globalAlpha=.72;ctx.drawImage(img,cx-width/2,base-height,width,height);ctx.globalCompositeOperation='source-in';ctx.fillStyle='#020407';ctx.fillRect(cx-width/2-1,base-height-1,width+2,height+2);ctx.restore();});ctx.restore();}
function drawIntroCar(){if(introPhase==='none'||!carImg.complete)return;const car=carMetrics(),x=introCarX-cam,parkingBottom=H*.84,y=parkingBottom-car.height,w=car.width,h=car.height;ctx.save();ctx.drawImage(carImg,x,y,w,h);drawCarPassengers(x,y,w,h);ctx.save();ctx.fillStyle='rgba(0,4,9,.58)';const glass=[[[.285,.335],[.382,.225],[.401,.225],[.401,.447],[.300,.447]],[[.410,.225],[.503,.225],[.503,.447],[.410,.447]],[[.530,.225],[.722,.225],[.722,.447],[.530,.447]],[[.742,.245],[.912,.263],[.925,.447],[.742,.447]]];glass.forEach(points=>{ctx.beginPath();points.forEach(([px,py],index)=>index?ctx.lineTo(x+w*px,y+h*py):ctx.moveTo(x+w*px,y+h*py));ctx.closePath();ctx.fill();});ctx.restore();drawCarWheel(x+w*.20,y+h*.82,h*.145,introWheelAngle);drawCarWheel(x+w*.82,y+h*.82,h*.145,introWheelAngle);if(introDoorOpen>0){const sx=carImg.width*.516,sy=carImg.height*.185,sw=carImg.width*.228,sh=carImg.height*.685,doorX=x+w*.516,doorY=y+h*.185,doorW=w*.228,doorH=h*.685,slide=doorW*.72*introDoorOpen;ctx.save();ctx.fillStyle='rgba(2,4,7,.94)';ctx.fillRect(doorX,doorY,doorW,doorH);ctx.drawImage(carImg,sx,sy,sw,sh,doorX+slide,doorY,doorW,doorH);ctx.restore();}ctx.restore();}
function currentSet(){if(selectedCharacter==='casta')return casta;if(selectedCharacter==='pulido')return pulido;if(selectedCharacter==='salvi')return salvi;if(selectedCharacter==='cajaman')return cajaman;if(selectedCharacter==='pako')return pako;return {idle:idleImg,walk:rafaWalkCycle,punch:punchImg,kick:kickImg,crouch:crouchImg,jump:jumpImg,airKick:airKickImg,airRecover:airRecoverImg,hit:rafaHitImg,down:rafaDownImg,special:[rafaSpecialWindup,rafaSpecialKickA,rafaSpecialKickB]};}
function drawPlayer(){if(introPhase==='arrival'||introPhase==='doors')return;let s=currentSet(),img=s.idle,scale=mobileGameplayScale(selectedCharacter==='casta'?0.58:0.71);if(playerDead&&s.down)img=s.down;else if(playerHitTimer>0&&s.hit)img=s.hit;else if(state==='specialWindup'&&s.special){img=s.special[0]}else if(state==='specialKickA'&&s.special){img=s.special[1]}else if(state==='specialKickB'&&s.special){img=s.special[2]}else if(state==='jumpKick'){img=s.airKick}else if(state==='jumpRecover'){img=s.airRecover}else if(state==='jump'){img=s.jump}else if(state==='punch'||state==='punchImpact'||state==='punchHold'){img=s.punch}else if(state==='kick'||state==='kickImpact'||state==='kickHold'){img=s.kick}else if(state==='crouch'){img=s.crouch}else if(state==='walk'){img=s.walk[walkFrame%s.walk.length]} const walking=state==='walk'&&!jumpActive,walkBob=walking?Math.abs(Math.sin(walkDistance*.12))*1.15:0;let w=img.width*scale,h=img.height*scale;let x=player.x-cam-w/2;let baseY=player.y;let y=baseY-h+jumpY-walkBob;ctx.save();if(playerDead&&!s.down){ctx.globalAlpha=.34;ctx.translate(x+w/2,y+h);ctx.rotate(-Math.PI/2);ctx.translate(-x-w/2,-y-h)}else if(playerHitTimer>0&&!s.hit)ctx.globalAlpha=playerHitTimer%4<2?.35:1;if(facing<0){ctx.translate(x+w,y);ctx.scale(-1,1);ctx.drawImage(img,0,0,w,h)}else ctx.drawImage(img,x,y,w,h);ctx.restore();if(jumpActive){ctx.save();ctx.globalAlpha=.28;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(player.x-cam,player.y+4,28,7,0,0,Math.PI*2);ctx.fill();ctx.restore();}}
const drawPlayerBase=drawPlayer;drawPlayer=function(){if(playerKnocked){const wasDead=playerDead;playerDead=true;drawPlayerBase();playerDead=wasDead;return}drawPlayerBase()}
function combatActors(){return [...normalActors,jefe].filter(actor=>actor.active)}
function enemySet(actor){if(actor===enemy)return metalero;if(actor===yonki)return yonki2;if(actor===yonkiRojo)return yonki2Rojo;if(actor===yonkiTresNike)return yonki3Nike;if(actor===kani2Enemy)return kani2;if(actor===heavyEnemy)return heavy;return actor.variant?yonki3Rubio:yonki3}
function resetWaveActor(actor,x,y,slot=0){const lane=[-54,0,54][slot]||0;Object.assign(actor,{x,y,facing:-1,state:'idle',walkDistance:0,walkFrame:0,attackTimer:0,attackLanded:false,hp:actor.maxHp,hitTimer:0,guardTimer:0,guardCooldown:0,comboHits:0,comboTimer:0,knocked:false,knockTimer:0,dead:false,deadTimer:0,hidden:false,active:true,strafeClock:0,aiLane:lane+(Math.random()*18-9),aiDecisionTimer:620+Math.random()*460,attackCooldown:slot*13,aiPhase:slot*2.3,retreatTimer:0,waitTimer:0,aiSkirmisher:false,aiRole:'pressure'})}
function activateWave(index){advancePrompt=false;phaseCameraLock=cam;activeWaveActors=waveRosters[index];normalActors.forEach(actor=>{if(!activeWaveActors.includes(actor)){actor.active=false;actor.hidden=true}});activeWaveActors.forEach((actor,slot)=>{const fromRight=slot!==1;const x=fromRight?phaseCameraLock+W+34+slot*44:phaseCameraLock-34;resetWaveActor(actor,x,laneBottom()+[-18,10,-2][slot],slot);actor.aiRole=['pressure','flanker','support'][slot]||'pressure';actor.aiSkirmisher=actor.aiRole==='flanker';actor.aiLane=actor.aiRole==='pressure'?0:actor.aiRole==='flanker'?(Math.random()<.5?-48:48):(Math.random()<.5?-34:34);actor.attackCooldown=actor.aiRole==='pressure'?8:actor.aiRole==='flanker'?24:46});activeWave=index}
function activateBoss(){advancePrompt=false;resetWaveActor(jefe,worldW+310,laneBottom());jefe.engaged=false;jefe.drinkTimer=0;jefe.drinkCooldown=480;bossCart={active:true,phase:'entry',x:worldW+150,y:laneBottom(),vx:0,hit:false,throwerX:0};bossActivated=true}
function updatePhaseWaves(){if(activeWave>=0&&activeWaveActors.every(actor=>actor.dead)){activeWave=-1;nextWave++;activeWaveActors=[];phaseCameraLock=null;advancePrompt=true}if(activeWave<0&&nextWave<phaseWaves.length&&player.x>=phaseWaves[nextWave].trigger)activateWave(nextWave);if(nextWave>=phaseWaves.length&&!bossActivated&&player.x>=4780)activateBoss()}
function phaseBarrier(){return phaseCameraLock===null?Infinity:phaseCameraLock+W-playerHalfWidth()-8}
function actorScale(actor){return actor===enemy ? .44 : actor===jefe ? .90 : .70}
function playerHalfWidth(){const img=currentSet().idle,scale=mobileGameplayScale(selectedCharacter==='casta'?.58:.71);return img.width*scale/2}
function contactDistance(actor){return actor===jefe?62:46}
function inReach(ax,ay,bx,by,reach){return Math.abs(ax-bx)<reach&&Math.abs(ay-by)<24}
function triggerImpact(x,y,direction,strength=1){impactFlash={active:true,elapsed:0,x,y,direction,strength};pulidoHitStopMs=Math.max(pulidoHitStopMs,strength>1?60:52)}
function damageEnemy(actor,amount,knockDirection=facing,canBlock=false){if(actor.dead||actor.knocked)return false;const reinforced=actor===enemy||actor===heavyEnemy,blockChance=reinforced?.275:.22,damageMultiplier=actor===jefe?.5:reinforced?.75:1,impactStrength=amount>=18?1.25:1;if(canBlock&&actor.guardTimer>0){actor.state='guard';actor.attackTimer=0;playPunchBlockSfx();return false}if(canBlock&&actor.comboHits===0&&(actor.guardCooldown||0)<=0&&Math.random()<blockChance){actor.guardTimer=55;actor.guardCooldown=78;actor.state='guard';actor.attackTimer=0;playPunchBlockSfx();return false}actor.hp=Math.max(0,actor.hp-amount*damageMultiplier);actor.hitTimer=18;actor.x+=knockDirection*(impactStrength>1?23:19);triggerImpact(actor.x,actor.y-actorScale(actor)*72,knockDirection,impactStrength);playPunchImpactSfx();actor.comboHits=actor.comboTimer>0?actor.comboHits+1:1;actor.comboTimer=42;if(actor.hp===0){actor.dead=true;actor.deadTimer=78;actor.hidden=false;actor.state='dead';actor.attackTimer=0;actor.drinkTimer=0;playKnockoutSfx();return true}if(actor.comboHits>=3){actor.knocked=true;actor.knockTimer=78;actor.comboHits=0;actor.comboTimer=0;actor.state='down';actor.attackTimer=0;playKnockoutSfx()}return true}
function damagePlayer(amount,from){if(playerDead||invincible)return;player.hp=Math.max(0,player.hp-amount);playerHitTimer=16;player.x+=from.facing*14;triggerImpact(player.x,player.y-52,from.facing);playPunchImpactSfx();if(player.hp===0){playerDead=true;state='dead';attackTimer=0;jumpActive=false;jumpY=0;stopPhaseMusic();playKnockoutSfx();playDistantShout(140)}}
damagePlayer=function(amount,from){if(playerDead||playerKnocked||invincible)return;player.hp=Math.max(0,player.hp-amount);playerHitTimer=16;player.x+=from.facing*14;triggerImpact(player.x,player.y-52,from.facing);playPunchImpactSfx();gainRafaSpecial(4);playerComboHits=playerComboTimer>0&&playerComboSource===from?playerComboHits+1:1;playerComboSource=from;playerComboTimer=42;const knockLimit=(from===enemy||from===heavyEnemy)?2:3;if(player.hp===0){playerDead=true;state='dead';attackTimer=0;jumpActive=false;jumpY=0;stopPhaseMusic();playKnockoutSfx();playDistantShout(140);return}if(playerComboHits>=knockLimit){playerKnocked=true;playerKnockTimer=78;playerComboHits=0;playerComboTimer=0;playerComboSource=null;state='down';attackTimer=0;jumpActive=false;jumpY=0;playKnockoutSfx()}}
function gainRafaSpecial(amount){if(!['rafa','pulido'].includes(selectedCharacter)||rafaSpecialAttack||pulidoSpecialAttack)return;rafaSpecialMeter=Math.min(100,rafaSpecialMeter+amount)}
function tryPlayerHit(forceKick=false){if(playerAttackLanded||playerDead)return false;const kicking=forceKick||state==='kick'||state==='jumpKick',hitReach=kicking?120:98,damage=kicking?18:14;for(const actor of combatActors()){if(actor.dead)continue;if(Math.abs(actor.x-player.x)<hitReach&&Math.abs(actor.y-player.y)<24){const canBlock=!kicking||actor===enemy||actor===heavyEnemy,damaged=damageEnemy(actor,damage,facing,canBlock);if(damaged){player.x-=facing*3;gainRafaSpecial(6)}playerAttackLanded=true;return damaged;}}return false}
function startRafaSpecial(){if(selectedCharacter!=='rafa'||rafaSpecialMeter<100||rafaSpecialAttack)return;rafaSpecialMeter=0;rafaSpecialAttack={elapsed:0,firstHit:false,secondHit:false,firstTargets:[]};state='specialWindup';zPressed=false;xPressed=false;specialPressed=false;attackTimer=0;playerAttackLanded=true}
function tryRafaSpecialHit(launch=false){
 let hit=false;
 for(const actor of combatActors()){
  if(actor.dead)continue;
  const struckBefore=rafaSpecialAttack?.firstTargets.includes(actor);
  if(actor.knocked&&!(launch&&struckBefore))continue;
  const ahead=(actor.x-player.x)*facing>0;
  if(!ahead||Math.abs(actor.x-player.x)>=(launch?210:180)||Math.abs(actor.y-player.y)>=28)continue;
  if(launch&&struckBefore)actor.knocked=false;
  if(damageEnemy(actor,launch?40:24,facing,false)){
   hit=true;
   if(!launch)rafaSpecialAttack?.firstTargets.push(actor);
   if(launch&&!actor.dead){actor.knocked=true;actor.knockTimer=130;actor.comboHits=0;actor.comboTimer=0;actor.state='down';actor.attackTimer=0;actor.guardTimer=0;actor.x+=facing*78;playKnockoutSfx();triggerImpact(actor.x,actor.y-actorScale(actor)*72,facing,1.5)}
  }
 }
 if(hit){player.x-=facing*5;pulidoHitStopMs=Math.max(pulidoHitStopMs,70)}return hit;
}
function updateRafaSpecial(dt){if(!rafaSpecialAttack)return;rafaSpecialAttack.elapsed+=dt*16.67;const t=rafaSpecialAttack.elapsed;if(t<250){state='specialWindup';return}if(t<455){state='specialKickA';if(!rafaSpecialAttack.firstHit){rafaSpecialAttack.firstHit=true;tryRafaSpecialHit(false)}return}if(t<600){state='specialTurn';return}if(t<820){state='specialKickB';if(!rafaSpecialAttack.secondHit){rafaSpecialAttack.secondHit=true;tryRafaSpecialHit(true)}return}rafaSpecialAttack=null;state='idle';walkClock=0;walkFrame=0}
function startPulidoAttack(kind){pulidoAttack={kind,elapsed:0,landed:false};attackTimer=1;playerAttackLanded=false;state=`${kind}Windup`;zPressed=false;xPressed=false}
function updatePulidoAttack(dt){if(!pulidoAttack)return;const attack=pulidoAttack,timing=pulidoAttackTiming[attack.kind];attack.elapsed+=dt*16.67;zPressed=false;xPressed=false;const impactAt=timing.windup,holdAt=impactAt+timing.impact,recoverAt=holdAt+timing.hold,endAt=recoverAt+timing.recover;if(attack.elapsed<impactAt){state=`${attack.kind}Windup`;return}if(attack.elapsed<holdAt){state=`${attack.kind}Impact`;if(!attack.landed){attack.landed=true;if(tryPlayerHit(attack.kind==='kick'))pulidoHitStopMs=60}return}if(attack.elapsed<recoverAt){state=`${attack.kind}Hold`;return}if(attack.elapsed<endAt){state=`${attack.kind}Recover`;return}pulidoAttack=null;attackTimer=0;state='idle'}
function resolveActorContact(){for(const actor of combatActors()){if(actor.dead||actor.knocked||Math.abs(player.y-actor.y)>=54)continue;const distance=contactDistance(actor)-5,dx=player.x-actor.x;if(Math.abs(dx)<distance)player.x=actor.x+(dx<0?-distance:distance)}}
function tickCombat(dt){if(playerHitTimer>0)playerHitTimer-=dt;combatActors().forEach(actor=>{if(actor.dead){actor.deadTimer-=dt;if(actor.deadTimer<=0)actor.hidden=true;return}if(actor.knocked){actor.knockTimer-=dt;if(actor.knockTimer<=0){actor.knocked=false;actor.state='idle'}return}actor.guardCooldown=Math.max(0,(actor.guardCooldown||0)-dt);if(actor.guardTimer>0)actor.guardTimer-=dt;if(actor.comboTimer>0){actor.comboTimer-=dt;if(actor.comboTimer<=0)actor.comboHits=0}if(actor.hitTimer>0)actor.hitTimer-=dt})}
const tickCombatBase=tickCombat;tickCombat=function(dt){tickCombatBase(dt);if(playerComboTimer>0){playerComboTimer-=dt;if(playerComboTimer<=0){playerComboHits=0;playerComboSource=null}}if(playerKnocked){playerKnockTimer-=dt;if(playerKnockTimer<=0){playerKnocked=false;state='idle'}}}
function enemyStrike(actor,damage){if(actor.attackLanded)return;const hitReach=actor===jefe?130:105;let landed=false;if(!playerDead&&inReach(actor.x,actor.y,player.x,player.y,hitReach)){damagePlayer(damage,actor);landed=true}for(const other of combatActors()){if(other===actor||other.dead||other.knocked)continue;const ahead=(other.x-actor.x)*actor.facing>0;if(ahead&&inReach(actor.x,actor.y,other.x,other.y,hitReach)){damageEnemy(other,damage,actor.facing);landed=true;break}}actor.attackLanded=landed}
function enemyCrowdOffset(actor){let offset=0;for(const other of activeWaveActors){if(other===actor||other.dead||other.knocked)continue;const dx=Math.abs(actor.x-other.x),dy=actor.y-other.y;if(dx<92&&Math.abs(dy)<66)offset+=(dy===0?(actor.aiLane||1):Math.sign(dy))*(66-Math.abs(dy))*.28}return offset}
function anotherEnemyAttacking(actor){return activeWaveActors.some(other=>other!==actor&&!other.dead&&!other.knocked&&other.state==='punch'&&other.attackTimer>4)}
function updateEnemy(dt){
 if(introPhase!=='done'||comparisonMode)return;
 const available=normalActors.filter(a=>a.active&&!a.dead&&!a.knocked);
 // Age the waiting enemies into the next opening, rather than favouring array order.
 available.forEach(a=>{a.attackCooldown=Math.max(0,(a.attackCooldown||0)-dt);a.aiWaiting=(a.aiWaiting||0)+dt;a.aiPressTimer=Math.max(0,(a.aiPressTimer||0)-dt)});
 const attacker=available.find(a=>a.attackTimer>0);
 const candidates=available.filter(a=>!a.hitTimer&&!a.guardTimer&&!(a.retreatTimer>0)&&!(a.waitTimer>0)&&a.attackCooldown<=0);
 const leader=attacker||candidates.find(a=>a.aiPressTimer>0)||candidates.sort((a,b)=>{
  const score=x=>Math.abs(x.x-player.x)+Math.abs(x.y-player.y)*1.5+(x.attackCooldown||0)*2-(x.aiWaiting||0)*.35;
  return score(a)-score(b);
 })[0];
 if(leader&&!attacker&&!(leader.aiPressTimer>0))leader.aiPressTimer=100;
 available.forEach(actor=>{
  const set=enemySet(actor),speed=actor===enemy?.6875:.6375;
  const dx=player.x-actor.x,distance=Math.abs(dx),range=92;
  actor.facing=dx<0?-1:1;
  if(actor.guardTimer>0){actor.state='guard';return}
  if(actor.hitTimer>0){actor.state='hit';return}
  if(actor.attackTimer>0){
   actor.attackTimer-=dt;actor.state='punch';if(actor.attackTimer<20)enemyStrike(actor,8);
   if(actor.attackTimer<=0){actor.state='idle';actor.aiWaiting=0;if(actor.aiSkirmisher){actor.retreatTimer=130+Math.random()*48;actor.aiRetreatSide=actor.x<player.x?-1:1}}
   return;
  }
  const moveTo=(x,y,multiplier=1)=>{
   const oldX=actor.x,oldY=actor.y,vx=x-oldX,vy=y-oldY,len=Math.hypot(vx,vy),step=Math.min(len,speed*multiplier*dt);
   if(len>3){actor.x+=vx/len*step;actor.y+=vy/len*step}
   const left=phaseCameraLock??cam,right=left+W;
   if(oldX>=left&&oldX<=right)actor.x=Math.max(left,Math.min(right,actor.x));
   actor.y=Math.max(laneTop(),Math.min(laneBottom(),actor.y));
   const travelled=Math.hypot(actor.x-oldX,actor.y-oldY);
   actor.state=travelled>.01?'walk':'idle';actor.walkDistance+=travelled;
   actor.walkFrame=Math.floor(actor.walkDistance/enemyWalkFrameStride)%set.walk.length;
  };
  if(actor.retreatTimer>0){
   actor.retreatTimer-=dt;
   moveTo(player.x+(actor.aiRetreatSide||Math.sign(-dx)||1)*(range+125),actor.y,1.08);
   if(actor.retreatTimer<=0)actor.waitTimer=30+Math.random()*24;
   return;
  }
  if(actor.waitTimer>0){actor.waitTimer-=dt;if(distance<range*.75)actor.waitTimer=0;else{actor.state='idle';return}}
  const pressing=actor===leader||distance<range*.72||(actor.aiWaiting>120&&distance<160&&actor.attackCooldown<=0);
  const side=actor.x<player.x?-1:1;
  const laneBlend=Math.max(0,Math.min(1,(distance-range)/100));
  const targetY=Math.max(laneTop(),Math.min(laneBottom(),player.y+(pressing?(actor.aiLane||0)*laneBlend:(actor.aiLane||34))));
  const targetX=player.x+side*(pressing?range-7:range+55);
  if(pressing&&distance<=range&&Math.abs(actor.y-player.y)<24&&actor.attackCooldown<=0&&!anotherEnemyAttacking(actor)){
   actor.state='punch';actor.attackTimer=22;actor.attackLanded=false;actor.aiWaiting=0;actor.aiPressTimer=0;
   actor.attackCooldown=actor.aiRole==='pressure'?38+Math.random()*38:58+Math.random()*48;
   enemyStrike(actor,8);
  }else moveTo(targetX,targetY,distance>150?1.08:1);
 });
}
function updateBossCart(dt){if(!bossCart.active)return false;if(bossCart.phase==='entry'){bossCart.x-=1.75*dt;jefe.x=bossCart.x+155;jefe.y=bossCart.y;jefe.facing=1;jefe.state='push';jefe.walkDistance+=1.75*dt;jefe.walkFrame=Math.floor(jefe.walkDistance/12)%jefePisosRojos.push.length;if(bossCart.x<=player.x+155){bossCart.phase='throw';bossCart.vx=-5.1;bossCart.throwerX=jefe.x;jefe.state='idle'}return true}bossCart.x+=bossCart.vx*dt;if(!bossCart.hit&&Math.abs(bossCart.x-player.x)<72&&Math.abs(bossCart.y-player.y)<28){bossCart.hit=true;damagePlayer(22,jefe)}if(bossCart.x<player.x-360){bossCart.active=false;jefe.x=bossCart.throwerX;jefe.engaged=false}return bossCart.active}
function updateJefe(dt){if(introPhase!=='done'||comparisonMode||!jefe.active||jefe.dead||jefe.knocked)return;if(updateBossCart(dt))return;if(jefe.guardTimer>0){jefe.state='guard';return}const targetY=Math.max(laneTop(),Math.min(laneBottom(),player.y)),dy=targetY-jefe.y;jefe.y+=Math.sign(dy)*Math.min(Math.abs(dy),.775*dt);const dx=player.x-jefe.x,distance=Math.abs(dx),range=contactDistance(jefe)-5;jefe.facing=dx<0?-1:1;if(!jefe.engaged){jefe.state='idle';if(distance<430)jefe.engaged=true;else return}if(jefe.hitTimer>0){jefe.state='hit';return}if(jefe.drinkTimer>0){jefe.drinkTimer-=dt;jefe.state='drink';if(jefe.drinkTimer<=0){jefe.state='idle';jefe.drinkCooldown=720}return}if(jefe.attackTimer>0){jefe.attackTimer-=dt;jefe.state='punch';if(jefe.attackTimer<25)enemyStrike(jefe,13);if(jefe.attackTimer<=0)jefe.state='idle';return}jefe.drinkCooldown-=dt;if(distance>270&&jefe.drinkCooldown<=0){jefe.state='drink';jefe.drinkTimer=180;return}if(distance>range){jefe.state='walk';jefe.x+=Math.sign(dx)*.45*dt;jefe.walkDistance+=Math.abs(.45*dt);jefe.walkFrame=Math.floor(jefe.walkDistance/enemyWalkFrameStride)%jefePisosRojos.walk.length}else{jefe.state='punch';jefe.attackTimer=30;jefe.attackLanded=false;enemyStrike(jefe,13)}}
function drawActorBar(actor,x,y){const width=58,height=6,ratio=actor.hp/actor.maxHp;ctx.save();ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(x-width/2,y,width,height);ctx.fillStyle=actor.dead?'#63131b':actor===jefe?'#e1a22d':'#43bb59';ctx.fillRect(x-width/2+1,y+1,(width-2)*ratio,height-2);ctx.restore()}
function drawActorImage(actor,img,scale){if(actor.hidden)return;const w=img.width*scale,h=img.height*scale,x=actor.x-cam-w/2,y=actor.y-h;ctx.save();if(actor.dead&&actor.deadTimer<18){if(Math.floor(actor.deadTimer/3)%2===0){ctx.restore();return}}if(actor.facing<0){ctx.translate(x+w,y);ctx.scale(-1,1);ctx.drawImage(img,0,0,w,h)}else ctx.drawImage(img,x,y,w,h);ctx.restore()}
function drawEnemy(){if(introPhase!=='done'||comparisonMode||!enemy.active)return;let img=(enemy.dead||enemy.knocked)?metalero.down:enemy.guardTimer>0?metalero.guard:enemy.hitTimer>0?metalero.hit:metalero.idle;if(enemy.state==='walk')img=metalero.walk[enemy.walkFrame];if(enemy.state==='punch')img=metalero.punch[enemy.attackTimer<22?1:0];drawActorImage(enemy,img,mobileGameplayScale(.44))}
function drawYonki(){if(introPhase!=='done'||comparisonMode||!yonki.active)return;let img=(yonki.dead||yonki.knocked)?yonki2.down:yonki.guardTimer>0?yonki2.guard:yonki.hitTimer>0?yonki2.hit:yonki2.idle;if(yonki.state==='walk')img=yonki2.walk[yonki.walkFrame];if(yonki.state==='punch')img=yonki2.punch;drawActorImage(yonki,img,mobileGameplayScale(.70))}
function drawYonkiRojo(){if(introPhase!=='done'||comparisonMode||!yonkiRojo.active)return;let img=(yonkiRojo.dead||yonkiRojo.knocked)?yonki2Rojo.down:yonkiRojo.guardTimer>0?yonki2Rojo.guard:yonkiRojo.hitTimer>0?yonki2Rojo.hit:yonki2Rojo.idle;if(yonkiRojo.state==='walk')img=yonki2Rojo.walk[yonkiRojo.walkFrame];if(yonkiRojo.state==='punch')img=yonki2Rojo.punch;drawActorImage(yonkiRojo,img,mobileGameplayScale(.70))}
function drawYonkiTres(){if(introPhase!=='done'||comparisonMode||!yonkiTres.active)return;let img=(yonkiTres.dead||yonkiTres.knocked)?yonki3.down:yonkiTres.guardTimer>0?yonki3.guard:yonkiTres.hitTimer>0?yonki3.hit:yonki3.idle;if(yonkiTres.state==='walk')img=yonki3.walk[yonkiTres.walkFrame];if(yonkiTres.state==='punch')img=yonki3.punch;drawActorImage(yonkiTres,img,mobileGameplayScale(.70))}
function drawYonkiTresRubio(){if(introPhase!=='done'||comparisonMode||!yonkiTresRubio.active)return;let img=(yonkiTresRubio.dead||yonkiTresRubio.knocked)?yonki3Rubio.down:yonkiTresRubio.guardTimer>0?yonki3Rubio.guard:yonkiTresRubio.hitTimer>0?yonki3Rubio.hit:yonki3Rubio.idle;if(yonkiTresRubio.state==='walk')img=yonki3Rubio.walk[yonkiTresRubio.walkFrame];if(yonkiTresRubio.state==='punch')img=yonki3Rubio.punch;drawActorImage(yonkiTresRubio,img,mobileGameplayScale(.70))}
function drawYonkiTresNike(){if(introPhase!=='done'||comparisonMode||!yonkiTresNike.active)return;let img=(yonkiTresNike.dead||yonkiTresNike.knocked)?yonki3Nike.down:yonkiTresNike.guardTimer>0?yonki3Nike.guard:yonkiTresNike.hitTimer>0?yonki3Nike.hit:yonki3Nike.idle;if(yonkiTresNike.state==='walk')img=yonki3Nike.walk[yonkiTresNike.walkFrame];if(yonkiTresNike.state==='punch')img=yonki3Nike.punch;drawActorImage(yonkiTresNike,img,mobileGameplayScale(.665))}
function drawKani2(){if(introPhase!=='done'||comparisonMode||!kani2Enemy.active)return;let img=(kani2Enemy.dead||kani2Enemy.knocked)?kani2.down:kani2Enemy.guardTimer>0?kani2.guard:kani2Enemy.hitTimer>0?kani2.hit:kani2.idle;if(kani2Enemy.state==='walk')img=kani2.walk[kani2Enemy.walkFrame];if(kani2Enemy.state==='punch')img=kani2.punch;drawActorImage(kani2Enemy,img,mobileGameplayScale(.665))}
function drawHeavy(){if(introPhase!=='done'||comparisonMode||!heavyEnemy.active)return;let img=(heavyEnemy.dead||heavyEnemy.knocked)?heavy.down:heavyEnemy.guardTimer>0?heavy.guard:heavyEnemy.hitTimer>0?heavy.hit:heavy.idle;if(heavyEnemy.state==='walk')img=heavy.walk[heavyEnemy.walkFrame];if(heavyEnemy.state==='punch')img=heavy.punch;drawActorImage(heavyEnemy,img,mobileGameplayScale(.34))}
function drawJefe(){if(introPhase!=='done'||comparisonMode||!jefe.active)return;let img=(jefe.dead||jefe.knocked)?jefePisosRojos.down:jefe.guardTimer>0?jefePisosRojos.guard:jefe.hitTimer>0?jefePisosRojos.hit:jefePisosRojos.idle;if(jefe.state==='walk')img=jefePisosRojos.walk[jefe.walkFrame];if(jefe.state==='push')img=jefePisosRojos.push[jefe.walkFrame%jefePisosRojos.push.length];if(jefe.state==='punch')img=jefePisosRojos.punch;if(jefe.state==='drink')img=jefe.drinkTimer>120?jefePisosRojos.drinkRaise:jefePisosRojos.drink;drawActorImage(jefe,img,mobileGameplayScale(.82))}
function drawBossCart(){if(!bossCart.active||!scrapCartImg.complete)return;const w=170,h=w*scrapCartImg.height/scrapCartImg.width,x=bossCart.x-cam-w/2,y=bossCart.y-h;ctx.drawImage(scrapCartImg,x,y,w,h)}
function drawStageClear(){if(!stageClear.active||!stageClearImg.complete)return;const frames=[[0,180],[198,170],[350,200],[534,195],[711,215],[903,215],[1120,350],[1450,355],[1808,360]],frame=frames[Math.min(frames.length-1,Math.floor(stageClear.elapsed/95))],sourceY=260,sourceHeight=220,drawWidth=Math.min(W*.94,500),drawHeight=drawWidth*sourceHeight/frame[1],x=(W-drawWidth)/2,y=(H-drawHeight)/2,fade=Math.max(0,1-Math.max(0,stageClear.elapsed-5000)/1000);ctx.save();ctx.globalAlpha=fade;ctx.drawImage(stageClearImg,frame[0],sourceY,frame[1],sourceHeight,x,y,drawWidth,drawHeight);ctx.restore()}
function drawContinueCue(){if(!continueCue.active)return;const alpha=Math.min(1,continueCue.elapsed/300);ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle='#f3f1e9';ctx.strokeStyle='rgba(0,0,0,.85)';ctx.lineWidth=5;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`italic 900 ${Math.max(24,Math.min(48,W*.085))}px Impact,Arial Black,sans-serif`;ctx.strokeText('CONTINUARÁ...',W/2,H/2);ctx.fillText('CONTINUARÁ...',W/2,H/2);ctx.restore()}
function drawTimeLimit(){if(introPhase!=='done'||comparisonMode||stageClear.active||stageClear.finished||continueCue.active)return;ctx.save();ctx.textAlign='center';ctx.textBaseline='top';ctx.font=`italic 900 ${Math.max(22,Math.min(34,W*.048))}px Impact,Arial Black,sans-serif`;ctx.lineWidth=4;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.fillStyle=phaseTime<=15?'#ef403a':'#f2f0e7';const label=`TIME ${Math.max(0,Math.ceil(phaseTime))}`;ctx.strokeText(label,W/2,9);ctx.fillText(label,W/2,9);ctx.restore()}
function drawAdvancePrompt(){if(!advancePrompt||timeExpired||stageClear.active||continueCue.active)return;const pulse=1+Math.sin(performance.now()/135)*.08,w=Math.min(118,W*.18)*pulse,h=w*.48,x=W-w-24,y=H*.48-h/2;ctx.save();ctx.fillStyle='rgba(245,194,37,.92)';ctx.strokeStyle='rgba(30,20,5,.9)';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w*.68,y);ctx.lineTo(x+w,y+h/2);ctx.lineTo(x+w*.68,y+h);ctx.lineTo(x,y+h);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#17110a';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`italic 900 ${Math.max(17,w*.25)}px Impact,Arial Black,sans-serif`;ctx.fillText('GO!',x+w*.46,y+h/2+1);ctx.restore()}
function drawTimeExpired(){if(!timeExpired)return;ctx.save();ctx.fillStyle='rgba(0,0,0,.32)';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`italic 900 ${Math.max(26,Math.min(52,W*.073))}px Impact,Arial Black,sans-serif`;ctx.lineWidth=6;ctx.strokeStyle='rgba(0,0,0,.9)';ctx.fillStyle='#f0e9dc';ctx.strokeText('TE QUEDASTE SIN TIEMPO',W/2,H/2);ctx.fillText('TE QUEDASTE SIN TIEMPO',W/2,H/2);ctx.restore()}
function drawDistantShout(){if(!distantShout.active)return;const p=Math.min(1,distantShout.elapsed/1500),fade=Math.min(1,distantShout.elapsed/160,Math.max(0,(1750-distantShout.elapsed)/330)),x=W+80-p*(W*.62),y=H*.43;ctx.save();ctx.globalAlpha=fade*.15;const wave=ctx.createRadialGradient(x,y,8,x,y,Math.max(150,W*.25));wave.addColorStop(0,'rgba(255,255,255,.9)');wave.addColorStop(.34,'rgba(255,255,255,.18)');wave.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=wave;ctx.fillRect(x-Math.max(150,W*.25),y-Math.max(150,W*.25),Math.max(300,W*.5),Math.max(300,W*.5));ctx.restore()}
function drawImpactFlash(){if(!impactFlash.active)return;const p=Math.min(1,impactFlash.elapsed/130),strength=impactFlash.strength||1,size=(8+p*18)*strength,x=impactFlash.x-cam,y=impactFlash.y;ctx.save();ctx.globalAlpha=(1-p)*.8;ctx.strokeStyle='#fff1a4';ctx.lineWidth=2.5*strength;for(let i=0;i<5;i++){const angle=(-.95+i*.47)*impactFlash.direction;ctx.beginPath();ctx.moveTo(x+Math.cos(angle)*size*.35,y+Math.sin(angle)*size*.35);ctx.lineTo(x+Math.cos(angle)*size,y+Math.sin(angle)*size);ctx.stroke()}ctx.restore()}
function drawComparison(){const entries=[['RAFA KING',idleImg,.71],['CASTA',casta.idle,.58],['PULIDO',pulido.idle,.71],['SALVI',salvi.idle,.71],['CAJAMAN',cajaman.idle,.71],['PAKO',pako.idle,.71]];const baseY=H*.90;ctx.save();ctx.fillStyle='rgba(0,0,0,.60)';ctx.fillRect(0,H*.73,W,H*.27);entries.forEach(([name,img,scale],i)=>{const w=img.width*scale,h=img.height*scale,x=W*(i+.5)/entries.length-w/2,y=baseY-h;ctx.drawImage(img,x,y,w,h);ctx.fillStyle='#fff';ctx.font='bold 12px monospace';ctx.textAlign='center';ctx.fillText(name,x+w/2,baseY+18)});ctx.restore();}
function update(dt){if(comparisonMode)return;if(introRunning()){updateIntro(dt);return;}if(timeExpired){updateCamera();return}tickCombat(dt);if(!continueCue.active&&!stageClear.active&&!stageClear.finished&&jefe.dead&&jefe.hidden)startStageClear();if(stageClear.active){stageClear.elapsed+=dt*16.67;if(stageClear.elapsed>=5000)stageClearCheer.volume=.45*Math.max(0,1-(stageClear.elapsed-5000)/1000);if(stageClear.elapsed>=6000){stageClear.active=false;stageClear.finished=true;continueCue={active:true,shown:true,elapsed:0};stageClearCheer.pause();stageClearCheer.currentTime=0}updateCamera();return}if(continueCue.active){continueCue.elapsed+=dt*16.67;updateCamera();return}if(stageClear.finished){updateCamera();return}if(playerDead){updateCamera();return}phaseTime=Math.max(0,phaseTime-dt/60);if(phaseTime<=0){timeExpired=true;advancePrompt=false;stopPhaseMusic();playDistantShout();return}const previousX=player.x,previousY=player.y;const speed=1.6875*dt,vSpeed=1.375*dt;
 if(selectedCharacter==='rafa'&&!rafaSpecialAttack&&specialPressed){if(rafaSpecialMeter>=100)startRafaSpecial();else specialPressed=false}
 if(!rafaSpecialAttack&&!jumpActive && attackTimer<=0 && crouchTimer<=0){
   if(comboPressed){state='crouch';crouchTimer=18;comboPressed=false;zPressed=false;xPressed=false;}
   else {
    const movingH=keys['arrowleft']||keys['a']||keys['arrowright']||keys['d']; const movingV=keys['arrowup']||keys['w']||keys['arrowdown']||keys['s'];
    if(movingH||movingV){state='walk';} else {state='idle';walkClock=0;walkFrame=0;walkDistance=0;}
    if(keys['arrowleft']||keys['a']){player.x-=speed;facing=-1}else if(keys['arrowright']||keys['d']){player.x+=speed;facing=1}
    if(keys['arrowup']||keys['w'])player.y-=vSpeed;if(keys['arrowdown']||keys['s'])player.y+=vSpeed;player.y=Math.max(laneTop(),Math.min(laneBottom(),player.y));
    if(zPressed){if(selectedCharacter==='pulido')startPulidoAttack('punch');else{attackTimer=12;state='punch';playerAttackLanded=false;zPressed=false}}else if(xPressed){if(selectedCharacter==='pulido')startPulidoAttack('kick');else{attackTimer=9;state='kick';playerAttackLanded=false;xPressed=false}}
   }
 }
 if(!jumpActive && crouchTimer>0){state='crouch';crouchTimer--;if(crouchTimer<=0){state='idle';walkClock=0;walkFrame=0;}}
 if(!rafaSpecialAttack&&!jumpActive && attackTimer>0&&selectedCharacter!=='pulido'){state=state==='kick'?'kick':'punch';attackTimer--;tryPlayerHit();if(attackTimer<=0){state='idle';walkClock=0;walkFrame=0;}}
 if(!jumpActive&&selectedCharacter==='pulido'&&pulidoAttack)updatePulidoAttack(dt);
 if(rafaSpecialAttack)updateRafaSpecial(dt);
 if(jumpActive){if(keys['arrowleft']||keys['a']){player.x-=speed;facing=-1;}else if(keys['arrowright']||keys['d']){player.x+=speed;facing=1;}if(keys['arrowup']||keys['w'])player.y-=vSpeed;if(keys['arrowdown']||keys['s'])player.y+=vSpeed;player.y=Math.max(laneTop(),Math.min(laneBottom(),player.y));if(xPressed){jumpKick=true;jumpRecover=false;playerAttackLanded=false;state='jumpKick';xPressed=false}else if(!jumpKick)state='jump';jumpT+=dt/1000;let pp=Math.min(1,jumpT/0.060);jumpY=-Math.sin(pp*Math.PI)*H*0.09;if(jumpKick){if(jumpT<0.033){state='jumpKick';if(tryPlayerHit()&&selectedCharacter==='pulido')pulidoHitStopMs=60;}else if(jumpT<0.051){state='jumpRecover';jumpRecover=true;}else{state='jumpRecover';}}if(pp>=1){jumpActive=false;jumpY=0;jumpKick=false;jumpRecover=false;state='idle';walkClock=0;walkFrame=0;}}
 player.x=Math.max(50,Math.min(worldW-80,player.x));resolveWorldCollision(previousX,previousY);updatePhaseWaves();player.x=Math.min(player.x,phaseBarrier());resolveActorContact();const walkedDistance=Math.hypot(player.x-previousX,player.y-previousY),walkSet=currentSet().walk;if(!jumpActive&&state==='walk'&&walkedDistance>.01){const smoothWalk=walkSet===rafaWalkCycle||walkSet===pulido.walk||walkSet===salvi.walk||walkSet===casta.walk||walkSet===pako.walk||walkSet===cajaman.walk;const frameStride=smoothWalk?9:walkSet.length===3?13:10;walkDistance+=walkedDistance;walkFrame=Math.floor(walkDistance/frameStride)%walkSet.length;}updateEnemy(dt);updateJefe(dt);updateCamera();}

const updateBase=update;update=function(dt){if(playerKnocked){tickCombat(dt);updateCamera();return}updateBase(dt)}
function drawHudName(label,x,y,width){ctx.save();ctx.beginPath();ctx.rect(x+5,y+3,width-10,40);ctx.clip();ctx.fillStyle='rgba(255,255,255,.62)';ctx.font='italic 900 26px Impact,Arial Black,sans-serif';const fit=Math.min(1,(width-20)/ctx.measureText(label).width);ctx.translate(x+8,y+34);ctx.scale(fit,1);ctx.transform(1,0,-.20,1,0,0);ctx.textBaseline='alphabetic';ctx.fillText(label,0,0);ctx.restore()}
function drawHudBar(x,y,width,ratio,color,label){ctx.save();ctx.fillStyle='rgba(0,0,0,.74)';ctx.fillRect(x,y,width,46);ctx.fillStyle=color;ctx.fillRect(x+3,y+5,(width-6)*Math.max(0,Math.min(1,ratio)),36);drawHudName(label,x,y,width);ctx.restore()}
function drawSpecialMeter(x,y,width,ratio){ctx.save();ctx.fillStyle='rgba(0,0,0,.82)';ctx.fillRect(x,y,width,8);ctx.fillStyle=ratio>=1?'#ff5660':'#c82432';ctx.fillRect(x+2,y+2,(width-4)*Math.max(0,Math.min(1,ratio)),4);if(ratio>=1){ctx.strokeStyle='rgba(255,230,230,.9)';ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,width-1,7)}ctx.restore()}
function ui(){if(introPhase!=='done'||comparisonMode||continueCue.active||stageClear.active||stageClear.finished)return;const playerWidth=Math.min(150,W*.27),enemyWidth=Math.min(140,W*.25),playerName={rafa:'RAFA KING',casta:'CASTA',pulido:'PULIDO',salvi:'SALVI',cajaman:'CAJAMAN',pako:'PAKO'}[selectedCharacter],enemyActors=combatActors().filter(actor=>!actor.hidden),hudY=-58;drawHudBar(18,hudY,playerWidth,player.hp/player.maxHp,'#2fc760',playerName);if(selectedCharacter==='rafa'||selectedCharacter==='pulido')drawSpecialMeter(18,hudY+51,playerWidth,rafaSpecialMeter/100);enemyActors.forEach((actor,index)=>drawHudBar(W-enemyWidth-18-index*(enemyWidth+8),hudY,enemyWidth,actor.hp/actor.maxHp,actor===jefe?'#e1a22d':'#d94040',actor.name))}
let last=performance.now();function loop(t){let dt=Math.min(2,(t-last)/16.67);last=t;if(distantShout.active){distantShout.elapsed+=dt*16.67;if(distantShout.elapsed>1750)distantShout.active=false}if(impactFlash.active){impactFlash.elapsed+=dt*16.67;if(impactFlash.elapsed>130)impactFlash.active=false}if(pulidoHitStopMs>0){pulidoHitStopMs=Math.max(0,pulidoHitStopMs-dt*16.67)}else update(dt);applyViewportTransform();drawBackground();ctx.fillStyle='rgba(0,0,0,.08)';ctx.fillRect(0,groundY(),W,H-groundY());drawIntroCar();if(comparisonMode)drawComparison();else{drawEnemy();drawYonki();drawYonkiRojo();drawYonkiTres();drawYonkiTresRubio();drawYonkiTresNike();drawKani2();drawHeavy();drawJefe();drawBossCart();drawPlayer();drawImpactFlash();drawAdvancePrompt();drawTimeLimit();drawContinueCue();drawStageClear();drawDistantShout();drawTimeExpired();}ui();requestAnimationFrame(loop)}

function selectCharacter(name){selectedCharacter=name;document.getElementById('selectScreen').style.display='none';bossIntroActive=false;bossIntroScreen.classList.remove('show');player.x=180;player.y=laneBottom();player.hp=player.maxHp;playerDead=false;playerHitTimer=0;phaseTime=120;timeExpired=false;advancePrompt=false;stageClear={active:false,elapsed:0,finished:false};continueCue={active:false,shown:false,elapsed:false};stageClearCheer.pause();stageClearCheer.currentTime=0;stageClearCheer.volume=.45;normalActors.forEach((actor,index)=>{Object.assign(actor,{x:1160+index*350,y:laneBottom(),state:'idle',walkDistance:0,walkFrame:0,attackTimer:0,attackLanded:false,hitTimer:0,dead:false,deadTimer:0,hidden:true,hp:actor.maxHp,comboHits:0,comboTimer:0,knocked:false,knockTimer:0,strafeClock:0,active:false})});jefe.x=worldW-260;jefe.y=laneBottom();jefe.state='idle';jefe.walkDistance=0;jefe.walkFrame=0;jefe.attackTimer=0;jefe.attackLanded=false;jefe.hitTimer=0;jefe.dead=false;jefe.deadTimer=0;jefe.hidden=true;jefe.hp=jefe.maxHp;jefe.engaged=false;jefe.drinkTimer=0;jefe.drinkCooldown=480;[...normalActors,jefe].forEach(actor=>{actor.comboHits=0;actor.comboTimer=0;actor.knocked=false;actor.knockTimer=0;actor.strafeClock=0;actor.active=false});activeWave=-1;nextWave=0;activeWaveActors=[];phaseCameraLock=null;bossActivated=false;cam=0;facing=1;state='idle';walkFrame=0;walkClock=0;walkDistance=0;attackTimer=0;playerAttackLanded=false;crouchTimer=0;jumpActive=false;jumpT=0;jumpY=0;jumpKick=false;jumpRecover=false;pulidoAttack=null;pulidoHitStopMs=0;showMapScreen();}
const selectCharacterBase=selectCharacter;
selectCharacter=function(name){delete selectionMusic.mapResumeTime;stopPhaseMusic();bossCart={active:false,phase:'none',x:0,y:0,vx:0,hit:false,throwerX:0};const result=selectCharacterBase(name);phaseTime=200;playerKnocked=false;playerKnockTimer=0;playerComboHits=0;playerComboTimer=0;playerComboSource=null;rafaSpecialMeter=0;rafaSpecialAttack=null;specialPressed=false;return result};
const touchControls=document.createElement('div');
touchControls.id='touchControls';
const touchPad=document.createElement('div'),touchActions=document.createElement('div');
touchPad.className='touchPad';touchActions.className='touchActions';
const joystickBase=document.createElement('div'),joystickStick=document.createElement('div');
joystickBase.className='joystickBase';joystickStick.className='joystickStick';
joystickBase.append(joystickStick);touchPad.append(joystickBase);
const touchButtons=[['z','PUÑO','',touchActions],['x','PATADA','',touchActions],['c','SALTO','',touchActions]];
function touchDown(key){keys[key]=true;if(key==='z')zPressed=true;if(key==='x')xPressed=true;if(key==='c'&&specialAvailable())specialPressed=true;if(keys.z&&keys.x&&!comboHeld&&!specialPressed){comboPressed=true;comboHeld=true}if(key==='c'&&!jumpActive&&!introRunning()&&!rafaSpecialAttack&&!pulidoSpecialAttack&&!specialPressed){jumpActive=true;jumpT=0;jumpY=0;jumpKick=false;state='jump'}}
function touchUp(key){keys[key]=false;if(!keys.z||!keys.x)comboHeld=false}
function setJoystickDirection(dx,dy){
 // A smaller release threshold prevents direction chatter near the dead zone.
 keys.arrowleft=dx<-(keys.arrowleft?.14:.22);keys.arrowright=dx>(keys.arrowright?.14:.22);
 keys.arrowup=dy<-(keys.arrowup?.14:.22);keys.arrowdown=dy>(keys.arrowdown?.14:.22);
}
function moveJoystick(event){const bounds=joystickBase.getBoundingClientRect(),cx=bounds.left+bounds.width/2,cy=bounds.top+bounds.height/2;let dx=(event.clientX-cx)/(bounds.width*.34),dy=(event.clientY-cy)/(bounds.height*.34);const distance=Math.hypot(dx,dy);if(distance>1){dx/=distance;dy/=distance}joystickStick.style.transform=`translate(${dx*30}px,${dy*30}px)`;setJoystickDirection(dx,dy)}
function releaseJoystick(event){if(event.pointerId!==joystickBase.pointerId)return;joystickBase.pointerId=null;if(joystickBase.hasPointerCapture?.(event.pointerId))joystickBase.releasePointerCapture(event.pointerId);joystickStick.style.transform='translate(0,0)';setJoystickDirection(0,0)}
joystickBase.addEventListener('pointerdown',event=>{event.preventDefault();if(joystickBase.pointerId!=null)return;joystickBase.pointerId=event.pointerId;joystickBase.setPointerCapture?.(event.pointerId);moveJoystick(event)});
joystickBase.addEventListener('pointermove',event=>{if(event.pointerId===joystickBase.pointerId)moveJoystick(event)});
['pointerup','pointercancel','lostpointercapture'].forEach(type=>joystickBase.addEventListener(type,releaseJoystick));
touchButtons.forEach(([key,label,className,parent])=>{
 const button=document.createElement('button'),pointers=new Set();
 button.type='button';button.className=`touchButton ${className}`;button.dataset.key=key;button.textContent=label;
 button.addEventListener('pointerdown',event=>{
  event.preventDefault();const first=pointers.size===0;pointers.add(event.pointerId);
  button.classList.add('pressed');button.setPointerCapture?.(event.pointerId);if(first)touchDown(key);
 });
 const release=event=>{
  event.preventDefault();if(!pointers.delete(event.pointerId))return;
  if(button.hasPointerCapture?.(event.pointerId))button.releasePointerCapture(event.pointerId);
  if(!pointers.size){button.classList.remove('pressed');touchUp(key)}
 };
 ['pointerup','pointercancel','lostpointercapture'].forEach(type=>button.addEventListener(type,release));
 button.resetTouch=()=>{pointers.clear();button.classList.remove('pressed');touchUp(key)};
 parent.append(button);
});
function resetMobileInput(){
 if(joystickBase.pointerId!=null)releaseJoystick({pointerId:joystickBase.pointerId});
 setJoystickDirection(0,0);touchActions.querySelectorAll('button').forEach(button=>button.resetTouch?.());
 zPressed=false;xPressed=false;specialPressed=false;comboPressed=false;comboHeld=false;
}
window.addEventListener('blur',resetMobileInput);
document.addEventListener('visibilitychange',()=>{if(document.hidden)resetMobileInput()});
touchControls.append(touchPad,touchActions);document.body.append(touchControls);
function specialAvailable(){return ['rafa','pulido'].includes(selectedCharacter)&&rafaSpecialMeter>=100&&!rafaSpecialAttack&&!pulidoSpecialAttack}
setInterval(()=>{touchControls.classList.toggle('visible',introPhase==='done'&&!playerDead&&!timeExpired&&!continueCue.active&&!stageClear.active&&!stageClear.finished);const ready=specialAvailable();touchControls.classList.toggle('specialReady',ready);touchControls.querySelector('[data-key="c"]').textContent=ready?'SPECIAL':'SALTO';touchControls.querySelector('[data-key="x"]').textContent='PATADA'},100);
Promise.all([bg,carImg,scrapCartImg,stageClearImg,idleImg,jumpImg,punchImg,kickImg,airKickImg,airRecoverImg,crouchImg,rafaHitImg,rafaDownImg,rafaSpecialWindup,rafaSpecialKickA,rafaSpecialKickB,rafaWalkCenter,rafaWalkOpposite,rafaWalkTransitionA,rafaWalkTransitionB,...walkImgs,...Object.values(casta),...Object.values(pulido),...Object.values(salvi),...Object.values(cajaman),...Object.values(pako),...Object.values(metalero),...Object.values(yonki2),...Object.values(yonki2Rojo),...Object.values(yonki3),...Object.values(yonki3Rubio),...Object.values(yonki3Nike),...Object.values(kani2),...Object.values(heavy),...Object.values(jefePisosRojos)].flat().map(im=>new Promise(r=>im.complete?r():im.onload=r))).then(()=>requestAnimationFrame(loop));
// Especial de Pulido: elevación y caída de los enemigos situados delante.
const pulidoLiftImg=imgFromData('assets/characters/pulido/special-lift.png');
let pulidoSpecialAttack=null;
const specialUpdateBase=update;
function pulidoFrontTargets(direction){return [...normalActors,jefe].filter(a=>a.active&&!a.dead&&(a.x-player.x)*direction>=0)}
function capturePulidoTargets(move){for(const actor of pulidoFrontTargets(move.direction)){if(move.targets.includes(actor))continue;actor.attackTimer=0;actor.guardTimer=0;actor.hitTimer=0;actor.state='hit';actor.knocked=true;actor.knockTimer=999;actor.hidden=false;move.targets.push(actor)}}
function steerPulidoTargets(move,dt){let dx=Number(!!(keys.arrowright||keys.d))-Number(!!(keys.arrowleft||keys.a)),dy=Number(!!(keys.arrowdown||keys.s))-Number(!!(keys.arrowup||keys.w));const length=Math.hypot(dx,dy);if(!length)return;if(dx!==0)facing=dx<0?-1:1;if(length>1){dx/=length;dy/=length}for(const actor of move.targets){actor.x=Math.max(50,Math.min(worldW-80,actor.x+dx*2.109375*dt));actor.y=Math.max(laneTop(),Math.min(laneBottom(),actor.y+dy*1.71875*dt))}}
function pulidoLandingHits(move){const hits=[];for(const other of combatActors()){if(other.dead||other.knocked||move.targets.includes(other))continue;const falling=move.targets.find(a=>Math.abs(a.x-other.x)<contactDistance(other)&&Math.abs(a.y-other.y)<24);if(falling)hits.push({actor:other,direction:Math.sign(other.x-falling.x)||move.direction})}for(const hit of hits)damageEnemy(hit.actor,14,hit.direction,false)}
update=function(dt){
  if(selectedCharacter==='pulido'&&specialPressed&&!pulidoSpecialAttack){
    specialPressed=false;
    if(rafaSpecialMeter>=100&&!playerDead&&!playerKnocked&&!jumpActive&&introPhase==='done'&&!timeExpired&&!stageClear.active&&!continueCue.active){
      rafaSpecialMeter=0;attackTimer=0;pulidoAttack=null;crouchTimer=0;zPressed=false;xPressed=false;
      pulidoSpecialAttack={elapsed:0,targets:[],slammed:false,released:false,fallElapsed:0,direction:facing};
      capturePulidoTargets(pulidoSpecialAttack);
    }
  }
  if(!pulidoSpecialAttack){specialUpdateBase(dt);return}
  const move=pulidoSpecialAttack;move.elapsed+=dt*16.67;phaseTime=Math.max(0,phaseTime-dt/60);state='specialLift';
  if(!move.slammed)move.targets.forEach(a=>{a.knockTimer=999});
  tickCombat(dt);
  const t=move.elapsed,height=100;
  if(!move.released){capturePulidoTargets(move);move.targets.forEach(a=>{a.specialLiftOffset=-height*Math.min(1,t/350)});if(!keys.c&&!keys.v){move.released=true;move.targets.forEach(a=>{a.specialFallStart=a.specialLiftOffset||0})}else steerPulidoTargets(move,dt)}
  if(move.released){move.fallElapsed+=dt*16.67;move.targets.forEach(a=>{a.specialLiftOffset=(a.specialFallStart||0)*Math.max(0,1-Math.pow(Math.min(1,move.fallElapsed/180),2))})}
  if(move.released&&move.fallElapsed>=180&&!move.slammed){
    move.slammed=true;
    pulidoLandingHits(move);
    move.targets.forEach(a=>{a.specialLiftOffset=0;a.knocked=false;damageEnemy(a,42,move.direction,false);if(!a.dead){a.knocked=true;a.knockTimer=110;a.state='down';a.comboHits=0;a.comboTimer=0;playKnockoutSfx()}});
    pulidoHitStopMs=Math.max(pulidoHitStopMs,70);
  }
  if(move.released&&move.fallElapsed>=380){move.targets.forEach(a=>{delete a.specialLiftOffset;delete a.specialFallStart});pulidoSpecialAttack=null;state=playerDead?'dead':playerKnocked?'down':'idle';zPressed=false;xPressed=false}
  if(phaseTime<=0){timeExpired=true;stopPhaseMusic();playDistantShout();move.targets.forEach(a=>{a.specialLiftOffset=0;if(!move.slammed){a.knocked=false;a.knockTimer=0;a.state='idle'}});pulidoSpecialAttack=null}
  updateEnemy(dt);updateJefe(dt);
  if((playerDead||playerKnocked)&&pulidoSpecialAttack&&!move.released){move.released=true;move.targets.forEach(a=>{a.specialFallStart=a.specialLiftOffset||0})}
  updateCamera();
};
const specialActorDrawBase=drawActorImage;
drawActorImage=function(actor,img,scale){
  if(actor.specialLiftOffset<0){const oldY=actor.y;actor.y+=actor.specialLiftOffset;try{specialActorDrawBase(actor,enemySetForLift(actor),scale)}finally{actor.y=oldY}return}
  specialActorDrawBase(actor,img,scale);
};
function enemySetForLift(actor){return actor===jefe?jefePisosRojos.hit:enemySet(actor).hit||enemySet(actor).idle}
const specialPlayerDrawBase=drawPlayer;
drawPlayer=function(){if(selectedCharacter!=='pulido'||!pulidoSpecialAttack||pulidoSpecialAttack.interrupted){specialPlayerDrawBase();return}const scale=.71,w=pulidoLiftImg.width*scale,h=pulidoLiftImg.height*scale;ctx.save();ctx.translate(player.x-cam,player.y);if(facing<0)ctx.scale(-1,1);ctx.drawImage(pulidoLiftImg,-w/2,-h,w,h);ctx.restore()};
const specialResetBase=selectCharacter;
selectCharacter=function(name){if(pulidoSpecialAttack)pulidoSpecialAttack.targets.forEach(a=>{delete a.specialLiftOffset});pulidoSpecialAttack=null;return specialResetBase(name)};
const pulidoInterruptDamageBase=damagePlayer;
damagePlayer=function(amount,from){const before=player.hp;pulidoInterruptDamageBase(amount,from);if(player.hp<before&&pulidoSpecialAttack&&!pulidoSpecialAttack.slammed){const move=pulidoSpecialAttack;move.interrupted=true;move.released=true;move.fallElapsed=0;move.targets.forEach(a=>{a.specialFallStart=a.specialLiftOffset||0})}};
// Reverse only the intermediate pose; combat keeps its original attack direction.
const rafaTurnDrawBase=drawPlayer;
drawPlayer=function(){
 if(selectedCharacter!=='rafa'||state!=='specialTurn'){rafaTurnDrawBase();return}
 const oldFacing=facing,oldState=state;
 try{facing=-oldFacing;state='specialWindup';rafaTurnDrawBase()}
 finally{facing=oldFacing;state=oldState}
};
// Lightweight canvas effects: no new sprites or changes to combat timing.
function drawRafaSpecialTrail(){
 if(selectedCharacter!=='rafa'||!rafaSpecialAttack||playerDead)return;
 const t=rafaSpecialAttack.elapsed;
 if(t<250||t>=820)return;
 const turning=t>=455&&t<600,finisher=t>=600;
 const p=turning?(t-455)/145:finisher?(t-600)/220:(t-250)/205;
 ctx.save();ctx.translate(player.x-cam,player.y-82);ctx.scale(facing,1);
 ctx.globalCompositeOperation='lighter';
 const angle=-1.8+p*3.3;
 for(let i=0;i<3;i++){
  ctx.strokeStyle=i===0?'rgba(255,62,38,.52)':i===1?'rgba(255,156,44,.65)':'rgba(255,236,164,.8)';
  ctx.lineWidth=[14,7,2][i];ctx.lineCap='round';
  ctx.beginPath();ctx.ellipse(8,0,(finisher?103:85)-i*4,turning?43:59,0,angle-1.65,angle);ctx.stroke();
 }
 if(finisher){
  const fade=Math.max(0,1-p*2.5);ctx.globalAlpha=fade;
  for(let i=0;i<8;i++){
   const a=i*Math.PI/4,r=14+p*70;
   ctx.strokeStyle=i%2?'#ffe9ae':'#ff6635';ctx.lineWidth=2;
   ctx.beginPath();ctx.moveTo(97+Math.cos(a)*r*.6,-10+Math.sin(a)*r*.6);ctx.lineTo(97+Math.cos(a)*r,-10+Math.sin(a)*r);ctx.stroke();
  }
 }
 ctx.restore();
}
const rafaEffectsDrawBase=drawPlayer;
drawPlayer=function(){drawRafaSpecialTrail();rafaEffectsDrawBase()};
// Stagger each wave without letting pending enemies participate in combat.
const staggerWaveBase=activateWave;
activateWave=function(index){
 staggerWaveBase(index);
 const plan=waveEntryPlans[index];
 activeWaveActors.forEach((actor,slot)=>{
  actor.entryDelay=plan.delays[slot];
  actor.entrySide=plan.sides[slot];
  actor.aiRole=plan.roles[slot];actor.aiSkirmisher=actor.aiRole==='flanker';
  actor.aiLane=actor.aiRole==='pressure'?0:(slot%2?-38:38);
  actor.attackCooldown=actor.aiRole==='pressure'?8:actor.aiRole==='flanker'?24:46;
  const left=phaseCameraLock??cam;
  actor.x=actor.entrySide<0?left-34:left+W+34;
  actor.y=Math.max(laneTop(),Math.min(laneBottom(),player.y+[-24,12,30,-38][slot]));
  actor.aiWaiting=0;actor.aiPressTimer=0;
  if(slot>0){actor.active=false;actor.hidden=true}
 });
};
const staggerCombatBase=tickCombat;
tickCombat=function(dt){
 if(introPhase==='done'&&!playerDead&&!timeExpired&&!stageClear.active&&!stageClear.finished&&!continueCue.active){
  for(const actor of activeWaveActors){
   if(!(actor.entryDelay>0))continue;
   actor.entryDelay=Math.max(0,actor.entryDelay-dt);
   if(actor.entryDelay===0){
    const left=phaseCameraLock??cam;
    actor.x=actor.entrySide<0?left-34:left+W+34;
    actor.y=Math.max(laneTop(),Math.min(laneBottom(),actor.y));
    actor.active=true;actor.hidden=false;
   }
  }
 }
 staggerCombatBase(dt);
};
// Separate damage feedback from guard feedback, preserving damage and audio rules.
const combatFeedback=[];
function addCombatFeedback(x,y,direction,strength=1,blocked=false){
 combatFeedback.push({x,y,direction,strength,blocked,started:performance.now()});
 if(combatFeedback.length>12)combatFeedback.shift();
}
const feedbackImpactBase=triggerImpact;
triggerImpact=function(x,y,direction,strength=1){
 feedbackImpactBase(x,y,direction,strength);
 addCombatFeedback(x,y,direction,strength);
};
const feedbackDamageBase=damageEnemy;
damageEnemy=function(actor,amount,direction=facing,canBlock=false){
 const wasEligible=!actor.dead&&!actor.knocked,hp=actor.hp;
 const result=feedbackDamageBase(actor,amount,direction,canBlock);
 if(wasEligible&&canBlock&&!result&&actor.hp===hp&&actor.guardTimer>0){
  addCombatFeedback(actor.x,actor.y-actorScale(actor)*72,direction,1,true);
  pulidoHitStopMs=Math.max(pulidoHitStopMs,28);
 }
 return result;
};
drawImpactFlash=function(){
 const now=performance.now();
 for(let i=combatFeedback.length-1;i>=0;i--){
  const fx=combatFeedback[i],p=(now-fx.started)/(fx.blocked?160:150);
  if(p>=1){combatFeedback.splice(i,1);continue}
  const size=(8+p*22)*fx.strength;
  ctx.save();ctx.translate(fx.x-cam,fx.y);ctx.scale(fx.direction,1);
  ctx.globalAlpha=(1-p)*.85;ctx.lineWidth=fx.blocked?2:2.5*fx.strength;
  if(fx.blocked){
   ctx.strokeStyle='#a5dfff';ctx.beginPath();ctx.arc(0,0,size,-1.25,1.25);ctx.stroke();
   for(let j=0;j<3;j++){const angle=-.7+j*.7;ctx.beginPath();ctx.moveTo(Math.cos(angle)*size,Math.sin(angle)*size);ctx.lineTo(Math.cos(angle)*(size+6),Math.sin(angle)*(size+6));ctx.stroke()}
  }else{
   ctx.fillStyle='#fff5ca';ctx.beginPath();ctx.arc(0,0,Math.max(0,5*(1-p))*fx.strength,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle='#ffd578';
   for(let j=0;j<7;j++){const angle=-1.3+j*.43;ctx.beginPath();ctx.moveTo(Math.cos(angle)*size*.3,Math.sin(angle)*size*.3);ctx.lineTo(Math.cos(angle)*size,Math.sin(angle)*size);ctx.stroke()}
  }
  ctx.restore();
 }
};
const feedbackSelectBase=selectCharacter;
selectCharacter=function(name){combatFeedback.length=0;return feedbackSelectBase(name)};
// Boss pressure: short tell, real reach, recovery, and resistance to stun-lock.
updateJefe=function(dt){
 if(introPhase!=='done'||comparisonMode||!jefe.active||jefe.dead||jefe.knocked)return;
 if(updateBossCart(dt))return;
 if(jefe.guardTimer>0){jefe.state='guard';return}
 jefe.bossCooldown=Math.max(0,(jefe.bossCooldown||0)-dt);
 if(jefe.hitTimer>0){jefe.state='hit';return}
 if(jefe.attackTimer>0){
  jefe.attackTimer-=dt;jefe.state='punch';
  if(jefe.attackTimer<=22&&!jefe.bossStrikeChecked){jefe.bossStrikeChecked=true;enemyStrike(jefe,13)}
  if(jefe.attackTimer<=0){jefe.state='idle';jefe.bossCooldown=14}
  return;
 }
 const dx=player.x-jefe.x,dy=player.y-jefe.y,distance=Math.abs(dx);
 jefe.facing=dx<0?-1:1;jefe.engaged=true;
 if(jefe.drinkTimer>0){
  if(distance<170)jefe.drinkTimer=0;
  else{jefe.drinkTimer-=dt;jefe.state='drink';return}
 }
 jefe.drinkCooldown-=dt;
 if(distance>300&&jefe.drinkCooldown<=0){jefe.drinkTimer=60;jefe.drinkCooldown=720;jefe.state='drink';return}
 if(distance<122&&Math.abs(dy)<24&&jefe.bossCooldown<=0){
  jefe.attackTimer=30;jefe.attackLanded=false;jefe.bossStrikeChecked=false;jefe.state='punch';return;
 }
 const oldX=jefe.x,oldY=jefe.y;
 jefe.y+=Math.sign(dy)*Math.min(Math.abs(dy),.9*dt);
 if(distance>105)jefe.x+=Math.sign(dx)*Math.min(distance-105,.95*dt);
 jefe.y=Math.max(laneTop(),Math.min(laneBottom(),jefe.y));
 const travel=Math.hypot(jefe.x-oldX,jefe.y-oldY);
 jefe.state=travel>.01?'walk':'idle';jefe.walkDistance+=travel;
 jefe.walkFrame=Math.floor(jefe.walkDistance/enemyWalkFrameStride)%jefePisosRojos.walk.length;
};
const bossDamageFeedbackBase=damageEnemy;
damageEnemy=function(actor,amount,direction=facing,canBlock=false){
 const oldX=actor.x,wasAttacking=actor===jefe&&actor.attackTimer>0;
 const result=bossDamageFeedbackBase(actor,amount,direction,canBlock);
 if(result&&actor===jefe&&!actor.dead&&!actor.knocked){
  actor.x=oldX+direction*8;actor.hitTimer=wasAttacking?0:6;
 }
 return result;
};
const bossResetBase=activateBoss;
activateBoss=function(){bossResetBase();jefe.bossCooldown=0;jefe.bossStrikeChecked=false};
const time250SelectBase=selectCharacter;
selectCharacter=function(name){const result=time250SelectBase(name);phaseTime=250;return result};

