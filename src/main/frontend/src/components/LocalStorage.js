export default class LocalStorage {
  static thereCanBeOnlyOne = null;

  /**
   * @returns {LocalStorage}
   */
  static create() {
    if (this.thereCanBeOnlyOne == null) {
      this.thereCanBeOnlyOne = new LocalStorage();
    }
    return this.thereCanBeOnlyOne;
  }

  store(name, obj) {
    localStorage.setItem(name, JSON.stringify(obj));
  }

  get(name) {
    const obj = localStorage.getItem(name);
    if (obj != null) {
      return JSON.parse(obj);
    }
    return null;
  }

  storeBillMap(billMap) {
    if (billMap != null && billMap.size > 0) {
      localStorage.setItem(
        "billMap",
        JSON.stringify(Array.from(billMap.entries()))
      );
    }
  }

  getBillMap() {
    return new Map(JSON.parse(localStorage.getItem("billMap")));
  }
}
