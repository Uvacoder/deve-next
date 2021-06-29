import { DocumentSnapshot } from '@firebase/firestore-types';

import { Document } from '@libs/types';

export const formatDoc = <Data>(doc: DocumentSnapshot): Document<Data> => ({
  id: doc.id,
  exists: doc.exists,
  ...(doc.data() as Data),
});