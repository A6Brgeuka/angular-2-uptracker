export class ProductVariantsModel {
  name: string = null;
  values: string[] = [];
  newName: string = null;

  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}
