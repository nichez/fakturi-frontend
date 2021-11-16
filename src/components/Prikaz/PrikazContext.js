import React, { useState, createContext } from 'react';

export const PrikazContext = createContext();

export const PrikazProvider = ({ children }) => {
  const [vidNaPromet, setVidNaPromet] = useState('');
  const [godina, setGodina] = useState(null);
  const [mesec, setMesec] = useState(null);
  const [sitePartneri, setSitePartneri] = useState([]);
  const [partner, setPartner] = useState('');
  const [promet, setPromet] = useState([]);
  const [search, setSearch] = useState('');

  return (
    <PrikazContext.Provider
      value={{
        vidNaPrometValue: [vidNaPromet, setVidNaPromet],
        godinaValue: [godina, setGodina],
        mesecValue: [mesec, setMesec],
        sitePartneriValue: [sitePartneri, setSitePartneri],
        partnerValue: [partner, setPartner],
        prometValue: [promet, setPromet],
        searchValue: [search, setSearch],
      }}
    >
      {children}
    </PrikazContext.Provider>
  );
};
