// Simple badge carousel: navigation, autoplay and tap-to-open overlay
(function(){
    const carousel = document.getElementById('badgeCarousel');
    if(!carousel) return;

    const track = carousel.querySelector('.badge-track');
    const prev = carousel.querySelector('.badge-nav.prev');
    const next = carousel.querySelector('.badge-nav.next');
    const items = Array.from(track.querySelectorAll('.badge-item'));
    let autoplayInterval = null;
    let autoplayDelay = 4000;

    function itemSize(){
        const item = items[0];
        if(!item) return 0;
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        return Math.round(item.getBoundingClientRect().width + gap);
    }

    function pageNext(){
        const size = itemSize();
        const max = track.scrollWidth - track.clientWidth;
        // if near end, loop back to start
        if (track.scrollLeft + size >= max - 2) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            track.scrollBy({ left: size, behavior: 'smooth' });
        }
    }

    function pagePrev(){
        const size = itemSize();
        const max = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft - size <= 2) {
            // go to end
            track.scrollTo({ left: max, behavior: 'smooth' });
        } else {
            track.scrollBy({ left: -size, behavior: 'smooth' });
        }
    }

    if(next) next.addEventListener('click', pageNext);
    if(prev) prev.addEventListener('click', pagePrev);

    // autoplay
    function startAutoplay(){
        stopAutoplay();
        autoplayInterval = setInterval(()=>{ pageNext(); }, autoplayDelay);
    }
    function stopAutoplay(){ if(autoplayInterval){ clearInterval(autoplayInterval); autoplayInterval = null; } }

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Tap/click on item toggles overlay (useful for mobile)
    items.forEach(item =>{
        item.addEventListener('click', (e)=>{
            // toggle active overlay state
            const active = item.classList.contains('active');
            items.forEach(i=> i.classList.remove('active'));
            if(!active) item.classList.add('active');
        });
    });

    // close overlays when clicking outside
    document.addEventListener('click', (e)=>{
        if(!e.target.closest('.badge-item')){
            items.forEach(i=> i.classList.remove('active'));
        }
    });

    // start autoplay if there is enough content
    if (items.length > 1) startAutoplay();

    // small resize adjustment
    let resizeTimer = null;
    window.addEventListener('resize', ()=>{ clearTimeout(resizeTimer); resizeTimer = setTimeout(()=>{ /* no-op, geometry recalculated when needed */ },200); });

    // pause on touch (mobile) while user interacts
    track.addEventListener('touchstart', stopAutoplay, {passive: true});
    track.addEventListener('touchend', startAutoplay, {passive: true});
})();

