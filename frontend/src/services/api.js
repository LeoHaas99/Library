import axios from 'axios'
import router from '../router/index'

class API {
    static URL = import.meta.env.VITE_API_URL + '/api/v1/'
    static IMAGE_URL = import.meta.env.VITE_API_URL + '/'
    constructor() { }

    static getAuthorizationHeaders() {
        let accessToken = localStorage.getItem('accessToken')
        let headers = {}
        if (accessToken) headers = {
            headers: { Authorization: `Bearer ${accessToken}` }
        }

        return headers
    }

    static get(url, params) {
        return new Promise((resolve, reject) => {
            // get header
            let headers = API.getAuthorizationHeaders()
            if (params) headers.params = params

            axios.get(`${API.URL}${url}`, headers)
                .then(res => resolve(res.data))
                .catch(err => {
                    if (err.response.data.message == 'INSUFFICIENT_PERMISSION')
                        reject(err)
                    else if (err.response.status === 401) {
                        // access token expired, request new one
                        const refreshToken = localStorage.getItem('refreshToken')

                        axios.post(`${API.URL}auth/token`, { refreshToken }, headers)
                            .then(res => {
                                localStorage.setItem('accessToken', res.data.data.accessToken)
                                localStorage.setItem('refreshToken', res.data.data.refreshToken)

                                headers.headers.Authorization = `Bearer ${res.data.data.accessToken}`

                                axios.get(`${API.URL}${url}`, headers)
                                    .then(res => resolve(res.data))
                                    .catch(err => reject(err))
                            }).catch(_err => {
                                // invalid refresh token
                                localStorage.removeItem('accessToken')
                                localStorage.removeItem('refreshToken')

                                // redirect to login
                                router.push('/login')
                            })
                    } else if (err.response.status === 403) {
                        // invalid access token
                        localStorage.removeItem('accessToken')
                        localStorage.removeItem('refreshToken')

                        router.push('/login?error=1')
                    } else {
                        reject(err.response)
                    }
                })
        })
    }

    static put(url, params) {
        return new Promise((resolve, reject) => {
            // get header
            let headers = API.getAuthorizationHeaders()

            axios.put(`${API.URL}${url}`, params, headers)
                .then(res => resolve(res.data.data))
                .catch(err => {
                    if (err.response.data.message == 'INSUFFICIENT_PERMISSION')
                        reject(err.response)
                    else if (err.response.status === 401) {
                        // access token expired, request new one
                        const refreshToken = localStorage.getItem('refreshToken')

                        axios.post(`${API.URL}auth/token`, { refreshToken }, headers)
                            .then(res => {
                                localStorage.setItem('accessToken', res.data.data.accessToken)
                                localStorage.setItem('refreshToken', res.data.data.refreshToken)

                                headers.headers.Authorization = `Bearer ${res.data.data.accessToken}`

                                axios.put(`${API.URL}${url}`, params, headers)
                                    .then(res => resolve(res.data.data))
                                    .catch(err => reject(err))
                            }).catch(_err => {
                                // invalid refresh token
                                localStorage.removeItem('accessToken')
                                localStorage.removeItem('refreshToken')

                                // redirect to login
                                router.push('/login')
                            })
                    } else if (err.response.status === 403) {
                        // invalid access token
                        localStorage.removeItem('accessToken')
                        localStorage.removeItem('refreshToken')

                        router.push('/login?error=1')
                    } else {
                        reject(err.response)
                    }
                })
        })
    }

    static post(url, params) {
        return new Promise((resolve, reject) => {
            // get header
            let headers = API.getAuthorizationHeaders()

            axios.post(`${API.URL}${url}`, params, headers)
                .then(res => resolve(res.data.data))
                .catch(err => {
                    if (err.response.data.message == 'INSUFFICIENT_PERMISSION')
                        reject(err)
                    else if (err.response.status === 401) {
                        // access token expired, request new one
                        const refreshToken = localStorage.getItem('refreshToken')

                        axios.post(`${API.URL}auth/token`, { refreshToken }, headers)
                            .then(res => {
                                localStorage.setItem('accessToken', res.data.data.accessToken)
                                localStorage.setItem('refreshToken', res.data.data.refreshToken)

                                headers.headers.Authorization = `Bearer ${res.data.data.accessToken}`

                                axios.post(`${API.URL}${url}`, params, headers)
                                    .then(res => resolve(res.data.data))
                                    .catch(err => reject(err))
                            }).catch(_err => {
                                // invalid refresh token
                                localStorage.removeItem('accessToken')
                                localStorage.removeItem('refreshToken')

                                // redirect to login
                                router.push('/login')
                            })
                    } else if (err.response.status === 403) {
                        // invalid access token
                        localStorage.removeItem('accessToken')
                        localStorage.removeItem('refreshToken')

                        router.push('/login?error=1')
                    } else {
                        reject(err.response)
                    }
                })
        })
    }

