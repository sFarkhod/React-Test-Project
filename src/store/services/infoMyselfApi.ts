import { IinfoMyself } from '../../interfaces/IinfoMyself'
import { api } from './api'


export const infoMyself = api.injectEndpoints({
  endpoints: builder => ({
    getInfoMyself: builder.query<IinfoMyself, {params: {}}>({
      query: (params:any) => ({
        url: `/myself`,
        method: 'GET',
        headers: {
          Key: params.Key,
          Sign: params.Sign
        }
      })
    })
  }),
})

export const {
  useGetInfoMyselfQuery,
} = infoMyself