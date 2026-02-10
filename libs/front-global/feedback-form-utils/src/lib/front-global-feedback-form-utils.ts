
// export const registerTypeFeeders = (
//   reform: Reform,
//   search: boolean,
//   typePath = 'type'
// ) => {
//   reform.registerFeeder(
//     new SelectFeeder(typePath, () => {
//       const pre = [
//         { text: 'İçerik bildir', value: 'CONTENT_REPORT' },
//         { text: 'Hata - Bug', value: 'BUG' },
//         { text: 'Öneri', value: 'SUGGESTION' },
//         { text: 'Yasak itirazı', value: 'BAN_APPEAL' },
//         { text: 'Başka bir şey', value: 'UNCATEGORIZED' },
//       ];
//       const searchArr = search ? [{ text: 'Seçilmedi', value: '' }] : [];
//       return Promise.resolve([...searchArr, ...pre]);
//     })
//   );
// };

// export const registerStatusFeeder = (
//   reform: Reform,
//   search: boolean,
//   typePath = 'status'
// ) => {
//   reform.registerFeeder(
//     new SelectFeeder(typePath, () => {
//       const pre = [
//         { text: 'Bekleyen', value: 'WAITING' },
//         { text: 'Çözümlendi', value: 'RESOLVED' },
//       ];
//       const searchArr = search ? [{ text: 'Seçilmedi', value: '' }] : [];
//       return Promise.resolve([...searchArr, ...pre]);
//     })
//   );
// };
