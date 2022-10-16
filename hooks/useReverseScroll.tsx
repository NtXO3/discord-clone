import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import * as React from 'react';
import * as i from 'types';

export const useReverseScroll = (ref: React.RefObject<HTMLDivElement>, messages?: QueryDocumentSnapshot<DocumentData>[] | null) => {
  return React.useEffect(() => {
    if (ref?.current) {
      const scrollHeight = ref?.current.scrollHeight;

      ref.current.scrollTop = scrollHeight;
    }
  }, [ref, messages])
}