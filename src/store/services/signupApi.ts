import { api } from './api'

export const signupApi = api.injectEndpoints({
  endpoints: builder => ({
    registerUser: builder.mutation({
      query: body => ({
        url: `/signup`,
        method: 'POST',
        body
      })
    })
  })
})

export const { useRegisterUserMutation } = signupApi