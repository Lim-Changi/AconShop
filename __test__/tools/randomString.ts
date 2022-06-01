export const randomString = (length: number, isCurrency = false) => {
  let result = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  if (isCurrency) {
    characters = '$£¤¥€₩₵₡₫₲₦₭₱₪₸৳';
    length = 1;
  }
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
