// Auto-looping, non-interactive badge carousel
(function () {
    const carousel = document.getElementById('badgeCarousel');
    if (!carousel) return;

    const track = carousel.querySelector('.badge-track');
    if (!track) return;

    const originalItems = Array.from(track.querySelectorAll('.badge-item'));
    if (originalItems.length < 2) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let loopDistance = 0;

    function getGap() {
        const styles = window.getComputedStyle(track);
        const gap = parseFloat(styles.gap || styles.columnGap || '0');
        return Number.isFinite(gap) ? gap : 0;
    }

    function measureLoopDistance() {
        if (!originalItems.length) return 0;

        const first = originalItems[0];
        const last = originalItems[originalItems.length - 1];
        const itemWidth = last.offsetLeft + last.offsetWidth - first.offsetLeft;
        return Math.round(itemWidth + getGap());
    }

    originalItems.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    });

    function applyLoopDistance() {
        loopDistance = measureLoopDistance();
        if (loopDistance > 0) {
            track.style.setProperty('--badge-loop-distance', `${loopDistance}px`);
        }
    }

    if (!prefersReducedMotion) {
        applyLoopDistance();
    } else {
        track.classList.add('is-paused');
    }

    window.addEventListener('resize', () => {
        applyLoopDistance();
    });
})();

