import path from 'path'

class Suffix {
  replace (filePath) {
    const file = path.parse(filePath)
    const newName = file.name + ' [DONE]' + file.ext
    return path.join(file.dir, newName)
  }
}

export default Suffix
