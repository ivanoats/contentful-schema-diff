import { IContentType } from "./model";
import { Writable } from "stream";

import './utils'

export async function writeCreate(newType: IContentType, write: (chunk: string) => Promise<any>): Promise<void> {
  const v = newType.sys.id.camelCase()
  const typeDef = Object.assign({}, newType)
  delete(typeDef.fields)
  delete(typeDef.sys)

  await write(`
  var ${v} = migration.createContentType('${newType.sys.id}', ${typeDef.dump()})
`)

  for (var field of newType.fields) {
    const fieldDef = Object.assign({}, field)
    delete(fieldDef.id)

    await write(`
  ${v}.createField('${field.id}', ${fieldDef.dump()})
`)
  }
}