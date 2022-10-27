// ⚠️注意：本文件内的逻辑请在服务端实现，本Demo只展示用
import axios from 'axios';
import md5 from 'md5';

// 获取 Ticket
// 详细说明见 http://open-boe.douyin.com/platform/doc/JS-guide
const getTicket = async () => {
  const { data } = await axios.post('https://dy-speed-test.yiye.ai/api/v1/qyh/jsticket');
  const { ticket, client_key } = data.data || {};
  return { ticket, client_key };
};

// 计算签名
// 将从服务端获取到的 ticket，随机字串 noncestr，时间戳 timestamp和当前页面url，排序后进行md5加密生成签名
const calcSignature = ({ ticket, nonce_str, timestamp, url }) => {
  const str = `jsapi_ticket=${ticket}&nonce_str=${nonce_str}&timestamp=${timestamp}&url=${url}`;
  const sig = md5(str);
  return sig;
};

// 先获取 Client Token，然后通过 Token 获取 JS Ticket
// 详细说明见 https://open.douyin.com/platform/doc/OpenAPI-oauth2
export const getConfigParams = async ({ timestamp, nonce_str, url }) => {
  const {client_key, ticket} = await getTicket();
  const signature = await calcSignature({ ticket, timestamp, nonce_str, url });
  return { client_key, signature };
};
