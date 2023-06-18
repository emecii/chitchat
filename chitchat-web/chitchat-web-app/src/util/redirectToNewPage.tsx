import { useNavigate } from 'react-router-dom';
// 定义 redirectToNewPage 函数的类型
export type RedirectToNewPageFn = (url: string) => void;

export const useRedirectToNewPage = () => {
  const navigate = useNavigate();

  const redirectToNewPage = (url: string) => {
    // 在这里实现跳转到对应的页面
    navigate(url);
    // 将页面滚动到顶部，否则会保持在当前位置
    window.scrollTo(0, 0);
  };

  return redirectToNewPage;
};
