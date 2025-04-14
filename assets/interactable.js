/*
 * Floating-ui.js
 */
!(function (t, e) {
  'object' == typeof exports && 'undefined' != typeof module
    ? e(exports)
    : 'function' == typeof define && define.amd
    ? define(['exports'], e)
    : e(((t = 'undefined' != typeof globalThis ? globalThis : t || self).FloatingUIsr4Core = {}));
})(this, function (t) {
  'use strict';
  function e(t) {
    return t.split('-')[0];
  }
  function n(t) {
    return t.split('-')[1];
  }
  function o(t) {
    return ['top', 'bottom'].includes(e(t)) ? 'x' : 'y';
  }
  function i(t) {
    return 'y' === t ? 'height' : 'width';
  }
  function r(t, r, l) {
    let { reference: c, floating: f } = t;
    const s = c.x + c.width / 2 - f.width / 2,
      a = c.y + c.height / 2 - f.height / 2,
      u = o(r),
      d = i(u),
      m = c[d] / 2 - f[d] / 2,
      h = 'x' === u;
    let g;
    switch (e(r)) {
      case 'top':
        g = { x: s, y: c.y - f.height };
        break;
      case 'bottom':
        g = { x: s, y: c.y + c.height };
        break;
      case 'right':
        g = { x: c.x + c.width, y: a };
        break;
      case 'left':
        g = { x: c.x - f.width, y: a };
        break;
      default:
        g = { x: c.x, y: c.y };
    }
    switch (n(r)) {
      case 'start':
        g[u] -= m * (l && h ? -1 : 1);
        break;
      case 'end':
        g[u] += m * (l && h ? -1 : 1);
    }
    return g;
  }
  function l(t) {
    return 'number' != typeof t
      ? (function (t) {
          return { top: 0, right: 0, bottom: 0, left: 0, ...t };
        })(t)
      : { top: t, right: t, bottom: t, left: t };
  }
  function c(t) {
    return { ...t, top: t.y, left: t.x, right: t.x + t.width, bottom: t.y + t.height };
  }
  async function f(t, e) {
    var n;
    void 0 === e && (e = {});
    const { x: o, y: i, platform: r, rects: f, elements: s, strategy: a } = t,
      {
        boundary: u = 'clippingAncestors',
        rootBoundary: d = 'viewport',
        elementContext: m = 'floating',
        altBoundary: h = !1,
        padding: g = 0,
      } = e,
      p = l(g),
      y = s[h ? ('floating' === m ? 'reference' : 'floating') : m],
      w = c(
        await r.getClippingRect({
          element:
            null == (n = await (null == r.isElement ? void 0 : r.isElement(y))) || n
              ? y
              : y.contextElement || (await (null == r.getDocumentElement ? void 0 : r.getDocumentElement(s.floating))),
          boundary: u,
          rootBoundary: d,
        })
      ),
      x = c(
        r.convertOffsetParentRelativeRectToViewportRelativeRect
          ? await r.convertOffsetParentRelativeRectToViewportRelativeRect({
              rect: 'floating' === m ? { ...f.floating, x: o, y: i } : f.reference,
              offsetParent: await (null == r.getOffsetParent ? void 0 : r.getOffsetParent(s.floating)),
              strategy: a,
            })
          : f[m]
      );
    return {
      top: w.top - x.top + p.top,
      bottom: x.bottom - w.bottom + p.bottom,
      left: w.left - x.left + p.left,
      right: x.right - w.right + p.right,
    };
  }
  const s = Math.min,
    a = Math.max;
  function u(t, e, n) {
    return a(t, s(e, n));
  }
  const d = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
  function m(t) {
    return t.replace(/left|right|bottom|top/g, (t) => d[t]);
  }
  function h(t, e, r) {
    void 0 === r && (r = !1);
    const l = n(t),
      c = o(t),
      f = i(c);
    let s = 'x' === c ? (l === (r ? 'end' : 'start') ? 'right' : 'left') : 'start' === l ? 'bottom' : 'top';
    return e.reference[f] > e.floating[f] && (s = m(s)), { main: s, cross: m(s) };
  }
  const g = { start: 'end', end: 'start' };
  function p(t) {
    return t.replace(/start|end/g, (t) => g[t]);
  }
  const y = ['top', 'right', 'bottom', 'left'],
    w = y.reduce((t, e) => t.concat(e, e + '-start', e + '-end'), []);
  function x(t, e) {
    return { top: t.top - e.height, right: t.right - e.width, bottom: t.bottom - e.height, left: t.left - e.width };
  }
  function v(t) {
    return y.some((e) => t[e] >= 0);
  }
  function b(t) {
    return 'x' === t ? 'y' : 'x';
  }
  (t.arrow = (t) => ({
    name: 'arrow',
    options: t,
    async fn(e) {
      const { element: n, padding: r = 0 } = null != t ? t : {},
        { x: c, y: f, placement: s, rects: a, platform: d } = e;
      if (null == n) return {};
      const m = l(r),
        h = { x: c, y: f },
        g = o(s),
        p = i(g),
        y = await d.getDimensions(n),
        w = 'y' === g ? 'top' : 'left',
        x = 'y' === g ? 'bottom' : 'right',
        v = a.reference[p] + a.reference[g] - h[g] - a.floating[p],
        b = h[g] - a.reference[g],
        R = await (null == d.getOffsetParent ? void 0 : d.getOffsetParent(n)),
        P = R ? ('y' === g ? R.clientHeight || 0 : R.clientWidth || 0) : 0,
        T = v / 2 - b / 2,
        O = m[w],
        L = P - y[p] - m[x],
        A = P / 2 - y[p] / 2 + T,
        C = u(O, A, L);
      return { data: { [g]: C, centerOffset: A - C } };
    },
  })),
    (t.autoPlacement = function (t) {
      return (
        void 0 === t && (t = {}),
        {
          name: 'autoPlacement',
          options: t,
          async fn(o) {
            var i, r, l, c, s;
            const { x: a, y: u, rects: d, middlewareData: m, placement: g, platform: y, elements: x } = o,
              { alignment: v = null, allowedPlacements: b = w, autoAlignment: R = !0, ...P } = t,
              T = (function (t, o, i) {
                return (
                  t ? [...i.filter((e) => n(e) === t), ...i.filter((e) => n(e) !== t)] : i.filter((t) => e(t) === t)
                ).filter((e) => !t || n(e) === t || (!!o && p(e) !== e));
              })(v, R, b),
              O = await f(o, P),
              L = null != (i = null == (r = m.autoPlacement) ? void 0 : r.index) ? i : 0,
              A = T[L],
              { main: C, cross: E } = h(A, d, await (null == y.isRTL ? void 0 : y.isRTL(x.floating)));
            if (g !== A) return { x: a, y: u, reset: { skip: !1, placement: T[0] } };
            const H = [O[e(A)], O[C], O[E]],
              j = [
                ...(null != (l = null == (c = m.autoPlacement) ? void 0 : c.overflows) ? l : []),
                { placement: A, overflows: H },
              ],
              D = T[L + 1];
            if (D) return { data: { index: L + 1, overflows: j }, reset: { skip: !1, placement: D } };
            const W = j.slice().sort((t, e) => t.overflows[0] - e.overflows[0]),
              S =
                null ==
                (s = W.find((t) => {
                  let { overflows: e } = t;
                  return e.every((t) => t <= 0);
                }))
                  ? void 0
                  : s.placement;
            return { reset: { placement: null != S ? S : W[0].placement } };
          },
        }
      );
    }),
    (t.computePosition = async (t, e, n) => {
      const { placement: o = 'bottom', strategy: i = 'absolute', middleware: l = [], platform: c } = n,
        f = await (null == c.isRTL ? void 0 : c.isRTL(e));
      let s = await c.getElementRects({ reference: t, floating: e, strategy: i }),
        { x: a, y: u } = r(s, o, f),
        d = o,
        m = {};
      const h = new Set();
      for (let n = 0; n < l.length; n++) {
        const { name: g, fn: p } = l[n];
        if (h.has(g)) continue;
        const {
          x: y,
          y: w,
          data: x,
          reset: v,
        } = await p({
          x: a,
          y: u,
          initialPlacement: o,
          placement: d,
          strategy: i,
          middlewareData: m,
          rects: s,
          platform: c,
          elements: { reference: t, floating: e },
        });
        (a = null != y ? y : a),
          (u = null != w ? w : u),
          (m = { ...m, [g]: { ...m[g], ...x } }),
          v &&
            ('object' == typeof v &&
              (v.placement && (d = v.placement),
              v.rects &&
                (s = !0 === v.rects ? await c.getElementRects({ reference: t, floating: e, strategy: i }) : v.rects),
              ({ x: a, y: u } = r(s, d, f)),
              !1 !== v.skip && h.add(g)),
            (n = -1));
      }
      return { x: a, y: u, placement: d, strategy: i, middlewareData: m };
    }),
    (t.detectOverflow = f),
    (t.flip = function (t) {
      return (
        void 0 === t && (t = {}),
        {
          name: 'flip',
          options: t,
          async fn(n) {
            var o;
            const { placement: i, middlewareData: r, rects: l, initialPlacement: c, platform: s, elements: a } = n,
              {
                mainAxis: u = !0,
                crossAxis: d = !0,
                fallbackPlacements: g,
                fallbackStrategy: y = 'bestFit',
                flipAlignment: w = !0,
                ...x
              } = t,
              v = e(i),
              b = [
                c,
                ...(g ||
                  (v !== c && w
                    ? (function (t) {
                        const e = m(t);
                        return [p(t), e, p(e)];
                      })(c)
                    : [m(c)])),
              ],
              R = await f(n, x),
              P = [];
            let T = (null == (o = r.flip) ? void 0 : o.overflows) || [];
            if ((u && P.push(R[v]), d)) {
              const { main: t, cross: e } = h(i, l, await (null == s.isRTL ? void 0 : s.isRTL(a.floating)));
              P.push(R[t], R[e]);
            }
            if (((T = [...T, { placement: i, overflows: P }]), !P.every((t) => t <= 0))) {
              var O, L;
              const t = (null != (O = null == (L = r.flip) ? void 0 : L.index) ? O : 0) + 1,
                e = b[t];
              if (e) return { data: { index: t, overflows: T }, reset: { skip: !1, placement: e } };
              let n = 'bottom';
              switch (y) {
                case 'bestFit': {
                  var A;
                  const t =
                    null ==
                    (A = T.slice().sort(
                      (t, e) =>
                        t.overflows.filter((t) => t > 0).reduce((t, e) => t + e, 0) -
                        e.overflows.filter((t) => t > 0).reduce((t, e) => t + e, 0)
                    )[0])
                      ? void 0
                      : A.placement;
                  t && (n = t);
                  break;
                }
                case 'initialPlacement':
                  n = c;
              }
              return { reset: { placement: n } };
            }
            return {};
          },
        }
      );
    }),
    (t.hide = function (t) {
      let { strategy: e = 'referenceHidden', ...n } = void 0 === t ? {} : t;
      return {
        name: 'hide',
        async fn(t) {
          const { rects: o } = t;
          switch (e) {
            case 'referenceHidden': {
              const e = x(await f(t, { ...n, elementContext: 'reference' }), o.reference);
              return { data: { referenceHiddenOffsets: e, referenceHidden: v(e) } };
            }
            case 'escaped': {
              const e = x(await f(t, { ...n, altBoundary: !0 }), o.floating);
              return { data: { escapedOffsets: e, escaped: v(e) } };
            }
            default:
              return {};
          }
        },
      };
    }),
    (t.inline = function (t) {
      return (
        void 0 === t && (t = {}),
        {
          name: 'inline',
          options: t,
          async fn(n) {
            var i;
            const { placement: r, elements: f, rects: u, platform: d, strategy: m } = n,
              { padding: h = 2, x: g, y: p } = t,
              y = c(
                d.convertOffsetParentRelativeRectToViewportRelativeRect
                  ? await d.convertOffsetParentRelativeRectToViewportRelativeRect({
                      rect: u.reference,
                      offsetParent: await (null == d.getOffsetParent ? void 0 : d.getOffsetParent(f.floating)),
                      strategy: m,
                    })
                  : u.reference
              ),
              w = null != (i = await (null == d.getClientRects ? void 0 : d.getClientRects(f.reference))) ? i : [],
              x = l(h);
            return {
              reset: {
                rects: await d.getElementRects({
                  reference: {
                    getBoundingClientRect: function () {
                      var t;
                      if (2 === w.length && w[0].left > w[1].right && null != g && null != p)
                        return null !=
                          (t = w.find(
                            (t) =>
                              g > t.left - x.left &&
                              g < t.right + x.right &&
                              p > t.top - x.top &&
                              p < t.bottom + x.bottom
                          ))
                          ? t
                          : y;
                      if (w.length >= 2) {
                        if ('x' === o(r)) {
                          const t = w[0],
                            n = w[w.length - 1],
                            o = 'top' === e(r),
                            i = t.top,
                            l = n.bottom,
                            c = o ? t.left : n.left,
                            f = o ? t.right : n.right;
                          return { top: i, bottom: l, left: c, right: f, width: f - c, height: l - i, x: c, y: i };
                        }
                        const t = 'left' === e(r),
                          n = a(...w.map((t) => t.right)),
                          i = s(...w.map((t) => t.left)),
                          l = w.filter((e) => (t ? e.left === i : e.right === n)),
                          c = l[0].top,
                          f = l[l.length - 1].bottom;
                        return { top: c, bottom: f, left: i, right: n, width: n - i, height: f - c, x: i, y: c };
                      }
                      return y;
                    },
                  },
                  floating: f.floating,
                  strategy: m,
                }),
              },
            };
          },
        }
      );
    }),
    (t.limitShift = function (t) {
      return (
        void 0 === t && (t = {}),
        {
          options: t,
          fn(n) {
            const { x: i, y: r, placement: l, rects: c, middlewareData: f } = n,
              { offset: s = 0, mainAxis: a = !0, crossAxis: u = !0 } = t,
              d = { x: i, y: r },
              m = o(l),
              h = b(m);
            let g = d[m],
              p = d[h];
            const y = 'function' == typeof s ? s({ ...c, placement: l }) : s,
              w = 'number' == typeof y ? { mainAxis: y, crossAxis: 0 } : { mainAxis: 0, crossAxis: 0, ...y };
            if (a) {
              const t = 'y' === m ? 'height' : 'width',
                e = c.reference[m] - c.floating[t] + w.mainAxis,
                n = c.reference[m] + c.reference[t] - w.mainAxis;
              g < e ? (g = e) : g > n && (g = n);
            }
            if (u) {
              var x, v, R, P;
              const t = 'y' === m ? 'width' : 'height',
                n = ['top', 'left'].includes(e(l)),
                o =
                  c.reference[h] -
                  c.floating[t] +
                  (n && null != (x = null == (v = f.offset) ? void 0 : v[h]) ? x : 0) +
                  (n ? 0 : w.crossAxis),
                i =
                  c.reference[h] +
                  c.reference[t] +
                  (n ? 0 : null != (R = null == (P = f.offset) ? void 0 : P[h]) ? R : 0) -
                  (n ? w.crossAxis : 0);
              p < o ? (p = o) : p > i && (p = i);
            }
            return { [m]: g, [h]: p };
          },
        }
      );
    }),
    (t.offset = function (t) {
      return (
        void 0 === t && (t = 0),
        {
          name: 'offset',
          options: t,
          async fn(i) {
            const { x: r, y: l, placement: c, rects: f, platform: s, elements: a } = i,
              u = (function (t, i, r, l) {
                void 0 === l && (l = !1);
                const c = e(t),
                  f = n(t),
                  s = 'x' === o(t),
                  a = ['left', 'top'].includes(c) ? -1 : 1;
                let u = 1;
                'end' === f && (u = -1), l && s && (u *= -1);
                const d = 'function' == typeof r ? r({ ...i, placement: t }) : r,
                  { mainAxis: m, crossAxis: h } =
                    'number' == typeof d ? { mainAxis: d, crossAxis: 0 } : { mainAxis: 0, crossAxis: 0, ...d };
                return s ? { x: h * u, y: m * a } : { x: m * a, y: h * u };
              })(c, f, t, await (null == s.isRTL ? void 0 : s.isRTL(a.floating)));
            return { x: r + u.x, y: l + u.y, data: u };
          },
        }
      );
    }),
    (t.rectToClientRect = c),
    (t.shift = function (t) {
      return (
        void 0 === t && (t = {}),
        {
          name: 'shift',
          options: t,
          async fn(n) {
            const { x: i, y: r, placement: l } = n,
              {
                mainAxis: c = !0,
                crossAxis: s = !1,
                limiter: a = {
                  fn: (t) => {
                    let { x: e, y: n } = t;
                    return { x: e, y: n };
                  },
                },
                ...d
              } = t,
              m = { x: i, y: r },
              h = await f(n, d),
              g = o(e(l)),
              p = b(g);
            let y = m[g],
              w = m[p];
            if (c) {
              const t = 'y' === g ? 'bottom' : 'right';
              y = u(y + h['y' === g ? 'top' : 'left'], y, y - h[t]);
            }
            if (s) {
              const t = 'y' === p ? 'bottom' : 'right';
              w = u(w + h['y' === p ? 'top' : 'left'], w, w - h[t]);
            }
            const x = a.fn({ ...n, [g]: y, [p]: w });
            return { ...x, data: { x: x.x - i, y: x.y - r } };
          },
        }
      );
    }),
    (t.size = function (t) {
      return (
        void 0 === t && (t = {}),
        {
          name: 'size',
          options: t,
          async fn(o) {
            const { placement: i, rects: r, platform: l, elements: c } = o,
              { apply: s, ...u } = t,
              d = await f(o, u),
              m = e(i),
              h = n(i);
            let g, p;
            'top' === m || 'bottom' === m
              ? ((g = m),
                (p =
                  h === ((await (null == l.isRTL ? void 0 : l.isRTL(c.floating))) ? 'start' : 'end')
                    ? 'left'
                    : 'right'))
              : ((p = m), (g = 'end' === h ? 'top' : 'bottom'));
            const y = a(d.left, 0),
              w = a(d.right, 0),
              x = a(d.top, 0),
              v = a(d.bottom, 0),
              b = {
                height:
                  r.floating.height -
                  (['left', 'right'].includes(i) ? 2 * (0 !== x || 0 !== v ? x + v : a(d.top, d.bottom)) : d[g]),
                width:
                  r.floating.width -
                  (['top', 'bottom'].includes(i) ? 2 * (0 !== y || 0 !== w ? y + w : a(d.left, d.right)) : d[p]),
              };
            return null == s || s({ ...b, ...r }), { reset: { rects: !0 } };
          },
        }
      );
    }),
    Object.defineProperty(t, '__esModule', { value: !0 });
}),
  (function (t, e) {
    'object' == typeof exports && 'undefined' != typeof module
      ? e(exports, require('@floating-ui/core'))
      : 'function' == typeof define && define.amd
      ? define(['exports', '@floating-ui/core'], e)
      : e(((t = 'undefined' != typeof globalThis ? globalThis : t || self).FloatingUIsr4DOM = {}), t.FloatingUIsr4Core);
  })(this, function (t, e) {
    'use strict';
    function n(t) {
      return '[object Window]' === (null == t ? void 0 : t.toString());
    }
    function o(t) {
      if (null == t) return window;
      if (!n(t)) {
        const e = t.ownerDocument;
        return (e && e.defaultView) || window;
      }
      return t;
    }
    function i(t) {
      return o(t).getComputedStyle(t);
    }
    function r(t) {
      return n(t) ? '' : t ? (t.nodeName || '').toLowerCase() : '';
    }
    function l(t) {
      return t instanceof o(t).HTMLElement;
    }
    function c(t) {
      return t instanceof o(t).Element;
    }
    function f(t) {
      return t instanceof o(t).ShadowRoot || t instanceof ShadowRoot;
    }
    function s(t) {
      const { overflow: e, overflowX: n, overflowY: o } = i(t);
      return /auto|scroll|overlay|hidden/.test(e + o + n);
    }
    function a(t) {
      return ['table', 'td', 'th'].includes(r(t));
    }
    function u(t) {
      const e = navigator.userAgent.toLowerCase().includes('firefox'),
        n = i(t);
      return (
        'none' !== n.transform ||
        'none' !== n.perspective ||
        'paint' === n.contain ||
        ['transform', 'perspective'].includes(n.willChange) ||
        (e && 'filter' === n.willChange) ||
        (e && !!n.filter && 'none' !== n.filter)
      );
    }
    const d = Math.min,
      m = Math.max,
      h = Math.round;
    function g(t, e) {
      void 0 === e && (e = !1);
      const n = t.getBoundingClientRect();
      let o = 1,
        i = 1;
      return (
        e &&
          l(t) &&
          ((o = (t.offsetWidth > 0 && h(n.width) / t.offsetWidth) || 1),
          (i = (t.offsetHeight > 0 && h(n.height) / t.offsetHeight) || 1)),
        {
          width: n.width / o,
          height: n.height / i,
          top: n.top / i,
          right: n.right / o,
          bottom: n.bottom / i,
          left: n.left / o,
          x: n.left / o,
          y: n.top / i,
        }
      );
    }
    function p(t) {
      return ((e = t), (e instanceof o(e).Node ? t.ownerDocument : t.document) || window.document).documentElement;
      var e;
    }
    function y(t) {
      return n(t)
        ? { scrollLeft: t.pageXOffset, scrollTop: t.pageYOffset }
        : { scrollLeft: t.scrollLeft, scrollTop: t.scrollTop };
    }
    function w(t) {
      return g(p(t)).left + y(t).scrollLeft;
    }
    function x(t, e, n) {
      const o = l(e),
        i = p(e),
        c = g(
          t,
          o &&
            (function (t) {
              const e = g(t);
              return h(e.width) !== t.offsetWidth || h(e.height) !== t.offsetHeight;
            })(e)
        );
      let f = { scrollLeft: 0, scrollTop: 0 };
      const a = { x: 0, y: 0 };
      if (o || (!o && 'fixed' !== n))
        if ((('body' !== r(e) || s(i)) && (f = y(e)), l(e))) {
          const t = g(e, !0);
          (a.x = t.x + e.clientLeft), (a.y = t.y + e.clientTop);
        } else i && (a.x = w(i));
      return { x: c.left + f.scrollLeft - a.x, y: c.top + f.scrollTop - a.y, width: c.width, height: c.height };
    }
    function v(t) {
      return 'html' === r(t) ? t : t.assignedSlot || t.parentNode || (f(t) ? t.host : null) || p(t);
    }
    function b(t) {
      return l(t) && 'fixed' !== getComputedStyle(t).position ? t.offsetParent : null;
    }
    function R(t) {
      const e = o(t);
      let n = b(t);
      for (; n && a(n) && 'static' === getComputedStyle(n).position; ) n = b(n);
      return n && ('html' === r(n) || ('body' === r(n) && 'static' === getComputedStyle(n).position && !u(n)))
        ? e
        : n ||
            (function (t) {
              let e = v(t);
              for (f(e) && (e = e.host); l(e) && !['html', 'body'].includes(r(e)); ) {
                if (u(e)) return e;
                e = e.parentNode;
              }
              return null;
            })(t) ||
            e;
    }
    function P(t) {
      if (l(t)) return { width: t.offsetWidth, height: t.offsetHeight };
      const e = g(t);
      return { width: e.width, height: e.height };
    }
    function T(t, e) {
      var n;
      void 0 === e && (e = []);
      const i = (function t(e) {
          return ['html', 'body', '#document'].includes(r(e)) ? e.ownerDocument.body : l(e) && s(e) ? e : t(v(e));
        })(t),
        c = i === (null == (n = t.ownerDocument) ? void 0 : n.body),
        f = o(i),
        a = c ? [f].concat(f.visualViewport || [], s(i) ? i : []) : i,
        u = e.concat(a);
      return c ? u : u.concat(T(v(a)));
    }
    function O(t, n) {
      return 'viewport' === n
        ? e.rectToClientRect(
            (function (t) {
              const e = o(t),
                n = p(t),
                i = e.visualViewport;
              let r = n.clientWidth,
                l = n.clientHeight,
                c = 0,
                f = 0;
              return (
                i &&
                  ((r = i.width),
                  (l = i.height),
                  Math.abs(e.innerWidth / i.scale - i.width) < 0.01 && ((c = i.offsetLeft), (f = i.offsetTop))),
                { width: r, height: l, x: c, y: f }
              );
            })(t)
          )
        : c(n)
        ? (function (t) {
            const e = g(t),
              n = e.top + t.clientTop,
              o = e.left + t.clientLeft;
            return {
              top: n,
              left: o,
              x: o,
              y: n,
              right: o + t.clientWidth,
              bottom: n + t.clientHeight,
              width: t.clientWidth,
              height: t.clientHeight,
            };
          })(n)
        : e.rectToClientRect(
            (function (t) {
              var e;
              const n = p(t),
                o = y(t),
                r = null == (e = t.ownerDocument) ? void 0 : e.body,
                l = m(n.scrollWidth, n.clientWidth, r ? r.scrollWidth : 0, r ? r.clientWidth : 0),
                c = m(n.scrollHeight, n.clientHeight, r ? r.scrollHeight : 0, r ? r.clientHeight : 0);
              let f = -o.scrollLeft + w(t);
              const s = -o.scrollTop;
              return (
                'rtl' === i(r || n).direction && (f += m(n.clientWidth, r ? r.clientWidth : 0) - l),
                { width: l, height: c, x: f, y: s }
              );
            })(p(t))
          );
    }
    function L(t) {
      const e = T(v(t)),
        n = ['absolute', 'fixed'].includes(i(t).position) && l(t) ? R(t) : t;
      return c(n)
        ? e.filter(
            (t) =>
              c(t) &&
              (function (t, e) {
                const n = null == e.getRootNode ? void 0 : e.getRootNode();
                if (t.contains(e)) return !0;
                if (n && f(n)) {
                  let n = e;
                  do {
                    if (n && t === n) return !0;
                    n = n.parentNode || n.host;
                  } while (n);
                }
                return !1;
              })(t, n) &&
              'body' !== r(t)
          )
        : [];
    }
    const A = {
      getClippingRect: function (t) {
        let { element: e, boundary: n, rootBoundary: o } = t;
        const i = [...('clippingAncestors' === n ? L(e) : [].concat(n)), o],
          r = i[0],
          l = i.reduce((t, n) => {
            const o = O(e, n);
            return (
              (t.top = m(o.top, t.top)),
              (t.right = d(o.right, t.right)),
              (t.bottom = d(o.bottom, t.bottom)),
              (t.left = m(o.left, t.left)),
              t
            );
          }, O(e, r));
        return { width: l.right - l.left, height: l.bottom - l.top, x: l.left, y: l.top };
      },
      convertOffsetParentRelativeRectToViewportRelativeRect: function (t) {
        let { rect: e, offsetParent: n, strategy: o } = t;
        const i = l(n),
          c = p(n);
        if (n === c) return e;
        let f = { scrollLeft: 0, scrollTop: 0 };
        const a = { x: 0, y: 0 };
        if ((i || (!i && 'fixed' !== o)) && (('body' !== r(n) || s(c)) && (f = y(n)), l(n))) {
          const t = g(n, !0);
          (a.x = t.x + n.clientLeft), (a.y = t.y + n.clientTop);
        }
        return { ...e, x: e.x - f.scrollLeft + a.x, y: e.y - f.scrollTop + a.y };
      },
      isElement: c,
      getDimensions: P,
      getOffsetParent: R,
      getDocumentElement: p,
      getElementRects: (t) => {
        let { reference: e, floating: n, strategy: o } = t;
        return { reference: x(e, R(n), o), floating: { ...P(n), x: 0, y: 0 } };
      },
      getClientRects: (t) => Array.from(t.getClientRects()),
      isRTL: (t) => 'rtl' === i(t).direction,
    };
    Object.defineProperty(t, 'arrow', {
      enumerable: !0,
      get: function () {
        return e.arrow;
      },
    }),
      Object.defineProperty(t, 'autoPlacement', {
        enumerable: !0,
        get: function () {
          return e.autoPlacement;
        },
      }),
      Object.defineProperty(t, 'detectOverflow', {
        enumerable: !0,
        get: function () {
          return e.detectOverflow;
        },
      }),
      Object.defineProperty(t, 'flip', {
        enumerable: !0,
        get: function () {
          return e.flip;
        },
      }),
      Object.defineProperty(t, 'hide', {
        enumerable: !0,
        get: function () {
          return e.hide;
        },
      }),
      Object.defineProperty(t, 'inline', {
        enumerable: !0,
        get: function () {
          return e.inline;
        },
      }),
      Object.defineProperty(t, 'limitShift', {
        enumerable: !0,
        get: function () {
          return e.limitShift;
        },
      }),
      Object.defineProperty(t, 'offset', {
        enumerable: !0,
        get: function () {
          return e.offset;
        },
      }),
      Object.defineProperty(t, 'shift', {
        enumerable: !0,
        get: function () {
          return e.shift;
        },
      }),
      Object.defineProperty(t, 'size', {
        enumerable: !0,
        get: function () {
          return e.size;
        },
      }),
      (t.autoUpdate = function (t, e, n, o) {
        void 0 === o && (o = {});
        const { ancestorScroll: i = !0, ancestorResize: r = !0, elementResize: l = !0, animationFrame: f = !1 } = o;
        let s = !1;
        const a = i && !f,
          u = r && !f,
          d = l && !f,
          m = a || u ? [...(c(t) ? T(t) : []), ...T(e)] : [];
        m.forEach((t) => {
          a && t.addEventListener('scroll', n, { passive: !0 }), u && t.addEventListener('resize', n);
        });
        let h,
          p = null;
        d && ((p = new ResizeObserver(n)), c(t) && p.observe(t), p.observe(e));
        let y = f ? g(t) : null;
        return (
          f &&
            (function e() {
              if (s) return;
              const o = g(t);
              !y || (o.x === y.x && o.y === y.y && o.width === y.width && o.height === y.height) || n(),
                (y = o),
                (h = requestAnimationFrame(e));
            })(),
          () => {
            var t;
            (s = !0),
              m.forEach((t) => {
                a && t.removeEventListener('scroll', n), u && t.removeEventListener('resize', n);
              }),
              null == (t = p) || t.disconnect(),
              (p = null),
              f && cancelAnimationFrame(h);
          }
        );
      }),
      (t.computePosition = (t, n, o) => e.computePosition(t, n, { platform: A, ...o })),
      (t.getOverflowAncestors = T),
      Object.defineProperty(t, '__esModule', { value: !0 });
  });

/*!
 * hoverIntent v1.10.2 // 2020.04.28 // jQuery v1.7.0+
 * http://briancherne.github.io/jquery-hoverIntent/
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007-2019 Brian Cherne
 */
!(function (factory) {
  'use strict';
  'function' == typeof define && define.amd
    ? define(['jQuery_T4NT'], factory)
    : 'object' == typeof module && module.exports
    ? (module.exports = factory(require('jQuery_T4NT')))
    : jQuery_T4NT && !jQuery_T4NT.fn.hoverIntent && factory(jQuery_T4NT);
})(function ($) {
  'use strict';
  function track(ev) {
    (cX = ev.pageX), (cY = ev.pageY);
  }
  function isFunction(value) {
    return 'function' == typeof value;
  }
  var cX,
    cY,
    _cfg = { interval: 100, sensitivity: 6, timeout: 0 },
    INSTANCE_COUNT = 0,
    compare = function (ev, $el, s, cfg) {
      if (Math.sqrt((s.pX - cX) * (s.pX - cX) + (s.pY - cY) * (s.pY - cY)) < cfg.sensitivity)
        return (
          $el.off(s.event, track),
          delete s.timeoutId,
          (s.isActive = !0),
          (ev.pageX = cX),
          (ev.pageY = cY),
          delete s.pX,
          delete s.pY,
          cfg.over.apply($el[0], [ev])
        );
      (s.pX = cX),
        (s.pY = cY),
        (s.timeoutId = setTimeout(function () {
          compare(ev, $el, s, cfg);
        }, cfg.interval));
    };
  $.fn.hoverIntent = function (handlerIn, handlerOut, selector) {
    var instanceId = INSTANCE_COUNT++,
      cfg = $.extend({}, _cfg);
    $.isPlainObject(handlerIn)
      ? ((cfg = $.extend(cfg, handlerIn)), isFunction(cfg.out) || (cfg.out = cfg.over))
      : (cfg = isFunction(handlerOut)
          ? $.extend(cfg, { over: handlerIn, out: handlerOut, selector: selector })
          : $.extend(cfg, { over: handlerIn, out: handlerIn, selector: handlerOut }));
    function handleHover(e) {
      var ev = $.extend({}, e),
        $el = $(this),
        hoverIntentData = $el.data('hoverIntent');
      hoverIntentData || $el.data('hoverIntent', (hoverIntentData = {}));
      var state = hoverIntentData[instanceId];
      state || (hoverIntentData[instanceId] = state = { id: instanceId }),
        state.timeoutId && (state.timeoutId = clearTimeout(state.timeoutId));
      var mousemove = (state.event = 'mousemove.hoverIntent.hoverIntent' + instanceId);
      if ('mouseenter' === e.type) {
        if (state.isActive) return;
        (state.pX = ev.pageX),
          (state.pY = ev.pageY),
          $el.off(mousemove, track).on(mousemove, track),
          (state.timeoutId = setTimeout(function () {
            compare(ev, $el, state, cfg);
          }, cfg.interval));
      } else {
        if (!state.isActive) return;
        $el.off(mousemove, track),
          (state.timeoutId = setTimeout(function () {
            !(function (ev, $el, s, out) {
              var data = $el.data('hoverIntent');
              data && delete data[s.id], out.apply($el[0], [ev]);
            })(ev, $el, state, cfg.out);
          }, cfg.timeout));
      }
    }
    return this.on({ 'mouseenter.hoverIntent': handleHover, 'mouseleave.hoverIntent': handleHover }, cfg.selector);
  };
});

/*! PhotoSwipe - v4.1.3 - 2019-01-08
 * http://photoswipe.com
 * Copyright (c) 2019 Dmitry Semenov; */
!(function (a, b) {
  'function' == typeof define && define.amd
    ? define(b)
    : 'object' == typeof exports
    ? (module.exports = b())
    : (a.PhotoSwipe = b());
})(this, function () {
  'use strict';
  var a = function (a, b, c, d) {
    var e = {
      features: null,
      bind: function (a, b, c, d) {
        var e = (d ? 'remove' : 'add') + 'EventListener';
        b = b.split(' ');
        for (var f = 0; f < b.length; f++) b[f] && a[e](b[f], c, !1);
      },
      isArray: function (a) {
        return a instanceof Array;
      },
      createEl: function (a, b) {
        var c = document.createElement(b || 'div');
        return a && (c.className = a), c;
      },
      getScrollY: function () {
        var a = window.pageYOffset;
        return void 0 !== a ? a : document.documentElement.scrollTop;
      },
      unbind: function (a, b, c) {
        e.bind(a, b, c, !0);
      },
      removeClass: function (a, b) {
        var c = new RegExp('(\\s|^)' + b + '(\\s|$)');
        a.className = a.className
          .replace(c, ' ')
          .replace(/^\s\s*/, '')
          .replace(/\s\s*$/, '');
      },
      addClass: function (a, b) {
        e.hasClass(a, b) || (a.className += (a.className ? ' ' : '') + b);
      },
      hasClass: function (a, b) {
        return a.className && new RegExp('(^|\\s)' + b + '(\\s|$)').test(a.className);
      },
      getChildByClass: function (a, b) {
        for (var c = a.firstChild; c; ) {
          if (e.hasClass(c, b)) return c;
          c = c.nextSibling;
        }
      },
      arraySearch: function (a, b, c) {
        for (var d = a.length; d--; ) if (a[d][c] === b) return d;
        return -1;
      },
      extend: function (a, b, c) {
        for (var d in b)
          if (b.hasOwnProperty(d)) {
            if (c && a.hasOwnProperty(d)) continue;
            a[d] = b[d];
          }
      },
      easing: {
        sine: {
          out: function (a) {
            return Math.sin(a * (Math.PI / 2));
          },
          inOut: function (a) {
            return -(Math.cos(Math.PI * a) - 1) / 2;
          },
        },
        cubic: {
          out: function (a) {
            return --a * a * a + 1;
          },
        },
      },
      detectFeatures: function () {
        if (e.features) return e.features;
        var a = e.createEl(),
          b = a.style,
          c = '',
          d = {};
        if (
          ((d.oldIE = document.all && !document.addEventListener),
          (d.touch = 'ontouchstart' in window),
          window.requestAnimationFrame &&
            ((d.raf = window.requestAnimationFrame), (d.caf = window.cancelAnimationFrame)),
          (d.pointerEvent = !!window.PointerEvent || navigator.msPointerEnabled),
          !d.pointerEvent)
        ) {
          var f = navigator.userAgent;
          if (/iP(hone|od)/.test(navigator.platform)) {
            var g = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
            g && g.length > 0 && ((g = parseInt(g[1], 10)), g >= 1 && g < 8 && (d.isOldIOSPhone = !0));
          }
          var h = f.match(/Android\s([0-9\.]*)/),
            i = h ? h[1] : 0;
          (i = parseFloat(i)),
            i >= 1 && (i < 4.4 && (d.isOldAndroid = !0), (d.androidVersion = i)),
            (d.isMobileOpera = /opera mini|opera mobi/i.test(f));
        }
        for (
          var j, k, l = ['transform', 'perspective', 'animationName'], m = ['', 'webkit', 'Moz', 'ms', 'O'], n = 0;
          n < 4;
          n++
        ) {
          c = m[n];
          for (var o = 0; o < 3; o++)
            (j = l[o]), (k = c + (c ? j.charAt(0).toUpperCase() + j.slice(1) : j)), !d[j] && k in b && (d[j] = k);
          c &&
            !d.raf &&
            ((c = c.toLowerCase()),
            (d.raf = window[c + 'RequestAnimationFrame']),
            d.raf && (d.caf = window[c + 'CancelAnimationFrame'] || window[c + 'CancelRequestAnimationFrame']));
        }
        if (!d.raf) {
          var p = 0;
          (d.raf = function (a) {
            var b = new Date().getTime(),
              c = Math.max(0, 16 - (b - p)),
              d = window.setTimeout(function () {
                a(b + c);
              }, c);
            return (p = b + c), d;
          }),
            (d.caf = function (a) {
              clearTimeout(a);
            });
        }
        return (
          (d.svg =
            !!document.createElementNS &&
            !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect),
          (e.features = d),
          d
        );
      },
    };
    e.detectFeatures(),
      e.features.oldIE &&
        (e.bind = function (a, b, c, d) {
          b = b.split(' ');
          for (
            var e,
              f = (d ? 'detach' : 'attach') + 'Event',
              g = function () {
                c.handleEvent.call(c);
              },
              h = 0;
            h < b.length;
            h++
          )
            if ((e = b[h]))
              if ('object' == typeof c && c.handleEvent) {
                if (d) {
                  if (!c['oldIE' + e]) return !1;
                } else c['oldIE' + e] = g;
                a[f]('on' + e, c['oldIE' + e]);
              } else a[f]('on' + e, c);
        });
    var f = this,
      g = 25,
      h = 3,
      i = {
        allowPanToNext: !0,
        spacing: 0.12,
        bgOpacity: 1,
        mouseUsed: !1,
        loop: !0,
        pinchToClose: !0,
        closeOnScroll: !0,
        closeOnVerticalDrag: !0,
        verticalDragRange: 0.75,
        hideAnimationDuration: 333,
        showAnimationDuration: 333,
        showHideOpacity: !1,
        focus: !0,
        escKey: !0,
        arrowKeys: !0,
        mainScrollEndFriction: 0.35,
        panEndFriction: 0.35,
        isClickableElement: function (a) {
          return 'A' === a.tagName;
        },
        getDoubleTapZoom: function (a, b) {
          return a ? 1 : b.initialZoomLevel < 0.7 ? 1 : 1.33;
        },
        maxSpreadZoom: 1.33,
        modal: !0,
        scaleMode: 'fit',
      };
    e.extend(i, d);
    var j,
      k,
      l,
      m,
      n,
      o,
      p,
      q,
      r,
      s,
      t,
      u,
      v,
      w,
      x,
      y,
      z,
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H,
      I,
      J,
      K,
      L,
      M,
      N,
      O,
      P,
      Q,
      R,
      S,
      T,
      U,
      V,
      W,
      X,
      Y,
      Z,
      $,
      _,
      aa,
      ba,
      ca,
      da,
      ea,
      fa,
      ga,
      ha,
      ia,
      ja,
      ka,
      la,
      ma = function () {
        return { x: 0, y: 0 };
      },
      na = ma(),
      oa = ma(),
      pa = ma(),
      qa = {},
      ra = 0,
      sa = {},
      ta = ma(),
      ua = 0,
      va = !0,
      wa = [],
      xa = {},
      ya = !1,
      za = function (a, b) {
        e.extend(f, b.publicMethods), wa.push(a);
      },
      Aa = function (a) {
        var b = ac();
        return a > b - 1 ? a - b : a < 0 ? b + a : a;
      },
      Ba = {},
      Ca = function (a, b) {
        return Ba[a] || (Ba[a] = []), Ba[a].push(b);
      },
      Da = function (a) {
        var b = Ba[a];
        if (b) {
          var c = Array.prototype.slice.call(arguments);
          c.shift();
          for (var d = 0; d < b.length; d++) b[d].apply(f, c);
        }
      },
      Ea = function () {
        return new Date().getTime();
      },
      Fa = function (a) {
        (ja = a), (f.bg.style.opacity = a * i.bgOpacity);
      },
      Ga = function (a, b, c, d, e) {
        (!ya || (e && e !== f.currItem)) && (d /= e ? e.fitRatio : f.currItem.fitRatio),
          (a[E] = u + b + 'px, ' + c + 'px' + v + ' scale(' + d + ')');
      },
      Ha = function (a) {
        ea &&
          (a &&
            (s > f.currItem.fitRatio ? ya || (mc(f.currItem, !1, !0), (ya = !0)) : ya && (mc(f.currItem), (ya = !1))),
          Ga(ea, pa.x, pa.y, s));
      },
      Ia = function (a) {
        a.container && Ga(a.container.style, a.initialPosition.x, a.initialPosition.y, a.initialZoomLevel, a);
      },
      Ja = function (a, b) {
        b[E] = u + a + 'px, 0px' + v;
      },
      Ka = function (a, b) {
        if (!i.loop && b) {
          var c = m + (ta.x * ra - a) / ta.x,
            d = Math.round(a - tb.x);
          ((c < 0 && d > 0) || (c >= ac() - 1 && d < 0)) && (a = tb.x + d * i.mainScrollEndFriction);
        }
        (tb.x = a), Ja(a, n);
      },
      La = function (a, b) {
        var c = ub[a] - sa[a];
        return oa[a] + na[a] + c - c * (b / t);
      },
      Ma = function (a, b) {
        (a.x = b.x), (a.y = b.y), b.id && (a.id = b.id);
      },
      Na = function (a) {
        (a.x = Math.round(a.x)), (a.y = Math.round(a.y));
      },
      Oa = null,
      Pa = function () {
        Oa &&
          (e.unbind(document, 'mousemove', Pa), e.addClass(a, 'pswp--has_mouse'), (i.mouseUsed = !0), Da('mouseUsed')),
          (Oa = setTimeout(function () {
            Oa = null;
          }, 100));
      },
      Qa = function () {
        e.bind(document, 'keydown', f),
          N.transform && e.bind(f.scrollWrap, 'click', f),
          i.mouseUsed || e.bind(document, 'mousemove', Pa),
          e.bind(window, 'resize scroll orientationchange', f),
          Da('bindEvents');
      },
      Ra = function () {
        e.unbind(window, 'resize scroll orientationchange', f),
          e.unbind(window, 'scroll', r.scroll),
          e.unbind(document, 'keydown', f),
          e.unbind(document, 'mousemove', Pa),
          N.transform && e.unbind(f.scrollWrap, 'click', f),
          V && e.unbind(window, p, f),
          clearTimeout(O),
          Da('unbindEvents');
      },
      Sa = function (a, b) {
        var c = ic(f.currItem, qa, a);
        return b && (da = c), c;
      },
      Ta = function (a) {
        return a || (a = f.currItem), a.initialZoomLevel;
      },
      Ua = function (a) {
        return a || (a = f.currItem), a.w > 0 ? i.maxSpreadZoom : 1;
      },
      Va = function (a, b, c, d) {
        return d === f.currItem.initialZoomLevel
          ? ((c[a] = f.currItem.initialPosition[a]), !0)
          : ((c[a] = La(a, d)), c[a] > b.min[a] ? ((c[a] = b.min[a]), !0) : c[a] < b.max[a] && ((c[a] = b.max[a]), !0));
      },
      Wa = function () {
        if (E) {
          var b = N.perspective && !G;
          return (u = 'translate' + (b ? '3d(' : '(')), void (v = N.perspective ? ', 0px)' : ')');
        }
        (E = 'left'),
          e.addClass(a, 'pswp--ie'),
          (Ja = function (a, b) {
            b.left = a + 'px';
          }),
          (Ia = function (a) {
            var b = a.fitRatio > 1 ? 1 : a.fitRatio,
              c = a.container.style,
              d = b * a.w,
              e = b * a.h;
            (c.width = d + 'px'),
              (c.height = e + 'px'),
              (c.left = a.initialPosition.x + 'px'),
              (c.top = a.initialPosition.y + 'px');
          }),
          (Ha = function () {
            if (ea) {
              var a = ea,
                b = f.currItem,
                c = b.fitRatio > 1 ? 1 : b.fitRatio,
                d = c * b.w,
                e = c * b.h;
              (a.width = d + 'px'), (a.height = e + 'px'), (a.left = pa.x + 'px'), (a.top = pa.y + 'px');
            }
          });
      },
      Xa = function (a) {
        var b = '';
        i.escKey && 27 === a.keyCode
          ? (b = 'close')
          : i.arrowKeys && (37 === a.keyCode ? (b = 'prev') : 39 === a.keyCode && (b = 'next')),
          b &&
            (a.ctrlKey ||
              a.altKey ||
              a.shiftKey ||
              a.metaKey ||
              (a.preventDefault ? a.preventDefault() : (a.returnValue = !1), f[b]()));
      },
      Ya = function (a) {
        a && (Y || X || fa || T) && (a.preventDefault(), a.stopPropagation());
      },
      Za = function () {
        f.setScrollOffset(0, e.getScrollY());
      },
      $a = {},
      _a = 0,
      ab = function (a) {
        $a[a] && ($a[a].raf && I($a[a].raf), _a--, delete $a[a]);
      },
      bb = function (a) {
        $a[a] && ab(a), $a[a] || (_a++, ($a[a] = {}));
      },
      cb = function () {
        for (var a in $a) $a.hasOwnProperty(a) && ab(a);
      },
      db = function (a, b, c, d, e, f, g) {
        var h,
          i = Ea();
        bb(a);
        var j = function () {
          if ($a[a]) {
            if (((h = Ea() - i), h >= d)) return ab(a), f(c), void (g && g());
            f((c - b) * e(h / d) + b), ($a[a].raf = H(j));
          }
        };
        j();
      },
      eb = {
        shout: Da,
        listen: Ca,
        viewportSize: qa,
        options: i,
        isMainScrollAnimating: function () {
          return fa;
        },
        getZoomLevel: function () {
          return s;
        },
        getCurrentIndex: function () {
          return m;
        },
        isDragging: function () {
          return V;
        },
        isZooming: function () {
          return aa;
        },
        setScrollOffset: function (a, b) {
          (sa.x = a), (M = sa.y = b), Da('updateScrollOffset', sa);
        },
        applyZoomPan: function (a, b, c, d) {
          (pa.x = b), (pa.y = c), (s = a), Ha(d);
        },
        init: function () {
          if (!j && !k) {
            var c;
            (f.framework = e),
              (f.template = a),
              (f.bg = e.getChildByClass(a, 'pswp__bg')),
              (J = a.className),
              (j = !0),
              (N = e.detectFeatures()),
              (H = N.raf),
              (I = N.caf),
              (E = N.transform),
              (L = N.oldIE),
              (f.scrollWrap = e.getChildByClass(a, 'pswp__scroll-wrap')),
              (f.container = e.getChildByClass(f.scrollWrap, 'pswp__container')),
              (n = f.container.style),
              (f.itemHolders = y =
                [
                  { el: f.container.children[0], wrap: 0, index: -1 },
                  { el: f.container.children[1], wrap: 0, index: -1 },
                  { el: f.container.children[2], wrap: 0, index: -1 },
                ]),
              (y[0].el.style.display = y[2].el.style.display = 'none'),
              Wa(),
              (r = {
                resize: f.updateSize,
                orientationchange: function () {
                  clearTimeout(O),
                    (O = setTimeout(function () {
                      qa.x !== f.scrollWrap.clientWidth && f.updateSize();
                    }, 500));
                },
                scroll: Za,
                keydown: Xa,
                click: Ya,
              });
            var d = N.isOldIOSPhone || N.isOldAndroid || N.isMobileOpera;
            for (
              (N.animationName && N.transform && !d) || (i.showAnimationDuration = i.hideAnimationDuration = 0), c = 0;
              c < wa.length;
              c++
            )
              f['init' + wa[c]]();
            if (b) {
              var g = (f.ui = new b(f, e));
              g.init();
            }
            Da('firstUpdate'),
              (m = m || i.index || 0),
              (isNaN(m) || m < 0 || m >= ac()) && (m = 0),
              (f.currItem = _b(m)),
              (N.isOldIOSPhone || N.isOldAndroid) && (va = !1),
              a.setAttribute('aria-hidden', 'false'),
              i.modal &&
                (va
                  ? (a.style.position = 'fixed')
                  : ((a.style.position = 'absolute'), (a.style.top = e.getScrollY() + 'px'))),
              void 0 === M && (Da('initialLayout'), (M = K = e.getScrollY()));
            var l = 'pswp--open ';
            for (
              i.mainClass && (l += i.mainClass + ' '),
                i.showHideOpacity && (l += 'pswp--animate_opacity '),
                l += G ? 'pswp--touch' : 'pswp--notouch',
                l += N.animationName ? ' pswp--css_animation' : '',
                l += N.svg ? ' pswp--svg' : '',
                e.addClass(a, l),
                f.updateSize(),
                o = -1,
                ua = null,
                c = 0;
              c < h;
              c++
            )
              Ja((c + o) * ta.x, y[c].el.style);
            L || e.bind(f.scrollWrap, q, f),
              Ca('initialZoomInEnd', function () {
                f.setContent(y[0], m - 1),
                  f.setContent(y[2], m + 1),
                  (y[0].el.style.display = y[2].el.style.display = 'block'),
                  i.focus && a.focus(),
                  Qa();
              }),
              f.setContent(y[1], m),
              f.updateCurrItem(),
              Da('afterInit'),
              va ||
                (w = setInterval(function () {
                  _a || V || aa || s !== f.currItem.initialZoomLevel || f.updateSize();
                }, 1e3)),
              e.addClass(a, 'pswp--visible');
          }
        },
        close: function () {
          j && ((j = !1), (k = !0), Da('close'), Ra(), cc(f.currItem, null, !0, f.destroy));
        },
        destroy: function () {
          Da('destroy'),
            Xb && clearTimeout(Xb),
            a.setAttribute('aria-hidden', 'true'),
            (a.className = J),
            w && clearInterval(w),
            e.unbind(f.scrollWrap, q, f),
            e.unbind(window, 'scroll', f),
            zb(),
            cb(),
            (Ba = null);
        },
        panTo: function (a, b, c) {
          c ||
            (a > da.min.x ? (a = da.min.x) : a < da.max.x && (a = da.max.x),
            b > da.min.y ? (b = da.min.y) : b < da.max.y && (b = da.max.y)),
            (pa.x = a),
            (pa.y = b),
            Ha();
        },
        handleEvent: function (a) {
          (a = a || window.event), r[a.type] && r[a.type](a);
        },
        goTo: function (a) {
          a = Aa(a);
          var b = a - m;
          (ua = b), (m = a), (f.currItem = _b(m)), (ra -= b), Ka(ta.x * ra), cb(), (fa = !1), f.updateCurrItem();
        },
        next: function () {
          f.goTo(m + 1);
        },
        prev: function () {
          f.goTo(m - 1);
        },
        updateCurrZoomItem: function (a) {
          if ((a && Da('beforeChange', 0), y[1].el.children.length)) {
            var b = y[1].el.children[0];
            ea = e.hasClass(b, 'pswp__zoom-wrap') ? b.style : null;
          } else ea = null;
          (da = f.currItem.bounds),
            (t = s = f.currItem.initialZoomLevel),
            (pa.x = da.center.x),
            (pa.y = da.center.y),
            a && Da('afterChange');
        },
        invalidateCurrItems: function () {
          x = !0;
          for (var a = 0; a < h; a++) y[a].item && (y[a].item.needsUpdate = !0);
        },
        updateCurrItem: function (a) {
          if (0 !== ua) {
            var b,
              c = Math.abs(ua);
            if (!(a && c < 2)) {
              (f.currItem = _b(m)),
                (ya = !1),
                Da('beforeChange', ua),
                c >= h && ((o += ua + (ua > 0 ? -h : h)), (c = h));
              for (var d = 0; d < c; d++)
                ua > 0
                  ? ((b = y.shift()),
                    (y[h - 1] = b),
                    o++,
                    Ja((o + 2) * ta.x, b.el.style),
                    f.setContent(b, m - c + d + 1 + 1))
                  : ((b = y.pop()), y.unshift(b), o--, Ja(o * ta.x, b.el.style), f.setContent(b, m + c - d - 1 - 1));
              if (ea && 1 === Math.abs(ua)) {
                var e = _b(z);
                e.initialZoomLevel !== s && (ic(e, qa), mc(e), Ia(e));
              }
              (ua = 0), f.updateCurrZoomItem(), (z = m), Da('afterChange');
            }
          }
        },
        updateSize: function (b) {
          if (!va && i.modal) {
            var c = e.getScrollY();
            if (
              (M !== c && ((a.style.top = c + 'px'), (M = c)),
              !b && xa.x === window.innerWidth && xa.y === window.innerHeight)
            )
              return;
            (xa.x = window.innerWidth), (xa.y = window.innerHeight), (a.style.height = xa.y + 'px');
          }
          if (
            ((qa.x = f.scrollWrap.clientWidth),
            (qa.y = f.scrollWrap.clientHeight),
            Za(),
            (ta.x = qa.x + Math.round(qa.x * i.spacing)),
            (ta.y = qa.y),
            Ka(ta.x * ra),
            Da('beforeResize'),
            void 0 !== o)
          ) {
            for (var d, g, j, k = 0; k < h; k++)
              (d = y[k]),
                Ja((k + o) * ta.x, d.el.style),
                (j = m + k - 1),
                i.loop && ac() > 2 && (j = Aa(j)),
                (g = _b(j)),
                g && (x || g.needsUpdate || !g.bounds)
                  ? (f.cleanSlide(g),
                    f.setContent(d, j),
                    1 === k && ((f.currItem = g), f.updateCurrZoomItem(!0)),
                    (g.needsUpdate = !1))
                  : d.index === -1 && j >= 0 && f.setContent(d, j),
                g && g.container && (ic(g, qa), mc(g), Ia(g));
            x = !1;
          }
          (t = s = f.currItem.initialZoomLevel),
            (da = f.currItem.bounds),
            da && ((pa.x = da.center.x), (pa.y = da.center.y), Ha(!0)),
            Da('resize');
        },
        zoomTo: function (a, b, c, d, f) {
          b && ((t = s), (ub.x = Math.abs(b.x) - pa.x), (ub.y = Math.abs(b.y) - pa.y), Ma(oa, pa));
          var g = Sa(a, !1),
            h = {};
          Va('x', g, h, a), Va('y', g, h, a);
          var i = s,
            j = { x: pa.x, y: pa.y };
          Na(h);
          var k = function (b) {
            1 === b
              ? ((s = a), (pa.x = h.x), (pa.y = h.y))
              : ((s = (a - i) * b + i), (pa.x = (h.x - j.x) * b + j.x), (pa.y = (h.y - j.y) * b + j.y)),
              f && f(b),
              Ha(1 === b);
          };
          c ? db('customZoomTo', 0, 1, c, d || e.easing.sine.inOut, k) : k(1);
        },
      },
      fb = 30,
      gb = 10,
      hb = {},
      ib = {},
      jb = {},
      kb = {},
      lb = {},
      mb = [],
      nb = {},
      ob = [],
      pb = {},
      qb = 0,
      rb = ma(),
      sb = 0,
      tb = ma(),
      ub = ma(),
      vb = ma(),
      wb = function (a, b) {
        return a.x === b.x && a.y === b.y;
      },
      xb = function (a, b) {
        return Math.abs(a.x - b.x) < g && Math.abs(a.y - b.y) < g;
      },
      yb = function (a, b) {
        return (pb.x = Math.abs(a.x - b.x)), (pb.y = Math.abs(a.y - b.y)), Math.sqrt(pb.x * pb.x + pb.y * pb.y);
      },
      zb = function () {
        Z && (I(Z), (Z = null));
      },
      Ab = function () {
        V && ((Z = H(Ab)), Qb());
      },
      Bb = function () {
        return !('fit' === i.scaleMode && s === f.currItem.initialZoomLevel);
      },
      Cb = function (a, b) {
        return (
          !(!a || a === document) &&
          !(a.getAttribute('class') && a.getAttribute('class').indexOf('pswp__scroll-wrap') > -1) &&
          (b(a) ? a : Cb(a.parentNode, b))
        );
      },
      Db = {},
      Eb = function (a, b) {
        return (Db.prevent = !Cb(a.target, i.isClickableElement)), Da('preventDragEvent', a, b, Db), Db.prevent;
      },
      Fb = function (a, b) {
        return (b.x = a.pageX), (b.y = a.pageY), (b.id = a.identifier), b;
      },
      Gb = function (a, b, c) {
        (c.x = 0.5 * (a.x + b.x)), (c.y = 0.5 * (a.y + b.y));
      },
      Hb = function (a, b, c) {
        if (a - Q > 50) {
          var d = ob.length > 2 ? ob.shift() : {};
          (d.x = b), (d.y = c), ob.push(d), (Q = a);
        }
      },
      Ib = function () {
        var a = pa.y - f.currItem.initialPosition.y;
        return 1 - Math.abs(a / (qa.y / 2));
      },
      Jb = {},
      Kb = {},
      Lb = [],
      Mb = function (a) {
        for (; Lb.length > 0; ) Lb.pop();
        return (
          F
            ? ((la = 0),
              mb.forEach(function (a) {
                0 === la ? (Lb[0] = a) : 1 === la && (Lb[1] = a), la++;
              }))
            : a.type.indexOf('touch') > -1
            ? a.touches &&
              a.touches.length > 0 &&
              ((Lb[0] = Fb(a.touches[0], Jb)), a.touches.length > 1 && (Lb[1] = Fb(a.touches[1], Kb)))
            : ((Jb.x = a.pageX), (Jb.y = a.pageY), (Jb.id = ''), (Lb[0] = Jb)),
          Lb
        );
      },
      Nb = function (a, b) {
        var c,
          d,
          e,
          g,
          h = 0,
          j = pa[a] + b[a],
          k = b[a] > 0,
          l = tb.x + b.x,
          m = tb.x - nb.x;
        return (
          (c = j > da.min[a] || j < da.max[a] ? i.panEndFriction : 1),
          (j = pa[a] + b[a] * c),
          (!i.allowPanToNext && s !== f.currItem.initialZoomLevel) ||
          (ea
            ? 'h' !== ga ||
              'x' !== a ||
              X ||
              (k
                ? (j > da.min[a] && ((c = i.panEndFriction), (h = da.min[a] - j), (d = da.min[a] - oa[a])),
                  (d <= 0 || m < 0) && ac() > 1
                    ? ((g = l), m < 0 && l > nb.x && (g = nb.x))
                    : da.min.x !== da.max.x && (e = j))
                : (j < da.max[a] && ((c = i.panEndFriction), (h = j - da.max[a]), (d = oa[a] - da.max[a])),
                  (d <= 0 || m > 0) && ac() > 1
                    ? ((g = l), m > 0 && l < nb.x && (g = nb.x))
                    : da.min.x !== da.max.x && (e = j)))
            : (g = l),
          'x' !== a)
            ? void (fa || $ || (s > f.currItem.fitRatio && (pa[a] += b[a] * c)))
            : (void 0 !== g && (Ka(g, !0), ($ = g !== nb.x)),
              da.min.x !== da.max.x && (void 0 !== e ? (pa.x = e) : $ || (pa.x += b.x * c)),
              void 0 !== g)
        );
      },
      Ob = function (a) {
        if (!('mousedown' === a.type && a.button > 0)) {
          if ($b) return void a.preventDefault();
          if (!U || 'mousedown' !== a.type) {
            if ((Eb(a, !0) && a.preventDefault(), Da('pointerDown'), F)) {
              var b = e.arraySearch(mb, a.pointerId, 'id');
              b < 0 && (b = mb.length), (mb[b] = { x: a.pageX, y: a.pageY, id: a.pointerId });
            }
            var c = Mb(a),
              d = c.length;
            (_ = null),
              cb(),
              (V && 1 !== d) ||
                ((V = ha = !0),
                e.bind(window, p, f),
                (S = ka = ia = T = $ = Y = W = X = !1),
                (ga = null),
                Da('firstTouchStart', c),
                Ma(oa, pa),
                (na.x = na.y = 0),
                Ma(kb, c[0]),
                Ma(lb, kb),
                (nb.x = ta.x * ra),
                (ob = [{ x: kb.x, y: kb.y }]),
                (Q = P = Ea()),
                Sa(s, !0),
                zb(),
                Ab()),
              !aa &&
                d > 1 &&
                !fa &&
                !$ &&
                ((t = s),
                (X = !1),
                (aa = W = !0),
                (na.y = na.x = 0),
                Ma(oa, pa),
                Ma(hb, c[0]),
                Ma(ib, c[1]),
                Gb(hb, ib, vb),
                (ub.x = Math.abs(vb.x) - pa.x),
                (ub.y = Math.abs(vb.y) - pa.y),
                (ba = ca = yb(hb, ib)));
          }
        }
      },
      Pb = function (a) {
        if ((a.preventDefault(), F)) {
          var b = e.arraySearch(mb, a.pointerId, 'id');
          if (b > -1) {
            var c = mb[b];
            (c.x = a.pageX), (c.y = a.pageY);
          }
        }
        if (V) {
          var d = Mb(a);
          if (ga || Y || aa) _ = d;
          else if (tb.x !== ta.x * ra) ga = 'h';
          else {
            var f = Math.abs(d[0].x - kb.x) - Math.abs(d[0].y - kb.y);
            Math.abs(f) >= gb && ((ga = f > 0 ? 'h' : 'v'), (_ = d));
          }
        }
      },
      Qb = function () {
        if (_) {
          var a = _.length;
          if (0 !== a)
            if ((Ma(hb, _[0]), (jb.x = hb.x - kb.x), (jb.y = hb.y - kb.y), aa && a > 1)) {
              if (((kb.x = hb.x), (kb.y = hb.y), !jb.x && !jb.y && wb(_[1], ib))) return;
              Ma(ib, _[1]), X || ((X = !0), Da('zoomGestureStarted'));
              var b = yb(hb, ib),
                c = Vb(b);
              c > f.currItem.initialZoomLevel + f.currItem.initialZoomLevel / 15 && (ka = !0);
              var d = 1,
                e = Ta(),
                g = Ua();
              if (c < e)
                if (i.pinchToClose && !ka && t <= f.currItem.initialZoomLevel) {
                  var h = e - c,
                    j = 1 - h / (e / 1.2);
                  Fa(j), Da('onPinchClose', j), (ia = !0);
                } else (d = (e - c) / e), d > 1 && (d = 1), (c = e - d * (e / 3));
              else c > g && ((d = (c - g) / (6 * e)), d > 1 && (d = 1), (c = g + d * e));
              d < 0 && (d = 0),
                (ba = b),
                Gb(hb, ib, rb),
                (na.x += rb.x - vb.x),
                (na.y += rb.y - vb.y),
                Ma(vb, rb),
                (pa.x = La('x', c)),
                (pa.y = La('y', c)),
                (S = c > s),
                (s = c),
                Ha();
            } else {
              if (!ga) return;
              if (
                (ha &&
                  ((ha = !1),
                  Math.abs(jb.x) >= gb && (jb.x -= _[0].x - lb.x),
                  Math.abs(jb.y) >= gb && (jb.y -= _[0].y - lb.y)),
                (kb.x = hb.x),
                (kb.y = hb.y),
                0 === jb.x && 0 === jb.y)
              )
                return;
              if ('v' === ga && i.closeOnVerticalDrag && !Bb()) {
                (na.y += jb.y), (pa.y += jb.y);
                var k = Ib();
                return (T = !0), Da('onVerticalDrag', k), Fa(k), void Ha();
              }
              Hb(Ea(), hb.x, hb.y), (Y = !0), (da = f.currItem.bounds);
              var l = Nb('x', jb);
              l || (Nb('y', jb), Na(pa), Ha());
            }
        }
      },
      Rb = function (a) {
        if (N.isOldAndroid) {
          if (U && 'mouseup' === a.type) return;
          a.type.indexOf('touch') > -1 &&
            (clearTimeout(U),
            (U = setTimeout(function () {
              U = 0;
            }, 600)));
        }
        Da('pointerUp'), Eb(a, !1) && a.preventDefault();
        var b;
        if (F) {
          var c = e.arraySearch(mb, a.pointerId, 'id');
          if (c > -1)
            if (((b = mb.splice(c, 1)[0]), navigator.msPointerEnabled)) {
              var d = { 4: 'mouse', 2: 'touch', 3: 'pen' };
              (b.type = d[a.pointerType]), b.type || (b.type = a.pointerType || 'mouse');
            } else b.type = a.pointerType || 'mouse';
        }
        var g,
          h = Mb(a),
          j = h.length;
        if (('mouseup' === a.type && (j = 0), 2 === j)) return (_ = null), !0;
        1 === j && Ma(lb, h[0]),
          0 !== j ||
            ga ||
            fa ||
            (b ||
              ('mouseup' === a.type
                ? (b = { x: a.pageX, y: a.pageY, type: 'mouse' })
                : a.changedTouches &&
                  a.changedTouches[0] &&
                  (b = { x: a.changedTouches[0].pageX, y: a.changedTouches[0].pageY, type: 'touch' })),
            Da('touchRelease', a, b));
        var k = -1;
        if (
          (0 === j && ((V = !1), e.unbind(window, p, f), zb(), aa ? (k = 0) : sb !== -1 && (k = Ea() - sb)),
          (sb = 1 === j ? Ea() : -1),
          (g = k !== -1 && k < 150 ? 'zoom' : 'swipe'),
          aa && j < 2 && ((aa = !1), 1 === j && (g = 'zoomPointerUp'), Da('zoomGestureEnded')),
          (_ = null),
          Y || X || fa || T)
        )
          if ((cb(), R || (R = Sb()), R.calculateSwipeSpeed('x'), T)) {
            var l = Ib();
            if (l < i.verticalDragRange) f.close();
            else {
              var m = pa.y,
                n = ja;
              db('verticalDrag', 0, 1, 300, e.easing.cubic.out, function (a) {
                (pa.y = (f.currItem.initialPosition.y - m) * a + m), Fa((1 - n) * a + n), Ha();
              }),
                Da('onVerticalDrag', 1);
            }
          } else {
            if (($ || fa) && 0 === j) {
              var o = Ub(g, R);
              if (o) return;
              g = 'zoomPointerUp';
            }
            if (!fa) return 'swipe' !== g ? void Wb() : void (!$ && s > f.currItem.fitRatio && Tb(R));
          }
      },
      Sb = function () {
        var a,
          b,
          c = {
            lastFlickOffset: {},
            lastFlickDist: {},
            lastFlickSpeed: {},
            slowDownRatio: {},
            slowDownRatioReverse: {},
            speedDecelerationRatio: {},
            speedDecelerationRatioAbs: {},
            distanceOffset: {},
            backAnimDestination: {},
            backAnimStarted: {},
            calculateSwipeSpeed: function (d) {
              ob.length > 1 ? ((a = Ea() - Q + 50), (b = ob[ob.length - 2][d])) : ((a = Ea() - P), (b = lb[d])),
                (c.lastFlickOffset[d] = kb[d] - b),
                (c.lastFlickDist[d] = Math.abs(c.lastFlickOffset[d])),
                c.lastFlickDist[d] > 20 ? (c.lastFlickSpeed[d] = c.lastFlickOffset[d] / a) : (c.lastFlickSpeed[d] = 0),
                Math.abs(c.lastFlickSpeed[d]) < 0.1 && (c.lastFlickSpeed[d] = 0),
                (c.slowDownRatio[d] = 0.95),
                (c.slowDownRatioReverse[d] = 1 - c.slowDownRatio[d]),
                (c.speedDecelerationRatio[d] = 1);
            },
            calculateOverBoundsAnimOffset: function (a, b) {
              c.backAnimStarted[a] ||
                (pa[a] > da.min[a]
                  ? (c.backAnimDestination[a] = da.min[a])
                  : pa[a] < da.max[a] && (c.backAnimDestination[a] = da.max[a]),
                void 0 !== c.backAnimDestination[a] &&
                  ((c.slowDownRatio[a] = 0.7),
                  (c.slowDownRatioReverse[a] = 1 - c.slowDownRatio[a]),
                  c.speedDecelerationRatioAbs[a] < 0.05 &&
                    ((c.lastFlickSpeed[a] = 0),
                    (c.backAnimStarted[a] = !0),
                    db('bounceZoomPan' + a, pa[a], c.backAnimDestination[a], b || 300, e.easing.sine.out, function (b) {
                      (pa[a] = b), Ha();
                    }))));
            },
            calculateAnimOffset: function (a) {
              c.backAnimStarted[a] ||
                ((c.speedDecelerationRatio[a] =
                  c.speedDecelerationRatio[a] *
                  (c.slowDownRatio[a] + c.slowDownRatioReverse[a] - (c.slowDownRatioReverse[a] * c.timeDiff) / 10)),
                (c.speedDecelerationRatioAbs[a] = Math.abs(c.lastFlickSpeed[a] * c.speedDecelerationRatio[a])),
                (c.distanceOffset[a] = c.lastFlickSpeed[a] * c.speedDecelerationRatio[a] * c.timeDiff),
                (pa[a] += c.distanceOffset[a]));
            },
            panAnimLoop: function () {
              if (
                $a.zoomPan &&
                (($a.zoomPan.raf = H(c.panAnimLoop)),
                (c.now = Ea()),
                (c.timeDiff = c.now - c.lastNow),
                (c.lastNow = c.now),
                c.calculateAnimOffset('x'),
                c.calculateAnimOffset('y'),
                Ha(),
                c.calculateOverBoundsAnimOffset('x'),
                c.calculateOverBoundsAnimOffset('y'),
                c.speedDecelerationRatioAbs.x < 0.05 && c.speedDecelerationRatioAbs.y < 0.05)
              )
                return (pa.x = Math.round(pa.x)), (pa.y = Math.round(pa.y)), Ha(), void ab('zoomPan');
            },
          };
        return c;
      },
      Tb = function (a) {
        return (
          a.calculateSwipeSpeed('y'),
          (da = f.currItem.bounds),
          (a.backAnimDestination = {}),
          (a.backAnimStarted = {}),
          Math.abs(a.lastFlickSpeed.x) <= 0.05 && Math.abs(a.lastFlickSpeed.y) <= 0.05
            ? ((a.speedDecelerationRatioAbs.x = a.speedDecelerationRatioAbs.y = 0),
              a.calculateOverBoundsAnimOffset('x'),
              a.calculateOverBoundsAnimOffset('y'),
              !0)
            : (bb('zoomPan'), (a.lastNow = Ea()), void a.panAnimLoop())
        );
      },
      Ub = function (a, b) {
        var c;
        fa || (qb = m);
        var d;
        if ('swipe' === a) {
          var g = kb.x - lb.x,
            h = b.lastFlickDist.x < 10;
          g > fb && (h || b.lastFlickOffset.x > 20) ? (d = -1) : g < -fb && (h || b.lastFlickOffset.x < -20) && (d = 1);
        }
        var j;
        d &&
          ((m += d),
          m < 0 ? ((m = i.loop ? ac() - 1 : 0), (j = !0)) : m >= ac() && ((m = i.loop ? 0 : ac() - 1), (j = !0)),
          (j && !i.loop) || ((ua += d), (ra -= d), (c = !0)));
        var k,
          l = ta.x * ra,
          n = Math.abs(l - tb.x);
        return (
          c || l > tb.x == b.lastFlickSpeed.x > 0
            ? ((k = Math.abs(b.lastFlickSpeed.x) > 0 ? n / Math.abs(b.lastFlickSpeed.x) : 333),
              (k = Math.min(k, 400)),
              (k = Math.max(k, 250)))
            : (k = 333),
          qb === m && (c = !1),
          (fa = !0),
          Da('mainScrollAnimStart'),
          db('mainScroll', tb.x, l, k, e.easing.cubic.out, Ka, function () {
            cb(), (fa = !1), (qb = -1), (c || qb !== m) && f.updateCurrItem(), Da('mainScrollAnimComplete');
          }),
          c && f.updateCurrItem(!0),
          c
        );
      },
      Vb = function (a) {
        return (1 / ca) * a * t;
      },
      Wb = function () {
        var a = s,
          b = Ta(),
          c = Ua();
        s < b ? (a = b) : s > c && (a = c);
        var d,
          g = 1,
          h = ja;
        return ia && !S && !ka && s < b
          ? (f.close(), !0)
          : (ia &&
              (d = function (a) {
                Fa((g - h) * a + h);
              }),
            f.zoomTo(a, 0, 200, e.easing.cubic.out, d),
            !0);
      };
    za('Gestures', {
      publicMethods: {
        initGestures: function () {
          var a = function (a, b, c, d, e) {
            (A = a + b), (B = a + c), (C = a + d), (D = e ? a + e : '');
          };
          (F = N.pointerEvent),
            F && N.touch && (N.touch = !1),
            F
              ? navigator.msPointerEnabled
                ? a('MSPointer', 'Down', 'Move', 'Up', 'Cancel')
                : a('pointer', 'down', 'move', 'up', 'cancel')
              : N.touch
              ? (a('touch', 'start', 'move', 'end', 'cancel'), (G = !0))
              : a('mouse', 'down', 'move', 'up'),
            (p = B + ' ' + C + ' ' + D),
            (q = A),
            F && !G && (G = navigator.maxTouchPoints > 1 || navigator.msMaxTouchPoints > 1),
            (f.likelyTouchDevice = G),
            (r[A] = Ob),
            (r[B] = Pb),
            (r[C] = Rb),
            D && (r[D] = r[C]),
            N.touch &&
              ((q += ' mousedown'),
              (p += ' mousemove mouseup'),
              (r.mousedown = r[A]),
              (r.mousemove = r[B]),
              (r.mouseup = r[C])),
            G || (i.allowPanToNext = !1);
        },
      },
    });
    var Xb,
      Yb,
      Zb,
      $b,
      _b,
      ac,
      bc,
      cc = function (b, c, d, g) {
        Xb && clearTimeout(Xb), ($b = !0), (Zb = !0);
        var h;
        b.initialLayout
          ? ((h = b.initialLayout), (b.initialLayout = null))
          : (h = i.getThumbBoundsFn && i.getThumbBoundsFn(m));
        var j = d ? i.hideAnimationDuration : i.showAnimationDuration,
          k = function () {
            ab('initialZoom'),
              d
                ? (f.template.removeAttribute('style'), f.bg.removeAttribute('style'))
                : (Fa(1),
                  c && (c.style.display = 'block'),
                  e.addClass(a, 'pswp--animated-in'),
                  Da('initialZoom' + (d ? 'OutEnd' : 'InEnd'))),
              g && g(),
              ($b = !1);
          };
        if (!j || !h || void 0 === h.x)
          return (
            Da('initialZoom' + (d ? 'Out' : 'In')),
            (s = b.initialZoomLevel),
            Ma(pa, b.initialPosition),
            Ha(),
            (a.style.opacity = d ? 0 : 1),
            Fa(1),
            void (j
              ? setTimeout(function () {
                  k();
                }, j)
              : k())
          );
        var n = function () {
          var c = l,
            g = !f.currItem.src || f.currItem.loadError || i.showHideOpacity;
          b.miniImg && (b.miniImg.style.webkitBackfaceVisibility = 'hidden'),
            d ||
              ((s = h.w / b.w), (pa.x = h.x), (pa.y = h.y - K), (f[g ? 'template' : 'bg'].style.opacity = 0.001), Ha()),
            bb('initialZoom'),
            d && !c && e.removeClass(a, 'pswp--animated-in'),
            g &&
              (d
                ? e[(c ? 'remove' : 'add') + 'Class'](a, 'pswp--animate_opacity')
                : setTimeout(function () {
                    e.addClass(a, 'pswp--animate_opacity');
                  }, 30)),
            (Xb = setTimeout(
              function () {
                if ((Da('initialZoom' + (d ? 'Out' : 'In')), d)) {
                  var f = h.w / b.w,
                    i = { x: pa.x, y: pa.y },
                    l = s,
                    m = ja,
                    n = function (b) {
                      1 === b
                        ? ((s = f), (pa.x = h.x), (pa.y = h.y - M))
                        : ((s = (f - l) * b + l), (pa.x = (h.x - i.x) * b + i.x), (pa.y = (h.y - M - i.y) * b + i.y)),
                        Ha(),
                        g ? (a.style.opacity = 1 - b) : Fa(m - b * m);
                    };
                  c ? db('initialZoom', 0, 1, j, e.easing.cubic.out, n, k) : (n(1), (Xb = setTimeout(k, j + 20)));
                } else
                  (s = b.initialZoomLevel),
                    Ma(pa, b.initialPosition),
                    Ha(),
                    Fa(1),
                    g ? (a.style.opacity = 1) : Fa(1),
                    (Xb = setTimeout(k, j + 20));
              },
              d ? 25 : 90
            ));
        };
        n();
      },
      dc = {},
      ec = [],
      fc = {
        index: 0,
        errorMsg:
          '<div class="pswp__error-msg"><a href="%url%" target="_blank">The image</a> could not be loaded.</div>',
        forceProgressiveLoading: !1,
        preload: [1, 1],
        getNumItemsFn: function () {
          return Yb.length;
        },
      },
      gc = function () {
        return { center: { x: 0, y: 0 }, max: { x: 0, y: 0 }, min: { x: 0, y: 0 } };
      },
      hc = function (a, b, c) {
        var d = a.bounds;
        (d.center.x = Math.round((dc.x - b) / 2)),
          (d.center.y = Math.round((dc.y - c) / 2) + a.vGap.top),
          (d.max.x = b > dc.x ? Math.round(dc.x - b) : d.center.x),
          (d.max.y = c > dc.y ? Math.round(dc.y - c) + a.vGap.top : d.center.y),
          (d.min.x = b > dc.x ? 0 : d.center.x),
          (d.min.y = c > dc.y ? a.vGap.top : d.center.y);
      },
      ic = function (a, b, c) {
        if (a.src && !a.loadError) {
          var d = !c;
          if (
            (d && (a.vGap || (a.vGap = { top: 0, bottom: 0 }), Da('parseVerticalMargin', a)),
            (dc.x = b.x),
            (dc.y = b.y - a.vGap.top - a.vGap.bottom),
            d)
          ) {
            var e = dc.x / a.w,
              f = dc.y / a.h;
            a.fitRatio = e < f ? e : f;
            var g = i.scaleMode;
            'orig' === g ? (c = 1) : 'fit' === g && (c = a.fitRatio),
              c > 1 && (c = 1),
              (a.initialZoomLevel = c),
              a.bounds || (a.bounds = gc());
          }
          if (!c) return;
          return (
            hc(a, a.w * c, a.h * c), d && c === a.initialZoomLevel && (a.initialPosition = a.bounds.center), a.bounds
          );
        }
        return (
          (a.w = a.h = 0),
          (a.initialZoomLevel = a.fitRatio = 1),
          (a.bounds = gc()),
          (a.initialPosition = a.bounds.center),
          a.bounds
        );
      },
      jc = function (a, b, c, d, e, g) {
        b.loadError ||
          (d &&
            ((b.imageAppended = !0),
            mc(b, d, b === f.currItem && ya),
            c.appendChild(d),
            g &&
              setTimeout(function () {
                b && b.loaded && b.placeholder && ((b.placeholder.style.display = 'none'), (b.placeholder = null));
              }, 500)));
      },
      kc = function (a) {
        (a.loading = !0), (a.loaded = !1);
        var b = (a.img = e.createEl('pswp__img', 'img')),
          c = function () {
            (a.loading = !1),
              (a.loaded = !0),
              a.loadComplete ? a.loadComplete(a) : (a.img = null),
              (b.onload = b.onerror = null),
              (b = null);
          };
        return (
          (b.onload = c),
          (b.onerror = function () {
            (a.loadError = !0), c();
          }),
          (b.src = a.src),
          b
        );
      },
      lc = function (a, b) {
        if (a.src && a.loadError && a.container)
          return b && (a.container.innerHTML = ''), (a.container.innerHTML = i.errorMsg.replace('%url%', a.src)), !0;
      },
      mc = function (a, b, c) {
        if (a.src) {
          b || (b = a.container.lastChild);
          var d = c ? a.w : Math.round(a.w * a.fitRatio),
            e = c ? a.h : Math.round(a.h * a.fitRatio);
          a.placeholder &&
            !a.loaded &&
            ((a.placeholder.style.width = d + 'px'), (a.placeholder.style.height = e + 'px')),
            (b.style.width = d + 'px'),
            (b.style.height = e + 'px');
        }
      },
      nc = function () {
        if (ec.length) {
          for (var a, b = 0; b < ec.length; b++)
            (a = ec[b]), a.holder.index === a.index && jc(a.index, a.item, a.baseDiv, a.img, !1, a.clearPlaceholder);
          ec = [];
        }
      };
    za('Controller', {
      publicMethods: {
        lazyLoadItem: function (a) {
          a = Aa(a);
          var b = _b(a);
          b && ((!b.loaded && !b.loading) || x) && (Da('gettingData', a, b), b.src && kc(b));
        },
        initController: function () {
          e.extend(i, fc, !0),
            (f.items = Yb = c),
            (_b = f.getItemAt),
            (ac = i.getNumItemsFn),
            (bc = i.loop),
            ac() < 3 && (i.loop = !1),
            Ca('beforeChange', function (a) {
              var b,
                c = i.preload,
                d = null === a || a >= 0,
                e = Math.min(c[0], ac()),
                g = Math.min(c[1], ac());
              for (b = 1; b <= (d ? g : e); b++) f.lazyLoadItem(m + b);
              for (b = 1; b <= (d ? e : g); b++) f.lazyLoadItem(m - b);
            }),
            Ca('initialLayout', function () {
              f.currItem.initialLayout = i.getThumbBoundsFn && i.getThumbBoundsFn(m);
            }),
            Ca('mainScrollAnimComplete', nc),
            Ca('initialZoomInEnd', nc),
            Ca('destroy', function () {
              for (var a, b = 0; b < Yb.length; b++)
                (a = Yb[b]),
                  a.container && (a.container = null),
                  a.placeholder && (a.placeholder = null),
                  a.img && (a.img = null),
                  a.preloader && (a.preloader = null),
                  a.loadError && (a.loaded = a.loadError = !1);
              ec = null;
            });
        },
        getItemAt: function (a) {
          return a >= 0 && void 0 !== Yb[a] && Yb[a];
        },
        allowProgressiveImg: function () {
          return i.forceProgressiveLoading || !G || i.mouseUsed || screen.width > 1200;
        },
        setContent: function (a, b) {
          i.loop && (b = Aa(b));
          var c = f.getItemAt(a.index);
          c && (c.container = null);
          var d,
            g = f.getItemAt(b);
          if (!g) return void (a.el.innerHTML = '');
          Da('gettingData', b, g), (a.index = b), (a.item = g);
          var h = (g.container = e.createEl('pswp__zoom-wrap'));
          if (
            (!g.src && g.html && (g.html.tagName ? h.appendChild(g.html) : (h.innerHTML = g.html)),
            lc(g),
            ic(g, qa),
            !g.src || g.loadError || g.loaded)
          )
            g.src &&
              !g.loadError &&
              ((d = e.createEl('pswp__img', 'img')),
              (d.style.opacity = 1),
              (d.src = g.src),
              mc(g, d),
              jc(b, g, h, d, !0));
          else {
            if (
              ((g.loadComplete = function (c) {
                if (j) {
                  if (a && a.index === b) {
                    if (lc(c, !0))
                      return (
                        (c.loadComplete = c.img = null),
                        ic(c, qa),
                        Ia(c),
                        void (a.index === m && f.updateCurrZoomItem())
                      );
                    c.imageAppended
                      ? !$b && c.placeholder && ((c.placeholder.style.display = 'none'), (c.placeholder = null))
                      : N.transform && (fa || $b)
                      ? ec.push({ item: c, baseDiv: h, img: c.img, index: b, holder: a, clearPlaceholder: !0 })
                      : jc(b, c, h, c.img, fa || $b, !0);
                  }
                  (c.loadComplete = null), (c.img = null), Da('imageLoadComplete', b, c);
                }
              }),
              e.features.transform)
            ) {
              var k = 'pswp__img pswp__img--placeholder';
              k += g.msrc ? '' : ' pswp__img--placeholder--blank';
              var l = e.createEl(k, g.msrc ? 'img' : '');
              g.msrc && (l.src = g.msrc), mc(g, l), h.appendChild(l), (g.placeholder = l);
            }
            g.loading || kc(g),
              f.allowProgressiveImg() &&
                (!Zb && N.transform
                  ? ec.push({ item: g, baseDiv: h, img: g.img, index: b, holder: a })
                  : jc(b, g, h, g.img, !0, !0));
          }
          Zb || b !== m ? Ia(g) : ((ea = h.style), cc(g, d || g.img)), (a.el.innerHTML = ''), a.el.appendChild(h);
        },
        cleanSlide: function (a) {
          a.img && (a.img.onload = a.img.onerror = null), (a.loaded = a.loading = a.img = a.imageAppended = !1);
        },
      },
    });
    var oc,
      pc = {},
      qc = function (a, b, c) {
        var d = document.createEvent('CustomEvent'),
          e = { origEvent: a, target: a.target, releasePoint: b, pointerType: c || 'touch' };
        d.initCustomEvent('pswpTap', !0, !0, e), a.target.dispatchEvent(d);
      };
    za('Tap', {
      publicMethods: {
        initTap: function () {
          Ca('firstTouchStart', f.onTapStart),
            Ca('touchRelease', f.onTapRelease),
            Ca('destroy', function () {
              (pc = {}), (oc = null);
            });
        },
        onTapStart: function (a) {
          a.length > 1 && (clearTimeout(oc), (oc = null));
        },
        onTapRelease: function (a, b) {
          if (b && !Y && !W && !_a) {
            var c = b;
            if (oc && (clearTimeout(oc), (oc = null), xb(c, pc))) return void Da('doubleTap', c);
            if ('mouse' === b.type) return void qc(a, b, 'mouse');
            var d = a.target.tagName.toUpperCase();
            if ('BUTTON' === d || e.hasClass(a.target, 'pswp__single-tap')) return void qc(a, b);
            Ma(pc, c),
              (oc = setTimeout(function () {
                qc(a, b), (oc = null);
              }, 300));
          }
        },
      },
    });
    var rc;
    za('DesktopZoom', {
      publicMethods: {
        initDesktopZoom: function () {
          L ||
            (G
              ? Ca('mouseUsed', function () {
                  f.setupDesktopZoom();
                })
              : f.setupDesktopZoom(!0));
        },
        setupDesktopZoom: function (b) {
          rc = {};
          var c = 'wheel mousewheel DOMMouseScroll';
          Ca('bindEvents', function () {
            e.bind(a, c, f.handleMouseWheel);
          }),
            Ca('unbindEvents', function () {
              rc && e.unbind(a, c, f.handleMouseWheel);
            }),
            (f.mouseZoomedIn = !1);
          var d,
            g = function () {
              f.mouseZoomedIn && (e.removeClass(a, 'pswp--zoomed-in'), (f.mouseZoomedIn = !1)),
                s < 1 ? e.addClass(a, 'pswp--zoom-allowed') : e.removeClass(a, 'pswp--zoom-allowed'),
                h();
            },
            h = function () {
              d && (e.removeClass(a, 'pswp--dragging'), (d = !1));
            };
          Ca('resize', g),
            Ca('afterChange', g),
            Ca('pointerDown', function () {
              f.mouseZoomedIn && ((d = !0), e.addClass(a, 'pswp--dragging'));
            }),
            Ca('pointerUp', h),
            b || g();
        },
        handleMouseWheel: function (a) {
          if (s <= f.currItem.fitRatio)
            return (
              i.modal &&
                (!i.closeOnScroll || _a || V
                  ? a.preventDefault()
                  : E && Math.abs(a.deltaY) > 2 && ((l = !0), f.close())),
              !0
            );
          if ((a.stopPropagation(), (rc.x = 0), 'deltaX' in a))
            1 === a.deltaMode
              ? ((rc.x = 18 * a.deltaX), (rc.y = 18 * a.deltaY))
              : ((rc.x = a.deltaX), (rc.y = a.deltaY));
          else if ('wheelDelta' in a)
            a.wheelDeltaX && (rc.x = -0.16 * a.wheelDeltaX),
              a.wheelDeltaY ? (rc.y = -0.16 * a.wheelDeltaY) : (rc.y = -0.16 * a.wheelDelta);
          else {
            if (!('detail' in a)) return;
            rc.y = a.detail;
          }
          Sa(s, !0);
          var b = pa.x - rc.x,
            c = pa.y - rc.y;
          (i.modal || (b <= da.min.x && b >= da.max.x && c <= da.min.y && c >= da.max.y)) && a.preventDefault(),
            f.panTo(b, c);
        },
        toggleDesktopZoom: function (b) {
          b = b || { x: qa.x / 2 + sa.x, y: qa.y / 2 + sa.y };
          var c = i.getDoubleTapZoom(!0, f.currItem),
            d = s === c;
          (f.mouseZoomedIn = !d),
            f.zoomTo(d ? f.currItem.initialZoomLevel : c, b, 333),
            e[(d ? 'remove' : 'add') + 'Class'](a, 'pswp--zoomed-in');
        },
      },
    });
    var sc,
      tc,
      uc,
      vc,
      wc,
      xc,
      yc,
      zc,
      Ac,
      Bc,
      Cc,
      Dc,
      Ec = { history: !0, galleryUID: 1 },
      Fc = function () {
        return Cc.hash.substring(1);
      },
      Gc = function () {
        sc && clearTimeout(sc), uc && clearTimeout(uc);
      },
      Hc = function () {
        var a = Fc(),
          b = {};
        if (a.length < 5) return b;
        var c,
          d = a.split('&');
        for (c = 0; c < d.length; c++)
          if (d[c]) {
            var e = d[c].split('=');
            e.length < 2 || (b[e[0]] = e[1]);
          }
        if (i.galleryPIDs) {
          var f = b.pid;
          for (b.pid = 0, c = 0; c < Yb.length; c++)
            if (Yb[c].pid === f) {
              b.pid = c;
              break;
            }
        } else b.pid = parseInt(b.pid, 10) - 1;
        return b.pid < 0 && (b.pid = 0), b;
      },
      Ic = function () {
        if ((uc && clearTimeout(uc), _a || V)) return void (uc = setTimeout(Ic, 500));
        vc ? clearTimeout(tc) : (vc = !0);
        var a = m + 1,
          b = _b(m);
        b.hasOwnProperty('pid') && (a = b.pid);
        var c = yc + '&gid=' + i.galleryUID + '&pid=' + a;
        zc || (Cc.hash.indexOf(c) === -1 && (Bc = !0));
        var d = Cc.href.split('#')[0] + '#' + c;
        Dc
          ? '#' + c !== window.location.hash && history[zc ? 'replaceState' : 'pushState']('', document.title, d)
          : zc
          ? Cc.replace(d)
          : (Cc.hash = c),
          (zc = !0),
          (tc = setTimeout(function () {
            vc = !1;
          }, 60));
      };
    za('History', {
      publicMethods: {
        initHistory: function () {
          if ((e.extend(i, Ec, !0), i.history)) {
            (Cc = window.location),
              (Bc = !1),
              (Ac = !1),
              (zc = !1),
              (yc = Fc()),
              (Dc = 'pushState' in history),
              yc.indexOf('gid=') > -1 && ((yc = yc.split('&gid=')[0]), (yc = yc.split('?gid=')[0])),
              Ca('afterChange', f.updateURL),
              Ca('unbindEvents', function () {
                e.unbind(window, 'hashchange', f.onHashChange);
              });
            var a = function () {
              (xc = !0),
                Ac ||
                  (Bc
                    ? history.back()
                    : yc
                    ? (Cc.hash = yc)
                    : Dc
                    ? history.pushState('', document.title, Cc.pathname + Cc.search)
                    : (Cc.hash = '')),
                Gc();
            };
            Ca('unbindEvents', function () {
              l && a();
            }),
              Ca('destroy', function () {
                xc || a();
              }),
              Ca('firstUpdate', function () {
                m = Hc().pid;
              });
            var b = yc.indexOf('pid=');
            b > -1 && ((yc = yc.substring(0, b)), '&' === yc.slice(-1) && (yc = yc.slice(0, -1))),
              setTimeout(function () {
                j && e.bind(window, 'hashchange', f.onHashChange);
              }, 40);
          }
        },
        onHashChange: function () {
          return Fc() === yc ? ((Ac = !0), void f.close()) : void (vc || ((wc = !0), f.goTo(Hc().pid), (wc = !1)));
        },
        updateURL: function () {
          Gc(), wc || (zc ? (sc = setTimeout(Ic, 800)) : Ic());
        },
      },
    }),
      e.extend(f, eb);
  };
  return a;
});

/*! PhotoSwipe Default UI - 4.1.3 - 2019-01-08
 * http://photoswipe.com
 * Copyright (c) 2019 Dmitry Semenov; */
!(function (a, b) {
  'function' == typeof define && define.amd
    ? define(b)
    : 'object' == typeof exports
    ? (module.exports = b())
    : (a.PhotoSwipeUI_Default = b());
})(this, function () {
  'use strict';
  var a = function (a, b) {
    var c,
      d,
      e,
      f,
      g,
      h,
      i,
      j,
      k,
      l,
      m,
      n,
      o,
      p,
      q,
      r,
      s,
      t,
      u,
      v = this,
      w = !1,
      x = !0,
      y = !0,
      z = {
        barsSize: { top: 44, bottom: 'auto' },
        closeElClasses: ['item', 'caption', 'zoom-wrap', 'ui', 'top-bar'],
        timeToIdle: 4e3,
        timeToIdleOutside: 1e3,
        loadingIndicatorDelay: 1e3,
        addCaptionHTMLFn: function (a, b) {
          return a.title ? ((b.children[0].innerHTML = a.title), !0) : ((b.children[0].innerHTML = ''), !1);
        },
        closeEl: !0,
        captionEl: !0,
        fullscreenEl: !0,
        zoomEl: !0,
        shareEl: !0,
        counterEl: !0,
        arrowEl: !0,
        preloaderEl: !0,
        tapToClose: !1,
        tapToToggleControls: !0,
        clickToCloseNonZoomable: !0,
        shareButtons: [
          { id: 'facebook', label: 'Share on Facebook', url: 'https://www.facebook.com/sharer/sharer.php?u={{url}}' },
          { id: 'twitter', label: 'Tweet', url: 'https://twitter.com/intent/tweet?text={{text}}&url={{url}}' },
          {
            id: 'pinterest',
            label: 'Pin it',
            url: 'http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}',
          },
          { id: 'download', label: 'Download image', url: '{{raw_image_url}}', download: !0 },
        ],
        getImageURLForShare: function () {
          return a.currItem.src || '';
        },
        getPageURLForShare: function () {
          return window.location.href;
        },
        getTextForShare: function () {
          return a.currItem.title || '';
        },
        indexIndicatorSep: ' / ',
        fitControlsWidth: 1200,
      },
      A = function (a) {
        if (r) return !0;
        (a = a || window.event), q.timeToIdle && q.mouseUsed && !k && K();
        for (var c, d, e = a.target || a.srcElement, f = e.getAttribute('class') || '', g = 0; g < S.length; g++)
          (c = S[g]), c.onTap && f.indexOf('pswp__' + c.name) > -1 && (c.onTap(), (d = !0));
        if (d) {
          a.stopPropagation && a.stopPropagation(), (r = !0);
          var h = b.features.isOldAndroid ? 600 : 30;
          s = setTimeout(function () {
            r = !1;
          }, h);
        }
      },
      B = function () {
        return !a.likelyTouchDevice || q.mouseUsed || screen.width > q.fitControlsWidth;
      },
      C = function (a, c, d) {
        b[(d ? 'add' : 'remove') + 'Class'](a, 'pswp__' + c);
      },
      D = function () {
        var a = 1 === q.getNumItemsFn();
        a !== p && (C(d, 'ui--one-slide', a), (p = a));
      },
      E = function () {
        C(i, 'share-modal--hidden', y);
      },
      F = function () {
        return (
          (y = !y),
          y
            ? (b.removeClass(i, 'pswp__share-modal--fade-in'),
              setTimeout(function () {
                y && E();
              }, 300))
            : (E(),
              setTimeout(function () {
                y || b.addClass(i, 'pswp__share-modal--fade-in');
              }, 30)),
          y || H(),
          !1
        );
      },
      G = function (b) {
        b = b || window.event;
        var c = b.target || b.srcElement;
        return (
          a.shout('shareLinkClick', b, c),
          !!c.href &&
            (!!c.hasAttribute('download') ||
              (window.open(
                c.href,
                'pswp_share',
                'scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=550,height=420,top=100,left=' +
                  (window.screen ? Math.round(screen.width / 2 - 275) : 100)
              ),
              y || F(),
              !1))
        );
      },
      H = function () {
        for (var a, b, c, d, e, f = '', g = 0; g < q.shareButtons.length; g++)
          (a = q.shareButtons[g]),
            (c = q.getImageURLForShare(a)),
            (d = q.getPageURLForShare(a)),
            (e = q.getTextForShare(a)),
            (b = a.url
              .replace('{{url}}', encodeURIComponent(d))
              .replace('{{image_url}}', encodeURIComponent(c))
              .replace('{{raw_image_url}}', c)
              .replace('{{text}}', encodeURIComponent(e))),
            (f +=
              '<a href="' +
              b +
              '" target="_blank" class="pswp__share--' +
              a.id +
              '"' +
              (a.download ? 'download' : '') +
              '>' +
              a.label +
              '</a>'),
            q.parseShareButtonOut && (f = q.parseShareButtonOut(a, f));
        (i.children[0].innerHTML = f), (i.children[0].onclick = G);
      },
      I = function (a) {
        for (var c = 0; c < q.closeElClasses.length; c++) if (b.hasClass(a, 'pswp__' + q.closeElClasses[c])) return !0;
      },
      J = 0,
      K = function () {
        clearTimeout(u), (J = 0), k && v.setIdle(!1);
      },
      L = function (a) {
        a = a ? a : window.event;
        var b = a.relatedTarget || a.toElement;
        (b && 'HTML' !== b.nodeName) ||
          (clearTimeout(u),
          (u = setTimeout(function () {
            v.setIdle(!0);
          }, q.timeToIdleOutside)));
      },
      M = function () {
        q.fullscreenEl &&
          !b.features.isOldAndroid &&
          (c || (c = v.getFullscreenAPI()),
          c
            ? (b.bind(document, c.eventK, v.updateFullscreen),
              v.updateFullscreen(),
              b.addClass(a.template, 'pswp--supports-fs'))
            : b.removeClass(a.template, 'pswp--supports-fs'));
      },
      N = function () {
        q.preloaderEl &&
          (O(!0),
          l('beforeChange', function () {
            clearTimeout(o),
              (o = setTimeout(function () {
                a.currItem && a.currItem.loading
                  ? (!a.allowProgressiveImg() || (a.currItem.img && !a.currItem.img.naturalWidth)) && O(!1)
                  : O(!0);
              }, q.loadingIndicatorDelay));
          }),
          l('imageLoadComplete', function (b, c) {
            a.currItem === c && O(!0);
          }));
      },
      O = function (a) {
        n !== a && (C(m, 'preloader--active', !a), (n = a));
      },
      P = function (a) {
        var c = a.vGap;
        if (B()) {
          var g = q.barsSize;
          if (q.captionEl && 'auto' === g.bottom)
            if (
              (f ||
                ((f = b.createEl('pswp__caption pswp__caption--fake')),
                f.appendChild(b.createEl('pswp__caption__center')),
                d.insertBefore(f, e),
                b.addClass(d, 'pswp__ui--fit')),
              q.addCaptionHTMLFn(a, f, !0))
            ) {
              var h = f.clientHeight;
              c.bottom = parseInt(h, 10) || 44;
            } else c.bottom = g.top;
          else c.bottom = 'auto' === g.bottom ? 0 : g.bottom;
          c.top = g.top;
        } else c.top = c.bottom = 0;
      },
      Q = function () {
        q.timeToIdle &&
          l('mouseUsed', function () {
            b.bind(document, 'mousemove', K),
              b.bind(document, 'mouseout', L),
              (t = setInterval(function () {
                J++, 2 === J && v.setIdle(!0);
              }, q.timeToIdle / 2));
          });
      },
      R = function () {
        l('onVerticalDrag', function (a) {
          x && a < 0.95 ? v.hideControls() : !x && a >= 0.95 && v.showControls();
        });
        var a;
        l('onPinchClose', function (b) {
          x && b < 0.9 ? (v.hideControls(), (a = !0)) : a && !x && b > 0.9 && v.showControls();
        }),
          l('zoomGestureEnded', function () {
            (a = !1), a && !x && v.showControls();
          });
      },
      S = [
        {
          name: 'caption',
          option: 'captionEl',
          onInit: function (a) {
            e = a;
          },
        },
        {
          name: 'share-modal',
          option: 'shareEl',
          onInit: function (a) {
            i = a;
          },
          onTap: function () {
            F();
          },
        },
        {
          name: 'button--share',
          option: 'shareEl',
          onInit: function (a) {
            h = a;
          },
          onTap: function () {
            F();
          },
        },
        { name: 'button--zoom', option: 'zoomEl', onTap: a.toggleDesktopZoom },
        {
          name: 'counter',
          option: 'counterEl',
          onInit: function (a) {
            g = a;
          },
        },
        { name: 'button--close', option: 'closeEl', onTap: a.close },
        { name: 'button--arrow--left', option: 'arrowEl', onTap: a.prev },
        { name: 'button--arrow--right', option: 'arrowEl', onTap: a.next },
        {
          name: 'button--fs',
          option: 'fullscreenEl',
          onTap: function () {
            c.isFullscreen() ? c.exit() : c.enter();
          },
        },
        {
          name: 'preloader',
          option: 'preloaderEl',
          onInit: function (a) {
            m = a;
          },
        },
      ],
      T = function () {
        var a,
          c,
          e,
          f = function (d) {
            if (d)
              for (var f = d.length, g = 0; g < f; g++) {
                (a = d[g]), (c = a.className);
                for (var h = 0; h < S.length; h++)
                  (e = S[h]),
                    c.indexOf('pswp__' + e.name) > -1 &&
                      (q[e.option]
                        ? (b.removeClass(a, 'pswp__element--disabled'), e.onInit && e.onInit(a))
                        : b.addClass(a, 'pswp__element--disabled'));
              }
          };
        f(d.children);
        var g = b.getChildByClass(d, 'pswp__top-bar');
        g && f(g.children);
      };
    (v.init = function () {
      b.extend(a.options, z, !0),
        (q = a.options),
        (d = b.getChildByClass(a.scrollWrap, 'pswp__ui')),
        (l = a.listen),
        R(),
        l('beforeChange', v.update),
        l('doubleTap', function (b) {
          var c = a.currItem.initialZoomLevel;
          a.getZoomLevel() !== c ? a.zoomTo(c, b, 333) : a.zoomTo(q.getDoubleTapZoom(!1, a.currItem), b, 333);
        }),
        l('preventDragEvent', function (a, b, c) {
          var d = a.target || a.srcElement;
          d &&
            d.getAttribute('class') &&
            a.type.indexOf('mouse') > -1 &&
            (d.getAttribute('class').indexOf('__caption') > 0 || /(SMALL|STRONG|EM)/i.test(d.tagName)) &&
            (c.prevent = !1);
        }),
        l('bindEvents', function () {
          b.bind(d, 'pswpTap click', A),
            b.bind(a.scrollWrap, 'pswpTap', v.onGlobalTap),
            a.likelyTouchDevice || b.bind(a.scrollWrap, 'mouseover', v.onMouseOver);
        }),
        l('unbindEvents', function () {
          y || F(),
            t && clearInterval(t),
            b.unbind(document, 'mouseout', L),
            b.unbind(document, 'mousemove', K),
            b.unbind(d, 'pswpTap click', A),
            b.unbind(a.scrollWrap, 'pswpTap', v.onGlobalTap),
            b.unbind(a.scrollWrap, 'mouseover', v.onMouseOver),
            c &&
              (b.unbind(document, c.eventK, v.updateFullscreen),
              c.isFullscreen() && ((q.hideAnimationDuration = 0), c.exit()),
              (c = null));
        }),
        l('destroy', function () {
          q.captionEl && (f && d.removeChild(f), b.removeClass(e, 'pswp__caption--empty')),
            i && (i.children[0].onclick = null),
            b.removeClass(d, 'pswp__ui--over-close'),
            b.addClass(d, 'pswp__ui--hidden'),
            v.setIdle(!1);
        }),
        q.showAnimationDuration || b.removeClass(d, 'pswp__ui--hidden'),
        l('initialZoomIn', function () {
          q.showAnimationDuration && b.removeClass(d, 'pswp__ui--hidden');
        }),
        l('initialZoomOut', function () {
          b.addClass(d, 'pswp__ui--hidden');
        }),
        l('parseVerticalMargin', P),
        T(),
        q.shareEl && h && i && (y = !0),
        D(),
        Q(),
        M(),
        N();
    }),
      (v.setIdle = function (a) {
        (k = a), C(d, 'ui--idle', a);
      }),
      (v.update = function () {
        x && a.currItem
          ? (v.updateIndexIndicator(),
            q.captionEl && (q.addCaptionHTMLFn(a.currItem, e), C(e, 'caption--empty', !a.currItem.title)),
            (w = !0))
          : (w = !1),
          y || F(),
          D();
      }),
      (v.updateFullscreen = function (d) {
        d &&
          setTimeout(function () {
            a.setScrollOffset(0, b.getScrollY());
          }, 50),
          b[(c.isFullscreen() ? 'add' : 'remove') + 'Class'](a.template, 'pswp--fs');
      }),
      (v.updateIndexIndicator = function () {
        q.counterEl && (g.innerHTML = a.getCurrentIndex() + 1 + q.indexIndicatorSep + q.getNumItemsFn());
      }),
      (v.onGlobalTap = function (c) {
        c = c || window.event;
        var d = c.target || c.srcElement;
        if (!r)
          if (c.detail && 'mouse' === c.detail.pointerType) {
            if (I(d)) return void a.close();
            b.hasClass(d, 'pswp__img') &&
              (1 === a.getZoomLevel() && a.getZoomLevel() <= a.currItem.fitRatio
                ? q.clickToCloseNonZoomable && a.close()
                : a.toggleDesktopZoom(c.detail.releasePoint));
          } else if (
            (q.tapToToggleControls && (x ? v.hideControls() : v.showControls()),
            q.tapToClose && (b.hasClass(d, 'pswp__img') || I(d)))
          )
            return void a.close();
      }),
      (v.onMouseOver = function (a) {
        a = a || window.event;
        var b = a.target || a.srcElement;
        C(d, 'ui--over-close', I(b));
      }),
      (v.hideControls = function () {
        b.addClass(d, 'pswp__ui--hidden'), (x = !1);
      }),
      (v.showControls = function () {
        (x = !0), w || v.update(), b.removeClass(d, 'pswp__ui--hidden');
      }),
      (v.supportsFullscreen = function () {
        var a = document;
        return !!(a.exitFullscreen || a.mozCancelFullScreen || a.webkitExitFullscreen || a.msExitFullscreen);
      }),
      (v.getFullscreenAPI = function () {
        var b,
          c = document.documentElement,
          d = 'fullscreenchange';
        return (
          c.requestFullscreen
            ? (b = { enterK: 'requestFullscreen', exitK: 'exitFullscreen', elementK: 'fullscreenElement', eventK: d })
            : c.mozRequestFullScreen
            ? (b = {
                enterK: 'mozRequestFullScreen',
                exitK: 'mozCancelFullScreen',
                elementK: 'mozFullScreenElement',
                eventK: 'moz' + d,
              })
            : c.webkitRequestFullscreen
            ? (b = {
                enterK: 'webkitRequestFullscreen',
                exitK: 'webkitExitFullscreen',
                elementK: 'webkitFullscreenElement',
                eventK: 'webkit' + d,
              })
            : c.msRequestFullscreen &&
              (b = {
                enterK: 'msRequestFullscreen',
                exitK: 'msExitFullscreen',
                elementK: 'msFullscreenElement',
                eventK: 'MSFullscreenChange',
              }),
          b &&
            ((b.enter = function () {
              return (
                (j = q.closeOnScroll),
                (q.closeOnScroll = !1),
                'webkitRequestFullscreen' !== this.enterK
                  ? a.template[this.enterK]()
                  : void a.template[this.enterK](Element.ALLOW_KEYBOARD_INPUT)
              );
            }),
            (b.exit = function () {
              return (q.closeOnScroll = j), document[this.exitK]();
            }),
            (b.isFullscreen = function () {
              return document[this.elementK];
            })),
          b
        );
      });
  };
  return a;
});

// https://photoswipe.com/documentation/options.html
// data-maxSpreadZoom="1.5" data-fullscreenEl="true" data-shareEl="false" data-counterEl="false"

// ,isTouch;

(function ($) {
  'use strict';

  var $window = $(window),
    $document = $(document);

  var windowWidth = $window.width();

  var $html = $('html'),
    $body = $('body'),
    IsScreen767Smaller = windowWidth < 768,
    sr4strings = window.sr4strings,
    $overlay = $('.sr4-close-overlay'),
    sr4_lock_scroll = 'sr4-lock-scroll',
    attr_data_scroll = '[data-sr4-scroll-me]',
    page_type = sr4request.page_type,
    search_url = sr4routes.search_url,
    platform_email = sr4configs.platform_email,
    enableConfetti = sr4configs.enableConfetti,
    cacheNameFirst = sr4ThemeSP.cacheNameFirst,
    eventChange = 'change:ajaxCart';

  // isTouch             = ('ontouchstart' in window) || window.DocumentTouch && window.document instanceof DocumentTouch || window.navigator.maxTouchPoints || window.navigator.msMaxTouchPoints ? true : false,
  // sr4ThemeSP.isHover  = $html.hasClass('sr4p-hover');
  // //sr4ThemeSP.isHover  = (window.matchMedia("(hover: hover)").matches);
  // sr4ThemeSP.isTouch  = !sr4ThemeSP.isHover && isTouch;

  /**
   * Tooltip nathan
   * -----------------------------------------------------------------------------
   * https://jsfiddle.net/1duk9mys/
   * https://floating-ui.com/docs/offset
   *
   */

  var placementPositions =
    'top-start, top, top-end, left-start, left, left-end, right-start, right, right-end, bottom-start, bottom, bottom-end'.split(
      ', '
    );

  var ArrplacementRTL = {
    left: 'right',
    'left-start': 'right-start',
    'left-end': 'right-end',
    right: 'left',
    'right-start': 'left-start',
    'right-end': 'left-end',
  };

  var rtlPlacement = function (placement) {
    if (isThemeRTL) {
      return ArrplacementRTL[placement] || placement;
    } else {
      return placement;
    }
  };

  sr4ThemeSP.Tooltip = (function () {
    var template =
        '<div class="sr4-tooltip" id="id_nt_tt" role="tooltip"><div class="sr4-tt-arrow"></div><div class="sr4-tooltip-inner">nt_txt_tt</div></div>',
      dt_original_title = 'data-original-title',
      tooltipIsShow = 'is--show';

    var findTitle = function ($el) {
      var text = $el.find('.sr4-text-pr').text() || $el.text();

      if ($el.attr('title') && typeof $el.attr(dt_original_title) != 'string') {
        text = $el.attr('title');
        $el.attr(dt_original_title, $el.attr('title') || '').attr('title', '');
      }

      if ($el.attr('data-sr4-tooltip')) {
        text = $el.attr('data-sr4-tooltip');
      } else if ($el.attr(dt_original_title)) {
        text = $el.attr(dt_original_title);
      }

      // if ($el.find('.added_to_cart').length > 0) {
      //   text = $el.find('.add_to_cart_button').text();
      // }

      return text;
    };

    // https://floating-ui.com/

    // http://rocha.la/JavaScript-bitwise-operators-in-practice
    function getUID(prefix) {
      do prefix += ~~(Math.random() * 1000000);
      while (document.getElementById(prefix));
      return prefix;
    }

    function createTooltip(title, id_tooltip) {
      sr4ThemeSP.$appendComponent.after(template.replace('nt_txt_tt', title).replace('id_nt_tt', id_tooltip));
    }

    function updatePosition(button, tooltip, arrowElement, txtPlacement) {
      fastdomsr4.mutate(function () {
        FloatingUIsr4DOM.computePosition(button, tooltip, {
          placement: txtPlacement,
          middleware: [
            FloatingUIsr4DOM.offset(6),
            FloatingUIsr4DOM.flip({
              //fallbackPlacements: ['left', 'right', 'top', 'bottom'],
              fallbackPlacements: ['top', 'bottom'],
            }),
            FloatingUIsr4DOM.shift({ padding: 5 }),
            FloatingUIsr4DOM.arrow({ element: arrowElement }),
          ],
        }).then(({ x, y, placement, middlewareData }) => {
          Object.assign(tooltip.style, {
            top: '0',
            left: '0',
            transform: `translate3d(${Math.round(x)}px,${Math.round(y)}px,0)`,
          });
          // Object.assign(tooltip.style, {
          //   left: `${x}px`,
          //   top: `${y}px`,
          // });

          // Accessing the data
          const { x: arrowX, y: arrowY } = middlewareData.arrow;
          const staticSide = {
            top: 'bottom',
            right: 'left',
            bottom: 'top',
            left: 'right',
          }[placement.split('-')[0]];
          Object.assign(arrowElement.style, {
            left: arrowX != null ? `${arrowX}px` : '',
            top: arrowY != null ? `${arrowY}px` : '',
            right: '',
            bottom: '',
            [staticSide]: '-4px',
          });
        });
      });
    }

    function showTooltip(button, txtPlacement, title) {
      var $button = $(button),
        id_tooltip = getUID('tooltipsr4');

      //console.log(id_tooltip)
      $button.attr('aria-describedby', id_tooltip);
      // Add html tootip;
      createTooltip(title, id_tooltip);

      var $tooltip = $('#' + id_tooltip), //aria-describedby="tooltip328396"
        tooltip = $tooltip[0],
        arrowElement = $tooltip.find('.sr4-tt-arrow');
      // show tootip;
      //tooltip.style.display = 'block';
      // FloatingUIsr4DOM intall
      updatePosition(button, tooltip, arrowElement[0], txtPlacement);
      $tooltip.addClass(tooltipIsShow);
    }

    function hideTooltip(button) {
      //console.log(button)
      var $tooltip = $('#' + $(button).attr('aria-describedby'));
      // hide tootip;
      //$tooltip[0].style.display = '';
      // remove tootip;
      $tooltip.removeClass(tooltipIsShow);
      $tooltip.remove();
      // remove aria-describedby;
      //$(button).attr('aria-describedby', '');
    }

    // Destroy all tooltip visible
    $body.on('sr4:hideTooltip', function () {
      $('.sr4-tooltip.is--show').remove();
    });
    // USE $body.trigger('sr4:hideTooltip');

    function initTooltip(button) {
      if (sr4ThemeSP.isTouch) return;

      //$.each(tooltipConfig, function(key, value) {

      //var $selectors = $(value.selectors+':not(.sr4-tooltip-actived)');

      var $selectors = $('[data-tooltip]:not(.sr4-tooltip-actived)');

      if ($selectors.length == 0) return;

      $selectors
        .hoverIntent({
          //selector: value.selectors,
          sensitivity: 6,
          interval: 80,
          timeout: 100,
          over: function (t) {
            //console.log('over ')

            let $this = $(this),
              placement = $this.attr('data-tooltip') || 'nt94';
            if (placementPositions.indexOf(placement) < 0) return;

            showTooltip(this, rtlPlacement(placement), findTitle($this));

            $this.on('updateTooltip', function () {
              // console.log('updateTooltip')
              hideTooltip(this);
              showTooltip(this, rtlPlacement(placement), findTitle($this));
            });

            $this.on('destroyTooltip', function () {
              // console.log('destroyTooltip')
              hideTooltip(this);
            });
          },
          out: function (t) {
            var placement = $(this).attr('data-tooltip') || 'nt94';
            if (placementPositions.indexOf(placement) < 0) return;
            // console.log(t)
            // console.log(this)
            hideTooltip(this);
            $(this).off('updateTooltip').off('destroyTooltip');
          },
        })
        .addClass('sr4-tooltip-actived');
      //});
    }

    return initTooltip;
  })();

  /**
   * LOOKBOOK, DROPDOWN NATHAN
   * -----------------------------------------------------------------------------
   * https://floating-ui.com/docs/offset
   *
   */
  sr4ThemeSP.LookBook = (function () {
    var classes = {
        loading: 'is--loading',
        loaded: 'is--loaded',
        clicked: 'is--clicked',
        selected: 'is--selected',
        opened: 'is--opened',
        preload: 'is--preLoaded',
        visible: 'is--visible is--pindop',
      },
      cacheLookbook = [],
      useCache = false;

    function CreatePinPopup($this, id, isShowPopup = false) {
      //HidePinPopup();
      //console.log('CreatePinPopup',$this)
      if ($this.hasClass(classes.loaded)) {
        //console.log('CalcPopup',$this)
        if (isShowPopup) CalcPopup($this, id);
        return;
      }

      var SectionID = $this.data('sid'),
        data = cacheLookbook[id + SectionID];

      // if lookbook type text
      if (!$this.is('[data-is-pr]')) {
        $this.addClass(classes.loaded);
        data = $('#tem' + id).html();
        sr4ThemeSP.$appendComponent.after(data.replace('id=""', 'id="' + id + '"'));
        if (isShowPopup) CalcPopup($this, id);
        return;
      }

      if (data) {
        sr4ThemeSP.$appendComponent.after(data);
        $this.addClass(classes.loaded);
        sr4ThemeSP.ProductItem.init();
        sr4ThemeSP.Tooltip();
        if (isShowPopup) CalcPopup($this, id);
      } else {
        $this.addClass(classes.loading);
        fetch($this.data('href') + '/?section_id=' + SectionID)
          // ,{
          //     "credentials": "same-origin",
          //     "headers": {
          //       "cache-control": "no-cache"
          //     }
          // })
          .then(function (response) {
            return response.text();
          })
          .then(function (data) {
            data = data.split('[sr4plitlz]')[1];
            data = data.replace('id_nt_sr4', id);
            sr4ThemeSP.$appendComponent.after(data);
            $this.removeClass(classes.loading).addClass(classes.loaded);
            sr4ThemeSP.ProductItem.init();
            sr4ThemeSP.Tooltip();

            if (isShowPopup) CalcPopup($this, id);

            if (useCache) cacheLookbook[id + SectionID] = data;
          })
          .catch(function (error) {
            $this.removeClass(classes.loading);
            // eslint-disable-next-line no-console
            console.log(error);
          });
      }
      //$this.addClass('sr4-is-loaded');
    }

    function UpdatePosition(button, tooltip, arrowElement, txtPlacement) {
      fastdomsr4.mutate(function () {
        FloatingUIsr4DOM.computePosition(button, tooltip, {
          placement: txtPlacement,
          middleware: [
            FloatingUIsr4DOM.offset(12),
            FloatingUIsr4DOM.flip({
              //fallbackPlacements: ['left', 'right', 'top', 'bottom'],
              fallbackPlacements: ['top', 'bottom'],
            }),
            FloatingUIsr4DOM.shift({ padding: 0 }),
            FloatingUIsr4DOM.arrow({ element: arrowElement }),
          ],
        }).then(({ x, y, placement, middlewareData }) => {
          Object.assign(tooltip.style, {
            // position: 'fixed',
            top: '0',
            left: '0',
            transform: `translate3d(${Math.round(x)}px,${Math.round(y)}px,0)`,
          });
          // Object.assign(tooltip.style, {
          //   left: `${x}px`,
          //   top: `${y}px`,
          // });

          // Accessing the data
          const { x: arrowX, y: arrowY } = middlewareData.arrow;
          const staticSide = {
            top: 'bottom',
            right: 'left',
            bottom: 'top',
            left: 'right',
          }[placement.split('-')[0]];
          Object.assign(arrowElement.style, {
            left: arrowX != null ? `${arrowX}px` : '',
            top: arrowY != null ? `${arrowY}px` : '',
            right: '',
            bottom: '',
            [staticSide]: '-6px',
          });
        });
      });
    }

    function ShowPinPopup(id) {
      if (IsScreen767Smaller) {
        $body.addClass(sr4_lock_scroll);
        sr4ThemeSP.Helpers.disableBodyScroll(true, attr_data_scroll);
      }

      let $id = $('#' + id);
      $id.addClass(classes.opened);
      // $overlay.addClass(classes.visible);
      if (!$id.hasClass('is-style-mb--false')) $overlay.addClass(classes.visible);
    }

    function HidePinPopup() {
      if (IsScreen767Smaller) {
        $body.removeClass(sr4_lock_scroll);
        sr4ThemeSP.Helpers.disableBodyScroll(false, attr_data_scroll);
      }

      $('[data-pin-close],[data-pin-popup].' + classes.clicked).off('click.closelb');
      $document.off('click.closelb').off('keyup.closelb');
      $('[data-pin-wrapper].' + classes.opened).removeClass(classes.opened);
      $('[data-pin-popup].' + classes.clicked).removeClass(classes.clicked);
      // console.log('xxxx')
      if ($body.hasClass('is--opend-drawer')) {
        $overlay.removeClass('is--pindop');
      } else {
        $overlay.removeClass(classes.visible);
      }
      // $overlay.removeClass(classes.visible);
    }

    function CalcPopup($this, id, icon = 'lb') {
      ShowPinPopup(id);
      var $popup_pin = $('#' + id),
        popup_pin = $popup_pin[0],
        arrowElement = $popup_pin.find('.sr4-' + icon + '-arrow'),
        placement = $this.data('position') || 'top';

      if ($window.width() > 767 || $popup_pin.hasClass('is-style-mb--false'))
        UpdatePosition($this[0], popup_pin, arrowElement[0], rtlPlacement(placement));

      if (icon == 'lb') {
        $document.on('click.closelb', function (e) {
          var $target = $(e.target);

          //console.log('$target',$target)
          if ($target.closest('[data-pin-wrapper]').length > 0 || $target.is('[data-pin-popup]')) return;
          HidePinPopup();
        });

        // Close by button close
        $(`#${id} [data-pin-close], [data-pin-popup].${classes.clicked}`).on('click.closelb', function (e) {
          e.preventDefault();
          e.stopPropagation();

          HidePinPopup();
        });

        // Close by esc
        $document.on('keyup.closelb', function (e) {
          if (e.keyCode !== 27) return;
          HidePinPopup();
        });
      } else {
        $document.on('click.closeDrop', function (e) {
          var $target = $(e.target);

          // console.log('$target',$target)
          if (
            $target.closest('[data-dropdown-wrapper]').length > 0 ||
            $target.is('[data-dropdown-open]') ||
            $target.closest('[data-dropdown-open]').length > 0
          )
            return;
          // console.log('$target2',$target)
          HideDropdown();
        });

        // Close by button close
        $(`#${id} [data-dropdown-close], [data-dropdown-open].${classes.clicked}`).on('click.closeDrop', function (e) {
          e.preventDefault();
          e.stopPropagation();

          HideDropdown();
        });

        // Close by esc
        $document.on('keyup.closeDrop', function (e) {
          if (e.keyCode !== 27) return;
          HideDropdown();
        });
      }
    }

    function initLookbook() {
      //console.log(cacheLookbook)
      $document.on('click', '[data-pin-popup]:not(.' + classes.clicked + ')', function (e) {
        e.preventDefault();

        var $this = $(this),
          id = $this.data('bid');

        HidePinPopup();
        $this.addClass(classes.clicked);
        //console.log($this)
        // if ( !$this.hasClass(classes.preload) ) CreatePinPopup($this,id, true);
        CreatePinPopup($this, id, true);
      });

      PreLoadPinProduct();
    }

    // Preload pin type product
    function PreLoadPinProduct() {
      // touchstart.pin mouseenter.pin
      $('[data-pin-popup][data-is-pr]:not(.' + classes.clicked + '):not(.' + classes.opened + ')').on(
        'mouseenter.pin',
        function (e) {
          // console.log('PreLoadPinProduct');
          var $this = $(this),
            id = $this.data('bid');

          $this.addClass(classes.preload);
          CreatePinPopup($this, id);
          $this.off('touchstart.pin mouseenter.pin');
        }
      );
    }

    /**
     * Dropdown
     */
    function HideDropdown() {
      $body.removeClass(sr4_lock_scroll);
      sr4ThemeSP.Helpers.disableBodyScroll(false, attr_data_scroll);
      $('[data-dropdown-close],[data-dropdown-open].' + classes.clicked).off('click.closeDrop');
      $document.off('click.closeDrop').off('keyup.closeDrop');
      $('[data-dropdown-wrapper].' + classes.opened).removeClass(classes.opened);
      $('[data-dropdown-open].' + classes.clicked).removeClass(classes.clicked);
      // console.log('yyy')
      if ($body.hasClass('is--opend-drawer')) {
        $overlay.removeClass('is--pindop');
      } else {
        $overlay.removeClass(classes.visible);
      }
    }

    function UpdateTextDropdown(id) {
      // '[data-dropdown-item]:not(.'+classes.selected+')'
      $('#' + id).on('click.dopText', '[data-dropdown-item]', function (e) {
        e.preventDefault();

        var $this = $(this);

        $this
          .parents()
          .find('.' + classes.selected)
          .removeClass(classes.selected);
        $this.addClass(classes.selected);

        $('[data-dropdown-open][data-id="' + id + '"]>span:not([data-not-change-txt])').text($this.text());
        $('#' + id).off('click.dopText');
        // https://learn.jquery.com/events/introduction-to-custom-events/
        $this.trigger('change:drop', [$this, $this.data('value')]);

        HideDropdown();
      });
    }

    function initDropdown() {
      $document.on('click', '[data-dropdown-open]:not(.' + classes.clicked + ')', function (e) {
        e.preventDefault();

        var $this = $(this),
          id = $this.data('id');
        // console.log('data-dropdown-ope')
        HideDropdown();
        $this.addClass(classes.clicked);
        CalcPopup($this, id, 'drop');
        UpdateTextDropdown(id);
      });

      $document.on('click', '[data-dropdown-off]', function (e) {
        var $this = $(this),
          $wrapper = $(this).closest('[data-dropdown-wrapper]');

        $wrapper.find('[data-dropdown-open]>span').text($this.text());
        HideDropdown();
      });

      $document.on('dropdown:sr4:close', function (e) {
        HideDropdown();
      });
    }

    function init() {
      initLookbook();
      initDropdown();
    }

    return init;
  })();

  sr4ThemeSP.Hover = function () {
    var $dataHover = $('[data-hover-sr4]');

    // if (!sr4ThemeSP.isHover || $dataHover.length == 0 ) return;
    if ($dataHover.length == 0 || windowWidth < 1025) return;

    var HoverInterval = 35, // 20
      HoverTimeout = 150, // 70
      str_action = 'is--hover';

    $dataHover.each(function (e, i) {
      var self = this,
        $this = $(self);
      self.ishasGroup = self.hasAttribute('data-has-group');

      $this.hoverIntent({
        sensitivity: 3,
        interval: $this.data('interval') || HoverInterval,
        timeout: $this.data('timeout') || HoverTimeout,
        over: function (t) {
          if (self.ishasGroup) {
            $this.siblings().removeClass(str_action);
            $this.addClass(str_action);
          } else {
            $this.addClass(str_action);
          }
        },
        out: function () {
          if (!self.ishasGroup) $this.removeClass(str_action);
        },
      });
    });
  };

  /**
   * Create Button product grid item
   * -----------------------------------------------------------------------------
   *
   */
  function ConvertHref(href, prefix) {
    return href + (href.indexOf('?') > -1 || href.indexOf('&') > -1 ? '&' : '/?') + prefix;
  }

  function JsonParse(str, str2) {
    return JSON.parse(str || str2 || '{}');
  }

  /**
   * Product Item
   * -----------------------------------------------------------------------------
   * all js product item, code nathan
   *
   */

  sr4ThemeSP.ProductItem = (function () {
    var btns_pr_temp = $('#btns_pr_temp').html(),
      data_tooltip = 'data-tooltip',
      data_tooltip2 = data_tooltip + '="',
      data_prID = 'id_nt_94',
      dataHandle = 'handle_nt_94',
      sr4_config = sr4configs,
      sr4_Str = sr4ProductStrings,
      htmlImage2 = sr4configs.img2,
      nowTimestamp = sr4_config.nowTimestamp,
      new_day_int = sr4_config.new_day_int,
      show_img = sr4_config.show_img,
      use_quickshop = sr4_config.enable_quickshop,
      use_sale_badge = sr4_config.use_sale_badge,
      label_sale_style = sr4_config.label_sale_style,
      use_preorder_badge = sr4_config.use_preorder_badge,
      use_new_badge = sr4_config.use_new_badge,
      use_soldout_badge = sr4_config.use_soldout_badge,
      use_custom_badge = sr4_config.use_custom_badge,
      swatch_limit = sr4_config.swatch_limit,
      swatch_click = sr4_config.swatch_click,
      swatch_num = sr4_config.swatch_num,
      minColor = 2,
      preOrderText = sr4_Str.preOrder,
      readMoreText = sr4_Str.readMore,
      soldOutText = sr4_Str.soldOut,
      selectOptionText = sr4_Str.selectOption,
      quickShopText = sr4_Str.quickShop,
      preViewText = sr4_Str.preView,
      classTextAddTC = '.sr4-text-pr',
      classIconAddTC = '.sr4-svg-pr-icon use',
      dataColorOptions = 'data-color-options',
      SizeOptions = '.sr4-product-sizes',
      dataQuantity = 'data-quantity-value',
      isLoading = 'is--loading',
      isOpended = 'is-sr4--opended',
      isCalced = 'is-sr4--calced',
      isLimit = 'is-sr4--limit',
      dataResizeobserver = '[data-sr4-resizeobserver]',
      sw_item_style = sr4_config.sw_item_style,
      swatch_limit_more = sr4_Str.swatch_limit,
      swatch_limit_less = sr4_Str.swatch_limit_less,
      show_qty = sr4_config.show_qty,
      selectorSwatch = '.sr4-pr-color__item:not(.is-swatch--current):not([data-img="none"]):not(.is--colors-more)',
      pr_curent = sr4_config.pr_curent,
      app_review = sr4configs.app_review,
      badgeTexts = {
        sale: sr4_Str.badgeSale,
        new: sr4_Str.badgeNew,
        preOrder: sr4_Str.badgepreOrder,
        soldout: sr4_Str.badgeSoldout,
        SavePercent: sr4_Str.badgeSavePercent,
      },
      class_enabled = 'initProducts__enabled';

    // VariantsCache      = {},
    // ProductsOPCache    = {},
    // IsRemoveUnavai     = !$html.hasClass('is-remove-unavai-0'),
    // data_swatch_item   = '[data-swatch-item]',
    // data_swatch_option = '[data-swatch-option]',
    // str_unavai         = 'is--unavailable',
    // txt_selected       = 'is--selected',
    // class_selected     = '.'+txt_selected,
    // txt_disable        = 'is-pswp-disable',
    // class_enabled      = 'isotopesr4-enabled',
    // txt_variant_img    = '.sr4-color-mode__variant_image .is--first-color',
    // swatch_selector    = data_swatch_item+':not('+class_selected+')';
    // regex get /data-tooltip\=\"([A-Za-z0-9 _]*)\"/

    if (swatch_limit) {
      $html.addClass('sr4-pr-item-sw-limit');
      if (swatch_num && swatch_num > 0) minColor = swatch_num;
    }

    function createImageProduct($this, strimage2, alt) {
      var htmlImage = '';

      if (show_img == '2' && strimage2) {
        htmlImage = htmlImage2.replace('image_src', strimage2).replace('image_alt', alt);
        $this.find('.sr4-product-img').addClass('is-show-img2');
      }

      $this.find('[data-replace-img2]').replaceWith(htmlImage);
    }

    function createButtonsProduct($this, productOptions, productHref) {
      var $quickview = $this.find('[data-replace-quickview]'),
        qv_tooltip = $quickview.attr(data_tooltip) || '',
        pr_id = productOptions.id,
        $compare = $this.find('[data-replace-compare]'),
        cp_tooltip = $compare.attr(data_tooltip) || '',
        $wishlist = $this.find('[data-replace-wishlist]'),
        wis_tooltip = $wishlist.attr(data_tooltip) || '',
        $addToCart = $this.find('[data-replace-atc]'),
        isHasQuantity = $addToCart.is('[data-has-qty]'),
        atc_tooltip = $addToCart.attr(data_tooltip) || '',
        btns_current = btns_pr_temp.replace(/#sr4_pr_url/g, productHref).split('[split_t4nt]');

      // btns_current[0] is quickview
      $quickview.replaceWith(
        btns_current[0].replace(data_tooltip2, data_tooltip2 + qv_tooltip).replace(data_prID, pr_id)
      );
      // btns_current[1] is compare
      $compare.replaceWith(
        btns_current[1]
          .replace(data_tooltip2, data_tooltip2 + cp_tooltip)
          .replace(data_prID, pr_id)
          .replace(dataHandle, productOptions.handle)
      );
      // btns_current[2] is wishlist
      $wishlist.replaceWith(
        btns_current[2]
          .replace(data_tooltip2, data_tooltip2 + wis_tooltip)
          .replace(data_prID, pr_id)
          .replace(dataHandle, productOptions.handle)
      );
      // btns_current[3] is add to cart
      $addToCart.replaceWith(
        btns_current[3].replace(data_tooltip2, data_tooltip2 + atc_tooltip).replace(data_prID, pr_id)
      );
      // btns_current[4] is quantity

      // Check button add to cart
      $addToCart = $this.find('[data-atc-selector]'); // update new $addToCart
      var $addToCartText = $addToCart.find(classTextAddTC),
        $addToCartIcon = $addToCart.find(classIconAddTC);

      if (productOptions.isExternal) {
        $addToCart.attr('href', productOptions.external_link).attr('target', '_blank');
        $addToCartText.text(productOptions.external_title);
        $addToCartIcon.attr('xlink:href', '#sr4-icon-external');
      } else if (!productOptions.available) {
        // soldout
        $addToCartText.text(readMoreText);
        $addToCartIcon.attr('xlink:href', '#sr4-icon-link');
      } else if (productOptions.isGrouped) {
        // product Grouped
        $addToCartText.text(preViewText);
      } else if (productOptions.isDefault) {
        // pre Order
        if (productOptions.isPreoder) $addToCartText.text(preOrderText);
        $addToCart.attr({
          'data-action-atc': '',
          'data-variant-id': productOptions.VariantFirstID,
          'data-qty': productOptions.cusQty || 1,
        });

        if (show_qty && isHasQuantity && $addToCart[0]) {
          var clone_atc = $addToCart[0].outerHTML,
            //html_qty  = btns_current[4].replace('max="9999"','max="'+productOptions.maxQuantity+'"');
            html_qty = btns_current[4]
              .replace('max="9999"', `max="${productOptions.maxQuantity}"`)
              .replace('min="1"', `min="${productOptions.cusQty || 1}"`);
          //console.log(clone_atc);

          $addToCart.replaceWith('<div class="sr4-product-atc-qty">' + html_qty + clone_atc + '</div>');
        }
      } else if (use_quickshop && productOptions.unQuickShopInline) {
        $addToCart.attr('data-action-quickshop', '');
        $addToCartText.text(quickShopText);
      } else {
        $addToCartText.text(selectOptionText);
      }

      // Replace button atc on quicksop inline
      if (productOptions.unQuickShopInline) return;

      $this.one('replace:btnAtc', function () {
        $addToCart.attr({
          'data-action-atc': '',
          'data-variant-id': productOptions.VariantFirstID,
          'data-qty': productOptions.cusQty || 1,
        });

        if (show_qty && isHasQuantity && $addToCart[0]) {
          var clone_atc = $addToCart[0].outerHTML,
            //html_qty  = btns_current[4].replace('max="9999"','max="'+productOptions.maxQuantity+'"');
            html_qty = btns_current[4]
              .replace('max="9999"', `max="${productOptions.maxQuantity}"`)
              .replace('min="1"', `min="${productOptions.cusQty || 1}"`);
          //console.log(clone_atc);

          $addToCart.replaceWith('<div class="sr4-product-atc-qty">' + html_qty + clone_atc + '</div>');
          // $this.trigger( 'replaceSuccess:btnAtc');
        }
        // console.log('$this','replace:btnAtc');
      });
    }

    function createBadgesProduct($this, productOptions) {
      // console.log($this)
      var $badges = $this.find('[data-product-badge]'),
        Arrsort = ($badges.attr('data-sort') || '').replace(/ /g, '').split(','),
        htmlBadges = '',
        isQuickShopInline = !productOptions.unQuickShopInline;

      // console.log(Arrsort,$badges)
      if (Arrsort.length == 0 || $badges.length == 0) return;

      var l = Arrsort.length;
      for (var i = 0; i < l; i++) {
        switch (Arrsort[i]) {
          case 'sale':
            var compare_at_price = productOptions.compare_at_price,
              price = productOptions.price;

            if (compare_at_price <= price || !use_sale_badge) {
              if (isQuickShopInline)
                htmlBadges += '<span data-badge-sale class="sr4-badge-item sr4-badge-sale" hidden></span>';
              break;
            }

            if (label_sale_style == '2') {
              // assign save = compare_price | minus: product_price | times: 100.0 | divided_by: compare_price | round
              var savePercent = ((compare_at_price - price) * 100) / compare_at_price,
                saveText = badgeTexts.SavePercent.replace('[sale]', Math.round(savePercent));
            } else if (label_sale_style == '3') {
              var saveAmount = compare_at_price - price,
                saveText = sr4ThemeSP.Currency.formatMoney(saveAmount);
            } else {
              var saveText = badgeTexts[Arrsort[i]];
            }
            htmlBadges += '<span data-badge-sale class="sr4-badge-item sr4-badge-sale">' + saveText + '</span>';
            break;

          case 'preOrder':
            if (!productOptions.isPreoder || !use_preorder_badge) {
              if (isQuickShopInline)
                htmlBadges +=
                  '<span data-badge-preorder class="sr4-badge-item sr4-badge-preorder" hidden>' +
                  badgeTexts[Arrsort[i]] +
                  '</span>';
              break;
            }
            htmlBadges +=
              '<span data-badge-preorder class="sr4-badge-item sr4-badge-preorder">' +
              badgeTexts[Arrsort[i]] +
              '</span>';
            break;

          case 'new':
            // productOptions.dateStart
            var diffSeconds = nowTimestamp - productOptions.dateStart,
              diffDays = Math.floor(diffSeconds / 3600),
              diffDays = Math.floor(diffDays / 24);
            if (diffDays >= new_day_int || !use_new_badge) break;
            htmlBadges += '<span class="sr4-badge-item sr4-badge-new">' + badgeTexts[Arrsort[i]] + '</span>';
            break;

          case 'soldout':
            if (productOptions.available || !use_soldout_badge) {
              if (isQuickShopInline)
                htmlBadges +=
                  '<span data-badge-soldout class="sr4-badge-item sr4-badge-soldout" hidden>' +
                  badgeTexts[Arrsort[i]] +
                  '</span>';
              break;
            }
            htmlBadges +=
              '<span data-badge-soldout class="sr4-badge-item sr4-badge-soldout">' + badgeTexts[Arrsort[i]] + '</span>';
            break;

          default:
            // custom label
            var customBadge = productOptions.customBadge;
            if (!customBadge || !use_custom_badge) break;
            var l2 = customBadge.length;
            for (var j = 0; j < l2; j++) {
              htmlBadges +=
                '<span class="sr4-badge-item sr4-badge-custom sr4-badge-' +
                productOptions.customBadgeHandle[j] +
                '">' +
                customBadge[j] +
                '</span>';
            }
        }
      }
      $badges.html(htmlBadges);
    }

    function createColorsProduct($this, productHref) {
      var $color = $this.find('[' + dataColorOptions + ']');

      if ($color.length == 0) return;

      //fastdomsr4.mutate(function () {
      var colorOptions = JsonParse($color.attr(dataColorOptions)),
        color_variants = colorOptions.color_variants,
        color_variants_avai = colorOptions.color_variants_avai,
        color_variants_handle = colorOptions.color_variants_handle,
        //img_options           = colorOptions.img_options.reverse(), // .reverse() to get img fist of color, if not reverse() will get img last
        //img_variants          = colorOptions.img_variants.reverse(), // .reverse() to get img fist of color, if not reverse() will get img last
        img_options = colorOptions.img_options,
        img_variants = colorOptions.img_variants,
        id_variants = colorOptions.id_variants,
        id_images = colorOptions.id_images || [],
        img_ratios = colorOptions.img_ratios,
        htmlColors = '',
        img_variantsLength = img_variants.length,
        ishasVariantImage = img_variantsLength > 0;

      // if (ishasVariantImage) {
      //    var objColorImg = {};
      //    for (var j = 0; j < img_variantsLength; j++) {
      //       objColorImg[img_options[j]] = img_variants[j];
      //    }
      //    //console.log(objColorImg)
      // }
      //console.log(colorOptions)

      var l = color_variants.length,
        t = color_variants_avai.length,
        hasSoldOut = l != t;
      //console.log(objColorImg)
      for (var i = 0; i < l; i++) {
        //console.log(color_variants[i])
        var color_current = color_variants[i],
          indexof = img_options.indexOf(color_current),
          img = ishasVariantImage ? img_variants[indexof] : 'nt94',
          img = img || 'nt94',
          data_img = img != 'nt94' ? sr4ThemeSP.Images.lazyloadImagePath(img) : 'none',
          data_bg =
            img != 'nt94' && sw_item_style == '2' ? 'data-bg="' + sr4ThemeSP.Images.getNewImageUrl(img, 100) + '"' : '',
          class_sold_out =
            hasSoldOut && color_variants_avai.indexOf(color_current) < 0 ? ' sr4-pr-color--sold-out' : '';

        htmlColors +=
          '<span data-imgid="' +
          (id_images[indexof] || '0') +
          '" class="sr4-pr-color__item' +
          class_sold_out +
          '" data-vid="' +
          id_variants[indexof] +
          '" data-tooltip="top" data-img="' +
          data_img +
          '" data-ratio="' +
          (img_ratios[indexof] || '') +
          '"><span class="sr4-pr-color__name">' +
          color_current +
          '</span><span class="sr4-pr-color__value bg_color_' +
          color_variants_handle[i] +
          ' lazyloadsr4" ' +
          data_bg +
          '></span></span>';
      }

      if (l > minColor && swatch_limit) {
        htmlColors +=
          '<span class="sr4-pr-color__item is--colors-more" data-tooltip="top-end"><span class="sr4-pr-color__name">' +
          swatch_limit_more +
          '</span><a href="' +
          productHref +
          '" class="sr4-pr-color__value bg_color_limit4"></a></span>';
      }
      $color.html(htmlColors);
      //});
      var $size = $this.find(SizeOptions);
      //   $sizeSpan = $size.find(">span");
      if ($size.length == 0) return;
      var $product = $this.closest('[data-product-options]'),
        pShortJson = $product.data('product-options');
      if (sr4Func.psjson_lib[pShortJson.id] == undefined) {
        $.ajax({
          url: Shopify.routes.root + 'products/' + pShortJson.handle + '.js',
          type: 'GET',
          dataType: 'json',
        })
          .done(function (data) {
            // console.log("success");
            sr4Func.psjson_lib[pShortJson.id] = data;
          })
          .fail(function () {
            // console.log("error");
          })
          .always(function (data) {
            // console.log("complete");
            // let variants = sr4Func.psjson_lib[pShortJson.id].variants;
            // let activeColor = variants.find((o) => { return o.id === id_variants[i] });
            // let color_nthOption = variants.filter((o) => { return o.option1 === activeColor.option1 });
            // $sizeSpan.removeClass("sr4-product-sizes--sold-out");
            // $.map( color_nthOption, function( variant, i ) {
            //    if(!variant.available){
            //       $sizeSpan.eq(i).addClass("sr4-product-sizes--sold-out");
            //    }
            // });
          });
      }
    }

    function recalculateSwatches(bl) {
      if (!swatch_limit) return;

      var string_sl = bl ? '[' + dataColorOptions + ']' : '[' + dataColorOptions + ']:not(.' + isCalced + ')';

      if (!swatch_num) {
        fastdomsr4.measure(function () {
          $(string_sl).each(function (index) {
            var swatchList = $(this),
              swatchListItem = swatchList.find('.sr4-pr-color__item'),
              swatchWidth = swatchListItem.outerWidth(true),
              colorSwatchesLength = swatchListItem.length - 1,
              maxFit = Math.floor(swatchList.outerWidth() / swatchWidth),
              Numsapce = colorSwatchesLength - maxFit;
            //console.log(swatchList, maxFit, swatchList.outerWidth(), swatchListItem, swatchWidth, Numsapce);
            fastdomsr4.mutate(function () {
              //console.log(swatchWidth);
              //console.log(swatchList,colorSwatchesLength,maxFit,Numsapce);
              swatchList.addClass(isCalced).removeClass(isLimit);
              swatchList.find('.is-color--limit').removeClass('is-color--limit');

              if (Numsapce > 0 && Numsapce != colorSwatchesLength) {
                Numsapce = Numsapce + 1;
                swatchList.addClass(isLimit);
                //swatchList.attr('data-limit',maxFit).attr('style', '--text : "+'+Numsapce+'"');
                swatchList
                  .find('.sr4-pr-color__item')
                  .eq(maxFit - 2)
                  .addClass('is-color--limit');
                swatchList
                  .attr('data-limit', maxFit)
                  .attr('style', '--text : "+' + Numsapce + '";--text2 : "-' + Numsapce + '"');
              }
            });
          });
        });
      } else {
        fastdomsr4.measure(function () {
          $(string_sl).each(function (index) {
            var swatchList = $(this),
              swatchListItem = swatchList.find('.sr4-pr-color__item'),
              colorSwatchesLength = swatchListItem.length - 1,
              numColorMinus = colorSwatchesLength - swatch_num;

            // console.log(swatchListItem, colorSwatchesLength, numColorMinus);
            fastdomsr4.mutate(function () {
              //console.log(swatchWidth);
              //console.log(swatchList,colorSwatchesLength,maxFit,Numsapce);
              swatchList.addClass(isCalced).removeClass(isLimit);
              swatchList.find('.is-color--limit').removeClass('is-color--limit');

              if (numColorMinus > 0) {
                swatchList.addClass(isLimit);
                //swatchList.attr('data-limit',maxFit).attr('style', '--text : "+'+Numsapce+'"');
                swatchList
                  .find('.sr4-pr-color__item')
                  .eq(swatch_num - 1)
                  .addClass('is-color--limit');
                swatchList
                  .attr('data-limit', colorSwatchesLength)
                  .attr('style', '--text : "+' + numColorMinus + '";--text2 : "-' + numColorMinus + '"');
              }
            });
          });
        });
      }
    }

    function clickMoreSwatches() {
      if (!swatch_limit || swatch_click == '2') return;

      $body.on('click', '.sr4-pr-color__item.is--colors-more>a', function (e) {
        e.preventDefault();
        var swatchList = $(this).closest('.' + isLimit),
          swatch__has_opended = swatchList.hasClass(isOpended);

        if (swatch__has_opended) {
          swatchList.removeClass(isOpended);
          $(this).siblings().text(swatch_limit_more);
        } else {
          swatchList.addClass(isOpended);
          $(this).siblings().text(swatch_limit_less);
        }
      });
    }
    /**
     * Returns a URL with a variant ID query parameter. Useful for updating window.history
     * with a new URL based on the currently select product variant.
     * @param {string} url - The URL you wish to append the variant ID to
     * @param {number} id  - The variant ID you wish to append to the URL
     * @returns {string} - The new url which includes the variant ID query parameter
     */

    function getUrlWithVariant(url, id) {
      if (/variant=/.test(url)) {
        return url.replace(/(variant=)[^&]+/, '$1' + id);
      } else if (/\?/.test(url)) {
        return url.concat('&variant=').concat(id);
      }

      return url.concat('?variant=').concat(id);
    }

    function changeSwatches($this) {
      var $product = $this.closest('[data-product-options]'),
        pShortJson = $product.data('product-options'),
        dataImgid = $this.data('imgid');

      if (dataImgid != '0') {
        let $productCarousel = $product.find('.flickitysr4-enabled[data-product-img-carousel]');
        if ($productCarousel.length == 0) return;

        let imgid = $this.data('imgid'),
          isWrapped = $this.data('isWrapped') || false,
          isInstant = $this.data('isInstant') || false;
        $productCarousel.flickitysr4('select', $productCarousel.find(`[data-product-img-slide="${imgid}"]`).index());
        //$productCarousel.flickitysr4( 'select', $productCarousel.find(`[data-product-img-slide="${imgid}"]`).index(), true, true )
        return;
      }

      var imagebg = $this.data('img'),
        ratio = $this.data('ratio'),
        vid = $this.data('vid'),
        $image = $product.find('[data-pr-img]'),
        $dataHref = $product.find('[data-pr-href]'),
        productHref = $dataHref.attr('href');

      $this.closest('[data-color-options]').find('.is-swatch--selected').removeClass('is-swatch--selected');
      $this.addClass('is-swatch--selected');

      $product.addClass('sr4-colors-selected');

      $image.attr('data-srcset', imagebg);

      if (pr_curent == '1' || typeof vid == 'undefined') return;

      $dataHref.attr('href', getUrlWithVariant(productHref, vid));

      if (sr4Func.psjson_lib[pShortJson.id] !== undefined) {
        let $size = $product.find(SizeOptions),
          $sizeSpan = $size.find('>span');
        let variants = sr4Func.psjson_lib[pShortJson.id].variants;
        let activeColor = variants.find((o) => {
          return o.id === vid;
        });
        let color_nthOption = variants.filter((o) => {
          return o[pShortJson.index_color] === activeColor[pShortJson.index_color];
        });
        $sizeSpan.removeClass('sr4-product-sizes--sold-out');
        let size = 0;
        $.map(color_nthOption, function (variant, i) {
          if (!variant.available) {
            $sizeSpan.eq(i).addClass('sr4-product-sizes--sold-out');
          } else {
            ++size;
          }
        });
        $size.attr('data-size', size);
      }
    }

    function changeSwatchesClickHover() {
      if (sr4ThemeSP.isTouch) {
        $body.on('click', selectorSwatch, function () {
          changeSwatches($(this));
        });
      } else {
        $body.hoverIntent({
          selector: selectorSwatch,
          sensitivity: 6,
          interval: 100,
          timeout: 100,
          over: function (t) {
            //console.log('over ')
            changeSwatches($(this));
          },
          out: function () {},
        });
      }
    }

    var str_url = 'data-collection-url',
      data_url = '[data-collection-url]',
      replaced = 'is--href-replaced',
      data_href = '[data-pr-href]:not(.is--href-replaced)',
      collectionURL,
      _href,
      _split = '/products/';

    function withinColelction() {
      if (!sr4configs.within_cat || $(data_href).length == 0) return;

      $(data_url).each(function () {
        collectionURL = $(this).attr(str_url);

        if ($.trim(collectionURL).length < 1) return;

        $(this)
          .find(data_href)
          .each(function () {
            _href = $(this).attr('href');
            _href = _href.split(_split)[1];
            _href = _split + _href;
            $(this)
              .attr('href', collectionURL + _href)
              .addClass(replaced);
          });
      });
    }

    function initProductItem() {
      withinColelction();

      $('[data-product-options]:not(.is-sr4-pr-created)').each(function () {
        var $this = $(this),
          productOptions = JsonParse($this.attr('data-product-options')),
          productHref = $this.find('[data-pr-href]').attr('href');

        if (typeof productOptions.unQuickShopInline != 'boolean') productOptions.unQuickShopInline = true;

        createImageProduct($this, productOptions.image2, productOptions.alt);
        createButtonsProduct($this, productOptions, productHref);
        createBadgesProduct($this, productOptions);
        createColorsProduct($this, productHref);
        recalculateSwatches();
        quickShopInline(this, $this, productOptions);

        $this.addClass('is-sr4-pr-created');
      });

      sr4ThemeSP.Tooltip();
      sr4ThemeSP.Compare.updateAll();
      sr4ThemeSP.Wishlist.updateAll();
    }

    // function QuickVSRefresh(type) {

    //    if (type == 'main-qv') {
    //       // main-qv - Quickview Refresh
    //       sr4ThemeSP.MFPopupAjax();

    //    } else {
    //       // 'main-qs - Quickshop Refresh

    //    }

    // }

    /**
     * Init Quickview, Quickshop
     */
    var CacheDataQVS = [];
    function initQuickViewShop() {
      if (show_qty) $html.addClass('sr4-pr-item-has-qty');

      $body.on('click', '[data-action-quickview], [data-action-quickshop]', function (e) {
        e.preventDefault();
        // e.stopPropagation();

        var $this = $(this);
        if ($this.hasClass(isLoading)) return;

        var href = $this.attr('href'),
          IsQuickview = $this.is('[data-action-quickview]'),
          prefix = IsQuickview ? 'main-qv' : 'main-qs',
          popupClass = IsQuickview ? 'sr4-opening-qv' : 'sr4-opening-qs',
          id = $this.data('id'),
          data = CacheDataQVS[prefix + id];

        sr4ThemeSP.isEditCartReplace = $this.data('edit') == '0';
        sr4ThemeSP.iDVariantEdit = id;
        sr4ThemeSP.keyVariantEdit = $this.data('key');

        // console.log(data)
        if (data) {
          sr4ThemeSP.NTpopupInline(data, prefix, IsQuickview ? reloadFunctQuickView : reloadFunctQuickShop, popupClass);
          $body.trigger('modalsr4:opened');
        } else {
          if (sr4ThemeSP.isEditCartReplace) {
            var $item = $this.closest('[data-cart-item]'),
              $wrapper = $this.closest('[data-cart-wrapper]'),
              $bar = $item.find('.sr4-cart-ld__bar'),
              $spinner = $bar.find('.sr4-cart-spinner');

            $wrapper.addClass('is--contentUpdate');
            $item.addClass('is--update');
            $bar.removeAttr('hidden');
            $spinner.removeAttr('hidden');

            $document.on('cart:updated', function (e) {
              $wrapper.removeClass('is--contentUpdate');
              $document.off('cart:updated');
              $item.removeClass('is--update');
              $bar.attr('hidden', '');
              $spinner.attr('hidden', '');
            });
          } else {
            $this.addClass(isLoading);
          }

          fetch(ConvertHref(href, 'section_id=' + prefix))
            // ,{
            //     "credentials": "same-origin",
            //     "headers": {
            //       "cache-control": "no-cache"
            //     }
            // })
            .then(function (response) {
              return response.text();
            })
            .then(function (data) {
              $this.removeClass(isLoading);
              $document.trigger('cart:updated');
              // Is DesignMode load same data to config unsave until same popup
              data = IsDesignMode ? $(data).find('template').html() : $(data).html();

              sr4ThemeSP.NTpopupInline(
                data,
                prefix,
                IsQuickview ? reloadFunctQuickView : reloadFunctQuickShop,
                popupClass
              );
              $body.trigger('modalsr4:opened');

              CacheDataQVS[prefix + id] = data;
            })
            .catch(function (error) {
              $this.removeClass(isLoading);
              $document.trigger('cart:updated');
              // eslint-disable-next-line no-console
              console.log(error);
            });
        }
      });

      function reloadFunctQuickView() {
        // main-qv - Quickview Refresh
        var data_product = 'data-product-featured',
          $quickView = $('.sr4-product-quick-view'),
          $this = $quickView.find('[' + data_product + ']:not(.' + class_enabled + ')');

        $this.addClass(class_enabled);
        new sr4ThemeSP.Product($this[0]);

        var $mainMedia = $quickView.find('[data-main-media]');

        if ($mainMedia.hasClass('flickitysr4') && !$mainMedia.hasClass('flickitysr4-enabled')) {
          //sr4ThemeSP.Flickitysr4.init($mainMedia);
          $mainMedia[0].flickitysr4 = new sr4ThemeSP.Carousel($mainMedia[0]);
        }

        sr4ThemeSP.PopupMFP();
        sr4ThemeSP.initGroupsProduct();

        if (window.Shopify && Shopify.PaymentButton) {
          Shopify.PaymentButton.init();
        }
        sr4ThemeSP.Wishlist.updateAll();
        sr4ThemeSP.Compare.updateAll();
        sr4ThemeSP.ProductItem.reloadReview();
        sr4ThemeSP.Tooltip();
        $body.trigger('currency:update');
      }

      function reloadFunctQuickShop() {
        // console.log('reloadFunctQuickShop')
        // main-qv - Quickview Refresh
        var data_product = 'data-product-featured',
          $quickShop = $('.sr4-product-quick-shop:not(.' + class_enabled + ')'),
          $this = $quickShop;

        $this.addClass(class_enabled);
        //console.log('sss')
        new sr4ThemeSP.Product($this[0]);

        // var $mainMedia = $quickView.find('[data-main-media]');

        // if ( $mainMedia.hasClass('flickitysr4') && !$mainMedia.hasClass('flickitysr4-enabled') ) {
        //  //sr4ThemeSP.Flickitysr4.init($mainMedia);
        //  $mainMedia[0].flickitysr4 = new sr4ThemeSP.Carousel($mainMedia[0]);
        // }

        sr4ThemeSP.PopupMFP();
        // sr4ThemeSP.initGroupsProduct();

        if (window.Shopify && Shopify.PaymentButton) {
          Shopify.PaymentButton.init();
        }
        sr4ThemeSP.Wishlist.updateAll();
        sr4ThemeSP.Compare.updateAll();
        sr4ThemeSP.ProductItem.reloadReview();
        sr4ThemeSP.Tooltip();
        $body.trigger('currency:update');
      }
    }

    /**
     * Init ResizeObserver https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
     * data-sr4-resizeobserver
     */
    function ItemResizeObserver() {
      var $els = $(
        dataResizeobserver +
          '.flickitysr4-enabled .sr4-product:not(.sr4_observered), ' +
          dataResizeobserver +
          '.isotopesr4-enabled .sr4-product:not(.sr4_observered)'
      );

      if ($els.length == 0 || !window.ResizeObserver) return;

      // var myVar;
      var callback = function (entries) {
        // This ResizeObserver callback mimics event handlers.

        // It calls Element's onresize method.
        entries.forEach(function (entry) {
          var myVar,
            $target = $(entry.target),
            $prs = $target.is(dataResizeobserver) ? $target : $target.closest(dataResizeobserver);

          //console.log($target,$prs);
          clearTimeout(myVar);
          $prs.addClass('is-sr4--doing');
          myVar = setTimeout(function () {
            //console.log('____________');
            //console.log($target,$prs);
            if ($prs.hasClass('flickitysr4-enabled')) {
              $prs.flickitysr4('resize');
            } else if ($prs.hasClass('isotopesr4-enabled')) {
              $prs.isotopesr4('layout');
            }
            $prs.removeClass('is-sr4--doing');
          }, 28);
          // }, 250);
          // if (entry.target.onresize) {
          //   entry.target.onresize(entry);
          //   console.log(entry.target);
          // }
        });

        // console.log(this);
        // console.log('Size changed');
      };

      // Create an observerIsotope instance linked to the callback function
      var MyResizeObserver = new ResizeObserver(callback);

      $els.each(function (index) {
        // Start Resize observing the target node for configured mutations
        var $this = $(this);

        MyResizeObserver.observe(this);
        $this.addClass('sr4_observered');

        $this.one('destroy.observered', function () {
          MyResizeObserver.unobserve(this);
          $this.removeClass('sr4_observered');
        });

        // $this.one('update.observered', function() {
        //   MyResizeObserver.unobserve(this);
        //   MyResizeObserver.observe(this);
        // });
      });
    }

    function LoadjsRevewOther() {
      if (app_review != '6') return;
      $script(sr4configs.script12);
    }

    // product review
    function ItemReview() {
      // if ( app_review == "1"  && (typeof SPR !== 'undefined' ) ) {

      //return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
      if (app_review == '1') {
        // if (window.SPR && $('.spr-badge').length > 0) SPR.initDomEls();SPR.loadBadges();
        try {
          if (window.SPR && $('.spr-badge').length > 0) SPR.initDomEls();
          SPR.loadBadges();
          //if (window.SPR && $('.spr-badge').length > 0) return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
        } catch (err) {}
      } else if (app_review == '8') {
        if (typeof SMARTIFYAPPS !== 'undefined' && SMARTIFYAPPS.rv.installed)
          SMARTIFYAPPS.rv.scmReviewsRate.actionCreateReviews();
      } else if (app_review == '6') {
        // other app review
        $body.trigger('reloadReview.sr4');
      }
    }

    function quickShopInline(self, $this, productOptions) {
      if (
        productOptions.unQuickShopInline ||
        $this.hasClass(class_enabled) ||
        productOptions.isGrouped ||
        productOptions.isExternal
      )
        return;

      //console.log('quickShopInline2',$this)
      var $qsInline = $this.find('[data-qs-inl]');

      if ($qsInline.hasClass('lazyloadsr4ed')) {
        new sr4ThemeSP.Product(self);
      } else {
        $qsInline.one('lazyincluded', function () {
          new sr4ThemeSP.Product(self);
        });
      }

      //createButtonsProduct($this, productOptions, productHref);

      // var quickShopInlineInt = function() {
      //     $('['+data_product+']:not(.'+class_enabled+')').each(function() {
      //       $(this).addClass(class_enabled);
      //       new sr4ThemeSP.Product( this );
      //     });
      //     new sr4ThemeSP.Product( this );
      // }
      //self.Variants = new Variants(options);
    }

    return {
      init: initProductItem,
      initQuickVS: initQuickViewShop,
      //initAddToCart: initAddToCart,
      recalculateSwatches: recalculateSwatches,
      clickMoreSwatches: clickMoreSwatches,
      swatchesClickHover: changeSwatchesClickHover,
      resizeObserver: ItemResizeObserver,
      reloadReview: ItemReview,
      loadjsRevew: LoadjsRevewOther,
      updateColelction: withinColelction,
    };
  })();

  /**
   *-------------------------------------------------------------------------------------------------------------------------------------------
   * Init Product ajax add to cart from, item
   *-------------------------------------------------------------------------------------------------------------------------------------------
   */

  sr4ThemeSP.ProductAjax = (function () {
    var classes = {
        loading: 'is--loading',
      },
      aria = {
        disabled: 'aria-disabled',
      },
      cartTypeIsDisable = sr4configs.cartType == 'disable',
      strCartDataMini = cartTypeIsDisable ? 'cart_data' : 'cart_data,mini_cart',
      sections_nt = page_type != 'cart' ? strCartDataMini : `cart_data,${window.cartsr4ectionID}`,
      enableAjaxATC = sr4configs.enableAjaxATC,
      enableAjaxCart = sr4configs.enableAjaxCart,
      cartAddUrl = sr4routes.cart_add_url + '.js',
      cartChangeUrl = sr4routes.cart_change_url + '.js',
      disOnlyStock = sr4configs.disATCerror,
      sections_ntArray = sections_nt.split(','),
      eventrequired = 'change.required keyup.required',
      listEmtyAnimate = 'is--field-emty is--animated sr4-ani-shake';

    /*!
     * Serialize all form data into a SearchParams string
     * (c) 2020 Chris Ferdinandi, MIT License, https://gomakethings.com
     * @param  {Node}   form The form to serialize
     * @return {String}      The serialized form data
     */
    // function serializet4(form) {
    //    var arr = [];
    //    Array.prototype.slice.call(form.elements).forEach(function(field) {
    //      if (
    //        !field.name ||
    //        field.disabled ||
    //        ['file', 'reset', 'submit', 'button'].indexOf(field.type) > -1
    //      )
    //        return;
    //      if (field.type === 'select-multiple') {
    //        Array.prototype.slice.call(field.options).forEach(function(option) {
    //          if (!option.selected) return;
    //          arr.push(
    //            encodeURIComponent(field.name) +
    //              '=' +
    //              encodeURIComponent(option.value)
    //          );
    //        });
    //        return;
    //      }
    //      if (['checkbox', 'radio'].indexOf(field.type) > -1 && !field.checked)
    //        return;
    //      // console.log(field.name, field.value)
    //      arr.push(
    //        encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value)
    //      );
    //    });
    //    return arr.join('&');
    // };

    function fetchConfig(type = 'json') {
      return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: `application/${type}` },
      };
    }

    // function fetchFromConfig() {
    //   return {
    //     method: 'POST',
    //     headers: {
    //      'Content-Type': 'application/x-www-form-urlencoded',
    //      'X-Requested-With': 'XMLHttpRequest'
    //    },
    //   };
    // };

    function handleErrorMessage(errorMessage = false) {
      // console.log('handleErrorMessage');

      // this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
      // this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

      // this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

      if (errorMessage && !disOnlyStock) {
        sr4ThemeSP.Notices(errorMessage);
        //this.errorMessage.textContent = errorMessage;
      }
    }

    function addFetchFrom($this) {
      $this.addClass(classes.loading).attr('aria-disabled', true);
      $this.find('.loading-overlay__spinner').removeAttr('hidden');
      $this.find('.sr4-svg-spinner').removeAttr('hidden');

      // const config = fetchFromConfig();

      // config.body = $this.closest('form').serialize()+'&sections='+sections_nt+'&sections_url='+window.location.pathname;
      // config.body = serializet4($this.closest('form')[0] )+'&sections='+sections_nt+'&sections_url='+encodeURIComponent(window.location.pathname);
      // config.credentials = 'same-origin';
      //console.log(config, window.location.pathname)
      // delete config.headers['Content-Type'];
      // console.log(config)
      /**
       * {"form_type":"product","utf8":"✓","id":"41251869851834","quantity":"1","sections":"cart_data,mini_cart","sections_url":"/collections/all/products/skin-sweatpans"}
       * https://anonystick.com/blog-developer/giai-thich-ve-destructuring-rest-parameters-va-spread-syntax-trong-javascript-2020051980035339
       */

      $document.on('cart:updated', function (e) {
        $this.removeClass(classes.loading).removeAttr(aria.disabled);
        $this.find('.loading-overlay__spinner').attr('hidden', '');
        $this.find('.sr4-svg-spinner').attr('hidden', '');
        $document.off('cart:updated');
        $body.trigger('modalsr4:closed');
      });

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];
      const formData = new FormData($this.closest('form')[0]);
      formData.append('sections', sections_ntArray);
      formData.append('sections_url', window.location.pathname);
      //console.log(formData)
      config.body = formData;

      fetch(`${cartAddUrl}`, config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            handleErrorMessage(response.description);
            $document.trigger('cart:updated');
            return;
          }

          // console.log(response)
          if (sr4ThemeSP.isEditCartReplace && response.variant_id != sr4ThemeSP.iDVariantEdit) {
            // console.log(sr4ThemeSP.iDVariantEdit)
            const configChange = fetchConfig('javascript');
            configChange.headers['X-Requested-With'] = 'XMLHttpRequest';

            configChange.body = JSON.stringify({
              id: `${sr4ThemeSP.keyVariantEdit}`,
              quantity: 0,
            });

            fetch(`${cartChangeUrl}`, configChange)
              .then((response) => response.json())
              .then((response) => {
                if (response.status) {
                  handleErrorMessage(response.description);
                  return;
                }

                // console.log(response)
                $document.trigger('add:cart:success').trigger('add:cart:upsell');
                sr4ThemeSP.isATCSuccess = true;
                renderDataSection(response.sections);
              })
              .catch((e) => {
                console.error(e);
              });
          } else {
            // console.log(response)
            $document.trigger('add:cart:success').trigger('add:cart:upsell');
            sr4ThemeSP.isATCSuccess = true;
            renderDataSection(response.sections);
          }
        })
        .catch((e) => {
          $document.trigger('cart:updated');
          // console.error(e);
        })
        .finally(() => {});
    }

    function addFetchItem($this) {
      // console.log(form_id, serializet4(form_id[0]))
      //
      $this.addClass(classes.loading).attr(aria.disabled, true);
      // $this.find('.loading-overlay__spinner').removeClass('sr4-dn');

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';

      var vid = $this.attr('data-variant-id'),
        qty =
          parseInt($this.prev('[data-quantity-wrapper]').find('[data-quantity-value]').val()) || $this.data('qty') || 1,
        arr_items = [];
      arr_items.push({
        id: vid,
        quantity: qty,
      });

      config.body = JSON.stringify({
        items: arr_items,
        sections: sections_nt,
        sections_url: window.location.pathname,
      });

      // {"items":[{"id":32271115321483,"quantity":1}],"sections":"cart_data,mini_cart","sections_url":"/collections/all/products/skin-sweatpans"}

      $document.on('cart:updated', function (e) {
        $this.removeClass(classes.loading).removeAttr(aria.disabled);
        // $this.find('.loading-overlay__spinner').addClass('sr4-dn');
        $document.off('cart:updated');
      });

      fetch(`${cartAddUrl}`, config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            handleErrorMessage(response.description);
            $document.trigger('cart:updated');
            return;
          }
          // console.log(response)
          $document.trigger('add:cart:success').trigger('add:cart:upsell');
          sr4ThemeSP.isATCSuccess = true;
          renderDataSection(response.sections);
        })
        .catch((e) => {
          $document.trigger('cart:updated');
          console.error(e);
        });
      // .finally(() => {
      // });
    }

    function changeFetchItem($this, vid, qty) {
      // console.log('changeFetchItem', $this)
      // console.log(form_id, serializet4(form_id[0]))
      //
      var $item = $this.closest('[data-cart-item]'),
        $wrapper = $this.closest('[data-cart-wrapper]'),
        $bar = $item.find('.sr4-cart-ld__bar'),
        $spinner = $bar.find('.sr4-cart-spinner');

      $wrapper.addClass('is--contentUpdate');
      $item.addClass('is--update');
      $bar.removeAttr('hidden');
      $spinner.removeAttr('hidden');

      $document.on('cart:updated', function (e) {
        $wrapper.removeClass('is--contentUpdate');
        $document.off('cart:updated');
        $item.removeClass('is--update');
        $bar.attr('hidden', '');
        $spinner.attr('hidden', '');
      });

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';

      config.body = JSON.stringify({
        id: vid,
        quantity: qty,
        sections: sections_nt,
        sections_url: window.location.pathname,
      });

      // {"items":[{"id":32271115321483,"quantity":1}],"sections":"cart_js","sections_url":"/collections/all/products/skin-sweatpans"}

      fetch(`${cartChangeUrl}`, config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            handleErrorMessage(response.description);
            $document.trigger('cart:updated');
            return;
          }
          // console.log(response)
          renderDataSection(response.sections);
        })
        .catch((e) => {
          $document.trigger('cart:updated');
          console.error(e);
        });
      // .finally(() => {
      // });
    }

    /**
     * Add to cart form
     */
    function renderDataSection(sections) {
      // console.log(response)
      if (sections) {
        sr4ThemeSP.Cart.renderContents(sections);
      } else {
        sr4ThemeSP.Cart.getToFetch();
      }
    }

    /**
     * Add to cart form
     */
    function addFetchFromHandler($form) {
      // $('[data-type="add-to-cart-form"]').on('click', '[data-atc-form]', function(e) {
      //    if (!enableAjaxATC) return;

      //    e.preventDefault();

      //    if ( $(this).attr(aria.disabled) ) {
      //       // console.log('no pick');
      //       sr4ThemeSP.Notices(sr4ProductStrings.pleaseChooseOptions);
      //    } else {
      //       addFetchFrom($(this));
      //    }
      // });
      var $required = $form.find('[data-field-required]'),
        hasRequiredProperties = $form.hasClass('has--properties') ? $required.length > 0 : false,
        isReturn = false,
        myVar;

      $form.on('click', '[data-atc-form]', function (e) {
        if ($(this).attr(aria.disabled)) {
          e.preventDefault();
          sr4ThemeSP.Notices(sr4ProductStrings.pleaseChooseOptions);
        } else {
          if (hasRequiredProperties) {
            e.preventDefault();
            isReturn = false;

            $required.each(function () {
              let $this = $(this),
                $field = $this.closest('[data-item-property-field]');

              if ($field.hasClass('is--type-radio') || $field.hasClass('is--type-checkbox')) {
                if (!$field.find('input[name]').is(':checked')) {
                  $field.addClass(listEmtyAnimate);
                  isReturn = true;
                }
              } else if ($this.val().length == 0) {
                $field.addClass(listEmtyAnimate);
                isReturn = true;
              }
            });
          }

          if (isReturn) {
            clearTimeout(myVar);
            myVar = setTimeout(function () {
              $form.find('.is--animated.sr4-ani-shake').removeClass('is--animated sr4-ani-shake');
            }, 999);

            $required.off(eventrequired).on(eventrequired, function (e) {
              //console.log(this)
              let $this = $(this),
                $field = $this.closest('[data-item-property-field]');

              if ($field.hasClass('is--type-radio') || $field.hasClass('is--type-checkbox')) {
                if ($field.find('input[name]').is(':checked')) {
                  $field.removeClass(listEmtyAnimate);
                }
              } else if ($this.val().length > 0) {
                $field.removeClass(listEmtyAnimate);
              }
            });

            return;
          }

          if (!enableAjaxATC) return;

          $required.off(eventrequired);

          e.preventDefault();

          addFetchFrom($(this));
        }
      });
    }

    /**
     * Add to cart form
     */
    // function addFetchFromHandlerAjax( $form ) {
    //    addFetchFromHandler( $form );
    // }

    /**
     * Add to cart item
     */
    function addFetchItemHandler() {
      $body.on('click', '[data-action-atc]', function (e) {
        if (!enableAjaxATC) return;

        e.preventDefault();
        addFetchItem($(this));
      });
    }

    /**
     * Change item
     */
    function changeFetchItemHandler() {
      // $('[data-cart-items]').off('keyup').on('keyup', '[data-action-change]', function(e) {

      // if (!enableAjaxCart) return;
      // e.preventDefault();
      // changeFetchItem($(this));
      // console.log('keyup')
      // })
      $('[data-cart-items]')
        .off(eventChange)
        .on(eventChange, '[data-action-change]', function (e) {
          var $this = $(this),
            $item = $this.closest('[data-cart-item]'),
            vid = $this.data('id'),
            qty = $this.val() || 1,
            max = $this.attr('max') || 9999;
          //console.log('qty', qty, e)
          if (!enableAjaxCart) return;

          changeFetchItem($this, vid, qty);
        })
        .off('click.remove')
        .on('click.remove', '[data-cart-remove]', function (e) {
          // click remove item

          if (!enableAjaxCart) return;

          e.preventDefault();
          var $this = $(this),
            vid = $this.data('id');

          changeFetchItem($this, vid, 0);
        });
    }

    function init() {
      $document.on('submitAtc:sr4', function (e) {
        addFetchFromHandler(e.$container.find('[data-type="add-to-cart-form"]'));
      });
      addFetchFromHandler($('[data-type="add-to-cart-form"]'));
      addFetchItemHandler();
      changeFetchItemHandler();
    }

    return {
      init: init,
      change: changeFetchItemHandler,
    };
  })();

  sr4ThemeSP.sr4QuantityAdjust = (function () {
    var notice_stock_msg = sr4strings.notice_stock_msg,
      disOnlyStock = sr4configs.disOnlyStock,
      dataCurrentQty = 'data-current-qty';

    if (!String.prototype.getDecimals) {
      String.prototype.getDecimals = function () {
        var num = this,
          match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
        if (!match) {
          return 0;
        }
        return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
      };
    }

    function quantityAdjust() {
      /**
       * Check when changed input number qty
       */
      $body.on('change', '[data-quantity-value]', function (e) {
        //e.preventDefault();

        var _this = $(this),
          vid = _this.data('id'),
          qty = _this.val() || 1,
          max = _this.attr('max') || 9999,
          min = _this.attr('min') || 1,
          currentQty = _this.attr(dataCurrentQty) || 0.1,
          fgr_frm = _this.closest('.fgr_frm');

        if (fgr_frm.length > 0) {
          subtt_price_group(fgr_frm);
          $body.trigger('currency:update');
        }
        // console.log(min, qty, max)
        //sr4ThemeSP.HideNotices();
        if (parseInt(qty) > parseInt(max)) {
          _this.val(max);
          _this.attr(dataCurrentQty, max);
          if (currentQty != max) _this.attr(dataCurrentQty, max).trigger(eventChange);

          if (disOnlyStock) return;
          sr4ThemeSP.Notices(notice_stock_msg.replace('[max]', max));
          return false;
        } else if (parseInt(qty) < parseInt(min)) {
          _this.val(min);
          if (currentQty != min) _this.attr(dataCurrentQty, min).trigger(eventChange);
          return false;
        }
        _this.trigger(eventChange);
        _this.attr(dataCurrentQty, qty);
      });

      /**
       * Check when clicked plus, minus
       */
      $body.on('click', '[data-quantity-selector]', function (e) {
        e.preventDefault();
        // Get values
        var $this = $(this),
          $qty = $this.closest('[data-quantity-wrapper]').find('[data-quantity-value]'),
          currentVal = parseFloat($qty.val()),
          max = parseFloat($qty.attr('max')),
          min = parseFloat($qty.attr('min')),
          step = $qty.attr('step');

        // Format values
        if (!currentVal || currentVal === '' || currentVal === 'NaN') currentVal = 0;
        if (max === '' || max === 'NaN') max = '';
        if (min === '' || min === 'NaN') min = 0;
        if (step === 'any' || step === '' || step === undefined || parseFloat(step) === 'NaN') step = 1;
        //sr4ThemeSP.HideNotices();

        // Change the value
        if ($this.is('[data-increase-qty]')) {
          if (max && currentVal >= max) {
            $qty.val(max);

            if (disOnlyStock) return;
            sr4ThemeSP.Notices(notice_stock_msg.replace('[max]', max));
            return false;
          } else {
            $qty.val((currentVal + parseFloat(step)).toFixed(step.getDecimals()));
          }
        } else {
          if (min && currentVal <= min) {
            $qty.val(min);
          } else if (currentVal > 0) {
            $qty.val((currentVal - parseFloat(step)).toFixed(step.getDecimals()));
          }
        }

        // Trigger change event
        $qty.trigger('change');
        //$qty.trigger(eventChange);
      });

      // var _grpjs = '[data-qty-grpjs]',
      //     $grpjs = $(_grpjs);
      // if ($grpjs.length == 0) return;
      // $grpjs.each(function () {

      //     var _this = $(this),
      //         qty_grpjs = _this.data('qty-grpjs') || 0;
      //     if (qty_grpjs) {
      //       //_this.find('.js_item_group .qty_pr_js').val(qty_grpjs);
      //       _this.find('.js_item_group .qty_pr_js').eq(0).trigger('change');
      //     }

      // });
    }

    return quantityAdjust;
  })();

  sr4ThemeSP.agreeForm = (function () {
    var asRund = false,
      dataCheckbox = '[data-agree-checkbox]';
    // agree Checkout, Mail
    function init() {
      if (asRund || $(dataCheckbox).length == 0) return;
      asRund = true;

      $body.on('click', '[data-agree-btn], [name="checkout"], [name="goto_pp"], [name="goto_gc"]', function (e) {
        var $form = $(this).closest('form'),
          $checkbox = $form.find(`[type="checkbox"]${dataCheckbox}`);

        if (!$form[0] || $checkbox.length == 0) return;

        if ($checkbox.is(':checked')) {
          $(this).submit();
        } else {
          e.preventDefault();
          e.stopPropagation();
          sr4ThemeSP.Notices(sr4strings.agree_checkout);
          // Alert
        }
      });

      $body.on('click', dataCheckbox, function (e) {
        var $form = $(this).closest('form');

        if ($(this).is(':checked')) {
          $body.trigger('hide.sr4.notices');
        }
      });
    }

    return init;
  })();

  /**
   *-------------------------------------------------------------------------------------------------------------------------------------------
   * Init GalleryPhotoSwipe
   * https://photoswipe.com/v4-docs/getting-started.html
   *-------------------------------------------------------------------------------------------------------------------------------------------
   */
  sr4ThemeSP.PhotoSwipe = (function () {
    var photoswipe_template = $('#photoswipe_template').html(),
      str_gallery = 'pswp__thumbnails',
      str_thumb_active = 'pswp_thumb_active',
      CheckDragedSlider = false,
      PhotoSwipeTrigger = '[data-pswp-btn-triger], [data-sr4-gallery--open]:not(.is-pswp-disable)',
      clickEvent = 'click.pswp',
      dataImgs = 'data-pswp-images-trigger',
      classPswpsr4 = '.pswp__sr4';

    // Gallery PhotoSwipe

    function initGallery() {
      $('[data-sr4-gallery].flickitysr4-enabled')
        .on('dragEnd.flickitysr4', function (event, pointer) {
          CheckDragedSlider = true;
        })
        .on('staticClick.flickitysr4', function (event, pointer, cellElement, cellIndex) {
          // console.log('staticClick');
          CheckDragedSlider = false;
        });

      //      $document.on(clickEvent, PhotoSwipeTrigger, function (e) {

      //         e.preventDefault();

      // var $this     = $(this),
      // $btns         = $this.closest('[data-sr4-group-btns]') || $this,
      // isPswpProduct = $this[0].hasAttribute('data-pr-trigger-pswp'),
      // //$gallery      = $btns.siblings( isPswpProduct ? '[data-main-media]' : '[data-sr4-gallery]' ),
      // $gallery      = $btns.siblings( '[data-sr4-gallery]' ),
      // parentsStr    = (isPswpProduct) ? '[data-media-type="image"]' : '[data-sr4-gallery--item]',
      // index         = getCurrentGalleryIndex(e, $gallery, parentsStr);

      //         $gallery.find('[data-sr4-gallery--open]').eq(index).trigger(clickEvent);

      //      });

      $document.on(clickEvent, PhotoSwipeTrigger, function (e) {
        e.preventDefault();

        var $this = $(this),
          index = -1;

        if ($this.is('[data-pswp-btn-triger]')) {
          var $btns = $this.closest('[data-sr4-group-btns]') || $this,
            isPswpProduct = $this[0].hasAttribute('data-pr-trigger-pswp'),
            $gallery = $btns.siblings('[data-sr4-gallery]'),
            parentsStr = isPswpProduct ? '[data-media-type="image"]:not(.is--media-hide)' : '[data-sr4-gallery--item]';
          index = getCurrentGalleryIndex(e, $gallery, parentsStr);
          $this = $gallery.find('[data-sr4-gallery--open]').eq(index);
          CheckDragedSlider = false;
        } else {
          var isPswpProduct = $this.hasClass('sr4-product__media'),
            parentsStr = isPswpProduct ? '[data-media-type="image"]:not(.is--media-hide)' : '[data-sr4-gallery--item]';
        }

        var $parent = $this.parents(parentsStr),
          //$holder     = $this.closest( isPswpProduct ? '[data-main-media]' : '[data-sr4-gallery]' ),
          $holder = $this.closest('[data-sr4-gallery]'),
          $pswpSrc = $holder.find(
            isPswpProduct ? '[data-media-type="image"]:not(.is--media-hide) [data-master]' : '[data-pswp-src]'
          );

        // console.log(isPswpProduct, $parent);
        // console.log(isPswpProduct, $holder);
        // console.log(isPswpProduct, $pswpSrc );
        // if($this.hasClass('show_btn_pr_gallery')) {CheckDragedSlider = false}

        // console.log($pswpSrc.length, CheckDragedSlider);
        if ($pswpSrc.length == 0 || CheckDragedSlider) {
          CheckDragedSlider = false;
          return;
        }

        var HasThumb = $holder.is('[data-sr4-thumb-true]'),
          items = getGalleryImages($pswpSrc),
          maxSpreadZoom = parseFloat($holder.attr('data-maxSpreadZoom')),
          fullscreenEl = $holder.attr('data-fullscreenEl'),
          shareEl = $holder.attr('data-shareEl'),
          counterEl = $holder.attr('data-counterEl');

        index = index > -1 ? index : $parent.index();

        callPhotoSwipe({
          index: index,
          items: items,
          HasThumb: HasThumb,
          galleryItems: $holder,
          parents: parentsStr,
          global: false,
          maxSpreadZoom: maxSpreadZoom,
          fullscreenEl: fullscreenEl,
          shareEl: shareEl,
          counterEl: counterEl,
        });
      });
    }

    function callPhotoSwipe(args) {
      // console.log('callPhotoSwipe')
      var items = args.items,
        items_length = items.length,
        index = args.index,
        galleryItems = args.galleryItems;

      if (isThemeRTL) {
        //items = items.reverse();
        index = items_length - index - 1;
      }

      var options = {
        closeEl: true,
        captionEl: true,
        fullscreenEl: args.fullscreenEl || true,
        zoomEl: true,
        shareEl: args.shareEl || true,
        counterEl: args.counterEl || true,
        arrowEl: true,
        preloaderEl: true,
        history: false,
        maxSpreadZoom: args.maxSpreadZoom || 2,
        showHideOpacity: true,
        bgOpacity: 1,
        index: args.index,
        tapToToggleControls: true,
        // isClickableElement : function(el) {
        //    return $(el).hasClass(str_gallery) || $(el).parent().hasClass(str_gallery);
        // },
        shareButtons: [
          {
            id: 'facebook',
            label: sr4strings.pswp_facebook,
            url: 'https://www.facebook.com/sharer/sharer.php?u={{url}}',
          },
          {
            id: 'twitter',
            label: sr4strings.pswp_twitter,
            url: 'https://twitter.com/intent/tweet?text={{text}}&url={{url}}',
          },
          {
            id: 'pinterest',
            label: sr4strings.pswp_pinterest,
            url: 'https://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}',
          },
          // ,{
          //    id      : 'download',
          //    label   : 'Download image',
          //    url     : '{{raw_image_url}}',
          //    download: true
          // }
        ],
        getThumbBoundsFn: function (index) {
          // if (galleryItems.hasClass('xts-carousel')) {
          //    return;
          // }

          var $element = galleryItems.find(args.parents).eq(index);

          if (args.global) {
            $element = galleryItems.find('a[data-index=' + index + ']').parents(args.parents);
          }

          var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
          var rect = $element[0].getElementsByTagName('img')[0].getBoundingClientRect();

          return {
            x: rect.left,
            y: rect.top + pageYScroll,
            w: rect.width,
          };
        },
      };
      // console.log(options)

      // destroy if exit slider on $customGallery
      // $('.'+str_gallery).find('.flickitysr4-enabled').flickitysr4('destroy');
      $body.find(classPswpsr4).remove();
      sr4ThemeSP.$appendComponent.after(photoswipe_template);

      // if (isThemeRTL) {
      //   // items_length = items_length - 1;
      //   // index = items_length - index;
      //   index = items_length - index - 1;
      //   items = items.reverse();
      // }
      //var $customGallery = $('.'+str_gallery).find('.flickitysr4');
      var $pswpElement = document.querySelectorAll(classPswpsr4)[0],
        $customGallery = $('.' + str_gallery);

      // console.log(items)
      var gallery = new PhotoSwipe($pswpElement, PhotoSwipeUI_Default, items, options),
        myTimeout;

      gallery.init();
      $customGallery.empty();

      // Opening off close NTpopupInline
      clearTimeout(myTimeout);
      $body.trigger('NTpopupInline:offClose');
      // Check Close select image when is a slider
      gallery.listen('close', function () {
        myTimeout = setTimeout(function () {
          $body.trigger('NTpopupInline:onClose');
        }, 500);
        if (!galleryItems.hasClass('flickitysr4-enabled')) return;
        // if (isThemeRTL) {
        //   var i = items_length - gallery.getCurrentIndex();
        // } else {
        //   var i = gallery.getCurrentIndex();
        // }
        var i = gallery.getCurrentIndex();
        //var i = gallery.getCurrentIndex();
        //$('.p-thumb.flickitysr4-enabled').flickitysr4( 'select', i )

        galleryItems.flickitysr4('selectCell', i, false, true);
        //$(".pswp_thumb_item").off('click');
      });

      // Check use thumb
      if (args.HasThumb) {
        thumbPhotoSwipe(items_length, items, $customGallery, gallery);
      }
    }

    function getGalleryImages(el) {
      var items = [],
        $this;
      el.each(function () {
        $this = $(this);
        items.push({
          src: $this.attr('data-pswp-src') || $this.attr('data-master'),
          w: $this.attr('data-pswp-w') || $this.attr('width'),
          h: $this.attr('data-pswp-h') || $this.attr('height'),
        });
      });
      return items;
    }

    function getCurrentGalleryIndex(e, $gallery, parentsStr) {
      //console.log(e.currentTarget, $gallery, parentsStr)

      if ($gallery.hasClass('flickitysr4-enabled')) {
        //console.log('sss',$gallery.find(parentsStr+'.is-selected').index())
        return $gallery.find(parentsStr + '.is-selected').index();
      } else if ($(e.currentTarget).is(PhotoSwipeTrigger)) {
        return 0;
      } else {
        return $(e.currentTarget).index();
      }
    }

    /**
     * Single Image PhotoSwipe
     *
     */
    function initImage() {
      $document.on(clickEvent, '[data-sr4-image-opend]', function (e) {
        e.preventDefault();
        callImage($(this));
      });
    }

    function callImage($this) {
      $body.find(classPswpsr4).remove();
      sr4ThemeSP.$appendComponent.after(photoswipe_template);

      var $pswp = $(classPswpsr4),
        pswpElement = $pswp[0],
        pswpClass = $this.attr('data-pswp-class');

      if (pswpClass) $pswp.addClass(pswpClass);

      // define options (if needed)
      var options = {
        history: false,
        maxSpreadZoom: 2,
        showHideOpacity: true,
        fullscreenEl: false,
        shareEl: false,
        counterEl: false,
        bgOpacity: 1,
        getThumbBoundsFn: function (index) {
          var pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
            rect = $this[0].getBoundingClientRect();

          return {
            x: rect.left,
            y: rect.top + pageYScroll,
            w: rect.width,
          };
        },
      };

      // Initializes and opens PhotoSwipe
      var items = [],
        img_w = $this.attr('data-pswp-w'),
        img_h = $this.attr('data-pswp-h'),
        img_src = $this.attr('data-pswp-src');

      items.push({
        src: img_src,
        w: img_w,
        h: img_h,
        title: $this.text(),
      });

      var imagePhotoSwipe = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options),
        myTimeout;
      imagePhotoSwipe.init();

      // Opening off close NTpopupInline
      clearTimeout(myTimeout);
      $body.trigger('NTpopupInline:offClose');
      imagePhotoSwipe.listen('close', function () {
        myTimeout = setTimeout(function () {
          $body.trigger('NTpopupInline:onClose');
        }, 500);
      });
    }

    /**
     * Trigger btns show images PhotoSwipe
     *
     */
    function initImages() {
      $document.on(clickEvent, `[${dataImgs}]`, function (e) {
        e.preventDefault();
        // build items array
        let $this = $(this),
          jsonImgs = JsonParse($this.attr(dataImgs), '[]');
        if (jsonImgs.length == 0) return;
        openPhotoSwipe(jsonImgs, $this);
      });
    }

    function openPhotoSwipe(items, $this) {
      if (!items) return;

      $body.find(classPswpsr4).remove();
      sr4ThemeSP.$appendComponent.after(photoswipe_template);

      // build items array
      let l = items.length,
        pswpElement = document.querySelectorAll(classPswpsr4)[0],
        $customGallery = $('.' + str_gallery),
        // items = jsonImgs.map((image, index) => {
        //    return ({ src: image.src, w: image.width, h: image.height, alt: image.alt });
        // }),
        // console.log(items)
        // define options (if needed)
        options = {
          // history & focus options are disabled on CodePen
          history: false,
          focus: false,

          showAnimationDuration: 0,
          hideAnimationDuration: 0,
        },
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

      gallery.init();

      if ($this.is('data-disable-thumb')) return;
      thumbPhotoSwipe(l, items, $customGallery, gallery);
    }

    function adjustGalleryPosition($customGallery) {
      let selectedThumb = $('.' + str_thumb_active)[0],
        $pswp__thumb = $customGallery,
        thumbContainer = $pswp__thumb[0],
        thumbBounds = selectedThumb.getBoundingClientRect(),
        thumbWrapperBounds = thumbContainer.getBoundingClientRect();

      if (thumbBounds.left + thumbBounds.width > thumbWrapperBounds.width) {
        //thumbContainer.scrollLeft = selectedThumb.offsetLeft + thumbBounds.width - thumbWrapperBounds.width + 10;
        $pswp__thumb.animate(
          { scrollLeft: selectedThumb.offsetLeft + thumbBounds.width - thumbWrapperBounds.width + 10 },
          200
        );
      } else if (selectedThumb.offsetLeft < thumbContainer.scrollLeft) {
        //thumbContainer.scrollLeft = selectedThumb.offsetLeft - 10;
        $pswp__thumb.animate({ scrollLeft: selectedThumb.offsetLeft - 10 }, 200);
      }
    }

    function thumbPhotoSwipe(items_length, items, $customGallery, gallery) {
      if (items_length <= 1) {
        return;
      }

      for (var index = 0; index < items_length; index++) {
        $customGallery.append(
          '<div class="pswp_thumb_item" data-index="' +
            (index + 1) +
            '"><img loading="lazy" src="' +
            items[index].src +
            '" alt="pswp-thumb-img"></div>'
        );
      }

      $customGallery
        .find('.pswp_thumb_item[data-index="' + (gallery.getCurrentIndex() + 1) + '"]')
        .addClass(str_thumb_active);

      gallery.listen('beforeChange', function () {
        var index = gallery.getCurrentIndex() + 1;
        var $current = $customGallery.find('.pswp_thumb_item[data-index="' + index + '"]');

        $current.siblings().removeClass(str_thumb_active);
        $current.addClass(str_thumb_active);
        //adjustGalleryPosition();
      });

      gallery.listen('afterChange', function () {
        // Check RTL   var i = items_length - gallery.getCurrentIndex();
        // var index = gallery.getCurrentIndex() + 1;
        // var $current = $customGallery.find('.pswp_thumb_item[data-index="' + index + '"]');

        // $current.siblings().removeClass(str_thumb_active);
        // $current.addClass(str_thumb_active);
        adjustGalleryPosition($customGallery);
      });

      $customGallery.find('.pswp_thumb_item').on('click', function () {
        var index = $(this).data('index');
        gallery.goTo(index - 1);
      });
    }

    return {
      gallery: initGallery,
      image: initImage,
      images: initImages,
    };
  })();

  /**
   *-------------------------------------------------------------------------------------------------------------------------------------------
   * Init Section Video Click
   * https://developers.google.com/youtube/player_parameters#loop
   * https://vimeo.zendesk.com/hc/en-us/articles/115004485728-Autoplay-and-loop-embedded-videos
   * https://developers.google.com/youtube/player_parameters#modestbranding
   * https://developer.vimeo.com/api/oembed/videos
   *-------------------------------------------------------------------------------------------------------------------------------------------
   */
  sr4ThemeSP.Video = (function () {
    var str_class_vid = 'sr4-postervideo-playing';
    var player;

    function pauseAllMedia() {
      $('.js-youtube').each(function () {
        this.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
      });
      $('.js-vimeo').each(function () {
        this.contentWindow.postMessage('{"method":"pause"}', '*');
      });
      $('video:not(.sr4_bg_vid_html5)').each(function () {
        this.pause();
      });
      $('.product-model').each(function () {
        if (this.modelViewerUI) this.modelViewerUI.pause();
      });

      // document.querySelectorAll('.js-youtube').forEach(function(video) {
      //  video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
      // });
      // document.querySelectorAll('.js-vimeo').forEach(function(video) {
      //   video.contentWindow.postMessage('{"method":"pause"}', '*');
      // });
      // document.querySelectorAll('video').forEach(function(video) {
      //  video.pause();
      // });
      // document.querySelectorAll('product-model').forEach(function(model) {
      //   if (model.modelViewerUI) model.modelViewerUI.pause();
      //  video.pause();
      // });

      // document.querySelectorAll('.js-youtube').forEach(function(video) {
      //  video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
      // });
      // document.querySelectorAll('.js-youtube').forEach((video) => {
      //   video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
      // });
      // document.querySelectorAll('.js-vimeo').forEach((video) => {
      //   video.contentWindow.postMessage('{"method":"pause"}', '*');
      // });
      // document.querySelectorAll('video').forEach((video) => video.pause());
      // document.querySelectorAll('product-model').forEach((model) => {
      //   if (model.modelViewerUI) model.modelViewerUI.pause();
      // });
    }

    function loadContentVideo($el, $this) {
      if ($el.is('[loaded]')) return;

      var $el_insert = $el.find('[data-video-insert]').length ? $el.find('[data-video-insert]') : $el,
        markupIframe =
          '<iframe src="src_sr4" class="class_sr4" title="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
        markupVideo = '<video src="src_sr4" preload="auto" controls data-autoplay data-loop playsinline></video>',
        options_poster = JSON.parse($this.attr('data-options') || '{}'),
        TypeVideo = options_poster.type, //youtube, vimeo, html5
        IdVideo = options_poster.vid,
        tmpVideoID = options_poster.id,
        SrcVideo = options_poster.srcDefault,
        isAutoplayVideo = options_poster.autoplay,
        isLoopVideo = options_poster.loop,
        type = {
          html5: 'html5',
          youtube: 'youtube',
          vimeo: 'vimeo',
        };

      if (TypeVideo == type.youtube) {
        // update src, class, id video
        markupIframe = '<div id="' + tmpVideoID.replace('#', 'sr4_yt_') + '"></div>';
        // markupIframe = markupIframe.replace( 'src_sr4','//www.youtube.com/embed/'+IdVideo+'?enablejsapi=1&showinfo=0&controls=1&modestbranding=1&autoplay='+(+isAutoplayVideo)+'&rel=0'+(isLoopVideo ? '&playlist='+IdVideo+'&loop=1':'') ).replace('class_sr4','js-youtube');
      } else if (TypeVideo == type.vimeo) {
        // update src, class, id video
        markupIframe = markupIframe
          .replace(
            'src_sr4',
            '//player.vimeo.com/video/' +
              IdVideo +
              '?&portrait=0&byline=0&color=' +
              options_poster.accent_color +
              '&autoplay=' +
              +isAutoplayVideo +
              '&loop=' +
              +isLoopVideo
          )
          .replace('class_sr4', 'js-vimeo');
      } else {
        // update src video
        if (tmpVideoID && $(tmpVideoID)[0]) {
          markupIframe = $(tmpVideoID).html();
        } else {
          markupIframe = markupVideo.replace('src_sr4', SrcVideo);
          if (isAutoplayVideo) markupIframe = markupIframe.replace('data-autoplay', 'autoplay');
          if (isLoopVideo) markupIframe = markupIframe.replace('data-loop', 'loop');
        }
      }

      $el_insert.append(markupIframe);
      $el.attr('data-type-video-inline', '').attr('loaded', true);
      // var $video  = $el.find('video, iframe');

      // $el.attr('loaded', true).addClass(str_class_vid);
      // $video.focus();

      if (TypeVideo == type.youtube) {
        // add ytapi
        if ($('#YTAPI').length <= 0) {
          var tag = document.createElement('script');
          tag.src = 'https://www.youtube.com/iframe_api';
          tag.id = 'YTAPI';
          var firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
        var callbackTimer = setInterval(function () {
          if (typeof onYouTubeIframeAPIReady === 'function' && typeof YT.Player === 'function') {
            player = new YT.Player(tmpVideoID.replace('#', 'sr4_yt_'), {
              height: '315',
              width: '560',
              videoId: IdVideo,
              playerVars: {
                playsinline: 1,
                rel: 0,
                playlist: IdVideo,
                loop: isLoopVideo ? 1 : 0,
              },
              events: {
                onReady: onPlayerReady,
              },
            });
            clearInterval(callbackTimer);
          }
        }, 100);
      }
    }

    function onPlayerReady(event) {
      event.target.playVideo();
    }

    function closeContentVideo() {}

    function initvideoPoster() {
      $('[data-video-poster-btn]').on('click', function (e) {
        e.preventDefault();

        var $elposter = $(this).closest('[data-video-poster]'),
          $video = $elposter.find('video, iframe');
        pauseAllMedia();
        loadContentVideo($elposter, $(this));
        setTimeout(function () {
          $elposter.addClass(str_class_vid);
          $video.focus();
        }, 50);
      });

      $('[data-video-poster-close]').on('click', function (e) {
        e.preventDefault();

        pauseAllMedia();
        var $elposter = $(this).closest('[data-video-poster]');
        $elposter.removeAttr('loaded').removeClass(str_class_vid);
        $elposter.find('video, iframe').remove();
      });
    }

    return {
      initPoster: initvideoPoster,
    };
  })();

  /**
   * LoadMore section not main
   *
   */
  var LoadMore = (function () {
    var str_wrap_lm = '[data-wrap-lm]',
      str_wrap_lm_prev = '[data-wrap-lm-prev]',
      str_contentlm_replace = '[data-contentlm-replace]',
      clickEvent = 'click.ntlm',
      classes = {
        loading: 'is--loading',
      },
      filterUrl;

    function loadMore(container) {
      this.container = container;
      this.$container = $(container);
      this.options = JSON.parse(this.$container.attr('data-ntajax-options'));
      this.main = this.options.id || '';
      this.typeAjax = this.options.type || 'LmDefault'; //LmDefault,LmIsotope,AjaxDefault,AjaxIsotope
      this.isProduct = this.options.isProduct || false;
      this.$section = $(`#shopify-section-${this.main}`);
      self.isbtnLoadMore = true;

      this.setupEventListeners();
    }

    loadMore.prototype = Object.assign({}, loadMore.prototype, {
      setupEventListeners: function () {
        var self = this;
        self.$container.on(clickEvent, '[data-load-more]', function (e) {
          e.preventDefault();

          const $this = $(this);

          $this.addClass(classes.loading);

          filterUrl = `${$this.attr('data-href') || $this.attr('href')}&section_id=${self.main}`;

          self.isbtnLoadMore = !$(this).is('[data-is-prev]');
          self.$btnCurrent = $(this);
          self.renderSectionFromFetch(filterUrl);
        });
      },

      renderSectionFromFetch: function (url) {
        var self = this;

        sr4ThemeSP.getToFetchSection(null, 'text', url).then((data) => {
          if (data == 'NVT_94') {
            self.$btnCurrent.removeClass(classes.loading);
            // eslint-disable-next-line no-console
            // console.log(error);
            return;
          }
          self.$btnCurrent.removeClass(classes.loading);
          self[self.typeAjax](data);

          if (this.isProduct) sr4ThemeSP.reinitProductGridItem();
          $body.trigger('sr4:hideTooltip');
        });
        // fetch(url)
        // .then(response => response.text())
        // .then((data) => {
        //    self.$btnCurrent.removeClass(classes.loading);
        //    self[self.typeAjax](data);

        //    if ( this.isProduct )sr4ThemeSP.reinitProductGridItem();
        //    $body.trigger('sr4:hideTooltip');
        // })
        // .catch((error) => {
        //   self.$btnCurrent.removeClass(classes.loading);
        //   // eslint-disable-next-line no-console
        //   console.log(error);
        // });
      },

      LmDefault: function (data) {
        //console.log(data);
        var $data = $(data),
          items = $data.find(str_contentlm_replace).html(),
          $btnLM = this.isbtnLoadMore ? $data.find(str_wrap_lm) : $data.find(str_wrap_lm_prev),
          $content = this.$container.find(str_contentlm_replace);
        if (!$content[0]) {
          $content = this.$section.find(str_contentlm_replace);
        }

        //console.log(ArrResults);

        if (this.isbtnLoadMore) {
          $content.append(items);
        } else {
          $content.prepend(items);
        }
        this.initLoamoreUpdate($btnLM);
      },

      LmIsotope: function (data) {
        //console.log(data);
        var $data = $(data),
          items = $data.find(str_contentlm_replace).html(),
          $btnLM = this.isbtnLoadMore ? $data.find(str_wrap_lm) : $data.find(str_wrap_lm_prev),
          $content = this.$container.find(str_contentlm_replace);
        if (!$content[0]) {
          $content = this.$section.find(str_contentlm_replace);
        }
        //console.log(ArrResults);
        items = $(items);
        if (this.isbtnLoadMore) {
          $content.append(items).isotopesr4('appended', items);
        } else {
          $content.prepend(items).isotopesr4('prepended', items);
        }
        this.initLoamoreUpdate($btnLM);
      },

      initLoamoreUpdate: function ($btnLM) {
        // console.log( ArrResults );

        // Update count items current
        // $('[data-current-items]').html(ArrResults[1]);
        // Update link loadmore next,  update html loadmore bar
        let txt_wrap_lm = this.isbtnLoadMore ? str_wrap_lm : str_wrap_lm_prev,
          $wrap_lm = this.$container.find(txt_wrap_lm);

        if (!$wrap_lm[0]) {
          $wrap_lm = this.$section.find(txt_wrap_lm);
        }

        if ($btnLM.length > 0) {
          $wrap_lm.html($btnLM.html());
        } else {
          $wrap_lm.hide();
        }

        // if ( $btnLM.length > 0 && this.isbtnLoadMore) {
        //    this.$section.find(str_wrap_lm).html( $btnLM.html() );
        // } else if (this.isbtnLoadMore) {
        //    this.$section.find(str_wrap_lm).hide();
        //    //this.$section.find('[data-wrap-lm-bar]').hide();

        // // Update link loadmore prev
        // } else if ( $btnLM.length > 0 && !this.isbtnLoadMore) {
        //    this.$section.find(str_wrap_lm_prev).html( $btnLM.html() );
        // } else if (!this.isbtnLoadMore) {
        //    this.$section.find(str_wrap_lm_prev).hide();
        // }
      },
    });

    return loadMore;
  })();

  sr4ThemeSP.initLoadMore = function () {
    $('[data-ntajax-options][data-not-main]:not(.is--enabled)').each(function () {
      $(this).addClass('is--enabled');
      this.LoadMore = new LoadMore(this);
    });
  };

  sr4ThemeSP.reinitProductGridItem = function () {
    // console.log(this)
    this.ProductItem.init();
    this.ProductItem.reloadReview();
    this.Tooltip();
    sr4ThemeSP.Countdown();
    sr4ThemeSP.Compare.updateAll();
    sr4ThemeSP.Wishlist.updateAll();
    $body.trigger('currency:update');
    // sr4ThemeSP.ProductItem.clickMoreSwatches();
    // sr4ThemeSP.ProductItem.swatchesClickHover();
    //sr4ThemeSP.ProductItem.resizeObserver();
    // sr4ThemeSP.ProductItem.initQuickVS();
    // sr4ThemeSP.ProductItem.initAddToCart();
  };

  /**
   * https://developers.facebook.com/docs/instagram-basic-display-api/reference/access_token
   * https://developers.facebook.com/docs/instagram-basic-display-api/reference/media/
   * https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens/
   * window.EComposer.configs.instagram // Access token instagram EC
   */
  sr4ThemeSP.instagram = (function () {
    var ajaxUrl = 'https://d3ejra0xbg20rg.cloudfront.net/instagram/media?shop=' + Shopify.shop + '&resource=default',
      ins_19041994 = 'ins_19041994', // ins_19041994
      ig_sr4_token = 'ig_sr4_token',
      isTrueCki = CookiesT4.get(ig_sr4_token) === 'true',
      textIns = '.sr4-icons-ins-svg',
      GetIcons = $(textIns).html() || '',
      ArrIcons = GetIcons.split('[sr4plit]'),
      classes = {
        loaded: 'ins-is--loaded',
      };

    function instagramFetch(ajaxUrl, _this, acc, limit, dtid) {
      sr4ThemeSP.getToFetchSection(null, 'json', ajaxUrl).then((res) => {
        if (res == 'NVT_94') {
          console.error('Instagram Feed:error fetch');
          return;
        }
        //console.log('Success:', data);
        var data = acc == ins_19041994 ? res : res.data;
        instagramHTML(_this, data, true, acc, limit, dtid, target);
      });

      // fetch(ajaxUrl)
      // .then(response => response.json())
      // .then(res => {
      //   //console.log('Success:', data);
      //    var data = (acc == ins_19041994) ? res : res.data;
      //    instagramHTML(_this,data,true,acc,limit,dtid,target);
      // })
      // .catch((error) => {
      //   console.error("Instagram Feed:error fetch");
      // });
    }

    function instagramHTML(_this, data, bl, acc, limit, dtid, target) {
      // Update icon if lazy load parent of instagam,
      if (ArrIcons.length == 1) {
        GetIcons = $(textIns).html() || '';
        ArrIcons = GetIcons.split('[sr4plit]');
      }
      var html = '',
        bl = bl || true,
        strs = {
          IMAGE: 'image',
          VIDEO: 'video',
          CAROUSEL_ALBUM: 'carousel_album',
        },
        icons = {
          image: ArrIcons[0],
          video: ArrIcons[1],
          carousel_album: ArrIcons[2],
        };

      $.each(data, function (index, el) {
        if (index >= limit) return 0;
        //console.log(el);
        var media_url = el.thumbnail_url || el.media_url,
          media_type = strs[el.media_type];
        html +=
          '<div class="sr4-col-ins' +
          index +
          ' sr4-col-ins sr4-col-item sr4-ins-type-' +
          media_type +
          '"><a data-no-instant rel="nofollow" class="sr4-d-block sr4-pr sr4-oh" href="' +
          el.permalink +
          '" target="' +
          target +
          '"><div class="sr4_ratio sr4_bg lazyloadsr4 sr4-lz--ins" data-bg="' +
          media_url +
          '" data-sizes="auto"></div><span class="lazyloadsr4-loader"></span><div class="sr4-ins-info"><span class="sr4-ins-icon">' +
          icons[media_type] +
          '</span></div></a></div>';
      });

      //console.log(html);
      _this.html(html).parent().addClass(classes.loaded);

      if (_this.hasClass('flickitysr4-later')) {
        _this[0].flickitysr4 = new sr4ThemeSP.Carousel(_this[0]);
        //sr4ThemeSP.Flickitysr4.init(_this);
      }

      if (isStorageSpSessionAll && bl) {
        sessionStorage.setItem('nt_ins' + acc + dtid, html);
        sessionStorage.setItem(
          'nt_ins' + acc,
          JSON.stringify({
            timestamp: new Date(),
            content: data,
          })
        );
        // sessionStorage.setItem('nt_ins'+acc+dtid, html);
        // sessionStorage.setItem('nt_ins'+acc, JSON.stringify(data));
      }
    }

    function refresh_ins(_this) {
      // data-inssr4-options='{ "id":'123',"limit":4, "acc":"abcnathan", "target":"_blank" }'
      var OptionsIns = JsonParse(_this.attr('data-inssr4-options')),
        datalm = null,
        data = null,
        id = '',
        dtid = OptionsIns.id,
        limit = OptionsIns.limit,
        default_txt = 'spnt_t4',
        acc = OptionsIns.acc || default_txt,
        target = OptionsIns.target,
        now,
        expiration;

      if (acc == default_txt) return;

      acc = atob(acc);
      //console.log(acc);
      if (isStorageSpSessionAll) {
        datalm = sessionStorage.getItem('nt_ins' + acc + dtid);
        data = sessionStorage.getItem('nt_ins' + acc);

        if (data != null && data != '') {
          // calculate expiration time for content,
          // to force periodic refresh after 30 minutes
          now = new Date();
          expiration = new Date(data.timestamp);
          expiration.setMinutes(expiration.getMinutes() + 30);

          // ditch the content if too old
          if (now.getTime() > expiration.getTime()) {
            data = null;
            datalm = null;
            sessionStorage.removeItem('nt_ins' + acc + dtid);
            sessionStorage.removeItem('nt_ins' + acc);
          }
        }
      }

      if (datalm != null && data != '') {
        _this.html(datalm).parent().addClass(classes.loaded);
        if (!_this.hasClass('flickitysr4-later')) return;

        _this[0].flickitysr4 = new sr4ThemeSP.Carousel(_this[0]);
        //sr4ThemeSP.Flickitysr4.init(_this)

        return false;
      }

      if (data != null && data != '') {
        data = JSON.parse(data).content;
        instagramHTML(_this, data, false, acc, limit, dtid, target);
      } else {
        if (acc != ins_19041994) {
          ajaxUrl =
            'https://graph.instagram.com/me/media?fields=comments_count,like_count,id,media_type,media_url,permalink,thumbnail_url,caption,children&access_token=' +
            acc;
        }

        fetch(ajaxUrl)
          .then(function (response) {
            if (!response.ok) {
              throw new Error('not ok');
            }
            return response.json();
          })
          //.then(function(res) {
          .then((res) => {
            //console.log('Success:', res);
            var data = acc == ins_19041994 ? res : res.data;
            instagramHTML(_this, data, true, acc, limit, dtid, target);
            if (!isTrueCki) {
              CookiesT4.set(ig_sr4_token, 'true', { expires: 7 });
              fetch('https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=' + acc);
            }
          })
          .catch((error) => {
            _this.html('');
            console.error('Instagram Feed:error fetch');
          });
      }
      // end if
    }

    function init() {
      if ($('[data-inssr4-options]').length == 0) return;

      $('[data-inssr4-options]').each(function (index) {
        refresh_ins($(this));
      });
    }

    // function initLazy() {
    //    if ( $(".sr4-is-lazy-ins").length == 0 ) return;

    //    $('.sr4-is-lazy-ins').on('lazyincluded', function(e) {
    //     // console.log('js_sidebar load')
    //     init();
    //     $body.trigger('currency:update');
    //   });
    // }

    return init;
  })();

  sr4ThemeSP.sideBarInit = function () {
    var $sidebar_id = $('[data-sidebar-id]'),
      isDrawerSidebar = $sidebar_id.is('[data-sidebar-true]'),
      $sidebar = $('[data-sidebar-content]'),
      isDrawerSidebarMobile = $sidebar_id.is('[data-is-disableDrawer]');

    if ($sidebar_id.length == 0) return;

    var section_id = $sidebar_id.attr('data-sidebar-id'),
      searchParams = window.location.search.slice(1),
      url = `${window.location.pathname}?section_id=${section_id}&${searchParams}`;

    sr4ThemeSP.getToFetchSection(null, 'text', url).then((responseText) => {
      if (responseText == 'NVT_94') {
        // eslint-disable-next-line no-console
        $sidebar.html('');
        console.log(error);
        return;
      }

      if (isDrawerSidebar || ($window.width() < 1024 && !isDrawerSidebarMobile)) {
        var ArrHtml = responseText.split('[sr4plitlz]'),
          ArrHtml2 = ArrHtml[2].split('[sr4plitlz2]');
        sr4ThemeSP.$appendComponent.after(ArrHtml2[0] + ArrHtml[1] + ArrHtml2[1]);
      } else {
        var ArrHtml = responseText.split('[sr4plitlz]'),
          ArrHtml2 = ArrHtml[2].split('[sr4plitlz2]');
        $sidebar.html(ArrHtml[1]);
        sr4ThemeSP.$appendComponent.after(ArrHtml2[0] + ArrHtml[1] + ArrHtml2[1]);
      }
      sr4ThemeSP.instagram();
      sr4ThemeSP.Countdown();
      sr4ThemeSP.Tooltip();
      sr4ThemeSP.reinitProductGridItem();
      sr4ThemeSP.Tabs.Accordion();
      $body.trigger('currency:update');
      $document.trigger('sidebar:updated');
    });
    // fetch(url)
    // .then(response => response.text())
    // .then((responseText) => {

    //   if (isDrawerSidebar || ($window.width() < 1024 && !isDrawerSidebarMobile) ) {

    //       var ArrHtml = responseText.split('[sr4plitlz]'),
    //           ArrHtml2 = ArrHtml[2].split('[sr4plitlz2]');
    //       sr4ThemeSP.$appendComponent.after( ArrHtml2[0]+ArrHtml[1]+ArrHtml2[1] );

    //   } else {

    //       var ArrHtml = responseText.split('[sr4plitlz]'),
    //           ArrHtml2 = ArrHtml[2].split('[sr4plitlz2]');
    //       $sidebar.html( ArrHtml[1] );
    //       sr4ThemeSP.$appendComponent.after( ArrHtml2[0]+ArrHtml[1]+ArrHtml2[1] );

    //   }
    //   sr4ThemeSP.instagram();
    //   sr4ThemeSP.Countdown();
    //   sr4ThemeSP.Tooltip();
    //   $body.trigger('currency:update');
    //   $document.trigger('sidebar:updated');
    // })
    // .catch((error) => {
    //   // eslint-disable-next-line no-console
    //   $sidebar.html('');
    //   console.log(error);
    // });
  };

  // sr4ThemeSP.Drawer = (function () {
  //    var classes = {
  //       overlayVisible: 'is--visible'
  //    };
  //    var isOpen   = false,
  //    click_drawer = 'click.drawer',
  //    keyup_drawer = 'keyup.drawer',
  //    data_options = 'data-drawer-options',
  //    data_delay   = 'data-drawer-delay',
  //    opend_drawer   = ' is--opend-drawer';

  //    function Opend(event, $this, isTrigger = false) {

  //       if (isOpen) return;

  //       if (event) {
  //          event.preventDefault();
  //       }
  //       var options = JsonParse( $this.attr(data_options) ),
  //           $drawer = isTrigger ? $this : $(options.id);

  //       // console.log(options,$drawer)
  //       $drawer.trigger('opendDrawer');
  //       $drawer.attr('aria-hidden', 'false');
  //       $overlay.addClass(classes.overlayVisible);
  //       isOpen = true;

  //       $body.addClass(sr4_lock_scroll+opend_drawer);
  //       sr4ThemeSP.Helpers.disableBodyScroll(true, attr_data_scroll);
  //    }

  //    function close(event) {

  //       if (!isOpen) return;

  //       if (event) {
  //          event.preventDefault();
  //       }

  //       var $drawerOpend = $('.sr4-drawer[aria-hidden=false]');

  //       $drawerOpend.attr('aria-hidden', 'true');
  //       $overlay.removeClass(classes.overlayVisible);
  //       isOpen = false;

  //       // $body.removeClass(sr4_lock_scroll+opend_drawer);
  //       $drawerOpend.one( 'transitionend webkitTransitionEnd oTransitionEnd', function( ) {
  //          $body.removeClass(sr4_lock_scroll+opend_drawer);
  //          sr4ThemeSP.Helpers.disableBodyScroll(false, attr_data_scroll);
  //       });

  //       // Remove listener close
  //       $overlay.off(click_drawer);
  //       $body.off(click_drawer);
  //       $body.off(keyup_drawer);
  //    }

  //    function removeDataDelay(id) {
  //       $('['+data_options+'*="#'+id+'"]').removeAttr(data_delay);
  //    }

  //    function openListener() {

  //       $document.on(click_drawer, '['+data_options+']:not(['+data_delay+'])', function(e) {
  //          Opend(e, $(this));
  //          // close Listener
  //          closeListener();
  //       });

  //       sidebarTrigger();
  //    }

  //    function opendTrigger($this) {
  //         isOpen = false;
  //          Opend(null, $this, true);
  //          // close Listener
  //          closeListener();
  //    }

  //    // function closeByEsc(event) {
  //    //   if (event.keyCode !== 27) return
  //    //    close();
  //    //    $body.off(keyup_drawer, closeByEsc);

  //    // }

  //    function closeListener() {

  //       // Close by button overlay
  //       $overlay.on(click_drawer, function(e) {
  //          close(e);
  //       });

  //       // Close by button close
  //       $body.on(click_drawer, '[data-drawer-close]', function(e) {
  //          close(e);
  //       });

  //       // Close by esc
  //      $body.on('keyup.drawer', function(e) {
  //          if (e.keyCode !== 27) return
  //          close(e);
  //       });
  //    }

  //    function sidebarTrigger() {

  //       let $trigger = $('[data-sidebar-trigger]'),
  //       $sidebar     = $('.sr4-btn-sidebar');

  //       if ( $trigger.length == 0 || $sidebar.length == 0 ) return;

  //       $trigger.on(click_drawer, function(e) {
  //          e.preventDefault();
  //          $sidebar.trigger(click_drawer);
  //       });

  //    }

  //    // return {
  //    //    init: function () {
  //    //       openListener();
  //    //    }
  //    // };

  //    return {
  //       init: openListener,
  //       opend: opendTrigger,
  //       close: close,
  //       remove: removeDataDelay
  //    };

  // })();

  // sr4ThemeSP.CircleChart = (function () {

  //    // https://github.com/marcuskirschen/mk-charts
  //    // data-percent="94" data-colorbg="rgb(0,100,200)" data-color="rgb(0,100,200)" data-size="155" data-stroke="3"
  //    // https://www.jqueryscript.net/other/back-top-scroll-indicator.html

  //    function createCircleChart(percent, color, colorbg, size, stroke, useText) {

  //        let textSvg = (useText == "true") ? `<text class="sr4_circle-info" x="50%" y="50%" alignment-baseline="central" text-anchor="middle" font-size="8">${percent}%</text>` : '';
  //        let svg = `<svg class="sr4_circle-chart" viewbox="0 0 36 36" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  //            <path class="sr4_circle-bg" stroke="${colorbg}" stroke-width="${stroke * 0.5}" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
  //            <path class="sr4_circle" stroke="${color}" stroke-width="${stroke}" stroke-dasharray="${percent},100" stroke-linecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
  //            ${textSvg}
  //        </svg>`;

  //        return svg;
  //    }

  //    function initCircleChart() {

  //       let charts = document.querySelectorAll('.sr4-circlechart:not(.is--circled)'),
  //       l = charts.length;

  //       if (l == 0 ) return;

  //       for (let i=0;i<l;i++) {

  //           let chart = charts[i],
  //           _dataset  = chart.dataset,
  //           percent   = _dataset.percent,
  //           color     = ('color' in _dataset) ? _dataset.color : "#2F4F4F",
  //           colorbg   = ('colorbg' in _dataset) ? _dataset.colorbg : "#eeeeee",
  //           size      = ('size' in _dataset) ? _dataset.size : "100",
  //           stroke    = ('stroke' in _dataset) ? _dataset.stroke : "1",
  //           useText   = ('usetext' in _dataset) ? _dataset.usetext : "true";

  //           // console.log(colorbg)
  //           chart.innerHTML = createCircleChart(percent, color, colorbg, size, stroke, useText);
  //           chart.classList.add('is--circled');
  //       }
  //    }

  //    function updateCircleChart(chartSelector, scrollPercentRounded) {
  //      //console.log(chartSelector)
  //      if (!chartSelector) return;
  //      let _circle = chartSelector.querySelector('.sr4_circle');
  //      if (!_circle) return;
  //      _circle.setAttribute('stroke-dasharray', scrollPercentRounded+',100');
  //    }

  //    return {
  //       init: initCircleChart,
  //       update: updateCircleChart
  //    };

  // })();

  sr4ThemeSP.BackToTop = (function () {
    // https://dev.to/debadeepsen/page-scroll-progress-bars-fjl
    // https://codesandbox.io/s/solitary-violet-y6s28?from-embed=&file=/index.html:1587-1643
    // https://stackoverflow.com/questions/65111664/how-do-i-animate-a-css-gradient-stop-with-a-smooth-transition-to-transparent
    var $backToTop = $('#sr4-backToTop'),
      scrollTop = parseInt($backToTop.data('scrolltop')),
      debounce_timer,
      debounce_timer2,
      $backToTop,
      circlechart = $backToTop.find('.sr4-circle-css')[0];

    function BackToTop() {
      if (($window.width() < 768 && $backToTop.data('hidden-mobile')) || $backToTop.length == 0) return;

      window.addEventListener('scroll', () => {
        if (debounce_timer) {
          clearTimeout(debounce_timer);
        }

        debounce_timer = setTimeout(function () {
          if (window.scrollY > scrollTop) {
            $backToTop.addClass('is--show');
          } else {
            $backToTop.removeClass('is--show');
          }
        }, 40);

        if (!circlechart) return;

        if (debounce_timer2) {
          clearTimeout(debounce_timer2);
        }

        debounce_timer2 = setTimeout(function () {
          let scrollTop2 = window.scrollY,
            docHeight = document.body.offsetHeight,
            winHeight = window.innerHeight,
            scrollPercent = scrollTop2 / (docHeight - winHeight),
            scrollPercentRounded = Math.round(scrollPercent * 100),
            degrees = scrollPercent * 360;
          //percentLabel.innerHTML = scrollPercentRounded;
          // console.log(scrollPercentRounded);
          //sr4ThemeSP.CircleChart.update(circlechart, scrollPercentRounded);
          circlechart.style.setProperty('--cricle-degrees', degrees + 'deg');
          //circlechart.style.setProperty("--cricle-percent", scrollPercentRounded + '%');
        }, 6);
      });

      // window.addEventListener("scroll", () => {
      //    if(debounce_timer2) {clearTimeout(debounce_timer2);}
      //    debounce_timer2 = setTimeout(function() {
      //    let scrollTop2 = window.scrollY;
      //    let docHeight  = document.body.offsetHeight;
      //    let winHeight  = window.innerHeight;
      //    let scrollPercent = scrollTop2 / (docHeight - winHeight);
      //    let scrollPercentRounded = Math.round(scrollPercent * 100);
      //    //percentLabel.innerHTML = scrollPercentRounded;
      //    console.log(scrollPercentRounded);
      //    sr4ThemeSP.CircleChart.update($backToTop.find('.sr4-circlechart.is--circled')[0], scrollPercentRounded);
      // }, 10);
      // });

      //Click event to scroll to top
      $backToTop.on('click', function (e) {
        e.preventDefault();
        $('html, body').animate(
          {
            scrollTop: 0,
          },
          800
        );
      });

      //if (!IsDesignMode) RunjsBackToTop = true;
    }

    return BackToTop;
  })();

  /**
   * https://developers.google.com/web/updates/2017/09/sticky-headers
   */
  sr4ThemeSP.Header = (function () {
    var headerStr = '.sr4-section-header',
      header = document.querySelector(headerStr),
      headerBounds = {},
      currentScrollTop = 0,
      preventReveal = false,
      isScrolling = 0,
      dt_header = 'data-header-options',
      options =
        $(header)
          .find('[' + dt_header + ']')
          .attr(dt_header) || '{}',
      options = JSON.parse(options),
      isSticky = options.isSticky,
      hideScroldown = options.hideScroldown,
      html = document.documentElement,
      str_action = 'is-action__hover',
      $mainMenu = $('[data-menu-nav]'),
      $hasChildren = $mainMenu.find('>li.has--children'),
      $hasChildrenLinks,
      $subMenu = $hasChildren.find('>.sr4-sub-menu'),
      $header = $(header),
      $siteWrapper = $('.sr4-website-wrapper'),
      str__offsets = 'menu-has__offsets',
      str__calcSub = 'calc-pos-submenu',
      isVertical = $header.hasClass('header-vertical'),
      str__Main = '.sr4-is-header-categories-menu', // '#shopify-section-header-categories-menu',
      str__Cat = '.sr4-is-header-categories', // '#shopify-section-header-categories',
      $categoriesMain = $(str__Main),
      $categories = $(str__Cat),
      extraSpace = 10,
      childOpend = 'is--child-open',
      noTransiton = 'no-transiton-nav-a',
      isStuck = 'is-header--stuck',
      timeDropdown = 200,
      timeNoTransiton,
      updateHeaderBounds = true,
      strClickIcon = sr4configs.onlyClickDropIcon
        ? '.sr4-menu-item.has--children>a>.sr4--menu-toggle'
        : '.sr4-menu-item.has--children>a';

    function connectedCallback() {
      if (!isSticky || (isSticky && hideScroldown) || isVertical) return;
      // console.log('connectedCallback')

      // if (IsDesignMode) {

      // }
      let observer = new IntersectionObserver(
        function (entries) {
          // no intersection with screen
          if (entries[0].intersectionRatio === 0) {
            html.classList.add(isStuck);
            if (updateHeaderBounds) {
              html.classList.add('sr4-hsticky__ready');
              updateHeaderBounds = false;
            }
          } else if (entries[0].intersectionRatio === 1) {
            // fully intersects with screen
            html.classList.remove(isStuck);
            html.classList.add(noTransiton);
            clearTimeout(timeNoTransiton);
            timeNoTransiton = setTimeout(() => {
              html.classList.remove(noTransiton);
            }, 366);
          }
        },
        { threshold: [0, 1] }
      );

      observer.observe(document.querySelector('#sr4-hsticky__sentinel'));
      setTimeout(() => {
        html.classList.add('sr4-hsticky__ready');
        updateHeaderBounds = false;
      }, 396);
    }

    function connectedCallbackScroldown() {
      if (IsDesignMode) {
        disconnectedCallback();
        header = document.querySelector('.sr4-section-header');
        headerBounds = {};
        currentScrollTop = 0;
        preventReveal = false;
        options =
          $(header)
            .find('[' + dt_header + ']')
            .attr(dt_header) || '{}';
        options = JSON.parse(options);
        isSticky = options.isSticky;
        hideScroldown = options.hideScroldown;
      }

      if (!isSticky || !hideScroldown || isVertical) {
        header.classList.remove('shopify-section-header-hidden', 'animate');
        return;
      }

      //console.log('connectedCallbackScroldown')
      // onScroll()
      // preventReveal = true;

      header.addEventListener('preventHeaderReveal', hideHeaderOnScrollUp);
      window.addEventListener('scroll', onScroll, false);

      createObserver();
    }

    function hideHeaderOnScrollUp() {
      preventReveal = true;
    }

    function disconnectedCallback() {
      // console.log('disconnectedCallback')
      header.removeEventListener('preventHeaderReveal', hideHeaderOnScrollUp);
      window.removeEventListener('scroll', onScroll);
    }

    function createObserver() {
      let observer = new IntersectionObserver((entries, observer) => {
        headerBounds = entries[0].intersectionRect;
        //console.log(headerBounds)
        observer.disconnect();
      });

      observer.observe(header);
    }

    function onScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // console.log(preventReveal)
      if (scrollTop > currentScrollTop && scrollTop > headerBounds.bottom) {
        requestAnimationFrame(hide);
      } else if (scrollTop < currentScrollTop && scrollTop > headerBounds.bottom) {
        if (!preventReveal) {
          requestAnimationFrame(reveal);
        } else {
          window.clearTimeout(isScrolling);
          isScrolling = setTimeout(() => {
            preventReveal = false;
          }, 366);
          // }, 66);
          requestAnimationFrame(hide);
        }
      } else if (scrollTop <= headerBounds.top) {
        requestAnimationFrame(reset);
      }

      currentScrollTop = scrollTop;
    }

    function hide() {
      header.dispatchEvent(new Event('sr4HeaderHide'));
      $header.one('transitionend webkitTransitionEnd oTransitionEnd', function () {
        if ($header.hasClass('shopify-section-header-hidden')) html.classList.remove(isStuck);
      });
      header.classList.add('shopify-section-header-hidden', 'shopify-section-header-sticky');
      closeMenuDisclosure();
      closeSearchModal();
    }

    function reveal() {
      header.dispatchEvent(new Event('sr4HeaderReveal'));
      html.classList.add(isStuck);
      header.classList.add('shopify-section-header-sticky', 'animate');
      header.classList.remove('shopify-section-header-hidden');
    }

    function reset() {
      html.classList.remove(isStuck);
      // Update headerBounds if when reload position not on header
      if (updateHeaderBounds && headerBounds.top == 0 && headerBounds.height == 0) {
        headerBounds = header.getBoundingClientRect();
        updateHeaderBounds = false;
      }
      header.classList.remove('shopify-section-header-hidden', 'shopify-section-header-sticky', 'animate');
      html.classList.add(noTransiton);
      clearTimeout(timeNoTransiton);
      timeNoTransiton = setTimeout(() => {
        html.classList.remove(noTransiton);
      }, 366);
    }

    function closeMenuDisclosure() {
      // this.disclosures = this.disclosures || this.header.querySelectorAll('details-disclosure');
      // this.disclosures.forEach(disclosure => disclosure.close());
    }

    function closeSearchModal() {
      // this.searchModal = this.searchModal || this.header.querySelector('details-modal');
      // this.searchModal.close(false);
    }

    function StickyInit() {
      connectedCallback();
      //disconnectedCallback();
      connectedCallbackScroldown();

      $html.css({
        '--topbar-height': ($('#sr4-top-bar-main').height() || 0) + 'px',
        '--header-height': ($('.sr4-section-header').height() || 0) + 'px',
      });

      $window.on('resize', function () {
        $html.css({
          '--topbar-height': ($('#sr4-top-bar-main').height() || 0) + 'px',
          '--header-height': ($('.sr4-section-header').height() || 0) + 'px',
        });
        // document.documentElement.style.setProperty('--topbar-height', document.getElementById('sr4-top-bar-main').offsetHeight + 'px');
        // document.documentElement.style.setProperty('--header-height', document.querySelector('.sr4-section-header').offsetHeight + 'px');
      });
    }

    // windowWidth $window.width()
    function LazyloadMega() {
      var $lazyMegaMenu = $('.sr4-type__mega .sr4-lazy_menu'),
        $listActive = $('.sr4-list-categories--item.is--active'),
        key_index = $listActive.index(),
        key_id = key_index > 0 ? key_index : '',
        key_time = cacheNameFirst + 'timeMegasr4' + key_id,
        key_data = cacheNameFirst + 'dataMegasr4' + key_id,
        timeCache = isStorageSpSession ? sessionStorage.getItem(key_time) || 0 : 0,
        timeCache = parseInt(timeCache),
        timeConfig = 30 * 60000, // convert 30 minute to milliseconds;
        str_mega_menu = 'sr4-section-mega__menu',
        data_id = '[data-section-id]';

      if ($lazyMegaMenu.length == 0 || windowWidth < 1024) return;

      if (!IsDesignMode && timeCache > 0 && timeCache >= Date.now()) {
        renderContentsMega($lazyMegaMenu, sessionStorage.getItem(key_data));
      } else {
        var $megaMenu = $('.' + str_mega_menu),
          list_id =
            key_index > 0 && $megaMenu.length > 0 ? $megaMenu.find(data_id).data('section-id') : 'mega-menu,mega-menu2',
          listActiveHref = $listActive.find('>a').attr('href');

        if (key_index > 0 && $megaMenu.length == 0 && location.pathname != listActiveHref) {
          sr4ThemeSP.getToFetchSection(null, 'text', listActiveHref).then((response) => {
            if (response == 'NVT_94') {
              return;
            }
            const section_id = $(response).find(`.${str_mega_menu} ${data_id}`).data('section-id');

            if (!section_id) return;

            fetchLazyloadMega(section_id);
          });
        } else {
          fetchLazyloadMega(list_id);
          // sr4ThemeSP.getToFetchSection('?sections='+list_id,'json').then((response) => {
          //    if ( response == 'NVT_94' || response.status) {
          //       if (response.status) console.error(response.description);
          //       return;
          //    }
          //  var html = '';
          //  for (const i in response) {
          //       html +=  response[i].split('[nt_mega_split1]')[1];

          //  }
          //  renderContentsMega($lazyMegaMenu, '<div>'+html+'</div>');
          //  if (isStorageSpSession) {
          // timeCache = Date.now() + timeConfig;
          //     sessionStorage.setItem(key_time,timeCache);
          //     sessionStorage.setItem(key_data,'<div>'+html+'</div>');
          //  }
          // });
        }

        function fetchLazyloadMega(id) {
          sr4ThemeSP.getToFetchSection('?sections=' + list_id, 'json').then((response) => {
            if (response == 'NVT_94' || response.status) {
              if (response.status) console.error(response.description);
              return;
            }
            var html = '';
            for (const i in response) {
              html += response[i].split('[nt_mega_split1]')[1];
            }
            renderContentsMega($lazyMegaMenu, '<div>' + html + '</div>');
            if (isStorageSpSession) {
              timeCache = Date.now() + timeConfig;
              sessionStorage.setItem(key_time, timeCache);
              sessionStorage.setItem(key_data, '<div>' + html + '</div>');
            }
          });
        }
        // fetch(sr4ThemeSP.root_url+'?sections=mega-menu,mega-menu2', {
        //  method: 'GET',
        //  headers: {
        //    'Cache-Control': 'no-cache'
        //  }
        // })
        // .then((response) => response.json())
        // .then((response) => {
        //  if (response.status) {
        //    console.error(response.description);
        //    return;
        //  }
        //  var html = '';
        //  for (const i in response) {
        //      html +=  response[i].split('[nt_mega_split1]')[1];

        //  }
        //  renderContentsMega($lazyMegaMenu, '<div>'+html+'</div>');
        //  if (isStorageSpSession) sessionStorage.setItem('sr4-mega-contents','<div>'+html+'</div>');

        // })
        // .catch((e) => {
        //    console.error(e);
        // });
        // .finally(() => {
        //     $this.removeClass(classes.loading).removeAttr('aria-disabled');
        // });
      }
    }

    function renderContentsMega($lazyMegaMenu, html) {
      //console.log(html)
      var $html = $(html);
      //console.log($html);
      $lazyMegaMenu.each(function (index) {
        var $this = $(this),
          $flickitysr4,
          id = '#sr4-mega-contents' + $this.data('id'),
          dataHtml = $html.find(id).html();

        //console.log(id, $html.find(id) )
        // console.log(dataHtml)
        if (!dataHtml) {
          $this.html('');
          return;
        }
        $this.html(dataHtml);

        if ($this.find('.sr4-products .sr4-product').length > 0) {
          sr4ThemeSP.reinitProductGridItem();
        }

        // console.log('xx',$this.closest('.has--children'))
        setTimeout(function () {
          if ($this.hasClass('isotopesr4')) sr4ThemeSP.Isotopesr4.init($this);
          calcPositionSubmenu($this.closest('.has--children'));
          sr4ThemeSP.PopupMFP();

          $flickitysr4 = $this.find('.flickitysr4-later');
          if ($flickitysr4.length == 0) return;

          $flickitysr4.each(function (index) {
            this.flickitysr4 = new sr4ThemeSP.Carousel(this);
            //sr4ThemeSP.Flickitysr4.init( $(this) );
          });
        }, 600);
      });
      setTimeout(function () {
        $header.find('.isotopesr4-enabled').isotopesr4('layout');
      }, 800);
    }

    function clickDropdownOpen(that) {
      //console.log( that.find(strClickIcon) )
      that
        .find(strClickIcon)
        .off('click')
        .on('click', function (e) {
          e.preventDefault();

          var $this = $(this);
          if ($this.hasClass('sr4--menu-toggle')) $this = $this.closest('a');

          if ($this.hasClass(childOpend)) {
            $this.removeClass(childOpend).siblings('ul').slideUp(timeDropdown);
          } else {
            //$this.parent().siblings('.has--children').find('.'+childOpend).removeClass(childOpend).siblings('ul').slideUp(timeDropdown);
            $this.addClass(childOpend).siblings('ul').slideDown(timeDropdown);
          }
        });
    }

    function LazyloadDropdown() {
      // new+sale
      var $lazyDropMenu = $('.sr4-type__drop .sr4-lazy_menu'),
        $listActive = $('.sr4-list-categories--item.is--active'),
        key_index = $listActive.index(),
        key_id = key_index > 0 ? key_index : '',
        key_time = cacheNameFirst + 'timeDropsr4' + key_id,
        key_data = cacheNameFirst + 'dataDropsr4' + key_id,
        timeCache = isStorageSpSession ? sessionStorage.getItem(key_time) || 0 : 0,
        timeCache = parseInt(timeCache),
        timeConfig = 30 * 60000; // convert 30 minute to milliseconds;

      if (IsDesignMode) {
        $lazyDropMenu.each(function (index) {
          calcPositionSubmenu($(this).closest('.has--children'));
          clickDropdownOpen($(this));
        });
      }

      if ($lazyDropMenu.length == 0 || windowWidth < 1024 || IsDesignMode) return;

      if (timeCache > 0 && timeCache >= Date.now()) {
        var ArrHtml = sessionStorage.getItem(key_data).split('[nt_drop_split2]');
        $lazyDropMenu.each(function (index) {
          $(this).html(ArrHtml[index]);
          calcPositionSubmenu($(this).closest('.has--children'));
          clickDropdownOpen($(this));
        });
      } else {
        var HandleList = [];
        $lazyDropMenu.each(function (index) {
          HandleList.push($(this).data('handle'));
        });
        HandleList = '/' + HandleList.join('+');
        // console.log('HandleList', HandleList)

        sr4ThemeSP
          .getToFetchSection(null, 'text', `${window.sr4routes.all_url}${HandleList}/?section_id=dropdown-menu`)
          .then((response) => {
            if (response == 'NVT_94') return;

            var html = response.split('[nt_drop_split1]')[1],
              ArrHtml = html.split('[nt_drop_split2]');

            $lazyDropMenu.each(function (index) {
              $(this).html(ArrHtml[index]);
              calcPositionSubmenu($(this).closest('.has--children'));
              clickDropdownOpen($(this));
            });
            if (isStorageSpSession) {
              timeCache = Date.now() + timeConfig;
              sessionStorage.setItem(key_time, timeCache);
              sessionStorage.setItem(key_data, '<div>' + html + '</div>');
            }
          });
        // fetch(`${window.sr4routes.all_url}${HandleList}/?section_id=dropdown-menu`, {
        //  method: 'GET',
        //  headers: {
        //    'Cache-Control': 'no-cache'
        //  }
        // })
        // .then((response) => response.text())
        // .then((response) => {

        //    var html = response.split('[nt_drop_split1]')[1],
        //    ArrHtml = html.split('[nt_drop_split2]');

        //    $lazyDropMenu.each(function( index ) {
        //       $(this).html( ArrHtml[index] );
        //       calcPositionSubmenu( $(this).closest('.has--children') );
        //    });

        //  if (isStorageSpSession) {
        // timeCache = Date.now() + timeConfig;
        //     sessionStorage.setItem(key_time,timeCache);
        //     sessionStorage.setItem(key_data,html);
        //  }
        // })
        // .catch((e) => {
        //    console.error(e);
        // });
      }
    }

    function menuHoverIntent(_hasChildren) {
      if (_hasChildren) $hasChildren = _hasChildren;
      //if ( sr4ThemeSP.isTouch || windowWidth < 1024 || $hasChildren.length == 0 ) return;
      if (windowWidth < 1024 || $hasChildren.length == 0) return;

      var HoverInterval = 35, // 20
        HoverTimeout = 150; // 70

      $hasChildren.each(function (e, i) {
        var $this = $(this);
        $this.hoverIntent({
          sensitivity: 3,
          interval: HoverInterval,
          timeout: HoverTimeout,
          over: function (t) {
            $this.addClass(str_action);
          },
          out: function () {
            $this.removeClass(str_action);
          },
        });
      });
    }

    function menuClickIntent(_hasChildren) {
      if (_hasChildren) {
        $hasChildrenLinks = _hasChildren.find('>a');
      } else {
        $hasChildrenLinks = $hasChildren.find('>a');
      }

      if (sr4ThemeSP.isHover || windowWidth < 1024 || $hasChildrenLinks.length == 0) {
        $hasChildrenLinks.off('click.menu click.menuIntent');
        return;
      }

      $hasChildrenLinks.on('click.menu', function (e) {
        e.preventDefault();
        let $parent = $(this).parent();

        if ($parent.hasClass(str_action)) {
          $parent.removeClass(str_action);
          $document.off('click.menuIntent');
        } else {
          $parent.addClass(str_action).siblings().removeClass(str_action);
          $document.on('click.menuIntent', function (e) {
            var target = e.target;

            // console.log($(target).is('.'+str_action) , $(target).parents('li').is('.'+str_action))
            if (
              !$(target).is('.' + str_action) &&
              !$(target)
                .parents('li')
                .is('.' + str_action)
            ) {
              //console.log('click.menu')
              $mainMenu.find('.' + str_action).removeClass(str_action);
              $document.off('click.menuIntent');
              //return false;
            }
          });
        }
      });
    }

    // calc-pos-submenu
    function calcPositionSubmenuInt(__hasChildren, oneRun) {
      if (__hasChildren) $hasChildren = __hasChildren;
      if (windowWidth < 1024 || $hasChildren.length == 0) return;

      if (IsDesignMode) $header = $(headerStr);

      $hasChildren.each(function (e, i) {
        calcPositionSubmenu($(this), oneRun);
        //clickDropdownOpen( $(this) );
      });
      $header.addClass(str__calcSub);
    }

    function calcWidthHeight() {
      if ($window.width() < 1024) return;

      if (IsDesignMode) $header = $(headerStr);

      // Update maxw max-h header

      $header.removeAttr('style').css({
        '--sr4-max-width': `${$window.width() - 10}px`,
        '--sr4-max-height': `${
          $window.height() - Math.max(0, header.getBoundingClientRect().top) - Math.max(0, header.offsetHeight) - 20
        }px`,
        //'--sr4-max-height': `${$window.height() - $header.offset().top - $header.height() - 20}px`
      });
      $header.find('.isotopesr4-enabled').isotopesr4('layout');
      setTimeout(function () {
        $header.find('.isotopesr4-enabled').isotopesr4('layout');
      }, 500);

      // Update maxw max-h categories Menu
      var $navCategories = $('#sr4-nav-categories');
      //console.log('calcWidthHeight',$navCategories)
      if ($navCategories.length == 0) return;

      $navCategories.removeAttr('style').css({
        // '--sr4-max-width' : `${$window.width() - $navCategories.offset().left - $navCategories.width()}px`,
        // '--sr4-max-height': `${$window.height() - $navCategories.offset().top  - 10}px`
        '--sr4-max-width': `${
          $window.width() - Math.max(0, $navCategories[0].getBoundingClientRect().left) - $navCategories.width()
        }px`,
        '--sr4-max-height': `${$window.height() - Math.max(0, $navCategories[0].getBoundingClientRect().top) - 10}px`,
      });
      //console.log($navCategories.find('.isotopesr4-enabled'))
      $navCategories.find('.isotopesr4-enabled').isotopesr4('layout');
      setTimeout(function () {
        $navCategories.find('.isotopesr4-enabled').isotopesr4('layout');
      }, 500);

      //$window.width() - $navCategories.offset().left - $navCategories.width()
    }

    function calcPositionSubmenu($this, oneRun = false) {
      // console.log( $this )

      var a = $this.find('>a')[0],
        sub = $this.find('>.sr4-sub-menu')[0],
        placement = $this.data('placement') || 'bottom';

      if (($this.hasClass('menu-width__full') && placement != 'right-start') || !sub) return;
      // console.log($(sub))

      // remove style CSS
      $(sub).attr('style', '');
      //https://floating-ui.com/docs/autoUpdate
      //console.log('calcPositionSubmenu',oneRun)
      //async function update() {

      if (placement == 'bottom' && !$this.hasClass('sr4-type__drop')) {
        if (calcCenterSubmenu(sub, a)) return;
      }
      FloatingUIsr4DOM.computePosition(a, sub, {
        placement: placement,
        middleware: [
          // FloatingUIsr4DOM.offset(6),
          FloatingUIsr4DOM.flip({
            //fallbackPlacements: ['left', 'right', 'top', 'bottom'],
            // fallbackPlacements: ['bottom-start','bottom-end'],
          }),
          FloatingUIsr4DOM.shift({ padding: 5 }),
          // FloatingUIsr4DOM.arrow({element: arrowElement}),
        ],
      }).then(({ x, y, placement, middlewareData }) => {
        // console.log(placement)
        Object.assign(sub.style, {
          // left: (placement.indexOf('right') !== -1) ? '100%' : `${x}px`,
          // top:  (placement.indexOf('right') !== -1) ? `${y}px` : '100%',
          left: `${x}px`,
          top: placement.indexOf('bottom') > -1 ? '100%' : `${y}px`,
        });
      });

      if (!oneRun) {
        // console.log($(sub))
        // let $grid = $(sub).find('.sr4-lazy_menu.isotopesr4');
        let $grid = $(sub).find('.sr4-lazy_menu.isotopesr4.isotopesr4-enabled');
        //console.log($grid,'ass')
        if ($grid.length > 0) $grid.isotopesr4('layout');
      }
      // }
      // update();

      // if (!window.ResizeObserver || oneRun) {
      //    update();
      //    return;
      // }

      // const cleanup = FloatingUIsr4DOM.autoUpdate(a, sub, update, {
      //    // elementResize: true,
      //    // ancestorResize: true
      // });
    }

    function calcCenterSubmenu(sub) {
      // console.log( sub )
      var $sub = $(sub);
      $sub.attr('style', '');

      var nav_dropdownWidth = $sub.outerWidth(),
        nav_dropdownOffset = $sub.offset();

      if (!nav_dropdownWidth || !nav_dropdownOffset) return false;
      var nav_dropdownLeft = nav_dropdownOffset.left,
        nav_dropdownLeftCenter = (windowWidth - nav_dropdownWidth) / 2;

      //console.log(nav_dropdownLeftCenter, nav_dropdownLeft, nav_dropdownLeftCenter + nav_dropdownWidth)
      // console.log( nav_dropdownLeftCenter, nav_dropdownLeft, (nav_dropdownLeft + nav_dropdownWidth) )
      // console.log( nav_dropdownLeft, nav_dropdownLeftCenter )
      if (
        !isThemeRTL &&
        nav_dropdownLeftCenter <= nav_dropdownLeft &&
        nav_dropdownLeft <= nav_dropdownLeftCenter + nav_dropdownWidth &&
        windowWidth >= nav_dropdownLeftCenter + nav_dropdownWidth
      ) {
        $sub.addClass('is--center-screen');
        return true;
      } else if (
        isThemeRTL &&
        nav_dropdownLeftCenter <= nav_dropdownLeft + nav_dropdownWidth &&
        nav_dropdownLeft <= nav_dropdownLeftCenter &&
        windowWidth >= nav_dropdownLeftCenter + nav_dropdownWidth
      ) {
        $sub.addClass('is--center-screen');
        return true;
      } else {
        $sub.removeClass('is--center-screen');
        return false;
      }

      // if( nav_dropdownWidth < 0) return;
      // //console.log('center');
      // var toLeft = ( nav_dropdownOffset.left + (nav_dropdownWidth/2) ) - windowWidth/2;
      // console.log(dropdownOffsetRight, nav_dropdownOffset.left ,nav_dropdownWidth/2, windowWidth/2)
      // if (isThemeRTL) {
      //       $sub.css({
      //           right: toLeft
      //       });
      // } else {
      //       $sub.css({
      //           left: - toLeft
      //       });
      // }
      //return isThemeRTL ? toLeft : - toLeft;
    }

    function fetchUpdateCategories() {
      // $categoriesMain  = $('#shopify-section-header-categories-menu');
      // $categories      = $('#shopify-section-header-categories');
      if ($categoriesMain.find('[data-wrapper-categories]').length == 0) return;

      if (!IsDesignMode && $categories.length == 0) {
        var key_time = cacheNameFirst + 'timeCatsr4',
          key_data = cacheNameFirst + 'dataCatsr4',
          timeCache = isStorageSpSession ? sessionStorage.getItem(key_time) || 0 : 0,
          timeCache = parseInt(timeCache),
          timeConfig = 30 * 60000; // convert 30 minute to milliseconds;

        if (timeCache > 0 && timeCache >= Date.now()) {
          updateCategoriesHTML(sessionStorage.getItem(key_data));
        } else {
          sr4ThemeSP.getToFetchSection(null, 'text', search_url + '/?section_id=header-categories').then((section) => {
            if (section == 'NVT_94') return;
            //$(section).html()
            var DomHTMl = new DOMParser().parseFromString(section, 'text/html').querySelector('div').innerHTML;
            updateCategoriesHTML(DomHTMl);
            if (isStorageSpSession) {
              timeCache = Date.now() + timeConfig;
              sessionStorage.setItem(key_time, timeCache);
              sessionStorage.setItem(key_data, DomHTMl);
            }
          });
          // fetch( search_url+'/?section_id=header-categories' )
          // .then(function(response) {
          //   return response.text();
          // })
          // .then(function(section) {
          //    //$(section).html()
          //    var DomHTMl = new DOMParser().parseFromString(section, 'text/html').querySelector('div').innerHTML;
          //    updateCategoriesHTML(DomHTMl)
          //  if (isStorageSpSession) {
          // timeCache = Date.now() + timeConfig;
          //     sessionStorage.setItem(key_time,timeCache);
          //     sessionStorage.setItem(key_data,DomHTMl);
          //  }

          // })
          // .catch(function(error) {
          //   // eslint-disable-next-line no-console
          //   console.log(error);
          // });
        }
      } else if (IsDesignMode) {
        $categoriesMain = $(str__Main);
        $categories = $(str__Cat);
        updateCategoriesHTML($categories.html());
      }
    }

    function updateCategoriesHTML(DomHTMl, $headerWrapperCategories) {
      var $categoriesCat =
        typeof $headerWrapperCategories == 'undefined'
          ? $categoriesMain.find('[data-wrapper-categories]')
          : $headerWrapperCategories;

      $categoriesCat.html(DomHTMl);
      calcWidthHeight();
      //console.log(DomHTMl)
      var _hasChildren2 = $categoriesCat.find('#sr4-nav-categories>.has--children');
      // console.log(_hasChildren2)

      menuHoverIntent(_hasChildren2);
      menuClickIntent(_hasChildren2);

      document.addEventListener('theme:hover', function (evt) {
        menuClickIntent(_hasChildren2);
      });

      calcPositionSubmenuInt(_hasChildren2);
      setTimeout(() => {
        calcPositionSubmenuInt(_hasChildren2);
      }, 1000);

      $categoriesCat.find('.sr4-type__drop .sr4-lazy_menu').each(function (index) {
        clickDropdownOpen($(this));
      });

      if ($categoriesCat.find('.sr4-products .sr4-product').length > 0) {
        sr4ThemeSP.reinitProductGridItem();
      }

      var $isotopesr4 = $categoriesCat.find('.isotopesr4-later'),
        $flickitysr4 = $categoriesCat.find('.flickitysr4-later');

      if ($isotopesr4.length > 0) {
        $isotopesr4.each(function (index) {
          sr4ThemeSP.Isotopesr4.init($(this));
        });
      }

      if ($isotopesr4.length > 0) {
        $flickitysr4.each(function (index) {
          this.flickitysr4 = new sr4ThemeSP.Carousel(this);
        });
      }
      // setTimeout(function() {
      //      $window.on('resize.cat',
      //         sr4ThemeSP.debounce(
      //          300,
      //          function() {
      //             calcPositionSubmenuInt(_hasChildren2);
      //          }
      //        )
      //      );
      // }, 2000);
    }

    function init(_hasChildren) {
      LazyloadMega();
      LazyloadDropdown();
      menuHoverIntent(_hasChildren);
      menuClickIntent(_hasChildren);
      document.addEventListener('theme:hover', function (evt) {
        menuClickIntent(_hasChildren);
      });

      calcWidthHeight();
      calcPositionSubmenuInt(_hasChildren, true);

      // $body.trigger({
      //   type:'event:cat-menu',
      //   $selector:"foo"
      // });
      // $body.on('event:cat-menu', function(event) {
      //    console.log(event);
      // });
      // setTimeout(function() {
      //     $window.on('resize.menu',
      //       sr4ThemeSP.debounce(
      //          300,
      //          function() {
      //             $header.removeClass(str__calcSub);
      //             $subMenu.attr('style', '');
      //             calcPositionSubmenuInt(_hasChildren);
      //          }
      //       )
      //    );
      // }, 2000);

      fetchUpdateCategories();

      setTimeout(function () {
        $window.on('resize.menu', calcWidthHeight);
      }, 2000);
    }

    return {
      stickyInit: StickyInit,
      init: init,
      updateCat: updateCategoriesHTML,
    };
  })();

  sr4ThemeSP.MobileNav = (function () {
    var classes = {
        tabNavActive: 'is--active',
        opend: 'is--opend',
      },
      eventResize = 'resize.navmb',
      opendDrawer = 'opendDrawer',
      $listActive = $('.sr4-list-categories--item.is--active'),
      key_index = $listActive.index(),
      key_id = key_index > 0 ? key_index : '',
      key_time = cacheNameFirst + 'timeMenusr4' + key_id,
      key_data = cacheNameFirst + 'dataMenusr4' + key_id,
      loadedMenu = false,
      timeConfig = 30 * 60000, // convert 30 minute to milliseconds
      $nav_mb = $('.sr4-sp-section-mb-nav [data-section-id]'),
      $cat_mb = $('.sr4-sp-section-mb-cat [data-section-id]'),
      isPageNav = $nav_mb.length, // test
      isPageCat = $cat_mb.length, // test
      //isPageIndex = (sr4configs.isPageIndex && (isPageNav == 1 || isPageCat == 1)),
      id_nav,
      id_cat;

    if (key_index > 0) {
      id_nav = $nav_mb.data('section-id');
      id_cat = $cat_mb.data('section-id');
      // key_time = key_time+(id_nav||id_cat);
      // key_data = key_data+(id_nav||id_cat);
    }

    var timeCache = isStorageSpSession ? sessionStorage.getItem(key_time) || 0 : 0,
      timeCache = parseInt(timeCache);

    var cache = {};

    function cacheSelectors() {
      cache = {
        $mobileNav: $('#sr4-menu-drawer'),
      };
    }

    function tabClick() {
      cache.$mobileNav.on('click', '[data-tab-mb-nav]>[data-tab-mb-item]', function () {
        var $this = $(this);

        if ($this.hasClass(classes.tabNavActive)) return;

        $this.addClass(classes.tabNavActive).siblings().removeClass(classes.tabNavActive);

        $('[data-tab-mb-content].' + classes.tabNavActive).removeClass(classes.tabNavActive);
        $($this.data('id')).addClass(classes.tabNavActive);
      });
    }

    function subClick() {
      cache.$mobileNav.on('click', '.sr4-menu-item-has-children.sr4-only_icon_false>a', function (e) {
        e.preventDefault();
        e.stopPropagation();

        clickToActive($(this).parent());
      });

      cache.$mobileNav.on('click', '.sr4-menu-item-has-children > a > .sr4-mb-nav__icon', function (e) {
        e.preventDefault();
        e.stopPropagation();

        clickToActive($(this).parent().parent());
      });
    }

    function clickToActive($parent) {
      if ($parent.hasClass(classes.opend)) {
        $parent.removeClass(classes.opend).children('ul').slideUp(200);
      } else {
        $parent.addClass(classes.opend).children('ul').slideDown(200);
      }
    }

    function cacheMenu() {
      if (isStorageSpSession && timeCache > 0 && timeCache >= Date.now()) {
        sr4ThemeSP.Helpers.promiseStylesheet(sr4configs.stylesheet2).then(function () {
          cache.$mobileNav.html(sessionStorage.getItem(key_data));
          cache.$mobileNav.trigger('lazyincluded');
        });
      } else {
        $window.on(
          eventResize,
          sr4ThemeSP.debounce(300, function () {
            windowWidth = $window.width();
            appendMenu(0);
          })
        );
        appendMenu(500);
        if (!IsDesignMode) {
          cache.$mobileNav.on(opendDrawer, function () {
            appendMenu(0);
          });
        }
      }
    }

    function appendMenu(timeout = 4) {
      if (IsDesignMode || loadedMenu || (cache.$mobileNav.hasClass('sr4-d-lg-none') && windowWidth > 1024)) return;

      setTimeout(function () {
        if (key_index > 0) {
          id_nav = isPageNav == 1 ? id_nav : 'mb_nav';
          id_cat = isPageCat == 1 ? id_cat : 'mb_cat';
          var datamenu = '',
            loadedNav = false,
            loadedCat = false;

          sr4ThemeSP.getToFetchSection('?section_id=' + id_nav, 'text').then((response) => {
            if (response == 'NVT_94') return;
            cache.$mobileNav.find('#shopify-mb_nav').html(response);
            //datamenu += response;
            if (!loadedCat) {
              loadedNav = true;
              return;
            }
            replaceContentMenu('indexPage');
          });

          sr4ThemeSP.getToFetchSection('?section_id=' + id_cat, 'text').then((response) => {
            if (response == 'NVT_94') return;
            //datamenu += response;
            cache.$mobileNav.find('#shopify-mb_cat').html(response);
            if (!loadedNav) {
              loadedCat = true;
              return;
            }
            replaceContentMenu('indexPage');
          });
        } else {
          sr4ThemeSP.getToFetchSection(null, 'text', sr4routes.search_url + '/?view=mn').then((htmlmenu) => {
            if (htmlmenu == 'NVT_94') return;
            replaceContentMenu(htmlmenu);
          });
        }
      }, timeout);
    }

    function replaceContentMenu(htmlmenu) {
      sr4ThemeSP.Helpers.promiseStylesheet(sr4configs.stylesheet2).then(
        function () {
          loadedMenu = true;
          if (key_index <= 0 && htmlmenu != 'indexPage') {
            cache.$mobileNav.html(htmlmenu);
          }
          if (key_index > 0 && htmlmenu == 'indexPage') htmlmenu = cache.$mobileNav.html();
          $window.off(eventResize);
          cache.$mobileNav.off(opendDrawer);
          cache.$mobileNav.trigger('lazyincluded');

          if (isStorageSpSession) {
            timeCache = Date.now() + timeConfig;
            sessionStorage.setItem(key_time, timeCache);
            sessionStorage.setItem(key_data, htmlmenu);
          }
        } //}.bind(this)
      );
    }

    function init() {
      cacheSelectors();
      cacheMenu();
      tabClick();
      subClick();
    }

    return init;
  })();

  sr4ThemeSP.loadingBar = (function () {
    // data-loading-bar
    function init() {
      console.log('loadingBar');
    }

    return init;
  })();

  sr4ThemeSP.currencyForm = (function () {
    var classes = {
      select: 'is--selected',
      opend: 'is--opend',
    };

    var cache = {},
      cartCurrency = sr4configs.cartCurrency;

    function cacheSelectors() {
      cache = {
        $formCurrencyLocale: $('#CurrencyLangSelector'),
        $localeSelector: $('#LocaleSelector'),
        $currencySelector: $('#CurrencySelector'),
      };
    }

    function submitFormCurrencyLang(disclosureInput, value) {
      cache[disclosureInput].val(value);
      cache.$formCurrencyLocale.submit();
    }

    function initActiveCurrencyCustomerPick(newCurrency) {
      if (cartCurrency == newCurrency) return;
      if (isStorageSpdLocalAll) {
        localStorage.setItem('T4Currency', newCurrency);
      }
      $(`[data-currency-wrap] [data-iso="${newCurrency}"]`).first().trigger('click');
    }

    function initActiveCurrencyLocation() {
      var t4Currency = isStorageSpdLocalAll ? localStorage.getItem('T4Currency') : null;

      if (!sr4configs.auto_currency || navigator.userAgent.match(/bot|spider/i) || t4Currency || IsDesignMode) {
        return;
      }

      // if (t4Currency) return;
      var nt_currency = isStorageSpdLocalAll ? localStorage.getItem('nt_currency') : null,
        newCurrency,
        arrayCurrency = {
          AF: 'AFN',
          AX: 'EUR',
          AL: 'ALL',
          DZ: 'DZD',
          AS: 'USD',
          AD: 'EUR',
          AO: 'AOA',
          AI: 'XCD',
          AQ: '',
          AG: 'XCD',
          AR: 'ARS',
          AM: 'AMD',
          AW: 'AWG',
          AU: 'AUD',
          AT: 'EUR',
          AZ: 'AZN',
          BS: 'BSD',
          BH: 'BHD',
          BD: 'BDT',
          BB: 'BBD',
          BY: 'BYN',
          BE: 'EUR',
          BZ: 'BZD',
          BJ: 'XOF',
          BM: 'BMD',
          BT: 'BTN',
          BO: 'BOB',
          BA: 'BAM',
          BW: 'BWP',
          BV: 'NOK',
          BR: 'BRL',
          IO: 'USD',
          BN: 'BND',
          BG: 'BGN',
          BF: 'XOF',
          BI: 'BIF',
          KH: 'KHR',
          CM: 'XAF',
          CA: 'CAD',
          CV: 'CVE',
          KY: 'KYD',
          CF: 'XAF',
          TD: 'XAF',
          CL: 'CLP',
          CN: 'CNY',
          CX: 'AUD',
          CC: 'AUD',
          CO: 'COP',
          KM: 'KMF',
          CG: 'XAF',
          CD: 'CDF',
          CK: 'NZD',
          CR: 'CRC',
          CI: 'XOF',
          HR: 'HRK',
          CU: 'CUP',
          CY: 'EUR',
          CZ: 'CZK',
          DK: 'DKK',
          DJ: 'DJF',
          DM: 'XCD',
          DO: 'DOP',
          EC: 'USD',
          EG: 'EGP',
          SV: 'USD',
          GQ: 'XAF',
          ER: 'ERN',
          EE: 'EUR',
          ET: 'ETB',
          FK: 'FKP',
          FO: 'DKK',
          FJ: 'FJD',
          FI: 'EUR',
          FR: 'EUR',
          GF: 'EUR',
          PF: 'XPF',
          TF: 'EUR',
          GA: 'XAF',
          GM: 'GMD',
          GE: 'GEL',
          DE: 'EUR',
          GH: 'GHS',
          GI: 'GIP',
          GR: 'EUR',
          GL: 'DKK',
          GD: 'XCD',
          GP: 'EUR',
          GU: 'USD',
          GT: 'GTQ',
          GG: 'GBP',
          GN: 'GNF',
          GW: 'XOF',
          GY: 'GYD',
          HT: 'HTG',
          HM: 'AUD',
          VA: 'EUR',
          HN: 'HNL',
          HK: 'HKD',
          HU: 'HUF',
          IS: 'ISK',
          IN: 'INR',
          ID: 'IDR',
          IR: 'IRR',
          IQ: 'IQD',
          IE: 'EUR',
          IM: 'GBP',
          IL: 'ILS',
          IT: 'EUR',
          JM: 'JMD',
          JP: 'JPY',
          JE: 'GBP',
          JO: 'JOD',
          KZ: 'KZT',
          KE: 'KES',
          KI: 'AUD',
          KR: 'KRW',
          KW: 'KWD',
          KG: 'KGS',
          LA: 'LAK',
          LV: 'EUR',
          LB: 'LBP',
          LS: 'LSL',
          LR: 'LRD',
          LY: 'LYD',
          LI: 'CHF',
          LT: 'EUR',
          LU: 'EUR',
          MO: 'MOP',
          MK: 'MKD',
          MG: 'MGA',
          MW: 'MWK',
          MY: 'MYR',
          MV: 'MVR',
          ML: 'XOF',
          MT: 'EUR',
          MH: 'USD',
          MQ: 'EUR',
          MR: 'MRU',
          MU: 'MUR',
          YT: 'EUR',
          MX: 'MXN',
          FM: 'USD',
          MD: 'MDL',
          MC: 'EUR',
          MN: 'MNT',
          ME: 'EUR',
          MS: 'XCD',
          MA: 'MAD',
          MZ: 'MZN',
          MM: 'MMK',
          NA: 'NAD',
          NR: 'AUD',
          NP: 'NPR',
          NL: 'EUR',
          AN: '',
          NC: 'XPF',
          NZ: 'NZD',
          NI: 'NIO',
          NE: 'XOF',
          NG: 'NGN',
          NU: 'NZD',
          NF: 'AUD',
          MP: 'USD',
          NO: 'NOK',
          OM: 'OMR',
          PK: 'PKR',
          PW: 'USD',
          PS: 'ILS',
          PA: 'PAB',
          PG: 'PGK',
          PY: 'PYG',
          PE: 'PEN',
          PH: 'PHP',
          PN: 'NZD',
          PL: 'PLN',
          PT: 'EUR',
          PR: 'USD',
          QA: 'QAR',
          RE: 'EUR',
          RO: 'RON',
          RU: 'RUB',
          RW: 'RWF',
          BL: 'EUR',
          SH: 'SHP',
          KN: 'XCD',
          LC: 'XCD',
          MF: 'EUR',
          PM: 'EUR',
          VC: 'XCD',
          WS: 'WST',
          SM: 'EUR',
          ST: 'STN',
          SA: 'SAR',
          SN: 'XOF',
          RS: 'RSD',
          SC: 'SCR',
          SL: 'SLL',
          SG: 'SGD',
          SK: 'EUR',
          SI: 'EUR',
          SB: 'SBD',
          SO: 'SOS',
          ZA: 'ZAR',
          GS: 'GBP',
          ES: 'EUR',
          LK: 'LKR',
          SD: 'SDG',
          SR: 'SRD',
          SJ: 'NOK',
          SZ: 'SZL',
          SE: 'SEK',
          CH: 'CHF',
          SY: 'SYP',
          TW: 'TWD',
          TJ: 'TJS',
          TZ: 'TZS',
          TH: 'THB',
          TL: 'USD',
          TG: 'XOF',
          TK: 'NZD',
          TO: 'TOP',
          TT: 'TTD',
          TN: 'TND',
          TR: 'TRY',
          TM: 'TMT',
          TC: 'USD',
          TV: 'AUD',
          UG: 'UGX',
          UA: 'UAH',
          AE: 'AED',
          GB: 'GBP',
          US: 'USD',
          UM: 'USD',
          UY: 'UYU',
          UZ: 'UZS',
          VU: 'VUV',
          VE: 'VEF',
          VN: 'VND',
          VG: 'USD',
          VI: 'USD',
          WF: 'XPF',
          EH: 'MAD',
          YE: 'YER',
          ZM: 'ZMW',
          ZW: 'ZWD',
        };

      if (nt_currency) {
        let dataNTcurrency = JSON.parse(nt_currency);
        try {
          newCurrency = t4Currency || dataNTcurrency.currency.handle;
        } catch (err) {
          newCurrency =
            arrayCurrency[dataNTcurrency.countryCode] ||
            arrayCurrency[dataNTcurrency.country] ||
            dataNTcurrency.currency;
        }
        initActiveCurrencyCustomerPick(newCurrency);
      } else {
        // https://ipinfo.io/developers/full-country-names
        // https://ipinfo.io/developers/filtering-bot-traffic
        // https://d1hcrjcdtouu7e.cloudfront.net/users/countryDetection

        var params = {
          type: 'get',
          url: 'https://extreme-ip-lookup.com/json/?key=demo2',
          dataType: 'json',
          success: function (data) {
            if (data.status == 'success') {
              initActiveCurrencyCustomerPick(arrayCurrency[data.countryCode]);
              if (isStorageSpdLocal) {
                localStorage.setItem('nt_currency', JSON.stringify(data));
              }
            } else {
              $.ajax(params_2);
            }
          },
          error: function (XMLHttpRequest, textStatus) {
            $.ajax(params_2);
          },
        };

        var params_2 = {
          type: 'get',
          url: 'https://ipinfo.io/json',
          dataType: 'json',
          success: function (data) {
            initActiveCurrencyCustomerPick(arrayCurrency[data.country]);
            if (isStorageSpdLocal) {
              localStorage.setItem('nt_currency', JSON.stringify(data));
            }
          },
          error: function (XMLHttpRequest, textStatus) {
            $.ajax(params_3);
          },
        };

        var params_3 = {
          type: 'get',
          url: 'https://d1hcrjcdtouu7e.cloudfront.net/users/countryDetection',
          dataType: 'json',
          success: function (data) {
            initActiveCurrencyCustomerPick(arrayCurrency[data.country]);
            if (isStorageSpdLocal) {
              localStorage.setItem('nt_currency', JSON.stringify(data));
            }
          },
        };

        $.ajax({
          type: 'get',
          url: '/browsing_context_suggestions.json?source=geolocation_recommendation&currency[enabled]=true&language[enabled]=true',
          dataType: 'json',
          success: function (data) {
            try {
              var arrSuggest = data.suggestions[0].parts;
              initActiveCurrencyCustomerPick(arrSuggest.currency.handle);
              if (isStorageSpdLocal) {
                localStorage.setItem('nt_currency', JSON.stringify(arrSuggest));
              }
            } catch (err) {
              $.ajax(params);
            }
          },
          error: function (XMLHttpRequest, textStatus) {
            $.ajax(params);
          },
        });
      }
    }

    function clickFormCurrencyLang() {
      var $this, _parent, _child, _input, newISO, oldISO, isCurrency;

      $body.on(
        'click',
        '[data-locale-wrap] [data-locale-item] ,[data-currency-wrap] [data-currency-item]',
        function (e) {
          e.preventDefault();
          $this = $(this);

          if (sr4configs.currency_type == '2' && $this.is('[data-currency-item]')) return;

          if ($this.hasClass(classes.select)) return;

          if ($this.is('[data-locale-item]')) {
            _parent = '[data-locale-wrap]';
            _child = '[data-locale-wrap] [data-locale-item]';
            _input = '$localeSelector';
            isCurrency = false;
          } else {
            _parent = '[data-currency-wrap]';
            _child = '[data-currency-wrap] [data-currency-item]';
            _input = '$currencySelector';
            isCurrency = true;
          }

          newISO = $this.attr('data-iso');
          oldISO = $(_parent + ' .' + classes.select)
            .first()
            .attr('data-iso');

          $(_parent + ' [data-current]')
            .text($this.text())
            .removeClass('flagst4-' + oldISO)
            .addClass('flagst4-' + newISO);

          // $(_child).removeClass(classes.select);
          $(_parent + ' [data-iso=' + newISO + ']')
            .addClass(classes.select)
            .siblings()
            .removeClass(classes.select);

          submitFormCurrencyLang(_input, newISO);

          if (isStorageSpdLocal && isCurrency) {
            localStorage.setItem('T4Currency', newISO);
          }

          sr4ThemeSP.loadingBar();
        }
      );
    }

    function init() {
      cacheSelectors();

      if (cache.$formCurrencyLocale.length == 0) return;

      //submitFormCurrencyLang();
      clickFormCurrencyLang();
      initActiveCurrencyLocation();
    }

    return init;
  })();

  sr4ThemeSP.productRecommendations = (function () {
    var cache = {};

    function cacheSelectors() {
      cache = {
        $recommendationsWrap: $('#pr_recommendations:not(.is--not-rub-js)'),
      };
    }

    function GetProducts($el) {
      var type = $el.data('type'),
        sectionID = $el.data('sid'),
        baseURL = $el.data('baseurl'),
        $recommendations = $el.closest('.id_product-recommendations'),
        urlFetch = search_url + baseURL + '&section_id=' + sectionID;

      if (type == '3')
        urlFetch =
          baseURL + '?section_id=' + sectionID + '&product_id=' + $el.data('id') + '&limit=' + $el.data('limit');

      sr4ThemeSP.getToFetchSection(null, 'text', urlFetch).then((section) => {
        if (section == 'NVT_94') {
          emtyInit($recommendations);
          return;
        }
        //console.log(section)
        var recentlyMarkup = IsDesignMode ? $($(section)[2]).html() : $(section).html();
        try {
          recentlyMarkup.trim();
        } catch (err) {
          recentlyMarkup = $(section).html();
        }

        if (recentlyMarkup.trim() !== '') {
          //console.log(responsive);
          $el.html(recentlyMarkup);
          if ($el.find('.sr4-product').length > 0) sr4ThemeSP.reinitProductGridItem();
          if ($el.find('.flickitysr4').length > 0) {
            var owl = $el.find('.flickitysr4')[0];
            owl.flickitysr4 = new sr4ThemeSP.Carousel(owl);
            sr4ThemeSP.ProductItem.resizeObserver();
            // sr4ThemeSP.Flickitysr4.init( $el.find('.flickitysr4') );
          }
        } else {
          emtyInit($recommendations);
        }
      });

      // fetch( urlFetch , {
      //  method: 'GET',
      //  // headers: {
      //  //   'Cache-Control': 'no-cache'
      //  // }
      // })
      // .then((response) => response.text())
      // .then((section) => {
      //    //console.log(section)
      //    var recentlyMarkup = (IsDesignMode) ? $($(section)[2]).html() : $(section).html();
      //    try {
      //       recentlyMarkup.trim();
      //     }
      //     catch(err) {
      //       recentlyMarkup = $(section).html()
      //     }

      //    if (recentlyMarkup.trim() !== '') {
      //       //console.log(responsive);
      //       $el.html(recentlyMarkup);
      //       if ( $el.find('.sr4-product').length > 0 ) sr4ThemeSP.reinitProductGridItem();
      //       if ( $el.find('.flickitysr4').length > 0 ) {
      //          var owl = $el.find('.flickitysr4')[0];
      //          owl.flickitysr4 = new sr4ThemeSP.Carousel(owl);
      //          // sr4ThemeSP.Flickitysr4.init( $el.find('.flickitysr4') );
      //       }
      //    } else {
      //       $recommendations.hide();
      //    }
      // })
      // .catch((e) => {
      //    $recommendations.hide();
      // });
    }

    function emtyInit($recommendations) {
      if ($recommendations[0]) {
        $recommendations.hide();
      } else {
        if (cache.$recommendationsWrap.hasClass('sr4-pr-single_tab-content')) {
          cache.$recommendationsWrap.find('.sr4-loading--bg').hide();
          cache.$recommendationsWrap.find('[data-emty-product]').show();
        } else {
          sr4ThemeSP.isRelatedEmty = true;
          sr4ThemeSP.isRencentEmty ? $('.sr4-tp-rencent-related').hide() : cache.$recommendationsWrap.hide();
        }
      }
    }

    function init($el) {
      cacheSelectors();

      $el = $el || cache.$recommendationsWrap;

      // if ( $el.length == 0 || page_type != "product")
      if ($el.length == 0) return;

      GetProducts($el);
    }

    return init;
  })();

  sr4ThemeSP.recentlyViewed = (function () {
    var cache = {};

    function cacheSelectors() {
      cache = {
        $recentlyWrap: $('#recently_wrap'),
      };
    }

    function GetProducts($el) {
      var ls = localStorage.getItem('nt_recent'),
        id = page_type == 'product' ? $el.data('id') : '19041994',
        Sectionid = $el.data('sid'),
        unpr = $el.data('unpr'),
        limit = $el.data('limit'),
        $recentlyViewed = $el.closest('.id_recently_viewed');

      // console.log(ls)
      if (ls != null) {
        var arrls = ls.split(','),
          index = arrls.indexOf(id);

        //if( arrls.length > limit ) { arrls = arrls.splice(0,limit+1) }
        if (index > -1) {
          arrls = arrls.splice(0, limit + 1);
          arrls.splice(index, 1);
        } else {
          arrls = arrls.splice(0, limit);
        }
        // console.log(index);
        // console.log(arrls);

        if (arrls.length == 0) {
          emtyInit($recentlyViewed, false);
          return false;
        }

        var arr_list = arrls.toString(),
          uri = arr_list.replace(/,/g, ' OR '),
          res = encodeURI(uri);
        //console.log(res);

        // fetch(search_url+'/?section_id='+Sectionid+'&type=product&options[unavailable_products]='+unpr+'&q='+res, {
        //  method: 'GET',
        //  // headers: {
        //  //   'Cache-Control': 'no-cache'
        //  // }
        // })
        // .then((response) => response.text())
        // .then((section) => {
        //    //console.log(section)
        //    var recentlyMarkup = (IsDesignMode) ? $($(section)[2]).html() : $(section).html();
        //    try {
        //       recentlyMarkup.trim();
        //     }
        //     catch(err) {
        //       recentlyMarkup = $(section).html()
        //     }

        //    if (recentlyMarkup.trim() !== '') {
        //       //console.log(responsive);
        //       $el.html(recentlyMarkup);
        //       if ( $el.find('.sr4-product').length > 0 ) sr4ThemeSP.reinitProductGridItem();
        //       if ( $el.find('.flickitysr4').length > 0 ) {
        //          var owl = $el.find('.flickitysr4')[0];
        //          owl.flickitysr4 = new sr4ThemeSP.Carousel(owl);
        //          //sr4ThemeSP.Flickitysr4.init( $el.find('.flickitysr4') );
        //       }
        //    } else {
        //       $recentlyViewed.hide();
        //    }
        // })
        // .catch((e) => {
        //    $recentlyViewed.hide();
        // });

        sr4ThemeSP
          .getToFetchSection(
            null,
            'text',
            search_url +
              '/?section_id=' +
              Sectionid +
              '&type=product&options[unavailable_products]=' +
              unpr +
              '&q=' +
              res
          )
          .then((section) => {
            if (section == 'NVT_94') {
              emtyInit($recentlyViewed);
              return;
            }
            //console.log(section)
            var recentlyMarkup = IsDesignMode ? $($(section)[2]).html() : $(section).html();
            try {
              recentlyMarkup.trim();
            } catch (err) {
              recentlyMarkup = $(section).html();
            }

            if (recentlyMarkup.trim() !== '') {
              //console.log(responsive);
              $el.html(recentlyMarkup);
              if ($el.find('.sr4-product').length > 0) sr4ThemeSP.reinitProductGridItem();
              if ($el.find('.flickitysr4').length > 0) {
                var owl = $el.find('.flickitysr4')[0];
                owl.flickitysr4 = new sr4ThemeSP.Carousel(owl);
                sr4ThemeSP.ProductItem.resizeObserver();
                //sr4ThemeSP.Flickitysr4.init( $el.find('.flickitysr4') );
              }
            } else {
              emtyInit($recentlyViewed);
            }
          });
      } else {
        emtyInit($recentlyViewed);
        var arrls = new Array();
      }

      if (arrls.indexOf(id) < 0 && id != '19041994') {
        //if(arrls.length > limit){ arrls.pop(); }
        if (arrls.length > limit) {
          arrls = arrls.splice(0, limit);
        }
        // console.log(arrls);
        arrls.unshift(id);
        localStorage.setItem('nt_recent', arrls.toString());
      }
    }

    function emtyInit($recentlyViewed, isHide = true) {
      if ($recentlyViewed[0]) {
        isHide ? $recentlyViewed.hide() : $recentlyViewed.slideUp();
      } else {
        if (cache.$recentlyWrap.hasClass('sr4-pr-single_tab-content')) {
          cache.$recentlyWrap.find('.sr4-loading--bg').hide();
          cache.$recentlyWrap.find('[data-emty-product]').show();
        } else {
          sr4ThemeSP.isRencentEmty = true;
          sr4ThemeSP.isRelatedEmty ? $('.sr4-tp-rencent-related').hide() : cache.$recentlyWrap.hide();
        }
      }
    }

    function init($el) {
      cacheSelectors();

      $el = $el || cache.$recentlyWrap;
      if (!isStorageSpdLocalAll || $el.length == 0) return;

      GetProducts($el);
    }

    return init;
  })();
  // Use:
  // sr4ThemeSP.getToFetchSection(url).then((section) => { console.log('callback'); });

  sr4ThemeSP.Cart = (function () {
    var data_items = '[data-cart-items]',
      data_prices = '[data-cart-prices]',
      data_shipping = '[data-cart-calc-shipping]',
      data_shipping_text = '[data-cart-ship-text]',
      data_shipping_bar = '[data-cart-ship-bar]',
      data_discounts = '[data-cart-discounts]',
      str_upsell = 'data-cart-upsell-options',
      str_percent = 'data-sr4-percent',
      isCanvasConfetti = true,
      isloadFirst = true,
      cartTypeIsDisable = sr4configs.cartType == 'disable',
      afterActionATC = page_type != 'cart' ? sr4configs.afterActionATC : '4',
      strCartDataMini = cartTypeIsDisable ? 'cart_data' : 'cart_data,mini_cart',
      classes = {
        loading: 'is--loading',
        none: 'sr4-d-none',
        active: 'is--active',
      },
      id_se_cart = window.cartsr4ectionID,
      sections_nt = page_type != 'cart' ? strCartDataMini : `cart_data,${id_se_cart}`,
      product_id_upsell = 19041994,
      refresh_upsell = false,
      upsellFlickitysr4Cache = {},
      cart_url = window.sr4routes.cart_url;

    function intiMiniCart() {
      // sr4ThemeSP.Drawer.remove('sr4-mini_cart');
      $('[data-cart-count]').html($('#sr4-mini_cart').data('ccount'));
      sr4ThemeSP.Tooltip();
      $body.trigger('currency:update');

      if (cartTypeIsDisable) return;

      sr4ThemeSP.ProductAjax.change();
      sr4ThemeSP.agreeForm();
      toolAction();
      cartNote();
      cartFixDiscount();
      cartSaveDiscount();
      clickShippingEstimator();
      tabCartClick();
      canvasConfettiCart();
      _fetchCartMiniUpsell();
      _fetchCartMiniVisited();
      $document.on('update:mini_cart:wishlist', _fetchCartMiniWishlist);
      $document.trigger('update:mini_cart:wishlist');
    }

    function getDataMiniCart() {
      if (page_type == 'cart') {
        cartNote();
        cartFixDiscount();
        cartSaveDiscount();
        clickShippingEstimator();
        sr4ThemeSP.agreeForm();
        canvasConfettiCart();
        _fetchCartMiniUpsell();

        return;
      }

      if (IsDesignMode) {
        intiMiniCart();
        return;
      }

      if (cartTypeIsDisable) return;

      // fetch( sr4ThemeSP.root_url+'?section_id=mini_cart' , {
      //  method: 'GET',
      //  headers: {
      //    'Cache-Control': 'no-cache'
      //  }
      // })
      // .then((response) => response.text())
      // .then((section) => {
      //    // Remove cart content odl if exit
      //    $('#sr4-mini_cart').parent().remove();

      //    sr4ThemeSP.$appendComponent.after( $(section).html() );

      //    intiMiniCart();
      // })
      // .catch((e) => {
      // });
      sr4ThemeSP.getToFetchSection('?section_id=mini_cart').then((section) => {
        if (section == 'NVT_94') return;
        // Remove cart content odl if exit
        // $('#sr4-mini_cart').parent().remove();
        sr4ThemeSP.Helpers.promiseStylesheet(sr4configs.stylesheet1).then(
          function () {
            //this._setupSlideType();
            // console.log('xxxx mini_cart')
            $('#sr4-mini_cart').html($(section).html());
            intiMiniCart();
          } //.bind(this)
        );
        //sr4ThemeSP.$appendComponent.after( $(section).html() );
        //intiMiniCart();
      });
    }

    function getToFetch(_opendDrawer = false) {
      sr4ThemeSP.getToFetchSection('?sections=' + sections_nt, 'json').then((sections) => {
        if (sections == 'NVT_94') return;
        //console.log()
        renderContents(sections, _opendDrawer);
      });
      // fetch( sr4ThemeSP.root_url+'?sections='+sections_nt , {
      //  method: 'GET',
      //  headers: { 'Cache-Control': 'no-cache' }
      // })
      // .then((response) => response.json())
      // .then((sections) => {
      //    renderContents(sections,opendDrawer);
      // })
      // .catch((e) => {
      // });
    }

    function renderContents(data, _opendDrawer = false) {
      var data1 = data.cart_data,
        data2 = data.mini_cart || data[id_se_cart],
        $data2 = $(data2), // $(data2).find('[data-cart-content]'), // $(data2).find('[data-cart-wrapper]'),
        $items = $(data_items),
        $prices = $(data_prices),
        $calcShipping = $(data_shipping),
        $calcShippingText = $calcShipping.find(data_shipping_text),
        $calcShippingBar = $calcShipping.find(data_shipping_bar),
        $discounts = $(data_discounts);

      data1 = data1.split('[sr4_split1]')[1];
      data1 = data1.split('[sr4_split2]');

      if ((data1[0] == 0 || sr4ThemeSP.isATCSuccess) && page_type == 'cart') {
        actionAfterAddtoCart();
        return;
      }
      if (!sr4ThemeSP.isATCSuccess && _opendDrawer) sr4ThemeSP.isATCSuccess = _opendDrawer;
      // if (page_type != 'cart') {

      // } else {

      // }
      // console.log(data1, $data2)
      $items.html($data2.find(data_items).html());
      $prices.html($data2.find(data_prices).html());
      $calcShipping.attr(str_percent, $data2.find(data_shipping).attr(str_percent));
      $calcShippingText.replaceWith($data2.find(data_shipping_text).wrap());
      $calcShippingBar.attr('style', $data2.find(data_shipping_bar).attr('style'));
      $discounts.html($data2.find(data_discounts).html());

      /**
       * Update cart count, price on icon cart
       * data-cart-count
       * data-cart-tt-price
       */
      $('[data-cart-count]').html(data1[0]);
      $('[data-cart-tt-price]').html(data1[1]);

      // Update gift product
      if (data1[2] == '1') {
        // exit gift product on cart
        $('.sr4-mini_cart-tool__content.is--gift.is--opend [data-cart-tool_close]').trigger('click');
        $('[data-toogle-gift]').hide();
      } else {
        $('[data-toogle-gift]').show();
      }

      if (data1[0] == 0) {
        $html.addClass('sr4-cart-count-0');
      } else {
        $html.removeClass('sr4-cart-count-0');
        if (refresh_upsell) {
          _fetchCartMiniUpsell();
          refresh_upsell = false;
        }
      }
      document.dispatchEvent(
        new CustomEvent('cart:update:count', { detail: { count: data1[0] }, bubbles: true, cancelable: true })
      );

      sr4ThemeSP.Tooltip();
      $body.trigger('currency:update');

      // after_action_atc
      //if (page_type != "cart" && afterActionATC != '0' && sr4ThemeSP.isATCSuccess) actionAfterAddtoCart();
      if (afterActionATC != '0' && sr4ThemeSP.isATCSuccess) actionAfterAddtoCart();
      // else {
      //    // console.log('cart page')
      // }
      $document.trigger('cart:updated');
      canvasConfettiCart();
    }

    function toolAction() {
      if (page_type == 'cart') return;

      var $wrapper = $('[data-cart-wrapper]'),
        textToolContent = '.sr4-mini_cart-tool__content';

      $('[data-cart-tools]').on('click', '[data-cart-tool_action]', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var $this = $(this),
          dt_id = $this.data('id'),
          $content = $(textToolContent + '.is--' + dt_id),
          $toolClose = $content.find('[data-cart-tool_close]');

        $content.addClass('is--opend');
        $wrapper.addClass('is--contentUpdate');
        $content.removeAttr('style');
        //console.log(self.$input)
        if (!sr4ThemeSP.isTouch) {
          $content.one('transitionend webkitTransitionEnd oTransitionEnd', function () {
            $content.find('[data-opend-focus]').focus();
          });
        }

        //var myTimeout;
        $wrapper.on('click.tool', function (ev) {
          ev.preventDefault();
          //console.log(ev.target)
          if ($(ev.target).is(textToolContent) || $(ev.target).closest(textToolContent).length > 0) return;
          $(textToolContent + '.is--' + dt_id).removeClass('is--opend');
          $wrapper.removeClass('is--contentUpdate');
          $wrapper.off('click.tool');
          // $content.one( 'transitionend webkitTransitionEnd oTransitionEnd', function( ) {
          //    $content.css({
          //       position: 'fixed'
          //    })
          //     clearTimeout(myTimeout);
          //     myTimeout = setTimeout(() => {
          //      $content.removeAttr('style');
          //     }, 500);
          // });
        });

        $toolClose.on('click', function (e) {
          e.preventDefault();
          $content.removeClass('is--opend');
          $wrapper.removeClass('is--contentUpdate');
          $toolClose.off('click');
        });

        // Close by esc
        // off close esc drawe
        $body.off('keyup.drawer').on('keyup.toolCart', function (e) {
          if (e.keyCode !== 27) return;

          $(textToolContent + '.is--' + dt_id).removeClass('is--opend');
          $wrapper.removeClass('is--contentUpdate');

          $body.off('keyup.toolCart').on('keyup.drawer', function (e) {
            if (e.keyCode !== 27) return;
            sr4ThemeSP.Drawer.close(e);
          });
        });

        //$wrapper
      });
    }

    function actionAfterAddtoCart() {
      sr4ThemeSP.isATCSuccess = false;
      // 0: No action. Stay on current page
      // 1: Show popup
      // 2. Show popup recommendations
      // 3: Show drawer cart
      // 4: Go to cart page
      if (afterActionATC == '1') {
        // Show popup
      } else if (afterActionATC == '2') {
      } else if (afterActionATC == '3') {
        if (!sr4ThemeSP.cartTabActive) {
          $('[data-is-tab-cart]').trigger('click');
        }
        sr4ThemeSP.Drawer.opend($('#sr4-mini_cart'));
      } else if (afterActionATC == '5') {
        //Go to checkout page
        document.location.href = sr4ThemeSP.root_url + 'checkout';
      } else {
        //Go to cart page
        document.location.href = cart_url;
      }
    }

    function attributeToString(attribute) {
      if (typeof attribute !== 'string') {
        attribute += '';
        if (attribute === 'undefined') {
          attribute = '';
        }
      }
      return $.trim(attribute);
    }

    function updateCartNote(note) {
      // Start case js fetch
      var headers = new Headers({ 'Content-Type': 'application/json' }),
        note_txt = attributeToString(note);
      var request = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ note: note_txt }),
      };

      fetch(cart_url + '/update.js', request)
        .then(function (response) {
          return response.json();
        })
        .then(function (cart) {
          if (note_txt.length > 0) {
            $('[data-id="note"].is--editNote, .sr4-txt_edit_note').removeClass(classes.none);
            $('[data-id="note"].is--addNote, .sr4-txt_add_note').addClass(classes.none);
          } else {
            $('[data-id="note"].is--editNote, .sr4-txt_edit_note').addClass(classes.none);
            $('[data-id="note"].is--addNote, .sr4-txt_add_note').removeClass(classes.none);
          }
        })
        .catch(function (error) {
          console.log('cart update error: ', error);
        });
      // End case js fetch
    }

    function cartNote() {
      // Save note anytime it's changed
      $('textarea[name="note"]').on('change', function () {
        var newNote = $(this).val();

        // Update the cart note in case they don't click update/checkout
        updateCartNote(newNote);
      });
    }

    function cartSaveDiscount() {
      if (!isStorageSpdLocal) return;

      var CartDiscountcode = 'CartDiscountcode',
        $cartCode = $(`#${CartDiscountcode}`),
        $cartCodeInput = $(`#${CartDiscountcode}, [data-cart-discount]`),
        localCartdiscode = localStorage.getItem(CartDiscountcode);

      $cartCodeInput.val(localCartdiscode).trigger('keyup');

      // console.log($('[data-action="save-discountcode"]'))
      $('[data-action="save-discountcode"]').click(function (e) {
        localStorage.setItem(CartDiscountcode, $cartCode.val());
        $cartCodeInput.val($cartCode.val()).trigger('keyup');
      });
    }

    //Fix when use a link share discount eg:https://sachellecollective.com/discount/pearl15
    function cartFixDiscount() {
      let myTimeout,
        $couponcode = $('#CartDiscountcode');

      if (!$couponcode[0]) return;

      $couponcode.keyup(function () {
        clearTimeout(myTimeout);

        myTimeout = setTimeout(function () {
          if ($couponcode.val().length) {
            $couponcode.attr('name', 'discount');
          } else {
            $couponcode.removeAttr('name');
          }
        }, 300);
      });
    }

    function addressShippingEstimator(id) {
      if (!Shopify) return;
      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector(`ShippingCountry_${id}`, `ShippingProvince_${id}`, {
        hideElement: `ShippingProvinceContainer_${id}`,
      });
    }

    function clickShippingEstimator() {
      var $estimate = $('[data-estimate-shipping-wrap]');
      if (!$estimate[0]) return;
      $estimate[0].langRates = JSON.parse($estimate.find('template[data-lang-rates]').html() || '{}');

      addressShippingEstimator($estimate.data('id'));
      $estimate.on('click', '[data-action="estimate-shipping"]', _fetchRatesForCart.bind($estimate[0]));
    }

    function _fetchRatesForCart(e) {
      e.preventDefault();
      e.stopPropagation();

      // console.log($(e.currentTarget));

      var self = this,
        $this = $(self),
        $wrapper = $this.find('[data-response-rates]'),
        shippingAddress = {},
        $currentTarget = $(e.currentTarget);

      $currentTarget.addClass(classes.loading);
      document.dispatchEvent(new CustomEvent('theme:loading:start'));

      shippingAddress.country = $this.find('[name="country"]').val() || '';
      shippingAddress.province = $this.find('[name="province"]').val() || '';
      shippingAddress.zip = $this.find('[name="zip"]').val() || '';

      fetch(cart_url + '/shipping_rates.json?' + $.param({ shipping_address: shippingAddress }), {
        credentials: 'same-origin',
        method: 'GET',
      }).then(function (response) {
        document.dispatchEvent(new CustomEvent('theme:loading:end'));
        $currentTarget.removeClass(classes.loading);
        response.json().then(function (result) {
          _formatResults(response.ok, result, shippingAddress, $wrapper, self.langRates);
        });
      });
    }

    function _formatResults(isOk, results, shippingAddress, $wrapper, langRates) {
      if (isOk) {
        _onCartShippingRatesUpdate(results.shipping_rates, shippingAddress, $wrapper, langRates);
      } else {
        _onError(results, $wrapper, langRates);
      }
    }

    function _onError(results, $wrapper, langRates) {
      //console.log(results, $wrapper)

      var errorHtml = '';
      Object.keys(results).forEach(function (key) {
        errorHtml += "<li><span class='sr4-key__rate'>".concat(key, '</span> ').concat(results[key], '</li>');
      });

      //console.log(errorHtml)
      if (errorHtml === 'country is not supported.') {
        errorHtml = `<li>${langRates.no_rates}</li>`;
      }
      //geckoShopify.CreatNotices(feedback);
      $wrapper.html(`<p>${langRates.errors}</p><ul class="sr4-mess__rates is--rates-error">${errorHtml}</ul>`).fadeIn();
      //$wrapperId.show()
    }

    function _onCartShippingRatesUpdate(rates, shipping_address, $wrapper, langRates) {
      //_enableButtons();
      var readable_address = '',
        message = '',
        ratesList = '';

      if (shipping_address.zip) {
        readable_address += shipping_address.zip + ', ';
      }
      if (shipping_address.province) {
        readable_address += shipping_address.province + ', ';
      }
      readable_address += shipping_address.country;

      if (rates.length > 1) {
        var firstRate = sr4ThemeSP.Currency.formatMoney(rates[0].price);
        message = langRates.multiple_rates
          .replace('[number_of_rates]', rates.length)
          .replace('[address]', readable_address)
          .replace('[rate]', firstRate);
        //message = langRates.multiple_rates
      } else if (rates.length === 1) {
        message = langRates.one_rate.replace('[address]', readable_address);
        //message = langRates.one_rate;
      } else {
        message = langRates.no_rates;
      }
      //console.log(message)

      //console.log(rates);
      var ratesList = '';
      $.each(rates, function (i, rate) {
        //console.log(rate.price);
        var price = sr4ThemeSP.Currency.formatMoney(rate.price);
        var rateValue = langRates.rate_value.replace('[rate_title]', rate.name).replace('[rate]', price);
        //return '<li>${rateValue}</li>';
        ratesList += '<li>' + rateValue + '</li>';
      });
      //console.log(ratesList);
      $wrapper
        .html(
          '<div class="sr4-mess__rates is--rates-success">' +
            message +
            '</div><div class="sr4-results__rates"><ul>' +
            ratesList.toString().replace(/<\/li>,<li>/g, '</li><li>') +
            '</ul></div>'
        )
        .fadeIn();
      $body.trigger('currency:update');
    }

    // Update https://github.com/catdad/canvas-confetti
    function canvasConfettiCart() {
      if (!enableConfetti) return;

      let ship_done_length = $('[data-cart-ship-done]').length;

      if (ship_done_length > 0 && isCanvasConfetti) {
        sr4ThemeSP.CanvasConfetti();
        isCanvasConfetti = false;
        isloadFirst = false;
      } else if ($(data_shipping).length > 0 && isloadFirst) {
        sr4ThemeSP.CanvasConfetti();
        isloadFirst = false;
      } else if (ship_done_length == 0) {
        isloadFirst = false;
        isCanvasConfetti = true;
      }
    }

    function tabCartClick() {
      let $tabCart = $('[data-tab-cart-wrap]');
      sr4ThemeSP.cartTabActive = true;

      if (!$tabCart[0]) return;

      let $titleCart = $('[data-cart-tab-title]'),
        $contentCart = $('[data-cart-tab-content]');

      $tabCart.on('click', '[data-tab-cart-item]', function (e) {
        e.preventDefault();

        let $this = $(this);

        sr4ThemeSP.cartTabActive = $this.is('[data-is-tab-cart]');

        $titleCart.text($this.data('title'));
        $this
          .addClass(classes.active)
          .siblings('.' + classes.active)
          .removeClass(classes.active);
        $contentCart.attr('aria-hidden', true).eq($this.index()).attr('aria-hidden', false);
      });
    }

    /**
     * Recent view, wishlist, recomend product
     * wishlist, visited,  recommendations product
     *
     * mini_cart_upsell
     * mini_cart_visited
     * mini_cart_wishlist
     */
    function _fetchCartMiniUpsell() {
      let $upsell = $(`[${str_upsell}]`);

      if ($upsell.length == 0) return;

      let options = JsonParse($upsell.attr(str_upsell));

      options.product_id = $('[data-cart-items] [data-cart-item]:first').data('pid') || 19041994;
      if (product_id_upsell == options.product_id) return;

      product_id_upsell = options.product_id;

      let urlUpsell = `${options.baseurl}?section_id=${options.section_id}&product_id=${options.product_id}&limit=${options.limit}`;

      sr4ThemeSP.getToFetchSection(null, 'text', urlUpsell).then((section) => {
        if (section == 'NVT_94') {
          $upsell.hide();
          return;
        }

        //$upsell.wrap(section);
        if (upsellFlickitysr4Cache.flickitysr4) upsellFlickitysr4Cache.flickitysr4.destroy();

        $upsell.html($(section).html());

        $body.trigger('currency:update');
        sr4ThemeSP.Tooltip();

        let upsellFlickitysr4 = $upsell.find('.flickitysr4')[0];

        if (!upsellFlickitysr4) return;

        //console.log(upsellFlickitysr4Cache)
        upsellFlickitysr4Cache.flickitysr4 = new sr4ThemeSP.Carousel(upsellFlickitysr4);
        setTimeout(function () {
          $(upsellFlickitysr4).flickitysr4('resize');
        }, 150);
        setTimeout(function () {
          $(upsellFlickitysr4).flickitysr4('resize');
        }, 450);
      });
    }

    function _fetchCartMiniVisited() {
      let $visited = $('#sr4-tab-visited');
      if ($visited.length == 0 || !isStorageSpdLocalAll) return;

      let ls = localStorage.getItem('nt_recent');

      if (ls == null) return;

      let arrls = ls.split(','),
        arr_list = arrls.toString(),
        uri = arr_list.replace(/,/g, ' OR '),
        res = encodeURI(uri),
        $visitedEmpty = $('.sr4-tab-visited-empty'),
        $visitedSkeleton = $('.sr4-tab-visited-skeleton'),
        unpr = 'show',
        Sectionid = 'mini_cart_visited';

      $visitedEmpty.hide();
      $visitedSkeleton.show();
      sr4ThemeSP
        .getToFetchSection(
          null,
          'text',
          search_url + '/?section_id=' + Sectionid + '&type=product&options[unavailable_products]=' + unpr + '&q=' + res
        )
        .then((section) => {
          $visitedSkeleton.hide();
          if (section == 'NVT_94') return;

          $visitedSkeleton.after($(section).html());
          $body.trigger('currency:update');
          sr4ThemeSP.Wishlist.updateAll();
          sr4ThemeSP.Tooltip();
        });
    }

    function _fetchCartMiniWishlist() {
      //console.log(sr4ThemeSP.linkWishlist)
      let $wishlist = $('#sr4-tab-wishlist'),
        linkWishlist = sr4ThemeSP.linkWishlist || '';

      if ($wishlist.length == 0 || linkWishlist.indexOf('id:') < 0) return;

      let $wishlistEmpty = $('.sr4-tab-wishlist-empty'),
        $wishlistSkeleton = $('.sr4-tab-wishlist-skeleton'),
        wishlistUrl = linkWishlist.replace('view=wishlist', 'section_id=mini_cart_wishlist');

      $wishlistEmpty.hide();
      $wishlistSkeleton.show();
      sr4ThemeSP.getToFetchSection(null, 'text', wishlistUrl).then((section) => {
        $wishlistSkeleton.hide();
        if (section == 'NVT_94') return;
        $wishlistSkeleton.siblings('.sr4-widget__pr').remove();
        $wishlistSkeleton.after($(section).html());
        $body.trigger('currency:update');
        sr4ThemeSP.Wishlist.updateAll();
        sr4ThemeSP.Tooltip();
      });
    }

    function init() {
      getDataMiniCart();

      // document.dispatchEvent(new CustomEvent('cart:refresh'))
      document.addEventListener('cart:refresh', function (evt) {
        getToFetch(false);
      });

      // document.dispatchEvent(new CustomEvent('cart:refresh:opend'))
      document.addEventListener('cart:refresh:opend', function (evt) {
        getToFetch(true);
      });

      $document.on('add:cart:upsell', function (e) {
        refresh_upsell = true;
      });
      // document.dispatchEvent( new CustomEvent('cart:refresh:count', { detail: { count:3 }, bubbles: true, cancelable: true }) );
      // document.addEventListener('cart:refresh:count', function(evt) {
      //   $('[data-cart-count]').html( evt.detail.count );
      // });
    }

    return {
      renderContents: renderContents,
      getToFetch: getToFetch,
      init: init,
    };
  })();

  sr4ThemeSP.Login = (function () {
    var dt_sidebar = 'data-login-sidebar';

    function initFetch() {
      var $loginSidebar = $('#sr4-login-sidebar');

      if ($loginSidebar.length == 0) return;

      var key_time = cacheNameFirst + 'timeLoginsr4',
        key_data = cacheNameFirst + 'dataLoginsr4',
        timeCache = isStorageSpSession ? sessionStorage.getItem(key_time) || 0 : 0,
        timeCache = parseInt(timeCache),
        timeConfig = 400 * 60000; // convert 400 minute to milliseconds;

      if (timeCache > 0 && timeCache >= Date.now()) {
        // sr4ThemeSP.$appendComponent.after( sessionStorage.getItem(key_data) );
        // sr4ThemeSP.Drawer.remove('sr4-login-sidebar');
        // initClick();

        sr4ThemeSP.Helpers.promiseStylesheet(sr4configs.stylesheet3).then(function () {
          $loginSidebar.html(sessionStorage.getItem(key_data));
          initClick();
        });
      } else {
        sr4ThemeSP.getToFetchSection('?section_id=login-sidebar').then((section) => {
          if (section == 'NVT_94') return;
          //sr4ThemeSP.$appendComponent.after( section );
          // $loginSidebar.html( $(section).html() );
          // sr4ThemeSP.Drawer.remove('sr4-login-sidebar');
          // initClick();
          // if (isStorageSpSession) {
          //    timeCache = Date.now() + timeConfig;
          //    sessionStorage.setItem(key_time, timeCache);
          //    sessionStorage.setItem(key_data, $(section).html());
          // }

          sr4ThemeSP.Helpers.promiseStylesheet(sr4configs.stylesheet3).then(function () {
            $loginSidebar.html($(section).html());
            //sr4ThemeSP.Drawer.remove('sr4-login-sidebar');
            initClick();
            if (isStorageSpSession) {
              timeCache = Date.now() + timeConfig;
              sessionStorage.setItem(key_time, timeCache);
              sessionStorage.setItem(key_data, $(section).html());
            }
          });
        });
      }

      // fetch( sr4ThemeSP.root_url+'?section_id=login-sidebar', {
      //  method: 'GET',
      //  headers: { 'Cache-Control': 'no-cache' }
      // })
      // .then((response) => response.text())
      // .then((section) => {
      //    sr4ThemeSP.$appendComponent.after( section );
      //    sr4ThemeSP.Drawer.remove('sr4-login-sidebar');
      //    initClick();
      // })
      // .catch((e) => {
      // });
    }

    function initClick() {
      var strLoginSidebar = '#sr4-login-sidebar',
        $loginSidebar = $(strLoginSidebar);

      sr4ThemeSP.Drawer.remove('sr4-login-sidebar');
      $loginSidebar.on('click', '[' + dt_sidebar + ']', function (e) {
        e.preventDefault();
        var $this = $(this);

        var getData = $this.attr(dt_sidebar);
        // console.log(getData)
        $(strLoginSidebar + ' .sr4-content-login-sidebar.is--' + getData)
          .attr('aria-hidden', 'false')
          .siblings()
          .attr('aria-hidden', 'true');
        $(strLoginSidebar + ' .sr4-drawer__header .is--' + getData)
          .attr('aria-hidden', 'false')
          .siblings()
          .attr('aria-hidden', 'true');
        $loginSidebar.attr('data-target', getData);
      });
    }

    function init() {
      IsDesignMode ? initClick() : initFetch();
    }

    return init;
  })();

  sr4ThemeSP.Compare = (function () {
    var notCompare = !sr4configs.enable_compare,
      limit = 6,
      dt_link_compare = '[data-link-compare]',
      dt_add_compare = '[data-action-compare]',
      dt_remove_compare = '[data-remove-compare]',
      dt_count_compare = '[data-count-compare]',
      dt_clear_compare = '[data-clear-compare]',
      dt_close_compare = '[data-close-compare]',
      sr4_cp = 'sr4_cp',
      sr4_pe_none = 'is--pe-none',
      is_added = 'is--added',
      is_activate = 'is--activate',
      added_text = sr4ProductStrings.added_text_cp,
      compare_text = sr4ProductStrings.compare,
      countCompare = 0,
      linkCompare = search_url + '/?view=compare&type=product&options[unavailable_products]=last&q=',
      linkCompare2 = '',
      arrls,
      cp_icon = sr4configs.cp_icon,
      cp_icon_added = sr4configs.cp_icon_added,
      showPopupCompare = sr4configs.enableCompePopup,
      $comparePopup,
      isPageCompare = window.isPageCompare;

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    function replaceStateURL() {
      if (!history.replaceState || !isPageCompare) return;
      window.history.replaceState({}, document.title, search_url + '/?view=compare');
    }

    function add() {
      $body.on('click', dt_add_compare + ':not(.' + is_added + ')', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var $this = $(this),
          dt_id = $this.data('id') || '',
          id = 'id:' + dt_id,
          ls = localStorage.getItem(sr4_cp),
          limitSmallLength = false;

        if (dt_id == '') return;

        $this.addClass(sr4_pe_none);

        if (ls != null && ls.length > 0) {
          arrls = ls.split(',');
          arrls.unshift(id);
        } else {
          var arrls = new Array();
          arrls.unshift(id);
        }
        //console.log(arrls)
        arrls = arrls.filter(onlyUnique);
        //console.log(arrls)

        if (arrls.length > limit) {
          arrls = arrls.splice(0, limit);
          limitSmallLength = true;
        }
        localStorage.setItem(sr4_cp, arrls.toString());
        countCompare = arrls.length;

        // Update
        if (limitSmallLength) {
          // Remove added products compare
          var $added = $(dt_add_compare + is_added);
          $added.removeClass(is_added).find('.sr4-text-pr').text(compare_text);
          $added.find('.sr4-svg-pr-icon').html(cp_icon);

          // added on 6 product list compare
          updateAll();
        } else {
          updateItem(dt_id, $this);
        }

        // Update data count
        // console.log('countCompare',countCompare);
        $(dt_count_compare).html(countCompare);

        // Update link compare
        updatelinkCompare();

        // Update compare hidden
        fetchHiddenCompare(linkCompare2, true);

        // Reload to page when on compare page
        if (isPageCompare) {
          window.location.href = linkCompare2;
        }
      });
    }

    function clickAdded() {
      $body.on('click', dt_add_compare + '.' + is_added, function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (showPopupCompare) {
          if (sr4configs.compePopupDes == undefined || sr4configs.compePopupDes == 'canvas') {
            // console.log('added canvas')
            $comparePopup.addClass(is_activate);
          } else if (sr4configs.compePopupDes == 'modal') {
            // console.log('added modal')
            fetchHiddenCompare(linkCompare2, true);
          }
        } else {
          window.location.href = linkCompare2;
        }
      });

      $body.on('click', dt_link_compare, function (e) {
        e.preventDefault();
        window.location.href = linkCompare2;
      });

      $body.on('click', dt_clear_compare, function (e) {
        e.preventDefault();
        if (sr4configs.compePopupDes == undefined || sr4configs.compePopupDes == 'canvas') {
          // console.log('close canvas')
          $comparePopup.removeClass(is_activate);
        } else if (sr4configs.compePopupDes == 'modal') {
          // console.log('close modal')
          $body.trigger('modalsr4:closed');
        }

        // remove added all button has id
        // console.log(arrls)
        let l_cp = arrls.length;
        for (let i_cp = 0; i_cp < l_cp; i_cp++) {
          let id = arrls[i_cp].replace('id:', '');
          $(dt_add_compare + '[data-id="' + id + '"]')
            .removeClass(is_added)
            .find('.sr4-text-pr')
            .text(compare_text);
          $(dt_add_compare + '[data-id="' + id + '"]')
            .find('.sr4-svg-pr-icon')
            .html(cp_icon);
        }

        // make emty array
        arrls = [];
        localStorage.setItem(sr4_cp, arrls.toString());

        // Update data count
        countCompare = 0;
        // console.log('countCompare',countCompare);
        $(dt_count_compare).html(countCompare);

        // Update link compare
        updatelinkCompare();
      });

      $body.on('click', dt_close_compare, function (e) {
        e.preventDefault();
        $comparePopup.removeClass(is_activate);
      });
    }

    function remove() {
      $body.on('click', dt_remove_compare, function (e) {
        e.preventDefault();
        e.stopPropagation();

        var $this = $(this),
          dt_id = $this.data('id'),
          id = 'id:' + dt_id,
          ls = localStorage.getItem(sr4_cp);

        $this.addClass(sr4_pe_none);
        arrls = ls.split(',');

        var index = arrls.indexOf(id);
        // console.log(arrls);
        if (index > -1) {
          arrls = arrls.splice(0, limit + 1);
          arrls.splice(index, 1);
        } else {
          arrls = arrls.splice(0, limit);
        }
        // console.log(arrls);
        localStorage.setItem(sr4_cp, arrls.toString());
        $this.removeClass(sr4_pe_none);

        $this.trigger('destroyTooltip');
        $('.sr4_compare_id_' + dt_id).remove();

        // remove added all button has id
        $(dt_add_compare + '[data-id="' + dt_id + '"]')
          .removeClass(is_added)
          .find('.sr4-text-pr')
          .text(compare_text);
        $(dt_add_compare + '[data-id="' + dt_id + '"]')
          .find('.sr4-svg-pr-icon')
          .html(cp_icon);

        // Update data count
        countCompare = arrls.length;
        // console.log('countCompare',countCompare);
        $(dt_count_compare).html(countCompare);

        // Update link compare
        updatelinkCompare();

        // Reload to compare page when emty
        if (isPageCompare && arrls.toString() == '') {
          $('.sr4_compare_table').fadeTo(300, 0);
          window.location.href = linkCompare2;
        }

        if (countCompare == 0 && showPopupCompare) {
          if (sr4configs.compePopupDes == undefined || sr4configs.compePopupDes == 'canvas') {
            // console.log('close canvas')
            $comparePopup.removeClass(is_activate);
          } else if (sr4configs.compePopupDes == 'modal') {
            // console.log('close modal')
            $body.trigger('modalsr4:closed');
          }
        }
      });
    }

    function updatelinkCompare() {
      //  if ( !isStorageSpdLocalAll || notCompare ) return;

      var ls = localStorage.getItem(sr4_cp);
      if (ls == null) return;

      arrls = ls.split(',');

      var uri = ls.replace(/,/g, ' OR '),
        res = encodeURI(uri);

      linkCompare2 = linkCompare + res;
    }

    function linkCompareInt() {
      updatelinkCompare();

      if (!isPageCompare) return;

      // Detect when usser go page seach/?view=wishlist&q=id:12345 but exit product compare
      if (window.isEmtyCompare && window.isComparePerformed) {
        localStorage.removeItem(sr4_cp);
        return;
      }

      // Count Wishlist other arrls length when has a product wishlist,  Shopify backend > deactive product
      if (window.countComparePage != arrls.length && window.isComparePerformed) {
        //console.log('countWishlist other arrls length', window.countWishlistPage,$(dt_count_wishlist));
        // update count
        $(dt_count_wishlist).html(window.countComparePage);
        localStorage.setItem(sr4_wis, window.listIDPrs);
      }

      // Detect when usser go page seach/?view=compare but exit product compare
      if (window.isEmtyCompare && !window.isComparePerformed && arrls.toString() != '' && !IsDesignMode) {
        window.location.href = linkCompare2;
      }
    }

    function updateAll() {
      if (!isStorageSpdLocalAll || notCompare) return;

      var ls = localStorage.getItem(sr4_cp);

      if (ls == null) return;

      var str_id = ls.replace(/id:/g, ''); // remove id:
      arrls = str_id.split(','); // conver array

      countCompare = ls == '' ? 0 : arrls.length;

      arrls.forEach(function (item, index) {
        // console.log( item, item.replace('id:','' ) )
        updateItem(item.replace('id:', ''));
      });

      // Update data count
      $(dt_count_compare).html(window.countComparePage || countCompare);
    }

    function updateItem(dt_id, $that) {
      // Update all link has id
      // $('.sr4-tooltip.is--show .sr4-tooltip-inner').html(added_text);

      var $this = $(dt_add_compare + '[data-id="' + dt_id + '"]:not(.' + is_added + ')');
      $this.addClass(is_added).removeClass(sr4_pe_none).find('.sr4-text-pr').text(added_text);
      $this.find('.sr4-svg-pr-icon').html(cp_icon_added);
      if ($that) $that.trigger('updateTooltip');
    }

    function fetchHiddenCompare(url, bl = false) {
      if (!showPopupCompare) return;
      if (sr4configs.compePopupDes == undefined || sr4configs.compePopupDes == 'canvas') {
        sr4ThemeSP
          .getToFetchSection(null, 'text', url.replace('view=compare', 'section_id=compare-popup'))
          .then((section) => {
            if (section == 'NVT_94') return;
            if (bl && $comparePopup) $comparePopup.remove();
            sr4ThemeSP.$appendComponent.after(section);
            $comparePopup = $('.sr4_section__compare-popup');
            if (bl) {
              setTimeout(function () {
                $comparePopup.addClass(is_activate);
              }, 20);
            }
            sr4ThemeSP.Tooltip();
          });
      } else if (bl && sr4configs.compePopupDes == 'modal') {
        sr4ThemeSP
          .getToFetchSection(null, 'text', url.replace('view=compare', 'section_id=compare-modal'))
          .then((section) => {
            if (section == 'NVT_94') return;
            if (bl && $comparePopup) $comparePopup.remove();
            sr4ThemeSP.NTpopupInline(section, '', reloadFunctCompare, 'sr4-opening-cp');
            $body.trigger('modalsr4:opened');
            sr4ThemeSP.Tooltip();
          });
      }

      // fetch(url.replace('view=compare','section_id=compare-popup'), {
      //  method: 'GET',
      //  headers: { 'Cache-Control': 'no-cache' }
      // })
      // .then((response) => response.text())
      // .then((section) => {
      //    if (bl && $comparePopup) $comparePopup.remove();
      //    sr4ThemeSP.$appendComponent.after( section );
      //    $comparePopup = $('.sr4_section__compare-popup');
      //    if (bl) {
      //        setTimeout(function(){ $comparePopup.addClass(is_activate); }, 20);
      //    }
      // })
      // .catch((e) => { });
    }

    function init() {
      if (!isStorageSpdLocalAll || notCompare) return;

      replaceStateURL();
      linkCompareInt();
      clickAdded();

      if (localStorage.getItem(sr4_cp) != null && arrls.toString() != '') fetchHiddenCompare(linkCompare2);

      add();
      remove();
    }

    return {
      init: init,
      updateAll: updateAll,
    };
  })();

  sr4ThemeSP.Wishlist = (function () {
    var wishlist_mode = sr4configs.wishlist_mode,
      wis_atc_added = sr4configs.wis_atc_added,
      isClickAddedRemove = wis_atc_added == '2',
      isWishlistLocal = wishlist_mode == '1',
      isWishlistApp = wishlist_mode == '2',
      notWishlist = !(isWishlistLocal || isWishlistApp),
      limit = 50,
      dt_link_wishlist = '[data-link-wishlist]',
      str_add_wishlist = 'data-action-wishlist',
      dt_add_wishlist = '[' + str_add_wishlist + ']',
      str_remove_wishlist = 'data-remove-wishlist',
      dt_remove_wishlist = '[' + str_remove_wishlist + ']',
      dt_count_wishlist = '[data-count-wishlist]',
      sr4_wis = 'sr4_wis',
      sr4_pe_none = 'is--pe-none',
      is_added = 'is--added',
      browse_wishlist = sr4ProductStrings.browse_wishlist,
      remove_wishlist = sr4ProductStrings.remove_wishlist,
      add_to_wishlist = sr4ProductStrings.add_to_wishlist,
      added_text = isClickAddedRemove ? remove_wishlist : browse_wishlist,
      countWishlist = 0,
      linkWishlist = search_url + '/?view=wishlist&type=product&options[unavailable_products]=last&q=',
      linkWishlist2 = '',
      arrls = '',
      wis_icon = sr4configs.wis_icon,
      wis_icon_remove = sr4configs.wis_icon_remove,
      wis_icon_added = sr4configs.wis_icon_added,
      isLoading = 'is--loading',
      linkWishlistApp = '/tools/the4/wishlist',
      listIDWishlistApp = '',
      dataWishlistApp,
      isPageWishlist = window.isPageWishlist,
      hasPaginateWishlist = window.hasPaginateWishlist;

    if (isWishlistApp) {
      var $wis_sr4_list = $('#wis_sr4_list'),
        // cusid             = $wis_sr4_list.data('cusid'),
        // email             = $wis_sr4_list.data('email'),
        listHtml = $wis_sr4_list.html() || '',
        listIDWishlistApp = listHtml.length > 0 ? listHtml.split(' ') : [];
    }
    // console.log(listIDWishlistApp)

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    function replaceStateURL() {
      if (!history.replaceState || !isPageWishlist) return;
      window.history.replaceState({}, document.title, search_url + '/?view=wishlist');
    }

    function loginAction() {}

    /**
     * @param {[type]} type [get, set]
     */
    function ActionGetSet(type, data) {
      if (isWishlistApp) {
        return type == 'get' ? listIDWishlistApp : listIDWishlistApp + data;
      } else {
        return type == 'get' ? localStorage.getItem(sr4_wis) : localStorage.setItem(sr4_wis, data);
      }
    }

    /**
     * Add
     */

    // wis_sr4_list
    function addAction() {
      $body.on('click', dt_add_wishlist + ':not(.' + is_added + ')', function (e) {
        e.preventDefault();
        e.stopPropagation();
        isWishlistLocal ? add($(this)) : addWislistApp($(this));
      });
    }

    function add($this) {
      var dt_id = $this.data('id') || '',
        id = 'id:' + dt_id,
        ls = localStorage.getItem(sr4_wis),
        limitSmallLength = false;

      if (dt_id == '') return;

      $this.addClass(sr4_pe_none);

      if (ls != null && ls.length > 0) {
        arrls = ls.split(',');
        arrls.unshift(id);
      } else {
        var arrls = new Array();
        arrls.unshift(id);
      }
      //console.log(arrls)
      arrls = arrls.filter(onlyUnique);
      //console.log(arrls)

      if (arrls.length > limit) {
        arrls = arrls.splice(0, limit);
        limitSmallLength = true;
      }
      localStorage.setItem(sr4_wis, arrls.toString());
      countWishlist = arrls.length;

      // Update
      if (limitSmallLength) {
        // Remove added product compare
        var $added = $(dt_add_wishlist + is_added);
        $added.removeClass(is_added).find('.sr4-text-pr').text(add_to_wishlist);
        // $this.trigger('updateTooltip');
        $added.find('.sr4-svg-pr-icon').html(wis_icon);
        // added on 6 product list compare
        updateAll();
      } else {
        updateItem(dt_id, $this);
      }

      // Update data count
      // console.log('countWishlist',countWishlist);
      $(dt_count_wishlist).html(countWishlist);

      // Update link compare
      updatelinkWishlist();

      // Reload to page when on wishlist page
      if (isPageWishlist) {
        window.location.href = linkWishlist2;
      }
    }

    function addWislistApp($this) {
      var dt_id = $this.attr('data-id') || '',
        id = 'id:' + dt_id,
        dt_handle = $this.attr('data-handle') || 'ntt4' + dt_id;
      // console.log(dt_id)
      //
      if (dt_id == '') return;

      $this.addClass(isLoading + ' ' + sr4_pe_none);

      fetch(linkWishlistApp, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: dt_id,
          product_handle: dt_handle,
          action: 'add',
        }),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (data.status != 'success') {
            console.error(data.message || 'Unknow error');
            return;
          }
          listIDWishlistApp = JSON.parse(data.response.metafield.value).the4_ids;
          if (!Array.isArray(listIDWishlistApp)) {
            listIDWishlistApp = listIDWishlistApp.split(',');
          }
          //console.log(listIDWishlistApp);
          updateItem(dt_id);

          // Update data count
          // console.log('countWishlist',countWishlist);
          countWishlist = listIDWishlistApp.length;
          $(dt_count_wishlist).html(countWishlist);

          // Update link compare
          updatelinkWishlistApp();

          // Reload to page when on wishlist page
          if (isPageWishlist) {
            window.location.href = linkWishlist2;
          }
        })
        .catch(function (error) {
          console.log('Error: ' + error);
        })
        .finally(() => {
          $this.removeClass(isLoading + ' ' + sr4_pe_none);
        });

      // fetch(linkWishlistApp, {
      //  method: 'POST',
      //  headers: {
      //    'Content-Type': 'application/x-www-form-urlencoded',
      //    'X-Requested-With': 'XMLHttpRequest'
      //    //'Cache-Control': 'no-cache'
      //  },
      //   body: `id=${dt_id}&handle=ntt4&action=add&email=${email}&customer_id=${cusid}`,
      // })
      // .then((response) => response.json())
      // .then((response, status) => {
      //    if (response.status != 'success' && status != 'success') {
      //      console.error(response.message);
      //      return;
      //    }
      //    listIDWishlistApp = response.data.ids;
      //    if (!Array.isArray(listIDWishlistApp)) {
      //      listIDWishlistApp = listIDWishlistApp.split(',');
      //    }
      //    //console.log(listIDWishlistApp);
      //    updateItem(dt_id);

      //     // Update data count
      //     // console.log('countWishlist',countWishlist);
      //     countWishlist = listIDWishlistApp.length;
      //     $(dt_count_wishlist).html(countWishlist);

      //     // Update link compare
      //     updatelinkWishlistApp();

      //     // Reload to page when on wishlist page
      //     if ( isPageWishlist ) {
      //      window.location.href = linkWishlist2;
      //     }
      // })
      // .catch((e) => {
      //     if (e.status == 404) {
      //        alert('This feature is not available because there is no  Nitro Wishlist app installed. Please install Nitro Wishlist app first when using Wishlist in Shop.');
      //     } else {
      //      console.log('Error: ' + e.message);
      //     }
      // })
      // .finally(() => {
      //     $this.removeClass(isLoading+' '+sr4_pe_none);
      // });
    }
    /**
     * End Add
     */

    /**
     * Remove
     */

    function clickAdded() {
      $body.on('click', dt_add_wishlist + '.' + is_added, function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (isClickAddedRemove) {
          isWishlistLocal ? remove($(this)) : removeWislistApp($(this));
        } else {
          window.location.href = linkWishlist2;
        }
      });

      $body.on('click', dt_link_wishlist, function (e) {
        if (linkWishlist2.length == 0) return;
        e.preventDefault();

        window.location.href = linkWishlist2;
      });
    }

    function removeAction() {
      $body.on('click', dt_remove_wishlist, function (e) {
        e.preventDefault();
        e.stopPropagation();
        isWishlistLocal ? remove($(this)) : removeWislistApp($(this));
      });
    }

    function remove($this) {
      var dt_id = $this.data('id'),
        id = 'id:' + dt_id,
        ls = localStorage.getItem(sr4_wis);

      $this.addClass(sr4_pe_none);
      arrls = ls.split(',');

      var index = arrls.indexOf(id);
      // console.log(arrls);
      if (index > -1) {
        arrls = arrls.splice(0, limit + 1);
        arrls.splice(index, 1);
      } else {
        arrls = arrls.splice(0, limit);
      }
      // console.log(arrls);
      localStorage.setItem(sr4_wis, arrls.toString());
      $this.removeClass(sr4_pe_none);

      $this.trigger('destroyTooltip');
      var $productsWishlist = $('.sr4-products-wishlist .sr4-products');
      // if ($productsWishlist.hasClass('isotopesr4-enabled')) {
      //    $productsWishlist.isotopesr4( 'remove', $this.closest('.sr4-product')[0] ).isotopesr4('layout');
      // } else if ($productsWishlist.length > 0) {
      //    $this.closest('.sr4-product').remove();
      // }
      if ($productsWishlist.length > 0) {
        let $product = $this.closest('.sr4-product');

        $product = $product[0] ? $product : $(`[data-remove-wishlist][data-id="${dt_id}"]`).closest('.sr4-product');

        if ($productsWishlist.hasClass('isotopesr4-enabled')) {
          $productsWishlist.isotopesr4('remove', $product[0]).isotopesr4('layout');
        } else {
          $product.remove();
        }
      }

      // $body.trigger('sr4:hideTooltip')

      // remove added all button has id
      $(dt_add_wishlist + '[data-id="' + dt_id + '"]')
        .removeClass(is_added)
        .find('.sr4-text-pr')
        .text(add_to_wishlist);
      $(dt_add_wishlist + '[data-id="' + dt_id + '"]')
        .find('.sr4-svg-pr-icon')
        .html(wis_icon);

      // Update data count
      countWishlist = arrls.length;
      // console.log('countWishlist',countWishlist);
      $(dt_count_wishlist).html(countWishlist);

      // Update link compare
      updatelinkWishlist();

      // console.log(isWishlistLocal)
      // return

      // Reload to wishlist page when emty
      if (isPageWishlist && (arrls.toString() == '' || hasPaginateWishlist)) {
        $('.sr4-products-wishlist').fadeTo(300, 0);
        window.location.href = linkWishlist2;
      }
    }

    function removeWislistApp($this) {
      var dt_id = $this.attr('data-id') || '',
        dt_handle = $this.attr('data-handle') || 'ntt4' + dt_id;
      // console.log(dt_id)

      $this.addClass(isLoading + ' ' + sr4_pe_none);

      fetch(linkWishlistApp, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: dt_id,
          product_handle: dt_handle,
          action: 'add',
          _method: 'DELETE',
        }),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (data.status != 'success') {
            console.error(data.message || 'Unknow error');
            return;
          }
          arrls = JSON.parse(data.response.metafield.value).the4_ids;
          listIDWishlistApp = arrls;
          if (!Array.isArray(listIDWishlistApp)) {
            listIDWishlistApp = listIDWishlistApp.split(',');
          }
          // console.log(listIDWishlistApp,arrls);

          $this.trigger('destroyTooltip');
          var $productsWishlist = $('.sr4-products-wishlist .sr4-products');
          // if ($productsWishlist.hasClass('isotopesr4-enabled')) {
          //    $productsWishlist.isotopesr4( 'remove', $this.closest('.sr4-product')[0] ).isotopesr4('layout');
          // } else if ($productsWishlist.length > 0) {
          //    $this.closest('.sr4-product').remove();
          // }

          if ($productsWishlist.length > 0) {
            let $product = $this.closest('.sr4-product');

            $product = $product[0] ? $product : $(`[data-remove-wishlist][data-id="${dt_id}"]`).closest('.sr4-product');

            if ($productsWishlist.hasClass('isotopesr4-enabled')) {
              $productsWishlist.isotopesr4('remove', $product[0]).isotopesr4('layout');
            } else {
              $product.remove();
            }
          }

          // $body.trigger('sr4:hideTooltip');

          // remove added all button has id
          $(dt_add_wishlist + '[data-id="' + dt_id + '"]')
            .removeClass(is_added)
            .find('.sr4-text-pr')
            .text(add_to_wishlist);
          $(dt_add_wishlist + '[data-id="' + dt_id + '"]')
            .find('.sr4-svg-pr-icon')
            .html(wis_icon);

          // Update data count
          // console.log('countWishlist',countWishlist);
          countWishlist = listIDWishlistApp.length;
          $(dt_count_wishlist).html(countWishlist);

          // Update link compare
          updatelinkWishlistApp();

          // Reload to wishlist page when emty
          if (isPageWishlist && (arrls.toString() == '' || hasPaginateWishlist)) {
            $('.sr4-products-wishlist').fadeTo(300, 0);
            window.location.href = linkWishlist;
          }
        })
        .catch(function (error) {
          console.log('Error: ' + error);
        })
        .finally(() => {
          $this.removeClass(isLoading + ' ' + sr4_pe_none);
        });

      // fetch(linkWishlistApp, {
      //  method: 'POST',
      //  headers: {
      //    'Content-Type': 'application/x-www-form-urlencoded',
      //    'X-Requested-With': 'XMLHttpRequest'
      //    //'Cache-Control': 'no-cache'
      //  },
      //   body: `id=${dt_id}&handle=ntt4&action=remove&email=${email}&customer_id=${cusid}`,
      // })
      // .then((response) => response.json())
      // .then((response, status) => {
      //    if (response.status != 'success' && status != 'success') {
      //      console.error(response.message);
      //      return;
      //    }

      //    arrls = response.data.ids;
      //    listIDWishlistApp = arrls;
      //    // console.log(listIDWishlistApp,arrls);

      //    $this.trigger('destroyTooltip');
      //    var $productsWishlist = $('.sr4-products-wishlist .sr4-products');
      //    if ($productsWishlist.hasClass('isotopesr4-enabled')) {
      //       $productsWishlist.isotopesr4( 'remove', $this.closest('.sr4-product')[0] ).isotopesr4('layout');
      //    } else if ($productsWishlist.length > 0) {
      //       $this.closest('.sr4-product').remove();
      //    }

      //    // $body.trigger('sr4:hideTooltip');

      //    // remove added all button has id
      //    $(dt_add_wishlist+'[data-id="'+dt_id+'"]').removeClass(is_added).find('.sr4-text-pr').text(add_to_wishlist);
      //    $(dt_add_wishlist+'[data-id="'+dt_id+'"]').find('.sr4-svg-pr-icon').html(wis_icon);

      //    // Update data count
      //    // console.log('countWishlist',countWishlist);
      //    countWishlist = listIDWishlistApp.length;
      //    $(dt_count_wishlist).html(countWishlist);

      //    // Update link compare
      //    updatelinkWishlistApp();

      //    // Reload to wishlist page when emty
      //    if ( isPageWishlist && arrls.toString() == '') {
      //      $('.sr4-products-wishlist').fadeTo( 300, 0 );
      //      window.location.href = linkWishlist;
      //    }
      // })
      // .catch((e) => {
      //     console.log('Error: ' + e.message);
      // })
      // .finally(() => {
      //     $this.removeClass(isLoading+' '+sr4_pe_none);
      // });
    }
    /**
     * End Remove
     */

    function updatelinkWishlist() {
      var ls = localStorage.getItem(sr4_wis);

      if (ls == null) return;

      arrls = ls.split(',');

      var uri = ls.replace(/,/g, ' OR '),
        res = encodeURI(uri);

      linkWishlist2 = linkWishlist + res;
      sr4ThemeSP.linkWishlist = linkWishlist2;
      $document.trigger('update:mini_cart:wishlist');
    }

    function updatelinkWishlistApp() {
      arrls = listIDWishlistApp;

      if (arrls.length == 0) return;

      var uri = 'id:' + arrls.join(' OR id:'),
        res = encodeURI(uri);

      linkWishlist2 = linkWishlist + res;
      sr4ThemeSP.linkWishlist = linkWishlist2;
      $document.trigger('update:mini_cart:wishlist');
    }

    function linkWishlistInt() {
      isWishlistLocal ? updatelinkWishlist() : updatelinkWishlistApp();
      //console.log('sss loadPageWishlist', arrls.length );

      if (!isPageWishlist) return;

      // Detect when usser go page seach/?view=wishlist&q=id:12345 but exit product compare
      if (window.isEmtyWishlist && window.isWishlistPerformed) {
        localStorage.removeItem(sr4_wis);
        return;
      }

      // Count Wishlist other arrls length when has a product wishlist,  Shopify backend > deactive product
      if (window.countWishlistPage != arrls.length && window.isWishlistPerformed) {
        //console.log('countWishlist other arrls length', window.countWishlistPage,$(dt_count_wishlist));
        // update count
        $(dt_count_wishlist).html(window.countWishlistPage);
        localStorage.setItem(sr4_wis, window.listIDPrs);
      }

      // Detect when usser go page seach/?view=wishlist but exit product added wishlist
      if (window.isEmtyWishlist && !window.isWishlistPerformed && arrls.toString() != '' && !IsDesignMode) {
        window.location.href = linkWishlist2;
      }

      // on wishlist page repalce icon heart to icon remove
    }

    function updateAll() {
      if ((!isStorageSpdLocalAll && isWishlistLocal) || notWishlist) return;

      if (isWishlistLocal) {
        var ls = localStorage.getItem(sr4_wis);
        if (ls == null) return;
        var str_id = ls.replace(/id:/g, ''); // remove id:
        arrls = str_id.split(','); // conver array
        countWishlist = ls == '' ? 0 : arrls.length;
      } else {
        arrls = listIDWishlistApp;
        if (arrls.toString() == '') return;
        countWishlist = arrls.length;
        // console.log(listIDWishlistApp);
      }
      // console.log(arrls, listIDWishlistApp)

      arrls.forEach(function (item, index) {
        //console.log( item, item.replace('id:','' ) )
        updateItem(item.replace('id:', ''));
      });

      if (isPageWishlist) {
        var $this = $('.sr4-products-wishlist ' + dt_add_wishlist);
        $this
          .removeClass(is_added)
          .removeAttr(str_add_wishlist, '')
          .attr(str_remove_wishlist, '')
          .find('.sr4-text-pr')
          .html(remove_wishlist);
        $this.find('.sr4-svg-pr-icon').html(wis_icon_remove);
      }

      // Update data count
      // console.log(countWishlist, window.countWishlistPage)
      $(dt_count_wishlist).html(countWishlist || window.countWishlistPage);
    }

    function updateItem(dt_id, $that) {
      // Update all link has id
      // $('.sr4-tooltip.is--show .sr4-tooltip-inner').html(added_text);
      var $this = $(dt_add_wishlist + '[data-id="' + dt_id + '"]:not(.' + is_added + ')');
      $this.addClass(is_added).removeClass(sr4_pe_none).find('.sr4-text-pr').text(added_text);
      //console.log(wis_icon_added);
      $this.find('.sr4-svg-pr-icon').html(wis_icon_added);
      if ($that) $this.trigger('updateTooltip');
    }

    function init() {
      if ((!isStorageSpdLocalAll && isWishlistLocal) || notWishlist) return;

      replaceStateURL();
      linkWishlistInt();
      clickAdded();

      addAction();
      removeAction();
    }

    return {
      init: init,
      updateAll: updateAll,
    };
  })();

  /**
   * PlatFormMail
   *
   * https://sr4-dev-theme.myshopify.com/?customer_posted=true#sr4-form-popups
   * https://sr4-dev-theme.myshopify.com/?contact%5Btags%5D=newsletter&form_type=customer ( chua update )
   */
  //let isSubmitFormNewsletter = (location.search.indexOf('customer_posted=true') > -1 && location.hash == '#sr4-form-popups' && (platform_email == '1' || platform_email =='2'));
  let isSubmitFormNewsletter =
    location.search.indexOf('customer_posted=true') > -1 ||
    location.search.indexOf('newsletter&form_type=customer') > -1;

  sr4ThemeSP.PopupPro = (function () {
    var mfp_close = sr4strings.mfp_close,
      mfp_loading = sr4strings.mfp_loading,
      themeName = sr4configs.theme,
      opendPopup = 'open.popup',
      closePopup = 'close.popup',
      classLoaded = 'is--loaded',
      age = {
        click: 'click.age',
        popup: '#sr4-popup__age',
        CookiesName: `${themeName}_age_verify`,
      },
      exit = {
        mouseleave: 'mouseleave.exit',
        click: 'click.exit',
        popup: '#sr4-popup__exit',
        CookiesName: `${themeName}_exit`,
      },
      newsletter = {
        scroll: 'scroll.newsletter',
        click: 'click.newsletter',
        popup: '#sr4-popup__newsletter',
        canvas: '.sr4-newsletter_canvas',
        CookiesName: `${themeName}_newsletter`,
      },
      cookies = {
        popup: '#sr4-popup__cookies-law',
        click: 'click.cookies',
      },
      isShowCookiesAll = true,
      sale = {
        popup: '#sr4-popup__sales-tmp',
        close: '[data-close-sale]',
      };

    /**
     * Age
     */
    function initAgeVerify() {
      age.$popup = $(age.popup);

      if (age.$popup.length == 0) return;

      if ((!IsDesignMode && CookiesT4.get(age.CookiesName) == 'confirmed') || age.$popup.hasClass(classLoaded)) return;

      age.stts = age.$popup.data('stt');
      age.age_limit = age.stts.age_limit;
      age.date_of_birth = age.stts.date_of_birth;
      age.day_next = age.stts.day_next;

      age.$popup.addClass(classLoaded);

      if (!IsDesignMode) {
        showPopupAge();
      } else {
        age.$popup
          .on(opendPopup, function () {
            if ($.magnificPopupsr4.instance.isOpen) {
              $.magnificPopupsr4.close();

              setTimeout(function () {
                age.$popup.off(opendPopup).off(closePopup);

                age.$popup = $(age.popup);
                showPopupAge();
                age.$popup
                  .on(opendPopup, function () {
                    showPopupAge();
                  })
                  .on(closePopup, function () {
                    $.magnificPopupsr4.close();
                  });
              }, $.magnificPopupsr4.instance.st.removalDelay + 10);
            } else {
              showPopupAge();
            }
          })
          .on(closePopup, function () {
            $.magnificPopupsr4.close();
          });
        // $('#sr4-popup__age').trigger('open.popup')
        // $('#sr4-popup__age').trigger('close.popup')
      }
    }

    function showPopupAge() {
      $.magnificPopupsr4.open({
        items: {
          src: age.popup,
        },
        type: 'inline',
        closeOnBgClick: false,
        closeBtnInside: false,
        showCloseBtn: false,
        enableEscapeKey: false,
        removalDelay: 500,
        tClose: mfp_close,
        callbacks: {
          beforeOpen: function () {
            this.st.mainClass = 'mfp-move-horizontal sr4-age_pp_wrapper';
          },
          open: function () {
            // Will fire when this exact popup is opened
            // this - is Magnific Popup object
            // console.log(age.$popup)
            age.$popup.find('.sr4-age_verify_allowed').on(age.click, function () {
              if (age.date_of_birth) {
                var year = parseInt($('#ageyear').val()),
                  month = parseInt($('#agemonth').val()),
                  day = parseInt($('#ageday').val()),
                  theirDate = new Date(year + age.age_limit, month, day),
                  today = new Date();

                if (today.getTime() - theirDate.getTime() < 0) {
                  age.$popup.addClass('sr4-animated sr4-shake');
                  window.setTimeout(function () {
                    age.$popup.removeClass('sr4-animated sr4-shake');
                  }, 1000);
                } else {
                  CookiesT4.set(age.CookiesName, 'confirmed', { expires: parseInt(age.day_next), path: '/' });
                  $.magnificPopupsr4.close();
                }
              } else {
                CookiesT4.set(age.CookiesName, 'confirmed', { expires: parseInt(age.day_next), path: '/' });
                $.magnificPopupsr4.close();
              }
            });

            age.$popup.find('.sr4-age_verify_forbidden').on(age.click, function () {
              age.$popup.addClass('active_forbidden');
            });
          },
          beforeClose: function () {},
          close: function () {
            age.$popup.find('.sr4-age_verify_allowed, .sr4-age_verify_forbidden').off(age.click);
          },
        },
      });
    }

    /**
     * Exit
     */
    function initExit() {
      exit.$popup = $(exit.popup);

      if (exit.$popup.length == 0) return;

      if ((!IsDesignMode && CookiesT4.get(exit.CookiesName) == 'shown') || exit.$popup.hasClass(classLoaded)) return;

      exit.stts = exit.$popup.data('stt');
      exit.day_next = exit.stts.day_next;

      exit.$popup.addClass(classLoaded);

      if (!IsDesignMode) {
        // Detect exit
        $document.on(exit.mouseleave, function (e) {
          if (e.clientY < 60 && $('.mfp-content').length == 0) {
            //console.log(e);
            showPopupExit();
          }
        });
      } else {
        exit.$popup
          .on(opendPopup, function () {
            if ($.magnificPopupsr4.instance.isOpen) {
              $.magnificPopupsr4.close();

              setTimeout(function () {
                exit.$popup.off(opendPopup).off(closePopup);
                exit.$popup = $(exit.popup);

                showPopupExit();
                exit.$popup
                  .on(opendPopup, function () {
                    showPopupExit();
                  })
                  .on(closePopup, function () {
                    $.magnificPopupsr4.close();
                  });
              }, $.magnificPopupsr4.instance.st.removalDelay + 10);
            } else {
              showPopupExit();
            }
          })
          .on(closePopup, function () {
            $.magnificPopupsr4.close();
          });
        // $('#sr4-popup__exit').trigger('open.popup')
        // $('#sr4-popup__exit').trigger('close.popup')
      }
    }

    function showPopupExit() {
      $.magnificPopupsr4.open({
        items: {
          src: exit.popup,
        },
        type: 'inline',
        // closeOnBgClick: false,
        // closeBtnInside: false,
        // showCloseBtn: false,
        // enableEscapeKey: false,
        removalDelay: 500,
        tClose: mfp_close,
        callbacks: {
          beforeOpen: function () {
            this.st.mainClass = 'mfp-move-horizontal sr4-exit_pp_wrapper';
          },
          open: function () {
            // Will fire when this exact popup is opened
            // this - is Magnific Popup object
            // console.log(age.$popup)
            if ($('.sr4-exit_pp_wrapper .sr4-product').length > 0) sr4ThemeSP.reinitProductGridItem();
            if ($('.sr4-exit_pp_wrapper .flickitysr4').length > 0) {
              var owl = $('.sr4-exit_pp_wrapper .flickitysr4')[0];
              owl.flickitysr4 = new sr4ThemeSP.Carousel(owl);
              //sr4ThemeSP.Flickitysr4.init( $el.find('.flickitysr4') );
            }
            //sr4ThemeSP.reinitProductGridItem();
            $body.trigger('sr4:hideTooltip');
            $body.trigger('currency:update');
          },
          beforeClose: function () {},
          close: function () {
            $document.off(exit.mouseleave);
            CookiesT4.set(exit.CookiesName, 'shown', { expires: exit.day_next, path: '/' });
          },
        },
      });
    }

    /**
     * Newsletter
     */
    function initNewsletter() {
      newsletter.$content = $(newsletter.popup).length > 0 ? $(newsletter.popup) : $(newsletter.canvas);
      var CookiesPages = `${themeName}_shown_pages`,
        pages = CookiesT4.get(CookiesPages),
        conent_type = $(newsletter.popup).length > 0 ? 1 : 2;

      if (!pages) pages = 0;
      if (newsletter.$content.length == 0) {
        pages++;
        CookiesT4.set(CookiesPages, pages, { expires: 194, path: '/' });
        return;
      }
      newsletter.stts = newsletter.$content.data('stt');
      newsletter.pp_version = newsletter.stts.pp_version;
      newsletter.CookiesName = newsletter.CookiesName + newsletter.pp_version;
      if (
        (!IsDesignMode && CookiesT4.get(newsletter.CookiesName) == 'shown') ||
        (!newsletter.stts.isMobile && $window.width() < 768) ||
        newsletter.$content.hasClass(classLoaded)
      )
        return;
      var num_ver2 = newsletter.pp_version == '1' ? '2' : '1',
        txt_ver2 = `${themeName}_newsletter${num_ver2}`;
      if (CookiesT4.get(txt_ver2) == 'shown') CookiesT4.remove(txt_ver2);
      newsletter.$content.addClass(classLoaded);
      newsletter.day_next = newsletter.stts.day_next;
      newsletter.scroll_delay = newsletter.stts.scroll_delay;
      newsletter.after = newsletter.stts.after;
      // Check subscribe success with mail default shopify
      if (isSubmitFormNewsletter) {
        let $successLength = newsletter.$content.find('.sr4-newsletter__success').length,
          $errorLength = newsletter.$content.find('.sr4-newsletter__error').length;
        if ($successLength > 0 || $errorLength > 0) {
          // chec newsletter success
          if ($successLength > 0)
            CookiesT4.set(newsletter.CookiesName, 'shown', { expires: newsletter.day_next, path: '/' });
          // update var
          newsletter.after = 'auto';
          newsletter.stts.time_delay = 500;
        }
      }

      if (IsDesignMode) {
        if (conent_type === 1) {
          newsletter.$content
            .on(opendPopup, function () {
              if ($.magnificPopupsr4.instance.isOpen) {
                $.magnificPopupsr4.close();
                setTimeout(function () {
                  newsletter.$content.off(opendPopup).off(closePopup);
                  newsletter.$content = $(newsletter.popup);
                  showNewsletter(conent_type);
                  newsletter.$content
                    .on(opendPopup, function () {
                      showNewsletter(conent_type);
                    })
                    .on(closePopup, function () {
                      $.magnificPopupsr4.close();
                    });
                }, $.magnificPopupsr4.instance.st.removalDelay + 10);
              } else {
                showNewsletter(conent_type);
              }
            })
            .on(closePopup, function () {
              $.magnificPopupsr4.close();
            });
        } else {
          newsletter.$content.on('shopify:block:select', function (e) {
            showNewsletter(conent_type);
          });
          newsletter.$content.on('shopify:block:deselect', function (e) {
            showNewsletter(conent_type, 'close');
          });
        }
        return;
      }

      var number_pages = newsletter.stts.number_pages;

      // if (!pages) pages = 0;

      // console.log(pages);
      // console.log(stt.number_pages);
      if (pages < number_pages) {
        pages++;
        CookiesT4.set(CookiesPages, pages, { expires: 194, path: '/' });
        return false;
      } else {
        CookiesT4.set(CookiesPages, number_pages, { expires: 194, path: '/' });
      }

      if (newsletter.after == 'scroll') {
        $window.on(newsletter.scroll, function () {
          if ($document.scrollTop() < newsletter.scroll_delay) return;
          showNewsletter(conent_type);
          $window.off(newsletter.scroll);
        });
      } else {
        setTimeout(function () {
          showNewsletter(conent_type);
        }, newsletter.stts.time_delay);
      }
      $(document)
        .on('click', '[data-triger-newsletter]', function (e) {
          e.preventDefault();
          showNewsletter(conent_type);
        })
        .on('click', '[data-sr4-dismiss]', function (e) {
          e.preventDefault();
          showNewsletter(conent_type, 'close');
        });
      $body.on('mail.subscribe.success', function (e) {
        showNewsletter(conent_type);
        CookiesT4.set(newsletter.CookiesName, 'shown', { expires: newsletter.day_next, path: '/' });
      });
    }

    function showNewsletter(conent_type, action) {
      if (conent_type === 1) {
        $.magnificPopupsr4.open({
          items: {
            src: newsletter.popup,
          },
          type: 'inline',
          // closeOnBgClick: false,
          // closeBtnInside: false,
          // showCloseBtn: false,
          // enableEscapeKey: false,
          removalDelay: 500,
          tClose: mfp_close,
          callbacks: {
            beforeOpen: function () {
              this.st.mainClass = 'mfp-move-horizontal sr4-newsletter_pp_wrapper';
            },
            open: function () {
              // Will fire when this exact popup is opened
              // this - is Magnific Popup object

              $body.on('mail.subscribe.success', function (e) {
                CookiesT4.set(newsletter.CookiesName, 'shown', { expires: newsletter.day_next, path: '/' });
              });

              // Check subscribe success with mail default shopify, fake not right 100%
              // if (platform_email == '1' || platform_email == '2') {
              //    $( '.sr4-newsletter_pp_wrapper .sr4-newsletter__form' ).submit(function(e) {
              //       CookiesT4.set(newsletter.CookiesName, 'shown', { expires: newsletter.day_next, path: '/' });
              //    });
              // }
            },
            beforeClose: function () {
              if ($('[data-checked-newsletter]:checked').length > 0 || !$('[data-checked-newsletter]')[0]) {
                CookiesT4.set(newsletter.CookiesName, 'shown', { expires: newsletter.day_next, path: '/' });
              }
            },
            close: function () {
              // CookiesT4.set(newsletter.CookiesName, 'shown', { expires: newsletter.day_next, path: '/' });
            },
          },
        });
      } else {
        if (!action) {
          newsletter.$content.addClass('on--show');
          setTimeout(() => {
            newsletter.$content.removeClass('on--show').addClass('on--shown');
          }, 100);
        } else {
          newsletter.$content.addClass('on--show').removeClass('on--shown');
          setTimeout(() => {
            newsletter.$content.removeClass('on--show');
          }, 500);
          if ($('[data-checked-newsletter]:checked').length > 0 || !$('[data-checked-newsletter]')[0]) {
            CookiesT4.set(newsletter.CookiesName, 'shown', { expires: newsletter.day_next, path: '/' });
          }
        }
      }
    }

    /**
     * Cookies
     * https://help.shopify.com/en/manual/your-account/privacy/cookies
     * https://shopify.dev/themes/trust-security/cookie-banner#create-a-snippet-to-host-the-banner
     * https://help.shopify.com/en/manual/your-account/privacy/privacy-preferences-manager?shpxid=965d0d2a-08E2-4654-4A13-D3F38646AC5D
     * https://shopify.dev/api/consent-tracking
     */
    function handleAccept(e) {
      window.Shopify.customerPrivacy.setTrackingConsent(true, hideCookiesBanner);
      document.addEventListener('trackingConsentAccepted', function () {
        //console.log('trackingConsentAccepted event fired');
        CookiesT4.set(cookies.CookiesName, 'accepted', { expires: cookies.day_next, path: '/' });
      });
      if (isShowCookiesAll) {
        CookiesT4.set(cookies.CookiesName, 'accepted', { expires: cookies.day_next, path: '/' });
      }
    }

    function handleDecline() {
      window.Shopify.customerPrivacy.setTrackingConsent(false, hideCookiesBanner);
    }

    function showCookiesBanner() {
      cookies.$popup.removeClass('on--hide').addClass('on--show');
      cookies.$popup.on(cookies.click, '.sr4-pp_cookies__accept-btn', function (e) {
        e.preventDefault();
        handleAccept(e);
      });
      cookies.$popup.on(cookies.click, '.sr4-pp_cookies__decline-btn', function (e) {
        e.preventDefault();
        handleDecline(e);
      });
    }

    function hideCookiesBanner() {
      cookies.$popup.addClass('on--hide').removeClass('on--show');
    }

    function initCookieBanner() {
      const userCanBeTracked = window.Shopify.customerPrivacy.userCanBeTracked();
      const userTrackingConsent = window.Shopify.customerPrivacy.getTrackingConsent();
      // window.Shopify.customerPrivacy.shouldShowGDPRBanner();

      if ((!userCanBeTracked && userTrackingConsent === 'no_interaction') || IsDesignMode || isShowCookiesAll) {
        if (!IsDesignMode) {
          showCookiesBanner();
        } else {
          cookies.$popup
            .on(opendPopup, function () {
              cookies.$popup = $(cookies.popup);
              showCookiesBanner();
            })
            .on(closePopup, function () {
              hideCookiesBanner();
            });
          // $('#sr4-popup__cookies-law').trigger('open.popup')
          // $('#sr4-popup__cookies-law').trigger('close.popup')
        }
      }
    }

    function loadCookieBanner() {
      cookies.$popup = $(cookies.popup);

      if (cookies.$popup.length == 0) return;

      cookies.stts = cookies.$popup.data('stt');
      cookies.day_next = cookies.stts.day_next || 60;
      cookies.pp_version = cookies.stts.pp_version || 1994;
      cookies.CookiesName = `${themeName}_cookies_${cookies.pp_version}`;

      isShowCookiesAll = cookies.stts.show == '1';

      if (CookiesT4.get(cookies.CookiesName) == 'accepted' || cookies.$popup.hasClass(classLoaded)) return;

      cookies.$popup.addClass(classLoaded);
      window.Shopify.loadFeatures(
        [
          {
            name: 'consent-tracking-api',
            version: '0.1',
          },
        ],
        function (error) {
          if (error) {
            throw error;
          }
          initCookieBanner();
        }
      );
    }

    /**
     * Sales
     * https://codepen.io/thiagorossener/pen/ExjrOeY
     * https://www.w3schools.com/jsref/met_win_settimeout.asp
     * https://github.com/marcelodolza/iziToast/blob/ede716b98a14d65956760adde6c88275b9b1e613/dist/js/iziToast.js#L469
     */
    function initSalesPopup() {
      sale.$popup = $(sale.popup);

      if (sale.$popup.length == 0) return;

      let $salesJson = $('#sr4-popup__sales-JSON');
      sale.stts = JsonParse($salesJson.html());
      $salesJson.remove();

      if ((!sale.stts.isMobile && $window.width() < 768) || sale.$popup.hasClass(classLoaded)) return;

      sale.$popup.addClass(classLoaded);

      sale.temp = sale.$popup.html();
      sale.starTime = sale.stts.starTime * sale.stts.starTimeUnit;
      sale.stayTime = sale.stts.stayTime * sale.stts.stayTimeUnit;
      sale.index = 0;
      sale.limit = sale.stts.limit;
      sale.max = sale.stts.max;
      sale.min = 0;
      sale.classUp = sale.stts.classUp;
      sale.classDown = sale.stts.classDown[sale.classUp];
      sale.ppType = sale.stts.ppType;
      sale.pauseOnHover = sale.stts.pauseOnHover;
      sale.resetOnHover = sale.stts.resetOnHover;

      sale.idArray = sale.stts.idArray;
      sale.titleArray = sale.stts.titleArray;
      sale.urlArray = sale.stts.urlArray;
      sale.locationArray = sale.stts.locationArray;
      sale.timeArray = sale.stts.timeArray;
      sale.imageArray = sale.stts.imageArray;

      sale.max = sale.urlArray.length - 1;
      sale.max2 = sale.locationArray.length - 1;
      sale.max3 = sale.timeArray.length - 1;

      sale.starTimeout;
      sale.stayTimeout;

      //console.log(sale.$popup)

      sale.time = {};

      if (IsDesignMode) {
        //console.log('IsDesignMode')
        sr4ThemeSP.$appendComponent.after(sale.temp);
        sale.$temp = $('.sr4-popup__sales');
        sale.$temp.hide();
        sr4ThemeSP.Tooltip();

        $(sale.close).on('click', function (e) {
          e.preventDefault();
          hideSalesPopUp();
        });

        sale.$popup
          .on(opendPopup, function () {
            sale.$temp.show();
            sale.$temp.addClass(sale.classUp).removeClass(sale.classDown);
          })
          .on(closePopup, function () {
            hideSalesPopUp();
          });
        // $('#sr4-popup__sales').trigger('open.popup')
        // $('#sr4-popup__sales').trigger('close.popup')
      } else {
        sale.$popup.remove();
        unloadSalesPopup();
      }
    }

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function Updatedata(index) {
      // update img
      var img = sale.imageArray[index],
        img_url = sr4ThemeSP.Images.getNewImageUrl(img, 65),
        img_url2 = sr4ThemeSP.Images.getNewImageUrl(img, 130);
      sale.$temp.find('[data-img-sale]').attr('src', img_url).attr('srcset', `${img_url} 1x, ${img_url2} 2x`);

      // update title
      sale.$temp.find('[data-title-sale]').text(sale.titleArray[index]);

      // update link
      sale.$temp.find('[data-href-sale]').attr('href', sale.urlArray[index]);

      // update id quick view
      sale.$temp.find('[data-action-quickview]').attr('data-id', sale.idArray[index]);

      // update location
      sale.$temp.find('[data-location-sale]').text(sale.locationArray[getRandomInt(sale.min, sale.max2)]);

      // update time
      sale.$temp.find('[data-ago-sale]').text(sale.timeArray[getRandomInt(sale.min, sale.max3)]);
      //console.log('Updatedata');
      showSalesPopup();
    }

    function showSalesPopup() {
      // sale.$temp.addClass(sale.classUp).removeClass(sale.classDown);
    }

    function hideSalesPopUp() {
      $body.trigger('sr4:hideTooltip');
      if (sale.$temp) sale.$temp.removeClass(sale.classUp).addClass(sale.classDown).off('mouseenter mouseleave');
    }

    // Load sales popup
    function loadSalesPopup() {
      sr4ThemeSP.$appendComponent.after(sale.temp);
      sr4ThemeSP.Tooltip();
      sale.$temp = $('.sr4-popup__sales');

      //console.log('Timeout loadSalesPopup', sale.stayTime);
      if (sale.ppType == '1') {
        Updatedata(sale.index);
        ++sale.index;
        if (sale.index > sale.max) {
          sale.index = 0;
        }
      } else {
        Updatedata(getRandomInt(sale.min, sale.max));
      }

      // get current time format milliseconds
      sale.time.START = new Date().getTime();
      // current tim milliseconds plus sale.stayTime
      sale.time.END = sale.time.START + sale.stayTime;
      //console.log(sale.time.END, sale.stayTime)

      sale.stayTimeout = setTimeout(function () {
        // console.log('unloadSalesPopup run');
        clearTimeout(sale.stayTimeout);
        unloadSalesPopup();
      }, sale.stayTime);

      sale.$progressbarSpan = $('.sr4-pp-slpr-progressbar>span');

      if (sale.pauseOnHover) {
        sale.$temp
          .on('mouseenter', function (e) {
            // console.log('pause')
            // Save sale.time.REMAINING
            if (sale.resetOnHover) {
              sale.$progressbarSpan.css('animation-name', 'none');
            } else {
              sale.time.REMAINING = sale.time.END - new Date().getTime();
            }
            clearTimeout(sale.stayTimeout);
          })
          .on('mouseleave', function (e) {
            // console.log('resume')
            // Update sale.time.END
            if (sale.resetOnHover) {
              sale.time.REMAINING = sale.stayTime;
              sale.$progressbarSpan.css('animation-name', 'sr4-ani-w');
            } else {
              sale.time.END = new Date().getTime() + sale.time.REMAINING;
            }
            // console.log(sale.time.END, sale.time)

            sale.stayTimeout = setTimeout(function () {
              unloadSalesPopup();
            }, sale.time.REMAINING);
          });
      }

      sale.$temp.find(sale.close).on('click', function (e) {
        e.preventDefault();
        hideSalesPopUp();
        $body.trigger('sr4:hideTooltip');
        //sale.stayTimeout.destroy();
        sale.$temp.off('mouseenter mouseleave');
        clearTimeout(sale.stayTimeout);
        clearTimeout(sale.starTimeout);
      });
    }

    // unLoad sales popup
    function unloadSalesPopup() {
      // console.log('unloadSalesPopup', sale.starTime);
      hideSalesPopUp();
      sale.starTimeout = setTimeout(function () {
        if (sale.$temp) sale.$temp.remove();
        loadSalesPopup();
      }, sale.starTime);
    }

    function init() {
      loadCookieBanner();
      initNewsletter();
      initExit();
      initAgeVerify();
      initSalesPopup();
    }

    return init;
  })();

  sr4ThemeSP.PopupFetch = function () {
    let path = sr4request.path,
      _url = (path != '/' ? path : '') + '/?section_id=popups';

    if (isSubmitFormNewsletter) {
      _url = _url + '&' + location.href.split('/?')[1];
    }
    // console.log(_url)

    // fetch( (_url, {
    //  method: 'GET',
    //  headers: { 'Cache-Control': 'no-cache' }
    // })
    // .then((response) => response.text())
    // .then((section) => {
    //    sr4ThemeSP.$appendComponent.after(section);
    //    sr4ThemeSP.PopupPro();
    //    sr4ThemeSP.PlatFormMail();
    // })
    // .catch((e) => {
    // });
    sr4ThemeSP.getToFetchSection(null, 'text', _url).then((section) => {
      if (section == 'NVT_94') return;
      sr4ThemeSP.$appendComponent.after(section);
      sr4ThemeSP.PopupPro();
      sr4ThemeSP.PlatFormMail();
      sr4ThemeSP.PopupMFP();
    });
  };

  /**
   * PlatFormMail
   *
   * Klaviyo [data-sr4-klaviyo-form] [data-sr4-klaviyo-ajax] [data-sr4-klaviyo-submit]
   * MailChimp [data-sr4-mailChimp-ajax]
   * https://help.klaviyo.com/hc/en-us/articles/115005249588-Add-and-Customize-a-Legacy-Embedded-Signup-Form
   */
  sr4ThemeSP.PlatFormMail = (function () {
    var classes = {
        loading: 'is--loading',
        enabled: 'is--enabled',
        errorCheckbox: 'is--error-checkbox',
        errorEmail: 'is--error-email',
      },
      data = {
        klaviyo: '[data-sr4-klaviyo-submit]',
      },
      event = {
        click: 'click.mail',
        keyup: 'keyup.mail',
      },
      asRund = false,
      dataCheckbox = '[data-agreeMail-checkbox]';

    function initKlaviyo() {
      if (platform_email != '3') return;

      $script('//www.klaviyo.com/media/js/public/klaviyo_subscribe.js', function () {
        $.each($(`[data-sr4-klaviyo-ajax]:not(.${classes.enabled})`), function () {
          var $this = $(this),
            brand = $this.attr('data-brand') || 'Kalles Klaviyo';

          KlaviyoSubscribe.attachToForms('#' + $this.attr('id'), {
            custom_success_message: true,
            extra_properties: { $source: 'Newsletter Popup', Brand: brand },
            success: function ($form) {
              $body.trigger('mail.subscribe.success');
              $form.find(data.klaviyo).removeClass(classes.loading);
            },
          });

          $this.addClass(classes.enabled).submit(function (e) {
            $(this).find(data.klaviyo).addClass(classes.loading);
          });
        });

        // $( `[data-sr4-klaviyo-ajax]:not(.${classes.enabled})` ).submit(function(e) {
        //  var $form = $(this).closest('form'),
        //      $button = $form.find('[type="submit"]');
        //      $button.addClass('loading')
        // });

        $body.on('klaviyo.subscribe.success', function (e) {
          //console.log('klaviyo.subscribe.success')
          $body.trigger('mail.subscribe.success');
        });

        $body.on('klaviyo.subscribe.success klaviyo.subscribe.error', function (e) {
          //console.log('klaviyo.subscribe.success')
          $(e.target).find(data.klaviyo).removeClass(classes.loading);
        });
      });
    }

    function initMailchimp() {
      if (platform_email != '4') return;

      $(`[data-sr4-mailChimp-ajax]:not(.${classes.enabled})`)
        .addClass(classes.enabled)
        .submit(function (e) {
          e.preventDefault();

          var $form = $(this),
            $result = $form.find('[data-new-response-form]'),
            $button = $form.find('[data-sr4-mailChimp-submit]'),
            $success = $result.find('[data-new-response-success]'),
            $error = $result.find('[data-new-response-error]');

          $button.addClass(classes.loading);

          $.ajax({
            type: 'GET',
            url: $form.attr('action'),
            data: $form.serialize(),
            cache: false,
            dataType: 'jsonp',
            jsonp: 'c',
            contentType: 'application/json; charset=utf-8',
            error: function (err) {
              $button.removeClass(classes.loading);
              try {
                var messenger = err.replace('0 - ', '').replace('1 - ', '').replace('2 - ', '');
                $error.html(messenger).slideDown(100);
              } catch (err) {}
            },
            success: function (data) {
              $button.removeClass(classes.loading);
              try {
                var messenger = data.msg.replace('0 - ', '').replace('1 - ', '').replace('2 - ', '');
                if (data.result != 'success') {
                  $success.slideUp(100);
                  $error.html(messenger).slideDown(100);
                } else {
                  $body.trigger('mail.subscribe.success');
                  $error.slideUp(100);
                  $success.slideDown(100);
                }
              } catch (err) {}
            },
          });
        });
    }

    function initAgreeMail() {
      if ($(dataCheckbox).length == 0) return;

      $('[data-agreeMail-btn]')
        .off(event.click)
        .on(event.click, function (e) {
          var $form = $(this).closest('form');

          if ($form.find(`[type="checkbox"]${dataCheckbox}`).is(':checked')) {
            //$form.submit();
          } else {
            e.preventDefault();
            e.stopPropagation();
            // console.log('click checkbox agree')
            $form.addClass(classes.errorCheckbox);
            if ($form.find('[type="email"]').val().length < 1) {
              $form.addClass(classes.errorEmail);
            }
          }
        });

      $(dataCheckbox)
        .off(event.click)
        .on(event.click, function (e) {
          if ($(this).is(':checked')) $(this).closest('form').removeClass(classes.errorCheckbox);
        });

      $('[data-form-mail-agree] [type="email"]')
        .off(event.keyup)
        .on(event.keyup, function (e) {
          //e.preventDefault();e.stopPropagation();
          var $form = $(this).closest('form');
          if ($(this).val().length < 1) {
            $form.addClass(classes.errorEmail);
          } else {
            $form.removeClass(classes.errorEmail);
          }
        });
    }

    // '?contact%5Btags%5D=newsletter&form_type=customer'
    function initcustomerExist() {
      if (location.search != '?contact%5Btags%5D=newsletter&form_type=customer') return;
      $('[data-new-response-form]')
        .html(`<div class="sr4-newsletter__error">${sr4strings.error_exist}</div>`)
        .slideDown(100);
    }

    function init() {
      initMailchimp();
      initKlaviyo();
      initAgreeMail();
      initcustomerExist();
    }

    return init;
  })();

  /**
   * GroupsProduct
   */
  var GroupsProduct = (function () {
    var dataGroupsCheckbox = '[data-groups-pr-ck]',
      dataGroupsSelect = '[data-groups-pr-sl]',
      dataGroupsInput = '[data-groups-pr-ip]',
      dataTotalPrice = '[data-groups-total-price]',
      dataGroupsItem = '[data-groups-pr-item]',
      dataGroupsItemPrice = '[data-groups-item-price]',
      dataQuantityValue = '[data-groups-qty-value]',
      events = {
        change: 'change.groups',
      },
      classes = {
        checked: 'is--checked',
      };

    function groupsProduct(_this44) {
      this.$form = $(_this44);
      this.$totalPrice = this.$form.find(dataTotalPrice);
      this.ArrayPrice = [];
      this.ArrayComparePrice = [];

      let self = this;

      this.$form.find(dataGroupsItem).each(function (index) {
        self._updateItemPrice(this, index);
      });

      self._updateTotalPrice();

      self._eventListeners();
    }

    groupsProduct.prototype = Object.assign({}, groupsProduct.prototype, {
      _eventListeners: function () {
        let self = this;

        // Change select
        this.$form.on(events.change, `select${dataGroupsSelect}`, function () {
          self._updateItem(this);
        });

        // Checkbox
        this.$form.on(events.change, dataGroupsCheckbox, function () {
          let $groupsItem = $(this).closest(dataGroupsItem),
            index = $groupsItem.index(),
            $image = self.$form.find(`[data-groups-img="${index}"]`),
            $nameItem = $groupsItem.find('[name*="items[]"]');

          // console.log($groupsItem)
          if (this.checked) {
            $groupsItem.addClass(classes.checked);
            self._updateItemPrice($groupsItem, index);
            $image.fadeIn(300);
            $nameItem.prop('disabled', false);
          } else {
            $groupsItem.removeClass(classes.checked);
            self.ArrayPrice[index] = 0;
            self.ArrayComparePrice[index] = 0;
            $image.fadeOut(300);
            $nameItem.prop('disabled', true);
          }
          self._updateTotalPrice();
        });

        // change quantity
        this.$form.on(events.change, dataQuantityValue, function () {
          // console.log(this);
          let $groupsItem = $(this).closest(dataGroupsItem),
            index = $groupsItem.index();

          self._updateItemPrice($groupsItem[0], index);
          self._updateTotalPrice();
        });
      },

      _updateItemPrice: function (item, index) {
        let $item = $(item),
          $price = $item.find(dataGroupsSelect),
          qty = parseInt($item.find(dataQuantityValue).val()),
          price = parseInt($price.attr('data-price')),
          comparePrice = parseInt($price.attr('data-cpprice'));

        price = price * qty;
        comparePrice = comparePrice * qty;

        // console.log(price, comparePrice);
        this.ArrayPrice[index] = price;
        this.ArrayComparePrice[index] = comparePrice > price ? comparePrice : price;
      },

      _updateItem: function (_this) {
        let $select = $(_this),
          $optionSelected = $select.find(':selected'),
          $item = $select.closest(dataGroupsItem),
          // index           = $item.data('index') ?? $item.index(),
          index1 = $item.data('index'),
          index = typeof index1 == 'undefined' ? $item.index() : index1,
          image_url = $optionSelected.data('img'),
          maxQty = $optionSelected.data('max'),
          $qty = $item.find(dataQuantityValue),
          qtyValue = $qty.val(),
          $image = this.$form.find(`[data-groups-img="${index}"] img`),
          price = parseInt($optionSelected.data('price')),
          comparePrice = parseInt($optionSelected.data('cpprice')),
          $price = $item.find(dataGroupsItemPrice);
        // console.log($optionSelected);

        // Quantity
        $qty.attr('max', maxQty);

        // image
        // console.log($image)
        if ($image.attr('data-orginal') != image_url) {
          $image
            .attr({
              'data-src': image_url,
              'data-orginal': image_url,
            })
            .removeClass('lazyloadsr4ed')
            .addClass('lazyloadsr4');
        }

        // price
        comparePrice = comparePrice > price ? comparePrice : price;
        let price_ = qtyValue == 0 ? price : qtyValue * price;
        let comparePrice_ = qtyValue == 0 ? comparePrice : qtyValue * comparePrice;
        price = qtyValue * price;
        comparePrice = qtyValue * comparePrice;

        if (comparePrice_ > price_) {
          $price.html(
            '<del>' +
              sr4ThemeSP.Currency.formatMoney(comparePrice_) +
              '</del> <ins>' +
              sr4ThemeSP.Currency.formatMoney(price_) +
              '</ins>'
          );
        } else {
          $price.html(sr4ThemeSP.Currency.formatMoney(price_));
        }
        $select.attr({
          'data-price': price_,
          'data-cpprice': comparePrice_,
        });
        if (this.ArrayPrice[index] == price && this.ArrayComparePrice[index] == comparePrice) return;
        this.ArrayPrice[index] = price;
        this.ArrayComparePrice[index] = comparePrice;
        this._updateTotalPrice();
      },

      _updateTotalPrice: function () {
        // https://stackoverflow.com/questions/1230233/how-to-find-the-sum-of-an-array-of-numbers
        // console.log(this.ArrayPrice)
        let price = this.ArrayPrice.reduce((a, b) => a + b, 0),
          comparePrice = this.ArrayComparePrice.reduce((a, b) => a + b, 0);

        // console.log(price, comparePrice);

        if (comparePrice > price) {
          this.$totalPrice.html(
            '<del>' +
              sr4ThemeSP.Currency.formatMoney(comparePrice) +
              '</del> <ins>' +
              sr4ThemeSP.Currency.formatMoney(price) +
              '</ins>'
          );
        } else {
          this.$totalPrice.html(sr4ThemeSP.Currency.formatMoney(price));
        }
        $body.trigger('currency:update');
      },
    });

    return groupsProduct;
  })();

  sr4ThemeSP.initGroupsProduct = function () {
    var dataGroupsFrm = '[data-groups-pr-form]:not(.is--enabled)',
      classEnabled = 'is--enabled';

    if ($(dataGroupsFrm).length == 0) return;

    $(dataGroupsFrm).each(function (index) {
      //this.test = 19;
      $(this).addClass(classEnabled);
      new GroupsProduct(this);
    });
  };

  /**
   * data-go-id="[data-abc]"
   * data-go-id="#aaaa"
   * data-go-id href="#"
   * data-go-id href="[data-abc]"
   */
  sr4ThemeSP.goToID = (function () {
    var dataGo = '[data-go-id]',
      $htmlBody = $('html,body'),
      $dataGo,
      myTimeout,
      timeout = 0;

    function init() {
      $dataGo = $(dataGo);

      if ($dataGo.length == 0) return;

      $dataGo.click(function (e) {
        e.preventDefault();
        e.stopPropagation();

        let $this = $(this),
          id = $this.data('go-id') || $this.attr('href'),
          $id = $(id),
          offset = $this.data('offset') || 100;

        // console.log($id, id, $this,  $this.attr('href') )
        if ($id.length == 0) return;

        if ($id.is(':hidden')) {
          $(`[data-sr4-tab-item][href="${id}"]:visible`).trigger('click');
          timeout = 100;
        }

        clearTimeout(myTimeout);
        myTimeout = setTimeout(function () {
          // $htmlBody.animate({
          //    scrollTop: $id.offset().top - offset,
          //    duration: 400
          // });
          window.scrollTo({ behavior: 'smooth', top: $id.offset().top - offset });
        }, timeout);
      });
    }

    return init;
  })();

  /**
   * https://github.com/benevolenttech/jquery.confetti.js
   * CanvasConfetti
   * sr4ThemeSP.CanvasConfetti()
   */
  sr4ThemeSP.CanvasConfetti = (function () {
    var canvas,
      ctx,
      W,
      H,
      mp = window.innerWidth < 988 ? 75 : 150, //max particles
      particles = [],
      angle = 0,
      tiltAngle = 0,
      confettiActive = true,
      animationComplete = true,
      deactivationTimerHandler,
      reactivationTimerHandler,
      animationHandler,
      ck_canvas = false,
      isSetGlobals = false;

    // objects

    var particleColors = {
      colorOptions: [
        'DodgerBlue',
        'OliveDrab',
        'Gold',
        'pink',
        'SlateBlue',
        'lightblue',
        'Violet',
        'PaleGreen',
        'SteelBlue',
        'SandyBrown',
        'Chocolate',
        'Crimson',
      ],
      colorIndex: 0,
      colorIncrementer: 0,
      colorThreshold: 10,
      getColor: function () {
        if (this.colorIncrementer >= 10) {
          this.colorIncrementer = 0;
          this.colorIndex++;
          if (this.colorIndex >= this.colorOptions.length) {
            this.colorIndex = 0;
          }
        }
        this.colorIncrementer++;
        return this.colorOptions[this.colorIndex];
      },
    };

    function confettiParticle(color) {
      this.x = Math.random() * W; // x-coordinate
      this.y = Math.random() * H - H; //y-coordinate
      this.r = RandomFromTo(10, 30); //radius;
      this.d = Math.random() * mp + 10; //density;
      this.color = color;
      this.tilt = Math.floor(Math.random() * 10) - 10;
      this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
      this.tiltAngle = 0;

      this.draw = function () {
        ctx.beginPath();
        ctx.lineWidth = this.r / 2;
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.x + this.tilt + this.r / 4, this.y);
        ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 4);
        return ctx.stroke();
      };
    }

    function init() {
      if (isSetGlobals) {
        RestartConfetti();
        setTimeout(function () {
          DeactivateConfetti();
        }, 3500);
        return;
      }

      SetGlobals();
      //InitializeButton();
      //InitializeConfetti();

      $window.resize(function () {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
      });
      isSetGlobals = true;
    }

    // function InitializeButton() {
    //     //$('#startConfetti').click(InitializeConfetti);
    //     //$('#stopConfetti').click(DeactivateConfetti);
    //     //$('#restartConfetti').click(RestartConfetti);
    // }

    function SetGlobals() {
      sr4ThemeSP.$appendComponent.after(
        '<canvas id="confettiCanvas" style="position:fixed;top:0;left:0;display:none;z-index:9999;pointer-events: none;"></canvas>'
      );
      canvas = document.getElementById('confettiCanvas');
      ctx = canvas.getContext('2d');
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    }

    function InitializeConfetti() {
      canvas.style.display = 'block';
      particles = [];
      animationComplete = false;
      for (var i = 0; i < mp; i++) {
        var particleColor = particleColors.getColor();
        particles.push(new confettiParticle(particleColor));
      }
      StartConfetti();
    }

    function Draw() {
      ctx.clearRect(0, 0, W, H);
      var results = [];
      for (var i = 0; i < mp; i++) {
        (function (j) {
          results.push(particles[j].draw());
        })(i);
      }
      Update();

      return results;
    }

    function RandomFromTo(from, to) {
      return Math.floor(Math.random() * (to - from + 1) + from);
    }

    function Update() {
      var remainingFlakes = 0;
      var particle;
      angle += 0.01;
      tiltAngle += 0.1;

      for (var i = 0; i < mp; i++) {
        particle = particles[i];
        if (animationComplete) return;

        if (!confettiActive && particle.y < -15) {
          particle.y = H + 100;
          continue;
        }

        stepParticle(particle, i);

        if (particle.y <= H) {
          remainingFlakes++;
        }
        CheckForReposition(particle, i);
      }

      if (remainingFlakes === 0) {
        StopConfetti();
      }
    }

    function CheckForReposition(particle, index) {
      if ((particle.x > W + 20 || particle.x < -20 || particle.y > H) && confettiActive) {
        if (index % 5 > 0 || index % 2 == 0) {
          //66.67% of the flakes
          repositionParticle(particle, Math.random() * W, -10, Math.floor(Math.random() * 10) - 10);
        } else {
          if (Math.sin(angle) > 0) {
            //Enter from the left
            repositionParticle(particle, -5, Math.random() * H, Math.floor(Math.random() * 10) - 10);
          } else {
            //Enter from the right
            repositionParticle(particle, W + 5, Math.random() * H, Math.floor(Math.random() * 10) - 10);
          }
        }
      }
    }
    function stepParticle(particle, particleIndex) {
      particle.tiltAngle += particle.tiltAngleIncremental;
      particle.y += (Math.cos(angle + particle.d) + 3 + particle.r / 2) / 2;
      particle.x += Math.sin(angle);
      particle.tilt = Math.sin(particle.tiltAngle - particleIndex / 3) * 15;
    }

    function repositionParticle(particle, xCoordinate, yCoordinate, tilt) {
      particle.x = xCoordinate;
      particle.y = yCoordinate;
      particle.tilt = tilt;
    }

    function StartConfetti() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      (function animloop() {
        if (animationComplete) return null;
        animationHandler = requestAnimFrameT4(animloop);
        return Draw();
      })();
    }

    function ClearTimers() {
      clearTimeout(reactivationTimerHandler);
      clearTimeout(animationHandler);
    }

    function DeactivateConfetti() {
      confettiActive = false;
      ClearTimers();
    }

    function StopConfetti() {
      animationComplete = true;
      if (ctx == undefined) return;
      ctx.clearRect(0, 0, W, H);
      canvas.style.display = 'none';
    }

    function RestartConfetti() {
      ClearTimers();
      StopConfetti();
      reactivationTimerHandler = setTimeout(function () {
        confettiActive = true;
        animationComplete = false;
        InitializeConfetti();
      }, 100);
    }

    window.requestAnimFrameT4 = (function () {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
          return window.setTimeout(callback, 1000 / 60);
        }
      );
    })();

    // return {
    //   init: init,
    //   start: InitializeConfetti,
    //   stop: DeactivateConfetti,
    //   restart: RestartConfetti
    // };

    return init;
  })();

  /**
   * Toggle class
   * sr4ThemeSP.ToggleClass()
   */
  sr4ThemeSP.ToggleClass = (function () {
    $(document).on('click', '[data-toggle-class]', function (e) {
      var _class = $(this).attr('data-toggle-class');
      $(this).toggleClass(_class);
    });
  })();
})(jQuery_T4NT);

jQuery_T4NT(document).ready(function () {
  sr4ThemeSP.Hover();

  //sr4ThemeSP.Drawer.init();

  sr4ThemeSP.Header.stickyInit();
  sr4ThemeSP.MobileNav();
  sr4ThemeSP.Cart.init();
  sr4ThemeSP.agreeForm();
  sr4ThemeSP.Login();

  sr4ThemeSP.Compare.init();
  sr4ThemeSP.Wishlist.init();

  sr4ThemeSP.recentlyViewed();
  sr4ThemeSP.productRecommendations();

  sr4ThemeSP.ProductItem.init();
  sr4ThemeSP.ProductItem.loadjsRevew();
  sr4ThemeSP.Tooltip();
  sr4ThemeSP.ProductItem.clickMoreSwatches();
  sr4ThemeSP.ProductItem.swatchesClickHover();
  sr4ThemeSP.ProductItem.resizeObserver();
  sr4ThemeSP.ProductItem.initQuickVS();
  //sr4ThemeSP.ProductItem.initAddToCart();

  sr4ThemeSP.RenderRefresh();

  sr4ThemeSP.ProductAjax.init();
  sr4ThemeSP._initBundlePrs();

  sr4ThemeSP.sr4QuantityAdjust();
  sr4ThemeSP.PhotoSwipe.gallery();
  sr4ThemeSP.PhotoSwipe.images();
  sr4ThemeSP.PhotoSwipe.image();
  sr4ThemeSP.Video.initPoster();

  // sr4ThemeSP.NTjax.init();
  // sr4ThemeSP.loadMore();
  sr4ThemeSP.initLoadMore();
  if (jQuery_T4NT('.sr4-section-main [data-ntajax-container]').length > 0 || IsDesignMode)
    $script(sr4configs.script7, 'sr4:facets');

  // sr4ThemeSP.clickOnScrollButton();

  sr4ThemeSP.instagram();

  sr4ThemeSP.sideBarInit();

  sr4ThemeSP.LookBook();

  sr4ThemeSP.initGroupsProduct();

  if (IsDesignMode) {
    sr4ThemeSP.PopupPro();
  } else {
    setTimeout(function () {
      sr4ThemeSP.PopupFetch();
      //sr4ThemeSP.Notices();
    }, 686);
  }

  setTimeout(function () {
    sr4ThemeSP.PlatFormMail();
    sr4ThemeSP.goToID();
  }, 500);

  // $script
  //$script(['foo.js', 'bar.js'], 'sr4:thumb');

  // console.log(windowWidth)
  // if ( windowWidth >= 1024 && ( jQuery_T4NT('.sr4-product-media__thumbnails_left').length > 0 || jQuery_T4NT('.sr4-product-media__thumbnails_right').length > 0 ) ) {
  //  $script(sr4configs.script4, 'sr4:thumbLR');
  // }
  //sr4ThemeSP.ProductZoom();
  if (sr4ThemeSP.isHover && jQuery_T4NT('[data-zoom-options]').length > 0) $script(sr4configs.script5, 'sr4:zoom');
  document.addEventListener('theme:hover', function (evt) {
    if (jQuery_T4NT('[data-zoom-options]').length > 0) $script(sr4configs.script5, 'sr4:zoom');
  });

  //sr4ThemeSP.CircleChart.init();
  sr4ThemeSP.BackToTop();

  // Header Lazyload Megamenu
  sr4ThemeSP.Header.init();
  sr4ThemeSP.currencyForm();

  if (sr4configs.currency_type == '2') $script(sr4configs.script12a);
  if (sr4configs.script11 != 'none') $script(sr4configs.script11, 'sr4:customjs');

  // executes when HTML-Document is loaded and DOM is ready
  //sr4ThemeSP.showPageTransition = true;
  //if (sr4ThemeSP.showPageTransition) new sr4ThemeSP.PageTransition();
});

// jQuery_T4NT(window).on('load', function () {
//    // executes when complete page is fully loaded, including all frames, objects and images
//    // Header Lazyload Megamenu
//    sr4ThemeSP.Header.LazyloadMega();
// });

jQuery_T4NT(window).resize(function () {
  sr4ThemeSP.ProductItem.recalculateSwatches(true);
  // windowWidth = jQuery_T4NT(window).width;
  // if( windowWidth ) {

  // }
});
