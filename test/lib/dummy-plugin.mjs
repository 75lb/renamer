class DummyPlugin {
  description () {
    return 'Dummy plugin.'
  }

  optionDefinitions () {
    return [
      {
        name: 'something',
        type: Boolean,
        description: 'Something.'
      }
    ]
  }
  replace (filePath, options, index, files) {
    return `file: ${filePath}, index: ${index}, file count: ${files.length}`
  }
}

export default DummyPlugin
