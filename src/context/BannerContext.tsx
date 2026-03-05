import { createContext, useContext, useState, ReactNode } from 'react';

const BannerContext = createContext<{
  bannerVisible: boolean;
  setBannerVisible: (v: boolean) => void;
}>({ bannerVisible: true, setBannerVisible: () => {} });

export const BannerProvider = ({ children }: { children: ReactNode }) => {
  const [bannerVisible, setBannerVisible] = useState(true);
  return (
    <BannerContext.Provider value={{ bannerVisible, setBannerVisible }}>
      {children}
    </BannerContext.Provider>
  );
};

export const useBanner = () => useContext(BannerContext);