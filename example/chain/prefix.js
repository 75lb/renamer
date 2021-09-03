import path from 'path'

class Prefix {
  replace (filePath) {
    const file = path.parse(filePath)
    const newName = file.name + ' [DONE]' + file.ext
    return path.join(file.dir, newName)
  }
}

export default Prefix