    static delete(url, params) {
        return new Promise((resolve, reject) => {
            // get header
            let headers = API.getAuthorizationHeaders()
            if (params) headers.params = params

            axios.delete(`${API.URL}${url}`, headers)
                .then(res => resolve(res.data.data))
                .catch(err => {
                    if (err.response.data.message == 'INSUFFICIENT_PERMISSION')
                        reject(err)
                    else if (err.response.status === 401) {
                        // access token expired, request new one
                        const refreshToken = localStorage.getItem('refreshToken')

                        axios.post(`${API.URL}auth/token`, { refreshToken }, headers)
                            .then(res => {
                                localStorage.setItem('accessToken', res.data.data.accessToken)
                                localStorage.setItem('refreshToken', res.data.data.refreshToken)

                                headers.headers.Authorization = `Bearer ${res.data.data.accessToken}`

                                axios.delete(`${API.URL}${url}`, headers)
                                    .then(res => resolve(res.data.data))
                                    .catch(err => reject(err))
                            }).catch(_err => {
                                // invalid refresh token
                                localStorage.removeItem('accessToken')
                                localStorage.removeItem('refreshToken')

                                // redirect to login
                                router.push('/login')
                            })
                    } else if (err.response.status === 403) {
                        // invalid access token
                        localStorage.removeItem('accessToken')
                        localStorage.removeItem('refreshToken')

                        router.push('/login?error=1')
                    } else {
                        reject(err.response)
                    }
                })
        })
    }

    static checkSession() {
        // redirect if user is already logged in
        let headers = API.getAuthorizationHeaders()

        axios.get(`${API.URL}auth`, headers)
            .then(() => router.push('/'))
            .catch(err => {
                if (err.response.data.message == 'INSUFFICIENT_PERMISSION')
                    reject(err)
                else if (err.response.status === 401) {
                    // access token expired, request new one
                    const refreshToken = localStorage.getItem('refreshToken')

                    axios.post(`${import.meta.env.VITE_API_URL}/auth/token`, { refreshToken }, headers)
                        .then(res => {
                            localStorage.setItem('accessToken', res.data.data.accessToken)
                            localStorage.setItem('refreshToken', res.data.data.refreshToken)
                            router.push('/')
                        }).catch(_err => {
                            // invalid refresh token
                            localStorage.removeItem('accessToken')
                            localStorage.removeItem('refreshToken')
                        })
                } else {
                    // invalid access token
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('refreshToken')
                }
            })
    }
    static logout() {
        let headers = API.getAuthorizationHeaders()

        // send to backend
        axios.get(`${API.URL}auth/logout`, headers).then(() => {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            setTimeout(() => router.push('/login'), 1500)
        }).catch(err => message.error(LOCALIZATION.GENERAL_ERROR, { closable: true }))
    }


    static checkAdmin() {
        return new Promise((resolve, reject) => {
            // get header
            let headers = API.getAuthorizationHeaders()

            axios.get(`${API.URL}auth`, headers)
                .then(res => resolve(res.data.data))
                .catch(err => {
                    if (err.response.status === 401) {
                        // access token expired, request new one
                        const refreshToken = localStorage.getItem('refreshToken')

                        axios.post(`${API.URL}auth/token`, { refreshToken }, headers)
                            .then(res => {
                                localStorage.setItem('accessToken', res.data.data.accessToken)
                                localStorage.setItem('refreshToken', res.data.data.refreshToken)

                                headers.headers.Authorization = `Bearer ${res.data.data.accessToken}`

                                axios.get(`${API.URL}auth`, headers)
                                    .then(res => resolve(res.data.data))
                                    .catch(err => {
                                        localStorage.removeItem('accessToken')
                                        localStorage.removeItem('refreshToken')

                                        router.push('/login?error=1')
                                    })
                            }).catch(err => {
                                localStorage.removeItem('accessToken')
                                localStorage.removeItem('refreshToken')

                                router.push('/login?error=1')
                            })
                    } else if (err.response.status === 403) {
                        resolve(null)

                    } else {
                        reject(err.response)
                    }
                })
        })
    }

}

export default API