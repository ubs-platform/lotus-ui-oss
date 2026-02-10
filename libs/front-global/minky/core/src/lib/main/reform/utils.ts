export class ReformUtils {
  static buildPath(...arg0: Array<string | number | null | undefined>) {
    return arg0.filter((a) => a || 0 === a).join('.');
  }

  static getDepthOfPath(name: string): number {
    return name.split('.').length;
  }
}
