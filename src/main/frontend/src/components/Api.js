export default class Api {
  // Highlander...
  static thereCanBeOnlyOne = null;

  static BASE_URL = "http://localhost:8081";
  // static BASE_URL = "https://s.utleg.gov/billboard";

  static USER_JSON_KEY = "79926B1843F5F86BCC3DE12761245CB9";

  static SENATE_URL = "https://senate.utah.gov/sen/";
  static HOUSE_URL = "https://house.utleg.gov/rep/";

  /**
   * @returns {Api}
   */
  static get() {
    if (this.thereCanBeOnlyOne == null) {
      this.thereCanBeOnlyOne = new Api();
    }
    return this.thereCanBeOnlyOne;
  }

  isAuthenticated() {
    const user = this.getUser();
    if (user != null) {
      return user != null && user.token.length > 0;
    }
    return false;
  }

  login(userName, password) {
    return this.doPost("/auth/login", { userName, password });
  }

  storeUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  logout() {
    //localStorage.clear();
  }

  getUser() {
    const userJson = localStorage.getItem("user");
    if (userJson != null) {
      return JSON.parse(userJson);
    }
    return null;
  }

  doPost(url, data) {
    return fetch(Api.BASE_URL + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.getToken(),
      },
      body: JSON.stringify(data),
    });
  }

  doGet(url) {
    // this was to prevent caching ...
    // if (url.indexOf("?") == -1) {
    //   url += "?xzy=" + Math.random()
    // } else {
    //     url += "&xzy=" + Math.random();
    // }
    return fetch(Api.BASE_URL + url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.getToken(),
      },
    });
  }

  // THIS MAY NOT WORK...
  doUpload(url, data) {
    return fetch(Api.BASE_URL + url, {
      mode: "no-cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.getToken(),
      },
      body: JSON.stringify(data),
    });
  }

  getToken() {
    const user = this.getUser();
    if (user != null && user.token != null) {
      return user.token;
    }
    return "";
  }
}
