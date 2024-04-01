export function single<T>(iterable: Iterable<T>): T {
  const iterator = iterable[Symbol.iterator]()
  const { value, done } = iterator.next()

  if (done || iterator.next().done === false) {
    throw new Error('Iterable does not contain exactly one element')
  }

  return value
}
