export default function createUploadToken() {
  const random = () => Math.round(Math.random() * 9)

  let timestamp = new Date().getTime().toString()
  const ran = random()

  let selectedNumber = parseInt(timestamp[ran])
  selectedNumber += ran
  if (selectedNumber > 9) selectedNumber -= 9
  timestamp = timestamp.split('').splice(ran, 1, selectedNumber.toString()).join('')

  return btoa(ran + btoa(timestamp))
}