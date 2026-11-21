const atlas = document.querySelector("#island-atlas");

if (atlas) {
  const buttons = [...atlas.querySelectorAll("[data-island]")];
  const panels = [...atlas.querySelectorAll("[data-island-panel]")];
  const labelPins = [
    ...atlas.querySelectorAll(".island-map-labels [data-map-pin]"),
  ];
  const coasts = [...atlas.querySelectorAll("[data-coast]")];
  const status = atlas.querySelector("#island-status");
  const mobileLabels = matchMedia("(max-width: 767px)");

  function updateMapLabels() {
    const isMobile = mobileLabels.matches;
    const padX = isMobile ? 10 : 9;
    const padY = isMobile ? 5 : 4.5;

    atlas.querySelectorAll(".island-map-labels text").forEach((text) => {
      let background = text.parentNode.querySelector("rect");
      if (!background) {
        background = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect",
        );
        text.before(background);
      }

      const cx = Number(text.getAttribute("x"));
      const cy = Number(text.getAttribute("y"));
      const box = text.getBBox();
      const textW =
        box.width > 0
          ? box.width
          : text.textContent.trim().length * (isMobile ? 9.5 : 8.2);
      const textH = box.height > 0 ? box.height : isMobile ? 20 : 17;

      const width = Math.round(textW + padX * 2);
      const height = Math.round(textH + padY * 2);
      const clampedX = Math.max(
        4,
        Math.min(646 - width, Math.round(cx - width / 2)),
      );
      const clampedCenter = clampedX + width / 2;

      if (Math.abs(clampedCenter - cx) > 0.5) {
        text.setAttribute("x", String(clampedCenter));
      }

      const rectY =
        box.height > 0
          ? Math.round(box.y - padY)
          : Math.round(cy - textH * 0.78 - padY);

      background.setAttribute("x", String(clampedX));
      background.setAttribute("y", String(rectY));
      background.setAttribute("width", String(width));
      background.setAttribute("height", String(height));
      background.setAttribute("rx", "7");
    });
  }

  function selectIsland(island, { announce = true, syncUrl = false } = {}) {
    const selected = buttons.find((button) => button.dataset.island === island);
    if (!selected) return;

    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(button === selected));
    }
    for (const panel of panels) {
      panel.hidden = panel.dataset.islandPanel !== island;
    }
    for (const pin of labelPins) {
      const active = pin.dataset.mapPin === island;
      pin.classList.toggle("is-selected", active);
      pin.setAttribute("aria-pressed", String(active));
    }
    for (const coast of coasts) {
      const key = coast.dataset.coast;
      coast.classList.toggle(
        "is-selected",
        key === island || (island === "run" && key === "nailaka"),
      );
    }

    if (syncUrl) {
      const url = new URL(location.href);
      if (island === "neira") url.searchParams.delete("island");
      else url.searchParams.set("island", island);
      history.replaceState(null, "", url);
    }

    if (announce && status) {
      status.textContent = `Showing featured places for ${selected.textContent.trim()}.`;
    }
  }

  for (const pin of labelPins) {
    const label = pin.querySelector("text")?.textContent.trim();
    pin.setAttribute("role", "button");
    pin.setAttribute("tabindex", "0");
    if (label) pin.setAttribute("aria-label", `Select ${label} on map`);
  }

  atlas.addEventListener("click", (event) => {
    const control = event.target.closest("[data-island], [data-map-pin]");
    if (control) {
      selectIsland(control.dataset.island || control.dataset.mapPin, {
        announce: true,
        syncUrl: true,
      });
    }
  });

  atlas.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const pin = event.target.closest(".island-map-labels [data-map-pin]");
    if (!pin) return;
    event.preventDefault();
    selectIsland(pin.dataset.mapPin, { announce: true, syncUrl: true });
  });

  updateMapLabels();
  document.fonts.ready.then(updateMapLabels);
  mobileLabels.addEventListener("change", updateMapLabels);

  const initialIsland = new URLSearchParams(location.search).get("island");
  selectIsland(
    buttons.some((button) => button.dataset.island === initialIsland)
      ? initialIsland
      : "neira",
    { announce: false, syncUrl: false },
  );
  atlas.classList.add("is-ready");
}
