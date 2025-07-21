'use client';

import React, { useState } from 'react';

interface Props {
  children: React.ReactNode;
}

const Providers: React.FC<Props> = ({ children }) => {
  const [cart, setCart] = useState({});

  return <div>
    {children}
    </div>;
};

export default Providers;
