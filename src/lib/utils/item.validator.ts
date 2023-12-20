export const validateObject = (
  object: any, keys: string[]
): { keyRequired: string | null } => {
  for (const key of keys) {
    console.log(object[key])

    if (object[key]?.length === 0 || !object[key]) {
      return {
        keyRequired: key
      }
    }
  }

  return {
    keyRequired: null
  }
}
