(() => {
      const ws = new WebSocket("ws://localhost:3001");
      ws.onmessage = () => {
        location.reload();
      };
    })();
"use strict";
(() => {
  // packages/widget-utils/dist/esm/index.js
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  function getTileSize(settings) {
    const style = sdk.getStyleConfig();
    const { inline_tile_size } = style;
    const tileSizes = {
      small: settings?.small ?? "173px",
      medium: settings?.medium ?? "265.5px",
      large: settings?.large ?? "400px"
    };
    if (!inline_tile_size) {
      return tileSizes["medium"];
    }
    return tileSizes[inline_tile_size];
  }
  function getTileSizeByWidget(tileSizeSettings) {
    const sizeWithUnit = getTileSize(tileSizeSettings);
    const sizeUnitless = sizeWithUnit.replace("px", "");
    return { "--tile-size": sizeWithUnit, "--tile-size-unitless": sizeUnitless };
  }
  function trimHashValuesFromObject(obj) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      acc[key] = typeof value === "string" && value.startsWith("#") ? value.replace("#", "") : value;
      return acc;
    }, {});
  }
  function getCSSVariables(features) {
    const { tileSizeSettings, cssVariables } = features || {};
    const styles = sdk.getStyleConfig();
    const inlineTileSettings = sdk.getInlineTileConfig();
    const {
      widget_background,
      tile_background,
      text_tile_background,
      text_tile_link_color,
      text_tile_user_handle_font_color,
      shopspot_btn_background,
      shopspot_btn_font_color,
      margin,
      text_tile_font_size,
      text_tile_user_name_font_size,
      text_tile_user_handle_font_size,
      shopspot_icon,
      expanded_tile_border_radius,
      inline_tile_border_radius,
      inline_tile_margin,
      shopspot_btn_font_size,
      text_tile_font_color,
      text_tile_user_name_font_color
    } = trimHashValuesFromObject(styles);
    const { show_tags: show_tags_expanded } = sdk.getExpandedTileConfig();
    const { show_caption, show_tags: show_tags_inline, show_shopspots, show_timestamp, show_sharing } = inlineTileSettings;
    const mutatedCssVariables = {
      ...cssVariables,
      "--widget-background": `#${widget_background}`,
      "--inline-tile-background": `#${tile_background}`,
      "--text-tile-background": `#${text_tile_background}`,
      "--shopspot-btn-background": `#${shopspot_btn_background}`,
      "--cta-button-background-color": `#${shopspot_btn_background}`,
      "--tile-tag-background": `#bcbbbc`,
      "--text-tile-link-color": `#${text_tile_link_color}`,
      "--text-tile-user-handle-font-color": `#${text_tile_user_handle_font_color}`,
      "--shopspot-btn-font-color": `#${shopspot_btn_font_color}`,
      "--margin": `${margin ? margin : 0}px`,
      "--text-tile-font-size": `${text_tile_font_size}px`,
      "--text-caption-paragraph-font-size": `${text_tile_font_size || 12}px`,
      "--text-tile-user-name-font-size": `${text_tile_user_name_font_size}px`,
      "--text-tile-user-name-font-color": `#${text_tile_user_name_font_color}`,
      "--text-tile-user-handle-font-size": `${text_tile_user_handle_font_size || 12}px`,
      "--text-tile-font-color": `#${text_tile_font_color}`,
      "--show-caption": `${show_caption ? "block" : "none"}`,
      "--show-caption-webkit": `${show_caption ? "-webkit-box" : "none"}`,
      "--shopspot-icon": shopspot_icon ? shopspot_icon : `#000`,
      "--tags-gap": `4px`,
      // TODO - Replace these with cta_button_font_color and cta_button_font_size @Peng Zhou
      "--cta-button-font-color": `#${shopspot_btn_font_color}`,
      "--cta-button-font-size": `${shopspot_btn_font_size}px`,
      "--expanded-tile-border-radius": `${expanded_tile_border_radius}px`,
      ...getTileSizeByWidget(tileSizeSettings),
      "--inline-tile-border-radius": `${inline_tile_border_radius}px`,
      "--inline-tile-margin": `${inline_tile_margin}px`,
      "--tags-display-inline": `${show_tags_inline ? "flex" : "none"}`,
      "--tags-display-expanded": `${show_tags_expanded ? "flex" : "none"}`,
      "--shopspots-display": `${show_shopspots ? "block" : "none"}`,
      "--timephrase-display": `${show_timestamp ? "block" : "none"}`,
      "--share-icon-display": `${show_sharing ? "inline-block" : "none"}`
    };
    return Object.entries(mutatedCssVariables).map(([key, value]) => `${key}: ${value};`).join("\n");
  }
  var init_css_variables = __esm({
    "src/libs/css-variables.ts"() {
      "use strict";
    }
  });
  function createElement(type, props, ...children) {
    if (typeof type === "function") {
      return children?.length ? type({ ...props, children }) : type(props);
    }
    const element = document.createElement(type);
    applyProperties(element, props ?? {});
    children?.forEach((child) => appendChild(element, child));
    return element;
  }
  function createFragment(arg) {
    const { children, ...props } = arg ?? { children: [] };
    const fragment = document.createDocumentFragment();
    Object.assign(fragment, props);
    children?.forEach((child) => appendChild(fragment, child));
    return fragment;
  }
  function isEventListener(key, value) {
    return key.startsWith("on") && typeof value === "function";
  }
  function applyProperties(element, props) {
    Object.entries(props).forEach(([key, value]) => {
      if (isEventListener(key, value)) {
        element.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (key === "style") {
        Object.assign(element.style, value);
      } else {
        const normKey = aliases[key] ?? key;
        element.setAttribute(normKey, String(value));
      }
    });
  }
  function appendChild(element, child) {
    if (Array.isArray(child)) {
      child.forEach((c) => appendChild(element, c));
    } else if (child instanceof DocumentFragment) {
      Array.from(child.children).forEach((c) => element.appendChild(c));
    } else if (child instanceof HTMLElement) {
      element.appendChild(child);
    } else if (child !== void 0 && child !== null && child !== false) {
      element.appendChild(document.createTextNode(String(child)));
    }
  }
  var aliases;
  var init_jsx_html = __esm({
    "src/libs/jsx-html.ts"() {
      "use strict";
      aliases = {
        className: "class",
        htmlFor: "for"
      };
    }
  });
  function handleTileClick(e, widgetUrl) {
    const ugcTiles = sdk.tiles.tiles;
    const clickedElement = e.target;
    const clickedTile = clickedElement.closest(".ugc-tile");
    if (!clickedTile) {
      throw new Error("Failed to find clicked tile");
    }
    const tileId = clickedTile.getAttribute("data-id");
    if (!tileId) {
      throw new Error("Failed to find tile ID");
    }
    const tileData = ugcTiles[tileId];
    const tileLink = widgetUrl || tileData.original_url || tileData.original_link;
    if (tileLink) {
      window.open(tileLink, "_blank");
    }
  }
  var init_tile_lib = __esm({
    "src/libs/tile.lib.ts"() {
      "use strict";
    }
  });
  function loadExpandSettingComponents() {
    const { show_shopspots, show_products, show_add_to_cart } = sdk.getExpandedTileConfig();
    if (show_shopspots) {
      sdk.addLoadedComponents(["shopspots"]);
    }
    sdk.addLoadedComponents(["expanded-tile"]);
    if (show_products) {
      sdk.addLoadedComponents(["products"]);
    }
    if (show_add_to_cart) {
      sdk.addLoadedComponents(["add-to-cart"]);
    }
  }
  var init_widget_components = __esm({
    "src/libs/widget.components.ts"() {
      "use strict";
    }
  });
  function addCSSVariablesToPlacement(cssVariables) {
    const shadowRoot = sdk.placement.getShadowRoot();
    const style = document.createElement("style");
    style.innerHTML = `
      :host {
          ${cssVariables}
      }`;
    shadowRoot.appendChild(style);
  }
  function isEnabled() {
    const { enabled } = sdk.getWidgetOptions();
    return enabled && hasMinimumTilesRequired();
  }
  function hasMinimumTilesRequired() {
    const { minimal_tiles } = sdk.getStyleConfig();
    const minimalTiles = parseInt(minimal_tiles);
    if (minimalTiles && minimalTiles > 0) {
      const tiles = sdk.querySelectorAll(".ugc-tile");
      if (tiles && tiles.length >= minimalTiles) {
        return true;
      }
      throw new Error(`Not enough tiles to render widget. Expected ${minimalTiles} but found ${tiles.length}`);
    }
    return true;
  }
  var init_widget_layout = __esm({
    "src/libs/widget.layout.ts"() {
      "use strict";
    }
  });
  function isObject(obj) {
    return obj !== null && typeof obj === "object" && "constructor" in obj && obj.constructor === Object;
  }
  function extend(target, src) {
    if (target === void 0) {
      target = {};
    }
    if (src === void 0) {
      src = {};
    }
    Object.keys(src).forEach((key) => {
      if (typeof target[key] === "undefined")
        target[key] = src[key];
      else if (isObject(src[key]) && isObject(target[key]) && Object.keys(src[key]).length > 0) {
        extend(target[key], src[key]);
      }
    });
  }
  function getDocument() {
    const doc = typeof document !== "undefined" ? document : {};
    extend(doc, ssrDocument);
    return doc;
  }
  function getWindow() {
    const win = typeof window !== "undefined" ? window : {};
    extend(win, ssrWindow);
    return win;
  }
  var ssrDocument;
  var ssrWindow;
  var init_ssr_window_esm = __esm({
    "../../node_modules/swiper/shared/ssr-window.esm.mjs"() {
      ssrDocument = {
        body: {},
        addEventListener() {
        },
        removeEventListener() {
        },
        activeElement: {
          blur() {
          },
          nodeName: ""
        },
        querySelector() {
          return null;
        },
        querySelectorAll() {
          return [];
        },
        getElementById() {
          return null;
        },
        createEvent() {
          return {
            initEvent() {
            }
          };
        },
        createElement() {
          return {
            children: [],
            childNodes: [],
            style: {},
            setAttribute() {
            },
            getElementsByTagName() {
              return [];
            }
          };
        },
        createElementNS() {
          return {};
        },
        importNode() {
          return null;
        },
        location: {
          hash: "",
          host: "",
          hostname: "",
          href: "",
          origin: "",
          pathname: "",
          protocol: "",
          search: ""
        }
      };
      ssrWindow = {
        document: ssrDocument,
        navigator: {
          userAgent: ""
        },
        location: {
          hash: "",
          host: "",
          hostname: "",
          href: "",
          origin: "",
          pathname: "",
          protocol: "",
          search: ""
        },
        history: {
          replaceState() {
          },
          pushState() {
          },
          go() {
          },
          back() {
          }
        },
        CustomEvent: function CustomEvent2() {
          return this;
        },
        addEventListener() {
        },
        removeEventListener() {
        },
        getComputedStyle() {
          return {
            getPropertyValue() {
              return "";
            }
          };
        },
        Image() {
        },
        Date() {
        },
        screen: {},
        setTimeout() {
        },
        clearTimeout() {
        },
        matchMedia() {
          return {};
        },
        requestAnimationFrame(callback) {
          if (typeof setTimeout === "undefined") {
            callback();
            return null;
          }
          return setTimeout(callback, 0);
        },
        cancelAnimationFrame(id) {
          if (typeof setTimeout === "undefined") {
            return;
          }
          clearTimeout(id);
        }
      };
    }
  });
  function classesToTokens(classes22) {
    if (classes22 === void 0) {
      classes22 = "";
    }
    return classes22.trim().split(" ").filter((c) => !!c.trim());
  }
  function deleteProps(obj) {
    const object = obj;
    Object.keys(object).forEach((key) => {
      try {
        object[key] = null;
      } catch (e) {
      }
      try {
        delete object[key];
      } catch (e) {
      }
    });
  }
  function nextTick(callback, delay) {
    if (delay === void 0) {
      delay = 0;
    }
    return setTimeout(callback, delay);
  }
  function now() {
    return Date.now();
  }
  function getComputedStyle2(el) {
    const window2 = getWindow();
    let style;
    if (window2.getComputedStyle) {
      style = window2.getComputedStyle(el, null);
    }
    if (!style && el.currentStyle) {
      style = el.currentStyle;
    }
    if (!style) {
      style = el.style;
    }
    return style;
  }
  function getTranslate(el, axis) {
    if (axis === void 0) {
      axis = "x";
    }
    const window2 = getWindow();
    let matrix;
    let curTransform;
    let transformMatrix;
    const curStyle = getComputedStyle2(el);
    if (window2.WebKitCSSMatrix) {
      curTransform = curStyle.transform || curStyle.webkitTransform;
      if (curTransform.split(",").length > 6) {
        curTransform = curTransform.split(", ").map((a) => a.replace(",", ".")).join(", ");
      }
      transformMatrix = new window2.WebKitCSSMatrix(curTransform === "none" ? "" : curTransform);
    } else {
      transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
      matrix = transformMatrix.toString().split(",");
    }
    if (axis === "x") {
      if (window2.WebKitCSSMatrix)
        curTransform = transformMatrix.m41;
      else if (matrix.length === 16)
        curTransform = parseFloat(matrix[12]);
      else
        curTransform = parseFloat(matrix[4]);
    }
    if (axis === "y") {
      if (window2.WebKitCSSMatrix)
        curTransform = transformMatrix.m42;
      else if (matrix.length === 16)
        curTransform = parseFloat(matrix[13]);
      else
        curTransform = parseFloat(matrix[5]);
    }
    return curTransform || 0;
  }
  function isObject2(o) {
    return typeof o === "object" && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === "Object";
  }
  function isNode(node) {
    if (typeof window !== "undefined" && typeof window.HTMLElement !== "undefined") {
      return node instanceof HTMLElement;
    }
    return node && (node.nodeType === 1 || node.nodeType === 11);
  }
  function extend2() {
    const to = Object(arguments.length <= 0 ? void 0 : arguments[0]);
    const noExtend = ["__proto__", "constructor", "prototype"];
    for (let i = 1; i < arguments.length; i += 1) {
      const nextSource = i < 0 || arguments.length <= i ? void 0 : arguments[i];
      if (nextSource !== void 0 && nextSource !== null && !isNode(nextSource)) {
        const keysArray = Object.keys(Object(nextSource)).filter((key) => noExtend.indexOf(key) < 0);
        for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
          const nextKey = keysArray[nextIndex];
          const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== void 0 && desc.enumerable) {
            if (isObject2(to[nextKey]) && isObject2(nextSource[nextKey])) {
              if (nextSource[nextKey].__swiper__) {
                to[nextKey] = nextSource[nextKey];
              } else {
                extend2(to[nextKey], nextSource[nextKey]);
              }
            } else if (!isObject2(to[nextKey]) && isObject2(nextSource[nextKey])) {
              to[nextKey] = {};
              if (nextSource[nextKey].__swiper__) {
                to[nextKey] = nextSource[nextKey];
              } else {
                extend2(to[nextKey], nextSource[nextKey]);
              }
            } else {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
    }
    return to;
  }
  function setCSSProperty(el, varName, varValue) {
    el.style.setProperty(varName, varValue);
  }
  function animateCSSModeScroll(_ref) {
    let {
      swiper,
      targetPosition,
      side
    } = _ref;
    const window2 = getWindow();
    const startPosition = -swiper.translate;
    let startTime = null;
    let time;
    const duration = swiper.params.speed;
    swiper.wrapperEl.style.scrollSnapType = "none";
    window2.cancelAnimationFrame(swiper.cssModeFrameID);
    const dir = targetPosition > startPosition ? "next" : "prev";
    const isOutOfBound = (current, target) => {
      return dir === "next" && current >= target || dir === "prev" && current <= target;
    };
    const animate = () => {
      time = (/* @__PURE__ */ new Date()).getTime();
      if (startTime === null) {
        startTime = time;
      }
      const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
      const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
      let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
      if (isOutOfBound(currentPosition, targetPosition)) {
        currentPosition = targetPosition;
      }
      swiper.wrapperEl.scrollTo({
        [side]: currentPosition
      });
      if (isOutOfBound(currentPosition, targetPosition)) {
        swiper.wrapperEl.style.overflow = "hidden";
        swiper.wrapperEl.style.scrollSnapType = "";
        setTimeout(() => {
          swiper.wrapperEl.style.overflow = "";
          swiper.wrapperEl.scrollTo({
            [side]: currentPosition
          });
        });
        window2.cancelAnimationFrame(swiper.cssModeFrameID);
        return;
      }
      swiper.cssModeFrameID = window2.requestAnimationFrame(animate);
    };
    animate();
  }
  function elementChildren(element, selector) {
    if (selector === void 0) {
      selector = "";
    }
    const children = [...element.children];
    if (element instanceof HTMLSlotElement) {
      children.push(...element.assignedElements());
    }
    if (!selector) {
      return children;
    }
    return children.filter((el) => el.matches(selector));
  }
  function elementIsChildOf(el, parent) {
    const isChild = parent.contains(el);
    if (!isChild && parent instanceof HTMLSlotElement) {
      const children = [...parent.assignedElements()];
      return children.includes(el);
    }
    return isChild;
  }
  function showWarning(text) {
    try {
      console.warn(text);
      return;
    } catch (err) {
    }
  }
  function createElement2(tag, classes22) {
    if (classes22 === void 0) {
      classes22 = [];
    }
    const el = document.createElement(tag);
    el.classList.add(...Array.isArray(classes22) ? classes22 : classesToTokens(classes22));
    return el;
  }
  function elementOffset(el) {
    const window2 = getWindow();
    const document2 = getDocument();
    const box = el.getBoundingClientRect();
    const body = document2.body;
    const clientTop = el.clientTop || body.clientTop || 0;
    const clientLeft = el.clientLeft || body.clientLeft || 0;
    const scrollTop = el === window2 ? window2.scrollY : el.scrollTop;
    const scrollLeft = el === window2 ? window2.scrollX : el.scrollLeft;
    return {
      top: box.top + scrollTop - clientTop,
      left: box.left + scrollLeft - clientLeft
    };
  }
  function elementPrevAll(el, selector) {
    const prevEls = [];
    while (el.previousElementSibling) {
      const prev = el.previousElementSibling;
      if (selector) {
        if (prev.matches(selector))
          prevEls.push(prev);
      } else
        prevEls.push(prev);
      el = prev;
    }
    return prevEls;
  }
  function elementNextAll(el, selector) {
    const nextEls = [];
    while (el.nextElementSibling) {
      const next = el.nextElementSibling;
      if (selector) {
        if (next.matches(selector))
          nextEls.push(next);
      } else
        nextEls.push(next);
      el = next;
    }
    return nextEls;
  }
  function elementStyle(el, prop) {
    const window2 = getWindow();
    return window2.getComputedStyle(el, null).getPropertyValue(prop);
  }
  function elementIndex(el) {
    let child = el;
    let i;
    if (child) {
      i = 0;
      while ((child = child.previousSibling) !== null) {
        if (child.nodeType === 1)
          i += 1;
      }
      return i;
    }
    return void 0;
  }
  function elementParents(el, selector) {
    const parents = [];
    let parent = el.parentElement;
    while (parent) {
      if (selector) {
        if (parent.matches(selector))
          parents.push(parent);
      } else {
        parents.push(parent);
      }
      parent = parent.parentElement;
    }
    return parents;
  }
  function elementOuterSize(el, size, includeMargins) {
    const window2 = getWindow();
    if (includeMargins) {
      return el[size === "width" ? "offsetWidth" : "offsetHeight"] + parseFloat(window2.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-right" : "margin-top")) + parseFloat(window2.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-left" : "margin-bottom"));
    }
    return el.offsetWidth;
  }
  function makeElementsArray(el) {
    return (Array.isArray(el) ? el : [el]).filter((e) => !!e);
  }
  var init_utils = __esm({
    "../../node_modules/swiper/shared/utils.mjs"() {
      init_ssr_window_esm();
    }
  });
  function calcSupport() {
    const window2 = getWindow();
    const document2 = getDocument();
    return {
      smoothScroll: document2.documentElement && document2.documentElement.style && "scrollBehavior" in document2.documentElement.style,
      touch: !!("ontouchstart" in window2 || window2.DocumentTouch && document2 instanceof window2.DocumentTouch)
    };
  }
  function getSupport() {
    if (!support) {
      support = calcSupport();
    }
    return support;
  }
  function calcDevice(_temp) {
    let {
      userAgent
    } = _temp === void 0 ? {} : _temp;
    const support22 = getSupport();
    const window2 = getWindow();
    const platform = window2.navigator.platform;
    const ua = userAgent || window2.navigator.userAgent;
    const device = {
      ios: false,
      android: false
    };
    const screenWidth2 = window2.screen.width;
    const screenHeight = window2.screen.height;
    const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
    const windows = platform === "Win32";
    let macos = platform === "MacIntel";
    const iPadScreens = ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"];
    if (!ipad && macos && support22.touch && iPadScreens.indexOf(`${screenWidth2}x${screenHeight}`) >= 0) {
      ipad = ua.match(/(Version)\/([\d.]+)/);
      if (!ipad)
        ipad = [0, 1, "13_0_0"];
      macos = false;
    }
    if (android && !windows) {
      device.os = "android";
      device.android = true;
    }
    if (ipad || iphone || ipod) {
      device.os = "ios";
      device.ios = true;
    }
    return device;
  }
  function getDevice(overrides) {
    if (overrides === void 0) {
      overrides = {};
    }
    if (!deviceCached) {
      deviceCached = calcDevice(overrides);
    }
    return deviceCached;
  }
  function calcBrowser() {
    const window2 = getWindow();
    const device = getDevice();
    let needPerspectiveFix = false;
    function isSafari() {
      const ua = window2.navigator.userAgent.toLowerCase();
      return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
    }
    if (isSafari()) {
      const ua = String(window2.navigator.userAgent);
      if (ua.includes("Version/")) {
        const [major, minor] = ua.split("Version/")[1].split(" ")[0].split(".").map((num) => Number(num));
        needPerspectiveFix = major < 16 || major === 16 && minor < 2;
      }
    }
    const isWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window2.navigator.userAgent);
    const isSafariBrowser = isSafari();
    const need3dFix = isSafariBrowser || isWebView && device.ios;
    return {
      isSafari: needPerspectiveFix || isSafariBrowser,
      needPerspectiveFix,
      need3dFix,
      isWebView
    };
  }
  function getBrowser() {
    if (!browser) {
      browser = calcBrowser();
    }
    return browser;
  }
  function Resize(_ref) {
    let {
      swiper,
      on,
      emit
    } = _ref;
    const window2 = getWindow();
    let observer = null;
    let animationFrame = null;
    const resizeHandler = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized)
        return;
      emit("beforeResize");
      emit("resize");
    };
    const createObserver = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized)
        return;
      observer = new ResizeObserver((entries) => {
        animationFrame = window2.requestAnimationFrame(() => {
          const {
            width,
            height
          } = swiper;
          let newWidth = width;
          let newHeight = height;
          entries.forEach((_ref2) => {
            let {
              contentBoxSize,
              contentRect,
              target
            } = _ref2;
            if (target && target !== swiper.el)
              return;
            newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
            newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
          });
          if (newWidth !== width || newHeight !== height) {
            resizeHandler();
          }
        });
      });
      observer.observe(swiper.el);
    };
    const removeObserver = () => {
      if (animationFrame) {
        window2.cancelAnimationFrame(animationFrame);
      }
      if (observer && observer.unobserve && swiper.el) {
        observer.unobserve(swiper.el);
        observer = null;
      }
    };
    const orientationChangeHandler = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized)
        return;
      emit("orientationchange");
    };
    on("init", () => {
      if (swiper.params.resizeObserver && typeof window2.ResizeObserver !== "undefined") {
        createObserver();
        return;
      }
      window2.addEventListener("resize", resizeHandler);
      window2.addEventListener("orientationchange", orientationChangeHandler);
    });
    on("destroy", () => {
      removeObserver();
      window2.removeEventListener("resize", resizeHandler);
      window2.removeEventListener("orientationchange", orientationChangeHandler);
    });
  }
  function Observer(_ref) {
    let {
      swiper,
      extendParams,
      on,
      emit
    } = _ref;
    const observers = [];
    const window2 = getWindow();
    const attach = function(target, options) {
      if (options === void 0) {
        options = {};
      }
      const ObserverFunc = window2.MutationObserver || window2.WebkitMutationObserver;
      const observer = new ObserverFunc((mutations) => {
        if (swiper.__preventObserver__)
          return;
        if (mutations.length === 1) {
          emit("observerUpdate", mutations[0]);
          return;
        }
        const observerUpdate = function observerUpdate2() {
          emit("observerUpdate", mutations[0]);
        };
        if (window2.requestAnimationFrame) {
          window2.requestAnimationFrame(observerUpdate);
        } else {
          window2.setTimeout(observerUpdate, 0);
        }
      });
      observer.observe(target, {
        attributes: typeof options.attributes === "undefined" ? true : options.attributes,
        childList: swiper.isElement || (typeof options.childList === "undefined" ? true : options).childList,
        characterData: typeof options.characterData === "undefined" ? true : options.characterData
      });
      observers.push(observer);
    };
    const init = () => {
      if (!swiper.params.observer)
        return;
      if (swiper.params.observeParents) {
        const containerParents = elementParents(swiper.hostEl);
        for (let i = 0; i < containerParents.length; i += 1) {
          attach(containerParents[i]);
        }
      }
      attach(swiper.hostEl, {
        childList: swiper.params.observeSlideChildren
      });
      attach(swiper.wrapperEl, {
        attributes: false
      });
    };
    const destroy = () => {
      observers.forEach((observer) => {
        observer.disconnect();
      });
      observers.splice(0, observers.length);
    };
    extendParams({
      observer: false,
      observeParents: false,
      observeSlideChildren: false
    });
    on("init", init);
    on("destroy", destroy);
  }
  function updateSize() {
    const swiper = this;
    let width;
    let height;
    const el = swiper.el;
    if (typeof swiper.params.width !== "undefined" && swiper.params.width !== null) {
      width = swiper.params.width;
    } else {
      width = el.clientWidth;
    }
    if (typeof swiper.params.height !== "undefined" && swiper.params.height !== null) {
      height = swiper.params.height;
    } else {
      height = el.clientHeight;
    }
    if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
      return;
    }
    width = width - parseInt(elementStyle(el, "padding-left") || 0, 10) - parseInt(elementStyle(el, "padding-right") || 0, 10);
    height = height - parseInt(elementStyle(el, "padding-top") || 0, 10) - parseInt(elementStyle(el, "padding-bottom") || 0, 10);
    if (Number.isNaN(width))
      width = 0;
    if (Number.isNaN(height))
      height = 0;
    Object.assign(swiper, {
      width,
      height,
      size: swiper.isHorizontal() ? width : height
    });
  }
  function updateSlides() {
    const swiper = this;
    function getDirectionPropertyValue(node, label) {
      return parseFloat(node.getPropertyValue(swiper.getDirectionLabel(label)) || 0);
    }
    const params = swiper.params;
    const {
      wrapperEl,
      slidesEl,
      size: swiperSize,
      rtlTranslate: rtl,
      wrongRTL
    } = swiper;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
    const slides = elementChildren(slidesEl, `.${swiper.params.slideClass}, swiper-slide`);
    const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
    let snapGrid = [];
    const slidesGrid = [];
    const slidesSizesGrid = [];
    let offsetBefore = params.slidesOffsetBefore;
    if (typeof offsetBefore === "function") {
      offsetBefore = params.slidesOffsetBefore.call(swiper);
    }
    let offsetAfter = params.slidesOffsetAfter;
    if (typeof offsetAfter === "function") {
      offsetAfter = params.slidesOffsetAfter.call(swiper);
    }
    const previousSnapGridLength = swiper.snapGrid.length;
    const previousSlidesGridLength = swiper.slidesGrid.length;
    let spaceBetween = params.spaceBetween;
    let slidePosition = -offsetBefore;
    let prevSlideSize = 0;
    let index = 0;
    if (typeof swiperSize === "undefined") {
      return;
    }
    if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
      spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
    } else if (typeof spaceBetween === "string") {
      spaceBetween = parseFloat(spaceBetween);
    }
    swiper.virtualSize = -spaceBetween;
    slides.forEach((slideEl) => {
      if (rtl) {
        slideEl.style.marginLeft = "";
      } else {
        slideEl.style.marginRight = "";
      }
      slideEl.style.marginBottom = "";
      slideEl.style.marginTop = "";
    });
    if (params.centeredSlides && params.cssMode) {
      setCSSProperty(wrapperEl, "--swiper-centered-offset-before", "");
      setCSSProperty(wrapperEl, "--swiper-centered-offset-after", "");
    }
    const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
    if (gridEnabled) {
      swiper.grid.initSlides(slides);
    } else if (swiper.grid) {
      swiper.grid.unsetSlides();
    }
    let slideSize;
    const shouldResetSlideSize = params.slidesPerView === "auto" && params.breakpoints && Object.keys(params.breakpoints).filter((key) => {
      return typeof params.breakpoints[key].slidesPerView !== "undefined";
    }).length > 0;
    for (let i = 0; i < slidesLength; i += 1) {
      slideSize = 0;
      let slide22;
      if (slides[i])
        slide22 = slides[i];
      if (gridEnabled) {
        swiper.grid.updateSlide(i, slide22, slides);
      }
      if (slides[i] && elementStyle(slide22, "display") === "none")
        continue;
      if (params.slidesPerView === "auto") {
        if (shouldResetSlideSize) {
          slides[i].style[swiper.getDirectionLabel("width")] = ``;
        }
        const slideStyles = getComputedStyle(slide22);
        const currentTransform = slide22.style.transform;
        const currentWebKitTransform = slide22.style.webkitTransform;
        if (currentTransform) {
          slide22.style.transform = "none";
        }
        if (currentWebKitTransform) {
          slide22.style.webkitTransform = "none";
        }
        if (params.roundLengths) {
          slideSize = swiper.isHorizontal() ? elementOuterSize(slide22, "width", true) : elementOuterSize(slide22, "height", true);
        } else {
          const width = getDirectionPropertyValue(slideStyles, "width");
          const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
          const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
          const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
          const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
          const boxSizing = slideStyles.getPropertyValue("box-sizing");
          if (boxSizing && boxSizing === "border-box") {
            slideSize = width + marginLeft + marginRight;
          } else {
            const {
              clientWidth,
              offsetWidth
            } = slide22;
            slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
          }
        }
        if (currentTransform) {
          slide22.style.transform = currentTransform;
        }
        if (currentWebKitTransform) {
          slide22.style.webkitTransform = currentWebKitTransform;
        }
        if (params.roundLengths)
          slideSize = Math.floor(slideSize);
      } else {
        slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
        if (params.roundLengths)
          slideSize = Math.floor(slideSize);
        if (slides[i]) {
          slides[i].style[swiper.getDirectionLabel("width")] = `${slideSize}px`;
        }
      }
      if (slides[i]) {
        slides[i].swiperSlideSize = slideSize;
      }
      slidesSizesGrid.push(slideSize);
      if (params.centeredSlides) {
        slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
        if (prevSlideSize === 0 && i !== 0)
          slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
        if (i === 0)
          slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
        if (Math.abs(slidePosition) < 1 / 1e3)
          slidePosition = 0;
        if (params.roundLengths)
          slidePosition = Math.floor(slidePosition);
        if (index % params.slidesPerGroup === 0)
          snapGrid.push(slidePosition);
        slidesGrid.push(slidePosition);
      } else {
        if (params.roundLengths)
          slidePosition = Math.floor(slidePosition);
        if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0)
          snapGrid.push(slidePosition);
        slidesGrid.push(slidePosition);
        slidePosition = slidePosition + slideSize + spaceBetween;
      }
      swiper.virtualSize += slideSize + spaceBetween;
      prevSlideSize = slideSize;
      index += 1;
    }
    swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
    if (rtl && wrongRTL && (params.effect === "slide" || params.effect === "coverflow")) {
      wrapperEl.style.width = `${swiper.virtualSize + spaceBetween}px`;
    }
    if (params.setWrapperSize) {
      wrapperEl.style[swiper.getDirectionLabel("width")] = `${swiper.virtualSize + spaceBetween}px`;
    }
    if (gridEnabled) {
      swiper.grid.updateWrapperSize(slideSize, snapGrid);
    }
    if (!params.centeredSlides) {
      const newSlidesGrid = [];
      for (let i = 0; i < snapGrid.length; i += 1) {
        let slidesGridItem = snapGrid[i];
        if (params.roundLengths)
          slidesGridItem = Math.floor(slidesGridItem);
        if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
          newSlidesGrid.push(slidesGridItem);
        }
      }
      snapGrid = newSlidesGrid;
      if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
        snapGrid.push(swiper.virtualSize - swiperSize);
      }
    }
    if (isVirtual && params.loop) {
      const size = slidesSizesGrid[0] + spaceBetween;
      if (params.slidesPerGroup > 1) {
        const groups = Math.ceil((swiper.virtual.slidesBefore + swiper.virtual.slidesAfter) / params.slidesPerGroup);
        const groupSize = size * params.slidesPerGroup;
        for (let i = 0; i < groups; i += 1) {
          snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
        }
      }
      for (let i = 0; i < swiper.virtual.slidesBefore + swiper.virtual.slidesAfter; i += 1) {
        if (params.slidesPerGroup === 1) {
          snapGrid.push(snapGrid[snapGrid.length - 1] + size);
        }
        slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size);
        swiper.virtualSize += size;
      }
    }
    if (snapGrid.length === 0)
      snapGrid = [0];
    if (spaceBetween !== 0) {
      const key = swiper.isHorizontal() && rtl ? "marginLeft" : swiper.getDirectionLabel("marginRight");
      slides.filter((_, slideIndex) => {
        if (!params.cssMode || params.loop)
          return true;
        if (slideIndex === slides.length - 1) {
          return false;
        }
        return true;
      }).forEach((slideEl) => {
        slideEl.style[key] = `${spaceBetween}px`;
      });
    }
    if (params.centeredSlides && params.centeredSlidesBounds) {
      let allSlidesSize = 0;
      slidesSizesGrid.forEach((slideSizeValue) => {
        allSlidesSize += slideSizeValue + (spaceBetween || 0);
      });
      allSlidesSize -= spaceBetween;
      const maxSnap = allSlidesSize > swiperSize ? allSlidesSize - swiperSize : 0;
      snapGrid = snapGrid.map((snap) => {
        if (snap <= 0)
          return -offsetBefore;
        if (snap > maxSnap)
          return maxSnap + offsetAfter;
        return snap;
      });
    }
    if (params.centerInsufficientSlides) {
      let allSlidesSize = 0;
      slidesSizesGrid.forEach((slideSizeValue) => {
        allSlidesSize += slideSizeValue + (spaceBetween || 0);
      });
      allSlidesSize -= spaceBetween;
      const offsetSize = (params.slidesOffsetBefore || 0) + (params.slidesOffsetAfter || 0);
      if (allSlidesSize + offsetSize < swiperSize) {
        const allSlidesOffset = (swiperSize - allSlidesSize - offsetSize) / 2;
        snapGrid.forEach((snap, snapIndex) => {
          snapGrid[snapIndex] = snap - allSlidesOffset;
        });
        slidesGrid.forEach((snap, snapIndex) => {
          slidesGrid[snapIndex] = snap + allSlidesOffset;
        });
      }
    }
    Object.assign(swiper, {
      slides,
      snapGrid,
      slidesGrid,
      slidesSizesGrid
    });
    if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
      setCSSProperty(wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
      setCSSProperty(wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
      const addToSnapGrid = -swiper.snapGrid[0];
      const addToSlidesGrid = -swiper.slidesGrid[0];
      swiper.snapGrid = swiper.snapGrid.map((v) => v + addToSnapGrid);
      swiper.slidesGrid = swiper.slidesGrid.map((v) => v + addToSlidesGrid);
    }
    if (slidesLength !== previousSlidesLength) {
      swiper.emit("slidesLengthChange");
    }
    if (snapGrid.length !== previousSnapGridLength) {
      if (swiper.params.watchOverflow)
        swiper.checkOverflow();
      swiper.emit("snapGridLengthChange");
    }
    if (slidesGrid.length !== previousSlidesGridLength) {
      swiper.emit("slidesGridLengthChange");
    }
    if (params.watchSlidesProgress) {
      swiper.updateSlidesOffset();
    }
    swiper.emit("slidesUpdated");
    if (!isVirtual && !params.cssMode && (params.effect === "slide" || params.effect === "fade")) {
      const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
      const hasClassBackfaceClassAdded = swiper.el.classList.contains(backFaceHiddenClass);
      if (slidesLength <= params.maxBackfaceHiddenSlides) {
        if (!hasClassBackfaceClassAdded)
          swiper.el.classList.add(backFaceHiddenClass);
      } else if (hasClassBackfaceClassAdded) {
        swiper.el.classList.remove(backFaceHiddenClass);
      }
    }
  }
  function updateAutoHeight(speed) {
    const swiper = this;
    const activeSlides = [];
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    let newHeight = 0;
    let i;
    if (typeof speed === "number") {
      swiper.setTransition(speed);
    } else if (speed === true) {
      swiper.setTransition(swiper.params.speed);
    }
    const getSlideByIndex = (index) => {
      if (isVirtual) {
        return swiper.slides[swiper.getSlideIndexByData(index)];
      }
      return swiper.slides[index];
    };
    if (swiper.params.slidesPerView !== "auto" && swiper.params.slidesPerView > 1) {
      if (swiper.params.centeredSlides) {
        (swiper.visibleSlides || []).forEach((slide22) => {
          activeSlides.push(slide22);
        });
      } else {
        for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
          const index = swiper.activeIndex + i;
          if (index > swiper.slides.length && !isVirtual)
            break;
          activeSlides.push(getSlideByIndex(index));
        }
      }
    } else {
      activeSlides.push(getSlideByIndex(swiper.activeIndex));
    }
    for (i = 0; i < activeSlides.length; i += 1) {
      if (typeof activeSlides[i] !== "undefined") {
        const height = activeSlides[i].offsetHeight;
        newHeight = height > newHeight ? height : newHeight;
      }
    }
    if (newHeight || newHeight === 0)
      swiper.wrapperEl.style.height = `${newHeight}px`;
  }
  function updateSlidesOffset() {
    const swiper = this;
    const slides = swiper.slides;
    const minusOffset = swiper.isElement ? swiper.isHorizontal() ? swiper.wrapperEl.offsetLeft : swiper.wrapperEl.offsetTop : 0;
    for (let i = 0; i < slides.length; i += 1) {
      slides[i].swiperSlideOffset = (swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop) - minusOffset - swiper.cssOverflowAdjustment();
    }
  }
  function updateSlidesProgress(translate22) {
    if (translate22 === void 0) {
      translate22 = this && this.translate || 0;
    }
    const swiper = this;
    const params = swiper.params;
    const {
      slides,
      rtlTranslate: rtl,
      snapGrid
    } = swiper;
    if (slides.length === 0)
      return;
    if (typeof slides[0].swiperSlideOffset === "undefined")
      swiper.updateSlidesOffset();
    let offsetCenter = -translate22;
    if (rtl)
      offsetCenter = translate22;
    swiper.visibleSlidesIndexes = [];
    swiper.visibleSlides = [];
    let spaceBetween = params.spaceBetween;
    if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
      spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiper.size;
    } else if (typeof spaceBetween === "string") {
      spaceBetween = parseFloat(spaceBetween);
    }
    for (let i = 0; i < slides.length; i += 1) {
      const slide22 = slides[i];
      let slideOffset = slide22.swiperSlideOffset;
      if (params.cssMode && params.centeredSlides) {
        slideOffset -= slides[0].swiperSlideOffset;
      }
      const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide22.swiperSlideSize + spaceBetween);
      const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide22.swiperSlideSize + spaceBetween);
      const slideBefore = -(offsetCenter - slideOffset);
      const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
      const isFullyVisible = slideBefore >= 0 && slideBefore <= swiper.size - swiper.slidesSizesGrid[i];
      const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
      if (isVisible) {
        swiper.visibleSlides.push(slide22);
        swiper.visibleSlidesIndexes.push(i);
      }
      toggleSlideClasses$1(slide22, isVisible, params.slideVisibleClass);
      toggleSlideClasses$1(slide22, isFullyVisible, params.slideFullyVisibleClass);
      slide22.progress = rtl ? -slideProgress : slideProgress;
      slide22.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
    }
  }
  function updateProgress(translate22) {
    const swiper = this;
    if (typeof translate22 === "undefined") {
      const multiplier = swiper.rtlTranslate ? -1 : 1;
      translate22 = swiper && swiper.translate && swiper.translate * multiplier || 0;
    }
    const params = swiper.params;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    let {
      progress,
      isBeginning,
      isEnd,
      progressLoop
    } = swiper;
    const wasBeginning = isBeginning;
    const wasEnd = isEnd;
    if (translatesDiff === 0) {
      progress = 0;
      isBeginning = true;
      isEnd = true;
    } else {
      progress = (translate22 - swiper.minTranslate()) / translatesDiff;
      const isBeginningRounded = Math.abs(translate22 - swiper.minTranslate()) < 1;
      const isEndRounded = Math.abs(translate22 - swiper.maxTranslate()) < 1;
      isBeginning = isBeginningRounded || progress <= 0;
      isEnd = isEndRounded || progress >= 1;
      if (isBeginningRounded)
        progress = 0;
      if (isEndRounded)
        progress = 1;
    }
    if (params.loop) {
      const firstSlideIndex = swiper.getSlideIndexByData(0);
      const lastSlideIndex = swiper.getSlideIndexByData(swiper.slides.length - 1);
      const firstSlideTranslate = swiper.slidesGrid[firstSlideIndex];
      const lastSlideTranslate = swiper.slidesGrid[lastSlideIndex];
      const translateMax = swiper.slidesGrid[swiper.slidesGrid.length - 1];
      const translateAbs = Math.abs(translate22);
      if (translateAbs >= firstSlideTranslate) {
        progressLoop = (translateAbs - firstSlideTranslate) / translateMax;
      } else {
        progressLoop = (translateAbs + translateMax - lastSlideTranslate) / translateMax;
      }
      if (progressLoop > 1)
        progressLoop -= 1;
    }
    Object.assign(swiper, {
      progress,
      progressLoop,
      isBeginning,
      isEnd
    });
    if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight)
      swiper.updateSlidesProgress(translate22);
    if (isBeginning && !wasBeginning) {
      swiper.emit("reachBeginning toEdge");
    }
    if (isEnd && !wasEnd) {
      swiper.emit("reachEnd toEdge");
    }
    if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
      swiper.emit("fromEdge");
    }
    swiper.emit("progress", progress);
  }
  function updateSlidesClasses() {
    const swiper = this;
    const {
      slides,
      params,
      slidesEl,
      activeIndex
    } = swiper;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
    const getFilteredSlide = (selector) => {
      return elementChildren(slidesEl, `.${params.slideClass}${selector}, swiper-slide${selector}`)[0];
    };
    let activeSlide;
    let prevSlide;
    let nextSlide;
    if (isVirtual) {
      if (params.loop) {
        let slideIndex = activeIndex - swiper.virtual.slidesBefore;
        if (slideIndex < 0)
          slideIndex = swiper.virtual.slides.length + slideIndex;
        if (slideIndex >= swiper.virtual.slides.length)
          slideIndex -= swiper.virtual.slides.length;
        activeSlide = getFilteredSlide(`[data-swiper-slide-index="${slideIndex}"]`);
      } else {
        activeSlide = getFilteredSlide(`[data-swiper-slide-index="${activeIndex}"]`);
      }
    } else {
      if (gridEnabled) {
        activeSlide = slides.filter((slideEl) => slideEl.column === activeIndex)[0];
        nextSlide = slides.filter((slideEl) => slideEl.column === activeIndex + 1)[0];
        prevSlide = slides.filter((slideEl) => slideEl.column === activeIndex - 1)[0];
      } else {
        activeSlide = slides[activeIndex];
      }
    }
    if (activeSlide) {
      if (!gridEnabled) {
        nextSlide = elementNextAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
        if (params.loop && !nextSlide) {
          nextSlide = slides[0];
        }
        prevSlide = elementPrevAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
        if (params.loop && !prevSlide === 0) {
          prevSlide = slides[slides.length - 1];
        }
      }
    }
    slides.forEach((slideEl) => {
      toggleSlideClasses(slideEl, slideEl === activeSlide, params.slideActiveClass);
      toggleSlideClasses(slideEl, slideEl === nextSlide, params.slideNextClass);
      toggleSlideClasses(slideEl, slideEl === prevSlide, params.slidePrevClass);
    });
    swiper.emitSlidesClasses();
  }
  function getActiveIndexByTranslate(swiper) {
    const {
      slidesGrid,
      params
    } = swiper;
    const translate22 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
    let activeIndex;
    for (let i = 0; i < slidesGrid.length; i += 1) {
      if (typeof slidesGrid[i + 1] !== "undefined") {
        if (translate22 >= slidesGrid[i] && translate22 < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
          activeIndex = i;
        } else if (translate22 >= slidesGrid[i] && translate22 < slidesGrid[i + 1]) {
          activeIndex = i + 1;
        }
      } else if (translate22 >= slidesGrid[i]) {
        activeIndex = i;
      }
    }
    if (params.normalizeSlideIndex) {
      if (activeIndex < 0 || typeof activeIndex === "undefined")
        activeIndex = 0;
    }
    return activeIndex;
  }
  function updateActiveIndex(newActiveIndex) {
    const swiper = this;
    const translate22 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
    const {
      snapGrid,
      params,
      activeIndex: previousIndex,
      realIndex: previousRealIndex,
      snapIndex: previousSnapIndex
    } = swiper;
    let activeIndex = newActiveIndex;
    let snapIndex;
    const getVirtualRealIndex = (aIndex) => {
      let realIndex2 = aIndex - swiper.virtual.slidesBefore;
      if (realIndex2 < 0) {
        realIndex2 = swiper.virtual.slides.length + realIndex2;
      }
      if (realIndex2 >= swiper.virtual.slides.length) {
        realIndex2 -= swiper.virtual.slides.length;
      }
      return realIndex2;
    };
    if (typeof activeIndex === "undefined") {
      activeIndex = getActiveIndexByTranslate(swiper);
    }
    if (snapGrid.indexOf(translate22) >= 0) {
      snapIndex = snapGrid.indexOf(translate22);
    } else {
      const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
      snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
    }
    if (snapIndex >= snapGrid.length)
      snapIndex = snapGrid.length - 1;
    if (activeIndex === previousIndex && !swiper.params.loop) {
      if (snapIndex !== previousSnapIndex) {
        swiper.snapIndex = snapIndex;
        swiper.emit("snapIndexChange");
      }
      return;
    }
    if (activeIndex === previousIndex && swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
      swiper.realIndex = getVirtualRealIndex(activeIndex);
      return;
    }
    const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
    let realIndex;
    if (swiper.virtual && params.virtual.enabled && params.loop) {
      realIndex = getVirtualRealIndex(activeIndex);
    } else if (gridEnabled) {
      const firstSlideInColumn = swiper.slides.filter((slideEl) => slideEl.column === activeIndex)[0];
      let activeSlideIndex = parseInt(firstSlideInColumn.getAttribute("data-swiper-slide-index"), 10);
      if (Number.isNaN(activeSlideIndex)) {
        activeSlideIndex = Math.max(swiper.slides.indexOf(firstSlideInColumn), 0);
      }
      realIndex = Math.floor(activeSlideIndex / params.grid.rows);
    } else if (swiper.slides[activeIndex]) {
      const slideIndex = swiper.slides[activeIndex].getAttribute("data-swiper-slide-index");
      if (slideIndex) {
        realIndex = parseInt(slideIndex, 10);
      } else {
        realIndex = activeIndex;
      }
    } else {
      realIndex = activeIndex;
    }
    Object.assign(swiper, {
      previousSnapIndex,
      snapIndex,
      previousRealIndex,
      realIndex,
      previousIndex,
      activeIndex
    });
    if (swiper.initialized) {
      preload(swiper);
    }
    swiper.emit("activeIndexChange");
    swiper.emit("snapIndexChange");
    if (swiper.initialized || swiper.params.runCallbacksOnInit) {
      if (previousRealIndex !== realIndex) {
        swiper.emit("realIndexChange");
      }
      swiper.emit("slideChange");
    }
  }
  function updateClickedSlide(el, path) {
    const swiper = this;
    const params = swiper.params;
    let slide22 = el.closest(`.${params.slideClass}, swiper-slide`);
    if (!slide22 && swiper.isElement && path && path.length > 1 && path.includes(el)) {
      [...path.slice(path.indexOf(el) + 1, path.length)].forEach((pathEl) => {
        if (!slide22 && pathEl.matches && pathEl.matches(`.${params.slideClass}, swiper-slide`)) {
          slide22 = pathEl;
        }
      });
    }
    let slideFound = false;
    let slideIndex;
    if (slide22) {
      for (let i = 0; i < swiper.slides.length; i += 1) {
        if (swiper.slides[i] === slide22) {
          slideFound = true;
          slideIndex = i;
          break;
        }
      }
    }
    if (slide22 && slideFound) {
      swiper.clickedSlide = slide22;
      if (swiper.virtual && swiper.params.virtual.enabled) {
        swiper.clickedIndex = parseInt(slide22.getAttribute("data-swiper-slide-index"), 10);
      } else {
        swiper.clickedIndex = slideIndex;
      }
    } else {
      swiper.clickedSlide = void 0;
      swiper.clickedIndex = void 0;
      return;
    }
    if (params.slideToClickedSlide && swiper.clickedIndex !== void 0 && swiper.clickedIndex !== swiper.activeIndex) {
      swiper.slideToClickedSlide();
    }
  }
  function getSwiperTranslate(axis) {
    if (axis === void 0) {
      axis = this.isHorizontal() ? "x" : "y";
    }
    const swiper = this;
    const {
      params,
      rtlTranslate: rtl,
      translate: translate22,
      wrapperEl
    } = swiper;
    if (params.virtualTranslate) {
      return rtl ? -translate22 : translate22;
    }
    if (params.cssMode) {
      return translate22;
    }
    let currentTranslate = getTranslate(wrapperEl, axis);
    currentTranslate += swiper.cssOverflowAdjustment();
    if (rtl)
      currentTranslate = -currentTranslate;
    return currentTranslate || 0;
  }
  function setTranslate(translate22, byController) {
    const swiper = this;
    const {
      rtlTranslate: rtl,
      params,
      wrapperEl,
      progress
    } = swiper;
    let x = 0;
    let y = 0;
    const z = 0;
    if (swiper.isHorizontal()) {
      x = rtl ? -translate22 : translate22;
    } else {
      y = translate22;
    }
    if (params.roundLengths) {
      x = Math.floor(x);
      y = Math.floor(y);
    }
    swiper.previousTranslate = swiper.translate;
    swiper.translate = swiper.isHorizontal() ? x : y;
    if (params.cssMode) {
      wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y;
    } else if (!params.virtualTranslate) {
      if (swiper.isHorizontal()) {
        x -= swiper.cssOverflowAdjustment();
      } else {
        y -= swiper.cssOverflowAdjustment();
      }
      wrapperEl.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
    }
    let newProgress;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    if (translatesDiff === 0) {
      newProgress = 0;
    } else {
      newProgress = (translate22 - swiper.minTranslate()) / translatesDiff;
    }
    if (newProgress !== progress) {
      swiper.updateProgress(translate22);
    }
    swiper.emit("setTranslate", swiper.translate, byController);
  }
  function minTranslate() {
    return -this.snapGrid[0];
  }
  function maxTranslate() {
    return -this.snapGrid[this.snapGrid.length - 1];
  }
  function translateTo(translate22, speed, runCallbacks, translateBounds, internal) {
    if (translate22 === void 0) {
      translate22 = 0;
    }
    if (speed === void 0) {
      speed = this.params.speed;
    }
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    if (translateBounds === void 0) {
      translateBounds = true;
    }
    const swiper = this;
    const {
      params,
      wrapperEl
    } = swiper;
    if (swiper.animating && params.preventInteractionOnTransition) {
      return false;
    }
    const minTranslate22 = swiper.minTranslate();
    const maxTranslate22 = swiper.maxTranslate();
    let newTranslate;
    if (translateBounds && translate22 > minTranslate22)
      newTranslate = minTranslate22;
    else if (translateBounds && translate22 < maxTranslate22)
      newTranslate = maxTranslate22;
    else
      newTranslate = translate22;
    swiper.updateProgress(newTranslate);
    if (params.cssMode) {
      const isH = swiper.isHorizontal();
      if (speed === 0) {
        wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate;
      } else {
        if (!swiper.support.smoothScroll) {
          animateCSSModeScroll({
            swiper,
            targetPosition: -newTranslate,
            side: isH ? "left" : "top"
          });
          return true;
        }
        wrapperEl.scrollTo({
          [isH ? "left" : "top"]: -newTranslate,
          behavior: "smooth"
        });
      }
      return true;
    }
    if (speed === 0) {
      swiper.setTransition(0);
      swiper.setTranslate(newTranslate);
      if (runCallbacks) {
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.emit("transitionEnd");
      }
    } else {
      swiper.setTransition(speed);
      swiper.setTranslate(newTranslate);
      if (runCallbacks) {
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.emit("transitionStart");
      }
      if (!swiper.animating) {
        swiper.animating = true;
        if (!swiper.onTranslateToWrapperTransitionEnd) {
          swiper.onTranslateToWrapperTransitionEnd = function transitionEnd22(e) {
            if (!swiper || swiper.destroyed)
              return;
            if (e.target !== this)
              return;
            swiper.wrapperEl.removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
            swiper.onTranslateToWrapperTransitionEnd = null;
            delete swiper.onTranslateToWrapperTransitionEnd;
            swiper.animating = false;
            if (runCallbacks) {
              swiper.emit("transitionEnd");
            }
          };
        }
        swiper.wrapperEl.addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
      }
    }
    return true;
  }
  function setTransition(duration, byController) {
    const swiper = this;
    if (!swiper.params.cssMode) {
      swiper.wrapperEl.style.transitionDuration = `${duration}ms`;
      swiper.wrapperEl.style.transitionDelay = duration === 0 ? `0ms` : "";
    }
    swiper.emit("setTransition", duration, byController);
  }
  function transitionEmit(_ref) {
    let {
      swiper,
      runCallbacks,
      direction,
      step
    } = _ref;
    const {
      activeIndex,
      previousIndex
    } = swiper;
    let dir = direction;
    if (!dir) {
      if (activeIndex > previousIndex)
        dir = "next";
      else if (activeIndex < previousIndex)
        dir = "prev";
      else
        dir = "reset";
    }
    swiper.emit(`transition${step}`);
    if (runCallbacks && activeIndex !== previousIndex) {
      if (dir === "reset") {
        swiper.emit(`slideResetTransition${step}`);
        return;
      }
      swiper.emit(`slideChangeTransition${step}`);
      if (dir === "next") {
        swiper.emit(`slideNextTransition${step}`);
      } else {
        swiper.emit(`slidePrevTransition${step}`);
      }
    }
  }
  function transitionStart(runCallbacks, direction) {
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    const swiper = this;
    const {
      params
    } = swiper;
    if (params.cssMode)
      return;
    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }
    transitionEmit({
      swiper,
      runCallbacks,
      direction,
      step: "Start"
    });
  }
  function transitionEnd(runCallbacks, direction) {
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    const swiper = this;
    const {
      params
    } = swiper;
    swiper.animating = false;
    if (params.cssMode)
      return;
    swiper.setTransition(0);
    transitionEmit({
      swiper,
      runCallbacks,
      direction,
      step: "End"
    });
  }
  function slideTo(index, speed, runCallbacks, internal, initial) {
    if (index === void 0) {
      index = 0;
    }
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    if (typeof index === "string") {
      index = parseInt(index, 10);
    }
    const swiper = this;
    let slideIndex = index;
    if (slideIndex < 0)
      slideIndex = 0;
    const {
      params,
      snapGrid,
      slidesGrid,
      previousIndex,
      activeIndex,
      rtlTranslate: rtl,
      wrapperEl,
      enabled
    } = swiper;
    if (!enabled && !internal && !initial || swiper.destroyed || swiper.animating && params.preventInteractionOnTransition) {
      return false;
    }
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
    let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
    if (snapIndex >= snapGrid.length)
      snapIndex = snapGrid.length - 1;
    const translate22 = -snapGrid[snapIndex];
    if (params.normalizeSlideIndex) {
      for (let i = 0; i < slidesGrid.length; i += 1) {
        const normalizedTranslate = -Math.floor(translate22 * 100);
        const normalizedGrid = Math.floor(slidesGrid[i] * 100);
        const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);
        if (typeof slidesGrid[i + 1] !== "undefined") {
          if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
            slideIndex = i;
          } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
            slideIndex = i + 1;
          }
        } else if (normalizedTranslate >= normalizedGrid) {
          slideIndex = i;
        }
      }
    }
    if (swiper.initialized && slideIndex !== activeIndex) {
      if (!swiper.allowSlideNext && (rtl ? translate22 > swiper.translate && translate22 > swiper.minTranslate() : translate22 < swiper.translate && translate22 < swiper.minTranslate())) {
        return false;
      }
      if (!swiper.allowSlidePrev && translate22 > swiper.translate && translate22 > swiper.maxTranslate()) {
        if ((activeIndex || 0) !== slideIndex) {
          return false;
        }
      }
    }
    if (slideIndex !== (previousIndex || 0) && runCallbacks) {
      swiper.emit("beforeSlideChangeStart");
    }
    swiper.updateProgress(translate22);
    let direction;
    if (slideIndex > activeIndex)
      direction = "next";
    else if (slideIndex < activeIndex)
      direction = "prev";
    else
      direction = "reset";
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    const isInitialVirtual = isVirtual && initial;
    if (!isInitialVirtual && (rtl && -translate22 === swiper.translate || !rtl && translate22 === swiper.translate)) {
      swiper.updateActiveIndex(slideIndex);
      if (params.autoHeight) {
        swiper.updateAutoHeight();
      }
      swiper.updateSlidesClasses();
      if (params.effect !== "slide") {
        swiper.setTranslate(translate22);
      }
      if (direction !== "reset") {
        swiper.transitionStart(runCallbacks, direction);
        swiper.transitionEnd(runCallbacks, direction);
      }
      return false;
    }
    if (params.cssMode) {
      const isH = swiper.isHorizontal();
      const t = rtl ? translate22 : -translate22;
      if (speed === 0) {
        if (isVirtual) {
          swiper.wrapperEl.style.scrollSnapType = "none";
          swiper._immediateVirtual = true;
        }
        if (isVirtual && !swiper._cssModeVirtualInitialSet && swiper.params.initialSlide > 0) {
          swiper._cssModeVirtualInitialSet = true;
          requestAnimationFrame(() => {
            wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
          });
        } else {
          wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
        }
        if (isVirtual) {
          requestAnimationFrame(() => {
            swiper.wrapperEl.style.scrollSnapType = "";
            swiper._immediateVirtual = false;
          });
        }
      } else {
        if (!swiper.support.smoothScroll) {
          animateCSSModeScroll({
            swiper,
            targetPosition: t,
            side: isH ? "left" : "top"
          });
          return true;
        }
        wrapperEl.scrollTo({
          [isH ? "left" : "top"]: t,
          behavior: "smooth"
        });
      }
      return true;
    }
    swiper.setTransition(speed);
    swiper.setTranslate(translate22);
    swiper.updateActiveIndex(slideIndex);
    swiper.updateSlidesClasses();
    swiper.emit("beforeTransitionStart", speed, internal);
    swiper.transitionStart(runCallbacks, direction);
    if (speed === 0) {
      swiper.transitionEnd(runCallbacks, direction);
    } else if (!swiper.animating) {
      swiper.animating = true;
      if (!swiper.onSlideToWrapperTransitionEnd) {
        swiper.onSlideToWrapperTransitionEnd = function transitionEnd22(e) {
          if (!swiper || swiper.destroyed)
            return;
          if (e.target !== this)
            return;
          swiper.wrapperEl.removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
          swiper.onSlideToWrapperTransitionEnd = null;
          delete swiper.onSlideToWrapperTransitionEnd;
          swiper.transitionEnd(runCallbacks, direction);
        };
      }
      swiper.wrapperEl.addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
    }
    return true;
  }
  function slideToLoop(index, speed, runCallbacks, internal) {
    if (index === void 0) {
      index = 0;
    }
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    if (typeof index === "string") {
      const indexAsNumber = parseInt(index, 10);
      index = indexAsNumber;
    }
    const swiper = this;
    if (swiper.destroyed)
      return;
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    const gridEnabled = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
    let newIndex = index;
    if (swiper.params.loop) {
      if (swiper.virtual && swiper.params.virtual.enabled) {
        newIndex = newIndex + swiper.virtual.slidesBefore;
      } else {
        let targetSlideIndex;
        if (gridEnabled) {
          const slideIndex = newIndex * swiper.params.grid.rows;
          targetSlideIndex = swiper.slides.filter((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex)[0].column;
        } else {
          targetSlideIndex = swiper.getSlideIndexByData(newIndex);
        }
        const cols = gridEnabled ? Math.ceil(swiper.slides.length / swiper.params.grid.rows) : swiper.slides.length;
        const {
          centeredSlides
        } = swiper.params;
        let slidesPerView = swiper.params.slidesPerView;
        if (slidesPerView === "auto") {
          slidesPerView = swiper.slidesPerViewDynamic();
        } else {
          slidesPerView = Math.ceil(parseFloat(swiper.params.slidesPerView, 10));
          if (centeredSlides && slidesPerView % 2 === 0) {
            slidesPerView = slidesPerView + 1;
          }
        }
        let needLoopFix = cols - targetSlideIndex < slidesPerView;
        if (centeredSlides) {
          needLoopFix = needLoopFix || targetSlideIndex < Math.ceil(slidesPerView / 2);
        }
        if (internal && centeredSlides && swiper.params.slidesPerView !== "auto" && !gridEnabled) {
          needLoopFix = false;
        }
        if (needLoopFix) {
          const direction = centeredSlides ? targetSlideIndex < swiper.activeIndex ? "prev" : "next" : targetSlideIndex - swiper.activeIndex - 1 < swiper.params.slidesPerView ? "next" : "prev";
          swiper.loopFix({
            direction,
            slideTo: true,
            activeSlideIndex: direction === "next" ? targetSlideIndex + 1 : targetSlideIndex - cols + 1,
            slideRealIndex: direction === "next" ? swiper.realIndex : void 0
          });
        }
        if (gridEnabled) {
          const slideIndex = newIndex * swiper.params.grid.rows;
          newIndex = swiper.slides.filter((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex)[0].column;
        } else {
          newIndex = swiper.getSlideIndexByData(newIndex);
        }
      }
    }
    requestAnimationFrame(() => {
      swiper.slideTo(newIndex, speed, runCallbacks, internal);
    });
    return swiper;
  }
  function slideNext(speed, runCallbacks, internal) {
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    const swiper = this;
    const {
      enabled,
      params,
      animating
    } = swiper;
    if (!enabled || swiper.destroyed)
      return swiper;
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    let perGroup = params.slidesPerGroup;
    if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
      perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
    }
    const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    if (params.loop) {
      if (animating && !isVirtual && params.loopPreventsSliding)
        return false;
      swiper.loopFix({
        direction: "next"
      });
      swiper._clientLeft = swiper.wrapperEl.clientLeft;
      if (swiper.activeIndex === swiper.slides.length - 1 && params.cssMode) {
        requestAnimationFrame(() => {
          swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
        });
        return true;
      }
    }
    if (params.rewind && swiper.isEnd) {
      return swiper.slideTo(0, speed, runCallbacks, internal);
    }
    return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
  }
  function slidePrev(speed, runCallbacks, internal) {
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    const swiper = this;
    const {
      params,
      snapGrid,
      slidesGrid,
      rtlTranslate,
      enabled,
      animating
    } = swiper;
    if (!enabled || swiper.destroyed)
      return swiper;
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    const isVirtual = swiper.virtual && params.virtual.enabled;
    if (params.loop) {
      if (animating && !isVirtual && params.loopPreventsSliding)
        return false;
      swiper.loopFix({
        direction: "prev"
      });
      swiper._clientLeft = swiper.wrapperEl.clientLeft;
    }
    const translate22 = rtlTranslate ? swiper.translate : -swiper.translate;
    function normalize(val) {
      if (val < 0)
        return -Math.floor(Math.abs(val));
      return Math.floor(val);
    }
    const normalizedTranslate = normalize(translate22);
    const normalizedSnapGrid = snapGrid.map((val) => normalize(val));
    let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
    if (typeof prevSnap === "undefined" && params.cssMode) {
      let prevSnapIndex;
      snapGrid.forEach((snap, snapIndex) => {
        if (normalizedTranslate >= snap) {
          prevSnapIndex = snapIndex;
        }
      });
      if (typeof prevSnapIndex !== "undefined") {
        prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
      }
    }
    let prevIndex = 0;
    if (typeof prevSnap !== "undefined") {
      prevIndex = slidesGrid.indexOf(prevSnap);
      if (prevIndex < 0)
        prevIndex = swiper.activeIndex - 1;
      if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
        prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
        prevIndex = Math.max(prevIndex, 0);
      }
    }
    if (params.rewind && swiper.isBeginning) {
      const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
      return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
    } else if (params.loop && swiper.activeIndex === 0 && params.cssMode) {
      requestAnimationFrame(() => {
        swiper.slideTo(prevIndex, speed, runCallbacks, internal);
      });
      return true;
    }
    return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
  }
  function slideReset(speed, runCallbacks, internal) {
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    const swiper = this;
    if (swiper.destroyed)
      return;
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
  }
  function slideToClosest(speed, runCallbacks, internal, threshold) {
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    if (threshold === void 0) {
      threshold = 0.5;
    }
    const swiper = this;
    if (swiper.destroyed)
      return;
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    let index = swiper.activeIndex;
    const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
    const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
    const translate22 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
    if (translate22 >= swiper.snapGrid[snapIndex]) {
      const currentSnap = swiper.snapGrid[snapIndex];
      const nextSnap = swiper.snapGrid[snapIndex + 1];
      if (translate22 - currentSnap > (nextSnap - currentSnap) * threshold) {
        index += swiper.params.slidesPerGroup;
      }
    } else {
      const prevSnap = swiper.snapGrid[snapIndex - 1];
      const currentSnap = swiper.snapGrid[snapIndex];
      if (translate22 - prevSnap <= (currentSnap - prevSnap) * threshold) {
        index -= swiper.params.slidesPerGroup;
      }
    }
    index = Math.max(index, 0);
    index = Math.min(index, swiper.slidesGrid.length - 1);
    return swiper.slideTo(index, speed, runCallbacks, internal);
  }
  function slideToClickedSlide() {
    const swiper = this;
    if (swiper.destroyed)
      return;
    const {
      params,
      slidesEl
    } = swiper;
    const slidesPerView = params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : params.slidesPerView;
    let slideToIndex = swiper.clickedIndex;
    let realIndex;
    const slideSelector = swiper.isElement ? `swiper-slide` : `.${params.slideClass}`;
    if (params.loop) {
      if (swiper.animating)
        return;
      realIndex = parseInt(swiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10);
      if (params.centeredSlides) {
        if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
          swiper.loopFix();
          slideToIndex = swiper.getSlideIndex(elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
          nextTick(() => {
            swiper.slideTo(slideToIndex);
          });
        } else {
          swiper.slideTo(slideToIndex);
        }
      } else if (slideToIndex > swiper.slides.length - slidesPerView) {
        swiper.loopFix();
        slideToIndex = swiper.getSlideIndex(elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
        nextTick(() => {
          swiper.slideTo(slideToIndex);
        });
      } else {
        swiper.slideTo(slideToIndex);
      }
    } else {
      swiper.slideTo(slideToIndex);
    }
  }
  function loopCreate(slideRealIndex) {
    const swiper = this;
    const {
      params,
      slidesEl
    } = swiper;
    if (!params.loop || swiper.virtual && swiper.params.virtual.enabled)
      return;
    const initSlides = () => {
      const slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
      slides.forEach((el, index) => {
        el.setAttribute("data-swiper-slide-index", index);
      });
    };
    const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
    const slidesPerGroup = params.slidesPerGroup * (gridEnabled ? params.grid.rows : 1);
    const shouldFillGroup = swiper.slides.length % slidesPerGroup !== 0;
    const shouldFillGrid = gridEnabled && swiper.slides.length % params.grid.rows !== 0;
    const addBlankSlides = (amountOfSlides) => {
      for (let i = 0; i < amountOfSlides; i += 1) {
        const slideEl = swiper.isElement ? createElement2("swiper-slide", [params.slideBlankClass]) : createElement2("div", [params.slideClass, params.slideBlankClass]);
        swiper.slidesEl.append(slideEl);
      }
    };
    if (shouldFillGroup) {
      if (params.loopAddBlankSlides) {
        const slidesToAdd = slidesPerGroup - swiper.slides.length % slidesPerGroup;
        addBlankSlides(slidesToAdd);
        swiper.recalcSlides();
        swiper.updateSlides();
      } else {
        showWarning("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
      }
      initSlides();
    } else if (shouldFillGrid) {
      if (params.loopAddBlankSlides) {
        const slidesToAdd = params.grid.rows - swiper.slides.length % params.grid.rows;
        addBlankSlides(slidesToAdd);
        swiper.recalcSlides();
        swiper.updateSlides();
      } else {
        showWarning("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
      }
      initSlides();
    } else {
      initSlides();
    }
    swiper.loopFix({
      slideRealIndex,
      direction: params.centeredSlides ? void 0 : "next"
    });
  }
  function loopFix(_temp) {
    let {
      slideRealIndex,
      slideTo: slideTo22 = true,
      direction,
      setTranslate: setTranslate22,
      activeSlideIndex,
      byController,
      byMousewheel
    } = _temp === void 0 ? {} : _temp;
    const swiper = this;
    if (!swiper.params.loop)
      return;
    swiper.emit("beforeLoopFix");
    const {
      slides,
      allowSlidePrev,
      allowSlideNext,
      slidesEl,
      params
    } = swiper;
    const {
      centeredSlides
    } = params;
    swiper.allowSlidePrev = true;
    swiper.allowSlideNext = true;
    if (swiper.virtual && params.virtual.enabled) {
      if (slideTo22) {
        if (!params.centeredSlides && swiper.snapIndex === 0) {
          swiper.slideTo(swiper.virtual.slides.length, 0, false, true);
        } else if (params.centeredSlides && swiper.snapIndex < params.slidesPerView) {
          swiper.slideTo(swiper.virtual.slides.length + swiper.snapIndex, 0, false, true);
        } else if (swiper.snapIndex === swiper.snapGrid.length - 1) {
          swiper.slideTo(swiper.virtual.slidesBefore, 0, false, true);
        }
      }
      swiper.allowSlidePrev = allowSlidePrev;
      swiper.allowSlideNext = allowSlideNext;
      swiper.emit("loopFix");
      return;
    }
    let slidesPerView = params.slidesPerView;
    if (slidesPerView === "auto") {
      slidesPerView = swiper.slidesPerViewDynamic();
    } else {
      slidesPerView = Math.ceil(parseFloat(params.slidesPerView, 10));
      if (centeredSlides && slidesPerView % 2 === 0) {
        slidesPerView = slidesPerView + 1;
      }
    }
    const slidesPerGroup = params.slidesPerGroupAuto ? slidesPerView : params.slidesPerGroup;
    let loopedSlides = slidesPerGroup;
    if (loopedSlides % slidesPerGroup !== 0) {
      loopedSlides += slidesPerGroup - loopedSlides % slidesPerGroup;
    }
    loopedSlides += params.loopAdditionalSlides;
    swiper.loopedSlides = loopedSlides;
    const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
    if (slides.length < slidesPerView + loopedSlides) {
      showWarning("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled and not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters");
    } else if (gridEnabled && params.grid.fill === "row") {
      showWarning("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");
    }
    const prependSlidesIndexes = [];
    const appendSlidesIndexes = [];
    let activeIndex = swiper.activeIndex;
    if (typeof activeSlideIndex === "undefined") {
      activeSlideIndex = swiper.getSlideIndex(slides.filter((el) => el.classList.contains(params.slideActiveClass))[0]);
    } else {
      activeIndex = activeSlideIndex;
    }
    const isNext = direction === "next" || !direction;
    const isPrev = direction === "prev" || !direction;
    let slidesPrepended = 0;
    let slidesAppended = 0;
    const cols = gridEnabled ? Math.ceil(slides.length / params.grid.rows) : slides.length;
    const activeColIndex = gridEnabled ? slides[activeSlideIndex].column : activeSlideIndex;
    const activeColIndexWithShift = activeColIndex + (centeredSlides && typeof setTranslate22 === "undefined" ? -slidesPerView / 2 + 0.5 : 0);
    if (activeColIndexWithShift < loopedSlides) {
      slidesPrepended = Math.max(loopedSlides - activeColIndexWithShift, slidesPerGroup);
      for (let i = 0; i < loopedSlides - activeColIndexWithShift; i += 1) {
        const index = i - Math.floor(i / cols) * cols;
        if (gridEnabled) {
          const colIndexToPrepend = cols - index - 1;
          for (let i2 = slides.length - 1; i2 >= 0; i2 -= 1) {
            if (slides[i2].column === colIndexToPrepend)
              prependSlidesIndexes.push(i2);
          }
        } else {
          prependSlidesIndexes.push(cols - index - 1);
        }
      }
    } else if (activeColIndexWithShift + slidesPerView > cols - loopedSlides) {
      slidesAppended = Math.max(activeColIndexWithShift - (cols - loopedSlides * 2), slidesPerGroup);
      for (let i = 0; i < slidesAppended; i += 1) {
        const index = i - Math.floor(i / cols) * cols;
        if (gridEnabled) {
          slides.forEach((slide22, slideIndex) => {
            if (slide22.column === index)
              appendSlidesIndexes.push(slideIndex);
          });
        } else {
          appendSlidesIndexes.push(index);
        }
      }
    }
    swiper.__preventObserver__ = true;
    requestAnimationFrame(() => {
      swiper.__preventObserver__ = false;
    });
    if (isPrev) {
      prependSlidesIndexes.forEach((index) => {
        slides[index].swiperLoopMoveDOM = true;
        slidesEl.prepend(slides[index]);
        slides[index].swiperLoopMoveDOM = false;
      });
    }
    if (isNext) {
      appendSlidesIndexes.forEach((index) => {
        slides[index].swiperLoopMoveDOM = true;
        slidesEl.append(slides[index]);
        slides[index].swiperLoopMoveDOM = false;
      });
    }
    swiper.recalcSlides();
    if (params.slidesPerView === "auto") {
      swiper.updateSlides();
    } else if (gridEnabled && (prependSlidesIndexes.length > 0 && isPrev || appendSlidesIndexes.length > 0 && isNext)) {
      swiper.slides.forEach((slide22, slideIndex) => {
        swiper.grid.updateSlide(slideIndex, slide22, swiper.slides);
      });
    }
    if (params.watchSlidesProgress) {
      swiper.updateSlidesOffset();
    }
    if (slideTo22) {
      if (prependSlidesIndexes.length > 0 && isPrev) {
        if (typeof slideRealIndex === "undefined") {
          const currentSlideTranslate = swiper.slidesGrid[activeIndex];
          const newSlideTranslate = swiper.slidesGrid[activeIndex + slidesPrepended];
          const diff = newSlideTranslate - currentSlideTranslate;
          if (byMousewheel) {
            swiper.setTranslate(swiper.translate - diff);
          } else {
            swiper.slideTo(activeIndex + Math.ceil(slidesPrepended), 0, false, true);
            if (setTranslate22) {
              swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
              swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
            }
          }
        } else {
          if (setTranslate22) {
            const shift = gridEnabled ? prependSlidesIndexes.length / params.grid.rows : prependSlidesIndexes.length;
            swiper.slideTo(swiper.activeIndex + shift, 0, false, true);
            swiper.touchEventsData.currentTranslate = swiper.translate;
          }
        }
      } else if (appendSlidesIndexes.length > 0 && isNext) {
        if (typeof slideRealIndex === "undefined") {
          const currentSlideTranslate = swiper.slidesGrid[activeIndex];
          const newSlideTranslate = swiper.slidesGrid[activeIndex - slidesAppended];
          const diff = newSlideTranslate - currentSlideTranslate;
          if (byMousewheel) {
            swiper.setTranslate(swiper.translate - diff);
          } else {
            swiper.slideTo(activeIndex - slidesAppended, 0, false, true);
            if (setTranslate22) {
              swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
              swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
            }
          }
        } else {
          const shift = gridEnabled ? appendSlidesIndexes.length / params.grid.rows : appendSlidesIndexes.length;
          swiper.slideTo(swiper.activeIndex - shift, 0, false, true);
        }
      }
    }
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;
    if (swiper.controller && swiper.controller.control && !byController) {
      const loopParams = {
        slideRealIndex,
        direction,
        setTranslate: setTranslate22,
        activeSlideIndex,
        byController: true
      };
      if (Array.isArray(swiper.controller.control)) {
        swiper.controller.control.forEach((c) => {
          if (!c.destroyed && c.params.loop)
            c.loopFix({
              ...loopParams,
              slideTo: c.params.slidesPerView === params.slidesPerView ? slideTo22 : false
            });
        });
      } else if (swiper.controller.control instanceof swiper.constructor && swiper.controller.control.params.loop) {
        swiper.controller.control.loopFix({
          ...loopParams,
          slideTo: swiper.controller.control.params.slidesPerView === params.slidesPerView ? slideTo22 : false
        });
      }
    }
    swiper.emit("loopFix");
  }
  function loopDestroy() {
    const swiper = this;
    const {
      params,
      slidesEl
    } = swiper;
    if (!params.loop || swiper.virtual && swiper.params.virtual.enabled)
      return;
    swiper.recalcSlides();
    const newSlidesOrder = [];
    swiper.slides.forEach((slideEl) => {
      const index = typeof slideEl.swiperSlideIndex === "undefined" ? slideEl.getAttribute("data-swiper-slide-index") * 1 : slideEl.swiperSlideIndex;
      newSlidesOrder[index] = slideEl;
    });
    swiper.slides.forEach((slideEl) => {
      slideEl.removeAttribute("data-swiper-slide-index");
    });
    newSlidesOrder.forEach((slideEl) => {
      slidesEl.append(slideEl);
    });
    swiper.recalcSlides();
    swiper.slideTo(swiper.realIndex, 0);
  }
  function setGrabCursor(moving) {
    const swiper = this;
    if (!swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode)
      return;
    const el = swiper.params.touchEventsTarget === "container" ? swiper.el : swiper.wrapperEl;
    if (swiper.isElement) {
      swiper.__preventObserver__ = true;
    }
    el.style.cursor = "move";
    el.style.cursor = moving ? "grabbing" : "grab";
    if (swiper.isElement) {
      requestAnimationFrame(() => {
        swiper.__preventObserver__ = false;
      });
    }
  }
  function unsetGrabCursor() {
    const swiper = this;
    if (swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
      return;
    }
    if (swiper.isElement) {
      swiper.__preventObserver__ = true;
    }
    swiper[swiper.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "";
    if (swiper.isElement) {
      requestAnimationFrame(() => {
        swiper.__preventObserver__ = false;
      });
    }
  }
  function closestElement(selector, base) {
    if (base === void 0) {
      base = this;
    }
    function __closestFrom(el) {
      if (!el || el === getDocument() || el === getWindow())
        return null;
      if (el.assignedSlot)
        el = el.assignedSlot;
      const found = el.closest(selector);
      if (!found && !el.getRootNode) {
        return null;
      }
      return found || __closestFrom(el.getRootNode().host);
    }
    return __closestFrom(base);
  }
  function preventEdgeSwipe(swiper, event2, startX) {
    const window2 = getWindow();
    const {
      params
    } = swiper;
    const edgeSwipeDetection = params.edgeSwipeDetection;
    const edgeSwipeThreshold = params.edgeSwipeThreshold;
    if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window2.innerWidth - edgeSwipeThreshold)) {
      if (edgeSwipeDetection === "prevent") {
        event2.preventDefault();
        return true;
      }
      return false;
    }
    return true;
  }
  function onTouchStart(event2) {
    const swiper = this;
    const document2 = getDocument();
    let e = event2;
    if (e.originalEvent)
      e = e.originalEvent;
    const data = swiper.touchEventsData;
    if (e.type === "pointerdown") {
      if (data.pointerId !== null && data.pointerId !== e.pointerId) {
        return;
      }
      data.pointerId = e.pointerId;
    } else if (e.type === "touchstart" && e.targetTouches.length === 1) {
      data.touchId = e.targetTouches[0].identifier;
    }
    if (e.type === "touchstart") {
      preventEdgeSwipe(swiper, e, e.targetTouches[0].pageX);
      return;
    }
    const {
      params,
      touches,
      enabled
    } = swiper;
    if (!enabled)
      return;
    if (!params.simulateTouch && e.pointerType === "mouse")
      return;
    if (swiper.animating && params.preventInteractionOnTransition) {
      return;
    }
    if (!swiper.animating && params.cssMode && params.loop) {
      swiper.loopFix();
    }
    let targetEl = e.target;
    if (params.touchEventsTarget === "wrapper") {
      if (!elementIsChildOf(targetEl, swiper.wrapperEl))
        return;
    }
    if ("which" in e && e.which === 3)
      return;
    if ("button" in e && e.button > 0)
      return;
    if (data.isTouched && data.isMoved)
      return;
    const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== "";
    const eventPath = e.composedPath ? e.composedPath() : e.path;
    if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) {
      targetEl = eventPath[0];
    }
    const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
    const isTargetShadow = !!(e.target && e.target.shadowRoot);
    if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, targetEl) : targetEl.closest(noSwipingSelector))) {
      swiper.allowClick = true;
      return;
    }
    if (params.swipeHandler) {
      if (!targetEl.closest(params.swipeHandler))
        return;
    }
    touches.currentX = e.pageX;
    touches.currentY = e.pageY;
    const startX = touches.currentX;
    const startY = touches.currentY;
    if (!preventEdgeSwipe(swiper, e, startX)) {
      return;
    }
    Object.assign(data, {
      isTouched: true,
      isMoved: false,
      allowTouchCallbacks: true,
      isScrolling: void 0,
      startMoving: void 0
    });
    touches.startX = startX;
    touches.startY = startY;
    data.touchStartTime = now();
    swiper.allowClick = true;
    swiper.updateSize();
    swiper.swipeDirection = void 0;
    if (params.threshold > 0)
      data.allowThresholdMove = false;
    let preventDefault = true;
    if (targetEl.matches(data.focusableElements)) {
      preventDefault = false;
      if (targetEl.nodeName === "SELECT") {
        data.isTouched = false;
      }
    }
    if (document2.activeElement && document2.activeElement.matches(data.focusableElements) && document2.activeElement !== targetEl && (e.pointerType === "mouse" || e.pointerType !== "mouse" && !targetEl.matches(data.focusableElements))) {
      document2.activeElement.blur();
    }
    const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
    if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !targetEl.isContentEditable) {
      e.preventDefault();
    }
    if (params.freeMode && params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) {
      swiper.freeMode.onTouchStart();
    }
    swiper.emit("touchStart", e);
  }
  function onTouchMove(event2) {
    const document2 = getDocument();
    const swiper = this;
    const data = swiper.touchEventsData;
    const {
      params,
      touches,
      rtlTranslate: rtl,
      enabled
    } = swiper;
    if (!enabled)
      return;
    if (!params.simulateTouch && event2.pointerType === "mouse")
      return;
    let e = event2;
    if (e.originalEvent)
      e = e.originalEvent;
    if (e.type === "pointermove") {
      if (data.touchId !== null)
        return;
      const id = e.pointerId;
      if (id !== data.pointerId)
        return;
    }
    let targetTouch;
    if (e.type === "touchmove") {
      targetTouch = [...e.changedTouches].filter((t) => t.identifier === data.touchId)[0];
      if (!targetTouch || targetTouch.identifier !== data.touchId)
        return;
    } else {
      targetTouch = e;
    }
    if (!data.isTouched) {
      if (data.startMoving && data.isScrolling) {
        swiper.emit("touchMoveOpposite", e);
      }
      return;
    }
    const pageX = targetTouch.pageX;
    const pageY = targetTouch.pageY;
    if (e.preventedByNestedSwiper) {
      touches.startX = pageX;
      touches.startY = pageY;
      return;
    }
    if (!swiper.allowTouchMove) {
      if (!e.target.matches(data.focusableElements)) {
        swiper.allowClick = false;
      }
      if (data.isTouched) {
        Object.assign(touches, {
          startX: pageX,
          startY: pageY,
          currentX: pageX,
          currentY: pageY
        });
        data.touchStartTime = now();
      }
      return;
    }
    if (params.touchReleaseOnEdges && !params.loop) {
      if (swiper.isVertical()) {
        if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
          data.isTouched = false;
          data.isMoved = false;
          return;
        }
      } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) {
        return;
      }
    }
    if (document2.activeElement && document2.activeElement.matches(data.focusableElements) && document2.activeElement !== e.target && e.pointerType !== "mouse") {
      document2.activeElement.blur();
    }
    if (document2.activeElement) {
      if (e.target === document2.activeElement && e.target.matches(data.focusableElements)) {
        data.isMoved = true;
        swiper.allowClick = false;
        return;
      }
    }
    if (data.allowTouchCallbacks) {
      swiper.emit("touchMove", e);
    }
    touches.previousX = touches.currentX;
    touches.previousY = touches.currentY;
    touches.currentX = pageX;
    touches.currentY = pageY;
    const diffX = touches.currentX - touches.startX;
    const diffY = touches.currentY - touches.startY;
    if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold)
      return;
    if (typeof data.isScrolling === "undefined") {
      let touchAngle;
      if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
        data.isScrolling = false;
      } else {
        if (diffX * diffX + diffY * diffY >= 25) {
          touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
          data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
        }
      }
    }
    if (data.isScrolling) {
      swiper.emit("touchMoveOpposite", e);
    }
    if (typeof data.startMoving === "undefined") {
      if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
        data.startMoving = true;
      }
    }
    if (data.isScrolling || e.type === "touchmove" && data.preventTouchMoveFromPointerMove) {
      data.isTouched = false;
      return;
    }
    if (!data.startMoving) {
      return;
    }
    swiper.allowClick = false;
    if (!params.cssMode && e.cancelable) {
      e.preventDefault();
    }
    if (params.touchMoveStopPropagation && !params.nested) {
      e.stopPropagation();
    }
    let diff = swiper.isHorizontal() ? diffX : diffY;
    let touchesDiff = swiper.isHorizontal() ? touches.currentX - touches.previousX : touches.currentY - touches.previousY;
    if (params.oneWayMovement) {
      diff = Math.abs(diff) * (rtl ? 1 : -1);
      touchesDiff = Math.abs(touchesDiff) * (rtl ? 1 : -1);
    }
    touches.diff = diff;
    diff *= params.touchRatio;
    if (rtl) {
      diff = -diff;
      touchesDiff = -touchesDiff;
    }
    const prevTouchesDirection = swiper.touchesDirection;
    swiper.swipeDirection = diff > 0 ? "prev" : "next";
    swiper.touchesDirection = touchesDiff > 0 ? "prev" : "next";
    const isLoop = swiper.params.loop && !params.cssMode;
    const allowLoopFix = swiper.touchesDirection === "next" && swiper.allowSlideNext || swiper.touchesDirection === "prev" && swiper.allowSlidePrev;
    if (!data.isMoved) {
      if (isLoop && allowLoopFix) {
        swiper.loopFix({
          direction: swiper.swipeDirection
        });
      }
      data.startTranslate = swiper.getTranslate();
      swiper.setTransition(0);
      if (swiper.animating) {
        const evt = new window.CustomEvent("transitionend", {
          bubbles: true,
          cancelable: true,
          detail: {
            bySwiperTouchMove: true
          }
        });
        swiper.wrapperEl.dispatchEvent(evt);
      }
      data.allowMomentumBounce = false;
      if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
        swiper.setGrabCursor(true);
      }
      swiper.emit("sliderFirstMove", e);
    }
    let loopFixed;
    (/* @__PURE__ */ new Date()).getTime();
    if (data.isMoved && data.allowThresholdMove && prevTouchesDirection !== swiper.touchesDirection && isLoop && allowLoopFix && Math.abs(diff) >= 1) {
      Object.assign(touches, {
        startX: pageX,
        startY: pageY,
        currentX: pageX,
        currentY: pageY,
        startTranslate: data.currentTranslate
      });
      data.loopSwapReset = true;
      data.startTranslate = data.currentTranslate;
      return;
    }
    swiper.emit("sliderMove", e);
    data.isMoved = true;
    data.currentTranslate = diff + data.startTranslate;
    let disableParentSwiper = true;
    let resistanceRatio = params.resistanceRatio;
    if (params.touchReleaseOnEdges) {
      resistanceRatio = 0;
    }
    if (diff > 0) {
      if (isLoop && allowLoopFix && !loopFixed && data.allowThresholdMove && data.currentTranslate > (params.centeredSlides ? swiper.minTranslate() - swiper.slidesSizesGrid[swiper.activeIndex + 1] - (params.slidesPerView !== "auto" && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.activeIndex + 1] + swiper.params.spaceBetween : 0) - swiper.params.spaceBetween : swiper.minTranslate())) {
        swiper.loopFix({
          direction: "prev",
          setTranslate: true,
          activeSlideIndex: 0
        });
      }
      if (data.currentTranslate > swiper.minTranslate()) {
        disableParentSwiper = false;
        if (params.resistance) {
          data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
        }
      }
    } else if (diff < 0) {
      if (isLoop && allowLoopFix && !loopFixed && data.allowThresholdMove && data.currentTranslate < (params.centeredSlides ? swiper.maxTranslate() + swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween + (params.slidesPerView !== "auto" && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween : 0) : swiper.maxTranslate())) {
        swiper.loopFix({
          direction: "next",
          setTranslate: true,
          activeSlideIndex: swiper.slides.length - (params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10)))
        });
      }
      if (data.currentTranslate < swiper.maxTranslate()) {
        disableParentSwiper = false;
        if (params.resistance) {
          data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
        }
      }
    }
    if (disableParentSwiper) {
      e.preventedByNestedSwiper = true;
    }
    if (!swiper.allowSlideNext && swiper.swipeDirection === "next" && data.currentTranslate < data.startTranslate) {
      data.currentTranslate = data.startTranslate;
    }
    if (!swiper.allowSlidePrev && swiper.swipeDirection === "prev" && data.currentTranslate > data.startTranslate) {
      data.currentTranslate = data.startTranslate;
    }
    if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
      data.currentTranslate = data.startTranslate;
    }
    if (params.threshold > 0) {
      if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
        if (!data.allowThresholdMove) {
          data.allowThresholdMove = true;
          touches.startX = touches.currentX;
          touches.startY = touches.currentY;
          data.currentTranslate = data.startTranslate;
          touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
          return;
        }
      } else {
        data.currentTranslate = data.startTranslate;
        return;
      }
    }
    if (!params.followFinger || params.cssMode)
      return;
    if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    if (params.freeMode && params.freeMode.enabled && swiper.freeMode) {
      swiper.freeMode.onTouchMove();
    }
    swiper.updateProgress(data.currentTranslate);
    swiper.setTranslate(data.currentTranslate);
  }
  function onTouchEnd(event2) {
    const swiper = this;
    const data = swiper.touchEventsData;
    let e = event2;
    if (e.originalEvent)
      e = e.originalEvent;
    let targetTouch;
    const isTouchEvent = e.type === "touchend" || e.type === "touchcancel";
    if (!isTouchEvent) {
      if (data.touchId !== null)
        return;
      if (e.pointerId !== data.pointerId)
        return;
      targetTouch = e;
    } else {
      targetTouch = [...e.changedTouches].filter((t) => t.identifier === data.touchId)[0];
      if (!targetTouch || targetTouch.identifier !== data.touchId)
        return;
    }
    if (["pointercancel", "pointerout", "pointerleave", "contextmenu"].includes(e.type)) {
      const proceed = ["pointercancel", "contextmenu"].includes(e.type) && (swiper.browser.isSafari || swiper.browser.isWebView);
      if (!proceed) {
        return;
      }
    }
    data.pointerId = null;
    data.touchId = null;
    const {
      params,
      touches,
      rtlTranslate: rtl,
      slidesGrid,
      enabled
    } = swiper;
    if (!enabled)
      return;
    if (!params.simulateTouch && e.pointerType === "mouse")
      return;
    if (data.allowTouchCallbacks) {
      swiper.emit("touchEnd", e);
    }
    data.allowTouchCallbacks = false;
    if (!data.isTouched) {
      if (data.isMoved && params.grabCursor) {
        swiper.setGrabCursor(false);
      }
      data.isMoved = false;
      data.startMoving = false;
      return;
    }
    if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
      swiper.setGrabCursor(false);
    }
    const touchEndTime = now();
    const timeDiff = touchEndTime - data.touchStartTime;
    if (swiper.allowClick) {
      const pathTree = e.path || e.composedPath && e.composedPath();
      swiper.updateClickedSlide(pathTree && pathTree[0] || e.target, pathTree);
      swiper.emit("tap click", e);
      if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
        swiper.emit("doubleTap doubleClick", e);
      }
    }
    data.lastClickTime = now();
    nextTick(() => {
      if (!swiper.destroyed)
        swiper.allowClick = true;
    });
    if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 && !data.loopSwapReset || data.currentTranslate === data.startTranslate && !data.loopSwapReset) {
      data.isTouched = false;
      data.isMoved = false;
      data.startMoving = false;
      return;
    }
    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;
    let currentPos;
    if (params.followFinger) {
      currentPos = rtl ? swiper.translate : -swiper.translate;
    } else {
      currentPos = -data.currentTranslate;
    }
    if (params.cssMode) {
      return;
    }
    if (params.freeMode && params.freeMode.enabled) {
      swiper.freeMode.onTouchEnd({
        currentPos
      });
      return;
    }
    const swipeToLast = currentPos >= -swiper.maxTranslate() && !swiper.params.loop;
    let stopIndex = 0;
    let groupSize = swiper.slidesSizesGrid[0];
    for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
      const increment2 = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
      if (typeof slidesGrid[i + increment2] !== "undefined") {
        if (swipeToLast || currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment2]) {
          stopIndex = i;
          groupSize = slidesGrid[i + increment2] - slidesGrid[i];
        }
      } else if (swipeToLast || currentPos >= slidesGrid[i]) {
        stopIndex = i;
        groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
      }
    }
    let rewindFirstIndex = null;
    let rewindLastIndex = null;
    if (params.rewind) {
      if (swiper.isBeginning) {
        rewindLastIndex = params.virtual && params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
      } else if (swiper.isEnd) {
        rewindFirstIndex = 0;
      }
    }
    const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
    const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
    if (timeDiff > params.longSwipesMs) {
      if (!params.longSwipes) {
        swiper.slideTo(swiper.activeIndex);
        return;
      }
      if (swiper.swipeDirection === "next") {
        if (ratio >= params.longSwipesRatio)
          swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment);
        else
          swiper.slideTo(stopIndex);
      }
      if (swiper.swipeDirection === "prev") {
        if (ratio > 1 - params.longSwipesRatio) {
          swiper.slideTo(stopIndex + increment);
        } else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) {
          swiper.slideTo(rewindLastIndex);
        } else {
          swiper.slideTo(stopIndex);
        }
      }
    } else {
      if (!params.shortSwipes) {
        swiper.slideTo(swiper.activeIndex);
        return;
      }
      const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
      if (!isNavButtonTarget) {
        if (swiper.swipeDirection === "next") {
          swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
        }
        if (swiper.swipeDirection === "prev") {
          swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
        }
      } else if (e.target === swiper.navigation.nextEl) {
        swiper.slideTo(stopIndex + increment);
      } else {
        swiper.slideTo(stopIndex);
      }
    }
  }
  function onResize() {
    const swiper = this;
    const {
      params,
      el
    } = swiper;
    if (el && el.offsetWidth === 0)
      return;
    if (params.breakpoints) {
      swiper.setBreakpoint();
    }
    const {
      allowSlideNext,
      allowSlidePrev,
      snapGrid
    } = swiper;
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    swiper.allowSlideNext = true;
    swiper.allowSlidePrev = true;
    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateSlidesClasses();
    const isVirtualLoop = isVirtual && params.loop;
    if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides && !isVirtualLoop) {
      swiper.slideTo(swiper.slides.length - 1, 0, false, true);
    } else {
      if (swiper.params.loop && !isVirtual) {
        swiper.slideToLoop(swiper.realIndex, 0, false, true);
      } else {
        swiper.slideTo(swiper.activeIndex, 0, false, true);
      }
    }
    if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
      clearTimeout(swiper.autoplay.resizeTimeout);
      swiper.autoplay.resizeTimeout = setTimeout(() => {
        if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
          swiper.autoplay.resume();
        }
      }, 500);
    }
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;
    if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }
  }
  function onClick(e) {
    const swiper = this;
    if (!swiper.enabled)
      return;
    if (!swiper.allowClick) {
      if (swiper.params.preventClicks)
        e.preventDefault();
      if (swiper.params.preventClicksPropagation && swiper.animating) {
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }
  }
  function onScroll() {
    const swiper = this;
    const {
      wrapperEl,
      rtlTranslate,
      enabled
    } = swiper;
    if (!enabled)
      return;
    swiper.previousTranslate = swiper.translate;
    if (swiper.isHorizontal()) {
      swiper.translate = -wrapperEl.scrollLeft;
    } else {
      swiper.translate = -wrapperEl.scrollTop;
    }
    if (swiper.translate === 0)
      swiper.translate = 0;
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
    let newProgress;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    if (translatesDiff === 0) {
      newProgress = 0;
    } else {
      newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
    }
    if (newProgress !== swiper.progress) {
      swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
    }
    swiper.emit("setTranslate", swiper.translate, false);
  }
  function onLoad(e) {
    const swiper = this;
    processLazyPreloader(swiper, e.target);
    if (swiper.params.cssMode || swiper.params.slidesPerView !== "auto" && !swiper.params.autoHeight) {
      return;
    }
    swiper.update();
  }
  function onDocumentTouchStart() {
    const swiper = this;
    if (swiper.documentTouchHandlerProceeded)
      return;
    swiper.documentTouchHandlerProceeded = true;
    if (swiper.params.touchReleaseOnEdges) {
      swiper.el.style.touchAction = "auto";
    }
  }
  function attachEvents() {
    const swiper = this;
    const {
      params
    } = swiper;
    swiper.onTouchStart = onTouchStart.bind(swiper);
    swiper.onTouchMove = onTouchMove.bind(swiper);
    swiper.onTouchEnd = onTouchEnd.bind(swiper);
    swiper.onDocumentTouchStart = onDocumentTouchStart.bind(swiper);
    if (params.cssMode) {
      swiper.onScroll = onScroll.bind(swiper);
    }
    swiper.onClick = onClick.bind(swiper);
    swiper.onLoad = onLoad.bind(swiper);
    events(swiper, "on");
  }
  function detachEvents() {
    const swiper = this;
    events(swiper, "off");
  }
  function setBreakpoint() {
    const swiper = this;
    const {
      realIndex,
      initialized,
      params,
      el
    } = swiper;
    const breakpoints22 = params.breakpoints;
    if (!breakpoints22 || breakpoints22 && Object.keys(breakpoints22).length === 0)
      return;
    const breakpoint = swiper.getBreakpoint(breakpoints22, swiper.params.breakpointsBase, swiper.el);
    if (!breakpoint || swiper.currentBreakpoint === breakpoint)
      return;
    const breakpointOnlyParams = breakpoint in breakpoints22 ? breakpoints22[breakpoint] : void 0;
    const breakpointParams = breakpointOnlyParams || swiper.originalParams;
    const wasMultiRow = isGridEnabled(swiper, params);
    const isMultiRow = isGridEnabled(swiper, breakpointParams);
    const wasGrabCursor = swiper.params.grabCursor;
    const isGrabCursor = breakpointParams.grabCursor;
    const wasEnabled = params.enabled;
    if (wasMultiRow && !isMultiRow) {
      el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
      swiper.emitContainerClasses();
    } else if (!wasMultiRow && isMultiRow) {
      el.classList.add(`${params.containerModifierClass}grid`);
      if (breakpointParams.grid.fill && breakpointParams.grid.fill === "column" || !breakpointParams.grid.fill && params.grid.fill === "column") {
        el.classList.add(`${params.containerModifierClass}grid-column`);
      }
      swiper.emitContainerClasses();
    }
    if (wasGrabCursor && !isGrabCursor) {
      swiper.unsetGrabCursor();
    } else if (!wasGrabCursor && isGrabCursor) {
      swiper.setGrabCursor();
    }
    ["navigation", "pagination", "scrollbar"].forEach((prop) => {
      if (typeof breakpointParams[prop] === "undefined")
        return;
      const wasModuleEnabled = params[prop] && params[prop].enabled;
      const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
      if (wasModuleEnabled && !isModuleEnabled) {
        swiper[prop].disable();
      }
      if (!wasModuleEnabled && isModuleEnabled) {
        swiper[prop].enable();
      }
    });
    const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
    const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
    const wasLoop = params.loop;
    if (directionChanged && initialized) {
      swiper.changeDirection();
    }
    extend2(swiper.params, breakpointParams);
    const isEnabled2 = swiper.params.enabled;
    const hasLoop = swiper.params.loop;
    Object.assign(swiper, {
      allowTouchMove: swiper.params.allowTouchMove,
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev
    });
    if (wasEnabled && !isEnabled2) {
      swiper.disable();
    } else if (!wasEnabled && isEnabled2) {
      swiper.enable();
    }
    swiper.currentBreakpoint = breakpoint;
    swiper.emit("_beforeBreakpoint", breakpointParams);
    if (initialized) {
      if (needsReLoop) {
        swiper.loopDestroy();
        swiper.loopCreate(realIndex);
        swiper.updateSlides();
      } else if (!wasLoop && hasLoop) {
        swiper.loopCreate(realIndex);
        swiper.updateSlides();
      } else if (wasLoop && !hasLoop) {
        swiper.loopDestroy();
      }
    }
    swiper.emit("breakpoint", breakpointParams);
  }
  function getBreakpoint(breakpoints22, base, containerEl) {
    if (base === void 0) {
      base = "window";
    }
    if (!breakpoints22 || base === "container" && !containerEl)
      return void 0;
    let breakpoint = false;
    const window2 = getWindow();
    const currentHeight = base === "window" ? window2.innerHeight : containerEl.clientHeight;
    const points = Object.keys(breakpoints22).map((point) => {
      if (typeof point === "string" && point.indexOf("@") === 0) {
        const minRatio = parseFloat(point.substr(1));
        const value = currentHeight * minRatio;
        return {
          value,
          point
        };
      }
      return {
        value: point,
        point
      };
    });
    points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
    for (let i = 0; i < points.length; i += 1) {
      const {
        point,
        value
      } = points[i];
      if (base === "window") {
        if (window2.matchMedia(`(min-width: ${value}px)`).matches) {
          breakpoint = point;
        }
      } else if (value <= containerEl.clientWidth) {
        breakpoint = point;
      }
    }
    return breakpoint || "max";
  }
  function prepareClasses(entries, prefix) {
    const resultClasses = [];
    entries.forEach((item) => {
      if (typeof item === "object") {
        Object.keys(item).forEach((classNames) => {
          if (item[classNames]) {
            resultClasses.push(prefix + classNames);
          }
        });
      } else if (typeof item === "string") {
        resultClasses.push(prefix + item);
      }
    });
    return resultClasses;
  }
  function addClasses() {
    const swiper = this;
    const {
      classNames,
      params,
      rtl,
      el,
      device
    } = swiper;
    const suffixes = prepareClasses(["initialized", params.direction, {
      "free-mode": swiper.params.freeMode && params.freeMode.enabled
    }, {
      "autoheight": params.autoHeight
    }, {
      "rtl": rtl
    }, {
      "grid": params.grid && params.grid.rows > 1
    }, {
      "grid-column": params.grid && params.grid.rows > 1 && params.grid.fill === "column"
    }, {
      "android": device.android
    }, {
      "ios": device.ios
    }, {
      "css-mode": params.cssMode
    }, {
      "centered": params.cssMode && params.centeredSlides
    }, {
      "watch-progress": params.watchSlidesProgress
    }], params.containerModifierClass);
    classNames.push(...suffixes);
    el.classList.add(...classNames);
    swiper.emitContainerClasses();
  }
  function removeClasses() {
    const swiper = this;
    const {
      el,
      classNames
    } = swiper;
    if (!el || typeof el === "string")
      return;
    el.classList.remove(...classNames);
    swiper.emitContainerClasses();
  }
  function checkOverflow() {
    const swiper = this;
    const {
      isLocked: wasLocked,
      params
    } = swiper;
    const {
      slidesOffsetBefore
    } = params;
    if (slidesOffsetBefore) {
      const lastSlideIndex = swiper.slides.length - 1;
      const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
      swiper.isLocked = swiper.size > lastSlideRightEdge;
    } else {
      swiper.isLocked = swiper.snapGrid.length === 1;
    }
    if (params.allowSlideNext === true) {
      swiper.allowSlideNext = !swiper.isLocked;
    }
    if (params.allowSlidePrev === true) {
      swiper.allowSlidePrev = !swiper.isLocked;
    }
    if (wasLocked && wasLocked !== swiper.isLocked) {
      swiper.isEnd = false;
    }
    if (wasLocked !== swiper.isLocked) {
      swiper.emit(swiper.isLocked ? "lock" : "unlock");
    }
  }
  function moduleExtendParams(params, allModulesParams) {
    return function extendParams(obj) {
      if (obj === void 0) {
        obj = {};
      }
      const moduleParamName = Object.keys(obj)[0];
      const moduleParams = obj[moduleParamName];
      if (typeof moduleParams !== "object" || moduleParams === null) {
        extend2(allModulesParams, obj);
        return;
      }
      if (params[moduleParamName] === true) {
        params[moduleParamName] = {
          enabled: true
        };
      }
      if (moduleParamName === "navigation" && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].prevEl && !params[moduleParamName].nextEl) {
        params[moduleParamName].auto = true;
      }
      if (["pagination", "scrollbar"].indexOf(moduleParamName) >= 0 && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].el) {
        params[moduleParamName].auto = true;
      }
      if (!(moduleParamName in params && "enabled" in moduleParams)) {
        extend2(allModulesParams, obj);
        return;
      }
      if (typeof params[moduleParamName] === "object" && !("enabled" in params[moduleParamName])) {
        params[moduleParamName].enabled = true;
      }
      if (!params[moduleParamName])
        params[moduleParamName] = {
          enabled: false
        };
      extend2(allModulesParams, obj);
    };
  }
  var support;
  var deviceCached;
  var browser;
  var eventsEmitter;
  var toggleSlideClasses$1;
  var toggleSlideClasses;
  var processLazyPreloader;
  var unlazy;
  var preload;
  var update;
  var translate;
  var transition;
  var slide;
  var loop;
  var grabCursor;
  var events;
  var events$1;
  var isGridEnabled;
  var breakpoints;
  var classes;
  var checkOverflow$1;
  var defaults;
  var prototypes;
  var extendedDefaults;
  var Swiper;
  var init_swiper_core = __esm({
    "../../node_modules/swiper/shared/swiper-core.mjs"() {
      init_ssr_window_esm();
      init_utils();
      eventsEmitter = {
        on(events22, handler, priority) {
          const self = this;
          if (!self.eventsListeners || self.destroyed)
            return self;
          if (typeof handler !== "function")
            return self;
          const method = priority ? "unshift" : "push";
          events22.split(" ").forEach((event2) => {
            if (!self.eventsListeners[event2])
              self.eventsListeners[event2] = [];
            self.eventsListeners[event2][method](handler);
          });
          return self;
        },
        once(events22, handler, priority) {
          const self = this;
          if (!self.eventsListeners || self.destroyed)
            return self;
          if (typeof handler !== "function")
            return self;
          function onceHandler() {
            self.off(events22, onceHandler);
            if (onceHandler.__emitterProxy) {
              delete onceHandler.__emitterProxy;
            }
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }
            handler.apply(self, args);
          }
          onceHandler.__emitterProxy = handler;
          return self.on(events22, onceHandler, priority);
        },
        onAny(handler, priority) {
          const self = this;
          if (!self.eventsListeners || self.destroyed)
            return self;
          if (typeof handler !== "function")
            return self;
          const method = priority ? "unshift" : "push";
          if (self.eventsAnyListeners.indexOf(handler) < 0) {
            self.eventsAnyListeners[method](handler);
          }
          return self;
        },
        offAny(handler) {
          const self = this;
          if (!self.eventsListeners || self.destroyed)
            return self;
          if (!self.eventsAnyListeners)
            return self;
          const index = self.eventsAnyListeners.indexOf(handler);
          if (index >= 0) {
            self.eventsAnyListeners.splice(index, 1);
          }
          return self;
        },
        off(events22, handler) {
          const self = this;
          if (!self.eventsListeners || self.destroyed)
            return self;
          if (!self.eventsListeners)
            return self;
          events22.split(" ").forEach((event2) => {
            if (typeof handler === "undefined") {
              self.eventsListeners[event2] = [];
            } else if (self.eventsListeners[event2]) {
              self.eventsListeners[event2].forEach((eventHandler, index) => {
                if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
                  self.eventsListeners[event2].splice(index, 1);
                }
              });
            }
          });
          return self;
        },
        emit() {
          const self = this;
          if (!self.eventsListeners || self.destroyed)
            return self;
          if (!self.eventsListeners)
            return self;
          let events22;
          let data;
          let context;
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
          if (typeof args[0] === "string" || Array.isArray(args[0])) {
            events22 = args[0];
            data = args.slice(1, args.length);
            context = self;
          } else {
            events22 = args[0].events;
            data = args[0].data;
            context = args[0].context || self;
          }
          data.unshift(context);
          const eventsArray = Array.isArray(events22) ? events22 : events22.split(" ");
          eventsArray.forEach((event2) => {
            if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
              self.eventsAnyListeners.forEach((eventHandler) => {
                eventHandler.apply(context, [event2, ...data]);
              });
            }
            if (self.eventsListeners && self.eventsListeners[event2]) {
              self.eventsListeners[event2].forEach((eventHandler) => {
                eventHandler.apply(context, data);
              });
            }
          });
          return self;
        }
      };
      toggleSlideClasses$1 = (slideEl, condition, className) => {
        if (condition && !slideEl.classList.contains(className)) {
          slideEl.classList.add(className);
        } else if (!condition && slideEl.classList.contains(className)) {
          slideEl.classList.remove(className);
        }
      };
      toggleSlideClasses = (slideEl, condition, className) => {
        if (condition && !slideEl.classList.contains(className)) {
          slideEl.classList.add(className);
        } else if (!condition && slideEl.classList.contains(className)) {
          slideEl.classList.remove(className);
        }
      };
      processLazyPreloader = (swiper, imageEl) => {
        if (!swiper || swiper.destroyed || !swiper.params)
          return;
        const slideSelector = () => swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
        const slideEl = imageEl.closest(slideSelector());
        if (slideEl) {
          let lazyEl = slideEl.querySelector(`.${swiper.params.lazyPreloaderClass}`);
          if (!lazyEl && swiper.isElement) {
            if (slideEl.shadowRoot) {
              lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
            } else {
              requestAnimationFrame(() => {
                if (slideEl.shadowRoot) {
                  lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
                  if (lazyEl)
                    lazyEl.remove();
                }
              });
            }
          }
          if (lazyEl)
            lazyEl.remove();
        }
      };
      unlazy = (swiper, index) => {
        if (!swiper.slides[index])
          return;
        const imageEl = swiper.slides[index].querySelector('[loading="lazy"]');
        if (imageEl)
          imageEl.removeAttribute("loading");
      };
      preload = (swiper) => {
        if (!swiper || swiper.destroyed || !swiper.params)
          return;
        let amount = swiper.params.lazyPreloadPrevNext;
        const len = swiper.slides.length;
        if (!len || !amount || amount < 0)
          return;
        amount = Math.min(amount, len);
        const slidesPerView = swiper.params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(swiper.params.slidesPerView);
        const activeIndex = swiper.activeIndex;
        if (swiper.params.grid && swiper.params.grid.rows > 1) {
          const activeColumn = activeIndex;
          const preloadColumns = [activeColumn - amount];
          preloadColumns.push(...Array.from({
            length: amount
          }).map((_, i) => {
            return activeColumn + slidesPerView + i;
          }));
          swiper.slides.forEach((slideEl, i) => {
            if (preloadColumns.includes(slideEl.column))
              unlazy(swiper, i);
          });
          return;
        }
        const slideIndexLastInView = activeIndex + slidesPerView - 1;
        if (swiper.params.rewind || swiper.params.loop) {
          for (let i = activeIndex - amount; i <= slideIndexLastInView + amount; i += 1) {
            const realIndex = (i % len + len) % len;
            if (realIndex < activeIndex || realIndex > slideIndexLastInView)
              unlazy(swiper, realIndex);
          }
        } else {
          for (let i = Math.max(activeIndex - amount, 0); i <= Math.min(slideIndexLastInView + amount, len - 1); i += 1) {
            if (i !== activeIndex && (i > slideIndexLastInView || i < activeIndex)) {
              unlazy(swiper, i);
            }
          }
        }
      };
      update = {
        updateSize,
        updateSlides,
        updateAutoHeight,
        updateSlidesOffset,
        updateSlidesProgress,
        updateProgress,
        updateSlidesClasses,
        updateActiveIndex,
        updateClickedSlide
      };
      translate = {
        getTranslate: getSwiperTranslate,
        setTranslate,
        minTranslate,
        maxTranslate,
        translateTo
      };
      transition = {
        setTransition,
        transitionStart,
        transitionEnd
      };
      slide = {
        slideTo,
        slideToLoop,
        slideNext,
        slidePrev,
        slideReset,
        slideToClosest,
        slideToClickedSlide
      };
      loop = {
        loopCreate,
        loopFix,
        loopDestroy
      };
      grabCursor = {
        setGrabCursor,
        unsetGrabCursor
      };
      events = (swiper, method) => {
        const document2 = getDocument();
        const {
          params,
          el,
          wrapperEl,
          device
        } = swiper;
        const capture = !!params.nested;
        const domMethod = method === "on" ? "addEventListener" : "removeEventListener";
        const swiperMethod = method;
        if (!el || typeof el === "string")
          return;
        document2[domMethod]("touchstart", swiper.onDocumentTouchStart, {
          passive: false,
          capture
        });
        el[domMethod]("touchstart", swiper.onTouchStart, {
          passive: false
        });
        el[domMethod]("pointerdown", swiper.onTouchStart, {
          passive: false
        });
        document2[domMethod]("touchmove", swiper.onTouchMove, {
          passive: false,
          capture
        });
        document2[domMethod]("pointermove", swiper.onTouchMove, {
          passive: false,
          capture
        });
        document2[domMethod]("touchend", swiper.onTouchEnd, {
          passive: true
        });
        document2[domMethod]("pointerup", swiper.onTouchEnd, {
          passive: true
        });
        document2[domMethod]("pointercancel", swiper.onTouchEnd, {
          passive: true
        });
        document2[domMethod]("touchcancel", swiper.onTouchEnd, {
          passive: true
        });
        document2[domMethod]("pointerout", swiper.onTouchEnd, {
          passive: true
        });
        document2[domMethod]("pointerleave", swiper.onTouchEnd, {
          passive: true
        });
        document2[domMethod]("contextmenu", swiper.onTouchEnd, {
          passive: true
        });
        if (params.preventClicks || params.preventClicksPropagation) {
          el[domMethod]("click", swiper.onClick, true);
        }
        if (params.cssMode) {
          wrapperEl[domMethod]("scroll", swiper.onScroll);
        }
        if (params.updateOnWindowResize) {
          swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true);
        } else {
          swiper[swiperMethod]("observerUpdate", onResize, true);
        }
        el[domMethod]("load", swiper.onLoad, {
          capture: true
        });
      };
      events$1 = {
        attachEvents,
        detachEvents
      };
      isGridEnabled = (swiper, params) => {
        return swiper.grid && params.grid && params.grid.rows > 1;
      };
      breakpoints = {
        setBreakpoint,
        getBreakpoint
      };
      classes = {
        addClasses,
        removeClasses
      };
      checkOverflow$1 = {
        checkOverflow
      };
      defaults = {
        init: true,
        direction: "horizontal",
        oneWayMovement: false,
        swiperElementNodeName: "SWIPER-CONTAINER",
        touchEventsTarget: "wrapper",
        initialSlide: 0,
        speed: 300,
        cssMode: false,
        updateOnWindowResize: true,
        resizeObserver: true,
        nested: false,
        createElements: false,
        eventsPrefix: "swiper",
        enabled: true,
        focusableElements: "input, select, option, textarea, button, video, label",
        // Overrides
        width: null,
        height: null,
        //
        preventInteractionOnTransition: false,
        // ssr
        userAgent: null,
        url: null,
        // To support iOS's swipe-to-go-back gesture (when being used in-app).
        edgeSwipeDetection: false,
        edgeSwipeThreshold: 20,
        // Autoheight
        autoHeight: false,
        // Set wrapper width
        setWrapperSize: false,
        // Virtual Translate
        virtualTranslate: false,
        // Effects
        effect: "slide",
        // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
        // Breakpoints
        breakpoints: void 0,
        breakpointsBase: "window",
        // Slides grid
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerGroupSkip: 0,
        slidesPerGroupAuto: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
        slidesOffsetBefore: 0,
        // in px
        slidesOffsetAfter: 0,
        // in px
        normalizeSlideIndex: true,
        centerInsufficientSlides: false,
        // Disable swiper and hide navigation when container not overflow
        watchOverflow: true,
        // Round length
        roundLengths: false,
        // Touches
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: true,
        shortSwipes: true,
        longSwipes: true,
        longSwipesRatio: 0.5,
        longSwipesMs: 300,
        followFinger: true,
        allowTouchMove: true,
        threshold: 5,
        touchMoveStopPropagation: false,
        touchStartPreventDefault: true,
        touchStartForcePreventDefault: false,
        touchReleaseOnEdges: false,
        // Unique Navigation Elements
        uniqueNavElements: true,
        // Resistance
        resistance: true,
        resistanceRatio: 0.85,
        // Progress
        watchSlidesProgress: false,
        // Cursor
        grabCursor: false,
        // Clicks
        preventClicks: true,
        preventClicksPropagation: true,
        slideToClickedSlide: false,
        // loop
        loop: false,
        loopAddBlankSlides: true,
        loopAdditionalSlides: 0,
        loopPreventsSliding: true,
        // rewind
        rewind: false,
        // Swiping/no swiping
        allowSlidePrev: true,
        allowSlideNext: true,
        swipeHandler: null,
        // '.swipe-handler',
        noSwiping: true,
        noSwipingClass: "swiper-no-swiping",
        noSwipingSelector: null,
        // Passive Listeners
        passiveListeners: true,
        maxBackfaceHiddenSlides: 10,
        // NS
        containerModifierClass: "swiper-",
        // NEW
        slideClass: "swiper-slide",
        slideBlankClass: "swiper-slide-blank",
        slideActiveClass: "swiper-slide-active",
        slideVisibleClass: "swiper-slide-visible",
        slideFullyVisibleClass: "swiper-slide-fully-visible",
        slideNextClass: "swiper-slide-next",
        slidePrevClass: "swiper-slide-prev",
        wrapperClass: "swiper-wrapper",
        lazyPreloaderClass: "swiper-lazy-preloader",
        lazyPreloadPrevNext: 0,
        // Callbacks
        runCallbacksOnInit: true,
        // Internals
        _emitClasses: false
      };
      prototypes = {
        eventsEmitter,
        update,
        translate,
        transition,
        slide,
        loop,
        grabCursor,
        events: events$1,
        breakpoints,
        checkOverflow: checkOverflow$1,
        classes
      };
      extendedDefaults = {};
      Swiper = class _Swiper2 {
        constructor() {
          let el;
          let params;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === "Object") {
            params = args[0];
          } else {
            [el, params] = args;
          }
          if (!params)
            params = {};
          params = extend2({}, params);
          if (el && !params.el)
            params.el = el;
          const document2 = getDocument();
          if (params.el && typeof params.el === "string" && document2.querySelectorAll(params.el).length > 1) {
            const swipers = [];
            document2.querySelectorAll(params.el).forEach((containerEl) => {
              const newParams = extend2({}, params, {
                el: containerEl
              });
              swipers.push(new _Swiper2(newParams));
            });
            return swipers;
          }
          const swiper = this;
          swiper.__swiper__ = true;
          swiper.support = getSupport();
          swiper.device = getDevice({
            userAgent: params.userAgent
          });
          swiper.browser = getBrowser();
          swiper.eventsListeners = {};
          swiper.eventsAnyListeners = [];
          swiper.modules = [...swiper.__modules__];
          if (params.modules && Array.isArray(params.modules)) {
            swiper.modules.push(...params.modules);
          }
          const allModulesParams = {};
          swiper.modules.forEach((mod) => {
            mod({
              params,
              swiper,
              extendParams: moduleExtendParams(params, allModulesParams),
              on: swiper.on.bind(swiper),
              once: swiper.once.bind(swiper),
              off: swiper.off.bind(swiper),
              emit: swiper.emit.bind(swiper)
            });
          });
          const swiperParams = extend2({}, defaults, allModulesParams);
          swiper.params = extend2({}, swiperParams, extendedDefaults, params);
          swiper.originalParams = extend2({}, swiper.params);
          swiper.passedParams = extend2({}, params);
          if (swiper.params && swiper.params.on) {
            Object.keys(swiper.params.on).forEach((eventName) => {
              swiper.on(eventName, swiper.params.on[eventName]);
            });
          }
          if (swiper.params && swiper.params.onAny) {
            swiper.onAny(swiper.params.onAny);
          }
          Object.assign(swiper, {
            enabled: swiper.params.enabled,
            el,
            // Classes
            classNames: [],
            // Slides
            slides: [],
            slidesGrid: [],
            snapGrid: [],
            slidesSizesGrid: [],
            // isDirection
            isHorizontal() {
              return swiper.params.direction === "horizontal";
            },
            isVertical() {
              return swiper.params.direction === "vertical";
            },
            // Indexes
            activeIndex: 0,
            realIndex: 0,
            //
            isBeginning: true,
            isEnd: false,
            // Props
            translate: 0,
            previousTranslate: 0,
            progress: 0,
            velocity: 0,
            animating: false,
            cssOverflowAdjustment() {
              return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
            },
            // Locks
            allowSlideNext: swiper.params.allowSlideNext,
            allowSlidePrev: swiper.params.allowSlidePrev,
            // Touch Events
            touchEventsData: {
              isTouched: void 0,
              isMoved: void 0,
              allowTouchCallbacks: void 0,
              touchStartTime: void 0,
              isScrolling: void 0,
              currentTranslate: void 0,
              startTranslate: void 0,
              allowThresholdMove: void 0,
              // Form elements to match
              focusableElements: swiper.params.focusableElements,
              // Last click time
              lastClickTime: 0,
              clickTimeout: void 0,
              // Velocities
              velocities: [],
              allowMomentumBounce: void 0,
              startMoving: void 0,
              pointerId: null,
              touchId: null
            },
            // Clicks
            allowClick: true,
            // Touches
            allowTouchMove: swiper.params.allowTouchMove,
            touches: {
              startX: 0,
              startY: 0,
              currentX: 0,
              currentY: 0,
              diff: 0
            },
            // Images
            imagesToLoad: [],
            imagesLoaded: 0
          });
          swiper.emit("_swiper");
          if (swiper.params.init) {
            swiper.init();
          }
          return swiper;
        }
        getDirectionLabel(property) {
          if (this.isHorizontal()) {
            return property;
          }
          return {
            "width": "height",
            "margin-top": "margin-left",
            "margin-bottom ": "margin-right",
            "margin-left": "margin-top",
            "margin-right": "margin-bottom",
            "padding-left": "padding-top",
            "padding-right": "padding-bottom",
            "marginRight": "marginBottom"
          }[property];
        }
        getSlideIndex(slideEl) {
          const {
            slidesEl,
            params
          } = this;
          const slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
          const firstSlideIndex = elementIndex(slides[0]);
          return elementIndex(slideEl) - firstSlideIndex;
        }
        getSlideIndexByData(index) {
          return this.getSlideIndex(this.slides.filter((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === index)[0]);
        }
        recalcSlides() {
          const swiper = this;
          const {
            slidesEl,
            params
          } = swiper;
          swiper.slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
        }
        enable() {
          const swiper = this;
          if (swiper.enabled)
            return;
          swiper.enabled = true;
          if (swiper.params.grabCursor) {
            swiper.setGrabCursor();
          }
          swiper.emit("enable");
        }
        disable() {
          const swiper = this;
          if (!swiper.enabled)
            return;
          swiper.enabled = false;
          if (swiper.params.grabCursor) {
            swiper.unsetGrabCursor();
          }
          swiper.emit("disable");
        }
        setProgress(progress, speed) {
          const swiper = this;
          progress = Math.min(Math.max(progress, 0), 1);
          const min = swiper.minTranslate();
          const max = swiper.maxTranslate();
          const current = (max - min) * progress + min;
          swiper.translateTo(current, typeof speed === "undefined" ? 0 : speed);
          swiper.updateActiveIndex();
          swiper.updateSlidesClasses();
        }
        emitContainerClasses() {
          const swiper = this;
          if (!swiper.params._emitClasses || !swiper.el)
            return;
          const cls = swiper.el.className.split(" ").filter((className) => {
            return className.indexOf("swiper") === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
          });
          swiper.emit("_containerClasses", cls.join(" "));
        }
        getSlideClasses(slideEl) {
          const swiper = this;
          if (swiper.destroyed)
            return "";
          return slideEl.className.split(" ").filter((className) => {
            return className.indexOf("swiper-slide") === 0 || className.indexOf(swiper.params.slideClass) === 0;
          }).join(" ");
        }
        emitSlidesClasses() {
          const swiper = this;
          if (!swiper.params._emitClasses || !swiper.el)
            return;
          const updates = [];
          swiper.slides.forEach((slideEl) => {
            const classNames = swiper.getSlideClasses(slideEl);
            updates.push({
              slideEl,
              classNames
            });
            swiper.emit("_slideClass", slideEl, classNames);
          });
          swiper.emit("_slideClasses", updates);
        }
        slidesPerViewDynamic(view, exact) {
          if (view === void 0) {
            view = "current";
          }
          if (exact === void 0) {
            exact = false;
          }
          const swiper = this;
          const {
            params,
            slides,
            slidesGrid,
            slidesSizesGrid,
            size: swiperSize,
            activeIndex
          } = swiper;
          let spv = 1;
          if (typeof params.slidesPerView === "number")
            return params.slidesPerView;
          if (params.centeredSlides) {
            let slideSize = slides[activeIndex] ? Math.ceil(slides[activeIndex].swiperSlideSize) : 0;
            let breakLoop;
            for (let i = activeIndex + 1; i < slides.length; i += 1) {
              if (slides[i] && !breakLoop) {
                slideSize += Math.ceil(slides[i].swiperSlideSize);
                spv += 1;
                if (slideSize > swiperSize)
                  breakLoop = true;
              }
            }
            for (let i = activeIndex - 1; i >= 0; i -= 1) {
              if (slides[i] && !breakLoop) {
                slideSize += slides[i].swiperSlideSize;
                spv += 1;
                if (slideSize > swiperSize)
                  breakLoop = true;
              }
            }
          } else {
            if (view === "current") {
              for (let i = activeIndex + 1; i < slides.length; i += 1) {
                const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
                if (slideInView) {
                  spv += 1;
                }
              }
            } else {
              for (let i = activeIndex - 1; i >= 0; i -= 1) {
                const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
                if (slideInView) {
                  spv += 1;
                }
              }
            }
          }
          return spv;
        }
        update() {
          const swiper = this;
          if (!swiper || swiper.destroyed)
            return;
          const {
            snapGrid,
            params
          } = swiper;
          if (params.breakpoints) {
            swiper.setBreakpoint();
          }
          [...swiper.el.querySelectorAll('[loading="lazy"]')].forEach((imageEl) => {
            if (imageEl.complete) {
              processLazyPreloader(swiper, imageEl);
            }
          });
          swiper.updateSize();
          swiper.updateSlides();
          swiper.updateProgress();
          swiper.updateSlidesClasses();
          function setTranslate22() {
            const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
            const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
            swiper.setTranslate(newTranslate);
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
          }
          let translated;
          if (params.freeMode && params.freeMode.enabled && !params.cssMode) {
            setTranslate22();
            if (params.autoHeight) {
              swiper.updateAutoHeight();
            }
          } else {
            if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !params.centeredSlides) {
              const slides = swiper.virtual && params.virtual.enabled ? swiper.virtual.slides : swiper.slides;
              translated = swiper.slideTo(slides.length - 1, 0, false, true);
            } else {
              translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
            }
            if (!translated) {
              setTranslate22();
            }
          }
          if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
            swiper.checkOverflow();
          }
          swiper.emit("update");
        }
        changeDirection(newDirection, needUpdate) {
          if (needUpdate === void 0) {
            needUpdate = true;
          }
          const swiper = this;
          const currentDirection = swiper.params.direction;
          if (!newDirection) {
            newDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";
          }
          if (newDirection === currentDirection || newDirection !== "horizontal" && newDirection !== "vertical") {
            return swiper;
          }
          swiper.el.classList.remove(`${swiper.params.containerModifierClass}${currentDirection}`);
          swiper.el.classList.add(`${swiper.params.containerModifierClass}${newDirection}`);
          swiper.emitContainerClasses();
          swiper.params.direction = newDirection;
          swiper.slides.forEach((slideEl) => {
            if (newDirection === "vertical") {
              slideEl.style.width = "";
            } else {
              slideEl.style.height = "";
            }
          });
          swiper.emit("changeDirection");
          if (needUpdate)
            swiper.update();
          return swiper;
        }
        changeLanguageDirection(direction) {
          const swiper = this;
          if (swiper.rtl && direction === "rtl" || !swiper.rtl && direction === "ltr")
            return;
          swiper.rtl = direction === "rtl";
          swiper.rtlTranslate = swiper.params.direction === "horizontal" && swiper.rtl;
          if (swiper.rtl) {
            swiper.el.classList.add(`${swiper.params.containerModifierClass}rtl`);
            swiper.el.dir = "rtl";
          } else {
            swiper.el.classList.remove(`${swiper.params.containerModifierClass}rtl`);
            swiper.el.dir = "ltr";
          }
          swiper.update();
        }
        mount(element) {
          const swiper = this;
          if (swiper.mounted)
            return true;
          let el = element || swiper.params.el;
          if (typeof el === "string") {
            el = document.querySelector(el);
          }
          if (!el) {
            return false;
          }
          el.swiper = swiper;
          if (el.parentNode && el.parentNode.host && el.parentNode.host.nodeName === swiper.params.swiperElementNodeName.toUpperCase()) {
            swiper.isElement = true;
          }
          const getWrapperSelector = () => {
            return `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
          };
          const getWrapper = () => {
            if (el && el.shadowRoot && el.shadowRoot.querySelector) {
              const res = el.shadowRoot.querySelector(getWrapperSelector());
              return res;
            }
            return elementChildren(el, getWrapperSelector())[0];
          };
          let wrapperEl = getWrapper();
          if (!wrapperEl && swiper.params.createElements) {
            wrapperEl = createElement2("div", swiper.params.wrapperClass);
            el.append(wrapperEl);
            elementChildren(el, `.${swiper.params.slideClass}`).forEach((slideEl) => {
              wrapperEl.append(slideEl);
            });
          }
          Object.assign(swiper, {
            el,
            wrapperEl,
            slidesEl: swiper.isElement && !el.parentNode.host.slideSlots ? el.parentNode.host : wrapperEl,
            hostEl: swiper.isElement ? el.parentNode.host : el,
            mounted: true,
            // RTL
            rtl: el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl",
            rtlTranslate: swiper.params.direction === "horizontal" && (el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl"),
            wrongRTL: elementStyle(wrapperEl, "display") === "-webkit-box"
          });
          return true;
        }
        init(el) {
          const swiper = this;
          if (swiper.initialized)
            return swiper;
          const mounted = swiper.mount(el);
          if (mounted === false)
            return swiper;
          swiper.emit("beforeInit");
          if (swiper.params.breakpoints) {
            swiper.setBreakpoint();
          }
          swiper.addClasses();
          swiper.updateSize();
          swiper.updateSlides();
          if (swiper.params.watchOverflow) {
            swiper.checkOverflow();
          }
          if (swiper.params.grabCursor && swiper.enabled) {
            swiper.setGrabCursor();
          }
          if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
            swiper.slideTo(swiper.params.initialSlide + swiper.virtual.slidesBefore, 0, swiper.params.runCallbacksOnInit, false, true);
          } else {
            swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
          }
          if (swiper.params.loop) {
            swiper.loopCreate();
          }
          swiper.attachEvents();
          const lazyElements = [...swiper.el.querySelectorAll('[loading="lazy"]')];
          if (swiper.isElement) {
            lazyElements.push(...swiper.hostEl.querySelectorAll('[loading="lazy"]'));
          }
          lazyElements.forEach((imageEl) => {
            if (imageEl.complete) {
              processLazyPreloader(swiper, imageEl);
            } else {
              imageEl.addEventListener("load", (e) => {
                processLazyPreloader(swiper, e.target);
              });
            }
          });
          preload(swiper);
          swiper.initialized = true;
          preload(swiper);
          swiper.emit("init");
          swiper.emit("afterInit");
          return swiper;
        }
        destroy(deleteInstance, cleanStyles) {
          if (deleteInstance === void 0) {
            deleteInstance = true;
          }
          if (cleanStyles === void 0) {
            cleanStyles = true;
          }
          const swiper = this;
          const {
            params,
            el,
            wrapperEl,
            slides
          } = swiper;
          if (typeof swiper.params === "undefined" || swiper.destroyed) {
            return null;
          }
          swiper.emit("beforeDestroy");
          swiper.initialized = false;
          swiper.detachEvents();
          if (params.loop) {
            swiper.loopDestroy();
          }
          if (cleanStyles) {
            swiper.removeClasses();
            if (el && typeof el !== "string") {
              el.removeAttribute("style");
            }
            if (wrapperEl) {
              wrapperEl.removeAttribute("style");
            }
            if (slides && slides.length) {
              slides.forEach((slideEl) => {
                slideEl.classList.remove(params.slideVisibleClass, params.slideFullyVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
                slideEl.removeAttribute("style");
                slideEl.removeAttribute("data-swiper-slide-index");
              });
            }
          }
          swiper.emit("destroy");
          Object.keys(swiper.eventsListeners).forEach((eventName) => {
            swiper.off(eventName);
          });
          if (deleteInstance !== false) {
            if (swiper.el && typeof swiper.el !== "string") {
              swiper.el.swiper = null;
            }
            deleteProps(swiper);
          }
          swiper.destroyed = true;
          return null;
        }
        static extendDefaults(newDefaults) {
          extend2(extendedDefaults, newDefaults);
        }
        static get extendedDefaults() {
          return extendedDefaults;
        }
        static get defaults() {
          return defaults;
        }
        static installModule(mod) {
          if (!_Swiper2.prototype.__modules__)
            _Swiper2.prototype.__modules__ = [];
          const modules = _Swiper2.prototype.__modules__;
          if (typeof mod === "function" && modules.indexOf(mod) < 0) {
            modules.push(mod);
          }
        }
        static use(module) {
          if (Array.isArray(module)) {
            module.forEach((m) => _Swiper2.installModule(m));
            return _Swiper2;
          }
          _Swiper2.installModule(module);
          return _Swiper2;
        }
      };
      Object.keys(prototypes).forEach((prototypeGroup) => {
        Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
          Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
        });
      });
      Swiper.use([Resize, Observer]);
    }
  });
  var init_swiper = __esm({
    "../../node_modules/swiper/swiper.mjs"() {
      init_swiper_core();
    }
  });
  var init_virtual = __esm({
    "../../node_modules/swiper/modules/virtual.mjs"() {
      init_ssr_window_esm();
      init_utils();
    }
  });
  function Keyboard(_ref) {
    let {
      swiper,
      extendParams,
      on,
      emit
    } = _ref;
    const document2 = getDocument();
    const window2 = getWindow();
    swiper.keyboard = {
      enabled: false
    };
    extendParams({
      keyboard: {
        enabled: false,
        onlyInViewport: true,
        pageUpDown: true
      }
    });
    function handle(event2) {
      if (!swiper.enabled)
        return;
      const {
        rtlTranslate: rtl
      } = swiper;
      let e = event2;
      if (e.originalEvent)
        e = e.originalEvent;
      const kc = e.keyCode || e.charCode;
      const pageUpDown = swiper.params.keyboard.pageUpDown;
      const isPageUp = pageUpDown && kc === 33;
      const isPageDown = pageUpDown && kc === 34;
      const isArrowLeft = kc === 37;
      const isArrowRight = kc === 39;
      const isArrowUp = kc === 38;
      const isArrowDown = kc === 40;
      if (!swiper.allowSlideNext && (swiper.isHorizontal() && isArrowRight || swiper.isVertical() && isArrowDown || isPageDown)) {
        return false;
      }
      if (!swiper.allowSlidePrev && (swiper.isHorizontal() && isArrowLeft || swiper.isVertical() && isArrowUp || isPageUp)) {
        return false;
      }
      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
        return void 0;
      }
      if (document2.activeElement && document2.activeElement.nodeName && (document2.activeElement.nodeName.toLowerCase() === "input" || document2.activeElement.nodeName.toLowerCase() === "textarea")) {
        return void 0;
      }
      if (swiper.params.keyboard.onlyInViewport && (isPageUp || isPageDown || isArrowLeft || isArrowRight || isArrowUp || isArrowDown)) {
        let inView = false;
        if (elementParents(swiper.el, `.${swiper.params.slideClass}, swiper-slide`).length > 0 && elementParents(swiper.el, `.${swiper.params.slideActiveClass}`).length === 0) {
          return void 0;
        }
        const el = swiper.el;
        const swiperWidth = el.clientWidth;
        const swiperHeight = el.clientHeight;
        const windowWidth = window2.innerWidth;
        const windowHeight = window2.innerHeight;
        const swiperOffset = elementOffset(el);
        if (rtl)
          swiperOffset.left -= el.scrollLeft;
        const swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiperWidth, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiperHeight], [swiperOffset.left + swiperWidth, swiperOffset.top + swiperHeight]];
        for (let i = 0; i < swiperCoord.length; i += 1) {
          const point = swiperCoord[i];
          if (point[0] >= 0 && point[0] <= windowWidth && point[1] >= 0 && point[1] <= windowHeight) {
            if (point[0] === 0 && point[1] === 0)
              continue;
            inView = true;
          }
        }
        if (!inView)
          return void 0;
      }
      if (swiper.isHorizontal()) {
        if (isPageUp || isPageDown || isArrowLeft || isArrowRight) {
          if (e.preventDefault)
            e.preventDefault();
          else
            e.returnValue = false;
        }
        if ((isPageDown || isArrowRight) && !rtl || (isPageUp || isArrowLeft) && rtl)
          swiper.slideNext();
        if ((isPageUp || isArrowLeft) && !rtl || (isPageDown || isArrowRight) && rtl)
          swiper.slidePrev();
      } else {
        if (isPageUp || isPageDown || isArrowUp || isArrowDown) {
          if (e.preventDefault)
            e.preventDefault();
          else
            e.returnValue = false;
        }
        if (isPageDown || isArrowDown)
          swiper.slideNext();
        if (isPageUp || isArrowUp)
          swiper.slidePrev();
      }
      emit("keyPress", kc);
      return void 0;
    }
    function enable() {
      if (swiper.keyboard.enabled)
        return;
      document2.addEventListener("keydown", handle);
      swiper.keyboard.enabled = true;
    }
    function disable() {
      if (!swiper.keyboard.enabled)
        return;
      document2.removeEventListener("keydown", handle);
      swiper.keyboard.enabled = false;
    }
    on("init", () => {
      if (swiper.params.keyboard.enabled) {
        enable();
      }
    });
    on("destroy", () => {
      if (swiper.keyboard.enabled) {
        disable();
      }
    });
    Object.assign(swiper.keyboard, {
      enable,
      disable
    });
  }
  var init_keyboard = __esm({
    "../../node_modules/swiper/modules/keyboard.mjs"() {
      init_ssr_window_esm();
      init_utils();
    }
  });
  function Mousewheel(_ref) {
    let {
      swiper,
      extendParams,
      on,
      emit
    } = _ref;
    const window2 = getWindow();
    extendParams({
      mousewheel: {
        enabled: false,
        releaseOnEdges: false,
        invert: false,
        forceToAxis: false,
        sensitivity: 1,
        eventsTarget: "container",
        thresholdDelta: null,
        thresholdTime: null,
        noMousewheelClass: "swiper-no-mousewheel"
      }
    });
    swiper.mousewheel = {
      enabled: false
    };
    let timeout;
    let lastScrollTime = now();
    let lastEventBeforeSnap;
    const recentWheelEvents = [];
    function normalize(e) {
      const PIXEL_STEP = 10;
      const LINE_HEIGHT = 40;
      const PAGE_HEIGHT = 800;
      let sX = 0;
      let sY = 0;
      let pX = 0;
      let pY = 0;
      if ("detail" in e) {
        sY = e.detail;
      }
      if ("wheelDelta" in e) {
        sY = -e.wheelDelta / 120;
      }
      if ("wheelDeltaY" in e) {
        sY = -e.wheelDeltaY / 120;
      }
      if ("wheelDeltaX" in e) {
        sX = -e.wheelDeltaX / 120;
      }
      if ("axis" in e && e.axis === e.HORIZONTAL_AXIS) {
        sX = sY;
        sY = 0;
      }
      pX = sX * PIXEL_STEP;
      pY = sY * PIXEL_STEP;
      if ("deltaY" in e) {
        pY = e.deltaY;
      }
      if ("deltaX" in e) {
        pX = e.deltaX;
      }
      if (e.shiftKey && !pX) {
        pX = pY;
        pY = 0;
      }
      if ((pX || pY) && e.deltaMode) {
        if (e.deltaMode === 1) {
          pX *= LINE_HEIGHT;
          pY *= LINE_HEIGHT;
        } else {
          pX *= PAGE_HEIGHT;
          pY *= PAGE_HEIGHT;
        }
      }
      if (pX && !sX) {
        sX = pX < 1 ? -1 : 1;
      }
      if (pY && !sY) {
        sY = pY < 1 ? -1 : 1;
      }
      return {
        spinX: sX,
        spinY: sY,
        pixelX: pX,
        pixelY: pY
      };
    }
    function handleMouseEnter() {
      if (!swiper.enabled)
        return;
      swiper.mouseEntered = true;
    }
    function handleMouseLeave() {
      if (!swiper.enabled)
        return;
      swiper.mouseEntered = false;
    }
    function animateSlider(newEvent) {
      if (swiper.params.mousewheel.thresholdDelta && newEvent.delta < swiper.params.mousewheel.thresholdDelta) {
        return false;
      }
      if (swiper.params.mousewheel.thresholdTime && now() - lastScrollTime < swiper.params.mousewheel.thresholdTime) {
        return false;
      }
      if (newEvent.delta >= 6 && now() - lastScrollTime < 60) {
        return true;
      }
      if (newEvent.direction < 0) {
        if ((!swiper.isEnd || swiper.params.loop) && !swiper.animating) {
          swiper.slideNext();
          emit("scroll", newEvent.raw);
        }
      } else if ((!swiper.isBeginning || swiper.params.loop) && !swiper.animating) {
        swiper.slidePrev();
        emit("scroll", newEvent.raw);
      }
      lastScrollTime = new window2.Date().getTime();
      return false;
    }
    function releaseScroll(newEvent) {
      const params = swiper.params.mousewheel;
      if (newEvent.direction < 0) {
        if (swiper.isEnd && !swiper.params.loop && params.releaseOnEdges) {
          return true;
        }
      } else if (swiper.isBeginning && !swiper.params.loop && params.releaseOnEdges) {
        return true;
      }
      return false;
    }
    function handle(event2) {
      let e = event2;
      let disableParentSwiper = true;
      if (!swiper.enabled)
        return;
      if (event2.target.closest(`.${swiper.params.mousewheel.noMousewheelClass}`))
        return;
      const params = swiper.params.mousewheel;
      if (swiper.params.cssMode) {
        e.preventDefault();
      }
      let targetEl = swiper.el;
      if (swiper.params.mousewheel.eventsTarget !== "container") {
        targetEl = document.querySelector(swiper.params.mousewheel.eventsTarget);
      }
      const targetElContainsTarget = targetEl && targetEl.contains(e.target);
      if (!swiper.mouseEntered && !targetElContainsTarget && !params.releaseOnEdges)
        return true;
      if (e.originalEvent)
        e = e.originalEvent;
      let delta = 0;
      const rtlFactor = swiper.rtlTranslate ? -1 : 1;
      const data = normalize(e);
      if (params.forceToAxis) {
        if (swiper.isHorizontal()) {
          if (Math.abs(data.pixelX) > Math.abs(data.pixelY))
            delta = -data.pixelX * rtlFactor;
          else
            return true;
        } else if (Math.abs(data.pixelY) > Math.abs(data.pixelX))
          delta = -data.pixelY;
        else
          return true;
      } else {
        delta = Math.abs(data.pixelX) > Math.abs(data.pixelY) ? -data.pixelX * rtlFactor : -data.pixelY;
      }
      if (delta === 0)
        return true;
      if (params.invert)
        delta = -delta;
      let positions = swiper.getTranslate() + delta * params.sensitivity;
      if (positions >= swiper.minTranslate())
        positions = swiper.minTranslate();
      if (positions <= swiper.maxTranslate())
        positions = swiper.maxTranslate();
      disableParentSwiper = swiper.params.loop ? true : !(positions === swiper.minTranslate() || positions === swiper.maxTranslate());
      if (disableParentSwiper && swiper.params.nested)
        e.stopPropagation();
      if (!swiper.params.freeMode || !swiper.params.freeMode.enabled) {
        const newEvent = {
          time: now(),
          delta: Math.abs(delta),
          direction: Math.sign(delta),
          raw: event2
        };
        if (recentWheelEvents.length >= 2) {
          recentWheelEvents.shift();
        }
        const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : void 0;
        recentWheelEvents.push(newEvent);
        if (prevEvent) {
          if (newEvent.direction !== prevEvent.direction || newEvent.delta > prevEvent.delta || newEvent.time > prevEvent.time + 150) {
            animateSlider(newEvent);
          }
        } else {
          animateSlider(newEvent);
        }
        if (releaseScroll(newEvent)) {
          return true;
        }
      } else {
        const newEvent = {
          time: now(),
          delta: Math.abs(delta),
          direction: Math.sign(delta)
        };
        const ignoreWheelEvents = lastEventBeforeSnap && newEvent.time < lastEventBeforeSnap.time + 500 && newEvent.delta <= lastEventBeforeSnap.delta && newEvent.direction === lastEventBeforeSnap.direction;
        if (!ignoreWheelEvents) {
          lastEventBeforeSnap = void 0;
          let position = swiper.getTranslate() + delta * params.sensitivity;
          const wasBeginning = swiper.isBeginning;
          const wasEnd = swiper.isEnd;
          if (position >= swiper.minTranslate())
            position = swiper.minTranslate();
          if (position <= swiper.maxTranslate())
            position = swiper.maxTranslate();
          swiper.setTransition(0);
          swiper.setTranslate(position);
          swiper.updateProgress();
          swiper.updateActiveIndex();
          swiper.updateSlidesClasses();
          if (!wasBeginning && swiper.isBeginning || !wasEnd && swiper.isEnd) {
            swiper.updateSlidesClasses();
          }
          if (swiper.params.loop) {
            swiper.loopFix({
              direction: newEvent.direction < 0 ? "next" : "prev",
              byMousewheel: true
            });
          }
          if (swiper.params.freeMode.sticky) {
            clearTimeout(timeout);
            timeout = void 0;
            if (recentWheelEvents.length >= 15) {
              recentWheelEvents.shift();
            }
            const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : void 0;
            const firstEvent = recentWheelEvents[0];
            recentWheelEvents.push(newEvent);
            if (prevEvent && (newEvent.delta > prevEvent.delta || newEvent.direction !== prevEvent.direction)) {
              recentWheelEvents.splice(0);
            } else if (recentWheelEvents.length >= 15 && newEvent.time - firstEvent.time < 500 && firstEvent.delta - newEvent.delta >= 1 && newEvent.delta <= 6) {
              const snapToThreshold = delta > 0 ? 0.8 : 0.2;
              lastEventBeforeSnap = newEvent;
              recentWheelEvents.splice(0);
              timeout = nextTick(() => {
                if (swiper.destroyed || !swiper.params)
                  return;
                swiper.slideToClosest(swiper.params.speed, true, void 0, snapToThreshold);
              }, 0);
            }
            if (!timeout) {
              timeout = nextTick(() => {
                if (swiper.destroyed || !swiper.params)
                  return;
                const snapToThreshold = 0.5;
                lastEventBeforeSnap = newEvent;
                recentWheelEvents.splice(0);
                swiper.slideToClosest(swiper.params.speed, true, void 0, snapToThreshold);
              }, 500);
            }
          }
          if (!ignoreWheelEvents)
            emit("scroll", e);
          if (swiper.params.autoplay && swiper.params.autoplayDisableOnInteraction)
            swiper.autoplay.stop();
          if (params.releaseOnEdges && (position === swiper.minTranslate() || position === swiper.maxTranslate())) {
            return true;
          }
        }
      }
      if (e.preventDefault)
        e.preventDefault();
      else
        e.returnValue = false;
      return false;
    }
    function events22(method) {
      let targetEl = swiper.el;
      if (swiper.params.mousewheel.eventsTarget !== "container") {
        targetEl = document.querySelector(swiper.params.mousewheel.eventsTarget);
      }
      targetEl[method]("mouseenter", handleMouseEnter);
      targetEl[method]("mouseleave", handleMouseLeave);
      targetEl[method]("wheel", handle);
    }
    function enable() {
      if (swiper.params.cssMode) {
        swiper.wrapperEl.removeEventListener("wheel", handle);
        return true;
      }
      if (swiper.mousewheel.enabled)
        return false;
      events22("addEventListener");
      swiper.mousewheel.enabled = true;
      return true;
    }
    function disable() {
      if (swiper.params.cssMode) {
        swiper.wrapperEl.addEventListener(event, handle);
        return true;
      }
      if (!swiper.mousewheel.enabled)
        return false;
      events22("removeEventListener");
      swiper.mousewheel.enabled = false;
      return true;
    }
    on("init", () => {
      if (!swiper.params.mousewheel.enabled && swiper.params.cssMode) {
        disable();
      }
      if (swiper.params.mousewheel.enabled)
        enable();
    });
    on("destroy", () => {
      if (swiper.params.cssMode) {
        enable();
      }
      if (swiper.mousewheel.enabled)
        disable();
    });
    Object.assign(swiper.mousewheel, {
      enable,
      disable
    });
  }
  var init_mousewheel = __esm({
    "../../node_modules/swiper/modules/mousewheel.mjs"() {
      init_ssr_window_esm();
      init_utils();
    }
  });
  function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
    if (swiper.params.createElements) {
      Object.keys(checkProps).forEach((key) => {
        if (!params[key] && params.auto === true) {
          let element = elementChildren(swiper.el, `.${checkProps[key]}`)[0];
          if (!element) {
            element = createElement2("div", checkProps[key]);
            element.className = checkProps[key];
            swiper.el.append(element);
          }
          params[key] = element;
          originalParams[key] = element;
        }
      });
    }
    return params;
  }
  var init_create_element_if_not_defined = __esm({
    "../../node_modules/swiper/shared/create-element-if-not-defined.mjs"() {
      init_utils();
    }
  });
  function Navigation(_ref) {
    let {
      swiper,
      extendParams,
      on,
      emit
    } = _ref;
    extendParams({
      navigation: {
        nextEl: null,
        prevEl: null,
        hideOnClick: false,
        disabledClass: "swiper-button-disabled",
        hiddenClass: "swiper-button-hidden",
        lockClass: "swiper-button-lock",
        navigationDisabledClass: "swiper-navigation-disabled"
      }
    });
    swiper.navigation = {
      nextEl: null,
      prevEl: null
    };
    function getEl(el) {
      let res;
      if (el && typeof el === "string" && swiper.isElement) {
        res = swiper.el.querySelector(el) || swiper.hostEl.querySelector(el);
        if (res)
          return res;
      }
      if (el) {
        if (typeof el === "string")
          res = [...document.querySelectorAll(el)];
        if (swiper.params.uniqueNavElements && typeof el === "string" && res && res.length > 1 && swiper.el.querySelectorAll(el).length === 1) {
          res = swiper.el.querySelector(el);
        } else if (res && res.length === 1) {
          res = res[0];
        }
      }
      if (el && !res)
        return el;
      return res;
    }
    function toggleEl(el, disabled) {
      const params = swiper.params.navigation;
      el = makeElementsArray(el);
      el.forEach((subEl) => {
        if (subEl) {
          subEl.classList[disabled ? "add" : "remove"](...params.disabledClass.split(" "));
          if (subEl.tagName === "BUTTON")
            subEl.disabled = disabled;
          if (swiper.params.watchOverflow && swiper.enabled) {
            subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
          }
        }
      });
    }
    function update22() {
      const {
        nextEl,
        prevEl
      } = swiper.navigation;
      if (swiper.params.loop) {
        toggleEl(prevEl, false);
        toggleEl(nextEl, false);
        return;
      }
      toggleEl(prevEl, swiper.isBeginning && !swiper.params.rewind);
      toggleEl(nextEl, swiper.isEnd && !swiper.params.rewind);
    }
    function onPrevClick(e) {
      e.preventDefault();
      if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind)
        return;
      swiper.slidePrev();
      emit("navigationPrev");
    }
    function onNextClick(e) {
      e.preventDefault();
      if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind)
        return;
      swiper.slideNext();
      emit("navigationNext");
    }
    function init() {
      const params = swiper.params.navigation;
      swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
        nextEl: "swiper-button-next",
        prevEl: "swiper-button-prev"
      });
      if (!(params.nextEl || params.prevEl))
        return;
      let nextEl = getEl(params.nextEl);
      let prevEl = getEl(params.prevEl);
      Object.assign(swiper.navigation, {
        nextEl,
        prevEl
      });
      nextEl = makeElementsArray(nextEl);
      prevEl = makeElementsArray(prevEl);
      const initButton = (el, dir) => {
        if (el) {
          el.addEventListener("click", dir === "next" ? onNextClick : onPrevClick);
        }
        if (!swiper.enabled && el) {
          el.classList.add(...params.lockClass.split(" "));
        }
      };
      nextEl.forEach((el) => initButton(el, "next"));
      prevEl.forEach((el) => initButton(el, "prev"));
    }
    function destroy() {
      let {
        nextEl,
        prevEl
      } = swiper.navigation;
      nextEl = makeElementsArray(nextEl);
      prevEl = makeElementsArray(prevEl);
      const destroyButton = (el, dir) => {
        el.removeEventListener("click", dir === "next" ? onNextClick : onPrevClick);
        el.classList.remove(...swiper.params.navigation.disabledClass.split(" "));
      };
      nextEl.forEach((el) => destroyButton(el, "next"));
      prevEl.forEach((el) => destroyButton(el, "prev"));
    }
    on("init", () => {
      if (swiper.params.navigation.enabled === false) {
        disable();
      } else {
        init();
        update22();
      }
    });
    on("toEdge fromEdge lock unlock", () => {
      update22();
    });
    on("destroy", () => {
      destroy();
    });
    on("enable disable", () => {
      let {
        nextEl,
        prevEl
      } = swiper.navigation;
      nextEl = makeElementsArray(nextEl);
      prevEl = makeElementsArray(prevEl);
      if (swiper.enabled) {
        update22();
        return;
      }
      [...nextEl, ...prevEl].filter((el) => !!el).forEach((el) => el.classList.add(swiper.params.navigation.lockClass));
    });
    on("click", (_s, e) => {
      let {
        nextEl,
        prevEl
      } = swiper.navigation;
      nextEl = makeElementsArray(nextEl);
      prevEl = makeElementsArray(prevEl);
      const targetEl = e.target;
      let targetIsButton = prevEl.includes(targetEl) || nextEl.includes(targetEl);
      if (swiper.isElement && !targetIsButton) {
        const path = e.path || e.composedPath && e.composedPath();
        if (path) {
          targetIsButton = path.find((pathEl) => nextEl.includes(pathEl) || prevEl.includes(pathEl));
        }
      }
      if (swiper.params.navigation.hideOnClick && !targetIsButton) {
        if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl)))
          return;
        let isHidden;
        if (nextEl.length) {
          isHidden = nextEl[0].classList.contains(swiper.params.navigation.hiddenClass);
        } else if (prevEl.length) {
          isHidden = prevEl[0].classList.contains(swiper.params.navigation.hiddenClass);
        }
        if (isHidden === true) {
          emit("navigationShow");
        } else {
          emit("navigationHide");
        }
        [...nextEl, ...prevEl].filter((el) => !!el).forEach((el) => el.classList.toggle(swiper.params.navigation.hiddenClass));
      }
    });
    const enable = () => {
      swiper.el.classList.remove(...swiper.params.navigation.navigationDisabledClass.split(" "));
      init();
      update22();
    };
    const disable = () => {
      swiper.el.classList.add(...swiper.params.navigation.navigationDisabledClass.split(" "));
      destroy();
    };
    Object.assign(swiper.navigation, {
      enable,
      disable,
      update: update22,
      init,
      destroy
    });
  }
  var init_navigation = __esm({
    "../../node_modules/swiper/modules/navigation.mjs"() {
      init_create_element_if_not_defined();
      init_utils();
    }
  });
  var init_classes_to_selector = __esm({
    "../../node_modules/swiper/shared/classes-to-selector.mjs"() {
    }
  });
  var init_pagination = __esm({
    "../../node_modules/swiper/modules/pagination.mjs"() {
      init_classes_to_selector();
      init_create_element_if_not_defined();
      init_utils();
    }
  });
  var init_scrollbar = __esm({
    "../../node_modules/swiper/modules/scrollbar.mjs"() {
      init_ssr_window_esm();
      init_utils();
      init_create_element_if_not_defined();
      init_classes_to_selector();
    }
  });
  var init_parallax = __esm({
    "../../node_modules/swiper/modules/parallax.mjs"() {
      init_utils();
    }
  });
  var init_zoom = __esm({
    "../../node_modules/swiper/modules/zoom.mjs"() {
      init_ssr_window_esm();
      init_utils();
    }
  });
  var init_controller = __esm({
    "../../node_modules/swiper/modules/controller.mjs"() {
      init_utils();
    }
  });
  var init_a11y = __esm({
    "../../node_modules/swiper/modules/a11y.mjs"() {
      init_ssr_window_esm();
      init_classes_to_selector();
      init_utils();
    }
  });
  var init_history = __esm({
    "../../node_modules/swiper/modules/history.mjs"() {
      init_ssr_window_esm();
    }
  });
  var init_hash_navigation = __esm({
    "../../node_modules/swiper/modules/hash-navigation.mjs"() {
      init_ssr_window_esm();
      init_utils();
    }
  });
  var init_autoplay = __esm({
    "../../node_modules/swiper/modules/autoplay.mjs"() {
      init_ssr_window_esm();
    }
  });
  var init_thumbs = __esm({
    "../../node_modules/swiper/modules/thumbs.mjs"() {
      init_ssr_window_esm();
      init_utils();
    }
  });
  var init_free_mode = __esm({
    "../../node_modules/swiper/modules/free-mode.mjs"() {
      init_utils();
    }
  });
  var init_grid = __esm({
    "../../node_modules/swiper/modules/grid.mjs"() {
    }
  });
  function appendSlide(slides) {
    const swiper = this;
    const {
      params,
      slidesEl
    } = swiper;
    if (params.loop) {
      swiper.loopDestroy();
    }
    const appendElement = (slideEl) => {
      if (typeof slideEl === "string") {
        const tempDOM = document.createElement("div");
        tempDOM.innerHTML = slideEl;
        slidesEl.append(tempDOM.children[0]);
        tempDOM.innerHTML = "";
      } else {
        slidesEl.append(slideEl);
      }
    };
    if (typeof slides === "object" && "length" in slides) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i])
          appendElement(slides[i]);
      }
    } else {
      appendElement(slides);
    }
    swiper.recalcSlides();
    if (params.loop) {
      swiper.loopCreate();
    }
    if (!params.observer || swiper.isElement) {
      swiper.update();
    }
  }
  function prependSlide(slides) {
    const swiper = this;
    const {
      params,
      activeIndex,
      slidesEl
    } = swiper;
    if (params.loop) {
      swiper.loopDestroy();
    }
    let newActiveIndex = activeIndex + 1;
    const prependElement = (slideEl) => {
      if (typeof slideEl === "string") {
        const tempDOM = document.createElement("div");
        tempDOM.innerHTML = slideEl;
        slidesEl.prepend(tempDOM.children[0]);
        tempDOM.innerHTML = "";
      } else {
        slidesEl.prepend(slideEl);
      }
    };
    if (typeof slides === "object" && "length" in slides) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i])
          prependElement(slides[i]);
      }
      newActiveIndex = activeIndex + slides.length;
    } else {
      prependElement(slides);
    }
    swiper.recalcSlides();
    if (params.loop) {
      swiper.loopCreate();
    }
    if (!params.observer || swiper.isElement) {
      swiper.update();
    }
    swiper.slideTo(newActiveIndex, 0, false);
  }
  function addSlide(index, slides) {
    const swiper = this;
    const {
      params,
      activeIndex,
      slidesEl
    } = swiper;
    let activeIndexBuffer = activeIndex;
    if (params.loop) {
      activeIndexBuffer -= swiper.loopedSlides;
      swiper.loopDestroy();
      swiper.recalcSlides();
    }
    const baseLength = swiper.slides.length;
    if (index <= 0) {
      swiper.prependSlide(slides);
      return;
    }
    if (index >= baseLength) {
      swiper.appendSlide(slides);
      return;
    }
    let newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;
    const slidesBuffer = [];
    for (let i = baseLength - 1; i >= index; i -= 1) {
      const currentSlide = swiper.slides[i];
      currentSlide.remove();
      slidesBuffer.unshift(currentSlide);
    }
    if (typeof slides === "object" && "length" in slides) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i])
          slidesEl.append(slides[i]);
      }
      newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + slides.length : activeIndexBuffer;
    } else {
      slidesEl.append(slides);
    }
    for (let i = 0; i < slidesBuffer.length; i += 1) {
      slidesEl.append(slidesBuffer[i]);
    }
    swiper.recalcSlides();
    if (params.loop) {
      swiper.loopCreate();
    }
    if (!params.observer || swiper.isElement) {
      swiper.update();
    }
    if (params.loop) {
      swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
    } else {
      swiper.slideTo(newActiveIndex, 0, false);
    }
  }
  function removeSlide(slidesIndexes) {
    const swiper = this;
    const {
      params,
      activeIndex
    } = swiper;
    let activeIndexBuffer = activeIndex;
    if (params.loop) {
      activeIndexBuffer -= swiper.loopedSlides;
      swiper.loopDestroy();
    }
    let newActiveIndex = activeIndexBuffer;
    let indexToRemove;
    if (typeof slidesIndexes === "object" && "length" in slidesIndexes) {
      for (let i = 0; i < slidesIndexes.length; i += 1) {
        indexToRemove = slidesIndexes[i];
        if (swiper.slides[indexToRemove])
          swiper.slides[indexToRemove].remove();
        if (indexToRemove < newActiveIndex)
          newActiveIndex -= 1;
      }
      newActiveIndex = Math.max(newActiveIndex, 0);
    } else {
      indexToRemove = slidesIndexes;
      if (swiper.slides[indexToRemove])
        swiper.slides[indexToRemove].remove();
      if (indexToRemove < newActiveIndex)
        newActiveIndex -= 1;
      newActiveIndex = Math.max(newActiveIndex, 0);
    }
    swiper.recalcSlides();
    if (params.loop) {
      swiper.loopCreate();
    }
    if (!params.observer || swiper.isElement) {
      swiper.update();
    }
    if (params.loop) {
      swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
    } else {
      swiper.slideTo(newActiveIndex, 0, false);
    }
  }
  function removeAllSlides() {
    const swiper = this;
    const slidesIndexes = [];
    for (let i = 0; i < swiper.slides.length; i += 1) {
      slidesIndexes.push(i);
    }
    swiper.removeSlide(slidesIndexes);
  }
  function Manipulation(_ref) {
    let {
      swiper
    } = _ref;
    Object.assign(swiper, {
      appendSlide: appendSlide.bind(swiper),
      prependSlide: prependSlide.bind(swiper),
      addSlide: addSlide.bind(swiper),
      removeSlide: removeSlide.bind(swiper),
      removeAllSlides: removeAllSlides.bind(swiper)
    });
  }
  var init_manipulation = __esm({
    "../../node_modules/swiper/modules/manipulation.mjs"() {
    }
  });
  var init_effect_init = __esm({
    "../../node_modules/swiper/shared/effect-init.mjs"() {
    }
  });
  var init_effect_target = __esm({
    "../../node_modules/swiper/shared/effect-target.mjs"() {
      init_utils();
    }
  });
  var init_effect_virtual_transition_end = __esm({
    "../../node_modules/swiper/shared/effect-virtual-transition-end.mjs"() {
      init_utils();
    }
  });
  var init_effect_fade = __esm({
    "../../node_modules/swiper/modules/effect-fade.mjs"() {
      init_effect_init();
      init_effect_target();
      init_effect_virtual_transition_end();
      init_utils();
    }
  });
  var init_effect_cube = __esm({
    "../../node_modules/swiper/modules/effect-cube.mjs"() {
      init_effect_init();
      init_utils();
    }
  });
  var init_create_shadow = __esm({
    "../../node_modules/swiper/shared/create-shadow.mjs"() {
      init_utils();
    }
  });
  var init_effect_flip = __esm({
    "../../node_modules/swiper/modules/effect-flip.mjs"() {
      init_create_shadow();
      init_effect_init();
      init_effect_target();
      init_effect_virtual_transition_end();
      init_utils();
    }
  });
  var init_effect_coverflow = __esm({
    "../../node_modules/swiper/modules/effect-coverflow.mjs"() {
      init_create_shadow();
      init_effect_init();
      init_effect_target();
      init_utils();
    }
  });
  var init_effect_creative = __esm({
    "../../node_modules/swiper/modules/effect-creative.mjs"() {
      init_create_shadow();
      init_effect_init();
      init_effect_target();
      init_effect_virtual_transition_end();
      init_utils();
    }
  });
  var init_effect_cards = __esm({
    "../../node_modules/swiper/modules/effect-cards.mjs"() {
      init_create_shadow();
      init_effect_init();
      init_effect_target();
      init_effect_virtual_transition_end();
      init_utils();
    }
  });
  var init_modules = __esm({
    "../../node_modules/swiper/modules/index.mjs"() {
      init_virtual();
      init_keyboard();
      init_mousewheel();
      init_navigation();
      init_pagination();
      init_scrollbar();
      init_parallax();
      init_zoom();
      init_controller();
      init_a11y();
      init_history();
      init_hash_navigation();
      init_autoplay();
      init_thumbs();
      init_free_mode();
      init_grid();
      init_manipulation();
      init_effect_fade();
      init_effect_cube();
      init_effect_flip();
      init_effect_coverflow();
      init_effect_creative();
      init_effect_cards();
    }
  });
  function initializeSwiper({
    id,
    widgetSelector,
    prevButton = "swiper-button-prev",
    nextButton = "swiper-button-next",
    paramsOverrides
  }) {
    const prev = widgetSelector.parentNode.querySelector(`.${prevButton}`);
    const next = widgetSelector.parentNode.querySelector(`.${nextButton}`);
    if (!swiperContainer[id]) {
      swiperContainer[id] = {};
    }
    const swiperInstance = swiperContainer[id]?.instance;
    if (swiperInstance) {
      if (!swiperInstance.params?.enabled) {
        enableSwiper(id);
        return;
      }
      swiperInstance.destroy(true);
    } else {
      swiperContainer[id] = { pageIndex: 1 };
    }
    swiperContainer[id].instance = new Swiper(widgetSelector, {
      modules: [Navigation, Manipulation, Keyboard, Mousewheel],
      spaceBetween: 10,
      observer: true,
      grabCursor: true,
      allowTouchMove: true,
      direction: "horizontal",
      watchSlidesProgress: true,
      normalizeSlideIndex: true,
      watchOverflow: true,
      mousewheel: {
        enabled: false
      },
      navigation: {
        enabled: !!(prev && next),
        nextEl: next,
        prevEl: prev
      },
      resizeObserver: true,
      ...paramsOverrides
    });
  }
  function getSwiperIndexforTile(swiperSelector, tileId, lookupAttr) {
    const slideElements = swiperSelector.querySelectorAll(".swiper-slide");
    const index = (() => {
      if (lookupAttr) {
        return Array.from(slideElements).findIndex(
          (element) => element.getAttribute("data-id") === tileId && element.getAttribute(lookupAttr.name) === lookupAttr.value
        );
      }
      return Array.from(slideElements).findIndex((element) => element.getAttribute("data-id") === tileId);
    })();
    return index < 0 ? 0 : index;
  }
  function enableSwiper(id) {
    swiperContainer[id]?.instance?.enable();
  }
  function destroySwiper(id) {
    if (swiperContainer[id]?.instance) {
      swiperContainer[id].instance.destroy(true, true);
      delete swiperContainer[id];
    }
  }
  function getInstance(id) {
    return swiperContainer[id]?.instance;
  }
  function getActiveSlide(id) {
    return swiperContainer[id]?.instance?.realIndex || 0;
  }
  function getActiveSlideElement(id) {
    return swiperContainer[id]?.instance?.slides[getActiveSlide(id) || 0];
  }
  var swiperContainer;
  var init_swiper_extension = __esm({
    "src/libs/extensions/swiper/swiper.extension.ts"() {
      "use strict";
      init_swiper();
      init_modules();
      swiperContainer = {};
    }
  });
  function playTiktokVideo(frameWindow) {
    postTiktokMessage(frameWindow, "unMute");
    postTiktokMessage(frameWindow, "play");
  }
  function pauseTiktokVideo(frameWindow) {
    postTiktokMessage(frameWindow, "mute");
    postTiktokMessage(frameWindow, "pause");
    postTiktokMessage(frameWindow, "seekTo", 0);
  }
  function postTiktokMessage(frameWindow, type, value) {
    frameWindow.postMessage({ type, value, "x-tiktok-player": true }, "https://www.tiktok.com");
  }
  var init_tiktok_message = __esm({
    "src/libs/components/expanded-tile-swiper/tiktok-message.ts"() {
      "use strict";
    }
  });
  function initializeSwiperForExpandedTiles(initialTileId, lookupAttr) {
    const expandedTile = sdk.querySelector("expanded-tiles");
    if (!expandedTile) {
      throw new Error("The expanded tile element not found");
    }
    const widgetSelector = expandedTile.querySelector(".swiper-expanded");
    if (!widgetSelector) {
      throw new Error("Failed to find widget UI element. Failed to initialise Glide");
    }
    initializeSwiper({
      id: "expanded",
      widgetSelector,
      mode: "expanded",
      prevButton: "swiper-expanded-button-prev",
      nextButton: "swiper-expanded-button-next",
      paramsOverrides: {
        slidesPerView: 1,
        keyboard: {
          enabled: true,
          onlyInViewport: false
        },
        on: {
          beforeInit: (swiper) => {
            const tileIndex = initialTileId ? getSwiperIndexforTile(widgetSelector, initialTileId, lookupAttr) : 0;
            swiper.slideToLoop(tileIndex, 0, false);
          },
          navigationNext: controlVideoPlayback,
          navigationPrev: controlVideoPlayback
        }
      }
    });
  }
  function playMediaOnLoad() {
    const swiper = getInstance("expanded");
    if (swiper) {
      const activeElementData = getSwiperVideoElement(swiper, swiper.realIndex);
      triggerPlay(activeElementData);
    }
  }
  function controlVideoPlayback(swiper) {
    const activeElement = getSwiperVideoElement(swiper, swiper.realIndex);
    const previousElement = getSwiperVideoElement(swiper, swiper.previousIndex);
    triggerPlay(activeElement);
    triggerPause(previousElement);
  }
  function triggerPlay(elementData) {
    if (!elementData) {
      return;
    }
    switch (elementData.source) {
      case "video": {
        const videoElement = elementData.element;
        videoElement.play();
        break;
      }
      case "youtube": {
        const YoutubeContentWindow = elementData.element;
        YoutubeContentWindow.play();
        break;
      }
      case "tiktok": {
        const tiktokFrameWindow = elementData.element;
        playTiktokVideo(tiktokFrameWindow);
        break;
      }
      default:
        throw new Error(`unsupported video source ${elementData.source}`);
    }
  }
  function triggerPause(elementData) {
    if (!elementData) {
      return;
    }
    switch (elementData.source) {
      case "video": {
        const videoElement = elementData.element;
        videoElement.pause();
        videoElement.currentTime = 0;
        break;
      }
      case "youtube": {
        const YoutubeContentWindow = elementData.element;
        YoutubeContentWindow.pause();
        YoutubeContentWindow.reset();
        break;
      }
      case "tiktok": {
        const tiktokFrameWindow = elementData.element;
        pauseTiktokVideo(tiktokFrameWindow);
        break;
      }
      default:
        throw new Error(`unsupported video source ${elementData.source}`);
    }
  }
  function getSwiperVideoElement(swiper, index) {
    const element = swiper.slides[index];
    const tileId = element.getAttribute("data-id");
    const youtubeId = element.getAttribute("data-yt-id");
    if (youtubeId) {
      const youtubeFrame = element.querySelector(`iframe#yt-frame-${tileId}-${youtubeId}`);
      if (youtubeFrame) {
        return { element: youtubeFrame.contentWindow, source: "youtube" };
      }
    }
    const tiktokId = element.getAttribute("data-tiktok-id");
    if (tiktokId) {
      const tiktokFrame = element.querySelector(`iframe#tiktok-frame-${tileId}-${tiktokId}`);
      if (tiktokFrame && tiktokFrame.contentWindow) {
        return { element: tiktokFrame.contentWindow, source: "tiktok" };
      }
    }
    const videoElement = element.querySelector(".panel .panel-left .video-content-wrapper video");
    if (videoElement) {
      return { element: videoElement, source: "video" };
    }
    return void 0;
  }
  function onTileExpand(tileId) {
    const expandedTile = sdk.querySelector("expanded-tiles");
    if (!expandedTile) {
      throw new Error("The expanded tile element not found");
    }
    expandedTile.parentElement.classList.add("expanded-tile-overlay");
    waitForElm(expandedTile, [".swiper-expanded"], () => {
      const tileElement = expandedTile.shadowRoot?.querySelector(`.swiper-slide[data-id="${tileId}"]`);
      const youtubeId = tileElement?.getAttribute("data-yt-id");
      const tiktokId = tileElement?.getAttribute("data-tiktok-id");
      if (youtubeId) {
        const lookupYtAttr = { name: "data-yt-id", value: youtubeId };
        initializeSwiperForExpandedTiles(tileId, lookupYtAttr);
      } else if (tiktokId) {
        const lookupTiktokAttr = { name: "data-tiktok-id", value: tiktokId };
        initializeSwiperForExpandedTiles(tileId, lookupTiktokAttr);
      } else {
        initializeSwiperForExpandedTiles(tileId);
      }
    });
  }
  function onTileRendered() {
    const expandedTilesElement = sdk.querySelector("expanded-tiles");
    if (!expandedTilesElement) {
      throw new Error("Expanded tiles element not found");
    }
    const tiles = expandedTilesElement.querySelectorAll(".swiper-slide");
    const widgetSelector = expandedTilesElement.querySelector(".swiper-expanded");
    if (!widgetSelector) {
      throw new Error("Widget selector for expanded tile (swiper-expanded) is not found");
    }
    setupTikTokPlayerReadyEvent();
    tiles?.forEach((tile) => {
      setupVideoEvents(tile, widgetSelector);
      setupYoutubeEvents(tile, widgetSelector);
    });
  }
  function reduceBackgroundControlsVisibility(sourceId) {
    if (!isValidEventSource(sourceId)) {
      return;
    }
    const expandedTilesElement = sdk.querySelector("expanded-tiles");
    const wrapper = expandedTilesElement.querySelector(".expanded-tile-wrapper");
    if (!wrapper) {
      return;
    }
    const navigationPrevButton = wrapper.querySelector(".swiper-expanded-button-prev");
    const navigationNextButton = wrapper.querySelector(".swiper-expanded-button-next");
    const exitTileButton = wrapper.querySelector(".exit");
    navigationNextButton?.classList.add("swiper-button-disabled");
    navigationPrevButton?.classList.add("swiper-button-disabled");
    if (exitTileButton) {
      exitTileButton.style.opacity = "0.4";
    }
  }
  function resetBackgroundControlsVisibility(sourceId) {
    if (!isValidEventSource(sourceId)) {
      return;
    }
    const expandedTilesElement = sdk.querySelector("expanded-tiles");
    const wrapper = expandedTilesElement.querySelector(".expanded-tile-wrapper");
    if (!wrapper) {
      return;
    }
    const navigationPrevButton = wrapper.querySelector(".swiper-expanded-button-prev");
    const navigationNextButton = wrapper.querySelector(".swiper-expanded-button-next");
    const exitTileButton = wrapper.querySelector(".exit");
    navigationNextButton?.classList.remove("swiper-button-disabled");
    navigationPrevButton?.classList.remove("swiper-button-disabled");
    if (exitTileButton) {
      exitTileButton.removeAttribute("style");
    }
  }
  function isValidEventSource(sourceId) {
    const activeSlideElement = getActiveSlideElement("expanded");
    return activeSlideElement?.getAttribute("data-id") === sourceId;
  }
  function setupVideoEvents(tile, widgetSelector) {
    const videoSourceElement = tile.querySelector("video.video-content > source");
    if (videoSourceElement) {
      videoSourceElement.addEventListener("load", () => {
        playActiveMediaTileOnLoad(tile, widgetSelector);
      });
      videoSourceElement.addEventListener("error", () => {
        videoSourceElement.closest(".video-content-wrapper")?.classList.add("hidden");
        tile.querySelector(".video-fallback-content")?.classList.remove("hidden");
      });
    }
  }
  function setupYoutubeEvents(tile, widgetSelector) {
    const tileId = tile.getAttribute("data-id");
    const youtubeId = tile.getAttribute("data-yt-id");
    if (youtubeId && tileId) {
      const youtubeFrame = tile.querySelector(`iframe#yt-frame-${tileId}-${youtubeId}`);
      youtubeFrame?.addEventListener("load", () => {
        playActiveMediaTileOnLoad(tile, widgetSelector, { name: "data-yt-id", value: youtubeId });
      });
      youtubeFrame?.addEventListener("yt-video-error", () => {
        youtubeFrame.closest(".video-content-wrapper")?.classList.add("hidden");
        tile.querySelector(".video-fallback-content")?.classList.remove("hidden");
      });
    }
  }
  function setupTikTokPlayerReadyEvent() {
    tiktokDefaultPlayed = false;
    window.onmessage = (event2) => {
      if (event2.data["x-tiktok-player"] && event2.data.type === "onPlayerReady") {
        const frameWindow = event2.source;
        pauseTiktokVideo(frameWindow);
        if (!tiktokDefaultPlayed) {
          tiktokDefaultPlayed = true;
          setTimeout(() => playMediaOnLoad(), 300);
        }
      }
    };
  }
  function playActiveMediaTileOnLoad(tile, widgetSelector, lookupAttr) {
    if (isActiveTile(tile, widgetSelector, lookupAttr)) {
      playMediaOnLoad();
    }
  }
  function isActiveTile(tile, widgetSelector, lookupAttr) {
    const tileId = tile.getAttribute("data-id");
    const tileIndex = tileId ? getSwiperIndexforTile(widgetSelector, tileId, lookupAttr) : 0;
    return getActiveSlide("expanded") === tileIndex;
  }
  function onTileClosed() {
    const expandedTile = sdk.querySelector("expanded-tiles");
    if (!expandedTile) {
      throw new Error("The expanded tile element not found");
    }
    expandedTile.parentElement.classList.remove("expanded-tile-overlay");
    destroySwiper("expanded");
  }
  var tiktokDefaultPlayed;
  var init_expanded_swiper_loader = __esm({
    "src/libs/components/expanded-tile-swiper/expanded-swiper.loader.ts"() {
      "use strict";
      init_swiper_extension();
      init_widget_features();
      init_tiktok_message();
      tiktokDefaultPlayed = false;
    }
  });
  function onExpandedTileCrossSellersRendered(tileId, target) {
    if (target) {
      const swiperCrossSell = target.querySelector(".swiper-expanded-product-recs");
      if (swiperCrossSell) {
        initializeSwiper({
          id: `expanded-product-recs-${tileId}`,
          mode: "expanded-product-recs",
          widgetSelector: swiperCrossSell,
          prevButton: "swiper-exp-product-recs-button-prev",
          nextButton: "swiper-exp-product-recs-button-next",
          paramsOverrides: {
            slidesPerView: "auto",
            mousewheel: {
              enabled: false
            },
            grabCursor: false,
            on: {
              beforeInit: (swiper) => {
                swiper.slideToLoop(0, 0, false);
              }
            }
          }
        });
      }
    }
  }
  var init_product_recs_swiper_loader = __esm({
    "src/libs/components/expanded-tile-swiper/product-recs-swiper.loader.ts"() {
      "use strict";
      init_swiper_extension();
    }
  });
  function addAutoAddTileFeature() {
    const { auto_refresh } = sdk.getStyleConfig();
    if (Boolean(auto_refresh) === true) {
      sdk.tiles.enableAutoAddNewTiles();
    }
  }
  function loadWidgetIsEnabled() {
    if (isEnabled()) {
      return true;
    }
    const ugcContainer = sdk.querySelector("#nosto-ugc-container");
    if (!ugcContainer) {
      throw new Error("Failed to find Nosto UGC container");
    }
    ugcContainer.style.display = "none";
    throw new Error("Widget is not enabled");
  }
  function loadExpandedTileFeature() {
    const widgetContainer = sdk.getStyleConfig();
    const { click_through_url } = widgetContainer;
    if (click_through_url === "[EXPAND]") {
      loadExpandSettingComponents();
      registerTileExpandListener(onTileExpand);
      registerGenericEventListener(EXPANDED_TILE_CLOSE, onTileClosed);
      registerGenericEventListener(EVENT_TILE_EXPAND_RENDERED, onTileRendered);
      registerShareMenuOpenedListener(reduceBackgroundControlsVisibility);
      registerShareMenuClosedListener(resetBackgroundControlsVisibility);
      registerCrossSellersLoadListener(onExpandedTileCrossSellersRendered);
    } else if (click_through_url === "[ORIGINAL_URL]" || /^https?:\/\/.+/.test(click_through_url ?? "")) {
      registerDefaultClickEvents();
    } else if (click_through_url === "[CUSTOM]") {
      alert("Custom URL integration Not implemented yet");
    }
  }
  function loadMore() {
    if (window.__isLoading) {
      return;
    }
    window.__isLoading = true;
    const loadMoreButton = getLoadMoreButton();
    sdk.triggerEvent(EVENT_LOAD_MORE);
    if (!sdk.tiles.hasMorePages()) {
      loadMoreButton.classList.add("hidden");
    }
    setTimeout(() => {
      window.__isLoading = false;
    }, 500);
  }
  function addLoadMoreButtonFeature() {
    const { load_more_type } = sdk.getStyleConfig();
    const loadMoreType = load_more_type;
    switch (loadMoreType) {
      case "button":
        attachLoadMoreButtonListener();
        sdk.addEventListener(EVENT_TILES_UPDATED, () => {
          const loadMoreLoader = getLoadMoreLoader();
          const loadMoreButton = getLoadMoreButton();
          loadMoreLoader.classList.add("hidden");
          loadMoreButton.classList.remove("hidden");
        });
        break;
      case "scroll":
        disableLoadMoreButtonIfExists();
        sdk.addEventListener(EVENT_TILES_UPDATED, () => {
          const loadMoreLoader = getLoadMoreLoader();
          loadMoreLoader.classList.add("hidden");
        });
        useInfiniteScroller_default(sdk, window, loadMoreWrappedWithEasedLoader);
        break;
      case "static":
        disableLoadMoreLoaderIfExists();
        disableLoadMoreButtonIfExists();
        break;
      default:
        throw new Error("Invalid load more type");
    }
    if (!sdk.tiles.hasMorePages()) {
      disableLoadMoreButtonIfExists();
      disableLoadMoreLoaderIfExists();
    }
  }
  function attachLoadMoreButtonListener() {
    const loadMoreButton = getLoadMoreButton();
    loadMoreButton.onclick = loadMoreWrappedWithEasedLoader;
  }
  function disableLoadMoreButtonIfExists() {
    const loadMoreButton = getLoadMoreButton();
    loadMoreButton.classList.add("hidden");
  }
  function disableLoadMoreLoaderIfExists() {
    getLoadMoreLoader().classList.add("hidden");
  }
  function hideAllTilesAfterNTiles(numberTiles) {
    const tiles = sdk.querySelectorAll(".ugc-tile");
    if (!tiles) {
      throw new Error("Failed to find tiles");
    }
    tiles.forEach((tile, index) => {
      if (index >= numberTiles) {
        tile.classList.add("hidden");
      }
    });
  }
  function addTilesPerPageFeature() {
    const { enable_custom_tiles_per_page, tiles_per_page } = sdk.getStyleConfig();
    if (enable_custom_tiles_per_page) {
      sdk.tiles.setVisibleTilesCount(parseInt(tiles_per_page));
      hideAllTilesAfterNTiles(parseInt(tiles_per_page));
    } else {
      sdk.tiles.setVisibleTilesCount(40);
    }
  }
  function loadTitle() {
    const widgetTitle = document.createElement("p");
    const widgetContainer = sdk.placement.getWidgetContainer();
    const title = widgetContainer.title;
    if (title) {
      widgetTitle.innerHTML = title;
    }
  }
  function waitForElm(parent, targets, callback) {
    if (targets.every((it) => !!parent.querySelector(it))) {
      callback(targets.map((it) => parent.querySelector(it)));
    }
    const observer = new MutationObserver((_, observer2) => {
      if (targets.every((it) => !!parent.querySelector(it))) {
        observer2.disconnect();
        callback(targets.map((it) => parent.querySelector(it)));
      }
    });
    observer.observe(parent, {
      childList: true,
      subtree: true
    });
  }
  var getNextNavigatedTile;
  var getNextTile;
  var getPreviousTile;
  var arrowClickListener;
  var getLoadMoreButton;
  var getLoadMoreLoader;
  var loadMoreWrappedWithEasedLoader;
  var init_widget_features = __esm({
    "src/libs/widget.features.ts"() {
      "use strict";
      init_src();
      init_widget_components();
      init_widget_layout();
      init_hooks();
      init_expanded_swiper_loader();
      init_product_recs_swiper_loader();
      getNextNavigatedTile = (currentTile, enabledTiles, direction) => {
        const currentIndex = enabledTiles.findIndex((tile) => tile.getAttribute("data-id") === currentTile.id);
        if (direction === "previous") {
          const previousTile = getPreviousTile(enabledTiles, currentIndex);
          if (!previousTile) {
            throw new Error("Failed to find previous tile");
          }
          return previousTile.getAttribute("data-id");
        } else if (direction === "next") {
          const nextTile = getNextTile(enabledTiles, currentIndex);
          if (!nextTile) {
            throw new Error("Failed to find next tile");
          }
          return nextTile.getAttribute("data-id");
        }
        return null;
      };
      getNextTile = (enabledTiles, currentIndex) => enabledTiles[currentIndex + 1];
      getPreviousTile = (enabledTiles, currentIndex) => enabledTiles[currentIndex - 1];
      arrowClickListener = (e) => {
        if (!e.target) {
          throw new Error("Failed to find target element for arrow click listener");
        }
        const target = e.target;
        const type = target.classList.contains("tile-arrows-left") ? "previous" : "next";
        const currentTile = sdk.tiles.getTile();
        if (!currentTile) {
          throw new Error("Failed to find current tile");
        }
        const tilesAsHtml = sdk.querySelectorAll(".ugc-tile");
        if (!tilesAsHtml) {
          throw new Error("Failed to find tiles for arrow initialisation");
        }
        const tilesAsHtmlArray = Array.from(tilesAsHtml);
        const tileId = getNextNavigatedTile(currentTile, tilesAsHtmlArray, type);
        const tilesStore = Object.values(sdk.tiles.tiles);
        const tileData = {
          tileData: tilesStore.find((tile) => tile.id === tileId),
          widgetId: sdk.placement.getWidgetId(),
          filterId: sdk.placement.getWidgetContainer().widgetOptions?.filter_id
        };
        sdk.triggerEvent(EXPANDED_TILE_CLOSE);
        sdk.triggerEvent(EVENT_TILE_EXPAND, tileData);
      };
      getLoadMoreButton = () => {
        const loadMoreComponent = sdk.querySelector("load-more");
        if (!loadMoreComponent) {
          throw new Error("Failed to find load more component");
        }
        const loadMoreButton = loadMoreComponent?.querySelector("#load-more");
        if (!loadMoreButton) {
          throw new Error("Failed to find load more button");
        }
        return loadMoreButton;
      };
      getLoadMoreLoader = () => {
        const loadMoreLoader = sdk.querySelector("#load-more-loader");
        if (!loadMoreLoader) {
          throw new Error("Failed to find load more loader");
        }
        return loadMoreLoader;
      };
      loadMoreWrappedWithEasedLoader = () => {
        const loadMoreButton = getLoadMoreButton();
        loadMoreButton.classList.add("hidden");
        const loadMoreLoader = getLoadMoreLoader();
        loadMoreLoader.classList.remove("hidden");
        loadMore();
      };
    }
  });
  var init_widget_utils = __esm({
    "src/libs/widget.utils.ts"() {
      "use strict";
    }
  });
  function handleAllTileImageRendered() {
    const tileLoadingElements = sdk.placement.getShadowRoot().querySelectorAll(".grid-item .tile-loading.loading");
    tileLoadingElements?.forEach((element) => element.classList.remove("loading"));
    const loadMoreHiddenElement = sdk.placement.getShadowRoot().querySelector("#buttons > #load-more.hidden");
    loadMoreHiddenElement?.classList.remove(".hidden");
  }
  function getGridItemRowIds() {
    const gridItems = sdk.placement.getShadowRoot().querySelectorAll(".grid-item:not(hidden)[row-id]");
    const allRowIds = Array.from(gridItems).map((item) => item.getAttribute("row-id")).filter((rowIdString) => rowIdString && !Number.isNaN(+rowIdString)).map((rowId) => +rowId);
    return [...new Set(allRowIds)];
  }
  function handleTileImageError(tileWithError) {
    const errorTileRowIdString = tileWithError.getAttribute("row-id");
    tileWithError.classList.remove("grid-item");
    tileWithError.classList.remove("ugc-tile");
    tileWithError.classList.add("grid-item-error");
    tileWithError.classList.add("ugc-tile-error");
    tileWithError.classList.add("hidden");
    if (!errorTileRowIdString || Number.isNaN(+errorTileRowIdString)) {
      return;
    }
    const errorTileRowId = +errorTileRowIdString;
    const uniqueRowIds = getGridItemRowIds();
    const rowIdSelectors = uniqueRowIds.filter((rowId) => rowId >= errorTileRowId).map((matched) => `[row-id="${matched}"]`);
    const matchedGridItems = Array.from(
      sdk.placement.getShadowRoot().querySelectorAll(`.grid-item:is(${rowIdSelectors})`)
    );
    resizeTiles(matchedGridItems);
  }
  function renderMasonryLayout(reset = false, resize = false) {
    if (resize || reset) {
      screenWidth = 0;
    }
    const ugcContainer = sdk.querySelector("#nosto-ugc-container");
    if (!ugcContainer) {
      throw new Error("Failed to find Nosto UGC container");
    }
    const currentScreenWidth = ugcContainer.clientWidth;
    if (currentScreenWidth === 0) {
      return;
    }
    if (resize && previousWidthHandled === currentScreenWidth) {
      return;
    }
    if (screenWidth == 0) {
      screenWidth = currentScreenWidth;
      previousWidthHandled = currentScreenWidth;
    }
    const allTiles = Array.from(sdk.querySelectorAll(".grid-item") ?? []);
    const ugcTiles = reset || resize ? allTiles : allTiles.filter(
      (tile) => tile.getAttribute("width-set") !== "true" && tile.getAttribute("set-for-width") !== screenWidth.toString()
    );
    resizeTiles(ugcTiles);
  }
  function resizeTiles(ugcTiles) {
    if (!ugcTiles || ugcTiles.length === 0) {
      return;
    }
    ugcTiles.forEach((tile) => {
      const randomFlexGrow = Math.random() * 2 + 1;
      const randomWidth = Math.random() * 200 + 150;
      tile.style.flex = `${randomFlexGrow} 1 auto`;
      tile.style.width = `${randomWidth}px`;
      tile.setAttribute("width-set", "true");
      tile.setAttribute("set-for-width", screenWidth.toString());
    });
  }
  var screenWidth;
  var previousWidthHandled;
  var init_masonry_extension = __esm({
    "src/libs/extensions/masonry/masonry.extension.ts"() {
      "use strict";
      screenWidth = 0;
      previousWidthHandled = 0;
    }
  });
  var font_default;
  var init_font = __esm({
    "src/libs/extensions/swiper/font.scss"() {
      "use strict";
      font_default = `@font-face {
  font-family: swiper-icons;
  src: url("data:application/font-woff;charset=utf-8;base64, d09GRgABAAAAAAZgABAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAGRAAAABoAAAAci6qHkUdERUYAAAWgAAAAIwAAACQAYABXR1BPUwAABhQAAAAuAAAANuAY7+xHU1VCAAAFxAAAAFAAAABm2fPczU9TLzIAAAHcAAAASgAAAGBP9V5RY21hcAAAAkQAAACIAAABYt6F0cBjdnQgAAACzAAAAAQAAAAEABEBRGdhc3AAAAWYAAAACAAAAAj//wADZ2x5ZgAAAywAAADMAAAD2MHtryVoZWFkAAABbAAAADAAAAA2E2+eoWhoZWEAAAGcAAAAHwAAACQC9gDzaG10eAAAAigAAAAZAAAArgJkABFsb2NhAAAC0AAAAFoAAABaFQAUGG1heHAAAAG8AAAAHwAAACAAcABAbmFtZQAAA/gAAAE5AAACXvFdBwlwb3N0AAAFNAAAAGIAAACE5s74hXjaY2BkYGAAYpf5Hu/j+W2+MnAzMYDAzaX6QjD6/4//Bxj5GA8AuRwMYGkAPywL13jaY2BkYGA88P8Agx4j+/8fQDYfA1AEBWgDAIB2BOoAeNpjYGRgYNBh4GdgYgABEMnIABJzYNADCQAACWgAsQB42mNgYfzCOIGBlYGB0YcxjYGBwR1Kf2WQZGhhYGBiYGVmgAFGBiQQkOaawtDAoMBQxXjg/wEGPcYDDA4wNUA2CCgwsAAAO4EL6gAAeNpj2M0gyAACqxgGNWBkZ2D4/wMA+xkDdgAAAHjaY2BgYGaAYBkGRgYQiAHyGMF8FgYHIM3DwMHABGQrMOgyWDLEM1T9/w8UBfEMgLzE////P/5//f/V/xv+r4eaAAeMbAxwIUYmIMHEgKYAYjUcsDAwsLKxc3BycfPw8jEQA/gZBASFhEVExcQlJKWkZWTl5BUUlZRVVNXUNTQZBgMAAMR+E+gAEQFEAAAAKgAqACoANAA+AEgAUgBcAGYAcAB6AIQAjgCYAKIArAC2AMAAygDUAN4A6ADyAPwBBgEQARoBJAEuATgBQgFMAVYBYAFqAXQBfgGIAZIBnAGmAbIBzgHsAAB42u2NMQ6CUAyGW568x9AneYYgm4MJbhKFaExIOAVX8ApewSt4Bic4AfeAid3VOBixDxfPYEza5O+Xfi04YADggiUIULCuEJK8VhO4bSvpdnktHI5QCYtdi2sl8ZnXaHlqUrNKzdKcT8cjlq+rwZSvIVczNiezsfnP/uznmfPFBNODM2K7MTQ45YEAZqGP81AmGGcF3iPqOop0r1SPTaTbVkfUe4HXj97wYE+yNwWYxwWu4v1ugWHgo3S1XdZEVqWM7ET0cfnLGxWfkgR42o2PvWrDMBSFj/IHLaF0zKjRgdiVMwScNRAoWUoH78Y2icB/yIY09An6AH2Bdu/UB+yxopYshQiEvnvu0dURgDt8QeC8PDw7Fpji3fEA4z/PEJ6YOB5hKh4dj3EvXhxPqH/SKUY3rJ7srZ4FZnh1PMAtPhwP6fl2PMJMPDgeQ4rY8YT6Gzao0eAEA409DuggmTnFnOcSCiEiLMgxCiTI6Cq5DZUd3Qmp10vO0LaLTd2cjN4fOumlc7lUYbSQcZFkutRG7g6JKZKy0RmdLY680CDnEJ+UMkpFFe1RN7nxdVpXrC4aTtnaurOnYercZg2YVmLN/d/gczfEimrE/fs/bOuq29Zmn8tloORaXgZgGa78yO9/cnXm2BpaGvq25Dv9S4E9+5SIc9PqupJKhYFSSl47+Qcr1mYNAAAAeNptw0cKwkAAAMDZJA8Q7OUJvkLsPfZ6zFVERPy8qHh2YER+3i/BP83vIBLLySsoKimrqKqpa2hp6+jq6RsYGhmbmJqZSy0sraxtbO3sHRydnEMU4uR6yx7JJXveP7WrDycAAAAAAAH//wACeNpjYGRgYOABYhkgZgJCZgZNBkYGLQZtIJsFLMYAAAw3ALgAeNolizEKgDAQBCchRbC2sFER0YD6qVQiBCv/H9ezGI6Z5XBAw8CBK/m5iQQVauVbXLnOrMZv2oLdKFa8Pjuru2hJzGabmOSLzNMzvutpB3N42mNgZGBg4GKQYzBhYMxJLMlj4GBgAYow/P/PAJJhLM6sSoWKfWCAAwDAjgbRAAB42mNgYGBkAIIbCZo5IPrmUn0hGA0AO8EFTQAA");
  font-weight: 400;
  font-style: normal;
}`;
    }
  });
  var swiper_bundle_default;
  var init_swiper_bundle = __esm({
    "../../node_modules/swiper/swiper-bundle.css"() {
      swiper_bundle_default = `/**
 * Swiper 11.1.14
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2024 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: September 12, 2024
 */

/* FONT_START */
@font-face {
  font-family: 'swiper-icons';
  src: url('data:application/font-woff;charset=utf-8;base64, d09GRgABAAAAAAZgABAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAGRAAAABoAAAAci6qHkUdERUYAAAWgAAAAIwAAACQAYABXR1BPUwAABhQAAAAuAAAANuAY7+xHU1VCAAAFxAAAAFAAAABm2fPczU9TLzIAAAHcAAAASgAAAGBP9V5RY21hcAAAAkQAAACIAAABYt6F0cBjdnQgAAACzAAAAAQAAAAEABEBRGdhc3AAAAWYAAAACAAAAAj//wADZ2x5ZgAAAywAAADMAAAD2MHtryVoZWFkAAABbAAAADAAAAA2E2+eoWhoZWEAAAGcAAAAHwAAACQC9gDzaG10eAAAAigAAAAZAAAArgJkABFsb2NhAAAC0AAAAFoAAABaFQAUGG1heHAAAAG8AAAAHwAAACAAcABAbmFtZQAAA/gAAAE5AAACXvFdBwlwb3N0AAAFNAAAAGIAAACE5s74hXjaY2BkYGAAYpf5Hu/j+W2+MnAzMYDAzaX6QjD6/4//Bxj5GA8AuRwMYGkAPywL13jaY2BkYGA88P8Agx4j+/8fQDYfA1AEBWgDAIB2BOoAeNpjYGRgYNBh4GdgYgABEMnIABJzYNADCQAACWgAsQB42mNgYfzCOIGBlYGB0YcxjYGBwR1Kf2WQZGhhYGBiYGVmgAFGBiQQkOaawtDAoMBQxXjg/wEGPcYDDA4wNUA2CCgwsAAAO4EL6gAAeNpj2M0gyAACqxgGNWBkZ2D4/wMA+xkDdgAAAHjaY2BgYGaAYBkGRgYQiAHyGMF8FgYHIM3DwMHABGQrMOgyWDLEM1T9/w8UBfEMgLzE////P/5//f/V/xv+r4eaAAeMbAxwIUYmIMHEgKYAYjUcsDAwsLKxc3BycfPw8jEQA/gZBASFhEVExcQlJKWkZWTl5BUUlZRVVNXUNTQZBgMAAMR+E+gAEQFEAAAAKgAqACoANAA+AEgAUgBcAGYAcAB6AIQAjgCYAKIArAC2AMAAygDUAN4A6ADyAPwBBgEQARoBJAEuATgBQgFMAVYBYAFqAXQBfgGIAZIBnAGmAbIBzgHsAAB42u2NMQ6CUAyGW568x9AneYYgm4MJbhKFaExIOAVX8ApewSt4Bic4AfeAid3VOBixDxfPYEza5O+Xfi04YADggiUIULCuEJK8VhO4bSvpdnktHI5QCYtdi2sl8ZnXaHlqUrNKzdKcT8cjlq+rwZSvIVczNiezsfnP/uznmfPFBNODM2K7MTQ45YEAZqGP81AmGGcF3iPqOop0r1SPTaTbVkfUe4HXj97wYE+yNwWYxwWu4v1ugWHgo3S1XdZEVqWM7ET0cfnLGxWfkgR42o2PvWrDMBSFj/IHLaF0zKjRgdiVMwScNRAoWUoH78Y2icB/yIY09An6AH2Bdu/UB+yxopYshQiEvnvu0dURgDt8QeC8PDw7Fpji3fEA4z/PEJ6YOB5hKh4dj3EvXhxPqH/SKUY3rJ7srZ4FZnh1PMAtPhwP6fl2PMJMPDgeQ4rY8YT6Gzao0eAEA409DuggmTnFnOcSCiEiLMgxCiTI6Cq5DZUd3Qmp10vO0LaLTd2cjN4fOumlc7lUYbSQcZFkutRG7g6JKZKy0RmdLY680CDnEJ+UMkpFFe1RN7nxdVpXrC4aTtnaurOnYercZg2YVmLN/d/gczfEimrE/fs/bOuq29Zmn8tloORaXgZgGa78yO9/cnXm2BpaGvq25Dv9S4E9+5SIc9PqupJKhYFSSl47+Qcr1mYNAAAAeNptw0cKwkAAAMDZJA8Q7OUJvkLsPfZ6zFVERPy8qHh2YER+3i/BP83vIBLLySsoKimrqKqpa2hp6+jq6RsYGhmbmJqZSy0sraxtbO3sHRydnEMU4uR6yx7JJXveP7WrDycAAAAAAAH//wACeNpjYGRgYOABYhkgZgJCZgZNBkYGLQZtIJsFLMYAAAw3ALgAeNolizEKgDAQBCchRbC2sFER0YD6qVQiBCv/H9ezGI6Z5XBAw8CBK/m5iQQVauVbXLnOrMZv2oLdKFa8Pjuru2hJzGabmOSLzNMzvutpB3N42mNgZGBg4GKQYzBhYMxJLMlj4GBgAYow/P/PAJJhLM6sSoWKfWCAAwDAjgbRAAB42mNgYGBkAIIbCZo5IPrmUn0hGA0AO8EFTQAA');
  font-weight: 400;
  font-style: normal;
}
/* FONT_END */
:root {
  --swiper-theme-color: #007aff;
  /*
  --swiper-preloader-color: var(--swiper-theme-color);
  --swiper-wrapper-transition-timing-function: initial;
  */
}
:host {
  position: relative;
  display: block;
  margin-left: auto;
  margin-right: auto;
  z-index: 1;
}
.swiper {
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;
  list-style: none;
  padding: 0;
  /* Fix of Webkit flickering */
  z-index: 1;
  display: block;
}
.swiper-vertical > .swiper-wrapper {
  flex-direction: column;
}
.swiper-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  transition-property: transform;
  transition-timing-function: var(--swiper-wrapper-transition-timing-function, initial);
  box-sizing: content-box;
}
.swiper-android .swiper-slide,
.swiper-ios .swiper-slide,
.swiper-wrapper {
  transform: translate3d(0px, 0, 0);
}
.swiper-horizontal {
  touch-action: pan-y;
}
.swiper-vertical {
  touch-action: pan-x;
}
.swiper-slide {
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  position: relative;
  transition-property: transform;
  display: block;
}
.swiper-slide-invisible-blank {
  visibility: hidden;
}
/* Auto Height */
.swiper-autoheight,
.swiper-autoheight .swiper-slide {
  height: auto;
}
.swiper-autoheight .swiper-wrapper {
  align-items: flex-start;
  transition-property: transform, height;
}
.swiper-backface-hidden .swiper-slide {
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
}
/* 3D Effects */
.swiper-3d.swiper-css-mode .swiper-wrapper {
  perspective: 1200px;
}
.swiper-3d .swiper-wrapper {
  transform-style: preserve-3d;
}
.swiper-3d {
  perspective: 1200px;
}
.swiper-3d .swiper-slide,
.swiper-3d .swiper-cube-shadow {
  transform-style: preserve-3d;
}
/* CSS Mode */
.swiper-css-mode > .swiper-wrapper {
  overflow: auto;
  scrollbar-width: none;
  /* For Firefox */
  -ms-overflow-style: none;
  /* For Internet Explorer and Edge */
}
.swiper-css-mode > .swiper-wrapper::-webkit-scrollbar {
  display: none;
}
.swiper-css-mode > .swiper-wrapper > .swiper-slide {
  scroll-snap-align: start start;
}
.swiper-css-mode.swiper-horizontal > .swiper-wrapper {
  scroll-snap-type: x mandatory;
}
.swiper-css-mode.swiper-vertical > .swiper-wrapper {
  scroll-snap-type: y mandatory;
}
.swiper-css-mode.swiper-free-mode > .swiper-wrapper {
  scroll-snap-type: none;
}
.swiper-css-mode.swiper-free-mode > .swiper-wrapper > .swiper-slide {
  scroll-snap-align: none;
}
.swiper-css-mode.swiper-centered > .swiper-wrapper::before {
  content: '';
  flex-shrink: 0;
  order: 9999;
}
.swiper-css-mode.swiper-centered > .swiper-wrapper > .swiper-slide {
  scroll-snap-align: center center;
  scroll-snap-stop: always;
}
.swiper-css-mode.swiper-centered.swiper-horizontal > .swiper-wrapper > .swiper-slide:first-child {
  margin-inline-start: var(--swiper-centered-offset-before);
}
.swiper-css-mode.swiper-centered.swiper-horizontal > .swiper-wrapper::before {
  height: 100%;
  min-height: 1px;
  width: var(--swiper-centered-offset-after);
}
.swiper-css-mode.swiper-centered.swiper-vertical > .swiper-wrapper > .swiper-slide:first-child {
  margin-block-start: var(--swiper-centered-offset-before);
}
.swiper-css-mode.swiper-centered.swiper-vertical > .swiper-wrapper::before {
  width: 100%;
  min-width: 1px;
  height: var(--swiper-centered-offset-after);
}
/* Slide styles start */
/* 3D Shadows */
.swiper-3d .swiper-slide-shadow,
.swiper-3d .swiper-slide-shadow-left,
.swiper-3d .swiper-slide-shadow-right,
.swiper-3d .swiper-slide-shadow-top,
.swiper-3d .swiper-slide-shadow-bottom,
.swiper-3d .swiper-slide-shadow,
.swiper-3d .swiper-slide-shadow-left,
.swiper-3d .swiper-slide-shadow-right,
.swiper-3d .swiper-slide-shadow-top,
.swiper-3d .swiper-slide-shadow-bottom {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}
.swiper-3d .swiper-slide-shadow {
  background: rgba(0, 0, 0, 0.15);
}
.swiper-3d .swiper-slide-shadow-left {
  background-image: linear-gradient(to left, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
}
.swiper-3d .swiper-slide-shadow-right {
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
}
.swiper-3d .swiper-slide-shadow-top {
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
}
.swiper-3d .swiper-slide-shadow-bottom {
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
}
.swiper-lazy-preloader {
  width: 42px;
  height: 42px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -21px;
  margin-top: -21px;
  z-index: 10;
  transform-origin: 50%;
  box-sizing: border-box;
  border: 4px solid var(--swiper-preloader-color, var(--swiper-theme-color));
  border-radius: 50%;
  border-top-color: transparent;
}
.swiper:not(.swiper-watch-progress) .swiper-lazy-preloader,
.swiper-watch-progress .swiper-slide-visible .swiper-lazy-preloader {
  animation: swiper-preloader-spin 1s infinite linear;
}
.swiper-lazy-preloader-white {
  --swiper-preloader-color: #fff;
}
.swiper-lazy-preloader-black {
  --swiper-preloader-color: #000;
}
@keyframes swiper-preloader-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
/* Slide styles end */
.swiper-virtual .swiper-slide {
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
}
.swiper-virtual.swiper-css-mode .swiper-wrapper::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
}
.swiper-virtual.swiper-css-mode.swiper-horizontal .swiper-wrapper::after {
  height: 1px;
  width: var(--swiper-virtual-size);
}
.swiper-virtual.swiper-css-mode.swiper-vertical .swiper-wrapper::after {
  width: 1px;
  height: var(--swiper-virtual-size);
}
:root {
  --swiper-navigation-size: 44px;
  /*
  --swiper-navigation-top-offset: 50%;
  --swiper-navigation-sides-offset: 10px;
  --swiper-navigation-color: var(--swiper-theme-color);
  */
}
.swiper-button-prev,
.swiper-button-next {
  position: absolute;
  top: var(--swiper-navigation-top-offset, 50%);
  width: calc(var(--swiper-navigation-size) / 44 * 27);
  height: var(--swiper-navigation-size);
  margin-top: calc(0px - (var(--swiper-navigation-size) / 2));
  z-index: 10;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--swiper-navigation-color, var(--swiper-theme-color));
}
.swiper-button-prev.swiper-button-disabled,
.swiper-button-next.swiper-button-disabled {
  opacity: 0.35;
  cursor: auto;
  pointer-events: none;
}
.swiper-button-prev.swiper-button-hidden,
.swiper-button-next.swiper-button-hidden {
  opacity: 0;
  cursor: auto;
  pointer-events: none;
}
.swiper-navigation-disabled .swiper-button-prev,
.swiper-navigation-disabled .swiper-button-next {
  display: none !important;
}
.swiper-button-prev svg,
.swiper-button-next svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform-origin: center;
}
.swiper-rtl .swiper-button-prev svg,
.swiper-rtl .swiper-button-next svg {
  transform: rotate(180deg);
}
.swiper-button-prev,
.swiper-rtl .swiper-button-next {
  left: var(--swiper-navigation-sides-offset, 10px);
  right: auto;
}
.swiper-button-next,
.swiper-rtl .swiper-button-prev {
  right: var(--swiper-navigation-sides-offset, 10px);
  left: auto;
}
.swiper-button-lock {
  display: none;
}
/* Navigation font start */
.swiper-button-prev:after,
.swiper-button-next:after {
  font-family: swiper-icons;
  font-size: var(--swiper-navigation-size);
  text-transform: none !important;
  letter-spacing: 0;
  font-variant: initial;
  line-height: 1;
}
.swiper-button-prev:after,
.swiper-rtl .swiper-button-next:after {
  content: 'prev';
}
.swiper-button-next,
.swiper-rtl .swiper-button-prev {
  right: var(--swiper-navigation-sides-offset, 10px);
  left: auto;
}
.swiper-button-next:after,
.swiper-rtl .swiper-button-prev:after {
  content: 'next';
}
/* Navigation font end */
:root {
  /*
  --swiper-pagination-color: var(--swiper-theme-color);
  --swiper-pagination-left: auto;
  --swiper-pagination-right: 8px;
  --swiper-pagination-bottom: 8px;
  --swiper-pagination-top: auto;
  --swiper-pagination-fraction-color: inherit;
  --swiper-pagination-progressbar-bg-color: rgba(0,0,0,0.25);
  --swiper-pagination-progressbar-size: 4px;
  --swiper-pagination-bullet-size: 8px;
  --swiper-pagination-bullet-width: 8px;
  --swiper-pagination-bullet-height: 8px;
  --swiper-pagination-bullet-border-radius: 50%;
  --swiper-pagination-bullet-inactive-color: #000;
  --swiper-pagination-bullet-inactive-opacity: 0.2;
  --swiper-pagination-bullet-opacity: 1;
  --swiper-pagination-bullet-horizontal-gap: 4px;
  --swiper-pagination-bullet-vertical-gap: 6px;
  */
}
.swiper-pagination {
  position: absolute;
  text-align: center;
  transition: 300ms opacity;
  transform: translate3d(0, 0, 0);
  z-index: 10;
}
.swiper-pagination.swiper-pagination-hidden {
  opacity: 0;
}
.swiper-pagination-disabled > .swiper-pagination,
.swiper-pagination.swiper-pagination-disabled {
  display: none !important;
}
/* Common Styles */
.swiper-pagination-fraction,
.swiper-pagination-custom,
.swiper-horizontal > .swiper-pagination-bullets,
.swiper-pagination-bullets.swiper-pagination-horizontal {
  bottom: var(--swiper-pagination-bottom, 8px);
  top: var(--swiper-pagination-top, auto);
  left: 0;
  width: 100%;
}
/* Bullets */
.swiper-pagination-bullets-dynamic {
  overflow: hidden;
  font-size: 0;
}
.swiper-pagination-bullets-dynamic .swiper-pagination-bullet {
  transform: scale(0.33);
  position: relative;
}
.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active {
  transform: scale(1);
}
.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-main {
  transform: scale(1);
}
.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev {
  transform: scale(0.66);
}
.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev-prev {
  transform: scale(0.33);
}
.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next {
  transform: scale(0.66);
}
.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next-next {
  transform: scale(0.33);
}
.swiper-pagination-bullet {
  width: var(--swiper-pagination-bullet-width, var(--swiper-pagination-bullet-size, 8px));
  height: var(--swiper-pagination-bullet-height, var(--swiper-pagination-bullet-size, 8px));
  display: inline-block;
  border-radius: var(--swiper-pagination-bullet-border-radius, 50%);
  background: var(--swiper-pagination-bullet-inactive-color, #000);
  opacity: var(--swiper-pagination-bullet-inactive-opacity, 0.2);
}
button.swiper-pagination-bullet {
  border: none;
  margin: 0;
  padding: 0;
  box-shadow: none;
  -webkit-appearance: none;
          appearance: none;
}
.swiper-pagination-clickable .swiper-pagination-bullet {
  cursor: pointer;
}
.swiper-pagination-bullet:only-child {
  display: none !important;
}
.swiper-pagination-bullet-active {
  opacity: var(--swiper-pagination-bullet-opacity, 1);
  background: var(--swiper-pagination-color, var(--swiper-theme-color));
}
.swiper-vertical > .swiper-pagination-bullets,
.swiper-pagination-vertical.swiper-pagination-bullets {
  right: var(--swiper-pagination-right, 8px);
  left: var(--swiper-pagination-left, auto);
  top: 50%;
  transform: translate3d(0px, -50%, 0);
}
.swiper-vertical > .swiper-pagination-bullets .swiper-pagination-bullet,
.swiper-pagination-vertical.swiper-pagination-bullets .swiper-pagination-bullet {
  margin: var(--swiper-pagination-bullet-vertical-gap, 6px) 0;
  display: block;
}
.swiper-vertical > .swiper-pagination-bullets.swiper-pagination-bullets-dynamic,
.swiper-pagination-vertical.swiper-pagination-bullets.swiper-pagination-bullets-dynamic {
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
}
.swiper-vertical > .swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet,
.swiper-pagination-vertical.swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet {
  display: inline-block;
  transition: 200ms transform,
        200ms top;
}
.swiper-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet,
.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet {
  margin: 0 var(--swiper-pagination-bullet-horizontal-gap, 4px);
}
.swiper-horizontal > .swiper-pagination-bullets.swiper-pagination-bullets-dynamic,
.swiper-pagination-horizontal.swiper-pagination-bullets.swiper-pagination-bullets-dynamic {
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}
.swiper-horizontal > .swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet,
.swiper-pagination-horizontal.swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet {
  transition: 200ms transform,
        200ms left;
}
.swiper-horizontal.swiper-rtl > .swiper-pagination-bullets-dynamic .swiper-pagination-bullet {
  transition: 200ms transform,
    200ms right;
}
/* Fraction */
.swiper-pagination-fraction {
  color: var(--swiper-pagination-fraction-color, inherit);
}
/* Progress */
.swiper-pagination-progressbar {
  background: var(--swiper-pagination-progressbar-bg-color, rgba(0, 0, 0, 0.25));
  position: absolute;
}
.swiper-pagination-progressbar .swiper-pagination-progressbar-fill {
  background: var(--swiper-pagination-color, var(--swiper-theme-color));
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transform: scale(0);
  transform-origin: left top;
}
.swiper-rtl .swiper-pagination-progressbar .swiper-pagination-progressbar-fill {
  transform-origin: right top;
}
.swiper-horizontal > .swiper-pagination-progressbar,
.swiper-pagination-progressbar.swiper-pagination-horizontal,
.swiper-vertical > .swiper-pagination-progressbar.swiper-pagination-progressbar-opposite,
.swiper-pagination-progressbar.swiper-pagination-vertical.swiper-pagination-progressbar-opposite {
  width: 100%;
  height: var(--swiper-pagination-progressbar-size, 4px);
  left: 0;
  top: 0;
}
.swiper-vertical > .swiper-pagination-progressbar,
.swiper-pagination-progressbar.swiper-pagination-vertical,
.swiper-horizontal > .swiper-pagination-progressbar.swiper-pagination-progressbar-opposite,
.swiper-pagination-progressbar.swiper-pagination-horizontal.swiper-pagination-progressbar-opposite {
  width: var(--swiper-pagination-progressbar-size, 4px);
  height: 100%;
  left: 0;
  top: 0;
}
.swiper-pagination-lock {
  display: none;
}
:root {
  /*
  --swiper-scrollbar-border-radius: 10px;
  --swiper-scrollbar-top: auto;
  --swiper-scrollbar-bottom: 4px;
  --swiper-scrollbar-left: auto;
  --swiper-scrollbar-right: 4px;
  --swiper-scrollbar-sides-offset: 1%;
  --swiper-scrollbar-bg-color: rgba(0, 0, 0, 0.1);
  --swiper-scrollbar-drag-bg-color: rgba(0, 0, 0, 0.5);
  --swiper-scrollbar-size: 4px;
  */
}
.swiper-scrollbar {
  border-radius: var(--swiper-scrollbar-border-radius, 10px);
  position: relative;
  touch-action: none;
  background: var(--swiper-scrollbar-bg-color, rgba(0, 0, 0, 0.1));
}
.swiper-scrollbar-disabled > .swiper-scrollbar,
.swiper-scrollbar.swiper-scrollbar-disabled {
  display: none !important;
}
.swiper-horizontal > .swiper-scrollbar,
.swiper-scrollbar.swiper-scrollbar-horizontal {
  position: absolute;
  left: var(--swiper-scrollbar-sides-offset, 1%);
  bottom: var(--swiper-scrollbar-bottom, 4px);
  top: var(--swiper-scrollbar-top, auto);
  z-index: 50;
  height: var(--swiper-scrollbar-size, 4px);
  width: calc(100% - 2 * var(--swiper-scrollbar-sides-offset, 1%));
}
.swiper-vertical > .swiper-scrollbar,
.swiper-scrollbar.swiper-scrollbar-vertical {
  position: absolute;
  left: var(--swiper-scrollbar-left, auto);
  right: var(--swiper-scrollbar-right, 4px);
  top: var(--swiper-scrollbar-sides-offset, 1%);
  z-index: 50;
  width: var(--swiper-scrollbar-size, 4px);
  height: calc(100% - 2 * var(--swiper-scrollbar-sides-offset, 1%));
}
.swiper-scrollbar-drag {
  height: 100%;
  width: 100%;
  position: relative;
  background: var(--swiper-scrollbar-drag-bg-color, rgba(0, 0, 0, 0.5));
  border-radius: var(--swiper-scrollbar-border-radius, 10px);
  left: 0;
  top: 0;
}
.swiper-scrollbar-cursor-drag {
  cursor: move;
}
.swiper-scrollbar-lock {
  display: none;
}
/* Zoom container styles start */
.swiper-zoom-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.swiper-zoom-container > img,
.swiper-zoom-container > svg,
.swiper-zoom-container > canvas {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
/* Zoom container styles end */
.swiper-slide-zoomed {
  cursor: move;
  touch-action: none;
}
/* a11y */
.swiper .swiper-notification {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  opacity: 0;
  z-index: -1000;
}
.swiper-free-mode > .swiper-wrapper {
  transition-timing-function: ease-out;
  margin: 0 auto;
}
.swiper-grid > .swiper-wrapper {
  flex-wrap: wrap;
}
.swiper-grid-column > .swiper-wrapper {
  flex-wrap: wrap;
  flex-direction: column;
}
.swiper-fade.swiper-free-mode .swiper-slide {
  transition-timing-function: ease-out;
}
.swiper-fade .swiper-slide {
  pointer-events: none;
  transition-property: opacity;
}
.swiper-fade .swiper-slide .swiper-slide {
  pointer-events: none;
}
.swiper-fade .swiper-slide-active {
  pointer-events: auto;
}
.swiper-fade .swiper-slide-active .swiper-slide-active {
  pointer-events: auto;
}
.swiper.swiper-cube {
  overflow: visible;
}
.swiper-cube .swiper-slide {
  pointer-events: none;
  -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
  z-index: 1;
  visibility: hidden;
  transform-origin: 0 0;
  width: 100%;
  height: 100%;
}
.swiper-cube .swiper-slide .swiper-slide {
  pointer-events: none;
}
.swiper-cube.swiper-rtl .swiper-slide {
  transform-origin: 100% 0;
}
.swiper-cube .swiper-slide-active,
.swiper-cube .swiper-slide-active .swiper-slide-active {
  pointer-events: auto;
}
.swiper-cube .swiper-slide-active,
.swiper-cube .swiper-slide-next,
.swiper-cube .swiper-slide-prev {
  pointer-events: auto;
  visibility: visible;
}
.swiper-cube .swiper-cube-shadow {
  position: absolute;
  left: 0;
  bottom: 0px;
  width: 100%;
  height: 100%;
  opacity: 0.6;
  z-index: 0;
}
.swiper-cube .swiper-cube-shadow:before {
  content: '';
  background: #000;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  filter: blur(50px);
}
.swiper-cube .swiper-slide-next + .swiper-slide {
  pointer-events: auto;
  visibility: visible;
}
/* Cube slide shadows start */
.swiper-cube .swiper-slide-shadow-cube.swiper-slide-shadow-top,
.swiper-cube .swiper-slide-shadow-cube.swiper-slide-shadow-bottom,
.swiper-cube .swiper-slide-shadow-cube.swiper-slide-shadow-left,
.swiper-cube .swiper-slide-shadow-cube.swiper-slide-shadow-right {
  z-index: 0;
  -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
}
/* Cube slide shadows end */
.swiper.swiper-flip {
  overflow: visible;
}
.swiper-flip .swiper-slide {
  pointer-events: none;
  -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
  z-index: 1;
}
.swiper-flip .swiper-slide .swiper-slide {
  pointer-events: none;
}
.swiper-flip .swiper-slide-active,
.swiper-flip .swiper-slide-active .swiper-slide-active {
  pointer-events: auto;
}
/* Flip slide shadows start */
.swiper-flip .swiper-slide-shadow-flip.swiper-slide-shadow-top,
.swiper-flip .swiper-slide-shadow-flip.swiper-slide-shadow-bottom,
.swiper-flip .swiper-slide-shadow-flip.swiper-slide-shadow-left,
.swiper-flip .swiper-slide-shadow-flip.swiper-slide-shadow-right {
  z-index: 0;
  -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
}
/* Flip slide shadows end */
.swiper-creative .swiper-slide {
  -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
  overflow: hidden;
  transition-property: transform, opacity, height;
}
.swiper.swiper-cards {
  overflow: visible;
}
.swiper-cards .swiper-slide {
  transform-origin: center bottom;
  -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
  overflow: hidden;
}
`;
    }
  });
  var init_loader_extension = __esm({
    "src/libs/extensions/swiper/loader.extension.ts"() {
      "use strict";
    }
  });
  function loadSwiperStyles() {
    sdk.addWidgetCustomStyles(font_default);
    sdk.addSharedCssCustomStyles("swiper-bundle", swiper_bundle_default, [
      sdk.placement.getWidgetId(),
      "expanded-tiles",
      "ugc-products"
    ]);
  }
  var init_swiper2 = __esm({
    "src/libs/extensions/swiper/index.ts"() {
      "use strict";
      init_font();
      init_swiper_bundle();
      init_loader_extension();
      init_swiper_extension();
    }
  });
  var init_extensions = __esm({
    "src/libs/extensions/index.ts"() {
      "use strict";
      init_masonry_extension();
      init_swiper2();
    }
  });
  function EmbedYoutube({ tileId, videoId }) {
    const contentElement = loadYoutubeIframeContent(tileId, videoId);
    return /* @__PURE__ */ createElement(
      "iframe",
      {
        loading: "lazy",
        id: `yt-frame-${tileId}-${videoId}`,
        class: "video-content",
        frameborder: "0",
        srcdoc: contentElement.innerHTML
      }
    );
  }
  function loadYoutubeIframeContent(tileId, videoId) {
    const scriptId = `yt-script-${tileId}-${videoId}`;
    const playerId = `yt-player-${tileId}-${videoId}`;
    return /* @__PURE__ */ createElement("html", null, /* @__PURE__ */ createElement("head", null, /* @__PURE__ */ createElement("script", { id: scriptId, src: "https://www.youtube.com/iframe_api" }), /* @__PURE__ */ createElement("script", null, loadYoutubePlayerAPI(playerId, videoId))), /* @__PURE__ */ createElement("body", null, /* @__PURE__ */ createElement("div", { id: playerId })));
  }
  function loadYoutubePlayerAPI(playerId, videoId) {
    return `
  let player

  function loadPlayer(playDefault = false) {
    player = new YT.Player("${playerId}", {
      width: "100%",
      videoId: "${videoId}",
      playerVars: {
        playsinline: 1
      },
      events: {
        onReady: playDefault ? play : pause,
        onError: errorHandler
      }
    })
  }

  // API runs automatically once the iframe-api JS is downloaded.
  // This will not run when re-opening expanded tile
  function onYouTubeIframeAPIReady() {
    loadPlayer()
  }

  function errorHandler(e) {
   player?.getIframe().dispatchEvent(new CustomEvent("yt-video-error", { detail: e }))
  }

  function pause() {
    if (!player) {
      loadPlayer(false) //needed when expanded tile re-opened
    } else {
      player.mute()
      player.pauseVideo()
    }
  }

  function destroy() {
    player?.destroy()
  }

  function reset() {
    player?.seekTo(0, false)
  }

  function play() {
    if (!player) {
      loadPlayer(true) //needed when expanded tile re-opened
    } else {
     setTimeout(() => {
      if (player.isMuted()) {
        player.unMute()
      }
      player.playVideo()
      }, 500)
    }
  } `;
  }
  var init_embed_youtube_template = __esm({
    "src/libs/components/expanded-tile-swiper/embed-youtube.template.tsx"() {
      "use strict";
      init_libs();
    }
  });
  function ExpandedTile({ sdk: sdk2, tile }) {
    const { show_shopspots, show_products, show_tags, show_sharing, show_caption, show_timestamp } = sdk2.getExpandedTileConfig();
    const shopspotEnabled = sdk2.isComponentLoaded("shopspots") && show_shopspots && !!tile.hotspots?.length;
    const productsEnabled = sdk2.isComponentLoaded("products") && show_products && !!tile.tags_extended?.length;
    const tagsEnabled = show_tags;
    const sharingToolsEnabled = show_sharing;
    const parent = sdk2.getNodeId();
    return /* @__PURE__ */ createElement(createFragment, null, /* @__PURE__ */ createElement("div", { class: "panel" }, /* @__PURE__ */ createElement("div", { class: "panel-left" }, /* @__PURE__ */ createElement(IconSection, { tile, productsEnabled }), /* @__PURE__ */ createElement("div", { class: "image-wrapper" }, /* @__PURE__ */ createElement("div", { class: "image-wrapper-inner" }, tile.media === "video" ? /* @__PURE__ */ createElement(createFragment, null, /* @__PURE__ */ createElement(VideoContainer, { tile, parent }), /* @__PURE__ */ createElement(VideoErrorFallbackTemplate, { tile })) : tile.media === "image" ? /* @__PURE__ */ createElement(ImageTemplate, { tile, image: tile.image, shopspotEnabled, parent }) : tile.media === "text" ? /* @__PURE__ */ createElement("span", { class: "content-text" }, tile.message) : tile.media === "html" ? /* @__PURE__ */ createElement("span", { class: "content-html" }, tile.html) : /* @__PURE__ */ createElement(createFragment, null)))), /* @__PURE__ */ createElement("div", { class: "panel-right" }, /* @__PURE__ */ createElement("div", { class: "panel-right-wrapper" }, /* @__PURE__ */ createElement("div", { class: "content-wrapper" }, /* @__PURE__ */ createElement("div", { class: "content-inner-wrapper" }, /* @__PURE__ */ createElement(
      "tile-content",
      {
        tileId: tile.id,
        "render-share-menu": sharingToolsEnabled,
        "render-caption": show_caption,
        "render-timephrase": show_timestamp
      }
    ), tagsEnabled && /* @__PURE__ */ createElement("tile-tags", { "tile-id": tile.id, mode: "swiper", context: "expanded" }), productsEnabled && /* @__PURE__ */ createElement(createFragment, null, /* @__PURE__ */ createElement("ugc-products", { parent, "tile-id": tile.id }))))))));
  }
  function IconSection({ tile, productsEnabled }) {
    const topSectionIconContent = [];
    const bottomSectionIconContent = [];
    if (tile.attrs.includes("instagram.reel")) {
      topSectionIconContent.push(/* @__PURE__ */ createElement("div", { class: "content-icon icon-reel" }));
    } else if (tile.attrs.includes("youtube.short")) {
      topSectionIconContent.push(/* @__PURE__ */ createElement("div", { class: "content-icon icon-youtube-short" }));
    }
    if (productsEnabled) {
      topSectionIconContent.push(/* @__PURE__ */ createElement("div", { class: "shopping-icon icon-products" }));
    }
    bottomSectionIconContent.push(/* @__PURE__ */ createElement("div", { class: `network-icon icon-${tile.source}` }));
    return /* @__PURE__ */ createElement("div", { class: "icon-section" }, /* @__PURE__ */ createElement("div", { class: "top-section" }, ...topSectionIconContent), /* @__PURE__ */ createElement("div", { class: "bottom-section" }, ...bottomSectionIconContent));
  }
  function ShopSpotTemplate({ shopspotEnabled, parent, tileId }) {
    return shopspotEnabled ? /* @__PURE__ */ createElement(createFragment, null, /* @__PURE__ */ createElement("shopspot-icon", { parent, mode: "expanded", "tile-id": tileId })) : /* @__PURE__ */ createElement(createFragment, null);
  }
  function ImageTemplate({
    tile,
    image,
    shopspotEnabled = false,
    parent
  }) {
    return image ? /* @__PURE__ */ createElement(createFragment, null, /* @__PURE__ */ createElement("div", { class: "image-filler", style: { "background-image": `url('${image}')` } }), /* @__PURE__ */ createElement("div", { class: "image" }, shopspotEnabled ? /* @__PURE__ */ createElement(ShopSpotTemplate, { shopspotEnabled, parent, tileId: tile.id }) : /* @__PURE__ */ createElement(createFragment, null), /* @__PURE__ */ createElement("img", { class: "image-element", src: image, loading: "lazy", alt: tile.description || "Image" }))) : /* @__PURE__ */ createElement(createFragment, null);
  }
  function VideoContainer({ tile, parent }) {
    return /* @__PURE__ */ createElement("div", { class: "video-content-wrapper" }, /* @__PURE__ */ createElement("div", { class: "image-filler", style: { "background-image": `url('${tile.original_image_url}')` } }), /* @__PURE__ */ createElement(SourceVideoContent, { tile, parent }));
  }
  function SourceVideoContent({ tile, parent }) {
    if (tile.source === "tiktok" || tile.video_source === "tiktok") {
      return /* @__PURE__ */ createElement(TikTokTemplate, { tile });
    }
    if (tile.source === "youtube" && tile.youtube_id) {
      return /* @__PURE__ */ createElement(EmbedYoutube, { tileId: tile.id, videoId: tile.youtube_id });
    }
    if (tile.source === "facebook") {
      const videoUrlPattern = /videos\/(\d)+?/;
      if (!tile.video_files?.length || !videoUrlPattern.test(tile.video_files[0].url)) {
        return /* @__PURE__ */ createElement(VideoErrorFallbackTemplate, { tile, parent, defaultHidden: false });
      }
    }
    if (tile.source === "twitter") {
      return /* @__PURE__ */ createElement(TwitterTemplate, { tile });
    }
    if (tile.video_files?.length || tile.video && tile.video.standard_resolution) {
      return /* @__PURE__ */ createElement(UgcVideoTemplate, { tile });
    }
    return /* @__PURE__ */ createElement(FacebookFallbackTemplate, { tile });
  }
  function getVideoData(tile) {
    if (tile.video_files?.length) {
      return tile.video_files[0];
    }
    if (tile.video && tile.video.standard_resolution) {
      return {
        width: "auto",
        height: "auto",
        mime: "video/mp4",
        url: tile.video.standard_resolution.url
      };
    }
    throw new Error("Failed to find video data");
  }
  function UgcVideoTemplate({ tile }) {
    const { url, width, height, mime } = getVideoData(tile);
    return /* @__PURE__ */ createElement(
      "video",
      {
        muted: true,
        tileid: tile.id,
        class: "video-content",
        controls: true,
        preload: "none",
        playsinline: "playsinline",
        oncanplay: "this.muted=true"
      },
      /* @__PURE__ */ createElement("source", { src: url, width: width.toString(), height: height.toString(), type: mime })
    );
  }
  function TwitterTemplate({ tile }) {
    const { standard_resolution } = tile.video;
    return /* @__PURE__ */ createElement(
      "video",
      {
        tileid: tile.id,
        class: "video-content",
        controls: true,
        preload: "none",
        playsinline: "playsinline",
        oncanplay: "this.muted=true"
      },
      /* @__PURE__ */ createElement("source", { src: standard_resolution.url })
    );
  }
  function TikTokTemplate({ tile }) {
    const tiktokId = tile.tiktok_id;
    return /* @__PURE__ */ createElement(
      "iframe",
      {
        id: `tiktok-frame-${tile.id}-${tiktokId}`,
        loading: "lazy",
        class: "video-content",
        frameborder: "0",
        allowfullscreen: true,
        allow: "autoplay",
        src: `https://www.tiktok.com/player/v1/${tiktokId}?rel=0`
      }
    );
  }
  function FacebookFallbackTemplate({ tile }) {
    const embedBlock = /* @__PURE__ */ createElement("div", { class: "fb-content-wrapper" }, /* @__PURE__ */ createElement("div", { id: "fb-root" }), /* @__PURE__ */ createElement(
      "script",
      {
        async: true,
        defer: true,
        crossorigin: "anonymous",
        src: "https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v21.0"
      }
    ), /* @__PURE__ */ createElement("div", { class: "fb-video", "data-href": tile.original_link, "data-width": "500", "data-show-text": "false" }, /* @__PURE__ */ createElement("blockquote", { cite: tile.original_link, class: "fb-xfbml-parse-ignore" }, /* @__PURE__ */ createElement("a", { href: tile.original_link }), /* @__PURE__ */ createElement("p", null), "Posted by ", /* @__PURE__ */ createElement("a", { href: `https://www.facebook.com/$${tile.source_user_id}` }, tile.name), " on", tile.time_ago)));
    return /* @__PURE__ */ createElement("iframe", { loading: "lazy", class: "video-content", frameborder: "0", allowfullscreen: true, srcdoc: embedBlock.innerHTML });
  }
  function VideoErrorFallbackTemplate({
    tile,
    defaultHidden = true
  }) {
    const originalImageUrl = tile.original_image_url;
    const fallbackCss = `video-fallback-content${defaultHidden ? " hidden" : ""}`;
    return /* @__PURE__ */ createElement("div", { class: fallbackCss }, /* @__PURE__ */ createElement("div", { class: "center-section" }, /* @__PURE__ */ createElement("div", { class: "play-icon" })), /* @__PURE__ */ createElement("a", { href: tile.original_url || tile.original_link, target: "_blank" }, /* @__PURE__ */ createElement(ImageTemplate, { image: originalImageUrl, tile }), /* @__PURE__ */ createElement("div", { class: "play-icon" })));
  }
  var init_tile_template = __esm({
    "src/libs/components/expanded-tile-swiper/tile.template.tsx"() {
      "use strict";
      init_libs();
      init_embed_youtube_template();
    }
  });
  function ExpandedTiles(sdk2) {
    const tiles = sdk2.tiles.tiles;
    const { show_nav } = sdk2.getExpandedTileConfig();
    const navigationArrowsEnabled = show_nav;
    return /* @__PURE__ */ createElement("div", { class: "expanded-tile-wrapper" }, /* @__PURE__ */ createElement("a", { class: "exit", href: "#" }, /* @__PURE__ */ createElement("span", { class: "widget-icon close-white" })), /* @__PURE__ */ createElement(BackArrowIcon, null), /* @__PURE__ */ createElement("div", { class: "swiper swiper-expanded" }, /* @__PURE__ */ createElement("div", { class: "swiper-wrapper ugc-tiles" }, Object.values(tiles).map((tile) => /* @__PURE__ */ createElement(
      "div",
      {
        class: "ugc-tile swiper-slide",
        "data-id": tile.id,
        "data-yt-id": tile.youtube_id || "",
        "data-tiktok-id": tile.tiktok_id || ""
      },
      /* @__PURE__ */ createElement(ExpandedTile, { sdk: sdk2, tile })
    )))), /* @__PURE__ */ createElement(
      "div",
      {
        class: "swiper-expanded-button-prev swiper-button-prev btn-lg",
        style: { display: navigationArrowsEnabled ? "flex" : "none" }
      },
      /* @__PURE__ */ createElement("span", { class: "chevron-left", alt: "Previous arrow" })
    ), /* @__PURE__ */ createElement(
      "div",
      {
        class: "swiper-expanded-button-next swiper-button-next btn-lg",
        style: { display: navigationArrowsEnabled ? "flex" : "none" }
      },
      /* @__PURE__ */ createElement("span", { class: "chevron-right", alt: "Next arrow" })
    ));
  }
  function BackArrowIcon() {
    return /* @__PURE__ */ createElement("a", { class: "back", href: "#" }, /* @__PURE__ */ createElement("span", { class: "widget-icon back-arrow" }));
  }
  var init_base_template = __esm({
    "src/libs/components/expanded-tile-swiper/base.template.tsx"() {
      "use strict";
      init_tile_template();
      init_libs();
    }
  });
  function loadDefaultExpandedTileTemplates(addExpandedTileTemplates) {
    if (addExpandedTileTemplates) {
      sdk.addTemplateToComponent(ExpandedTiles, "expanded-tiles");
    }
  }
  function loadWidgetFonts(defaultFont) {
    sdk.addWidgetCustomStyles(` 
    @import url('${defaultFont}');
  body {
    font-family: 'Inter', sans-serif;
  }`);
  }
  function loadExpandedTileTemplates(settings) {
    loadDefaultExpandedTileTemplates(settings.useDefaultExpandedTileTemplates);
    loadWidgetFonts(settings.defaultFont);
    if (settings.useDefaultSwiperStyles) {
      loadSwiperStyles();
    }
  }
  var init_expanded_tile_swiper = __esm({
    "src/libs/components/expanded-tile-swiper/index.ts"() {
      "use strict";
      init_base_template();
      init_swiper2();
    }
  });
  function LoadMoreTemplate() {
    return /* @__PURE__ */ createElement("div", { id: "buttons" }, /* @__PURE__ */ createElement("a", { id: "load-more" }, "LOAD MORE"));
  }
  var init_load_more_template = __esm({
    "src/libs/components/load-more/load-more.template.tsx"() {
      "use strict";
      init_libs();
    }
  });
  var LoadMoreComponent;
  var init_load_more_component = __esm({
    "src/libs/components/load-more/load-more.component.ts"() {
      "use strict";
      init_load_more_template();
      LoadMoreComponent = class extends HTMLElement {
        constructor() {
          super();
        }
        connectedCallback() {
          this.appendChild(LoadMoreTemplate());
        }
        disconnectedCallback() {
          this.replaceChildren();
        }
      };
      try {
        customElements.define("load-more", LoadMoreComponent);
      } catch (err) {
      }
    }
  });
  var load_more_exports = {};
  __export(load_more_exports, {
    default: () => load_more_default
  });
  var load_more_default;
  var init_load_more = __esm({
    "src/libs/components/load-more/index.ts"() {
      "use strict";
      init_load_more_component();
      load_more_default = LoadMoreComponent;
    }
  });
  var init_components = __esm({
    "src/libs/components/index.ts"() {
      "use strict";
      init_expanded_tile_swiper();
      init_load_more();
    }
  });
  var init_libs = __esm({
    "src/libs/index.ts"() {
      "use strict";
      init_css_variables();
      init_jsx_html();
      init_tile_lib();
      init_widget_components();
      init_widget_features();
      init_widget_layout();
      init_widget_utils();
      init_extensions();
      init_components();
    }
  });
  function loadListeners(settings) {
    const {
      onLoad: onLoad22,
      onExpandTile,
      onTileClose,
      onTileRendered: onTileRendered2,
      onCrossSellersRendered,
      onTilesUpdated,
      onWidgetInitComplete,
      onTileBgImgRenderComplete,
      onTileBgImageError,
      onResize: onResize22,
      onLoadMore,
      onProductActionClick,
      onExpandedTileImageLoad,
      onExpandedTileOpen,
      onExpandedTileClose,
      onBeforeExpandedTileImageResize,
      onBeforeExpandedTileClose,
      onBeforeExpandedTileOpen,
      onShopspotFlyoutExpand,
      onShopspotToggle,
      onShopspotOpen,
      onShopspotActionClick,
      onUserClick,
      onShareClick,
      onImpression,
      onLike,
      onDislike,
      onHover,
      onProductClick,
      onProductPinClick,
      onProductUserClick,
      onShopspotFlyout,
      onTileMetadataLoaded,
      onTileDataSet,
      onHtmlRendered,
      onJsRendered,
      onGlobalsLoaded,
      onProductPageLoaded,
      onProductsUpdated,
      onAddToCartFailed,
      onEmailTileLoad,
      onEmailTileClick,
      onLikeClick,
      onDislikeClick,
      onTileExpandProductRecsRendered,
      onTileExpandCrossSellersRendered,
      onShareMenuOpened,
      onShareMenuClosed
    } = settings.callbacks;
    onLoad22?.forEach((event2) => registerGenericEventListener(EVENT_LOAD, event2));
    onExpandTile?.forEach((event2) => registerGenericEventListener(EVENT_TILE_EXPAND_RENDERED, event2));
    onTileClose?.forEach((event2) => registerGenericEventListener("onTileClose", event2));
    onTileRendered2?.forEach((event2) => registerTileExpandListener(event2));
    onCrossSellersRendered?.forEach((event2) => registerGenericEventListener("crossSellersRendered", event2));
    onWidgetInitComplete?.forEach((event2) => registerGenericEventListener("widgetInit", event2));
    onTileBgImgRenderComplete?.forEach((event2) => registerGenericEventListener(EVENT_TILE_BG_IMG_RENDER_COMPLETE, event2));
    onTileBgImageError?.forEach((event2) => registerGenericEventListener(EVENT_TILE_BG_IMG_ERROR, event2));
    onResize22?.forEach((event2) => window.addEventListener("resize", event2));
    onTilesUpdated?.forEach((event2) => registerGenericEventListener(EVENT_TILES_UPDATED, event2));
    onLoadMore?.forEach((event2) => registerGenericEventListener("loadMore", event2));
    onProductActionClick?.forEach((event2) => registerGenericEventListener(PRODUCT_ACTION_CLICK, event2));
    onExpandedTileImageLoad?.forEach((event2) => registerGenericEventListener(EXPANDED_TILE_IMAGE_LOAD, event2));
    onExpandedTileOpen?.forEach((event2) => registerGenericEventListener(EXPANDED_TILE_OPEN, event2));
    onExpandedTileClose?.forEach((event2) => registerGenericEventListener(EXPANDED_TILE_CLOSE, event2));
    onBeforeExpandedTileImageResize?.forEach(
      (event2) => registerGenericEventListener(BEFORE_EXPANDED_TILE_IMAGE_RESIZE, event2)
    );
    onBeforeExpandedTileClose?.forEach((event2) => registerGenericEventListener(BEFORE_EXPANDED_TILE_CLOSE, event2));
    onBeforeExpandedTileOpen?.forEach((event2) => registerGenericEventListener(BEFORE_EXPANDED_TILE_OPEN, event2));
    onShopspotFlyoutExpand?.forEach((event2) => registerGenericEventListener(SHOPSPOT_FLYOUT_EXPAND, event2));
    onShopspotToggle?.forEach((event2) => registerGenericEventListener(SHOPSPOT_TOGGLE, event2));
    onShopspotOpen?.forEach((event2) => registerGenericEventListener(SHOPSPOT_OPEN, event2));
    onShopspotActionClick?.forEach((event2) => registerGenericEventListener(SHOPSPOT_ACTION_CLICK, event2));
    onUserClick?.forEach((event2) => registerGenericEventListener(USER_CLICK, event2));
    onShareClick?.forEach((event2) => registerGenericEventListener(EVENT_SHARE_CLICK, event2));
    onImpression?.forEach((event2) => registerGenericEventListener(EVENT_IMPRESSION, event2));
    onLike?.forEach((event2) => registerGenericEventListener(EVENT_LIKE, event2));
    onDislike?.forEach((event2) => registerGenericEventListener(EVENT_DISLIKE, event2));
    onHover?.forEach((event2) => registerGenericEventListener(EVENT_HOVER, event2));
    onProductClick?.forEach((event2) => registerGenericEventListener(EVENT_PRODUCT_CLICK, event2));
    onProductPinClick?.forEach((event2) => registerGenericEventListener(EVENT_PRODUCT_PINCLICK, event2));
    onProductUserClick?.forEach((event2) => registerGenericEventListener(EVENT_PRODUCT_USER_CLICK, event2));
    onShopspotFlyout?.forEach((event2) => registerGenericEventListener(EVENT_SHOPSPOT_FLYOUT, event2));
    onTileMetadataLoaded?.forEach((event2) => registerGenericEventListener(EVENT_TILE_METADATA_LOADED, event2));
    onTileDataSet?.forEach((event2) => registerGenericEventListener(EVENT_TILE_DATA_SET, event2));
    onHtmlRendered?.forEach((event2) => registerGenericEventListener(EVENT_HTML_RENDERED, event2));
    onJsRendered?.forEach((event2) => registerGenericEventListener(EVENT_JS_RENDERED, event2));
    onGlobalsLoaded?.forEach((event2) => registerGenericEventListener(EVENT_GLOBALS_LOADED, event2));
    onProductPageLoaded?.forEach((event2) => registerGenericEventListener(EVENT_PRODUCT_PAGE_LOADED, event2));
    onProductsUpdated?.forEach((event2) => registerGenericEventListener(EVENT_PRODUCTS_UPDATED, event2));
    onAddToCartFailed?.forEach((event2) => registerGenericEventListener(EVENT_ADD_TO_CART_FAILED, event2));
    onEmailTileLoad?.forEach((event2) => registerGenericEventListener(EMAIL_TILE_LOAD, event2));
    onEmailTileClick?.forEach((event2) => registerGenericEventListener(EMAIL_TILE_CLICK, event2));
    onLikeClick?.forEach((event2) => registerGenericEventListener(LIKE_CLICK, event2));
    onDislikeClick?.forEach((event2) => registerGenericEventListener(DISLIKE_CLICK, event2));
    onTileExpandProductRecsRendered?.forEach(
      (event2) => registerGenericEventListener(EVENT_TILE_EXPAND_PROD_RECS_RENDERED, event2)
    );
    onTileExpandCrossSellersRendered?.forEach(
      (event2) => registerGenericEventListener(EVENT_TILE_EXPAND_CROSS_SELLERS_RENDERED, event2)
    );
    onShareMenuOpened?.forEach((event2) => registerGenericEventListener(EVENT_SHARE_MENU_OPENED, event2));
    onShareMenuClosed?.forEach((event2) => registerGenericEventListener(EVENT_SHARE_MENU_CLOSED, event2));
  }
  function registerDefaultClickEvents() {
    const tiles = sdk.querySelectorAll(".ugc-tile");
    if (!tiles) {
      throw new Error("Failed to find tiles UI element");
    }
    tiles.forEach((tile) => {
      const tileDataId = tile.getAttribute("data-id");
      if (!tileDataId) {
        throw new Error("Failed to find tile data ID");
      }
      const url = sdk.tiles.getTile(tileDataId)?.original_url;
      if (!url) {
        console.warn("Failed to find tile URL", tile);
        return;
      }
      tile.onclick = (e) => {
        handleTileClick(e, url);
      };
    });
  }
  function registerTileExpandListener(fn = () => {
  }) {
    sdk.addEventListener(EVENT_TILE_EXPAND, (event2) => {
      const customEvent = event2;
      const tileId = customEvent.detail.data.tileId;
      fn(tileId);
    });
  }
  function registerCrossSellersLoadListener(fn = () => {
  }) {
    sdk.addEventListener(EVENT_TILE_EXPAND_CROSS_SELLERS_RENDERED, (event2) => {
      const customEvent = event2;
      const tileId = customEvent.detail.data;
      const target = customEvent.detail.target;
      fn(tileId, target);
    });
  }
  function registerGenericEventListener(eventName, fn) {
    sdk.addEventListener(eventName, fn);
  }
  function registerShareMenuOpenedListener(fn = () => {
  }) {
    sdk.addEventListener(EVENT_SHARE_MENU_OPENED, (event2) => {
      const customEvent = event2;
      const sourceId = customEvent.detail.sourceId;
      fn(sourceId);
    });
  }
  function registerShareMenuClosedListener(fn = () => {
  }) {
    sdk.addEventListener(EVENT_SHARE_MENU_CLOSED, (event2) => {
      const customEvent = event2;
      const sourceId = customEvent.detail.sourceId;
      fn(sourceId);
    });
  }
  var PRODUCT_ACTION_CLICK;
  var EXPANDED_TILE_IMAGE_LOAD;
  var EXPANDED_TILE_OPEN;
  var EXPANDED_TILE_CLOSE;
  var BEFORE_EXPANDED_TILE_IMAGE_RESIZE;
  var EXPANDED_TILE_IMAGE_RESIZE;
  var BEFORE_EXPANDED_TILE_CLOSE;
  var BEFORE_EXPANDED_TILE_OPEN;
  var SHOPSPOT_FLYOUT_EXPAND;
  var SHOPSPOT_TOGGLE;
  var SHOPSPOT_OPEN;
  var SHOPSPOT_ACTION_CLICK;
  var USER_CLICK;
  var EVENT_IMPRESSION;
  var EVENT_LOAD;
  var EVENT_LOAD_MORE;
  var EVENT_LIKE;
  var EVENT_DISLIKE;
  var EVENT_HOVER;
  var EVENT_PRODUCT_CLICK;
  var EVENT_PRODUCT_PINCLICK;
  var EVENT_TILE_EXPAND;
  var EVENT_PRODUCT_USER_CLICK;
  var EVENT_SHARE_CLICK;
  var EVENT_SHOPSPOT_FLYOUT;
  var EVENT_TILE_METADATA_LOADED;
  var EVENT_TILE_DATA_SET;
  var EVENT_HTML_RENDERED;
  var EVENT_JS_RENDERED;
  var EVENT_GLOBALS_LOADED;
  var CROSS_SELLERS_LOADED;
  var EVENT_PRODUCT_PAGE_LOADED;
  var EVENT_PRODUCTS_UPDATED;
  var EVENT_ADD_TO_CART_FAILED;
  var EVENT_TILES_UPDATED;
  var WIDGET_INIT_COMPLETE;
  var EMAIL_TILE_LOAD;
  var EMAIL_TILE_CLICK;
  var LIKE_CLICK;
  var DISLIKE_CLICK;
  var EVENT_TILE_EXPAND_RENDERED;
  var EVENT_TILE_EXPAND_PROD_RECS_RENDERED;
  var EVENT_TILE_EXPAND_CROSS_SELLERS_RENDERED;
  var EVENT_TILE_BG_IMG_ERROR;
  var EVENT_TILE_BG_IMG_RENDER_COMPLETE;
  var EVENT_SHARE_MENU_OPENED;
  var EVENT_SHARE_MENU_CLOSED;
  var allEvents;
  var callbackDefaults;
  var init_events = __esm({
    "src/events/index.ts"() {
      "use strict";
      init_libs();
      PRODUCT_ACTION_CLICK = "productActionClick";
      EXPANDED_TILE_IMAGE_LOAD = "expandedTileImageLoad";
      EXPANDED_TILE_OPEN = "expandedTileOpen";
      EXPANDED_TILE_CLOSE = "expandedTileClose";
      BEFORE_EXPANDED_TILE_IMAGE_RESIZE = "beforeExpandedTileImageResize";
      EXPANDED_TILE_IMAGE_RESIZE = "expandedTileImageResize";
      BEFORE_EXPANDED_TILE_CLOSE = "beforeExpandedTileClose";
      BEFORE_EXPANDED_TILE_OPEN = "beforeExpandedTileOpen";
      SHOPSPOT_FLYOUT_EXPAND = "shopspotFlyoutExpand";
      SHOPSPOT_TOGGLE = "shopspotToggle";
      SHOPSPOT_OPEN = "shopspotOpen";
      SHOPSPOT_ACTION_CLICK = "shopspotActionClick";
      USER_CLICK = "userClick";
      EVENT_IMPRESSION = "impression";
      EVENT_LOAD = "load";
      EVENT_LOAD_MORE = "moreLoad";
      EVENT_LIKE = "like";
      EVENT_DISLIKE = "dislike";
      EVENT_HOVER = "tileHover";
      EVENT_PRODUCT_CLICK = "productClick";
      EVENT_PRODUCT_PINCLICK = "pinClick";
      EVENT_TILE_EXPAND = "tileExpand";
      EVENT_PRODUCT_USER_CLICK = "userClick";
      EVENT_SHARE_CLICK = "shareClick";
      EVENT_SHOPSPOT_FLYOUT = "shopspotFlyout";
      EVENT_TILE_METADATA_LOADED = "tileMetadataLoaded";
      EVENT_TILE_DATA_SET = "tileDataSet";
      EVENT_HTML_RENDERED = "htmlRendered";
      EVENT_JS_RENDERED = "jsRendered";
      EVENT_GLOBALS_LOADED = "globalsLoaded";
      CROSS_SELLERS_LOADED = "crossSellersLoaded";
      EVENT_PRODUCT_PAGE_LOADED = "productPageLoaded";
      EVENT_PRODUCTS_UPDATED = "productsUpdated";
      EVENT_ADD_TO_CART_FAILED = "addToCartFailed";
      EVENT_TILES_UPDATED = "tilesUpdated";
      WIDGET_INIT_COMPLETE = "widgetInitComplete";
      EMAIL_TILE_LOAD = "emailTileLoad";
      EMAIL_TILE_CLICK = "emailTileClick";
      LIKE_CLICK = "likeClick";
      DISLIKE_CLICK = "dislikeClick";
      EVENT_TILE_EXPAND_RENDERED = "expandedTileRendered";
      EVENT_TILE_EXPAND_PROD_RECS_RENDERED = "tileExpandProductRecsRendered";
      EVENT_TILE_EXPAND_CROSS_SELLERS_RENDERED = "tileExpandCrossSellersRendered";
      EVENT_TILE_BG_IMG_ERROR = "tileBgImageError";
      EVENT_TILE_BG_IMG_RENDER_COMPLETE = "tileBgImgRenderComplete";
      EVENT_SHARE_MENU_OPENED = "shareMenuOpened";
      EVENT_SHARE_MENU_CLOSED = "shareMenuClosed";
      allEvents = [
        PRODUCT_ACTION_CLICK,
        EXPANDED_TILE_IMAGE_LOAD,
        EXPANDED_TILE_OPEN,
        EXPANDED_TILE_CLOSE,
        BEFORE_EXPANDED_TILE_IMAGE_RESIZE,
        EXPANDED_TILE_IMAGE_RESIZE,
        BEFORE_EXPANDED_TILE_CLOSE,
        BEFORE_EXPANDED_TILE_OPEN,
        SHOPSPOT_FLYOUT_EXPAND,
        SHOPSPOT_TOGGLE,
        SHOPSPOT_OPEN,
        SHOPSPOT_ACTION_CLICK,
        USER_CLICK,
        EVENT_IMPRESSION,
        EVENT_LOAD,
        EVENT_LOAD_MORE,
        EVENT_LIKE,
        EVENT_DISLIKE,
        EVENT_HOVER,
        EVENT_PRODUCT_CLICK,
        EVENT_PRODUCT_PINCLICK,
        EVENT_TILE_EXPAND,
        EVENT_PRODUCT_USER_CLICK,
        EVENT_SHARE_CLICK,
        EVENT_SHOPSPOT_FLYOUT,
        EVENT_TILE_METADATA_LOADED,
        EVENT_TILE_DATA_SET,
        EVENT_HTML_RENDERED,
        EVENT_JS_RENDERED,
        EVENT_GLOBALS_LOADED,
        CROSS_SELLERS_LOADED,
        EVENT_PRODUCT_PAGE_LOADED,
        EVENT_PRODUCTS_UPDATED,
        EVENT_ADD_TO_CART_FAILED,
        EVENT_TILES_UPDATED,
        WIDGET_INIT_COMPLETE,
        EMAIL_TILE_LOAD,
        EMAIL_TILE_CLICK,
        LIKE_CLICK,
        DISLIKE_CLICK,
        EVENT_TILE_EXPAND_RENDERED,
        EVENT_TILE_EXPAND_PROD_RECS_RENDERED,
        EVENT_TILE_EXPAND_CROSS_SELLERS_RENDERED,
        EVENT_TILE_BG_IMG_ERROR,
        EVENT_TILE_BG_IMG_RENDER_COMPLETE,
        EVENT_SHARE_MENU_OPENED,
        EVENT_SHARE_MENU_CLOSED
      ];
      callbackDefaults = {
        onResize: [],
        onLoad: [],
        onExpandTile: [],
        onTileClose: [],
        onTileRendered: [],
        onTilesUpdated: [],
        onCrossSellersRendered: [],
        onWidgetInitComplete: [],
        onTileBgImgRenderComplete: [],
        onTileBgImageError: [],
        onProductActionClick: [],
        onExpandedTileImageLoad: [],
        onExpandedTileOpen: [],
        onExpandedTileClose: [],
        onBeforeExpandedTileImageResize: [],
        onBeforeExpandedTileClose: [],
        onBeforeExpandedTileOpen: [],
        onShopspotFlyoutExpand: [],
        onShopspotToggle: [],
        onShopspotOpen: [],
        onShopspotActionClick: [],
        onUserClick: [],
        onShareClick: [],
        onImpression: [],
        onLoadMore: [],
        onLike: [],
        onDislike: [],
        onHover: [],
        onProductClick: [],
        onProductPinClick: [],
        onProductUserClick: [],
        onShopspotFlyout: [],
        onTileMetadataLoaded: [],
        onTileDataSet: [],
        onHtmlRendered: [],
        onJsRendered: [],
        onGlobalsLoaded: [],
        onProductPageLoaded: [],
        onProductsUpdated: [],
        onAddToCartFailed: [],
        onEmailTileLoad: [],
        onEmailTileClick: [],
        onLikeClick: [],
        onDislikeClick: [],
        onTileExpandProductRecsRendered: [],
        onTileExpandCrossSellersRendered: [],
        onShareMenuOpened: [],
        onShareMenuClosed: []
      };
    }
  });
  function exceedsBoundaries(sdk2, windowInstance) {
    const tiles = sdk2.querySelectorAll(".ugc-tile");
    if (!tiles) {
      throw new Error("Failed to find tiles for boundary check");
    }
    const lastTile = tiles.item(tiles.length - 1);
    if (!lastTile) {
      throw new Error("Failed to find last tile");
    }
    const lastTilePosition = lastTile.getBoundingClientRect().top + lastTile.offsetHeight;
    return lastTilePosition <= windowInstance.innerHeight + 100;
  }
  function useInfiniteScroller(sdk2, windowInstance = window, onLoadMore = () => {
    sdk2.triggerEvent(EVENT_LOAD_MORE);
  }) {
    function onScroll22() {
      if (windowInstance.scrollLocked)
        return;
      windowInstance.scrollLocked = true;
      if (exceedsBoundaries(sdk2, windowInstance)) {
        onLoadMore();
      }
      windowInstance.scrollLocked = false;
    }
    windowInstance.addEventListener("scroll", onScroll22);
  }
  var useInfiniteScroller_default;
  var init_useInfiniteScroller = __esm({
    "src/hooks/useInfiniteScroller.ts"() {
      "use strict";
      init_events();
      useInfiniteScroller_default = useInfiniteScroller;
    }
  });
  var init_hooks = __esm({
    "src/hooks/index.ts"() {
      "use strict";
      init_useInfiniteScroller();
    }
  });
  var init_widgets = __esm({
    "src/types/widgets.ts"() {
      "use strict";
    }
  });
  var init_types = __esm({
    "src/types/types.ts"() {
      "use strict";
    }
  });
  var init_ugc_component = __esm({
    "src/types/components/ugc.component.ts"() {
      "use strict";
    }
  });
  var init_products_component = __esm({
    "src/types/components/products.component.ts"() {
      "use strict";
    }
  });
  var init_share_menu_component = __esm({
    "src/types/components/share-menu.component.ts"() {
      "use strict";
    }
  });
  var init_static_component = __esm({
    "src/types/components/static.component.ts"() {
      "use strict";
    }
  });
  var init_tile_component = __esm({
    "src/types/components/tile-component.ts"() {
      "use strict";
    }
  });
  var init_components2 = __esm({
    "src/types/components/index.ts"() {
      "use strict";
      init_ugc_component();
      init_products_component();
      init_share_menu_component();
      init_static_component();
      init_tile_component();
    }
  });
  var init_placement = __esm({
    "src/types/core/placement.ts"() {
      "use strict";
    }
  });
  var init_sdk = __esm({
    "src/types/core/sdk.ts"() {
      "use strict";
    }
  });
  var init_tile = __esm({
    "src/types/core/tile.ts"() {
      "use strict";
    }
  });
  var init_widget_request = __esm({
    "src/types/core/widget-request.ts"() {
      "use strict";
    }
  });
  var init_core = __esm({
    "src/types/core/index.ts"() {
      "use strict";
      init_placement();
      init_sdk();
      init_tile();
      init_widget_request();
    }
  });
  var init_base_service = __esm({
    "src/types/services/base.service.ts"() {
      "use strict";
    }
  });
  var init_event_service = __esm({
    "src/types/services/event.service.ts"() {
      "use strict";
    }
  });
  var init_tiles_service = __esm({
    "src/types/services/tiles.service.ts"() {
      "use strict";
    }
  });
  var init_widget_service = __esm({
    "src/types/services/widget.service.ts"() {
      "use strict";
    }
  });
  var init_tile_event = __esm({
    "src/types/services/events/tile-event.ts"() {
      "use strict";
    }
  });
  var init_widget_event = __esm({
    "src/types/services/events/widget-event.ts"() {
      "use strict";
    }
  });
  var init_services = __esm({
    "src/types/services/index.ts"() {
      "use strict";
      init_base_service();
      init_event_service();
      init_tiles_service();
      init_widget_service();
      init_tile_event();
      init_widget_event();
    }
  });
  var init_SdkSwiper = __esm({
    "src/types/SdkSwiper.ts"() {
      "use strict";
    }
  });
  var init_types2 = __esm({
    "src/types/index.ts"() {
      "use strict";
      init_widgets();
      init_types();
      init_components2();
      init_core();
      init_services();
      init_SdkSwiper();
    }
  });
  function loadMasonryCallbacks(settings) {
    settings.callbacks.onTilesUpdated.push(() => {
      renderMasonryLayout();
    });
    settings.callbacks.onTileBgImgRenderComplete.push(() => {
      handleAllTileImageRendered();
      setTimeout(handleAllTileImageRendered, 1e3);
    });
    settings.callbacks.onTileBgImageError.push((event2) => {
      const customEvent = event2;
      const tileWithError = customEvent.detail.data.target;
      handleTileImageError(tileWithError);
    });
    const grid = sdk.querySelector(".grid");
    const observer = new ResizeObserver(() => {
      renderMasonryLayout(false, true);
    });
    observer.observe(grid);
    return settings;
  }
  function mergeSettingsWithDefaults(settings) {
    return {
      features: {
        showTitle: true,
        preloadImages: true,
        disableWidgetIfNotEnabled: true,
        addNewTilesAutomatically: true,
        handleLoadMore: true,
        limitTilesPerPage: true,
        hideBrokenImages: true,
        loadExpandedTileSlider: true,
        loadTileContent: true,
        loadTimephrase: true,
        expandedTileSettings: {
          useDefaultExpandedTileStyles: true,
          useDefaultProductStyles: true,
          useDefaultAddToCartStyles: true,
          useDefaultExpandedTileTemplates: true,
          useDefaultSwiperStyles: true,
          defaultFont: settings?.font ?? "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
        },
        ...settings?.features
      },
      callbacks: {
        ...callbackDefaults,
        ...settings?.callbacks
      },
      extensions: {
        swiper: false,
        masonry: false,
        ...settings?.extensions
      },
      templates: settings?.templates ?? {}
    };
  }
  async function loadFeatures(settings) {
    const {
      showTitle,
      preloadImages,
      disableWidgetIfNotEnabled,
      addNewTilesAutomatically,
      handleLoadMore,
      limitTilesPerPage,
      hideBrokenImages,
      loadTileContent,
      loadTimephrase
    } = settings.features;
    sdk.tiles.preloadImages = preloadImages;
    sdk.tiles.hideBrokenTiles = hideBrokenImages;
    if (loadTileContent) {
      sdk.addLoadedComponents(["tile-content", "timephrase", "tags", "share-menu"]);
    } else if (loadTimephrase) {
      sdk.addLoadedComponents(["timephrase"]);
    }
    if (disableWidgetIfNotEnabled) {
      loadWidgetIsEnabled();
    }
    if (showTitle) {
      loadTitle();
    }
    loadExpandedTileFeature();
    if (addNewTilesAutomatically) {
      addAutoAddTileFeature();
    }
    if (handleLoadMore) {
      await Promise.resolve().then(() => (init_load_more(), load_more_exports));
      addLoadMoreButtonFeature();
    }
    if (limitTilesPerPage) {
      addTilesPerPageFeature();
    }
    return settings;
  }
  function loadExtensions(settings) {
    const { extensions } = settings;
    if (extensions?.masonry) {
      settings = loadMasonryCallbacks(settings);
      renderMasonryLayout();
    }
    return settings;
  }
  function loadTemplates(settings) {
    const { expandedTileSettings } = settings.features;
    const {
      useDefaultExpandedTileStyles,
      useDefaultProductStyles,
      useDefaultAddToCartStyles,
      useDefaultExpandedTileTemplates,
      defaultFont,
      useDefaultSwiperStyles
    } = expandedTileSettings;
    if (settings.features.loadExpandedTileSlider) {
      loadExpandedTileTemplates({
        useDefaultExpandedTileStyles,
        useDefaultProductStyles,
        useDefaultAddToCartStyles,
        useDefaultExpandedTileTemplates,
        defaultFont,
        useDefaultSwiperStyles
      });
    }
    if (settings.templates && Object.keys(settings.templates).length) {
      Object.entries(settings.templates).forEach(([key, customTemplate]) => {
        if (!customTemplate) {
          return;
        }
        const { template } = customTemplate;
        if (template) {
          sdk.addTemplateToComponent(template, key);
        }
      });
    }
  }
  function loadWidget(settings) {
    const settingsWithDefaults = mergeSettingsWithDefaults(settings);
    addCSSVariablesToPlacement(getCSSVariables(settings?.features));
    loadTemplates(settingsWithDefaults);
    loadFeatures(settingsWithDefaults);
    loadExtensions(settingsWithDefaults);
    loadListeners(settingsWithDefaults);
  }
  var init_widget_loader = __esm({
    "src/widget-loader.ts"() {
      "use strict";
      init_libs();
      init_css_variables();
      init_masonry_extension();
      init_expanded_tile_swiper();
      init_events();
    }
  });
  var init_src = __esm({
    "src/index.ts"() {
      init_hooks();
      init_types2();
      init_events();
      init_libs();
      init_widget_loader();
    }
  });
  init_src();

  // packages/widget-utils/dist/esm/libs/extensions/index.js
  function enableTileContent(slide22) {
    slide22.querySelector(".tile-loading")?.classList.add("hidden");
    slide22.querySelector(".icon-section.hidden")?.classList.remove("hidden");
  }
  function enableTileImage(slide22) {
    const tileImage = slide22.querySelector(".tile-image-wrapper > img");
    if (tileImage) {
      if (tileImage.complete) {
        enableTileContent(slide22);
      }
      tileImage.onload = () => enableTileContent(slide22);
    }
  }
  function enableTileImages(wrapper) {
    const elements = wrapper.querySelectorAll(".ugc-tile:has(.icon-section.hidden)");
    elements.forEach((element) => enableTileImage(element));
  }
  function isObject3(obj) {
    return obj !== null && typeof obj === "object" && "constructor" in obj && obj.constructor === Object;
  }
  function extend3(target, src) {
    if (target === void 0) {
      target = {};
    }
    if (src === void 0) {
      src = {};
    }
    Object.keys(src).forEach((key) => {
      if (typeof target[key] === "undefined")
        target[key] = src[key];
      else if (isObject3(src[key]) && isObject3(target[key]) && Object.keys(src[key]).length > 0) {
        extend3(target[key], src[key]);
      }
    });
  }
  var ssrDocument2 = {
    body: {},
    addEventListener() {
    },
    removeEventListener() {
    },
    activeElement: {
      blur() {
      },
      nodeName: ""
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    getElementById() {
      return null;
    },
    createEvent() {
      return {
        initEvent() {
        }
      };
    },
    createElement() {
      return {
        children: [],
        childNodes: [],
        style: {},
        setAttribute() {
        },
        getElementsByTagName() {
          return [];
        }
      };
    },
    createElementNS() {
      return {};
    },
    importNode() {
      return null;
    },
    location: {
      hash: "",
      host: "",
      hostname: "",
      href: "",
      origin: "",
      pathname: "",
      protocol: "",
      search: ""
    }
  };
  function getDocument2() {
    const doc = typeof document !== "undefined" ? document : {};
    extend3(doc, ssrDocument2);
    return doc;
  }
  var ssrWindow2 = {
    document: ssrDocument2,
    navigator: {
      userAgent: ""
    },
    location: {
      hash: "",
      host: "",
      hostname: "",
      href: "",
      origin: "",
      pathname: "",
      protocol: "",
      search: ""
    },
    history: {
      replaceState() {
      },
      pushState() {
      },
      go() {
      },
      back() {
      }
    },
    CustomEvent: function CustomEvent() {
      return this;
    },
    addEventListener() {
    },
    removeEventListener() {
    },
    getComputedStyle() {
      return {
        getPropertyValue() {
          return "";
        }
      };
    },
    Image() {
    },
    Date() {
    },
    screen: {},
    setTimeout() {
    },
    clearTimeout() {
    },
    matchMedia() {
      return {};
    },
    requestAnimationFrame(callback) {
      if (typeof setTimeout === "undefined") {
        callback();
        return null;
      }
      return setTimeout(callback, 0);
    },
    cancelAnimationFrame(id) {
      if (typeof setTimeout === "undefined") {
        return;
      }
      clearTimeout(id);
    }
  };
  function getWindow2() {
    const win = typeof window !== "undefined" ? window : {};
    extend3(win, ssrWindow2);
    return win;
  }
  function classesToTokens2(classes22) {
    if (classes22 === void 0) {
      classes22 = "";
    }
    return classes22.trim().split(" ").filter((c) => !!c.trim());
  }
  function deleteProps2(obj) {
    const object = obj;
    Object.keys(object).forEach((key) => {
      try {
        object[key] = null;
      } catch (e) {
      }
      try {
        delete object[key];
      } catch (e) {
      }
    });
  }
  function nextTick2(callback, delay) {
    if (delay === void 0) {
      delay = 0;
    }
    return setTimeout(callback, delay);
  }
  function now2() {
    return Date.now();
  }
  function getComputedStyle22(el) {
    const window2 = getWindow2();
    let style;
    if (window2.getComputedStyle) {
      style = window2.getComputedStyle(el, null);
    }
    if (!style && el.currentStyle) {
      style = el.currentStyle;
    }
    if (!style) {
      style = el.style;
    }
    return style;
  }
  function getTranslate2(el, axis) {
    if (axis === void 0) {
      axis = "x";
    }
    const window2 = getWindow2();
    let matrix;
    let curTransform;
    let transformMatrix;
    const curStyle = getComputedStyle22(el);
    if (window2.WebKitCSSMatrix) {
      curTransform = curStyle.transform || curStyle.webkitTransform;
      if (curTransform.split(",").length > 6) {
        curTransform = curTransform.split(", ").map((a) => a.replace(",", ".")).join(", ");
      }
      transformMatrix = new window2.WebKitCSSMatrix(curTransform === "none" ? "" : curTransform);
    } else {
      transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
      matrix = transformMatrix.toString().split(",");
    }
    if (axis === "x") {
      if (window2.WebKitCSSMatrix)
        curTransform = transformMatrix.m41;
      else if (matrix.length === 16)
        curTransform = parseFloat(matrix[12]);
      else
        curTransform = parseFloat(matrix[4]);
    }
    if (axis === "y") {
      if (window2.WebKitCSSMatrix)
        curTransform = transformMatrix.m42;
      else if (matrix.length === 16)
        curTransform = parseFloat(matrix[13]);
      else
        curTransform = parseFloat(matrix[5]);
    }
    return curTransform || 0;
  }
  function isObject22(o) {
    return typeof o === "object" && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === "Object";
  }
  function isNode2(node) {
    if (typeof window !== "undefined" && typeof window.HTMLElement !== "undefined") {
      return node instanceof HTMLElement;
    }
    return node && (node.nodeType === 1 || node.nodeType === 11);
  }
  function extend22() {
    const to = Object(arguments.length <= 0 ? void 0 : arguments[0]);
    const noExtend = ["__proto__", "constructor", "prototype"];
    for (let i = 1; i < arguments.length; i += 1) {
      const nextSource = i < 0 || arguments.length <= i ? void 0 : arguments[i];
      if (nextSource !== void 0 && nextSource !== null && !isNode2(nextSource)) {
        const keysArray = Object.keys(Object(nextSource)).filter((key) => noExtend.indexOf(key) < 0);
        for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
          const nextKey = keysArray[nextIndex];
          const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== void 0 && desc.enumerable) {
            if (isObject22(to[nextKey]) && isObject22(nextSource[nextKey])) {
              if (nextSource[nextKey].__swiper__) {
                to[nextKey] = nextSource[nextKey];
              } else {
                extend22(to[nextKey], nextSource[nextKey]);
              }
            } else if (!isObject22(to[nextKey]) && isObject22(nextSource[nextKey])) {
              to[nextKey] = {};
              if (nextSource[nextKey].__swiper__) {
                to[nextKey] = nextSource[nextKey];
              } else {
                extend22(to[nextKey], nextSource[nextKey]);
              }
            } else {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
    }
    return to;
  }
  function setCSSProperty2(el, varName, varValue) {
    el.style.setProperty(varName, varValue);
  }
  function animateCSSModeScroll2(_ref) {
    let {
      swiper,
      targetPosition,
      side
    } = _ref;
    const window2 = getWindow2();
    const startPosition = -swiper.translate;
    let startTime = null;
    let time;
    const duration = swiper.params.speed;
    swiper.wrapperEl.style.scrollSnapType = "none";
    window2.cancelAnimationFrame(swiper.cssModeFrameID);
    const dir = targetPosition > startPosition ? "next" : "prev";
    const isOutOfBound = (current, target) => {
      return dir === "next" && current >= target || dir === "prev" && current <= target;
    };
    const animate = () => {
      time = (/* @__PURE__ */ new Date()).getTime();
      if (startTime === null) {
        startTime = time;
      }
      const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
      const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
      let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
      if (isOutOfBound(currentPosition, targetPosition)) {
        currentPosition = targetPosition;
      }
      swiper.wrapperEl.scrollTo({
        [side]: currentPosition
      });
      if (isOutOfBound(currentPosition, targetPosition)) {
        swiper.wrapperEl.style.overflow = "hidden";
        swiper.wrapperEl.style.scrollSnapType = "";
        setTimeout(() => {
          swiper.wrapperEl.style.overflow = "";
          swiper.wrapperEl.scrollTo({
            [side]: currentPosition
          });
        });
        window2.cancelAnimationFrame(swiper.cssModeFrameID);
        return;
      }
      swiper.cssModeFrameID = window2.requestAnimationFrame(animate);
    };
    animate();
  }
  function elementChildren2(element, selector) {
    if (selector === void 0) {
      selector = "";
    }
    const children = [...element.children];
    if (element instanceof HTMLSlotElement) {
      children.push(...element.assignedElements());
    }
    if (!selector) {
      return children;
    }
    return children.filter((el) => el.matches(selector));
  }
  function elementIsChildOf2(el, parent) {
    const isChild = parent.contains(el);
    if (!isChild && parent instanceof HTMLSlotElement) {
      const children = [...parent.assignedElements()];
      return children.includes(el);
    }
    return isChild;
  }
  function showWarning2(text) {
    try {
      console.warn(text);
      return;
    } catch (err) {
    }
  }
  function createElement3(tag, classes22) {
    if (classes22 === void 0) {
      classes22 = [];
    }
    const el = document.createElement(tag);
    el.classList.add(...Array.isArray(classes22) ? classes22 : classesToTokens2(classes22));
    return el;
  }
  function elementOffset2(el) {
    const window2 = getWindow2();
    const document2 = getDocument2();
    const box = el.getBoundingClientRect();
    const body = document2.body;
    const clientTop = el.clientTop || body.clientTop || 0;
    const clientLeft = el.clientLeft || body.clientLeft || 0;
    const scrollTop = el === window2 ? window2.scrollY : el.scrollTop;
    const scrollLeft = el === window2 ? window2.scrollX : el.scrollLeft;
    return {
      top: box.top + scrollTop - clientTop,
      left: box.left + scrollLeft - clientLeft
    };
  }
  function elementPrevAll2(el, selector) {
    const prevEls = [];
    while (el.previousElementSibling) {
      const prev = el.previousElementSibling;
      if (selector) {
        if (prev.matches(selector))
          prevEls.push(prev);
      } else
        prevEls.push(prev);
      el = prev;
    }
    return prevEls;
  }
  function elementNextAll2(el, selector) {
    const nextEls = [];
    while (el.nextElementSibling) {
      const next = el.nextElementSibling;
      if (selector) {
        if (next.matches(selector))
          nextEls.push(next);
      } else
        nextEls.push(next);
      el = next;
    }
    return nextEls;
  }
  function elementStyle2(el, prop) {
    const window2 = getWindow2();
    return window2.getComputedStyle(el, null).getPropertyValue(prop);
  }
  function elementIndex2(el) {
    let child = el;
    let i;
    if (child) {
      i = 0;
      while ((child = child.previousSibling) !== null) {
        if (child.nodeType === 1)
          i += 1;
      }
      return i;
    }
    return void 0;
  }
  function elementParents2(el, selector) {
    const parents = [];
    let parent = el.parentElement;
    while (parent) {
      if (selector) {
        if (parent.matches(selector))
          parents.push(parent);
      } else {
        parents.push(parent);
      }
      parent = parent.parentElement;
    }
    return parents;
  }
  function elementOuterSize2(el, size, includeMargins) {
    const window2 = getWindow2();
    if (includeMargins) {
      return el[size === "width" ? "offsetWidth" : "offsetHeight"] + parseFloat(window2.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-right" : "margin-top")) + parseFloat(window2.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-left" : "margin-bottom"));
    }
    return el.offsetWidth;
  }
  function makeElementsArray2(el) {
    return (Array.isArray(el) ? el : [el]).filter((e) => !!e);
  }
  var support2;
  function calcSupport2() {
    const window2 = getWindow2();
    const document2 = getDocument2();
    return {
      smoothScroll: document2.documentElement && document2.documentElement.style && "scrollBehavior" in document2.documentElement.style,
      touch: !!("ontouchstart" in window2 || window2.DocumentTouch && document2 instanceof window2.DocumentTouch)
    };
  }
  function getSupport2() {
    if (!support2) {
      support2 = calcSupport2();
    }
    return support2;
  }
  var deviceCached2;
  function calcDevice2(_temp) {
    let {
      userAgent
    } = _temp === void 0 ? {} : _temp;
    const support22 = getSupport2();
    const window2 = getWindow2();
    const platform = window2.navigator.platform;
    const ua = userAgent || window2.navigator.userAgent;
    const device = {
      ios: false,
      android: false
    };
    const screenWidth2 = window2.screen.width;
    const screenHeight = window2.screen.height;
    const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
    const windows = platform === "Win32";
    let macos = platform === "MacIntel";
    const iPadScreens = ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"];
    if (!ipad && macos && support22.touch && iPadScreens.indexOf(`${screenWidth2}x${screenHeight}`) >= 0) {
      ipad = ua.match(/(Version)\/([\d.]+)/);
      if (!ipad)
        ipad = [0, 1, "13_0_0"];
      macos = false;
    }
    if (android && !windows) {
      device.os = "android";
      device.android = true;
    }
    if (ipad || iphone || ipod) {
      device.os = "ios";
      device.ios = true;
    }
    return device;
  }
  function getDevice2(overrides) {
    if (overrides === void 0) {
      overrides = {};
    }
    if (!deviceCached2) {
      deviceCached2 = calcDevice2(overrides);
    }
    return deviceCached2;
  }
  var browser2;
  function calcBrowser2() {
    const window2 = getWindow2();
    const device = getDevice2();
    let needPerspectiveFix = false;
    function isSafari() {
      const ua = window2.navigator.userAgent.toLowerCase();
      return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
    }
    if (isSafari()) {
      const ua = String(window2.navigator.userAgent);
      if (ua.includes("Version/")) {
        const [major, minor] = ua.split("Version/")[1].split(" ")[0].split(".").map((num) => Number(num));
        needPerspectiveFix = major < 16 || major === 16 && minor < 2;
      }
    }
    const isWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window2.navigator.userAgent);
    const isSafariBrowser = isSafari();
    const need3dFix = isSafariBrowser || isWebView && device.ios;
    return {
      isSafari: needPerspectiveFix || isSafariBrowser,
      needPerspectiveFix,
      need3dFix,
      isWebView
    };
  }
  function getBrowser2() {
    if (!browser2) {
      browser2 = calcBrowser2();
    }
    return browser2;
  }
  function Resize2(_ref) {
    let {
      swiper,
      on,
      emit
    } = _ref;
    const window2 = getWindow2();
    let observer = null;
    let animationFrame = null;
    const resizeHandler = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized)
        return;
      emit("beforeResize");
      emit("resize");
    };
    const createObserver = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized)
        return;
      observer = new ResizeObserver((entries) => {
        animationFrame = window2.requestAnimationFrame(() => {
          const {
            width,
            height
          } = swiper;
          let newWidth = width;
          let newHeight = height;
          entries.forEach((_ref2) => {
            let {
              contentBoxSize,
              contentRect,
              target
            } = _ref2;
            if (target && target !== swiper.el)
              return;
            newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
            newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
          });
          if (newWidth !== width || newHeight !== height) {
            resizeHandler();
          }
        });
      });
      observer.observe(swiper.el);
    };
    const removeObserver = () => {
      if (animationFrame) {
        window2.cancelAnimationFrame(animationFrame);
      }
      if (observer && observer.unobserve && swiper.el) {
        observer.unobserve(swiper.el);
        observer = null;
      }
    };
    const orientationChangeHandler = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized)
        return;
      emit("orientationchange");
    };
    on("init", () => {
      if (swiper.params.resizeObserver && typeof window2.ResizeObserver !== "undefined") {
        createObserver();
        return;
      }
      window2.addEventListener("resize", resizeHandler);
      window2.addEventListener("orientationchange", orientationChangeHandler);
    });
    on("destroy", () => {
      removeObserver();
      window2.removeEventListener("resize", resizeHandler);
      window2.removeEventListener("orientationchange", orientationChangeHandler);
    });
  }
  function Observer2(_ref) {
    let {
      swiper,
      extendParams,
      on,
      emit
    } = _ref;
    const observers = [];
    const window2 = getWindow2();
    const attach = function(target, options) {
      if (options === void 0) {
        options = {};
      }
      const ObserverFunc = window2.MutationObserver || window2.WebkitMutationObserver;
      const observer = new ObserverFunc((mutations) => {
        if (swiper.__preventObserver__)
          return;
        if (mutations.length === 1) {
          emit("observerUpdate", mutations[0]);
          return;
        }
        const observerUpdate = function observerUpdate2() {
          emit("observerUpdate", mutations[0]);
        };
        if (window2.requestAnimationFrame) {
          window2.requestAnimationFrame(observerUpdate);
        } else {
          window2.setTimeout(observerUpdate, 0);
        }
      });
      observer.observe(target, {
        attributes: typeof options.attributes === "undefined" ? true : options.attributes,
        childList: swiper.isElement || (typeof options.childList === "undefined" ? true : options).childList,
        characterData: typeof options.characterData === "undefined" ? true : options.characterData
      });
      observers.push(observer);
    };
    const init = () => {
      if (!swiper.params.observer)
        return;
      if (swiper.params.observeParents) {
        const containerParents = elementParents2(swiper.hostEl);
        for (let i = 0; i < containerParents.length; i += 1) {
          attach(containerParents[i]);
        }
      }
      attach(swiper.hostEl, {
        childList: swiper.params.observeSlideChildren
      });
      attach(swiper.wrapperEl, {
        attributes: false
      });
    };
    const destroy = () => {
      observers.forEach((observer) => {
        observer.disconnect();
      });
      observers.splice(0, observers.length);
    };
    extendParams({
      observer: false,
      observeParents: false,
      observeSlideChildren: false
    });
    on("init", init);
    on("destroy", destroy);
  }
  var eventsEmitter2 = {
    on(events22, handler, priority) {
      const self = this;
      if (!self.eventsListeners || self.destroyed)
        return self;
      if (typeof handler !== "function")
        return self;
      const method = priority ? "unshift" : "push";
      events22.split(" ").forEach((event2) => {
        if (!self.eventsListeners[event2])
          self.eventsListeners[event2] = [];
        self.eventsListeners[event2][method](handler);
      });
      return self;
    },
    once(events22, handler, priority) {
      const self = this;
      if (!self.eventsListeners || self.destroyed)
        return self;
      if (typeof handler !== "function")
        return self;
      function onceHandler() {
        self.off(events22, onceHandler);
        if (onceHandler.__emitterProxy) {
          delete onceHandler.__emitterProxy;
        }
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        handler.apply(self, args);
      }
      onceHandler.__emitterProxy = handler;
      return self.on(events22, onceHandler, priority);
    },
    onAny(handler, priority) {
      const self = this;
      if (!self.eventsListeners || self.destroyed)
        return self;
      if (typeof handler !== "function")
        return self;
      const method = priority ? "unshift" : "push";
      if (self.eventsAnyListeners.indexOf(handler) < 0) {
        self.eventsAnyListeners[method](handler);
      }
      return self;
    },
    offAny(handler) {
      const self = this;
      if (!self.eventsListeners || self.destroyed)
        return self;
      if (!self.eventsAnyListeners)
        return self;
      const index = self.eventsAnyListeners.indexOf(handler);
      if (index >= 0) {
        self.eventsAnyListeners.splice(index, 1);
      }
      return self;
    },
    off(events22, handler) {
      const self = this;
      if (!self.eventsListeners || self.destroyed)
        return self;
      if (!self.eventsListeners)
        return self;
      events22.split(" ").forEach((event2) => {
        if (typeof handler === "undefined") {
          self.eventsListeners[event2] = [];
        } else if (self.eventsListeners[event2]) {
          self.eventsListeners[event2].forEach((eventHandler, index) => {
            if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
              self.eventsListeners[event2].splice(index, 1);
            }
          });
        }
      });
      return self;
    },
    emit() {
      const self = this;
      if (!self.eventsListeners || self.destroyed)
        return self;
      if (!self.eventsListeners)
        return self;
      let events22;
      let data;
      let context;
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      if (typeof args[0] === "string" || Array.isArray(args[0])) {
        events22 = args[0];
        data = args.slice(1, args.length);
        context = self;
      } else {
        events22 = args[0].events;
        data = args[0].data;
        context = args[0].context || self;
      }
      data.unshift(context);
      const eventsArray = Array.isArray(events22) ? events22 : events22.split(" ");
      eventsArray.forEach((event2) => {
        if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
          self.eventsAnyListeners.forEach((eventHandler) => {
            eventHandler.apply(context, [event2, ...data]);
          });
        }
        if (self.eventsListeners && self.eventsListeners[event2]) {
          self.eventsListeners[event2].forEach((eventHandler) => {
            eventHandler.apply(context, data);
          });
        }
      });
      return self;
    }
  };
  function updateSize2() {
    const swiper = this;
    let width;
    let height;
    const el = swiper.el;
    if (typeof swiper.params.width !== "undefined" && swiper.params.width !== null) {
      width = swiper.params.width;
    } else {
      width = el.clientWidth;
    }
    if (typeof swiper.params.height !== "undefined" && swiper.params.height !== null) {
      height = swiper.params.height;
    } else {
      height = el.clientHeight;
    }
    if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
      return;
    }
    width = width - parseInt(elementStyle2(el, "padding-left") || 0, 10) - parseInt(elementStyle2(el, "padding-right") || 0, 10);
    height = height - parseInt(elementStyle2(el, "padding-top") || 0, 10) - parseInt(elementStyle2(el, "padding-bottom") || 0, 10);
    if (Number.isNaN(width))
      width = 0;
    if (Number.isNaN(height))
      height = 0;
    Object.assign(swiper, {
      width,
      height,
      size: swiper.isHorizontal() ? width : height
    });
  }
  function updateSlides2() {
    const swiper = this;
    function getDirectionPropertyValue(node, label) {
      return parseFloat(node.getPropertyValue(swiper.getDirectionLabel(label)) || 0);
    }
    const params = swiper.params;
    const {
      wrapperEl,
      slidesEl,
      size: swiperSize,
      rtlTranslate: rtl,
      wrongRTL
    } = swiper;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
    const slides = elementChildren2(slidesEl, `.${swiper.params.slideClass}, swiper-slide`);
    const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
    let snapGrid = [];
    const slidesGrid = [];
    const slidesSizesGrid = [];
    let offsetBefore = params.slidesOffsetBefore;
    if (typeof offsetBefore === "function") {
      offsetBefore = params.slidesOffsetBefore.call(swiper);
    }
    let offsetAfter = params.slidesOffsetAfter;
    if (typeof offsetAfter === "function") {
      offsetAfter = params.slidesOffsetAfter.call(swiper);
    }
    const previousSnapGridLength = swiper.snapGrid.length;
    const previousSlidesGridLength = swiper.slidesGrid.length;
    let spaceBetween = params.spaceBetween;
    let slidePosition = -offsetBefore;
    let prevSlideSize = 0;
    let index = 0;
    if (typeof swiperSize === "undefined") {
      return;
    }
    if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
      spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
    } else if (typeof spaceBetween === "string") {
      spaceBetween = parseFloat(spaceBetween);
    }
    swiper.virtualSize = -spaceBetween;
    slides.forEach((slideEl) => {
      if (rtl) {
        slideEl.style.marginLeft = "";
      } else {
        slideEl.style.marginRight = "";
      }
      slideEl.style.marginBottom = "";
      slideEl.style.marginTop = "";
    });
    if (params.centeredSlides && params.cssMode) {
      setCSSProperty2(wrapperEl, "--swiper-centered-offset-before", "");
      setCSSProperty2(wrapperEl, "--swiper-centered-offset-after", "");
    }
    const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
    if (gridEnabled) {
      swiper.grid.initSlides(slides);
    } else if (swiper.grid) {
      swiper.grid.unsetSlides();
    }
    let slideSize;
    const shouldResetSlideSize = params.slidesPerView === "auto" && params.breakpoints && Object.keys(params.breakpoints).filter((key) => {
      return typeof params.breakpoints[key].slidesPerView !== "undefined";
    }).length > 0;
    for (let i = 0; i < slidesLength; i += 1) {
      slideSize = 0;
      let slide22;
      if (slides[i])
        slide22 = slides[i];
      if (gridEnabled) {
        swiper.grid.updateSlide(i, slide22, slides);
      }
      if (slides[i] && elementStyle2(slide22, "display") === "none")
        continue;
      if (params.slidesPerView === "auto") {
        if (shouldResetSlideSize) {
          slides[i].style[swiper.getDirectionLabel("width")] = ``;
        }
        const slideStyles = getComputedStyle(slide22);
        const currentTransform = slide22.style.transform;
        const currentWebKitTransform = slide22.style.webkitTransform;
        if (currentTransform) {
          slide22.style.transform = "none";
        }
        if (currentWebKitTransform) {
          slide22.style.webkitTransform = "none";
        }
        if (params.roundLengths) {
          slideSize = swiper.isHorizontal() ? elementOuterSize2(slide22, "width", true) : elementOuterSize2(slide22, "height", true);
        } else {
          const width = getDirectionPropertyValue(slideStyles, "width");
          const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
          const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
          const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
          const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
          const boxSizing = slideStyles.getPropertyValue("box-sizing");
          if (boxSizing && boxSizing === "border-box") {
            slideSize = width + marginLeft + marginRight;
          } else {
            const {
              clientWidth,
              offsetWidth
            } = slide22;
            slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
          }
        }
        if (currentTransform) {
          slide22.style.transform = currentTransform;
        }
        if (currentWebKitTransform) {
          slide22.style.webkitTransform = currentWebKitTransform;
        }
        if (params.roundLengths)
          slideSize = Math.floor(slideSize);
      } else {
        slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
        if (params.roundLengths)
          slideSize = Math.floor(slideSize);
        if (slides[i]) {
          slides[i].style[swiper.getDirectionLabel("width")] = `${slideSize}px`;
        }
      }
      if (slides[i]) {
        slides[i].swiperSlideSize = slideSize;
      }
      slidesSizesGrid.push(slideSize);
      if (params.centeredSlides) {
        slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
        if (prevSlideSize === 0 && i !== 0)
          slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
        if (i === 0)
          slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
        if (Math.abs(slidePosition) < 1 / 1e3)
          slidePosition = 0;
        if (params.roundLengths)
          slidePosition = Math.floor(slidePosition);
        if (index % params.slidesPerGroup === 0)
          snapGrid.push(slidePosition);
        slidesGrid.push(slidePosition);
      } else {
        if (params.roundLengths)
          slidePosition = Math.floor(slidePosition);
        if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0)
          snapGrid.push(slidePosition);
        slidesGrid.push(slidePosition);
        slidePosition = slidePosition + slideSize + spaceBetween;
      }
      swiper.virtualSize += slideSize + spaceBetween;
      prevSlideSize = slideSize;
      index += 1;
    }
    swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
    if (rtl && wrongRTL && (params.effect === "slide" || params.effect === "coverflow")) {
      wrapperEl.style.width = `${swiper.virtualSize + spaceBetween}px`;
    }
    if (params.setWrapperSize) {
      wrapperEl.style[swiper.getDirectionLabel("width")] = `${swiper.virtualSize + spaceBetween}px`;
    }
    if (gridEnabled) {
      swiper.grid.updateWrapperSize(slideSize, snapGrid);
    }
    if (!params.centeredSlides) {
      const newSlidesGrid = [];
      for (let i = 0; i < snapGrid.length; i += 1) {
        let slidesGridItem = snapGrid[i];
        if (params.roundLengths)
          slidesGridItem = Math.floor(slidesGridItem);
        if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
          newSlidesGrid.push(slidesGridItem);
        }
      }
      snapGrid = newSlidesGrid;
      if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
        snapGrid.push(swiper.virtualSize - swiperSize);
      }
    }
    if (isVirtual && params.loop) {
      const size = slidesSizesGrid[0] + spaceBetween;
      if (params.slidesPerGroup > 1) {
        const groups = Math.ceil((swiper.virtual.slidesBefore + swiper.virtual.slidesAfter) / params.slidesPerGroup);
        const groupSize = size * params.slidesPerGroup;
        for (let i = 0; i < groups; i += 1) {
          snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
        }
      }
      for (let i = 0; i < swiper.virtual.slidesBefore + swiper.virtual.slidesAfter; i += 1) {
        if (params.slidesPerGroup === 1) {
          snapGrid.push(snapGrid[snapGrid.length - 1] + size);
        }
        slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size);
        swiper.virtualSize += size;
      }
    }
    if (snapGrid.length === 0)
      snapGrid = [0];
    if (spaceBetween !== 0) {
      const key = swiper.isHorizontal() && rtl ? "marginLeft" : swiper.getDirectionLabel("marginRight");
      slides.filter((_, slideIndex) => {
        if (!params.cssMode || params.loop)
          return true;
        if (slideIndex === slides.length - 1) {
          return false;
        }
        return true;
      }).forEach((slideEl) => {
        slideEl.style[key] = `${spaceBetween}px`;
      });
    }
    if (params.centeredSlides && params.centeredSlidesBounds) {
      let allSlidesSize = 0;
      slidesSizesGrid.forEach((slideSizeValue) => {
        allSlidesSize += slideSizeValue + (spaceBetween || 0);
      });
      allSlidesSize -= spaceBetween;
      const maxSnap = allSlidesSize > swiperSize ? allSlidesSize - swiperSize : 0;
      snapGrid = snapGrid.map((snap) => {
        if (snap <= 0)
          return -offsetBefore;
        if (snap > maxSnap)
          return maxSnap + offsetAfter;
        return snap;
      });
    }
    if (params.centerInsufficientSlides) {
      let allSlidesSize = 0;
      slidesSizesGrid.forEach((slideSizeValue) => {
        allSlidesSize += slideSizeValue + (spaceBetween || 0);
      });
      allSlidesSize -= spaceBetween;
      const offsetSize = (params.slidesOffsetBefore || 0) + (params.slidesOffsetAfter || 0);
      if (allSlidesSize + offsetSize < swiperSize) {
        const allSlidesOffset = (swiperSize - allSlidesSize - offsetSize) / 2;
        snapGrid.forEach((snap, snapIndex) => {
          snapGrid[snapIndex] = snap - allSlidesOffset;
        });
        slidesGrid.forEach((snap, snapIndex) => {
          slidesGrid[snapIndex] = snap + allSlidesOffset;
        });
      }
    }
    Object.assign(swiper, {
      slides,
      snapGrid,
      slidesGrid,
      slidesSizesGrid
    });
    if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
      setCSSProperty2(wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
      setCSSProperty2(wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
      const addToSnapGrid = -swiper.snapGrid[0];
      const addToSlidesGrid = -swiper.slidesGrid[0];
      swiper.snapGrid = swiper.snapGrid.map((v) => v + addToSnapGrid);
      swiper.slidesGrid = swiper.slidesGrid.map((v) => v + addToSlidesGrid);
    }
    if (slidesLength !== previousSlidesLength) {
      swiper.emit("slidesLengthChange");
    }
    if (snapGrid.length !== previousSnapGridLength) {
      if (swiper.params.watchOverflow)
        swiper.checkOverflow();
      swiper.emit("snapGridLengthChange");
    }
    if (slidesGrid.length !== previousSlidesGridLength) {
      swiper.emit("slidesGridLengthChange");
    }
    if (params.watchSlidesProgress) {
      swiper.updateSlidesOffset();
    }
    swiper.emit("slidesUpdated");
    if (!isVirtual && !params.cssMode && (params.effect === "slide" || params.effect === "fade")) {
      const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
      const hasClassBackfaceClassAdded = swiper.el.classList.contains(backFaceHiddenClass);
      if (slidesLength <= params.maxBackfaceHiddenSlides) {
        if (!hasClassBackfaceClassAdded)
          swiper.el.classList.add(backFaceHiddenClass);
      } else if (hasClassBackfaceClassAdded) {
        swiper.el.classList.remove(backFaceHiddenClass);
      }
    }
  }
  function updateAutoHeight2(speed) {
    const swiper = this;
    const activeSlides = [];
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    let newHeight = 0;
    let i;
    if (typeof speed === "number") {
      swiper.setTransition(speed);
    } else if (speed === true) {
      swiper.setTransition(swiper.params.speed);
    }
    const getSlideByIndex = (index) => {
      if (isVirtual) {
        return swiper.slides[swiper.getSlideIndexByData(index)];
      }
      return swiper.slides[index];
    };
    if (swiper.params.slidesPerView !== "auto" && swiper.params.slidesPerView > 1) {
      if (swiper.params.centeredSlides) {
        (swiper.visibleSlides || []).forEach((slide22) => {
          activeSlides.push(slide22);
        });
      } else {
        for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
          const index = swiper.activeIndex + i;
          if (index > swiper.slides.length && !isVirtual)
            break;
          activeSlides.push(getSlideByIndex(index));
        }
      }
    } else {
      activeSlides.push(getSlideByIndex(swiper.activeIndex));
    }
    for (i = 0; i < activeSlides.length; i += 1) {
      if (typeof activeSlides[i] !== "undefined") {
        const height = activeSlides[i].offsetHeight;
        newHeight = height > newHeight ? height : newHeight;
      }
    }
    if (newHeight || newHeight === 0)
      swiper.wrapperEl.style.height = `${newHeight}px`;
  }
  function updateSlidesOffset2() {
    const swiper = this;
    const slides = swiper.slides;
    const minusOffset = swiper.isElement ? swiper.isHorizontal() ? swiper.wrapperEl.offsetLeft : swiper.wrapperEl.offsetTop : 0;
    for (let i = 0; i < slides.length; i += 1) {
      slides[i].swiperSlideOffset = (swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop) - minusOffset - swiper.cssOverflowAdjustment();
    }
  }
  var toggleSlideClasses$12 = (slideEl, condition, className) => {
    if (condition && !slideEl.classList.contains(className)) {
      slideEl.classList.add(className);
    } else if (!condition && slideEl.classList.contains(className)) {
      slideEl.classList.remove(className);
    }
  };
  function updateSlidesProgress2(translate22) {
    if (translate22 === void 0) {
      translate22 = this && this.translate || 0;
    }
    const swiper = this;
    const params = swiper.params;
    const {
      slides,
      rtlTranslate: rtl,
      snapGrid
    } = swiper;
    if (slides.length === 0)
      return;
    if (typeof slides[0].swiperSlideOffset === "undefined")
      swiper.updateSlidesOffset();
    let offsetCenter = -translate22;
    if (rtl)
      offsetCenter = translate22;
    swiper.visibleSlidesIndexes = [];
    swiper.visibleSlides = [];
    let spaceBetween = params.spaceBetween;
    if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
      spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiper.size;
    } else if (typeof spaceBetween === "string") {
      spaceBetween = parseFloat(spaceBetween);
    }
    for (let i = 0; i < slides.length; i += 1) {
      const slide22 = slides[i];
      let slideOffset = slide22.swiperSlideOffset;
      if (params.cssMode && params.centeredSlides) {
        slideOffset -= slides[0].swiperSlideOffset;
      }
      const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide22.swiperSlideSize + spaceBetween);
      const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide22.swiperSlideSize + spaceBetween);
      const slideBefore = -(offsetCenter - slideOffset);
      const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
      const isFullyVisible = slideBefore >= 0 && slideBefore <= swiper.size - swiper.slidesSizesGrid[i];
      const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
      if (isVisible) {
        swiper.visibleSlides.push(slide22);
        swiper.visibleSlidesIndexes.push(i);
      }
      toggleSlideClasses$12(slide22, isVisible, params.slideVisibleClass);
      toggleSlideClasses$12(slide22, isFullyVisible, params.slideFullyVisibleClass);
      slide22.progress = rtl ? -slideProgress : slideProgress;
      slide22.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
    }
  }
  function updateProgress2(translate22) {
    const swiper = this;
    if (typeof translate22 === "undefined") {
      const multiplier = swiper.rtlTranslate ? -1 : 1;
      translate22 = swiper && swiper.translate && swiper.translate * multiplier || 0;
    }
    const params = swiper.params;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    let {
      progress,
      isBeginning,
      isEnd,
      progressLoop
    } = swiper;
    const wasBeginning = isBeginning;
    const wasEnd = isEnd;
    if (translatesDiff === 0) {
      progress = 0;
      isBeginning = true;
      isEnd = true;
    } else {
      progress = (translate22 - swiper.minTranslate()) / translatesDiff;
      const isBeginningRounded = Math.abs(translate22 - swiper.minTranslate()) < 1;
      const isEndRounded = Math.abs(translate22 - swiper.maxTranslate()) < 1;
      isBeginning = isBeginningRounded || progress <= 0;
      isEnd = isEndRounded || progress >= 1;
      if (isBeginningRounded)
        progress = 0;
      if (isEndRounded)
        progress = 1;
    }
    if (params.loop) {
      const firstSlideIndex = swiper.getSlideIndexByData(0);
      const lastSlideIndex = swiper.getSlideIndexByData(swiper.slides.length - 1);
      const firstSlideTranslate = swiper.slidesGrid[firstSlideIndex];
      const lastSlideTranslate = swiper.slidesGrid[lastSlideIndex];
      const translateMax = swiper.slidesGrid[swiper.slidesGrid.length - 1];
      const translateAbs = Math.abs(translate22);
      if (translateAbs >= firstSlideTranslate) {
        progressLoop = (translateAbs - firstSlideTranslate) / translateMax;
      } else {
        progressLoop = (translateAbs + translateMax - lastSlideTranslate) / translateMax;
      }
      if (progressLoop > 1)
        progressLoop -= 1;
    }
    Object.assign(swiper, {
      progress,
      progressLoop,
      isBeginning,
      isEnd
    });
    if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight)
      swiper.updateSlidesProgress(translate22);
    if (isBeginning && !wasBeginning) {
      swiper.emit("reachBeginning toEdge");
    }
    if (isEnd && !wasEnd) {
      swiper.emit("reachEnd toEdge");
    }
    if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
      swiper.emit("fromEdge");
    }
    swiper.emit("progress", progress);
  }
  var toggleSlideClasses2 = (slideEl, condition, className) => {
    if (condition && !slideEl.classList.contains(className)) {
      slideEl.classList.add(className);
    } else if (!condition && slideEl.classList.contains(className)) {
      slideEl.classList.remove(className);
    }
  };
  function updateSlidesClasses2() {
    const swiper = this;
    const {
      slides,
      params,
      slidesEl,
      activeIndex
    } = swiper;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
    const getFilteredSlide = (selector) => {
      return elementChildren2(slidesEl, `.${params.slideClass}${selector}, swiper-slide${selector}`)[0];
    };
    let activeSlide;
    let prevSlide;
    let nextSlide;
    if (isVirtual) {
      if (params.loop) {
        let slideIndex = activeIndex - swiper.virtual.slidesBefore;
        if (slideIndex < 0)
          slideIndex = swiper.virtual.slides.length + slideIndex;
        if (slideIndex >= swiper.virtual.slides.length)
          slideIndex -= swiper.virtual.slides.length;
        activeSlide = getFilteredSlide(`[data-swiper-slide-index="${slideIndex}"]`);
      } else {
        activeSlide = getFilteredSlide(`[data-swiper-slide-index="${activeIndex}"]`);
      }
    } else {
      if (gridEnabled) {
        activeSlide = slides.filter((slideEl) => slideEl.column === activeIndex)[0];
        nextSlide = slides.filter((slideEl) => slideEl.column === activeIndex + 1)[0];
        prevSlide = slides.filter((slideEl) => slideEl.column === activeIndex - 1)[0];
      } else {
        activeSlide = slides[activeIndex];
      }
    }
    if (activeSlide) {
      if (!gridEnabled) {
        nextSlide = elementNextAll2(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
        if (params.loop && !nextSlide) {
          nextSlide = slides[0];
        }
        prevSlide = elementPrevAll2(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
        if (params.loop && !prevSlide === 0) {
          prevSlide = slides[slides.length - 1];
        }
      }
    }
    slides.forEach((slideEl) => {
      toggleSlideClasses2(slideEl, slideEl === activeSlide, params.slideActiveClass);
      toggleSlideClasses2(slideEl, slideEl === nextSlide, params.slideNextClass);
      toggleSlideClasses2(slideEl, slideEl === prevSlide, params.slidePrevClass);
    });
    swiper.emitSlidesClasses();
  }
  var processLazyPreloader2 = (swiper, imageEl) => {
    if (!swiper || swiper.destroyed || !swiper.params)
      return;
    const slideSelector = () => swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
    const slideEl = imageEl.closest(slideSelector());
    if (slideEl) {
      let lazyEl = slideEl.querySelector(`.${swiper.params.lazyPreloaderClass}`);
      if (!lazyEl && swiper.isElement) {
        if (slideEl.shadowRoot) {
          lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
        } else {
          requestAnimationFrame(() => {
            if (slideEl.shadowRoot) {
              lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
              if (lazyEl)
                lazyEl.remove();
            }
          });
        }
      }
      if (lazyEl)
        lazyEl.remove();
    }
  };
  var unlazy2 = (swiper, index) => {
    if (!swiper.slides[index])
      return;
    const imageEl = swiper.slides[index].querySelector('[loading="lazy"]');
    if (imageEl)
      imageEl.removeAttribute("loading");
  };
  var preload2 = (swiper) => {
    if (!swiper || swiper.destroyed || !swiper.params)
      return;
    let amount = swiper.params.lazyPreloadPrevNext;
    const len = swiper.slides.length;
    if (!len || !amount || amount < 0)
      return;
    amount = Math.min(amount, len);
    const slidesPerView = swiper.params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(swiper.params.slidesPerView);
    const activeIndex = swiper.activeIndex;
    if (swiper.params.grid && swiper.params.grid.rows > 1) {
      const activeColumn = activeIndex;
      const preloadColumns = [activeColumn - amount];
      preloadColumns.push(...Array.from({
        length: amount
      }).map((_, i) => {
        return activeColumn + slidesPerView + i;
      }));
      swiper.slides.forEach((slideEl, i) => {
        if (preloadColumns.includes(slideEl.column))
          unlazy2(swiper, i);
      });
      return;
    }
    const slideIndexLastInView = activeIndex + slidesPerView - 1;
    if (swiper.params.rewind || swiper.params.loop) {
      for (let i = activeIndex - amount; i <= slideIndexLastInView + amount; i += 1) {
        const realIndex = (i % len + len) % len;
        if (realIndex < activeIndex || realIndex > slideIndexLastInView)
          unlazy2(swiper, realIndex);
      }
    } else {
      for (let i = Math.max(activeIndex - amount, 0); i <= Math.min(slideIndexLastInView + amount, len - 1); i += 1) {
        if (i !== activeIndex && (i > slideIndexLastInView || i < activeIndex)) {
          unlazy2(swiper, i);
        }
      }
    }
  };
  function getActiveIndexByTranslate2(swiper) {
    const {
      slidesGrid,
      params
    } = swiper;
    const translate22 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
    let activeIndex;
    for (let i = 0; i < slidesGrid.length; i += 1) {
      if (typeof slidesGrid[i + 1] !== "undefined") {
        if (translate22 >= slidesGrid[i] && translate22 < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
          activeIndex = i;
        } else if (translate22 >= slidesGrid[i] && translate22 < slidesGrid[i + 1]) {
          activeIndex = i + 1;
        }
      } else if (translate22 >= slidesGrid[i]) {
        activeIndex = i;
      }
    }
    if (params.normalizeSlideIndex) {
      if (activeIndex < 0 || typeof activeIndex === "undefined")
        activeIndex = 0;
    }
    return activeIndex;
  }
  function updateActiveIndex2(newActiveIndex) {
    const swiper = this;
    const translate22 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
    const {
      snapGrid,
      params,
      activeIndex: previousIndex,
      realIndex: previousRealIndex,
      snapIndex: previousSnapIndex
    } = swiper;
    let activeIndex = newActiveIndex;
    let snapIndex;
    const getVirtualRealIndex = (aIndex) => {
      let realIndex2 = aIndex - swiper.virtual.slidesBefore;
      if (realIndex2 < 0) {
        realIndex2 = swiper.virtual.slides.length + realIndex2;
      }
      if (realIndex2 >= swiper.virtual.slides.length) {
        realIndex2 -= swiper.virtual.slides.length;
      }
      return realIndex2;
    };
    if (typeof activeIndex === "undefined") {
      activeIndex = getActiveIndexByTranslate2(swiper);
    }
    if (snapGrid.indexOf(translate22) >= 0) {
      snapIndex = snapGrid.indexOf(translate22);
    } else {
      const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
      snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
    }
    if (snapIndex >= snapGrid.length)
      snapIndex = snapGrid.length - 1;
    if (activeIndex === previousIndex && !swiper.params.loop) {
      if (snapIndex !== previousSnapIndex) {
        swiper.snapIndex = snapIndex;
        swiper.emit("snapIndexChange");
      }
      return;
    }
    if (activeIndex === previousIndex && swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
      swiper.realIndex = getVirtualRealIndex(activeIndex);
      return;
    }
    const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
    let realIndex;
    if (swiper.virtual && params.virtual.enabled && params.loop) {
      realIndex = getVirtualRealIndex(activeIndex);
    } else if (gridEnabled) {
      const firstSlideInColumn = swiper.slides.filter((slideEl) => slideEl.column === activeIndex)[0];
      let activeSlideIndex = parseInt(firstSlideInColumn.getAttribute("data-swiper-slide-index"), 10);
      if (Number.isNaN(activeSlideIndex)) {
        activeSlideIndex = Math.max(swiper.slides.indexOf(firstSlideInColumn), 0);
      }
      realIndex = Math.floor(activeSlideIndex / params.grid.rows);
    } else if (swiper.slides[activeIndex]) {
      const slideIndex = swiper.slides[activeIndex].getAttribute("data-swiper-slide-index");
      if (slideIndex) {
        realIndex = parseInt(slideIndex, 10);
      } else {
        realIndex = activeIndex;
      }
    } else {
      realIndex = activeIndex;
    }
    Object.assign(swiper, {
      previousSnapIndex,
      snapIndex,
      previousRealIndex,
      realIndex,
      previousIndex,
      activeIndex
    });
    if (swiper.initialized) {
      preload2(swiper);
    }
    swiper.emit("activeIndexChange");
    swiper.emit("snapIndexChange");
    if (swiper.initialized || swiper.params.runCallbacksOnInit) {
      if (previousRealIndex !== realIndex) {
        swiper.emit("realIndexChange");
      }
      swiper.emit("slideChange");
    }
  }
  function updateClickedSlide2(el, path) {
    const swiper = this;
    const params = swiper.params;
    let slide22 = el.closest(`.${params.slideClass}, swiper-slide`);
    if (!slide22 && swiper.isElement && path && path.length > 1 && path.includes(el)) {
      [...path.slice(path.indexOf(el) + 1, path.length)].forEach((pathEl) => {
        if (!slide22 && pathEl.matches && pathEl.matches(`.${params.slideClass}, swiper-slide`)) {
          slide22 = pathEl;
        }
      });
    }
    let slideFound = false;
    let slideIndex;
    if (slide22) {
      for (let i = 0; i < swiper.slides.length; i += 1) {
        if (swiper.slides[i] === slide22) {
          slideFound = true;
          slideIndex = i;
          break;
        }
      }
    }
    if (slide22 && slideFound) {
      swiper.clickedSlide = slide22;
      if (swiper.virtual && swiper.params.virtual.enabled) {
        swiper.clickedIndex = parseInt(slide22.getAttribute("data-swiper-slide-index"), 10);
      } else {
        swiper.clickedIndex = slideIndex;
      }
    } else {
      swiper.clickedSlide = void 0;
      swiper.clickedIndex = void 0;
      return;
    }
    if (params.slideToClickedSlide && swiper.clickedIndex !== void 0 && swiper.clickedIndex !== swiper.activeIndex) {
      swiper.slideToClickedSlide();
    }
  }
  var update2 = {
    updateSize: updateSize2,
    updateSlides: updateSlides2,
    updateAutoHeight: updateAutoHeight2,
    updateSlidesOffset: updateSlidesOffset2,
    updateSlidesProgress: updateSlidesProgress2,
    updateProgress: updateProgress2,
    updateSlidesClasses: updateSlidesClasses2,
    updateActiveIndex: updateActiveIndex2,
    updateClickedSlide: updateClickedSlide2
  };
  function getSwiperTranslate2(axis) {
    if (axis === void 0) {
      axis = this.isHorizontal() ? "x" : "y";
    }
    const swiper = this;
    const {
      params,
      rtlTranslate: rtl,
      translate: translate22,
      wrapperEl
    } = swiper;
    if (params.virtualTranslate) {
      return rtl ? -translate22 : translate22;
    }
    if (params.cssMode) {
      return translate22;
    }
    let currentTranslate = getTranslate2(wrapperEl, axis);
    currentTranslate += swiper.cssOverflowAdjustment();
    if (rtl)
      currentTranslate = -currentTranslate;
    return currentTranslate || 0;
  }
  function setTranslate2(translate22, byController) {
    const swiper = this;
    const {
      rtlTranslate: rtl,
      params,
      wrapperEl,
      progress
    } = swiper;
    let x = 0;
    let y = 0;
    const z = 0;
    if (swiper.isHorizontal()) {
      x = rtl ? -translate22 : translate22;
    } else {
      y = translate22;
    }
    if (params.roundLengths) {
      x = Math.floor(x);
      y = Math.floor(y);
    }
    swiper.previousTranslate = swiper.translate;
    swiper.translate = swiper.isHorizontal() ? x : y;
    if (params.cssMode) {
      wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y;
    } else if (!params.virtualTranslate) {
      if (swiper.isHorizontal()) {
        x -= swiper.cssOverflowAdjustment();
      } else {
        y -= swiper.cssOverflowAdjustment();
      }
      wrapperEl.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
    }
    let newProgress;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    if (translatesDiff === 0) {
      newProgress = 0;
    } else {
      newProgress = (translate22 - swiper.minTranslate()) / translatesDiff;
    }
    if (newProgress !== progress) {
      swiper.updateProgress(translate22);
    }
    swiper.emit("setTranslate", swiper.translate, byController);
  }
  function minTranslate2() {
    return -this.snapGrid[0];
  }
  function maxTranslate2() {
    return -this.snapGrid[this.snapGrid.length - 1];
  }
  function translateTo2(translate22, speed, runCallbacks, translateBounds, internal) {
    if (translate22 === void 0) {
      translate22 = 0;
    }
    if (speed === void 0) {
      speed = this.params.speed;
    }
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    if (translateBounds === void 0) {
      translateBounds = true;
    }
    const swiper = this;
    const {
      params,
      wrapperEl
    } = swiper;
    if (swiper.animating && params.preventInteractionOnTransition) {
      return false;
    }
    const minTranslate22 = swiper.minTranslate();
    const maxTranslate22 = swiper.maxTranslate();
    let newTranslate;
    if (translateBounds && translate22 > minTranslate22)
      newTranslate = minTranslate22;
    else if (translateBounds && translate22 < maxTranslate22)
      newTranslate = maxTranslate22;
    else
      newTranslate = translate22;
    swiper.updateProgress(newTranslate);
    if (params.cssMode) {
      const isH = swiper.isHorizontal();
      if (speed === 0) {
        wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate;
      } else {
        if (!swiper.support.smoothScroll) {
          animateCSSModeScroll2({
            swiper,
            targetPosition: -newTranslate,
            side: isH ? "left" : "top"
          });
          return true;
        }
        wrapperEl.scrollTo({
          [isH ? "left" : "top"]: -newTranslate,
          behavior: "smooth"
        });
      }
      return true;
    }
    if (speed === 0) {
      swiper.setTransition(0);
      swiper.setTranslate(newTranslate);
      if (runCallbacks) {
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.emit("transitionEnd");
      }
    } else {
      swiper.setTransition(speed);
      swiper.setTranslate(newTranslate);
      if (runCallbacks) {
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.emit("transitionStart");
      }
      if (!swiper.animating) {
        swiper.animating = true;
        if (!swiper.onTranslateToWrapperTransitionEnd) {
          swiper.onTranslateToWrapperTransitionEnd = function transitionEnd22(e) {
            if (!swiper || swiper.destroyed)
              return;
            if (e.target !== this)
              return;
            swiper.wrapperEl.removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
            swiper.onTranslateToWrapperTransitionEnd = null;
            delete swiper.onTranslateToWrapperTransitionEnd;
            swiper.animating = false;
            if (runCallbacks) {
              swiper.emit("transitionEnd");
            }
          };
        }
        swiper.wrapperEl.addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
      }
    }
    return true;
  }
  var translate2 = {
    getTranslate: getSwiperTranslate2,
    setTranslate: setTranslate2,
    minTranslate: minTranslate2,
    maxTranslate: maxTranslate2,
    translateTo: translateTo2
  };
  function setTransition2(duration, byController) {
    const swiper = this;
    if (!swiper.params.cssMode) {
      swiper.wrapperEl.style.transitionDuration = `${duration}ms`;
      swiper.wrapperEl.style.transitionDelay = duration === 0 ? `0ms` : "";
    }
    swiper.emit("setTransition", duration, byController);
  }
  function transitionEmit2(_ref) {
    let {
      swiper,
      runCallbacks,
      direction,
      step
    } = _ref;
    const {
      activeIndex,
      previousIndex
    } = swiper;
    let dir = direction;
    if (!dir) {
      if (activeIndex > previousIndex)
        dir = "next";
      else if (activeIndex < previousIndex)
        dir = "prev";
      else
        dir = "reset";
    }
    swiper.emit(`transition${step}`);
    if (runCallbacks && activeIndex !== previousIndex) {
      if (dir === "reset") {
        swiper.emit(`slideResetTransition${step}`);
        return;
      }
      swiper.emit(`slideChangeTransition${step}`);
      if (dir === "next") {
        swiper.emit(`slideNextTransition${step}`);
      } else {
        swiper.emit(`slidePrevTransition${step}`);
      }
    }
  }
  function transitionStart2(runCallbacks, direction) {
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    const swiper = this;
    const {
      params
    } = swiper;
    if (params.cssMode)
      return;
    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }
    transitionEmit2({
      swiper,
      runCallbacks,
      direction,
      step: "Start"
    });
  }
  function transitionEnd2(runCallbacks, direction) {
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    const swiper = this;
    const {
      params
    } = swiper;
    swiper.animating = false;
    if (params.cssMode)
      return;
    swiper.setTransition(0);
    transitionEmit2({
      swiper,
      runCallbacks,
      direction,
      step: "End"
    });
  }
  var transition2 = {
    setTransition: setTransition2,
    transitionStart: transitionStart2,
    transitionEnd: transitionEnd2
  };
  function slideTo2(index, speed, runCallbacks, internal, initial) {
    if (index === void 0) {
      index = 0;
    }
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    if (typeof index === "string") {
      index = parseInt(index, 10);
    }
    const swiper = this;
    let slideIndex = index;
    if (slideIndex < 0)
      slideIndex = 0;
    const {
      params,
      snapGrid,
      slidesGrid,
      previousIndex,
      activeIndex,
      rtlTranslate: rtl,
      wrapperEl,
      enabled
    } = swiper;
    if (!enabled && !internal && !initial || swiper.destroyed || swiper.animating && params.preventInteractionOnTransition) {
      return false;
    }
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
    let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
    if (snapIndex >= snapGrid.length)
      snapIndex = snapGrid.length - 1;
    const translate22 = -snapGrid[snapIndex];
    if (params.normalizeSlideIndex) {
      for (let i = 0; i < slidesGrid.length; i += 1) {
        const normalizedTranslate = -Math.floor(translate22 * 100);
        const normalizedGrid = Math.floor(slidesGrid[i] * 100);
        const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);
        if (typeof slidesGrid[i + 1] !== "undefined") {
          if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
            slideIndex = i;
          } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
            slideIndex = i + 1;
          }
        } else if (normalizedTranslate >= normalizedGrid) {
          slideIndex = i;
        }
      }
    }
    if (swiper.initialized && slideIndex !== activeIndex) {
      if (!swiper.allowSlideNext && (rtl ? translate22 > swiper.translate && translate22 > swiper.minTranslate() : translate22 < swiper.translate && translate22 < swiper.minTranslate())) {
        return false;
      }
      if (!swiper.allowSlidePrev && translate22 > swiper.translate && translate22 > swiper.maxTranslate()) {
        if ((activeIndex || 0) !== slideIndex) {
          return false;
        }
      }
    }
    if (slideIndex !== (previousIndex || 0) && runCallbacks) {
      swiper.emit("beforeSlideChangeStart");
    }
    swiper.updateProgress(translate22);
    let direction;
    if (slideIndex > activeIndex)
      direction = "next";
    else if (slideIndex < activeIndex)
      direction = "prev";
    else
      direction = "reset";
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    const isInitialVirtual = isVirtual && initial;
    if (!isInitialVirtual && (rtl && -translate22 === swiper.translate || !rtl && translate22 === swiper.translate)) {
      swiper.updateActiveIndex(slideIndex);
      if (params.autoHeight) {
        swiper.updateAutoHeight();
      }
      swiper.updateSlidesClasses();
      if (params.effect !== "slide") {
        swiper.setTranslate(translate22);
      }
      if (direction !== "reset") {
        swiper.transitionStart(runCallbacks, direction);
        swiper.transitionEnd(runCallbacks, direction);
      }
      return false;
    }
    if (params.cssMode) {
      const isH = swiper.isHorizontal();
      const t = rtl ? translate22 : -translate22;
      if (speed === 0) {
        if (isVirtual) {
          swiper.wrapperEl.style.scrollSnapType = "none";
          swiper._immediateVirtual = true;
        }
        if (isVirtual && !swiper._cssModeVirtualInitialSet && swiper.params.initialSlide > 0) {
          swiper._cssModeVirtualInitialSet = true;
          requestAnimationFrame(() => {
            wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
          });
        } else {
          wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
        }
        if (isVirtual) {
          requestAnimationFrame(() => {
            swiper.wrapperEl.style.scrollSnapType = "";
            swiper._immediateVirtual = false;
          });
        }
      } else {
        if (!swiper.support.smoothScroll) {
          animateCSSModeScroll2({
            swiper,
            targetPosition: t,
            side: isH ? "left" : "top"
          });
          return true;
        }
        wrapperEl.scrollTo({
          [isH ? "left" : "top"]: t,
          behavior: "smooth"
        });
      }
      return true;
    }
    swiper.setTransition(speed);
    swiper.setTranslate(translate22);
    swiper.updateActiveIndex(slideIndex);
    swiper.updateSlidesClasses();
    swiper.emit("beforeTransitionStart", speed, internal);
    swiper.transitionStart(runCallbacks, direction);
    if (speed === 0) {
      swiper.transitionEnd(runCallbacks, direction);
    } else if (!swiper.animating) {
      swiper.animating = true;
      if (!swiper.onSlideToWrapperTransitionEnd) {
        swiper.onSlideToWrapperTransitionEnd = function transitionEnd22(e) {
          if (!swiper || swiper.destroyed)
            return;
          if (e.target !== this)
            return;
          swiper.wrapperEl.removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
          swiper.onSlideToWrapperTransitionEnd = null;
          delete swiper.onSlideToWrapperTransitionEnd;
          swiper.transitionEnd(runCallbacks, direction);
        };
      }
      swiper.wrapperEl.addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
    }
    return true;
  }
  function slideToLoop2(index, speed, runCallbacks, internal) {
    if (index === void 0) {
      index = 0;
    }
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    if (typeof index === "string") {
      const indexAsNumber = parseInt(index, 10);
      index = indexAsNumber;
    }
    const swiper = this;
    if (swiper.destroyed)
      return;
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    const gridEnabled = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
    let newIndex = index;
    if (swiper.params.loop) {
      if (swiper.virtual && swiper.params.virtual.enabled) {
        newIndex = newIndex + swiper.virtual.slidesBefore;
      } else {
        let targetSlideIndex;
        if (gridEnabled) {
          const slideIndex = newIndex * swiper.params.grid.rows;
          targetSlideIndex = swiper.slides.filter((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex)[0].column;
        } else {
          targetSlideIndex = swiper.getSlideIndexByData(newIndex);
        }
        const cols = gridEnabled ? Math.ceil(swiper.slides.length / swiper.params.grid.rows) : swiper.slides.length;
        const {
          centeredSlides
        } = swiper.params;
        let slidesPerView = swiper.params.slidesPerView;
        if (slidesPerView === "auto") {
          slidesPerView = swiper.slidesPerViewDynamic();
        } else {
          slidesPerView = Math.ceil(parseFloat(swiper.params.slidesPerView, 10));
          if (centeredSlides && slidesPerView % 2 === 0) {
            slidesPerView = slidesPerView + 1;
          }
        }
        let needLoopFix = cols - targetSlideIndex < slidesPerView;
        if (centeredSlides) {
          needLoopFix = needLoopFix || targetSlideIndex < Math.ceil(slidesPerView / 2);
        }
        if (internal && centeredSlides && swiper.params.slidesPerView !== "auto" && !gridEnabled) {
          needLoopFix = false;
        }
        if (needLoopFix) {
          const direction = centeredSlides ? targetSlideIndex < swiper.activeIndex ? "prev" : "next" : targetSlideIndex - swiper.activeIndex - 1 < swiper.params.slidesPerView ? "next" : "prev";
          swiper.loopFix({
            direction,
            slideTo: true,
            activeSlideIndex: direction === "next" ? targetSlideIndex + 1 : targetSlideIndex - cols + 1,
            slideRealIndex: direction === "next" ? swiper.realIndex : void 0
          });
        }
        if (gridEnabled) {
          const slideIndex = newIndex * swiper.params.grid.rows;
          newIndex = swiper.slides.filter((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex)[0].column;
        } else {
          newIndex = swiper.getSlideIndexByData(newIndex);
        }
      }
    }
    requestAnimationFrame(() => {
      swiper.slideTo(newIndex, speed, runCallbacks, internal);
    });
    return swiper;
  }
  function slideNext2(speed, runCallbacks, internal) {
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    const swiper = this;
    const {
      enabled,
      params,
      animating
    } = swiper;
    if (!enabled || swiper.destroyed)
      return swiper;
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    let perGroup = params.slidesPerGroup;
    if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
      perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
    }
    const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    if (params.loop) {
      if (animating && !isVirtual && params.loopPreventsSliding)
        return false;
      swiper.loopFix({
        direction: "next"
      });
      swiper._clientLeft = swiper.wrapperEl.clientLeft;
      if (swiper.activeIndex === swiper.slides.length - 1 && params.cssMode) {
        requestAnimationFrame(() => {
          swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
        });
        return true;
      }
    }
    if (params.rewind && swiper.isEnd) {
      return swiper.slideTo(0, speed, runCallbacks, internal);
    }
    return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
  }
  function slidePrev2(speed, runCallbacks, internal) {
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    const swiper = this;
    const {
      params,
      snapGrid,
      slidesGrid,
      rtlTranslate,
      enabled,
      animating
    } = swiper;
    if (!enabled || swiper.destroyed)
      return swiper;
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    const isVirtual = swiper.virtual && params.virtual.enabled;
    if (params.loop) {
      if (animating && !isVirtual && params.loopPreventsSliding)
        return false;
      swiper.loopFix({
        direction: "prev"
      });
      swiper._clientLeft = swiper.wrapperEl.clientLeft;
    }
    const translate22 = rtlTranslate ? swiper.translate : -swiper.translate;
    function normalize(val) {
      if (val < 0)
        return -Math.floor(Math.abs(val));
      return Math.floor(val);
    }
    const normalizedTranslate = normalize(translate22);
    const normalizedSnapGrid = snapGrid.map((val) => normalize(val));
    let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
    if (typeof prevSnap === "undefined" && params.cssMode) {
      let prevSnapIndex;
      snapGrid.forEach((snap, snapIndex) => {
        if (normalizedTranslate >= snap) {
          prevSnapIndex = snapIndex;
        }
      });
      if (typeof prevSnapIndex !== "undefined") {
        prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
      }
    }
    let prevIndex = 0;
    if (typeof prevSnap !== "undefined") {
      prevIndex = slidesGrid.indexOf(prevSnap);
      if (prevIndex < 0)
        prevIndex = swiper.activeIndex - 1;
      if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
        prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
        prevIndex = Math.max(prevIndex, 0);
      }
    }
    if (params.rewind && swiper.isBeginning) {
      const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
      return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
    } else if (params.loop && swiper.activeIndex === 0 && params.cssMode) {
      requestAnimationFrame(() => {
        swiper.slideTo(prevIndex, speed, runCallbacks, internal);
      });
      return true;
    }
    return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
  }
  function slideReset2(speed, runCallbacks, internal) {
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    const swiper = this;
    if (swiper.destroyed)
      return;
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
  }
  function slideToClosest2(speed, runCallbacks, internal, threshold) {
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    if (threshold === void 0) {
      threshold = 0.5;
    }
    const swiper = this;
    if (swiper.destroyed)
      return;
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    let index = swiper.activeIndex;
    const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
    const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
    const translate22 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
    if (translate22 >= swiper.snapGrid[snapIndex]) {
      const currentSnap = swiper.snapGrid[snapIndex];
      const nextSnap = swiper.snapGrid[snapIndex + 1];
      if (translate22 - currentSnap > (nextSnap - currentSnap) * threshold) {
        index += swiper.params.slidesPerGroup;
      }
    } else {
      const prevSnap = swiper.snapGrid[snapIndex - 1];
      const currentSnap = swiper.snapGrid[snapIndex];
      if (translate22 - prevSnap <= (currentSnap - prevSnap) * threshold) {
        index -= swiper.params.slidesPerGroup;
      }
    }
    index = Math.max(index, 0);
    index = Math.min(index, swiper.slidesGrid.length - 1);
    return swiper.slideTo(index, speed, runCallbacks, internal);
  }
  function slideToClickedSlide2() {
    const swiper = this;
    if (swiper.destroyed)
      return;
    const {
      params,
      slidesEl
    } = swiper;
    const slidesPerView = params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : params.slidesPerView;
    let slideToIndex = swiper.clickedIndex;
    let realIndex;
    const slideSelector = swiper.isElement ? `swiper-slide` : `.${params.slideClass}`;
    if (params.loop) {
      if (swiper.animating)
        return;
      realIndex = parseInt(swiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10);
      if (params.centeredSlides) {
        if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
          swiper.loopFix();
          slideToIndex = swiper.getSlideIndex(elementChildren2(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
          nextTick2(() => {
            swiper.slideTo(slideToIndex);
          });
        } else {
          swiper.slideTo(slideToIndex);
        }
      } else if (slideToIndex > swiper.slides.length - slidesPerView) {
        swiper.loopFix();
        slideToIndex = swiper.getSlideIndex(elementChildren2(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
        nextTick2(() => {
          swiper.slideTo(slideToIndex);
        });
      } else {
        swiper.slideTo(slideToIndex);
      }
    } else {
      swiper.slideTo(slideToIndex);
    }
  }
  var slide2 = {
    slideTo: slideTo2,
    slideToLoop: slideToLoop2,
    slideNext: slideNext2,
    slidePrev: slidePrev2,
    slideReset: slideReset2,
    slideToClosest: slideToClosest2,
    slideToClickedSlide: slideToClickedSlide2
  };
  function loopCreate2(slideRealIndex) {
    const swiper = this;
    const {
      params,
      slidesEl
    } = swiper;
    if (!params.loop || swiper.virtual && swiper.params.virtual.enabled)
      return;
    const initSlides = () => {
      const slides = elementChildren2(slidesEl, `.${params.slideClass}, swiper-slide`);
      slides.forEach((el, index) => {
        el.setAttribute("data-swiper-slide-index", index);
      });
    };
    const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
    const slidesPerGroup = params.slidesPerGroup * (gridEnabled ? params.grid.rows : 1);
    const shouldFillGroup = swiper.slides.length % slidesPerGroup !== 0;
    const shouldFillGrid = gridEnabled && swiper.slides.length % params.grid.rows !== 0;
    const addBlankSlides = (amountOfSlides) => {
      for (let i = 0; i < amountOfSlides; i += 1) {
        const slideEl = swiper.isElement ? createElement3("swiper-slide", [params.slideBlankClass]) : createElement3("div", [params.slideClass, params.slideBlankClass]);
        swiper.slidesEl.append(slideEl);
      }
    };
    if (shouldFillGroup) {
      if (params.loopAddBlankSlides) {
        const slidesToAdd = slidesPerGroup - swiper.slides.length % slidesPerGroup;
        addBlankSlides(slidesToAdd);
        swiper.recalcSlides();
        swiper.updateSlides();
      } else {
        showWarning2("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
      }
      initSlides();
    } else if (shouldFillGrid) {
      if (params.loopAddBlankSlides) {
        const slidesToAdd = params.grid.rows - swiper.slides.length % params.grid.rows;
        addBlankSlides(slidesToAdd);
        swiper.recalcSlides();
        swiper.updateSlides();
      } else {
        showWarning2("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
      }
      initSlides();
    } else {
      initSlides();
    }
    swiper.loopFix({
      slideRealIndex,
      direction: params.centeredSlides ? void 0 : "next"
    });
  }
  function loopFix2(_temp) {
    let {
      slideRealIndex,
      slideTo: slideTo22 = true,
      direction,
      setTranslate: setTranslate22,
      activeSlideIndex,
      byController,
      byMousewheel
    } = _temp === void 0 ? {} : _temp;
    const swiper = this;
    if (!swiper.params.loop)
      return;
    swiper.emit("beforeLoopFix");
    const {
      slides,
      allowSlidePrev,
      allowSlideNext,
      slidesEl,
      params
    } = swiper;
    const {
      centeredSlides
    } = params;
    swiper.allowSlidePrev = true;
    swiper.allowSlideNext = true;
    if (swiper.virtual && params.virtual.enabled) {
      if (slideTo22) {
        if (!params.centeredSlides && swiper.snapIndex === 0) {
          swiper.slideTo(swiper.virtual.slides.length, 0, false, true);
        } else if (params.centeredSlides && swiper.snapIndex < params.slidesPerView) {
          swiper.slideTo(swiper.virtual.slides.length + swiper.snapIndex, 0, false, true);
        } else if (swiper.snapIndex === swiper.snapGrid.length - 1) {
          swiper.slideTo(swiper.virtual.slidesBefore, 0, false, true);
        }
      }
      swiper.allowSlidePrev = allowSlidePrev;
      swiper.allowSlideNext = allowSlideNext;
      swiper.emit("loopFix");
      return;
    }
    let slidesPerView = params.slidesPerView;
    if (slidesPerView === "auto") {
      slidesPerView = swiper.slidesPerViewDynamic();
    } else {
      slidesPerView = Math.ceil(parseFloat(params.slidesPerView, 10));
      if (centeredSlides && slidesPerView % 2 === 0) {
        slidesPerView = slidesPerView + 1;
      }
    }
    const slidesPerGroup = params.slidesPerGroupAuto ? slidesPerView : params.slidesPerGroup;
    let loopedSlides = slidesPerGroup;
    if (loopedSlides % slidesPerGroup !== 0) {
      loopedSlides += slidesPerGroup - loopedSlides % slidesPerGroup;
    }
    loopedSlides += params.loopAdditionalSlides;
    swiper.loopedSlides = loopedSlides;
    const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
    if (slides.length < slidesPerView + loopedSlides) {
      showWarning2("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled and not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters");
    } else if (gridEnabled && params.grid.fill === "row") {
      showWarning2("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");
    }
    const prependSlidesIndexes = [];
    const appendSlidesIndexes = [];
    let activeIndex = swiper.activeIndex;
    if (typeof activeSlideIndex === "undefined") {
      activeSlideIndex = swiper.getSlideIndex(slides.filter((el) => el.classList.contains(params.slideActiveClass))[0]);
    } else {
      activeIndex = activeSlideIndex;
    }
    const isNext = direction === "next" || !direction;
    const isPrev = direction === "prev" || !direction;
    let slidesPrepended = 0;
    let slidesAppended = 0;
    const cols = gridEnabled ? Math.ceil(slides.length / params.grid.rows) : slides.length;
    const activeColIndex = gridEnabled ? slides[activeSlideIndex].column : activeSlideIndex;
    const activeColIndexWithShift = activeColIndex + (centeredSlides && typeof setTranslate22 === "undefined" ? -slidesPerView / 2 + 0.5 : 0);
    if (activeColIndexWithShift < loopedSlides) {
      slidesPrepended = Math.max(loopedSlides - activeColIndexWithShift, slidesPerGroup);
      for (let i = 0; i < loopedSlides - activeColIndexWithShift; i += 1) {
        const index = i - Math.floor(i / cols) * cols;
        if (gridEnabled) {
          const colIndexToPrepend = cols - index - 1;
          for (let i2 = slides.length - 1; i2 >= 0; i2 -= 1) {
            if (slides[i2].column === colIndexToPrepend)
              prependSlidesIndexes.push(i2);
          }
        } else {
          prependSlidesIndexes.push(cols - index - 1);
        }
      }
    } else if (activeColIndexWithShift + slidesPerView > cols - loopedSlides) {
      slidesAppended = Math.max(activeColIndexWithShift - (cols - loopedSlides * 2), slidesPerGroup);
      for (let i = 0; i < slidesAppended; i += 1) {
        const index = i - Math.floor(i / cols) * cols;
        if (gridEnabled) {
          slides.forEach((slide22, slideIndex) => {
            if (slide22.column === index)
              appendSlidesIndexes.push(slideIndex);
          });
        } else {
          appendSlidesIndexes.push(index);
        }
      }
    }
    swiper.__preventObserver__ = true;
    requestAnimationFrame(() => {
      swiper.__preventObserver__ = false;
    });
    if (isPrev) {
      prependSlidesIndexes.forEach((index) => {
        slides[index].swiperLoopMoveDOM = true;
        slidesEl.prepend(slides[index]);
        slides[index].swiperLoopMoveDOM = false;
      });
    }
    if (isNext) {
      appendSlidesIndexes.forEach((index) => {
        slides[index].swiperLoopMoveDOM = true;
        slidesEl.append(slides[index]);
        slides[index].swiperLoopMoveDOM = false;
      });
    }
    swiper.recalcSlides();
    if (params.slidesPerView === "auto") {
      swiper.updateSlides();
    } else if (gridEnabled && (prependSlidesIndexes.length > 0 && isPrev || appendSlidesIndexes.length > 0 && isNext)) {
      swiper.slides.forEach((slide22, slideIndex) => {
        swiper.grid.updateSlide(slideIndex, slide22, swiper.slides);
      });
    }
    if (params.watchSlidesProgress) {
      swiper.updateSlidesOffset();
    }
    if (slideTo22) {
      if (prependSlidesIndexes.length > 0 && isPrev) {
        if (typeof slideRealIndex === "undefined") {
          const currentSlideTranslate = swiper.slidesGrid[activeIndex];
          const newSlideTranslate = swiper.slidesGrid[activeIndex + slidesPrepended];
          const diff = newSlideTranslate - currentSlideTranslate;
          if (byMousewheel) {
            swiper.setTranslate(swiper.translate - diff);
          } else {
            swiper.slideTo(activeIndex + Math.ceil(slidesPrepended), 0, false, true);
            if (setTranslate22) {
              swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
              swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
            }
          }
        } else {
          if (setTranslate22) {
            const shift = gridEnabled ? prependSlidesIndexes.length / params.grid.rows : prependSlidesIndexes.length;
            swiper.slideTo(swiper.activeIndex + shift, 0, false, true);
            swiper.touchEventsData.currentTranslate = swiper.translate;
          }
        }
      } else if (appendSlidesIndexes.length > 0 && isNext) {
        if (typeof slideRealIndex === "undefined") {
          const currentSlideTranslate = swiper.slidesGrid[activeIndex];
          const newSlideTranslate = swiper.slidesGrid[activeIndex - slidesAppended];
          const diff = newSlideTranslate - currentSlideTranslate;
          if (byMousewheel) {
            swiper.setTranslate(swiper.translate - diff);
          } else {
            swiper.slideTo(activeIndex - slidesAppended, 0, false, true);
            if (setTranslate22) {
              swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
              swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
            }
          }
        } else {
          const shift = gridEnabled ? appendSlidesIndexes.length / params.grid.rows : appendSlidesIndexes.length;
          swiper.slideTo(swiper.activeIndex - shift, 0, false, true);
        }
      }
    }
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;
    if (swiper.controller && swiper.controller.control && !byController) {
      const loopParams = {
        slideRealIndex,
        direction,
        setTranslate: setTranslate22,
        activeSlideIndex,
        byController: true
      };
      if (Array.isArray(swiper.controller.control)) {
        swiper.controller.control.forEach((c) => {
          if (!c.destroyed && c.params.loop)
            c.loopFix({
              ...loopParams,
              slideTo: c.params.slidesPerView === params.slidesPerView ? slideTo22 : false
            });
        });
      } else if (swiper.controller.control instanceof swiper.constructor && swiper.controller.control.params.loop) {
        swiper.controller.control.loopFix({
          ...loopParams,
          slideTo: swiper.controller.control.params.slidesPerView === params.slidesPerView ? slideTo22 : false
        });
      }
    }
    swiper.emit("loopFix");
  }
  function loopDestroy2() {
    const swiper = this;
    const {
      params,
      slidesEl
    } = swiper;
    if (!params.loop || swiper.virtual && swiper.params.virtual.enabled)
      return;
    swiper.recalcSlides();
    const newSlidesOrder = [];
    swiper.slides.forEach((slideEl) => {
      const index = typeof slideEl.swiperSlideIndex === "undefined" ? slideEl.getAttribute("data-swiper-slide-index") * 1 : slideEl.swiperSlideIndex;
      newSlidesOrder[index] = slideEl;
    });
    swiper.slides.forEach((slideEl) => {
      slideEl.removeAttribute("data-swiper-slide-index");
    });
    newSlidesOrder.forEach((slideEl) => {
      slidesEl.append(slideEl);
    });
    swiper.recalcSlides();
    swiper.slideTo(swiper.realIndex, 0);
  }
  var loop2 = {
    loopCreate: loopCreate2,
    loopFix: loopFix2,
    loopDestroy: loopDestroy2
  };
  function setGrabCursor2(moving) {
    const swiper = this;
    if (!swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode)
      return;
    const el = swiper.params.touchEventsTarget === "container" ? swiper.el : swiper.wrapperEl;
    if (swiper.isElement) {
      swiper.__preventObserver__ = true;
    }
    el.style.cursor = "move";
    el.style.cursor = moving ? "grabbing" : "grab";
    if (swiper.isElement) {
      requestAnimationFrame(() => {
        swiper.__preventObserver__ = false;
      });
    }
  }
  function unsetGrabCursor2() {
    const swiper = this;
    if (swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
      return;
    }
    if (swiper.isElement) {
      swiper.__preventObserver__ = true;
    }
    swiper[swiper.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "";
    if (swiper.isElement) {
      requestAnimationFrame(() => {
        swiper.__preventObserver__ = false;
      });
    }
  }
  var grabCursor2 = {
    setGrabCursor: setGrabCursor2,
    unsetGrabCursor: unsetGrabCursor2
  };
  function closestElement2(selector, base) {
    if (base === void 0) {
      base = this;
    }
    function __closestFrom(el) {
      if (!el || el === getDocument2() || el === getWindow2())
        return null;
      if (el.assignedSlot)
        el = el.assignedSlot;
      const found = el.closest(selector);
      if (!found && !el.getRootNode) {
        return null;
      }
      return found || __closestFrom(el.getRootNode().host);
    }
    return __closestFrom(base);
  }
  function preventEdgeSwipe2(swiper, event2, startX) {
    const window2 = getWindow2();
    const {
      params
    } = swiper;
    const edgeSwipeDetection = params.edgeSwipeDetection;
    const edgeSwipeThreshold = params.edgeSwipeThreshold;
    if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window2.innerWidth - edgeSwipeThreshold)) {
      if (edgeSwipeDetection === "prevent") {
        event2.preventDefault();
        return true;
      }
      return false;
    }
    return true;
  }
  function onTouchStart2(event2) {
    const swiper = this;
    const document2 = getDocument2();
    let e = event2;
    if (e.originalEvent)
      e = e.originalEvent;
    const data = swiper.touchEventsData;
    if (e.type === "pointerdown") {
      if (data.pointerId !== null && data.pointerId !== e.pointerId) {
        return;
      }
      data.pointerId = e.pointerId;
    } else if (e.type === "touchstart" && e.targetTouches.length === 1) {
      data.touchId = e.targetTouches[0].identifier;
    }
    if (e.type === "touchstart") {
      preventEdgeSwipe2(swiper, e, e.targetTouches[0].pageX);
      return;
    }
    const {
      params,
      touches,
      enabled
    } = swiper;
    if (!enabled)
      return;
    if (!params.simulateTouch && e.pointerType === "mouse")
      return;
    if (swiper.animating && params.preventInteractionOnTransition) {
      return;
    }
    if (!swiper.animating && params.cssMode && params.loop) {
      swiper.loopFix();
    }
    let targetEl = e.target;
    if (params.touchEventsTarget === "wrapper") {
      if (!elementIsChildOf2(targetEl, swiper.wrapperEl))
        return;
    }
    if ("which" in e && e.which === 3)
      return;
    if ("button" in e && e.button > 0)
      return;
    if (data.isTouched && data.isMoved)
      return;
    const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== "";
    const eventPath = e.composedPath ? e.composedPath() : e.path;
    if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) {
      targetEl = eventPath[0];
    }
    const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
    const isTargetShadow = !!(e.target && e.target.shadowRoot);
    if (params.noSwiping && (isTargetShadow ? closestElement2(noSwipingSelector, targetEl) : targetEl.closest(noSwipingSelector))) {
      swiper.allowClick = true;
      return;
    }
    if (params.swipeHandler) {
      if (!targetEl.closest(params.swipeHandler))
        return;
    }
    touches.currentX = e.pageX;
    touches.currentY = e.pageY;
    const startX = touches.currentX;
    const startY = touches.currentY;
    if (!preventEdgeSwipe2(swiper, e, startX)) {
      return;
    }
    Object.assign(data, {
      isTouched: true,
      isMoved: false,
      allowTouchCallbacks: true,
      isScrolling: void 0,
      startMoving: void 0
    });
    touches.startX = startX;
    touches.startY = startY;
    data.touchStartTime = now2();
    swiper.allowClick = true;
    swiper.updateSize();
    swiper.swipeDirection = void 0;
    if (params.threshold > 0)
      data.allowThresholdMove = false;
    let preventDefault = true;
    if (targetEl.matches(data.focusableElements)) {
      preventDefault = false;
      if (targetEl.nodeName === "SELECT") {
        data.isTouched = false;
      }
    }
    if (document2.activeElement && document2.activeElement.matches(data.focusableElements) && document2.activeElement !== targetEl && (e.pointerType === "mouse" || e.pointerType !== "mouse" && !targetEl.matches(data.focusableElements))) {
      document2.activeElement.blur();
    }
    const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
    if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !targetEl.isContentEditable) {
      e.preventDefault();
    }
    if (params.freeMode && params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) {
      swiper.freeMode.onTouchStart();
    }
    swiper.emit("touchStart", e);
  }
  function onTouchMove2(event2) {
    const document2 = getDocument2();
    const swiper = this;
    const data = swiper.touchEventsData;
    const {
      params,
      touches,
      rtlTranslate: rtl,
      enabled
    } = swiper;
    if (!enabled)
      return;
    if (!params.simulateTouch && event2.pointerType === "mouse")
      return;
    let e = event2;
    if (e.originalEvent)
      e = e.originalEvent;
    if (e.type === "pointermove") {
      if (data.touchId !== null)
        return;
      const id = e.pointerId;
      if (id !== data.pointerId)
        return;
    }
    let targetTouch;
    if (e.type === "touchmove") {
      targetTouch = [...e.changedTouches].filter((t) => t.identifier === data.touchId)[0];
      if (!targetTouch || targetTouch.identifier !== data.touchId)
        return;
    } else {
      targetTouch = e;
    }
    if (!data.isTouched) {
      if (data.startMoving && data.isScrolling) {
        swiper.emit("touchMoveOpposite", e);
      }
      return;
    }
    const pageX = targetTouch.pageX;
    const pageY = targetTouch.pageY;
    if (e.preventedByNestedSwiper) {
      touches.startX = pageX;
      touches.startY = pageY;
      return;
    }
    if (!swiper.allowTouchMove) {
      if (!e.target.matches(data.focusableElements)) {
        swiper.allowClick = false;
      }
      if (data.isTouched) {
        Object.assign(touches, {
          startX: pageX,
          startY: pageY,
          currentX: pageX,
          currentY: pageY
        });
        data.touchStartTime = now2();
      }
      return;
    }
    if (params.touchReleaseOnEdges && !params.loop) {
      if (swiper.isVertical()) {
        if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
          data.isTouched = false;
          data.isMoved = false;
          return;
        }
      } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) {
        return;
      }
    }
    if (document2.activeElement && document2.activeElement.matches(data.focusableElements) && document2.activeElement !== e.target && e.pointerType !== "mouse") {
      document2.activeElement.blur();
    }
    if (document2.activeElement) {
      if (e.target === document2.activeElement && e.target.matches(data.focusableElements)) {
        data.isMoved = true;
        swiper.allowClick = false;
        return;
      }
    }
    if (data.allowTouchCallbacks) {
      swiper.emit("touchMove", e);
    }
    touches.previousX = touches.currentX;
    touches.previousY = touches.currentY;
    touches.currentX = pageX;
    touches.currentY = pageY;
    const diffX = touches.currentX - touches.startX;
    const diffY = touches.currentY - touches.startY;
    if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold)
      return;
    if (typeof data.isScrolling === "undefined") {
      let touchAngle;
      if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
        data.isScrolling = false;
      } else {
        if (diffX * diffX + diffY * diffY >= 25) {
          touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
          data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
        }
      }
    }
    if (data.isScrolling) {
      swiper.emit("touchMoveOpposite", e);
    }
    if (typeof data.startMoving === "undefined") {
      if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
        data.startMoving = true;
      }
    }
    if (data.isScrolling || e.type === "touchmove" && data.preventTouchMoveFromPointerMove) {
      data.isTouched = false;
      return;
    }
    if (!data.startMoving) {
      return;
    }
    swiper.allowClick = false;
    if (!params.cssMode && e.cancelable) {
      e.preventDefault();
    }
    if (params.touchMoveStopPropagation && !params.nested) {
      e.stopPropagation();
    }
    let diff = swiper.isHorizontal() ? diffX : diffY;
    let touchesDiff = swiper.isHorizontal() ? touches.currentX - touches.previousX : touches.currentY - touches.previousY;
    if (params.oneWayMovement) {
      diff = Math.abs(diff) * (rtl ? 1 : -1);
      touchesDiff = Math.abs(touchesDiff) * (rtl ? 1 : -1);
    }
    touches.diff = diff;
    diff *= params.touchRatio;
    if (rtl) {
      diff = -diff;
      touchesDiff = -touchesDiff;
    }
    const prevTouchesDirection = swiper.touchesDirection;
    swiper.swipeDirection = diff > 0 ? "prev" : "next";
    swiper.touchesDirection = touchesDiff > 0 ? "prev" : "next";
    const isLoop = swiper.params.loop && !params.cssMode;
    const allowLoopFix = swiper.touchesDirection === "next" && swiper.allowSlideNext || swiper.touchesDirection === "prev" && swiper.allowSlidePrev;
    if (!data.isMoved) {
      if (isLoop && allowLoopFix) {
        swiper.loopFix({
          direction: swiper.swipeDirection
        });
      }
      data.startTranslate = swiper.getTranslate();
      swiper.setTransition(0);
      if (swiper.animating) {
        const evt = new window.CustomEvent("transitionend", {
          bubbles: true,
          cancelable: true,
          detail: {
            bySwiperTouchMove: true
          }
        });
        swiper.wrapperEl.dispatchEvent(evt);
      }
      data.allowMomentumBounce = false;
      if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
        swiper.setGrabCursor(true);
      }
      swiper.emit("sliderFirstMove", e);
    }
    let loopFixed;
    (/* @__PURE__ */ new Date()).getTime();
    if (data.isMoved && data.allowThresholdMove && prevTouchesDirection !== swiper.touchesDirection && isLoop && allowLoopFix && Math.abs(diff) >= 1) {
      Object.assign(touches, {
        startX: pageX,
        startY: pageY,
        currentX: pageX,
        currentY: pageY,
        startTranslate: data.currentTranslate
      });
      data.loopSwapReset = true;
      data.startTranslate = data.currentTranslate;
      return;
    }
    swiper.emit("sliderMove", e);
    data.isMoved = true;
    data.currentTranslate = diff + data.startTranslate;
    let disableParentSwiper = true;
    let resistanceRatio = params.resistanceRatio;
    if (params.touchReleaseOnEdges) {
      resistanceRatio = 0;
    }
    if (diff > 0) {
      if (isLoop && allowLoopFix && !loopFixed && data.allowThresholdMove && data.currentTranslate > (params.centeredSlides ? swiper.minTranslate() - swiper.slidesSizesGrid[swiper.activeIndex + 1] - (params.slidesPerView !== "auto" && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.activeIndex + 1] + swiper.params.spaceBetween : 0) - swiper.params.spaceBetween : swiper.minTranslate())) {
        swiper.loopFix({
          direction: "prev",
          setTranslate: true,
          activeSlideIndex: 0
        });
      }
      if (data.currentTranslate > swiper.minTranslate()) {
        disableParentSwiper = false;
        if (params.resistance) {
          data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
        }
      }
    } else if (diff < 0) {
      if (isLoop && allowLoopFix && !loopFixed && data.allowThresholdMove && data.currentTranslate < (params.centeredSlides ? swiper.maxTranslate() + swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween + (params.slidesPerView !== "auto" && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween : 0) : swiper.maxTranslate())) {
        swiper.loopFix({
          direction: "next",
          setTranslate: true,
          activeSlideIndex: swiper.slides.length - (params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10)))
        });
      }
      if (data.currentTranslate < swiper.maxTranslate()) {
        disableParentSwiper = false;
        if (params.resistance) {
          data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
        }
      }
    }
    if (disableParentSwiper) {
      e.preventedByNestedSwiper = true;
    }
    if (!swiper.allowSlideNext && swiper.swipeDirection === "next" && data.currentTranslate < data.startTranslate) {
      data.currentTranslate = data.startTranslate;
    }
    if (!swiper.allowSlidePrev && swiper.swipeDirection === "prev" && data.currentTranslate > data.startTranslate) {
      data.currentTranslate = data.startTranslate;
    }
    if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
      data.currentTranslate = data.startTranslate;
    }
    if (params.threshold > 0) {
      if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
        if (!data.allowThresholdMove) {
          data.allowThresholdMove = true;
          touches.startX = touches.currentX;
          touches.startY = touches.currentY;
          data.currentTranslate = data.startTranslate;
          touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
          return;
        }
      } else {
        data.currentTranslate = data.startTranslate;
        return;
      }
    }
    if (!params.followFinger || params.cssMode)
      return;
    if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    if (params.freeMode && params.freeMode.enabled && swiper.freeMode) {
      swiper.freeMode.onTouchMove();
    }
    swiper.updateProgress(data.currentTranslate);
    swiper.setTranslate(data.currentTranslate);
  }
  function onTouchEnd2(event2) {
    const swiper = this;
    const data = swiper.touchEventsData;
    let e = event2;
    if (e.originalEvent)
      e = e.originalEvent;
    let targetTouch;
    const isTouchEvent = e.type === "touchend" || e.type === "touchcancel";
    if (!isTouchEvent) {
      if (data.touchId !== null)
        return;
      if (e.pointerId !== data.pointerId)
        return;
      targetTouch = e;
    } else {
      targetTouch = [...e.changedTouches].filter((t) => t.identifier === data.touchId)[0];
      if (!targetTouch || targetTouch.identifier !== data.touchId)
        return;
    }
    if (["pointercancel", "pointerout", "pointerleave", "contextmenu"].includes(e.type)) {
      const proceed = ["pointercancel", "contextmenu"].includes(e.type) && (swiper.browser.isSafari || swiper.browser.isWebView);
      if (!proceed) {
        return;
      }
    }
    data.pointerId = null;
    data.touchId = null;
    const {
      params,
      touches,
      rtlTranslate: rtl,
      slidesGrid,
      enabled
    } = swiper;
    if (!enabled)
      return;
    if (!params.simulateTouch && e.pointerType === "mouse")
      return;
    if (data.allowTouchCallbacks) {
      swiper.emit("touchEnd", e);
    }
    data.allowTouchCallbacks = false;
    if (!data.isTouched) {
      if (data.isMoved && params.grabCursor) {
        swiper.setGrabCursor(false);
      }
      data.isMoved = false;
      data.startMoving = false;
      return;
    }
    if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
      swiper.setGrabCursor(false);
    }
    const touchEndTime = now2();
    const timeDiff = touchEndTime - data.touchStartTime;
    if (swiper.allowClick) {
      const pathTree = e.path || e.composedPath && e.composedPath();
      swiper.updateClickedSlide(pathTree && pathTree[0] || e.target, pathTree);
      swiper.emit("tap click", e);
      if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
        swiper.emit("doubleTap doubleClick", e);
      }
    }
    data.lastClickTime = now2();
    nextTick2(() => {
      if (!swiper.destroyed)
        swiper.allowClick = true;
    });
    if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 && !data.loopSwapReset || data.currentTranslate === data.startTranslate && !data.loopSwapReset) {
      data.isTouched = false;
      data.isMoved = false;
      data.startMoving = false;
      return;
    }
    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;
    let currentPos;
    if (params.followFinger) {
      currentPos = rtl ? swiper.translate : -swiper.translate;
    } else {
      currentPos = -data.currentTranslate;
    }
    if (params.cssMode) {
      return;
    }
    if (params.freeMode && params.freeMode.enabled) {
      swiper.freeMode.onTouchEnd({
        currentPos
      });
      return;
    }
    const swipeToLast = currentPos >= -swiper.maxTranslate() && !swiper.params.loop;
    let stopIndex = 0;
    let groupSize = swiper.slidesSizesGrid[0];
    for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
      const increment2 = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
      if (typeof slidesGrid[i + increment2] !== "undefined") {
        if (swipeToLast || currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment2]) {
          stopIndex = i;
          groupSize = slidesGrid[i + increment2] - slidesGrid[i];
        }
      } else if (swipeToLast || currentPos >= slidesGrid[i]) {
        stopIndex = i;
        groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
      }
    }
    let rewindFirstIndex = null;
    let rewindLastIndex = null;
    if (params.rewind) {
      if (swiper.isBeginning) {
        rewindLastIndex = params.virtual && params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
      } else if (swiper.isEnd) {
        rewindFirstIndex = 0;
      }
    }
    const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
    const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
    if (timeDiff > params.longSwipesMs) {
      if (!params.longSwipes) {
        swiper.slideTo(swiper.activeIndex);
        return;
      }
      if (swiper.swipeDirection === "next") {
        if (ratio >= params.longSwipesRatio)
          swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment);
        else
          swiper.slideTo(stopIndex);
      }
      if (swiper.swipeDirection === "prev") {
        if (ratio > 1 - params.longSwipesRatio) {
          swiper.slideTo(stopIndex + increment);
        } else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) {
          swiper.slideTo(rewindLastIndex);
        } else {
          swiper.slideTo(stopIndex);
        }
      }
    } else {
      if (!params.shortSwipes) {
        swiper.slideTo(swiper.activeIndex);
        return;
      }
      const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
      if (!isNavButtonTarget) {
        if (swiper.swipeDirection === "next") {
          swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
        }
        if (swiper.swipeDirection === "prev") {
          swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
        }
      } else if (e.target === swiper.navigation.nextEl) {
        swiper.slideTo(stopIndex + increment);
      } else {
        swiper.slideTo(stopIndex);
      }
    }
  }
  function onResize2() {
    const swiper = this;
    const {
      params,
      el
    } = swiper;
    if (el && el.offsetWidth === 0)
      return;
    if (params.breakpoints) {
      swiper.setBreakpoint();
    }
    const {
      allowSlideNext,
      allowSlidePrev,
      snapGrid
    } = swiper;
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    swiper.allowSlideNext = true;
    swiper.allowSlidePrev = true;
    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateSlidesClasses();
    const isVirtualLoop = isVirtual && params.loop;
    if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides && !isVirtualLoop) {
      swiper.slideTo(swiper.slides.length - 1, 0, false, true);
    } else {
      if (swiper.params.loop && !isVirtual) {
        swiper.slideToLoop(swiper.realIndex, 0, false, true);
      } else {
        swiper.slideTo(swiper.activeIndex, 0, false, true);
      }
    }
    if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
      clearTimeout(swiper.autoplay.resizeTimeout);
      swiper.autoplay.resizeTimeout = setTimeout(() => {
        if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
          swiper.autoplay.resume();
        }
      }, 500);
    }
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;
    if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }
  }
  function onClick2(e) {
    const swiper = this;
    if (!swiper.enabled)
      return;
    if (!swiper.allowClick) {
      if (swiper.params.preventClicks)
        e.preventDefault();
      if (swiper.params.preventClicksPropagation && swiper.animating) {
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }
  }
  function onScroll2() {
    const swiper = this;
    const {
      wrapperEl,
      rtlTranslate,
      enabled
    } = swiper;
    if (!enabled)
      return;
    swiper.previousTranslate = swiper.translate;
    if (swiper.isHorizontal()) {
      swiper.translate = -wrapperEl.scrollLeft;
    } else {
      swiper.translate = -wrapperEl.scrollTop;
    }
    if (swiper.translate === 0)
      swiper.translate = 0;
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
    let newProgress;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    if (translatesDiff === 0) {
      newProgress = 0;
    } else {
      newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
    }
    if (newProgress !== swiper.progress) {
      swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
    }
    swiper.emit("setTranslate", swiper.translate, false);
  }
  function onLoad2(e) {
    const swiper = this;
    processLazyPreloader2(swiper, e.target);
    if (swiper.params.cssMode || swiper.params.slidesPerView !== "auto" && !swiper.params.autoHeight) {
      return;
    }
    swiper.update();
  }
  function onDocumentTouchStart2() {
    const swiper = this;
    if (swiper.documentTouchHandlerProceeded)
      return;
    swiper.documentTouchHandlerProceeded = true;
    if (swiper.params.touchReleaseOnEdges) {
      swiper.el.style.touchAction = "auto";
    }
  }
  var events2 = (swiper, method) => {
    const document2 = getDocument2();
    const {
      params,
      el,
      wrapperEl,
      device
    } = swiper;
    const capture = !!params.nested;
    const domMethod = method === "on" ? "addEventListener" : "removeEventListener";
    const swiperMethod = method;
    if (!el || typeof el === "string")
      return;
    document2[domMethod]("touchstart", swiper.onDocumentTouchStart, {
      passive: false,
      capture
    });
    el[domMethod]("touchstart", swiper.onTouchStart, {
      passive: false
    });
    el[domMethod]("pointerdown", swiper.onTouchStart, {
      passive: false
    });
    document2[domMethod]("touchmove", swiper.onTouchMove, {
      passive: false,
      capture
    });
    document2[domMethod]("pointermove", swiper.onTouchMove, {
      passive: false,
      capture
    });
    document2[domMethod]("touchend", swiper.onTouchEnd, {
      passive: true
    });
    document2[domMethod]("pointerup", swiper.onTouchEnd, {
      passive: true
    });
    document2[domMethod]("pointercancel", swiper.onTouchEnd, {
      passive: true
    });
    document2[domMethod]("touchcancel", swiper.onTouchEnd, {
      passive: true
    });
    document2[domMethod]("pointerout", swiper.onTouchEnd, {
      passive: true
    });
    document2[domMethod]("pointerleave", swiper.onTouchEnd, {
      passive: true
    });
    document2[domMethod]("contextmenu", swiper.onTouchEnd, {
      passive: true
    });
    if (params.preventClicks || params.preventClicksPropagation) {
      el[domMethod]("click", swiper.onClick, true);
    }
    if (params.cssMode) {
      wrapperEl[domMethod]("scroll", swiper.onScroll);
    }
    if (params.updateOnWindowResize) {
      swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize2, true);
    } else {
      swiper[swiperMethod]("observerUpdate", onResize2, true);
    }
    el[domMethod]("load", swiper.onLoad, {
      capture: true
    });
  };
  function attachEvents2() {
    const swiper = this;
    const {
      params
    } = swiper;
    swiper.onTouchStart = onTouchStart2.bind(swiper);
    swiper.onTouchMove = onTouchMove2.bind(swiper);
    swiper.onTouchEnd = onTouchEnd2.bind(swiper);
    swiper.onDocumentTouchStart = onDocumentTouchStart2.bind(swiper);
    if (params.cssMode) {
      swiper.onScroll = onScroll2.bind(swiper);
    }
    swiper.onClick = onClick2.bind(swiper);
    swiper.onLoad = onLoad2.bind(swiper);
    events2(swiper, "on");
  }
  function detachEvents2() {
    const swiper = this;
    events2(swiper, "off");
  }
  var events$12 = {
    attachEvents: attachEvents2,
    detachEvents: detachEvents2
  };
  var isGridEnabled2 = (swiper, params) => {
    return swiper.grid && params.grid && params.grid.rows > 1;
  };
  function setBreakpoint2() {
    const swiper = this;
    const {
      realIndex,
      initialized,
      params,
      el
    } = swiper;
    const breakpoints22 = params.breakpoints;
    if (!breakpoints22 || breakpoints22 && Object.keys(breakpoints22).length === 0)
      return;
    const breakpoint = swiper.getBreakpoint(breakpoints22, swiper.params.breakpointsBase, swiper.el);
    if (!breakpoint || swiper.currentBreakpoint === breakpoint)
      return;
    const breakpointOnlyParams = breakpoint in breakpoints22 ? breakpoints22[breakpoint] : void 0;
    const breakpointParams = breakpointOnlyParams || swiper.originalParams;
    const wasMultiRow = isGridEnabled2(swiper, params);
    const isMultiRow = isGridEnabled2(swiper, breakpointParams);
    const wasGrabCursor = swiper.params.grabCursor;
    const isGrabCursor = breakpointParams.grabCursor;
    const wasEnabled = params.enabled;
    if (wasMultiRow && !isMultiRow) {
      el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
      swiper.emitContainerClasses();
    } else if (!wasMultiRow && isMultiRow) {
      el.classList.add(`${params.containerModifierClass}grid`);
      if (breakpointParams.grid.fill && breakpointParams.grid.fill === "column" || !breakpointParams.grid.fill && params.grid.fill === "column") {
        el.classList.add(`${params.containerModifierClass}grid-column`);
      }
      swiper.emitContainerClasses();
    }
    if (wasGrabCursor && !isGrabCursor) {
      swiper.unsetGrabCursor();
    } else if (!wasGrabCursor && isGrabCursor) {
      swiper.setGrabCursor();
    }
    ["navigation", "pagination", "scrollbar"].forEach((prop) => {
      if (typeof breakpointParams[prop] === "undefined")
        return;
      const wasModuleEnabled = params[prop] && params[prop].enabled;
      const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
      if (wasModuleEnabled && !isModuleEnabled) {
        swiper[prop].disable();
      }
      if (!wasModuleEnabled && isModuleEnabled) {
        swiper[prop].enable();
      }
    });
    const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
    const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
    const wasLoop = params.loop;
    if (directionChanged && initialized) {
      swiper.changeDirection();
    }
    extend22(swiper.params, breakpointParams);
    const isEnabled2 = swiper.params.enabled;
    const hasLoop = swiper.params.loop;
    Object.assign(swiper, {
      allowTouchMove: swiper.params.allowTouchMove,
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev
    });
    if (wasEnabled && !isEnabled2) {
      swiper.disable();
    } else if (!wasEnabled && isEnabled2) {
      swiper.enable();
    }
    swiper.currentBreakpoint = breakpoint;
    swiper.emit("_beforeBreakpoint", breakpointParams);
    if (initialized) {
      if (needsReLoop) {
        swiper.loopDestroy();
        swiper.loopCreate(realIndex);
        swiper.updateSlides();
      } else if (!wasLoop && hasLoop) {
        swiper.loopCreate(realIndex);
        swiper.updateSlides();
      } else if (wasLoop && !hasLoop) {
        swiper.loopDestroy();
      }
    }
    swiper.emit("breakpoint", breakpointParams);
  }
  function getBreakpoint2(breakpoints22, base, containerEl) {
    if (base === void 0) {
      base = "window";
    }
    if (!breakpoints22 || base === "container" && !containerEl)
      return void 0;
    let breakpoint = false;
    const window2 = getWindow2();
    const currentHeight = base === "window" ? window2.innerHeight : containerEl.clientHeight;
    const points = Object.keys(breakpoints22).map((point) => {
      if (typeof point === "string" && point.indexOf("@") === 0) {
        const minRatio = parseFloat(point.substr(1));
        const value = currentHeight * minRatio;
        return {
          value,
          point
        };
      }
      return {
        value: point,
        point
      };
    });
    points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
    for (let i = 0; i < points.length; i += 1) {
      const {
        point,
        value
      } = points[i];
      if (base === "window") {
        if (window2.matchMedia(`(min-width: ${value}px)`).matches) {
          breakpoint = point;
        }
      } else if (value <= containerEl.clientWidth) {
        breakpoint = point;
      }
    }
    return breakpoint || "max";
  }
  var breakpoints2 = {
    setBreakpoint: setBreakpoint2,
    getBreakpoint: getBreakpoint2
  };
  function prepareClasses2(entries, prefix) {
    const resultClasses = [];
    entries.forEach((item) => {
      if (typeof item === "object") {
        Object.keys(item).forEach((classNames) => {
          if (item[classNames]) {
            resultClasses.push(prefix + classNames);
          }
        });
      } else if (typeof item === "string") {
        resultClasses.push(prefix + item);
      }
    });
    return resultClasses;
  }
  function addClasses2() {
    const swiper = this;
    const {
      classNames,
      params,
      rtl,
      el,
      device
    } = swiper;
    const suffixes = prepareClasses2(["initialized", params.direction, {
      "free-mode": swiper.params.freeMode && params.freeMode.enabled
    }, {
      "autoheight": params.autoHeight
    }, {
      "rtl": rtl
    }, {
      "grid": params.grid && params.grid.rows > 1
    }, {
      "grid-column": params.grid && params.grid.rows > 1 && params.grid.fill === "column"
    }, {
      "android": device.android
    }, {
      "ios": device.ios
    }, {
      "css-mode": params.cssMode
    }, {
      "centered": params.cssMode && params.centeredSlides
    }, {
      "watch-progress": params.watchSlidesProgress
    }], params.containerModifierClass);
    classNames.push(...suffixes);
    el.classList.add(...classNames);
    swiper.emitContainerClasses();
  }
  function removeClasses2() {
    const swiper = this;
    const {
      el,
      classNames
    } = swiper;
    if (!el || typeof el === "string")
      return;
    el.classList.remove(...classNames);
    swiper.emitContainerClasses();
  }
  var classes2 = {
    addClasses: addClasses2,
    removeClasses: removeClasses2
  };
  function checkOverflow2() {
    const swiper = this;
    const {
      isLocked: wasLocked,
      params
    } = swiper;
    const {
      slidesOffsetBefore
    } = params;
    if (slidesOffsetBefore) {
      const lastSlideIndex = swiper.slides.length - 1;
      const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
      swiper.isLocked = swiper.size > lastSlideRightEdge;
    } else {
      swiper.isLocked = swiper.snapGrid.length === 1;
    }
    if (params.allowSlideNext === true) {
      swiper.allowSlideNext = !swiper.isLocked;
    }
    if (params.allowSlidePrev === true) {
      swiper.allowSlidePrev = !swiper.isLocked;
    }
    if (wasLocked && wasLocked !== swiper.isLocked) {
      swiper.isEnd = false;
    }
    if (wasLocked !== swiper.isLocked) {
      swiper.emit(swiper.isLocked ? "lock" : "unlock");
    }
  }
  var checkOverflow$12 = {
    checkOverflow: checkOverflow2
  };
  var defaults2 = {
    init: true,
    direction: "horizontal",
    oneWayMovement: false,
    swiperElementNodeName: "SWIPER-CONTAINER",
    touchEventsTarget: "wrapper",
    initialSlide: 0,
    speed: 300,
    cssMode: false,
    updateOnWindowResize: true,
    resizeObserver: true,
    nested: false,
    createElements: false,
    eventsPrefix: "swiper",
    enabled: true,
    focusableElements: "input, select, option, textarea, button, video, label",
    // Overrides
    width: null,
    height: null,
    //
    preventInteractionOnTransition: false,
    // ssr
    userAgent: null,
    url: null,
    // To support iOS's swipe-to-go-back gesture (when being used in-app).
    edgeSwipeDetection: false,
    edgeSwipeThreshold: 20,
    // Autoheight
    autoHeight: false,
    // Set wrapper width
    setWrapperSize: false,
    // Virtual Translate
    virtualTranslate: false,
    // Effects
    effect: "slide",
    // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
    // Breakpoints
    breakpoints: void 0,
    breakpointsBase: "window",
    // Slides grid
    spaceBetween: 0,
    slidesPerView: 1,
    slidesPerGroup: 1,
    slidesPerGroupSkip: 0,
    slidesPerGroupAuto: false,
    centeredSlides: false,
    centeredSlidesBounds: false,
    slidesOffsetBefore: 0,
    // in px
    slidesOffsetAfter: 0,
    // in px
    normalizeSlideIndex: true,
    centerInsufficientSlides: false,
    // Disable swiper and hide navigation when container not overflow
    watchOverflow: true,
    // Round length
    roundLengths: false,
    // Touches
    touchRatio: 1,
    touchAngle: 45,
    simulateTouch: true,
    shortSwipes: true,
    longSwipes: true,
    longSwipesRatio: 0.5,
    longSwipesMs: 300,
    followFinger: true,
    allowTouchMove: true,
    threshold: 5,
    touchMoveStopPropagation: false,
    touchStartPreventDefault: true,
    touchStartForcePreventDefault: false,
    touchReleaseOnEdges: false,
    // Unique Navigation Elements
    uniqueNavElements: true,
    // Resistance
    resistance: true,
    resistanceRatio: 0.85,
    // Progress
    watchSlidesProgress: false,
    // Cursor
    grabCursor: false,
    // Clicks
    preventClicks: true,
    preventClicksPropagation: true,
    slideToClickedSlide: false,
    // loop
    loop: false,
    loopAddBlankSlides: true,
    loopAdditionalSlides: 0,
    loopPreventsSliding: true,
    // rewind
    rewind: false,
    // Swiping/no swiping
    allowSlidePrev: true,
    allowSlideNext: true,
    swipeHandler: null,
    // '.swipe-handler',
    noSwiping: true,
    noSwipingClass: "swiper-no-swiping",
    noSwipingSelector: null,
    // Passive Listeners
    passiveListeners: true,
    maxBackfaceHiddenSlides: 10,
    // NS
    containerModifierClass: "swiper-",
    // NEW
    slideClass: "swiper-slide",
    slideBlankClass: "swiper-slide-blank",
    slideActiveClass: "swiper-slide-active",
    slideVisibleClass: "swiper-slide-visible",
    slideFullyVisibleClass: "swiper-slide-fully-visible",
    slideNextClass: "swiper-slide-next",
    slidePrevClass: "swiper-slide-prev",
    wrapperClass: "swiper-wrapper",
    lazyPreloaderClass: "swiper-lazy-preloader",
    lazyPreloadPrevNext: 0,
    // Callbacks
    runCallbacksOnInit: true,
    // Internals
    _emitClasses: false
  };
  function moduleExtendParams2(params, allModulesParams) {
    return function extendParams(obj) {
      if (obj === void 0) {
        obj = {};
      }
      const moduleParamName = Object.keys(obj)[0];
      const moduleParams = obj[moduleParamName];
      if (typeof moduleParams !== "object" || moduleParams === null) {
        extend22(allModulesParams, obj);
        return;
      }
      if (params[moduleParamName] === true) {
        params[moduleParamName] = {
          enabled: true
        };
      }
      if (moduleParamName === "navigation" && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].prevEl && !params[moduleParamName].nextEl) {
        params[moduleParamName].auto = true;
      }
      if (["pagination", "scrollbar"].indexOf(moduleParamName) >= 0 && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].el) {
        params[moduleParamName].auto = true;
      }
      if (!(moduleParamName in params && "enabled" in moduleParams)) {
        extend22(allModulesParams, obj);
        return;
      }
      if (typeof params[moduleParamName] === "object" && !("enabled" in params[moduleParamName])) {
        params[moduleParamName].enabled = true;
      }
      if (!params[moduleParamName])
        params[moduleParamName] = {
          enabled: false
        };
      extend22(allModulesParams, obj);
    };
  }
  var prototypes2 = {
    eventsEmitter: eventsEmitter2,
    update: update2,
    translate: translate2,
    transition: transition2,
    slide: slide2,
    loop: loop2,
    grabCursor: grabCursor2,
    events: events$12,
    breakpoints: breakpoints2,
    checkOverflow: checkOverflow$12,
    classes: classes2
  };
  var extendedDefaults2 = {};
  var Swiper2 = class _Swiper {
    constructor() {
      let el;
      let params;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === "Object") {
        params = args[0];
      } else {
        [el, params] = args;
      }
      if (!params)
        params = {};
      params = extend22({}, params);
      if (el && !params.el)
        params.el = el;
      const document2 = getDocument2();
      if (params.el && typeof params.el === "string" && document2.querySelectorAll(params.el).length > 1) {
        const swipers = [];
        document2.querySelectorAll(params.el).forEach((containerEl) => {
          const newParams = extend22({}, params, {
            el: containerEl
          });
          swipers.push(new _Swiper(newParams));
        });
        return swipers;
      }
      const swiper = this;
      swiper.__swiper__ = true;
      swiper.support = getSupport2();
      swiper.device = getDevice2({
        userAgent: params.userAgent
      });
      swiper.browser = getBrowser2();
      swiper.eventsListeners = {};
      swiper.eventsAnyListeners = [];
      swiper.modules = [...swiper.__modules__];
      if (params.modules && Array.isArray(params.modules)) {
        swiper.modules.push(...params.modules);
      }
      const allModulesParams = {};
      swiper.modules.forEach((mod) => {
        mod({
          params,
          swiper,
          extendParams: moduleExtendParams2(params, allModulesParams),
          on: swiper.on.bind(swiper),
          once: swiper.once.bind(swiper),
          off: swiper.off.bind(swiper),
          emit: swiper.emit.bind(swiper)
        });
      });
      const swiperParams = extend22({}, defaults2, allModulesParams);
      swiper.params = extend22({}, swiperParams, extendedDefaults2, params);
      swiper.originalParams = extend22({}, swiper.params);
      swiper.passedParams = extend22({}, params);
      if (swiper.params && swiper.params.on) {
        Object.keys(swiper.params.on).forEach((eventName) => {
          swiper.on(eventName, swiper.params.on[eventName]);
        });
      }
      if (swiper.params && swiper.params.onAny) {
        swiper.onAny(swiper.params.onAny);
      }
      Object.assign(swiper, {
        enabled: swiper.params.enabled,
        el,
        // Classes
        classNames: [],
        // Slides
        slides: [],
        slidesGrid: [],
        snapGrid: [],
        slidesSizesGrid: [],
        // isDirection
        isHorizontal() {
          return swiper.params.direction === "horizontal";
        },
        isVertical() {
          return swiper.params.direction === "vertical";
        },
        // Indexes
        activeIndex: 0,
        realIndex: 0,
        //
        isBeginning: true,
        isEnd: false,
        // Props
        translate: 0,
        previousTranslate: 0,
        progress: 0,
        velocity: 0,
        animating: false,
        cssOverflowAdjustment() {
          return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
        },
        // Locks
        allowSlideNext: swiper.params.allowSlideNext,
        allowSlidePrev: swiper.params.allowSlidePrev,
        // Touch Events
        touchEventsData: {
          isTouched: void 0,
          isMoved: void 0,
          allowTouchCallbacks: void 0,
          touchStartTime: void 0,
          isScrolling: void 0,
          currentTranslate: void 0,
          startTranslate: void 0,
          allowThresholdMove: void 0,
          // Form elements to match
          focusableElements: swiper.params.focusableElements,
          // Last click time
          lastClickTime: 0,
          clickTimeout: void 0,
          // Velocities
          velocities: [],
          allowMomentumBounce: void 0,
          startMoving: void 0,
          pointerId: null,
          touchId: null
        },
        // Clicks
        allowClick: true,
        // Touches
        allowTouchMove: swiper.params.allowTouchMove,
        touches: {
          startX: 0,
          startY: 0,
          currentX: 0,
          currentY: 0,
          diff: 0
        },
        // Images
        imagesToLoad: [],
        imagesLoaded: 0
      });
      swiper.emit("_swiper");
      if (swiper.params.init) {
        swiper.init();
      }
      return swiper;
    }
    getDirectionLabel(property) {
      if (this.isHorizontal()) {
        return property;
      }
      return {
        "width": "height",
        "margin-top": "margin-left",
        "margin-bottom ": "margin-right",
        "margin-left": "margin-top",
        "margin-right": "margin-bottom",
        "padding-left": "padding-top",
        "padding-right": "padding-bottom",
        "marginRight": "marginBottom"
      }[property];
    }
    getSlideIndex(slideEl) {
      const {
        slidesEl,
        params
      } = this;
      const slides = elementChildren2(slidesEl, `.${params.slideClass}, swiper-slide`);
      const firstSlideIndex = elementIndex2(slides[0]);
      return elementIndex2(slideEl) - firstSlideIndex;
    }
    getSlideIndexByData(index) {
      return this.getSlideIndex(this.slides.filter((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === index)[0]);
    }
    recalcSlides() {
      const swiper = this;
      const {
        slidesEl,
        params
      } = swiper;
      swiper.slides = elementChildren2(slidesEl, `.${params.slideClass}, swiper-slide`);
    }
    enable() {
      const swiper = this;
      if (swiper.enabled)
        return;
      swiper.enabled = true;
      if (swiper.params.grabCursor) {
        swiper.setGrabCursor();
      }
      swiper.emit("enable");
    }
    disable() {
      const swiper = this;
      if (!swiper.enabled)
        return;
      swiper.enabled = false;
      if (swiper.params.grabCursor) {
        swiper.unsetGrabCursor();
      }
      swiper.emit("disable");
    }
    setProgress(progress, speed) {
      const swiper = this;
      progress = Math.min(Math.max(progress, 0), 1);
      const min = swiper.minTranslate();
      const max = swiper.maxTranslate();
      const current = (max - min) * progress + min;
      swiper.translateTo(current, typeof speed === "undefined" ? 0 : speed);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    emitContainerClasses() {
      const swiper = this;
      if (!swiper.params._emitClasses || !swiper.el)
        return;
      const cls = swiper.el.className.split(" ").filter((className) => {
        return className.indexOf("swiper") === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
      });
      swiper.emit("_containerClasses", cls.join(" "));
    }
    getSlideClasses(slideEl) {
      const swiper = this;
      if (swiper.destroyed)
        return "";
      return slideEl.className.split(" ").filter((className) => {
        return className.indexOf("swiper-slide") === 0 || className.indexOf(swiper.params.slideClass) === 0;
      }).join(" ");
    }
    emitSlidesClasses() {
      const swiper = this;
      if (!swiper.params._emitClasses || !swiper.el)
        return;
      const updates = [];
      swiper.slides.forEach((slideEl) => {
        const classNames = swiper.getSlideClasses(slideEl);
        updates.push({
          slideEl,
          classNames
        });
        swiper.emit("_slideClass", slideEl, classNames);
      });
      swiper.emit("_slideClasses", updates);
    }
    slidesPerViewDynamic(view, exact) {
      if (view === void 0) {
        view = "current";
      }
      if (exact === void 0) {
        exact = false;
      }
      const swiper = this;
      const {
        params,
        slides,
        slidesGrid,
        slidesSizesGrid,
        size: swiperSize,
        activeIndex
      } = swiper;
      let spv = 1;
      if (typeof params.slidesPerView === "number")
        return params.slidesPerView;
      if (params.centeredSlides) {
        let slideSize = slides[activeIndex] ? Math.ceil(slides[activeIndex].swiperSlideSize) : 0;
        let breakLoop;
        for (let i = activeIndex + 1; i < slides.length; i += 1) {
          if (slides[i] && !breakLoop) {
            slideSize += Math.ceil(slides[i].swiperSlideSize);
            spv += 1;
            if (slideSize > swiperSize)
              breakLoop = true;
          }
        }
        for (let i = activeIndex - 1; i >= 0; i -= 1) {
          if (slides[i] && !breakLoop) {
            slideSize += slides[i].swiperSlideSize;
            spv += 1;
            if (slideSize > swiperSize)
              breakLoop = true;
          }
        }
      } else {
        if (view === "current") {
          for (let i = activeIndex + 1; i < slides.length; i += 1) {
            const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
            if (slideInView) {
              spv += 1;
            }
          }
        } else {
          for (let i = activeIndex - 1; i >= 0; i -= 1) {
            const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
            if (slideInView) {
              spv += 1;
            }
          }
        }
      }
      return spv;
    }
    update() {
      const swiper = this;
      if (!swiper || swiper.destroyed)
        return;
      const {
        snapGrid,
        params
      } = swiper;
      if (params.breakpoints) {
        swiper.setBreakpoint();
      }
      [...swiper.el.querySelectorAll('[loading="lazy"]')].forEach((imageEl) => {
        if (imageEl.complete) {
          processLazyPreloader2(swiper, imageEl);
        }
      });
      swiper.updateSize();
      swiper.updateSlides();
      swiper.updateProgress();
      swiper.updateSlidesClasses();
      function setTranslate22() {
        const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
        const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
        swiper.setTranslate(newTranslate);
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }
      let translated;
      if (params.freeMode && params.freeMode.enabled && !params.cssMode) {
        setTranslate22();
        if (params.autoHeight) {
          swiper.updateAutoHeight();
        }
      } else {
        if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !params.centeredSlides) {
          const slides = swiper.virtual && params.virtual.enabled ? swiper.virtual.slides : swiper.slides;
          translated = swiper.slideTo(slides.length - 1, 0, false, true);
        } else {
          translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
        }
        if (!translated) {
          setTranslate22();
        }
      }
      if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
        swiper.checkOverflow();
      }
      swiper.emit("update");
    }
    changeDirection(newDirection, needUpdate) {
      if (needUpdate === void 0) {
        needUpdate = true;
      }
      const swiper = this;
      const currentDirection = swiper.params.direction;
      if (!newDirection) {
        newDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";
      }
      if (newDirection === currentDirection || newDirection !== "horizontal" && newDirection !== "vertical") {
        return swiper;
      }
      swiper.el.classList.remove(`${swiper.params.containerModifierClass}${currentDirection}`);
      swiper.el.classList.add(`${swiper.params.containerModifierClass}${newDirection}`);
      swiper.emitContainerClasses();
      swiper.params.direction = newDirection;
      swiper.slides.forEach((slideEl) => {
        if (newDirection === "vertical") {
          slideEl.style.width = "";
        } else {
          slideEl.style.height = "";
        }
      });
      swiper.emit("changeDirection");
      if (needUpdate)
        swiper.update();
      return swiper;
    }
    changeLanguageDirection(direction) {
      const swiper = this;
      if (swiper.rtl && direction === "rtl" || !swiper.rtl && direction === "ltr")
        return;
      swiper.rtl = direction === "rtl";
      swiper.rtlTranslate = swiper.params.direction === "horizontal" && swiper.rtl;
      if (swiper.rtl) {
        swiper.el.classList.add(`${swiper.params.containerModifierClass}rtl`);
        swiper.el.dir = "rtl";
      } else {
        swiper.el.classList.remove(`${swiper.params.containerModifierClass}rtl`);
        swiper.el.dir = "ltr";
      }
      swiper.update();
    }
    mount(element) {
      const swiper = this;
      if (swiper.mounted)
        return true;
      let el = element || swiper.params.el;
      if (typeof el === "string") {
        el = document.querySelector(el);
      }
      if (!el) {
        return false;
      }
      el.swiper = swiper;
      if (el.parentNode && el.parentNode.host && el.parentNode.host.nodeName === swiper.params.swiperElementNodeName.toUpperCase()) {
        swiper.isElement = true;
      }
      const getWrapperSelector = () => {
        return `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
      };
      const getWrapper = () => {
        if (el && el.shadowRoot && el.shadowRoot.querySelector) {
          const res = el.shadowRoot.querySelector(getWrapperSelector());
          return res;
        }
        return elementChildren2(el, getWrapperSelector())[0];
      };
      let wrapperEl = getWrapper();
      if (!wrapperEl && swiper.params.createElements) {
        wrapperEl = createElement3("div", swiper.params.wrapperClass);
        el.append(wrapperEl);
        elementChildren2(el, `.${swiper.params.slideClass}`).forEach((slideEl) => {
          wrapperEl.append(slideEl);
        });
      }
      Object.assign(swiper, {
        el,
        wrapperEl,
        slidesEl: swiper.isElement && !el.parentNode.host.slideSlots ? el.parentNode.host : wrapperEl,
        hostEl: swiper.isElement ? el.parentNode.host : el,
        mounted: true,
        // RTL
        rtl: el.dir.toLowerCase() === "rtl" || elementStyle2(el, "direction") === "rtl",
        rtlTranslate: swiper.params.direction === "horizontal" && (el.dir.toLowerCase() === "rtl" || elementStyle2(el, "direction") === "rtl"),
        wrongRTL: elementStyle2(wrapperEl, "display") === "-webkit-box"
      });
      return true;
    }
    init(el) {
      const swiper = this;
      if (swiper.initialized)
        return swiper;
      const mounted = swiper.mount(el);
      if (mounted === false)
        return swiper;
      swiper.emit("beforeInit");
      if (swiper.params.breakpoints) {
        swiper.setBreakpoint();
      }
      swiper.addClasses();
      swiper.updateSize();
      swiper.updateSlides();
      if (swiper.params.watchOverflow) {
        swiper.checkOverflow();
      }
      if (swiper.params.grabCursor && swiper.enabled) {
        swiper.setGrabCursor();
      }
      if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
        swiper.slideTo(swiper.params.initialSlide + swiper.virtual.slidesBefore, 0, swiper.params.runCallbacksOnInit, false, true);
      } else {
        swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
      }
      if (swiper.params.loop) {
        swiper.loopCreate();
      }
      swiper.attachEvents();
      const lazyElements = [...swiper.el.querySelectorAll('[loading="lazy"]')];
      if (swiper.isElement) {
        lazyElements.push(...swiper.hostEl.querySelectorAll('[loading="lazy"]'));
      }
      lazyElements.forEach((imageEl) => {
        if (imageEl.complete) {
          processLazyPreloader2(swiper, imageEl);
        } else {
          imageEl.addEventListener("load", (e) => {
            processLazyPreloader2(swiper, e.target);
          });
        }
      });
      preload2(swiper);
      swiper.initialized = true;
      preload2(swiper);
      swiper.emit("init");
      swiper.emit("afterInit");
      return swiper;
    }
    destroy(deleteInstance, cleanStyles) {
      if (deleteInstance === void 0) {
        deleteInstance = true;
      }
      if (cleanStyles === void 0) {
        cleanStyles = true;
      }
      const swiper = this;
      const {
        params,
        el,
        wrapperEl,
        slides
      } = swiper;
      if (typeof swiper.params === "undefined" || swiper.destroyed) {
        return null;
      }
      swiper.emit("beforeDestroy");
      swiper.initialized = false;
      swiper.detachEvents();
      if (params.loop) {
        swiper.loopDestroy();
      }
      if (cleanStyles) {
        swiper.removeClasses();
        if (el && typeof el !== "string") {
          el.removeAttribute("style");
        }
        if (wrapperEl) {
          wrapperEl.removeAttribute("style");
        }
        if (slides && slides.length) {
          slides.forEach((slideEl) => {
            slideEl.classList.remove(params.slideVisibleClass, params.slideFullyVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
            slideEl.removeAttribute("style");
            slideEl.removeAttribute("data-swiper-slide-index");
          });
        }
      }
      swiper.emit("destroy");
      Object.keys(swiper.eventsListeners).forEach((eventName) => {
        swiper.off(eventName);
      });
      if (deleteInstance !== false) {
        if (swiper.el && typeof swiper.el !== "string") {
          swiper.el.swiper = null;
        }
        deleteProps2(swiper);
      }
      swiper.destroyed = true;
      return null;
    }
    static extendDefaults(newDefaults) {
      extend22(extendedDefaults2, newDefaults);
    }
    static get extendedDefaults() {
      return extendedDefaults2;
    }
    static get defaults() {
      return defaults2;
    }
    static installModule(mod) {
      if (!_Swiper.prototype.__modules__)
        _Swiper.prototype.__modules__ = [];
      const modules = _Swiper.prototype.__modules__;
      if (typeof mod === "function" && modules.indexOf(mod) < 0) {
        modules.push(mod);
      }
    }
    static use(module) {
      if (Array.isArray(module)) {
        module.forEach((m) => _Swiper.installModule(m));
        return _Swiper;
      }
      _Swiper.installModule(module);
      return _Swiper;
    }
  };
  Object.keys(prototypes2).forEach((prototypeGroup) => {
    Object.keys(prototypes2[prototypeGroup]).forEach((protoMethod) => {
      Swiper2.prototype[protoMethod] = prototypes2[prototypeGroup][protoMethod];
    });
  });
  Swiper2.use([Resize2, Observer2]);
  function Keyboard2(_ref) {
    let {
      swiper,
      extendParams,
      on,
      emit
    } = _ref;
    const document2 = getDocument2();
    const window2 = getWindow2();
    swiper.keyboard = {
      enabled: false
    };
    extendParams({
      keyboard: {
        enabled: false,
        onlyInViewport: true,
        pageUpDown: true
      }
    });
    function handle(event2) {
      if (!swiper.enabled)
        return;
      const {
        rtlTranslate: rtl
      } = swiper;
      let e = event2;
      if (e.originalEvent)
        e = e.originalEvent;
      const kc = e.keyCode || e.charCode;
      const pageUpDown = swiper.params.keyboard.pageUpDown;
      const isPageUp = pageUpDown && kc === 33;
      const isPageDown = pageUpDown && kc === 34;
      const isArrowLeft = kc === 37;
      const isArrowRight = kc === 39;
      const isArrowUp = kc === 38;
      const isArrowDown = kc === 40;
      if (!swiper.allowSlideNext && (swiper.isHorizontal() && isArrowRight || swiper.isVertical() && isArrowDown || isPageDown)) {
        return false;
      }
      if (!swiper.allowSlidePrev && (swiper.isHorizontal() && isArrowLeft || swiper.isVertical() && isArrowUp || isPageUp)) {
        return false;
      }
      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
        return void 0;
      }
      if (document2.activeElement && document2.activeElement.nodeName && (document2.activeElement.nodeName.toLowerCase() === "input" || document2.activeElement.nodeName.toLowerCase() === "textarea")) {
        return void 0;
      }
      if (swiper.params.keyboard.onlyInViewport && (isPageUp || isPageDown || isArrowLeft || isArrowRight || isArrowUp || isArrowDown)) {
        let inView = false;
        if (elementParents2(swiper.el, `.${swiper.params.slideClass}, swiper-slide`).length > 0 && elementParents2(swiper.el, `.${swiper.params.slideActiveClass}`).length === 0) {
          return void 0;
        }
        const el = swiper.el;
        const swiperWidth = el.clientWidth;
        const swiperHeight = el.clientHeight;
        const windowWidth = window2.innerWidth;
        const windowHeight = window2.innerHeight;
        const swiperOffset = elementOffset2(el);
        if (rtl)
          swiperOffset.left -= el.scrollLeft;
        const swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiperWidth, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiperHeight], [swiperOffset.left + swiperWidth, swiperOffset.top + swiperHeight]];
        for (let i = 0; i < swiperCoord.length; i += 1) {
          const point = swiperCoord[i];
          if (point[0] >= 0 && point[0] <= windowWidth && point[1] >= 0 && point[1] <= windowHeight) {
            if (point[0] === 0 && point[1] === 0)
              continue;
            inView = true;
          }
        }
        if (!inView)
          return void 0;
      }
      if (swiper.isHorizontal()) {
        if (isPageUp || isPageDown || isArrowLeft || isArrowRight) {
          if (e.preventDefault)
            e.preventDefault();
          else
            e.returnValue = false;
        }
        if ((isPageDown || isArrowRight) && !rtl || (isPageUp || isArrowLeft) && rtl)
          swiper.slideNext();
        if ((isPageUp || isArrowLeft) && !rtl || (isPageDown || isArrowRight) && rtl)
          swiper.slidePrev();
      } else {
        if (isPageUp || isPageDown || isArrowUp || isArrowDown) {
          if (e.preventDefault)
            e.preventDefault();
          else
            e.returnValue = false;
        }
        if (isPageDown || isArrowDown)
          swiper.slideNext();
        if (isPageUp || isArrowUp)
          swiper.slidePrev();
      }
      emit("keyPress", kc);
      return void 0;
    }
    function enable() {
      if (swiper.keyboard.enabled)
        return;
      document2.addEventListener("keydown", handle);
      swiper.keyboard.enabled = true;
    }
    function disable() {
      if (!swiper.keyboard.enabled)
        return;
      document2.removeEventListener("keydown", handle);
      swiper.keyboard.enabled = false;
    }
    on("init", () => {
      if (swiper.params.keyboard.enabled) {
        enable();
      }
    });
    on("destroy", () => {
      if (swiper.keyboard.enabled) {
        disable();
      }
    });
    Object.assign(swiper.keyboard, {
      enable,
      disable
    });
  }
  function Mousewheel2(_ref) {
    let {
      swiper,
      extendParams,
      on,
      emit
    } = _ref;
    const window2 = getWindow2();
    extendParams({
      mousewheel: {
        enabled: false,
        releaseOnEdges: false,
        invert: false,
        forceToAxis: false,
        sensitivity: 1,
        eventsTarget: "container",
        thresholdDelta: null,
        thresholdTime: null,
        noMousewheelClass: "swiper-no-mousewheel"
      }
    });
    swiper.mousewheel = {
      enabled: false
    };
    let timeout;
    let lastScrollTime = now2();
    let lastEventBeforeSnap;
    const recentWheelEvents = [];
    function normalize(e) {
      const PIXEL_STEP = 10;
      const LINE_HEIGHT = 40;
      const PAGE_HEIGHT = 800;
      let sX = 0;
      let sY = 0;
      let pX = 0;
      let pY = 0;
      if ("detail" in e) {
        sY = e.detail;
      }
      if ("wheelDelta" in e) {
        sY = -e.wheelDelta / 120;
      }
      if ("wheelDeltaY" in e) {
        sY = -e.wheelDeltaY / 120;
      }
      if ("wheelDeltaX" in e) {
        sX = -e.wheelDeltaX / 120;
      }
      if ("axis" in e && e.axis === e.HORIZONTAL_AXIS) {
        sX = sY;
        sY = 0;
      }
      pX = sX * PIXEL_STEP;
      pY = sY * PIXEL_STEP;
      if ("deltaY" in e) {
        pY = e.deltaY;
      }
      if ("deltaX" in e) {
        pX = e.deltaX;
      }
      if (e.shiftKey && !pX) {
        pX = pY;
        pY = 0;
      }
      if ((pX || pY) && e.deltaMode) {
        if (e.deltaMode === 1) {
          pX *= LINE_HEIGHT;
          pY *= LINE_HEIGHT;
        } else {
          pX *= PAGE_HEIGHT;
          pY *= PAGE_HEIGHT;
        }
      }
      if (pX && !sX) {
        sX = pX < 1 ? -1 : 1;
      }
      if (pY && !sY) {
        sY = pY < 1 ? -1 : 1;
      }
      return {
        spinX: sX,
        spinY: sY,
        pixelX: pX,
        pixelY: pY
      };
    }
    function handleMouseEnter() {
      if (!swiper.enabled)
        return;
      swiper.mouseEntered = true;
    }
    function handleMouseLeave() {
      if (!swiper.enabled)
        return;
      swiper.mouseEntered = false;
    }
    function animateSlider(newEvent) {
      if (swiper.params.mousewheel.thresholdDelta && newEvent.delta < swiper.params.mousewheel.thresholdDelta) {
        return false;
      }
      if (swiper.params.mousewheel.thresholdTime && now2() - lastScrollTime < swiper.params.mousewheel.thresholdTime) {
        return false;
      }
      if (newEvent.delta >= 6 && now2() - lastScrollTime < 60) {
        return true;
      }
      if (newEvent.direction < 0) {
        if ((!swiper.isEnd || swiper.params.loop) && !swiper.animating) {
          swiper.slideNext();
          emit("scroll", newEvent.raw);
        }
      } else if ((!swiper.isBeginning || swiper.params.loop) && !swiper.animating) {
        swiper.slidePrev();
        emit("scroll", newEvent.raw);
      }
      lastScrollTime = new window2.Date().getTime();
      return false;
    }
    function releaseScroll(newEvent) {
      const params = swiper.params.mousewheel;
      if (newEvent.direction < 0) {
        if (swiper.isEnd && !swiper.params.loop && params.releaseOnEdges) {
          return true;
        }
      } else if (swiper.isBeginning && !swiper.params.loop && params.releaseOnEdges) {
        return true;
      }
      return false;
    }
    function handle(event2) {
      let e = event2;
      let disableParentSwiper = true;
      if (!swiper.enabled)
        return;
      if (event2.target.closest(`.${swiper.params.mousewheel.noMousewheelClass}`))
        return;
      const params = swiper.params.mousewheel;
      if (swiper.params.cssMode) {
        e.preventDefault();
      }
      let targetEl = swiper.el;
      if (swiper.params.mousewheel.eventsTarget !== "container") {
        targetEl = document.querySelector(swiper.params.mousewheel.eventsTarget);
      }
      const targetElContainsTarget = targetEl && targetEl.contains(e.target);
      if (!swiper.mouseEntered && !targetElContainsTarget && !params.releaseOnEdges)
        return true;
      if (e.originalEvent)
        e = e.originalEvent;
      let delta = 0;
      const rtlFactor = swiper.rtlTranslate ? -1 : 1;
      const data = normalize(e);
      if (params.forceToAxis) {
        if (swiper.isHorizontal()) {
          if (Math.abs(data.pixelX) > Math.abs(data.pixelY))
            delta = -data.pixelX * rtlFactor;
          else
            return true;
        } else if (Math.abs(data.pixelY) > Math.abs(data.pixelX))
          delta = -data.pixelY;
        else
          return true;
      } else {
        delta = Math.abs(data.pixelX) > Math.abs(data.pixelY) ? -data.pixelX * rtlFactor : -data.pixelY;
      }
      if (delta === 0)
        return true;
      if (params.invert)
        delta = -delta;
      let positions = swiper.getTranslate() + delta * params.sensitivity;
      if (positions >= swiper.minTranslate())
        positions = swiper.minTranslate();
      if (positions <= swiper.maxTranslate())
        positions = swiper.maxTranslate();
      disableParentSwiper = swiper.params.loop ? true : !(positions === swiper.minTranslate() || positions === swiper.maxTranslate());
      if (disableParentSwiper && swiper.params.nested)
        e.stopPropagation();
      if (!swiper.params.freeMode || !swiper.params.freeMode.enabled) {
        const newEvent = {
          time: now2(),
          delta: Math.abs(delta),
          direction: Math.sign(delta),
          raw: event2
        };
        if (recentWheelEvents.length >= 2) {
          recentWheelEvents.shift();
        }
        const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : void 0;
        recentWheelEvents.push(newEvent);
        if (prevEvent) {
          if (newEvent.direction !== prevEvent.direction || newEvent.delta > prevEvent.delta || newEvent.time > prevEvent.time + 150) {
            animateSlider(newEvent);
          }
        } else {
          animateSlider(newEvent);
        }
        if (releaseScroll(newEvent)) {
          return true;
        }
      } else {
        const newEvent = {
          time: now2(),
          delta: Math.abs(delta),
          direction: Math.sign(delta)
        };
        const ignoreWheelEvents = lastEventBeforeSnap && newEvent.time < lastEventBeforeSnap.time + 500 && newEvent.delta <= lastEventBeforeSnap.delta && newEvent.direction === lastEventBeforeSnap.direction;
        if (!ignoreWheelEvents) {
          lastEventBeforeSnap = void 0;
          let position = swiper.getTranslate() + delta * params.sensitivity;
          const wasBeginning = swiper.isBeginning;
          const wasEnd = swiper.isEnd;
          if (position >= swiper.minTranslate())
            position = swiper.minTranslate();
          if (position <= swiper.maxTranslate())
            position = swiper.maxTranslate();
          swiper.setTransition(0);
          swiper.setTranslate(position);
          swiper.updateProgress();
          swiper.updateActiveIndex();
          swiper.updateSlidesClasses();
          if (!wasBeginning && swiper.isBeginning || !wasEnd && swiper.isEnd) {
            swiper.updateSlidesClasses();
          }
          if (swiper.params.loop) {
            swiper.loopFix({
              direction: newEvent.direction < 0 ? "next" : "prev",
              byMousewheel: true
            });
          }
          if (swiper.params.freeMode.sticky) {
            clearTimeout(timeout);
            timeout = void 0;
            if (recentWheelEvents.length >= 15) {
              recentWheelEvents.shift();
            }
            const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : void 0;
            const firstEvent = recentWheelEvents[0];
            recentWheelEvents.push(newEvent);
            if (prevEvent && (newEvent.delta > prevEvent.delta || newEvent.direction !== prevEvent.direction)) {
              recentWheelEvents.splice(0);
            } else if (recentWheelEvents.length >= 15 && newEvent.time - firstEvent.time < 500 && firstEvent.delta - newEvent.delta >= 1 && newEvent.delta <= 6) {
              const snapToThreshold = delta > 0 ? 0.8 : 0.2;
              lastEventBeforeSnap = newEvent;
              recentWheelEvents.splice(0);
              timeout = nextTick2(() => {
                if (swiper.destroyed || !swiper.params)
                  return;
                swiper.slideToClosest(swiper.params.speed, true, void 0, snapToThreshold);
              }, 0);
            }
            if (!timeout) {
              timeout = nextTick2(() => {
                if (swiper.destroyed || !swiper.params)
                  return;
                const snapToThreshold = 0.5;
                lastEventBeforeSnap = newEvent;
                recentWheelEvents.splice(0);
                swiper.slideToClosest(swiper.params.speed, true, void 0, snapToThreshold);
              }, 500);
            }
          }
          if (!ignoreWheelEvents)
            emit("scroll", e);
          if (swiper.params.autoplay && swiper.params.autoplayDisableOnInteraction)
            swiper.autoplay.stop();
          if (params.releaseOnEdges && (position === swiper.minTranslate() || position === swiper.maxTranslate())) {
            return true;
          }
        }
      }
      if (e.preventDefault)
        e.preventDefault();
      else
        e.returnValue = false;
      return false;
    }
    function events22(method) {
      let targetEl = swiper.el;
      if (swiper.params.mousewheel.eventsTarget !== "container") {
        targetEl = document.querySelector(swiper.params.mousewheel.eventsTarget);
      }
      targetEl[method]("mouseenter", handleMouseEnter);
      targetEl[method]("mouseleave", handleMouseLeave);
      targetEl[method]("wheel", handle);
    }
    function enable() {
      if (swiper.params.cssMode) {
        swiper.wrapperEl.removeEventListener("wheel", handle);
        return true;
      }
      if (swiper.mousewheel.enabled)
        return false;
      events22("addEventListener");
      swiper.mousewheel.enabled = true;
      return true;
    }
    function disable() {
      if (swiper.params.cssMode) {
        swiper.wrapperEl.addEventListener(event, handle);
        return true;
      }
      if (!swiper.mousewheel.enabled)
        return false;
      events22("removeEventListener");
      swiper.mousewheel.enabled = false;
      return true;
    }
    on("init", () => {
      if (!swiper.params.mousewheel.enabled && swiper.params.cssMode) {
        disable();
      }
      if (swiper.params.mousewheel.enabled)
        enable();
    });
    on("destroy", () => {
      if (swiper.params.cssMode) {
        enable();
      }
      if (swiper.mousewheel.enabled)
        disable();
    });
    Object.assign(swiper.mousewheel, {
      enable,
      disable
    });
  }
  function createElementIfNotDefined2(swiper, originalParams, params, checkProps) {
    if (swiper.params.createElements) {
      Object.keys(checkProps).forEach((key) => {
        if (!params[key] && params.auto === true) {
          let element = elementChildren2(swiper.el, `.${checkProps[key]}`)[0];
          if (!element) {
            element = createElement3("div", checkProps[key]);
            element.className = checkProps[key];
            swiper.el.append(element);
          }
          params[key] = element;
          originalParams[key] = element;
        }
      });
    }
    return params;
  }
  function Navigation2(_ref) {
    let {
      swiper,
      extendParams,
      on,
      emit
    } = _ref;
    extendParams({
      navigation: {
        nextEl: null,
        prevEl: null,
        hideOnClick: false,
        disabledClass: "swiper-button-disabled",
        hiddenClass: "swiper-button-hidden",
        lockClass: "swiper-button-lock",
        navigationDisabledClass: "swiper-navigation-disabled"
      }
    });
    swiper.navigation = {
      nextEl: null,
      prevEl: null
    };
    function getEl(el) {
      let res;
      if (el && typeof el === "string" && swiper.isElement) {
        res = swiper.el.querySelector(el) || swiper.hostEl.querySelector(el);
        if (res)
          return res;
      }
      if (el) {
        if (typeof el === "string")
          res = [...document.querySelectorAll(el)];
        if (swiper.params.uniqueNavElements && typeof el === "string" && res && res.length > 1 && swiper.el.querySelectorAll(el).length === 1) {
          res = swiper.el.querySelector(el);
        } else if (res && res.length === 1) {
          res = res[0];
        }
      }
      if (el && !res)
        return el;
      return res;
    }
    function toggleEl(el, disabled) {
      const params = swiper.params.navigation;
      el = makeElementsArray2(el);
      el.forEach((subEl) => {
        if (subEl) {
          subEl.classList[disabled ? "add" : "remove"](...params.disabledClass.split(" "));
          if (subEl.tagName === "BUTTON")
            subEl.disabled = disabled;
          if (swiper.params.watchOverflow && swiper.enabled) {
            subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
          }
        }
      });
    }
    function update22() {
      const {
        nextEl,
        prevEl
      } = swiper.navigation;
      if (swiper.params.loop) {
        toggleEl(prevEl, false);
        toggleEl(nextEl, false);
        return;
      }
      toggleEl(prevEl, swiper.isBeginning && !swiper.params.rewind);
      toggleEl(nextEl, swiper.isEnd && !swiper.params.rewind);
    }
    function onPrevClick(e) {
      e.preventDefault();
      if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind)
        return;
      swiper.slidePrev();
      emit("navigationPrev");
    }
    function onNextClick(e) {
      e.preventDefault();
      if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind)
        return;
      swiper.slideNext();
      emit("navigationNext");
    }
    function init() {
      const params = swiper.params.navigation;
      swiper.params.navigation = createElementIfNotDefined2(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
        nextEl: "swiper-button-next",
        prevEl: "swiper-button-prev"
      });
      if (!(params.nextEl || params.prevEl))
        return;
      let nextEl = getEl(params.nextEl);
      let prevEl = getEl(params.prevEl);
      Object.assign(swiper.navigation, {
        nextEl,
        prevEl
      });
      nextEl = makeElementsArray2(nextEl);
      prevEl = makeElementsArray2(prevEl);
      const initButton = (el, dir) => {
        if (el) {
          el.addEventListener("click", dir === "next" ? onNextClick : onPrevClick);
        }
        if (!swiper.enabled && el) {
          el.classList.add(...params.lockClass.split(" "));
        }
      };
      nextEl.forEach((el) => initButton(el, "next"));
      prevEl.forEach((el) => initButton(el, "prev"));
    }
    function destroy() {
      let {
        nextEl,
        prevEl
      } = swiper.navigation;
      nextEl = makeElementsArray2(nextEl);
      prevEl = makeElementsArray2(prevEl);
      const destroyButton = (el, dir) => {
        el.removeEventListener("click", dir === "next" ? onNextClick : onPrevClick);
        el.classList.remove(...swiper.params.navigation.disabledClass.split(" "));
      };
      nextEl.forEach((el) => destroyButton(el, "next"));
      prevEl.forEach((el) => destroyButton(el, "prev"));
    }
    on("init", () => {
      if (swiper.params.navigation.enabled === false) {
        disable();
      } else {
        init();
        update22();
      }
    });
    on("toEdge fromEdge lock unlock", () => {
      update22();
    });
    on("destroy", () => {
      destroy();
    });
    on("enable disable", () => {
      let {
        nextEl,
        prevEl
      } = swiper.navigation;
      nextEl = makeElementsArray2(nextEl);
      prevEl = makeElementsArray2(prevEl);
      if (swiper.enabled) {
        update22();
        return;
      }
      [...nextEl, ...prevEl].filter((el) => !!el).forEach((el) => el.classList.add(swiper.params.navigation.lockClass));
    });
    on("click", (_s, e) => {
      let {
        nextEl,
        prevEl
      } = swiper.navigation;
      nextEl = makeElementsArray2(nextEl);
      prevEl = makeElementsArray2(prevEl);
      const targetEl = e.target;
      let targetIsButton = prevEl.includes(targetEl) || nextEl.includes(targetEl);
      if (swiper.isElement && !targetIsButton) {
        const path = e.path || e.composedPath && e.composedPath();
        if (path) {
          targetIsButton = path.find((pathEl) => nextEl.includes(pathEl) || prevEl.includes(pathEl));
        }
      }
      if (swiper.params.navigation.hideOnClick && !targetIsButton) {
        if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl)))
          return;
        let isHidden;
        if (nextEl.length) {
          isHidden = nextEl[0].classList.contains(swiper.params.navigation.hiddenClass);
        } else if (prevEl.length) {
          isHidden = prevEl[0].classList.contains(swiper.params.navigation.hiddenClass);
        }
        if (isHidden === true) {
          emit("navigationShow");
        } else {
          emit("navigationHide");
        }
        [...nextEl, ...prevEl].filter((el) => !!el).forEach((el) => el.classList.toggle(swiper.params.navigation.hiddenClass));
      }
    });
    const enable = () => {
      swiper.el.classList.remove(...swiper.params.navigation.navigationDisabledClass.split(" "));
      init();
      update22();
    };
    const disable = () => {
      swiper.el.classList.add(...swiper.params.navigation.navigationDisabledClass.split(" "));
      destroy();
    };
    Object.assign(swiper.navigation, {
      enable,
      disable,
      update: update22,
      init,
      destroy
    });
  }
  function appendSlide2(slides) {
    const swiper = this;
    const {
      params,
      slidesEl
    } = swiper;
    if (params.loop) {
      swiper.loopDestroy();
    }
    const appendElement = (slideEl) => {
      if (typeof slideEl === "string") {
        const tempDOM = document.createElement("div");
        tempDOM.innerHTML = slideEl;
        slidesEl.append(tempDOM.children[0]);
        tempDOM.innerHTML = "";
      } else {
        slidesEl.append(slideEl);
      }
    };
    if (typeof slides === "object" && "length" in slides) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i])
          appendElement(slides[i]);
      }
    } else {
      appendElement(slides);
    }
    swiper.recalcSlides();
    if (params.loop) {
      swiper.loopCreate();
    }
    if (!params.observer || swiper.isElement) {
      swiper.update();
    }
  }
  function prependSlide2(slides) {
    const swiper = this;
    const {
      params,
      activeIndex,
      slidesEl
    } = swiper;
    if (params.loop) {
      swiper.loopDestroy();
    }
    let newActiveIndex = activeIndex + 1;
    const prependElement = (slideEl) => {
      if (typeof slideEl === "string") {
        const tempDOM = document.createElement("div");
        tempDOM.innerHTML = slideEl;
        slidesEl.prepend(tempDOM.children[0]);
        tempDOM.innerHTML = "";
      } else {
        slidesEl.prepend(slideEl);
      }
    };
    if (typeof slides === "object" && "length" in slides) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i])
          prependElement(slides[i]);
      }
      newActiveIndex = activeIndex + slides.length;
    } else {
      prependElement(slides);
    }
    swiper.recalcSlides();
    if (params.loop) {
      swiper.loopCreate();
    }
    if (!params.observer || swiper.isElement) {
      swiper.update();
    }
    swiper.slideTo(newActiveIndex, 0, false);
  }
  function addSlide2(index, slides) {
    const swiper = this;
    const {
      params,
      activeIndex,
      slidesEl
    } = swiper;
    let activeIndexBuffer = activeIndex;
    if (params.loop) {
      activeIndexBuffer -= swiper.loopedSlides;
      swiper.loopDestroy();
      swiper.recalcSlides();
    }
    const baseLength = swiper.slides.length;
    if (index <= 0) {
      swiper.prependSlide(slides);
      return;
    }
    if (index >= baseLength) {
      swiper.appendSlide(slides);
      return;
    }
    let newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;
    const slidesBuffer = [];
    for (let i = baseLength - 1; i >= index; i -= 1) {
      const currentSlide = swiper.slides[i];
      currentSlide.remove();
      slidesBuffer.unshift(currentSlide);
    }
    if (typeof slides === "object" && "length" in slides) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i])
          slidesEl.append(slides[i]);
      }
      newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + slides.length : activeIndexBuffer;
    } else {
      slidesEl.append(slides);
    }
    for (let i = 0; i < slidesBuffer.length; i += 1) {
      slidesEl.append(slidesBuffer[i]);
    }
    swiper.recalcSlides();
    if (params.loop) {
      swiper.loopCreate();
    }
    if (!params.observer || swiper.isElement) {
      swiper.update();
    }
    if (params.loop) {
      swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
    } else {
      swiper.slideTo(newActiveIndex, 0, false);
    }
  }
  function removeSlide2(slidesIndexes) {
    const swiper = this;
    const {
      params,
      activeIndex
    } = swiper;
    let activeIndexBuffer = activeIndex;
    if (params.loop) {
      activeIndexBuffer -= swiper.loopedSlides;
      swiper.loopDestroy();
    }
    let newActiveIndex = activeIndexBuffer;
    let indexToRemove;
    if (typeof slidesIndexes === "object" && "length" in slidesIndexes) {
      for (let i = 0; i < slidesIndexes.length; i += 1) {
        indexToRemove = slidesIndexes[i];
        if (swiper.slides[indexToRemove])
          swiper.slides[indexToRemove].remove();
        if (indexToRemove < newActiveIndex)
          newActiveIndex -= 1;
      }
      newActiveIndex = Math.max(newActiveIndex, 0);
    } else {
      indexToRemove = slidesIndexes;
      if (swiper.slides[indexToRemove])
        swiper.slides[indexToRemove].remove();
      if (indexToRemove < newActiveIndex)
        newActiveIndex -= 1;
      newActiveIndex = Math.max(newActiveIndex, 0);
    }
    swiper.recalcSlides();
    if (params.loop) {
      swiper.loopCreate();
    }
    if (!params.observer || swiper.isElement) {
      swiper.update();
    }
    if (params.loop) {
      swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
    } else {
      swiper.slideTo(newActiveIndex, 0, false);
    }
  }
  function removeAllSlides2() {
    const swiper = this;
    const slidesIndexes = [];
    for (let i = 0; i < swiper.slides.length; i += 1) {
      slidesIndexes.push(i);
    }
    swiper.removeSlide(slidesIndexes);
  }
  function Manipulation2(_ref) {
    let {
      swiper
    } = _ref;
    Object.assign(swiper, {
      appendSlide: appendSlide2.bind(swiper),
      prependSlide: prependSlide2.bind(swiper),
      addSlide: addSlide2.bind(swiper),
      removeSlide: removeSlide2.bind(swiper),
      removeAllSlides: removeAllSlides2.bind(swiper)
    });
  }
  var swiperContainer2 = {};
  function initializeSwiper2({
    id,
    widgetSelector,
    prevButton = "swiper-button-prev",
    nextButton = "swiper-button-next",
    paramsOverrides
  }) {
    const prev = widgetSelector.parentNode.querySelector(`.${prevButton}`);
    const next = widgetSelector.parentNode.querySelector(`.${nextButton}`);
    if (!swiperContainer2[id]) {
      swiperContainer2[id] = {};
    }
    const swiperInstance = swiperContainer2[id]?.instance;
    if (swiperInstance) {
      if (!swiperInstance.params?.enabled) {
        enableSwiper2(id);
        return;
      }
      swiperInstance.destroy(true);
    } else {
      swiperContainer2[id] = { pageIndex: 1 };
    }
    swiperContainer2[id].instance = new Swiper2(widgetSelector, {
      modules: [Navigation2, Manipulation2, Keyboard2, Mousewheel2],
      spaceBetween: 10,
      observer: true,
      grabCursor: true,
      allowTouchMove: true,
      direction: "horizontal",
      watchSlidesProgress: true,
      normalizeSlideIndex: true,
      watchOverflow: true,
      mousewheel: {
        enabled: false
      },
      navigation: {
        enabled: !!(prev && next),
        nextEl: next,
        prevEl: prev
      },
      resizeObserver: true,
      ...paramsOverrides
    });
  }
  function refreshSwiper(id) {
    if (swiperContainer2[id]?.instance) {
      swiperContainer2[id].instance.update();
    }
  }
  function enableSwiper2(id) {
    swiperContainer2[id]?.instance?.enable();
  }
  function isSwiperLoading(id) {
    if (swiperContainer2[id] && swiperContainer2[id].instance) {
      return swiperContainer2[id].isLoading;
    }
    return false;
  }
  function setSwiperLoadingStatus(id, isLoading) {
    if (swiperContainer2[id] && swiperContainer2[id].instance) {
      swiperContainer2[id].isLoading = isLoading;
    }
  }
  function updateSwiperInstance(id, updateProps) {
    if (swiperContainer2[id] && swiperContainer2[id].instance) {
      updateProps(swiperContainer2[id]);
    }
  }

  // widgets/carousel/inline-carousel-swiper.loader.ts
  function initializeInlineSwiperListeners() {
    const swiper = sdk.querySelector(".carousel-inline.swiper-inline");
    if (!swiper) {
      throw new Error("Failed to find swiper element");
    }
    initializeSwiperForInlineTiles();
  }
  function initializeSwiperForInlineTiles() {
    const { enable_custom_tiles_per_page, tiles_per_page } = sdk.getStyleConfig();
    const widgetSelector = sdk.placement.querySelector(".carousel-inline.swiper-inline");
    if (!widgetSelector) {
      throw new Error("Failed to find widget UI element. Failed to initialise Swiper");
    }
    const tileWidth = 210;
    const screenSize = window.innerWidth;
    const perView = !enable_custom_tiles_per_page ? Math.floor(screenSize / (tileWidth + 10)) : (
      // FIXME: All numbers should be numbers across the board
      parseInt(tiles_per_page)
    );
    sdk.tiles.setVisibleTilesCount(perView * 2);
    initializeSwiper2({
      id: "inline-carousel",
      mode: "inline",
      widgetSelector,
      prevButton: "swiper-inline-carousel-button-prev",
      nextButton: "swiper-inline-carousel-button-next",
      paramsOverrides: {
        slidesPerView: "auto",
        grabCursor: false,
        allowTouchMove: false,
        breakpointsBase: "container",
        breakpoints: {
          0: {
            slidesPerView: 1
          },
          537: {
            slidesPerView: 3
          },
          952: {
            slidesPerView: 7
          }
        },
        keyboard: {
          enabled: true,
          onlyInViewport: false
        },
        on: {
          beforeInit: (swiper) => {
            enableLoadedTiles();
            swiper.slideToLoop(0, 0, false);
          },
          afterInit: (swiper) => {
            setSwiperLoadingStatus("inline-carousel", true);
            void loadTilesAsync(swiper);
          },
          activeIndexChange: (swiper) => {
            if (swiper.navigation.prevEl) {
              if (swiper.realIndex === 0 && isSwiperLoading("inline-carousel")) {
                disblePrevNavigation(swiper);
              } else {
                enablePrevNavigation(swiper);
              }
            }
          }
        }
      }
    });
  }
  function enableLoadedTiles() {
    sdk.placement.querySelectorAll(".ugc-tiles > .ugc-tile[style*='display: none']")?.forEach((tileElement) => tileElement.style.display = "");
  }
  async function loadTilesAsync(swiper) {
    const observer = registerObserver(swiper);
    let pageIndex = 1;
    while (sdk.tiles.hasMoreTiles()) {
      pageIndex++;
      if (sdk.tiles.page < pageIndex) {
        sdk.tiles.page = pageIndex;
      }
      await sdk.tiles.fetchTiles(pageIndex);
      enableLoadedTiles();
      swiper.update();
    }
    observer.disconnect();
    swiper.navigation.nextEl.classList.remove("swiper-button-hidden");
    updateLoadingStateInterval(swiper.el);
  }
  function updateLoadingStateInterval(swiperElem) {
    const intervalId = setInterval(function() {
      const elements = swiperElem.querySelectorAll(".swiper-slide:has(.icon-section.hidden)");
      if (elements.length === 0) {
        clearInterval(intervalId);
        updateSwiperInstance("inline-carousel", (swiperData) => {
          swiperData.isLoading = false;
          if (swiperData.instance) {
            swiperData.instance.off("activeIndexChange");
            swiperData.instance.setGrabCursor();
            swiperData.instance.allowTouchMove = true;
            swiperData.instance.params.loop = true;
            enablePrevNavigation(swiperData.instance);
          }
        });
        refreshSwiper("inline-carousel");
      }
    }, 200);
  }
  function enablePrevNavigation(swiper) {
    swiper.allowSlidePrev = true;
    swiper.navigation.prevEl.classList.remove("swiper-button-hidden");
  }
  function disblePrevNavigation(swiper) {
    swiper.allowSlidePrev = false;
    swiper.navigation.prevEl.classList.add("swiper-button-hidden");
  }
  function registerObserver(swiper) {
    const observer = new MutationObserver(() => {
      enableTileImages(swiper.wrapperEl);
    });
    observer.observe(swiper.wrapperEl, {
      childList: true
    });
    return observer;
  }

  // widgets/carousel/widget.tsx
  loadWidget({
    extensions: {
      swiper: true
    },
    features: {
      handleLoadMore: false
    }
  });
  sdk.querySelector(".track")?.style.removeProperty("display");
  initializeInlineSwiperListeners();
})();