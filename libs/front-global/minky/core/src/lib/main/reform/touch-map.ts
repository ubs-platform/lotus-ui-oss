export class TouchMap {
  map = new Map<string, boolean>();

  togglePath(value: boolean, path: string) {
    this.map.set(path, value);
  }

  getPathStatus(path: string) {
    return this.map.get(path) || false;
  }
}
