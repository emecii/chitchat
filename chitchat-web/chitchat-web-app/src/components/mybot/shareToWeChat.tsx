import { useCallback } from 'react';
import NativeShare from 'nativeshare';
import { ENDPOINT } from '../../types/Env';

interface WechatConfig {
  appId: string;
  timestamp: string;
  nonceStr: string;
  signature: string;
}

export async function fetchWechatConfig(
  url: string,
): Promise<WechatConfig | void> {
  try {
    const response = await fetch(
      `${ENDPOINT}/api/wechat-config?url=${encodeURIComponent(url)}`,
    );
    const wechatConfig: WechatConfig = await response.json();
    return wechatConfig;
  } catch (error) {
    console.error('Error fetching WeChat config:', error);
  }
}

export function useShareToWechat(url: string, imgSrc: string, aiName: string) {
  const handleClick = useCallback(async () => {
    const wechatConfig = await fetchWechatConfig(url);
    const nativeShare = new NativeShare({
      wechatConfig,
      syncDescToTag: false,
      syncIconToTag: false,
      syncTitleToTag: false,
    });

    nativeShare.setShareData({
      icon: imgSrc,
      link: url,
      title: '柒洽AI: 最懂你的AI伴侣',
      desc: `快来和我的AI${aiName}聊天吧！`,
      from: '柒洽AI',
    });

    try {
      console.log('name' + aiName);
      console.log('imageSrc' + imgSrc);
      nativeShare.call('wechatTimeline');
    } catch (err) {
      console.error('Native share is not supported:', err);
    }
  }, [url, imgSrc, aiName]);

  return handleClick;
}
