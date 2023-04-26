import { useCallback } from 'react';
import NativeShare from 'nativeshare';
import { ENDPOINT } from '../../types/Env';

interface WechatConfig {
    appId: string;
    timestamp: string;
    nonceStr: string;
    signature: string;
}

export async function fetchWechatConfig(url: string): Promise<WechatConfig | void> {
    try {
        const response = await fetch(`${ENDPOINT}/api/wechat-config?url=${encodeURIComponent(url)}`);
        const wechatConfig: WechatConfig = await response.json();
        return wechatConfig;
    } catch (error) {
        console.error('Error fetching WeChat config:', error);
    }
}

export function useShareToWechat(url: string) {
    const handleClick = useCallback(async () => {
        const wechatConfig = await fetchWechatConfig(url);
        const nativeShare = new NativeShare({
            wechatConfig,
            syncDescToTag: false,
            syncIconToTag: false,
            syncTitleToTag: false,
        });

        nativeShare.setShareData({
            icon: 'https://pic3.zhimg.com/v2-080267af84aa0e97c66d5f12e311c3d6_xl.jpg',
            link: url,
            title: 'NativeShare',
            desc: '分享成功',
            from: '@evan',
        });

        try {
            nativeShare.call('wechatTimeline');
        } catch (err) {
            console.error('Native share is not supported:', err);
        }
    }, [url]);

    return handleClick;
}
