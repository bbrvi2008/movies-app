export default class StorageValue {
  static getValue(valueName, checkActual) {
    const value = localStorage.getItem(valueName);
    if(value === null) return null;

    const json = JSON.parse(value);
    
    const isActual = checkActual(json);
    return isActual ? json : null;
  }

  static setValue(valueName, value) {
    localStorage.setItem(valueName, JSON.stringify(value));
  }

  static storable = (valueProvider, valueName, checkActual = () => true) => {
    return async () => {
      let value = StorageValue.getValue(valueName, checkActual);
      if(value === null) {
        value = await valueProvider();
        StorageValue.setValue(valueName, value);
      }

      return value;
    };
  }
}