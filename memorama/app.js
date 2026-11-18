const emojis = ['🍎','🍌','🍓','🍊','🍇','🍉','🍑','🍒'];
let cartas = [...emojis, ...emojis];
let primera = null, bloqueo = false, pares = 0, segundos = 0, timer = null, empezo = false;
const tablero = document.getElementById('tablero');
let deferredPrompt = null;

if(localStorage.getItem('mejor')) document.getElementById('mejor').textContent = localStorage.getItem('mejor');

function mezclar(a){ return a.sort(()=>Math.random()-0.5); }
function nuevoJuego(){
  cartas = mezclar([...emojis, ...emojis]);
  tablero.innerHTML = '';
  primera = null; bloqueo = false; pares = 0; segundos = 0; empezo = false;
  clearInterval(timer);
  document.getElementById('tiempo').textContent = '00:00';
  cartas.forEach((e, i) => {
    const b = document.createElement('button');
    b.className = 'carta'; b.textContent = '';
    b.onclick = () => voltear(b, i);
    tablero.appendChild(b);
  });
}
function voltear(b, i){
  if(bloqueo || b.classList.contains('volteada')) return;
  if(!empezo){ empezo = true; timer = setInterval(()=>{
    segundos++; let m = String(Math.floor(segundos/60)).padStart(2,'0'); let s = String(segundos%60).padStart(2,'0');
    document.getElementById('tiempo').textContent = m+':'+s;
  },1000); }
  b.classList.add('volteada'); b.textContent = cartas[i];
  if(!primera){ primera = {b, i}; return; }
  if(cartas[primera.i] === cartas[i]){ pares++; primera = null;
    if(pares === 8){ clearInterval(timer);
      let tiempoFinal = document.getElementById('tiempo').textContent;
      let mejor = localStorage.getItem('mejor');
      if(!mejor || tiempoFinal < mejor){ localStorage.setItem('mejor', tiempoFinal); document.getElementById('mejor').textContent = tiempoFinal; }
      setTimeout(()=>{ alert('¡Ganaste! Tiempo: ' + tiempoFinal); nuevoJuego(); }, 500);
    }
  } else { bloqueo = true; setTimeout(()=>{ b.classList.remove('volteada'); b.textContent=''; primera.b.classList.remove('volteada'); primera.b.textContent=''; primera=null; bloqueo=false; }, 800); }
}
window.addEventListener('beforeinstallprompt', (e)=>{ e.preventDefault(); deferredPrompt = e; });
document.getElementById('instalar').onclick = async ()=>{
  if(deferredPrompt){ deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; }
  else { alert('Ya puedes instalarla desde el menú del navegador > Instalar'); }
};
if('serviceWorker' in navigator){ navigator.serviceWorker.register('service-worker.js'); }
nuevoJuego();