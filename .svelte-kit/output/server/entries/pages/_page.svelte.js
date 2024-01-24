import { c as create_ssr_component, b as compute_rest_props, e as escape, d as spread, f as escape_attribute_value, h as escape_object, i as add_attribute, j as each, v as validate_component } from "../../chunks/ssr.js";
import "../../chunks/ProgressBar.svelte_svelte_type_style_lang.js";
let cBase = "flex aspect-square text-surface-50 font-semibold justify-center items-center overflow-hidden isolate";
let cImage = "w-full h-full object-cover";
const Avatar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classesBase;
  let $$restProps = compute_rest_props($$props, [
    "initials",
    "fill",
    "fontSize",
    "src",
    "fallback",
    "action",
    "actionParams",
    "background",
    "width",
    "border",
    "rounded",
    "shadow",
    "cursor"
  ]);
  let { initials = "AB" } = $$props;
  let { fill = "fill-token" } = $$props;
  let { fontSize = 150 } = $$props;
  let { src = "" } = $$props;
  let { fallback = "" } = $$props;
  let { action = () => {
  } } = $$props;
  let { actionParams = "" } = $$props;
  let { background = "bg-surface-400-500-token" } = $$props;
  let { width = "w-16" } = $$props;
  let { border = "" } = $$props;
  let { rounded = "rounded-full" } = $$props;
  let { shadow = "" } = $$props;
  let { cursor = "" } = $$props;
  function prunedRestProps() {
    delete $$restProps.class;
    return $$restProps;
  }
  if ($$props.initials === void 0 && $$bindings.initials && initials !== void 0)
    $$bindings.initials(initials);
  if ($$props.fill === void 0 && $$bindings.fill && fill !== void 0)
    $$bindings.fill(fill);
  if ($$props.fontSize === void 0 && $$bindings.fontSize && fontSize !== void 0)
    $$bindings.fontSize(fontSize);
  if ($$props.src === void 0 && $$bindings.src && src !== void 0)
    $$bindings.src(src);
  if ($$props.fallback === void 0 && $$bindings.fallback && fallback !== void 0)
    $$bindings.fallback(fallback);
  if ($$props.action === void 0 && $$bindings.action && action !== void 0)
    $$bindings.action(action);
  if ($$props.actionParams === void 0 && $$bindings.actionParams && actionParams !== void 0)
    $$bindings.actionParams(actionParams);
  if ($$props.background === void 0 && $$bindings.background && background !== void 0)
    $$bindings.background(background);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.border === void 0 && $$bindings.border && border !== void 0)
    $$bindings.border(border);
  if ($$props.rounded === void 0 && $$bindings.rounded && rounded !== void 0)
    $$bindings.rounded(rounded);
  if ($$props.shadow === void 0 && $$bindings.shadow && shadow !== void 0)
    $$bindings.shadow(shadow);
  if ($$props.cursor === void 0 && $$bindings.cursor && cursor !== void 0)
    $$bindings.cursor(cursor);
  classesBase = `${cBase} ${background} ${width} ${border} ${rounded} ${shadow} ${cursor} ${$$props.class ?? ""}`;
  return `  <figure class="${"avatar " + escape(classesBase, true)}" data-testid="avatar">${src ? `<img${spread(
    [
      {
        class: "avatar-image " + escape(cImage, true)
      },
      {
        style: escape_attribute_value($$props.style ?? "")
      },
      { src: escape_attribute_value(src) },
      {
        alt: escape_attribute_value($$props.alt || "")
      },
      escape_object(prunedRestProps())
    ],
    {}
  )}>` : `<svg class="avatar-initials w-full h-full" viewBox="0 0 512 512"><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-weight="bold"${add_attribute("font-size", fontSize, 0)} class="${"avatar-text " + escape(fill, true)}">${escape(String(initials).substring(0, 2).toUpperCase())}</text></svg>`}</figure>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let elemChat;
  let messageFeed = [
    {
      id: 0,
      host: true,
      avatar: 48,
      name: "Mac",
      timestamp: "Yesterday @ 2:30pm",
      message: "Some message text.",
      color: "variant-soft-primary"
    },
    {
      id: 1,
      host: false,
      avatar: 14,
      name: "Rock",
      timestamp: "Yesterday @ 2:45pm",
      message: "Some message text.",
      color: "variant-soft-primary"
    }
  ];
  let activeUsers = [
    { id: 0, name: "Mac", isActive: true },
    { id: 1, name: "Rock", isActive: false }
  ];
  return `${$$result.head += `<!-- HEAD_svelte-1vulv39_START -->${$$result.title = `<title>Coders-Connect</title>`, ""}<!-- HEAD_svelte-1vulv39_END -->`, ""}  <div class="text-white flex justify-center text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light my-8" data-svelte-h="svelte-1tc6pd6"><h1>Coders-Connect</h1></div>  <div class="md:w-full grid grid-cols-1 md:grid-cols-[auto_1fr] gap-1"><div class="bg-surface-500/30 p-3 lg:h-[500px]"><input class="w-full md:rounded-2xl text-black" type="text" placeholder="Search...">  <div class="bg-surface-500/30 p-2 mt-3"><h2 class="text-lg font-bold mb-2" data-svelte-h="svelte-1aymu7b">Active Users</h2> <div class="flex flex-col"> ${each(activeUsers.filter((user) => user.isActive), (user) => {
    return `<div class="flex items-center"><img${add_attribute("src", user.isActive ? "/Mb.jpg" : "/rk.jpeg", 0)} alt="${escape(user.name, true) + "'s Avatar"}" class="w-11 h-11 rounded-full mr-2 mb-2"> <p class="">${escape(user.name)}</p> </div>`;
  })}</div></div></div> <div class="overflow-y-auto"${add_attribute("this", elemChat, 0)}> <div class="bg-surface-500/30 p-4 overflow-y-auto lg:h-[430px]"><section class="w-full max-h-[400px] p-4 overflow-y-auto space-y-4">${each(messageFeed, (bubble, i) => {
    return `${bubble.host === true ? ` <div class="grid grid-cols-[auto_1fr] gap-2">${validate_component(Avatar, "Avatar").$$render(
      $$result,
      {
        src: "/Mb.jpg/?img=" + bubble.avatar,
        width: "w-12"
      },
      {},
      {}
    )} <div class="card p-4 variant-soft rounded-tl-none space-y-2"><header class="flex justify-between items-center"><p class="font-bold">${escape(bubble.name)}</p> <small class="opacity-50">${escape(bubble.timestamp)}</small></header> <p>${escape(bubble.message)}</p></div> </div>` : ` <div class="grid grid-cols-[1fr_auto] gap-2"><div class="${"card p-4 rounded-tr-none space-y-2 " + escape(bubble.color, true)}"><header class="flex justify-between items-center"><p class="font-bold">${escape(bubble.name)}</p> <small class="opacity-50">${escape(bubble.timestamp)}</small></header> <p>${escape(bubble.message)}</p></div> ${validate_component(Avatar, "Avatar").$$render(
      $$result,
      {
        src: "/Rk.jpeg/?img=" + bubble.avatar,
        width: "w-12"
      },
      {},
      {}
    )} </div>`}`;
  })}</section></div>  <div class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token"><button class="input-group-shim" data-svelte-h="svelte-pe7l84">+</button> <textarea class="bg-transparent border-0 ring-0" name="prompt" id="prompt" placeholder="Write a message...">${escape("")}</textarea> <button class="variant-filled-primary" data-svelte-h="svelte-9fy2ii">Send</button></div></div></div>`;
});
export {
  Page as default
};
