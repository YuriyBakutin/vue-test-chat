export default class Counter {
  private counter_: number = 1

  get counter() {
    return this.counter_++
  }
}
