// export function hex_sha1(e) {
//     function n(e, t, n, i) {
//         return e < 20 ? (t & n) | (~t & i) : e < 40 ? t ^ n ^ i : e < 60 ? (t & n) | (t & i) | (n & i) : t ^ n ^ i;
//     }

//     function i(e) {
//         return e < 20 ? 1518500249 : e < 40 ? 1859775393 : e < 60 ? -1894007588 : -899497514;
//     }

//     function o(e, t) {
//         var n = (65535 & e) + (65535 & t);
//         return (((e >> 16) + (t >> 16) + (n >> 16)) << 16) | (65535 & n);
//     }

//     function r(e, t) {
//         return (e << t) | (e >>> (32 - t));
//     }

//     function a(e) {
//         var t = "0123456789abcdef";
//         var n = "";
//         for (var i2 = 0; i2 < 4 * e.length; i2++) {
//             n += t.charAt((e[i2 >> 2] >> (8 * (3 - (i2 % 4)) + 4)) & 15) + t.charAt((e[i2 >> 2] >> (8 * (3 - (i2 % 4)))) & 15);
//         }
//         return n;
//     }

//     function s(e, t) {
//         e[t >> 5] |= 128 << (24 - (t % 32));
//         e[15 + (((t + 64) >> 9) << 4)] = t;

//         var a2 = Array(80);
//         var s2 = 1732584193;
//         var l = -271733879;
//         var u = -1732584194;
//         var c = 271733878;
//         var d = -1009589776;

//         for (var f = 0; f < e.length; f += 16) {
//             var h = s2;
//             var m = l;
//             var p = u;
//             var g = c;
//             var v = d;

//             for (var y = 0; y < 80; y++) {
//                 a2[y] = y < 16 ? e[f + y] : r(a2[y - 3] ^ a2[y - 8] ^ a2[y - 14] ^ a2[y - 16], 1);

//                 var k = o(o(r(s2, 5), n(y, l, u, c)), o(o(d, a2[y]), i(y)));

//                 d = c;
//                 c = u;
//                 u = r(l, 30);
//                 l = s2;
//                 s2 = k;
//             }

//             s2 = o(s2, h);
//             l = o(l, m);
//             u = o(u, p);
//             c = o(c, g);
//             d = o(d, v);
//         }

//         return Array(s2, l, u, c, d);
//     }

//     function l(e) {
//         var t = Array();
//         for (var n2 = 0; n2 < 8 * e.length; n2 += 8) {
//             t[n2 >> 5] |= (255 & e.charCodeAt(n2 / 8)) << (24 - (n2 % 32));
//         }
//         return t;
//     }

//     return a(s(l(e), 8 * e.length));
// }
