import { c as create_ssr_component } from "../../chunks/ssr.js";
import hljs from "highlight.js/lib/core";
import { w as writable } from "../../chunks/index.js";
import "../../chunks/ProgressBar.svelte_svelte_type_style_lang.js";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";
const storeHighlightJs = writable(void 0);
const storePopup = writable(void 0);
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  hljs.registerLanguage("xml", xml);
  hljs.registerLanguage("css", css);
  hljs.registerLanguage("javascript", javascript);
  hljs.registerLanguage("typescript", typescript);
  storeHighlightJs.set(hljs);
  storePopup.set({
    computePosition,
    autoUpdate,
    flip,
    shift,
    offset,
    arrow
  });
  return `${slots.default ? slots.default({}) : ``}`;
});
export {
  Layout as default
};
