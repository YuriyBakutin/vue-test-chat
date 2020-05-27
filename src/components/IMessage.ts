export default interface IMessage {
  id?: number,
  authorNickname: string,
  correspondentNickname: string,
  timestamp: number,
  messageText: string
}
