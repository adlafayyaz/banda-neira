import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function setupMotion() {
  const media = gsap.matchMedia();

  media.add(
    {
      reduced: "(prefers-reduced-motion: reduce)",
      mobile: "(max-width: 767px)",
      desktop: "(min-width: 768px)",
    },
    ({ conditions }) => {
      if (conditions.reduced) return;

      const hero = document.querySelector(".journal-hero");
      if (hero) {
        const photo = hero.querySelector(".journal-hero-photo");
        const copy = hero.querySelector(".journal-hero-copy");
        const scrollCta = hero.querySelector(".hero-scroll");

        const timeline = gsap.timeline({
          defaults: { ease: "none", force3D: true },
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: conditions.mobile ? 0.2 : 0.35,
            invalidateOnRefresh: true,
            id: "hero-parallax",
          },
        });

        if (photo) {
          timeline.fromTo(
            photo,
            { yPercent: -4, scale: 1.06 },
            { yPercent: conditions.mobile ? 8 : 13, scale: 1.06, duration: 1 },
            0,
          );
        }

        if (copy) {
          timeline.to(
            copy,
            { y: conditions.mobile ? 36 : 68, opacity: 0, duration: 0.78 },
            0,
          );
        }

        if (scrollCta) {
          timeline.to(
            scrollCta,
            { y: conditions.mobile ? 22 : 42, opacity: 0, duration: 0.62 },
            0,
          );
        }

        if (copy && window.scrollY < 20) {
          gsap.fromTo(
            copy.children,
            { y: 14, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.1,
              ease: "power2.out",
              clearProps: "transform,opacity",
            },
          );
        }
      }

      document.querySelectorAll("[data-reveal]").forEach((section) => {
        if (location.hash && `#${section.id}` === location.hash) return;
        if (section.getBoundingClientRect().top < window.innerHeight * 0.96)
          return;
        gsap.fromTo(
          section,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: section, start: "top 92%", once: true },
          },
        );
      });
    },
  );

  document.fonts.ready.then(() => ScrollTrigger.refresh());
  if (import.meta.hot) import.meta.hot.dispose(() => media.revert());
}
