// components/DocumentTitle.jsx
import { useEffect } from 'react';

const DocumentTitle = ({ title }) => {
  useEffect(() => {
    document.title = title || 'Peluweb';
  }, [title]);

  return null;
};

export default DocumentTitle;