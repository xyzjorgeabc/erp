export class BiMap<KeyType, ValueType> {
  private _keys: Array<KeyType>;
  private _value: Array<ValueType>;
  constructor() {
    this._keys = [];
    this._value = [];
  }
  public deleteByKey(key: KeyType): boolean {
    const index = this._keys.indexOf(key);
    if (~index) {
      this._keys.splice(index, 1);
      this._value.splice(index, 1);
      return true;
    }
    return false;
  }
  public deleteByValue(value: ValueType): boolean {
    const index = this._value.indexOf(value);
    if (~index) {
      this._keys.splice(index, 1);
      this._value.splice(index, 1);
      return true;
    }
    return false;
  }
  public set(key: KeyType, value: ValueType): void {
    this._keys.push(key);
    this._value.push(value);
  }
  public getKey(value: ValueType): KeyType {
    const index = this._value.indexOf(value);
    if (~index) {
      return this._keys[index];
    }
    return null;
  }
  public getValue(key: KeyType): ValueType {
    const index = this._keys.indexOf(key);
    if (~index) {
      return this._value[index];
    }
    return null;
  }
  public getKeys(): Array<KeyType> {
    return this._keys.slice();
  }
  public getValues(): Array<ValueType> {
    return this._value.slice();
  }
  public empty(): void {
    this._value = [];
    this._keys = [];
  }
}
