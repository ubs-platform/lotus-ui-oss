export const groupCapabilities = [
  { text: 'Sahip', value: 'OWNER' },
  { text: 'Sadece Görüntüleme', value: 'VIEWER' },
  { text: 'Takım üyelerini ayarlayabilir', value: 'ADJUST_MEMBERS' },
  {
    text: 'Takım üyelerinin rollerini değiştirebilir',
    value: 'ONLY_EDIT_MEMBER_CAPABILITIES',
  },
];

export const entityCapabilities = [
  { text: 'Yok', value: '' },
  { text: 'Okuma/Yazma', value: 'READ_WRITE' },
  { text: 'Yalnızca Okuma', value: 'READ_ONLY' },
];

export const bookRoleOptionsFetcher = () => {
  return [
    { text: 'Sahip', value: 'OWNER' },
    { text: 'Editör', value: 'EDITOR' },
    { text: 'Kullanıcı ayarları görüntüleyebilir', value: 'VIEWER' },
    { text: 'Kullanıcının kütüphanesine ekler', value: 'LIBRARY' },
    { text: 'Kullanıcı abone olmuş gibi görür', value: 'TENANT' },
    { text: 'Erişemez', value: 'NO_ACCESS' },
  ];
};

export const postralRoleOptionsFetcher = () => {
  return [
    { text: 'Yönetici', value: 'ADMIN' },
    { text: 'Düzenleyici', value: 'EDITOR' },
    { text: 'Görüntüleyici', value: 'VIEWER' },
    { text: 'Erişemez', value: 'NO_ACCESS' },
  ];
};