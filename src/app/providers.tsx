'use client';

import React, { useState } from 'react';

interface Props {
  children: React.ReactNode;
}

const Providers: React.FC<Props> = ({ children }) => {

  return <div>
    {children}
    </div>;
};

export default Providers;
