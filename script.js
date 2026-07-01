/* ============================================================
   HI BEAUTIFUL — A LOVE LETTER
   Vanilla JS — all interactions & animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     0. CUSTOMIZATION — edit these values freely
  --------------------------------------------------------- */
  const CONFIG = {
    relationshipStartDate: '2022-03-14T00:00:00', // used by the Love Counter
    letterText:
`My Love,

I don't say this enough, so I'm writing it down instead.

Thank you for the ordinary Tuesdays, the late-night talks, and every small
moment that somehow became my favorite part of the day.

You didn't just walk into my life. You made it make sense.

Forever yours,
Me`,
    reasons: [
      { icon:'☕', label:'Reason 01', text:'The way you remember my coffee order without asking.' },
      { icon:'😂', label:'Reason 02', text:'You laugh at your own jokes before you finish telling them.' },
      { icon:'🎧', label:'Reason 03', text:'You always save me the earbud that actually works.' },
      { icon:'🌧', label:'Reason 04', text:'You make rainy days feel like an event, not an inconvenience.' },
      { icon:'📖', label:'Reason 05', text:'You listen like whatever I\'m saying is the most important thing.' },
      { icon:'🧸', label:'Reason 06', text:'You keep every little thing I\'ve ever given you.' },
      { icon:'🚗', label:'Reason 07', text:'Car rides with you are never just car rides.' },
      { icon:'🍳', label:'Reason 08', text:'Your terrible cooking, made with way too much love.' },
      { icon:'🌙', label:'Reason 09', text:'You check the sky for me when I\'m too tired to look up.' },
      { icon:'💬', label:'Reason 10', text:'You never let an argument end without a hug.' },
      { icon:'🎵', label:'Reason 11', text:'You hum my favorite song without realizing it.' },
      { icon:'❤',  label:'Reason 12', text:'You chose me. Every single day, you still choose me.' },
    ],
  };

  /* ---------------------------------------------------------
     1. LOADER
  --------------------------------------------------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 600);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => loader.classList.add('hidden'), 2500);

  /* ---------------------------------------------------------
     2. SCROLL PROGRESS BAR
  --------------------------------------------------------- */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress(){
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
  }
  document.addEventListener('scroll', updateScrollProgress, { passive:true });

  /* ---------------------------------------------------------
     3. CURSOR GLOW (desktop)
  --------------------------------------------------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
  let glowX = mouseX, glowY = mouseY;
  window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
  function animateGlow(){
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    if(cursorGlow){ cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%,-50%)`; }
    requestAnimationFrame(animateGlow);
  }
  requestAnimationFrame(animateGlow);

  /* ---------------------------------------------------------
     4. MOUSE PARALLAX (hero)
  --------------------------------------------------------- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  window.addEventListener('mousemove', (e) => {
    const px = (e.clientX / window.innerWidth - 0.5) * 2;
    const py = (e.clientY / window.innerHeight - 0.5) * 2;
    parallaxEls.forEach(el => {
      el.style.transform = `translate(${px * 10}px, ${py * 10}px)`;
    });
  });

  /* ---------------------------------------------------------
     5. MAGNETIC BUTTONS
  --------------------------------------------------------- */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      btn.style.transform = `translate(${x*0.25}px, ${y*0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });

  /* ---------------------------------------------------------
     6. STARFIELD + METEOR SHOWER CANVAS (hero + ending)
  --------------------------------------------------------- */
  function initSky(canvasId, opts = {}){
    const canvas = document.getElementById(canvasId);
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, stars = [], meteors = [];
    const starCount = opts.starCount || 140;

    function resize(){
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    resize();
    window.addEventListener('resize', resize);

    for(let i=0;i<starCount;i++){
      stars.push({
        x: Math.random()*w, y: Math.random()*h,
        r: Math.random()*1.6 + 0.3,
        baseAlpha: Math.random()*0.6 + 0.2,
        twinkleSpeed: Math.random()*0.02 + 0.005,
        phase: Math.random()*Math.PI*2,
      });
    }

    function spawnMeteor(){
      meteors.push({
        x: Math.random()*w, y: -20,
        len: Math.random()*120 + 80,
        speed: Math.random()*8 + 10,
        angle: Math.PI/4,
        alpha: 1,
      });
    }
    let meteorTimer = 0;

    function draw(t){
      ctx.clearRect(0,0,w,h);
      stars.forEach(s => {
        const alpha = s.baseAlpha + Math.sin(t*s.twinkleSpeed + s.phase) * 0.3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0,alpha)})`;
        ctx.fill();
      });

      meteorTimer++;
      if(meteorTimer > 220 && Math.random() < 0.02){
        spawnMeteor();
        meteorTimer = 0;
      }
      meteors.forEach(m => {
        const dx = Math.cos(m.angle)*m.len, dy = Math.sin(m.angle)*m.len;
        const grad = ctx.createLinearGradient(m.x, m.y, m.x-dx, m.y-dy);
        grad.addColorStop(0, `rgba(255,255,255,${m.alpha})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x-dx, m.y-dy);
        ctx.stroke();
        m.x += Math.cos(m.angle)*m.speed;
        m.y += Math.sin(m.angle)*m.speed;
        m.alpha -= 0.01;
      });
      meteors = meteors.filter(m => m.alpha > 0 && m.y < h+100);

      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }
  initSky('skyCanvas', { starCount: 160 });
  initSky('endingCanvas', { starCount: 100 });

  /* ---------------------------------------------------------
     7. FLOATING HEARTS (ambient, across whole page)
  --------------------------------------------------------- */
  const heartsLayer = document.getElementById('floatingHeartsLayer');
  function spawnFloatingHeart(){
    const heart = document.createElement('span');
    heart.className = 'fh';
    heart.textContent = ['❤','♥','✦'][Math.floor(Math.random()*3)];
    heart.style.left = Math.random()*100 + 'vw';
    heart.style.setProperty('--drift', (Math.random()*80-40) + 'px');
    heart.style.fontSize = (Math.random()*14+10) + 'px';
    const duration = Math.random()*6 + 8;
    heart.style.animationDuration = duration + 's';
    heartsLayer.appendChild(heart);
    setTimeout(() => heart.remove(), duration*1000);
  }
  setInterval(spawnFloatingHeart, 1800);

  /* ---------------------------------------------------------
     8. SCROLL REVEAL (IntersectionObserver)
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .h-timeline-item');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------
     9. "OPEN MY HEART" BUTTON — smooth scroll
  --------------------------------------------------------- */
  document.getElementById('openHeartBtn').addEventListener('click', () => {
    document.getElementById('story').scrollIntoView({ behavior:'smooth' });
  });

  /* ---------------------------------------------------------
     10. TIMELINE PROGRESS FILL (section 2)
  --------------------------------------------------------- */
  const timelineFill = document.getElementById('timelineFill');
  const timelineEl = document.querySelector('.timeline');
  function updateTimelineFill(){
    if(!timelineEl) return;
    const rect = timelineEl.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height;
    const visible = Math.min(Math.max(vh*0.6 - rect.top, 0), total);
    timelineFill.style.height = (visible/total*100) + '%';
  }
  document.addEventListener('scroll', updateTimelineFill, { passive:true });
  updateTimelineFill();

  /* ---------------------------------------------------------
     11. LOVE COUNTER
  --------------------------------------------------------- */
  const startDate = new Date(CONFIG.relationshipStartDate);
  const elDays = document.getElementById('countDays');
  const elHours = document.getElementById('countHours');
  const elMinutes = document.getElementById('countMinutes');
  const elSeconds = document.getElementById('countSeconds');
  function pad(n){ return String(n).padStart(2,'0'); }
  function updateCounter(){
    const diff = Date.now() - startDate.getTime();
    if(diff < 0) return;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    elDays.textContent = String(days).padStart(3,'0');
    elHours.textContent = pad(hours);
    elMinutes.textContent = pad(minutes);
    elSeconds.textContent = pad(seconds);
  }
  updateCounter();
  setInterval(updateCounter, 1000);

  /* ---------------------------------------------------------
     12. GALLERY LIGHTBOX
  --------------------------------------------------------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      lightboxImage.textContent = item.querySelector('span').textContent;
      lightboxCaption.textContent = item.dataset.caption || '';
      lightbox.classList.add('open');
    });
  });
  document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox.addEventListener('click', (e) => { if(e.target === lightbox) lightbox.classList.remove('open'); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') lightbox.classList.remove('open'); });

  /* ---------------------------------------------------------
     13. LOVE LETTER — envelope + typewriter
  --------------------------------------------------------- */
  const envelope = document.getElementById('envelope');
  const envelopeHint = document.getElementById('envelopeHint');
  const letterTextEl = document.getElementById('letterText');
  let letterTyped = false;

  function typewrite(el, text, speed = 22){
    let i = 0;
    el.textContent = '';
    (function step(){
      if(i <= text.length){
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(step, speed);
      }
    })();
  }

  envelope.addEventListener('click', () => {
    envelope.classList.toggle('open');
    if(envelope.classList.contains('open')){
      envelopeHint.textContent = 'tap to close';
      if(!letterTyped){
        letterTyped = true;
        setTimeout(() => typewrite(letterTextEl, CONFIG.letterText, 18), 500);
      }
    } else {
      envelopeHint.textContent = 'tap to open';
    }
  });

  /* ---------------------------------------------------------
     14. MUSIC PLAYER
  --------------------------------------------------------- */
  const audio = document.getElementById('audioPlayer');
  const playBtn = document.getElementById('musicPlayBtn');
  const playIcon = document.getElementById('playIcon');
  const musicArt = document.getElementById('musicArt');
  const equalizer = document.getElementById('equalizer');
  const musicBar = document.getElementById('musicBar');
  const musicBarFill = document.getElementById('musicBarFill');
  const musicCurrent = document.getElementById('musicCurrent');
  const musicDuration = document.getElementById('musicDuration');
  const volumeSlider = document.getElementById('volumeSlider');

  function fmtTime(sec){
    if(!isFinite(sec)) return '0:00';
    const m = Math.floor(sec/60);
    const s = Math.floor(sec%60);
    return `${m}:${String(s).padStart(2,'0')}`;
  }

  audio.volume = 0.6;

  playBtn.addEventListener('click', () => {
    if(audio.paused){
      audio.play().catch(() => { /* file likely missing — visual still responds */ });
      playIcon.innerHTML = '<path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/>';
      musicArt.classList.add('playing');
      equalizer.classList.add('playing');
    } else {
      audio.pause();
      playIcon.innerHTML = '<path d="M8 5v14l11-7z" fill="currentColor"/>';
      musicArt.classList.remove('playing');
      equalizer.classList.remove('playing');
    }
  });

  audio.addEventListener('loadedmetadata', () => { musicDuration.textContent = fmtTime(audio.duration); });
  audio.addEventListener('timeupdate', () => {
    musicCurrent.textContent = fmtTime(audio.currentTime);
    if(audio.duration){ musicBarFill.style.width = (audio.currentTime/audio.duration*100) + '%'; }
  });
  musicBar.addEventListener('click', (e) => {
    const rect = musicBar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if(audio.duration){ audio.currentTime = pct * audio.duration; }
  });
  volumeSlider.addEventListener('input', () => { audio.volume = parseFloat(volumeSlider.value); });

  /* ---------------------------------------------------------
     15. REASONS GRID — build cards + flip
  --------------------------------------------------------- */
  const reasonsGrid = document.getElementById('reasonsGrid');
  CONFIG.reasons.forEach((r, idx) => {
    const card = document.createElement('div');
    card.className = 'reason-card reveal-up';
    card.dataset.delay = idx % 4;
    card.innerHTML = `
      <div class="reason-card-inner">
        <div class="reason-face reason-front">
          <span class="reason-face-icon">${r.icon}</span>
          <span class="reason-face-num">${r.label}</span>
        </div>
        <div class="reason-face reason-back">
          <p>${r.text}</p>
        </div>
      </div>`;
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    reasonsGrid.appendChild(card);
    revealObserver.observe(card);
  });

  /* ---------------------------------------------------------
     16. GIFT BOX
  --------------------------------------------------------- */
  const giftBox = document.getElementById('giftBox');
  let giftOpened = false;
  giftBox.addEventListener('click', () => {
    if(giftOpened) return;
    giftBox.classList.add('shake');
    setTimeout(() => {
      giftBox.classList.remove('shake');
      giftBox.classList.add('open');
      giftOpened = true;
      burstConfetti(confettiCtx, confettiCanvas, giftBox.getBoundingClientRect());
    }, 500);
  });

  /* ---------------------------------------------------------
     17. CONFETTI / FIREWORKS ENGINE (shared canvas)
  --------------------------------------------------------- */
  const confettiCanvas = document.getElementById('confettiCanvas');
  const confettiCtx = confettiCanvas.getContext('2d');
  function resizeConfetti(){
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  resizeConfetti();
  window.addEventListener('resize', resizeConfetti);

  let confettiParticles = [];
  const confettiColors = ['#FF4D8D','#FF6CAB','#FFC1DA','#7C4DFF','#FFFFFF'];

  function burstConfetti(ctx, canvas, originRect){
    const originX = originRect ? (originRect.left + originRect.width/2) : window.innerWidth/2;
    const originY = originRect ? (originRect.top + originRect.height/2) : window.innerHeight/2;
    for(let i=0;i<80;i++){
      const angle = Math.random()*Math.PI*2;
      const speed = Math.random()*7+3;
      confettiParticles.push({
        x: originX, y: originY,
        vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed - 4,
        size: Math.random()*7+4,
        color: confettiColors[Math.floor(Math.random()*confettiColors.length)],
        rotation: Math.random()*360,
        rotSpeed: (Math.random()-0.5)*10,
        gravity: 0.18,
        life: 1,
      });
    }
    if(!confettiRunning){ confettiRunning = true; requestAnimationFrame(confettiLoop); }
  }

  function fireworks(){
    const w = window.innerWidth, h = window.innerHeight;
    for(let burst=0; burst<3; burst++){
      setTimeout(() => {
        burstConfetti(confettiCtx, confettiCanvas, {
          left: Math.random()*w*0.6+w*0.2, top: Math.random()*h*0.3+h*0.15, width:0, height:0
        });
      }, burst*250);
    }
  }

  let confettiRunning = false;
  function confettiLoop(){
    confettiCtx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach(p => {
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life -= 0.008;
      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rotation*Math.PI/180);
      confettiCtx.globalAlpha = Math.max(p.life,0);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2);
      confettiCtx.restore();
    });
    confettiParticles = confettiParticles.filter(p => p.life > 0 && p.y < confettiCanvas.height+50);
    if(confettiParticles.length > 0){
      requestAnimationFrame(confettiLoop);
    } else {
      confettiRunning = false;
      confettiCtx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
    }
  }

  /* ---------------------------------------------------------
     18. THE QUESTION
  --------------------------------------------------------- */
  const questionSection = document.getElementById('question');
  const questionAnswer = document.getElementById('questionAnswer');
  const yesBtn = document.getElementById('yesBtn');
  const absolutelyBtn = document.getElementById('absolutelyBtn');

  function answerYes(message){
    questionSection.classList.add('answered');
    questionAnswer.textContent = message;
    fireworks();
    setTimeout(fireworks, 500);
    // ramp up ambient hearts briefly
    let bursts = 0;
    const heartBurst = setInterval(() => {
      spawnFloatingHeart(); spawnFloatingHeart();
      bursts++;
      if(bursts > 12) clearInterval(heartBurst);
    }, 150);
    // gently raise music volume if playing
    if(!audio.paused){
      audio.volume = Math.min(1, audio.volume + 0.25);
      volumeSlider.value = audio.volume;
    }
  }

  yesBtn.addEventListener('click', () => answerYes('You just made me the happiest person alive. ❤'));
  absolutelyBtn.addEventListener('click', () => answerYes('Forever it is. I love you, always. ❤'));

  /* ---------------------------------------------------------
     19. GALLERY / TIMELINE keyboard & touch niceties
  --------------------------------------------------------- */
  // Enable drag-scroll on horizontal timeline for desktop mouse users
  const hTrackWrap = document.querySelector('.h-timeline-wrap');
  let isDown = false, startX, scrollLeft;
  hTrackWrap.addEventListener('mousedown', (e) => {
    isDown = true; startX = e.pageX - hTrackWrap.offsetLeft; scrollLeft = hTrackWrap.scrollLeft;
  });
  hTrackWrap.addEventListener('mouseleave', () => isDown = false);
  hTrackWrap.addEventListener('mouseup', () => isDown = false);
  hTrackWrap.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - hTrackWrap.offsetLeft;
    hTrackWrap.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });

});