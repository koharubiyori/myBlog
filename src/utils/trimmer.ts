export default function groupTrim<T extends { [key: string]: string }>(values: T): T {
  let obj: any = {}  
  for (let key in values) {
    obj[key] = values[key].trim()
  }

  return obj
}