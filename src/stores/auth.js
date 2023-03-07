import { defineStore } from "pinia"
import axios from "axios";
import Swal from "sweetalert";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        authUser: null,
        authErrors: [],
        authAutenticated: false
    }),
    getters: {
        user: (state) => state.authUser,
        errors: (state) => state.authErrors,
        autenticated: (state) => state.authAutenticated,
    },
    actions: {

        async handleLogin(data) {
            //  await axios.get("/sanctum/csrf-cookie")
            this.authErrors = [];

            if (await this.isLoggedIn()) {
                this.router.push('/');
                return;
            }

            try {
                const token = await axios.post("/api/login", {
                    email: data.email,
                    password: data.password,
                });

                localStorage.setItem("token", token.data?.token);
                this.authAutenticated = true
                this.router.push("/");

            } catch (error) {

                if (error.response?.status === 422) {
                    this.authErrors = error.response.data.errors;
                } else if (error?.response?.status) {
                    this.showErrorAlert(error?.response?.status);
                } else if (error?.message) {
                    this.showErrorAlert(error?.message);
                } else {
                    this.showErrorAlert(error.response?.status);
                }
            }

        },

        async handleLogout() {
            try {
               
                const token = this.getToken();
                await axios.post("/api/logout", null, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.removeAuthentication();
                this.router.push("/login");

            } catch (error) {
                if (error.response?.status === 401 || error.response?.status === 419) {
                    this.removeAuthentication();
                    this.router.push("/login");
                }
            }
        },

        async getAuthUser() {
            try {
                const token = this.getToken();
                const data = await axios.get("/api/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.authUser = data.data;
                this.authAutenticated = true
            } catch (error) {
                if (error.response?.status === 401 || error.response?.status === 419) {
                    this.removeAuthentication();
                }
            }
        },

        showErrorAlert(status) {
            Swal({
                title: status,
                icon: 'error'
            });
        },

        removeAuthentication() {
            localStorage.removeItem("token");
            this.authAutenticated = false
            this.authUser = null;
        },

        getToken() {
            return localStorage.getItem("token");
        },

        async isLoggedIn() {
            const token = localStorage.getItem('token');
            if (!token) {
                return false;
            }
            await this.getAuthUser();
            return this.authAutenticated;
        }

    }
});