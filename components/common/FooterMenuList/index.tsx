import * as React from 'react';

export const FooterMenuList: React.FC<FooterMenuList> = ({ title, items }) => {

  return (
    <ul className='flex flex-col gap-y-3 flex-1'>
      <li className='text-[#5765f2]'>{title}</li>
      {items.map(item => (
        <li key={`footerItem.${item}`} className="text-white">
          {item}
        </li>
      ))}
    </ul>
  );
};

type FooterMenuList = {
  title: string;
  items: string[];
};
