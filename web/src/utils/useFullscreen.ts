/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

export default function useFullscreen(elRef: React.RefObject<Element>): [boolean, () => void] {
  const [isFullscreen, setIsFullscreen] = React.useState(document[getBrowserFullscreenElementProp()] != null);

  const setFullscreen = () => {
    if (elRef.current == null) return;

    if (isFullscreen) {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(document[getBrowserFullscreenElementProp()] != null);
        })
        .catch(() => {
          setIsFullscreen(true);
        });
    } else {
      elRef.current
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(document[getBrowserFullscreenElementProp()] != null);
        })
        .catch(() => {
          setIsFullscreen(false);
        });
    }
  };

  React.useLayoutEffect(() => {
    document.onfullscreenchange = () => setIsFullscreen(document[getBrowserFullscreenElementProp()] != null);

    return () => {
      document.onfullscreenchange = null;
      return undefined;
    };
  });

  return [isFullscreen, setFullscreen];
}

function getBrowserFullscreenElementProp() {
  if (typeof document.fullscreenElement !== 'undefined') {
    return 'fullscreenElement';
  } else if (typeof (document as any).mozFullScreenElement !== 'undefined') {
    return 'mozFullScreenElement';
  } else if (typeof (document as any).msFullscreenElement !== 'undefined') {
    return 'msFullscreenElement';
  } else if (typeof (document as any).webkitFullscreenElement !== 'undefined') {
    return 'webkitFullscreenElement';
  } else {
    throw new Error('fullscreenElement is not supported by this browser');
  }
}
