$(document).ready(function () {
    const $items = $(".gallery .portfolio-item");
    const videoAvailability = new Map();

    async function hasVideoAsset(src) {
        if (!src) {
            return false;
        }

        if (videoAvailability.has(src)) {
            return videoAvailability.get(src);
        }

        try {
            const response = await fetch(src, { method: "HEAD" });
            const exists = response.ok;
            videoAvailability.set(src, exists);
            return exists;
        } catch (error) {
            videoAvailability.set(src, false);
            return false;
        }
    }

    function stopVideoPreview(card) {
        const video = card.querySelector(".project-video");
        const poster = card.querySelector(".preview-poster");

        card._videoHoverToken = (card._videoHoverToken || 0) + 1;
        card.classList.remove("is-playing", "is-video-ready");
        card.classList.remove("is-video-fallback");

        if (!video) {
            if (poster) {
                gsap.to(poster, { scale: 1, duration: 0.35, ease: "power2.out" });
            }
            return;
        }

        try {
            video.pause();
            video.currentTime = 0;
        } catch (error) {
            // No-op: algunos navegadores bloquean currentTime si el video no llegó a cargar.
        }

        if (poster) {
            gsap.to(poster, { scale: 1, duration: 0.35, ease: "power2.out" });
        }
    }

    async function prepareAndPlayVideo(card) {
        const video = card.querySelector(".project-video");
        const poster = card.querySelector(".preview-poster");
        const source = video ? video.querySelector("source") : null;
        const desiredSrc = source?.dataset.src || card.dataset.videoSrc || "";
        const hoverToken = (card._videoHoverToken || 0) + 1;

        card._videoHoverToken = hoverToken;

        if (!video) {
            return;
        }

        const canPlay = await hasVideoAsset(desiredSrc);

        if (card._videoHoverToken !== hoverToken) {
            return;
        }

        if (canPlay) {
            if (desiredSrc && source && source.getAttribute("src") !== desiredSrc) {
                source.setAttribute("src", desiredSrc);
                video.load();
            }

            card.classList.add("is-video-ready", "is-playing");
            card.classList.remove("is-video-fallback");

            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(() => {});
            }
        } else if (poster) {
            card.classList.remove("is-video-ready", "is-playing");
            card.classList.add("is-video-fallback");
            gsap.to(poster, { scale: 1.04, duration: 0.35, ease: "power2.out" });
        }
    }

    function stopScrollPreview(card) {
        const track = card._scrollTrack;

        card.classList.remove("is-scrolling");

        if (card._scrollTween) {
            card._scrollTween.kill();
            card._scrollTween = null;
        }

        if (track) {
            gsap.to(track, {
                yPercent: 0,
                duration: 0.6,
                ease: "power2.out",
                overwrite: true
            });
        }
    }

    function stopMotionPreview(card) {
        card.classList.remove("is-floating");

        if (card._motionTl) {
            card._motionTl.kill();
            card._motionTl = null;
        }

        const stage = card._motionStage;
        const image = card._motionImage;
        const badges = card._motionBadges;

        if (stage) {
            gsap.to(stage, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.35, ease: "power2.out" });
        }

        if (image) {
            gsap.to(image, { scale: 1, duration: 0.35, ease: "power2.out" });
        }

        if (badges && badges.length) {
            gsap.to(badges, { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" });
        }
    }

    $(".button").on("click", function () {
        $(this).addClass("active").siblings().removeClass("active");

        const filter = $(this).attr("data-filter");

        $items.each(function () {
            const shouldShow = filter === "all" || $(this).hasClass(filter);

            if (!shouldShow) {
                if (typeof this._previewReset === "function") {
                    this._previewReset();
                }
                $(this).stop(true, true).fadeOut(180);
            } else {
                $(this).stop(true, true).fadeIn(320);
            }
        });
    });

    // MAGNIFIC-POPUP
    $(".gallery").magnificPopup({
        delegate: 'a[data-popup="image"]',
        type: "image",
        removalDelay: 500,
        gallery: {
            enabled: true
        },
        callbacks: {
            beforeOpen: function () {
                this.st.image.markup = this.st.image.markup.replace("mfp-figure", "mfp-figure mfp-with-anim");
                this.st.mainClass = this.st.el.attr("data-effect");
            }
        },
        closeOnContentClick: true,
        midClick: true
    });

    document.querySelectorAll('.portfolio-item[data-preview="video"]').forEach((card) => {
        card._previewReset = () => stopVideoPreview(card);

        const preloadSource = card.querySelector(".project-video source")?.dataset.src || card.dataset.videoSrc || "";
        if (preloadSource) {
            hasVideoAsset(preloadSource);
        }

        card.addEventListener("mouseenter", () => prepareAndPlayVideo(card));
        card.addEventListener("mouseleave", () => stopVideoPreview(card));
        card.addEventListener("focusin", () => prepareAndPlayVideo(card));
        card.addEventListener("focusout", () => stopVideoPreview(card));
    });

    document.querySelectorAll('.portfolio-item[data-preview="scroll"]').forEach((card) => {
        const track = card.querySelector(".scroll-image");
        const distance = Number(card.dataset.scrollDistance || 45);

        card._scrollTrack = track;
        card._previewReset = () => stopScrollPreview(card);

        const startScroll = () => {
            if (!track) {
                return;
            }

            if (card._scrollTween) {
                card._scrollTween.kill();
            }

            card.classList.add("is-scrolling");
            card._scrollTween = gsap.to(track, {
                yPercent: -distance,
                duration: 8,
                ease: "none",
                overwrite: true
            });
        };

        card.addEventListener("mouseenter", startScroll);
        card.addEventListener("mouseleave", () => stopScrollPreview(card));
        card.addEventListener("focusin", startScroll);
        card.addEventListener("focusout", () => stopScrollPreview(card));
    });

    document.querySelectorAll('.portfolio-item[data-preview="motion"]').forEach((card) => {
        const stage = card.querySelector(".animated-stage");
        const image = card.querySelector(".animated-image");
        const badges = card.querySelectorAll(".motion-badge");

        card._motionStage = stage;
        card._motionImage = image;
        card._motionBadges = badges;
        card._previewReset = () => stopMotionPreview(card);

        const startMotion = () => {
            if (!stage || !image) {
                return;
            }

            if (card._motionTl) {
                card._motionTl.kill();
            }

            card.classList.add("is-floating");
            card._motionTl = gsap.timeline({ defaults: { ease: "power3.out" } });
            card._motionTl
                .to(card, { y: -10, duration: 0.35 }, 0)
                .to(stage, { rotateX: 3, rotateY: -4, scale: 1.01, duration: 0.55 }, 0)
                .to(image, { scale: 1.08, duration: 0.7 }, 0)
                .to(badges, { y: -10, opacity: 1, stagger: 0.08, duration: 0.45 }, 0);
        };

        card.addEventListener("mouseenter", startMotion);
        card.addEventListener("mouseleave", () => stopMotionPreview(card));
        card.addEventListener("focusin", startMotion);
        card.addEventListener("focusout", () => stopMotionPreview(card));
    });

    const revealTargets = document.querySelectorAll(".portfolio-item");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !entry.target.dataset.revealed) {
                    entry.target.dataset.revealed = "true";
                    gsap.fromTo(entry.target, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.18,
            rootMargin: "0px 0px -10% 0px"
        });

        revealTargets.forEach((card) => observer.observe(card));
    } else {
        gsap.set(revealTargets, { opacity: 1, y: 0 });
    }
});