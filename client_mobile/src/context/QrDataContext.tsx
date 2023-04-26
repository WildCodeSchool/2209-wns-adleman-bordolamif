import React, { createContext, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const QrDataContext = createContext<any>([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function QrDataContextProvider({ children }:any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [qrData, setQrData] = useState<any>({ type: '', data: '' });

  return (
    <QrDataContext.Provider value={qrData}>
      {children}
    </QrDataContext.Provider>
  );
}
export { QrDataContext, QrDataContextProvider };
