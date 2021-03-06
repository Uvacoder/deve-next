import { doc, updateDoc } from 'firebase/firestore/lite';
import toast from 'react-hot-toast';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';

import { Category } from '@data-types/categorie.type';

import { formatError } from '@utils/format-string';
import { db } from '@utils/init-firebase';
import { updateItemInsideData } from '@utils/mutate-data';
import { Document } from '@utils/shared-types';

import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

const updateCategory = async (
  categoryId: string | undefined,
  categoryToUpdate: Partial<Document<Category>>
): Promise<Document<Category>[]> => {
  if (!categoryId) {
    throw new Error('This tag does not exist');
  }
  const categoryRef = doc(db, dbKeys.category(categoryId));
  await updateDoc(categoryRef, categoryToUpdate);
  return [];
};

export const useUpdateCategory = (): UseMutationResult<
  Document<Category>[],
  Error,
  { prevCategory: Document<Category>; categoryToUpdate: Partial<Document<Category>> },
  Document<Category>
> => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ prevCategory, categoryToUpdate }) => updateCategory(prevCategory.id, categoryToUpdate),
    {
      onMutate: async ({ prevCategory, categoryToUpdate }) => {
        const newCategory: Document<Category> = { ...prevCategory, ...categoryToUpdate };

        await queryClient.cancelQueries(queryKeys.categories);

        queryClient.setQueryData<Document<Category>[]>(queryKeys.categories, (oldCategories) =>
          updateItemInsideData<Category>(newCategory, oldCategories)
        );

        return prevCategory;
      },
      onError: (err, variables, prevCategory) => {
        toast.error(formatError(err as Error));
        if (prevCategory) {
          queryClient.setQueryData<Document<Category>[]>(queryKeys.categories, (oldCategories) =>
            updateItemInsideData<Category>(prevCategory, oldCategories)
          );
        }
      },
    }
  );
};
