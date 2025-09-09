"use strict"
;(() => {
  var e = (t, o) => () => (t && (o = t((t = 0))), o)
  var c = e(() => {})
  var p = e(() => {})
  var E = e(() => {})
  var f = e(() => {})
  var u = e(() => {})
  var m = e(() => {})
  var T = e(() => {})
  var _ = e(() => {})
  var g = e(() => {})
  var x = e(() => {
    u()
    m()
    T()
    _()
    g()
  })
  var h = e(() => {})
  var L = e(() => {})
  var C = e(() => {})
  var I = e(() => {})
  var k = e(() => {
    h()
    L()
    C()
    I()
  })
  var S = e(() => {})
  var w = e(() => {})
  var b = e(() => {})
  var N = e(() => {})
  var D = e(() => {})
  var A = e(() => {})
  var O = e(() => {
    S()
    w()
    b()
    N()
    D()
    A()
  })
  var R = e(() => {})
  var P = e(() => {
    E()
    f()
    x()
    k()
    O()
    R()
  })
  var y = e(() => {})
  var v = e(() => {})
  var M = e(() => {})
  var V = e(() => {})
  var U = e(() => {
    y()
    v()
    M()
    V()
  })
  var B = e(() => {})
  var F,
    G,
    $,
    W,
    z,
    H,
    j,
    a = e(() => {
      ;(F = "https://staging-assetscdn.stackla.com"),
        (G = "https://assetscdn.stackla.com"),
        ($ = "https://widget-data.teaser.stackla.com"),
        (W = "https://widget-ui.teaser.stackla.com"),
        (z = "https://widget-data.stackla.com"),
        (H = "https://widget-ui.stackla.com"),
        (j = "widgetapp.teaser.stackla.com")
    })
  var d,
    l = e(() => {
      d = t =>
        Object.entries(t)
          .map(([o, n]) => ` data-${encodeURIComponent(o)}="${encodeURIComponent(n)}"`)
          .join("")
    })
  var re,
    q,
    X,
    K = e(() => {
      a()
      l()
      ;(re = t => {
        switch (t) {
          case "staging":
            return F
          case "production":
          default:
            return G
        }
      }),
        (q = t => `
    <!-- Nosto Widget Embed Code (start) -->
    <div class="stackla-widget" style="width: 100%; overflow: hidden;"${d(t)}></div>
    <!-- Nosto Widget Embed Code (end) -->
    `),
        (X = (t, o) => {
          let n = document.createElement("script")
          ;(n.textContent = `
    (function (d, id) {
        var t, el = d.scripts[d.scripts.length - 1].previousElementSibling;
        if (el) el.dataset.initTimestamp = (new Date()).getTime();
        if (d.getElementById(id)) return;
        t = d.createElement('script');
        t.src = '${re(t)}/media/js/widget/fluid-embed.min.js';
        t.id = id;
        (d.getElementsByTagName('head')[0] || d.getElementsByTagName('body')[0]).appendChild(t);
    }(document, 'stackla-widget-js'));`),
            o.appendChild(n)
        })
    })
  var ie,
    Y,
    J,
    Z = e(() => {
      a()
      l()
      ;(ie = t => {
        switch (t) {
          case "staging":
            return W
          case "production":
          default:
            return H
        }
      }),
        (Y = t => `<div id="ugc-widget"${d(t)}></div>`),
        (J = (t, o) => {
          let n = document.createElement("script")
          ;(n.type = "module"),
            (n.textContent = `
    (async () => {
      const widget = await import('${ie(t)}/core.esm.js');
      widget.init();
    })();
  `),
            o.appendChild(n)
        })
    })
  function se(t) {
    switch (t) {
      case "staging":
        return $
      case "production":
        return z
    }
  }
  function ae(t, o) {
    return `${se(o)}/widgets/${t}/version`
  }
  async function de(t, o) {
    return (await (await fetch(ae(t, o))).json()).version
  }
  async function Q(t) {
    let { environment: o = "production", widgetId: n, root: r, version: ne, dataProperties: i } = t
    try {
      let s = ne ?? (await de(n, o))
      switch (s) {
        case 2:
          ;(window.stackWidgetDomain = j), (i.hash = n), (r.innerHTML += q(i)), X(o, r)
          break
        case 3:
          ;(i.wid = n), (r.innerHTML += Y(i)), J(o, r)
          break
        default:
          throw new Error(`No widget code accessible with version ${s}`)
      }
    } catch (s) {
      console.error(`Failed to embed widget. ${s}`)
    }
  }
  var ee = e(() => {
    a()
    K()
    Z()
  })
  var te = e(() => {
    p()
    P()
    c()
    U()
    B()
    ee()
  })
  te()
  var oe = document.getElementById("stackla-widget")
  if (!oe) throw new Error("Could not find widget element")
  Q({ widgetId: "6787d01c10b5c", root: oe, environment: "staging", dataProperties: {} })
})()
