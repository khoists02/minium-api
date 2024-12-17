declare module 'sequelize-to-json' {
  import { Model, Instance } from 'sequelize';

  type Template = Record<string, string>;

  function s2j(template: Template, instance: Instance<Model<any, any>>): any;

  export default s2j;
}