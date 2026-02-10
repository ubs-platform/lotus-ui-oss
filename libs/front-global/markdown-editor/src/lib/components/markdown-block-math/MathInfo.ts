export class MathInfo {
  constructor(
    public expression: string,
    public expressionChange: (expression: string) => any,
    public editor: Boolean
  ) {}
}
