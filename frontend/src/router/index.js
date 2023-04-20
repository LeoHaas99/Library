import axios from "axios";
import API from "../services/api";
import { createRouter, createWebHistory } from "vue-router";
import { ref } from "vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/books",
    },
    {
      path: "/books",
      name: "books",
      component: () => import("../views/Books.vue"),
    }
  ],
});

const guard = function (
  to,
  from,
  next
) {
  // check if authorized
  const user = ref(null);
  const accessToken = localStorage.getItem("accessToken");

  let headers = { headers: {} };
  if (accessToken) headers.headers.Authorization = `Bearer ${accessToken}`;

  axios
    .get(`${API.URL}auth`, headers)
    .then((res) => {
      user.value = res.data.data;
      next();
    })
    .catch((err) => {
      if (err.response.status === 401) {
        // access token expired, request new one
        const refreshToken = localStorage.getItem("refreshToken");

        axios
          .post(
            `${API.URL}auth/token`,
            { refreshToken },
            accessToken ? headers : {}
          )
          .then((res) => {
            localStorage.setItem("accessToken", res.data.data.accessToken);
            localStorage.setItem("refreshToken", res.data.data.refreshToken);
            next();
          })
          .catch((_err) => {
            // invalid refresh token
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            next({ name: "login", query: { error: "NOT_LOGGED_IN" } });
          });
      } else {
        // invalid refresh token
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        next({ name: "login", query: { error: "NOT_LOGGED_IN" } });
      }
    });
};
export default router;
