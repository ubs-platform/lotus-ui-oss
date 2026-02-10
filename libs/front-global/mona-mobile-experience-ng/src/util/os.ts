export const onIos =
  ['iPad', 'iPhone', 'iPod'].find((a) => navigator.userAgent.includes(a)) !=
    null ||
  // iPad on iOS 13 detection
  (navigator.userAgent.includes('Mac') && 'ontouchend' in document);

// export class OsDetermine {

//   static ios: boolean = false;

//   // android() {
//   //   return navigator.userAgent.includes('Android');
//   // }
// }
