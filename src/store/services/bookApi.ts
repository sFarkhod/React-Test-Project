import { api } from "./api";

export const bookApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query<any, {params: {}}>({
      query: (params: any) => ({
        url: `/books`,
        method: "GET",
        headers: {
          Key: params.Key,
          Sign: params.Sign,
        },
      }),
    }),
    getSingleBook: builder.query({
      query: (params: any) => ({
        url: `/books/${params.title}`,
        method: "GET",
        headers: {
          Key: params.Key,
          Sign: params.Sign,
        },
      }),
    }),
    postBook: builder.mutation({
      query: (params: any) => ({
        url: "/books",
        method: "POST",
        body: params.body,
        headers: {
          Key: params.Key,
          Sign: params.Sign,
        },
      }),
    }),
    patchBook: builder.mutation({
      query: ({ id, params }) => ({
        url: `/orders/client-update/${id}`,
        method: "PATCH",
        body: params.body,
        headers: {
          Key: params.Key,
          Sign: params.Sign,
        },
      }),
    }),
    deleteBook: builder.mutation({
      query: ({ id, params }) => ({
        url: `/books/${id}`,
        method: "DELETE",
        headers: {
          Key: params.Key,
          Sign: params.Sign,
        },
      }),
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetSingleBookQuery,
  usePostBookMutation,
  usePatchBookMutation,
  useDeleteBookMutation,
} = bookApi;
