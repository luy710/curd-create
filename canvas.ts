// const Vc = _t({
//   __name: 'Plum',
//   setup(e) {
//     const t = Math.PI,
//       n = Math.PI / 2,
//       r = Math.PI / 12,
//       o = '#88888825',
//       s = Ae(null),
//       { random: i } = Math,
//       l = Ut(Nc()),
//       a = Ae(() => {}),
//       u = Ae(4),
//       c = Ae(6),
//       d = Ae(!1)
//     function h(w, b = 400, m = 400, v) {
//       const O = w.getContext('2d'),
//         C = window.devicePixelRatio || 1,
//         F =
//           O.webkitBackingStorePixelRatio ||
//           O.mozBackingStorePixelRatio ||
//           O.msBackingStorePixelRatio ||
//           O.oBackingStorePixelRatio ||
//           O.backingStorePixelRatio ||
//           1,
//         R = v || C / F
//       return (
//         (w.style.width = `${b}px`),
//         (w.style.height = `${m}px`),
//         (w.width = R * b),
//         (w.height = R * m),
//         O.scale(R, R),
//         {
//           ctx: O,
//           dpi: R
//         }
//       )
//     }
//     function y(w = 0, b = 0, m = 0, v = 0) {
//       const O = m * Math.cos(v),
//         C = m * Math.sin(v)
//       return [w + O, b + C]
//     }
//     mn(async () => {
//       const w = s.value,
//         { ctx: b } = h(w, l.width, l.height),
//         { width: m, height: v } = w
//       let O = [],
//         C = [],
//         F = 0
//       const R = (ie, we, H) => {
//         const S = i() * c.value,
//           [M, D] = y(ie, we, S, H)
//         b.beginPath(), b.moveTo(ie, we), b.lineTo(M, D), b.stroke()
//         const A = H + i() * r,
//           N = H - i() * r
//         M < -100 ||
//           M > l.width + 100 ||
//           D < -100 ||
//           D > l.height + 100 ||
//           ((F <= u.value || i() > 0.5) && O.push(() => R(M, D, A)),
//           (F <= u.value || i() > 0.5) && O.push(() => R(M, D, N)))
//       }
//       let Y = performance.now()
//       const U = 1e3 / 40
//       let G
//       ;(G = Lc(
//         () => {
//           performance.now() - Y < U ||
//             ((F += 1),
//             (C = O),
//             (O = []),
//             (Y = performance.now()),
//             C.length || (G.pause(), (d.value = !0)),
//             C.forEach((ie) => ie()))
//         },
//         {
//           immediate: !1
//         }
//       )),
//         (a.value = () => {
//           G.pause(),
//             (F = 0),
//             b.clearRect(0, 0, m, v),
//             (b.lineWidth = 1),
//             (b.strokeStyle = o),
//             (C = []),
//             (O = [
//               () => R(i() * l.width, 0, n),
//               () => R(i() * l.width, l.height, -n),
//               () => R(0, i() * l.height, 0),
//               () => R(l.width, i() * l.height, t)
//             ]),
//             l.width < 500 && (O = O.slice(0, 2)),
//             G.resume(),
//             (d.value = !1)
//         }),
//         a.value()
//     })
//     const _ = xe(() => 'radial-gradient(circle, transparent, black);')
//     return (w, b) => (
//       Se(),
//       ke(
//         'div',
//         {
//           class: 'fixed top-0 bottom-0 left-0 right-0 pointer-events-none',
//           style: pn([
//             {
//               'z-index': '-1'
//             },
//             `mask-image: ${Ee(_)};--webkit-mask-image: ${Ee(_)};`
//           ])
//         },
//         [
//           j(
//             'canvas',
//             {
//               ref_key: 'el',
//               ref: s,
//               width: '400',
//               height: '400'
//             },
//             null,
//             512
//           )
//         ],
//         4
//       )
//     )
//   }
// })
